/**
 * Deterministic, local-only queueing simulation. All times are simulated seconds.
 * Faults change arrival rate, dependency speed, or routing, never the win rule.
 * A tick admits arrivals at its start and finishes work at its end. Completion
 * exactly on the end-to-end deadline succeeds. Fault actions take effect at the
 * current tick boundary, making actions directly replayable on a fresh state.
 */
export const STEP = 0.25;
export const LIMITS = Object.freeze({
  pool: 12,
  queue: 96,
  deadline: 4,
  window: 5,
  hold: 8,
  round: 120,
});

export const FAULTS = Object.freeze([
  Object.freeze({ id: 'traffic', label: 'Traffic burst', description: 'Raise incoming originals from 2 to 16 requests/second.', node: 0 }),
  Object.freeze({ id: 'latency', label: 'Slow dependency', description: 'The shared dependency takes three times as long while holding a connection.', node: 6 }),
  Object.freeze({ id: 'relay', label: 'Primary route offline', description: 'Immediately reroute existing and new work through the independent backup route.', node: 1 }),
  Object.freeze({ id: 'compute', label: 'Primary worker offline', description: 'Immediately move existing and new work to the independent backup worker.', node: 2 }),
]);

const SERVICE = 0.5;
const EPSILON = 1e-9;
const TIMEOUT = 1;
const RETRIES = 2;
const PROTECTED_WAITING = 6;
const RETRY_TOKENS = 2;
const FAULT_IDS = new Set(FAULTS.map(({ id }) => id));

/**
 * `patched: true` and `patched: 'protected'` select the protected policy.
 * Goodput counts unique successes among originals whose deadlines fall in
 * (time - window, time], including rejected originals; an empty cohort is 100%.
 * Latency is nearest-rank p95 for unique, on-time completions in that same
 * trailing time window (by completion time, not cohort membership).
 * Counters are cumulative: expired includes shed, and completed + expired +
 * pending = offered. No request or attempt history grows with elapsed time;
 * only the externally supplied action journal is retained without truncation.
 */
export function createSimulation({ patched = false } = {}) {
  return {
    time: 0,
    faults: [],
    won: false,
    badFor: 0,
    patched: patched === true || patched === 'protected',
    actions: [],
    events: [],
    metrics: {
      goodput: 100, latency: null, pool: 0, queue: 0, retries: 0,
      offered: 0, completed: 0, expired: 0, shed: 0, matured: 0,
    },
    _requests: new Map(),
    _queue: [],
    _running: [],
    _completions: [],
    _seenEvents: new Set(),
    _arrivalCredit: 0,
    _retryTokens: RETRY_TOKENS,
    _route: 'primary',
    _worker: 'primary',
  };
}

function event(state, key, text) {
  // Both the log and its deduplication index are bounded; report first causes,
  // not one message per request or a stream of repeated symptom notifications.
  if (state.events.length >= 20 || state._seenEvents.has(key)) return;
  state._seenEvents.add(key);
  state.events.push({ time: state.time, text });
}

/** Mutates state. Unknown IDs, non-booleans, a third fault, and post-win edits fail.
 * Idempotent valid calls succeed without adding a redundant replay action.
 * The action journal is intentionally retained in full (user input, not workload).
 */
export function setFault(state, id, enabled) {
  if (!FAULT_IDS.has(id) || typeof enabled !== 'boolean' || state.won) return false;
  const present = state.faults.includes(id);
  if (present === enabled) return true;
  if (enabled && state.faults.length >= 2) return false;
  state.faults = enabled
    ? [...state.faults, id].sort()
    : state.faults.filter((fault) => fault !== id);
  state.actions.push({ time: state.time, id, enabled });
  state._route = state.faults.includes('relay') ? 'backup' : 'primary';
  state._worker = state.faults.includes('compute') ? 'backup' : 'primary';
  // Independent backups have equal capacity. Failover transfers in-flight work
  // without restarting it, even when BOTH primary route and worker are offline.
  for (const attempt of [...state._running, ...state._queue]) {
    attempt.route = state._route;
    attempt.worker = state._worker;
  }
  const effect = id === 'relay' || id === 'compute'
    ? (enabled ? ' — in-flight work transferred to backup' : ' — primary restored')
    : '';
  event(state, `${id}:${enabled}`, `${id} ${enabled ? 'enabled' : 'removed'}${effect}`);
  return true;
}

function serviceTime(state) {
  return state.faults.includes('latency') ? SERVICE * 3 : SERVICE;
}

function enqueue(state, request, retry = false) {
  if (state._queue.length >= LIMITS.queue) return false;
  state._queue.push({
    requestId: request.id,
    remaining: SERVICE,
    route: state._route,
    worker: state._worker,
  });
  request.outstanding += 1;
  if (retry) {
    state.metrics.retries += 1;
    event(state, 'retry', state.patched
      ? 'Protected timeout replaced a queued attempt within the global retry budget.'
      : 'Attempt timeout created a retry; original work is not cancelled.');
  }
  return true;
}

function fail(state, request, shed = false) {
  if (request.status !== 'pending') return;
  request.status = 'failed';
  state.metrics.expired += 1;
  if (shed) state.metrics.shed += 1;
  event(state, shed ? 'shed' : 'deadline', shed
    ? 'Admission rejected an original; it still counts against offered-request goodput.'
    : 'An original missed its end-to-end deadline.');
}

function admit(state) {
  state._arrivalCredit += (state.faults.includes('traffic') ? 16 : 2) * STEP;
  while (state._arrivalCredit >= 1) {
    state._arrivalCredit -= 1;
    const request = {
      id: ++state.metrics.offered,
      born: state.time,
      deadline: state.time + LIMITS.deadline,
      nextRetry: state.time + TIMEOUT,
      retryChecks: 0,
      outstanding: 0,
      status: 'pending',
    };
    state._requests.set(request.id, request);
    const load = state._running.length + state._queue.length;
    const predicted = (Math.floor(load / LIMITS.pool) + 1) * serviceTime(state);
    if (state.patched && (load >= LIMITS.pool + PROTECTED_WAITING || predicted > LIMITS.deadline)) {
      event(state, 'protected-admission', 'Protected admission limits waiting work and rejects requests that cannot meet their deadline.');
      fail(state, request, true);
    } else if (!enqueue(state, request)) {
      fail(state, request, true);
    }
  }
}

function cancel(state, predicate) {
  let cancelled = false;
  const keep = (attempt) => {
    if (!predicate(attempt)) return true;
    state._requests.get(attempt.requestId).outstanding -= 1;
    cancelled = true;
    return false;
  };
  state._queue = state._queue.filter(keep);
  state._running = state._running.filter(keep);
  if (cancelled) event(state, 'cancel', 'Protected cancellation releases work for settled requests or attempts with no deadline budget.');
}

function retry(state) {
  for (const request of state._requests.values()) {
    const maxRetries = state.patched ? 1 : RETRIES;
    if (request.status !== 'pending' || request.retryChecks >= maxRetries || request.nextRetry > state.time) continue;
    request.nextRetry += TIMEOUT;
    if (state.patched) {
      // Never race a still-running attempt. Queued timeout replacements require
      // deadline budget AND a global token (capacity 2, refill 1 per second).
      if (state._running.some((attempt) => attempt.requestId === request.id)) continue;
      if (request.deadline - state.time < serviceTime(state) + STEP || state._retryTokens < 1) continue;
      cancel(state, (attempt) => attempt.requestId === request.id);
      state._retryTokens -= 1;
    }
    request.retryChecks += 1; // Failed retry admissions also exhaust the budget.
    enqueue(state, request, true);
  }
}

function updateMetrics(state) {
  const cutoff = state.time - LIMITS.window;
  let matured = 0;
  let successful = 0;
  for (const [id, request] of state._requests) {
    if (request.deadline <= state.time && request.deadline > cutoff) {
      matured += 1;
      if (request.status === 'success') successful += 1;
    }
    // Retain old logical requests only while an uncancelled attempt references
    // them. Thus workload storage is bounded by the cohort plus queue + pool.
    if (request.deadline <= cutoff && request.outstanding === 0) state._requests.delete(id);
  }
  state._completions = state._completions.filter(({ time }) => time > cutoff);
  const latencies = state._completions.map(({ latency }) => latency).sort((a, b) => a - b);
  Object.assign(state.metrics, {
    goodput: matured ? 100 * successful / matured : 100,
    latency: latencies.length ? latencies[Math.ceil(latencies.length * 0.95) - 1] : null,
    pool: state._running.length,
    queue: state._queue.length,
    matured,
  });
  if (matured && state.metrics.goodput < 20) {
    if (!state.badFor) event(state, 'bad-cohort', 'Fewer than 20% of the matured 5-second cohort met their deadline.');
    state.badFor += STEP;
  } else {
    if (state.badFor) event(state, 'recovery', 'Matured-cohort goodput recovered; the consecutive outage timer reset.');
    state.badFor = 0;
  }
  if (state.badFor >= LIMITS.hold) {
    state.won = true;
    event(state, 'won', 'Deadline goodput stayed below 20% for 8 consecutive simulated seconds.');
  }
}

/** No clock, randomness, I/O, or 120-second stop: the UI owns the round limit. */
export function stepSimulation(state) {
  if (state.won) return state;
  state._retryTokens = Math.min(RETRY_TOKENS, state._retryTokens + STEP);
  admit(state);
  retry(state);
  if (state.patched) {
    const speed = SERVICE / serviceTime(state);
    cancel(state, (attempt) => {
      const request = state._requests.get(attempt.requestId);
      return request.status !== 'pending' || attempt.remaining / speed > request.deadline - state.time + EPSILON;
    });
  }
  while (state._running.length < LIMITS.pool && state._queue.length) {
    state._running.push(state._queue.shift());
  }
  if (state._running.length === LIMITS.pool) event(state, 'pool', 'All shared connections are occupied.');
  if (state._queue.length) event(state, 'queue', 'Attempts are waiting for a shared connection; their deadline clocks keep running.');

  const work = STEP * SERVICE / serviceTime(state);
  state.time += STEP;
  state._running = state._running.filter((attempt) => {
    attempt.remaining = Math.max(0, attempt.remaining - work);
    // Six slow ticks should equal one service, despite binary 1/12 rounding.
    if (attempt.remaining > EPSILON) return true;
    const request = state._requests.get(attempt.requestId);
    request.outstanding -= 1;
    if (request.status === 'pending' && state.time <= request.deadline) {
      request.status = 'success';
      state.metrics.completed += 1;
      state._completions.push({ time: state.time, latency: state.time - request.born });
    }
    return false;
  });
  for (const request of state._requests.values()) {
    if (request.deadline <= state.time) fail(state, request);
  }
  if (state.patched) cancel(state, (attempt) => state._requests.get(attempt.requestId).status !== 'pending');
  updateMetrics(state);
  return state;
}