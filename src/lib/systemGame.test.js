import test from 'node:test';
import assert from 'node:assert/strict';
import { STEP, LIMITS, FAULTS, createSimulation, setFault, stepSimulation } from './systemGame.js';

const IDS = FAULTS.map(({ id }) => id);
const PAIRS = IDS.flatMap((id, index) => IDS.slice(index + 1).map((other) => [id, other]));

function run(state, until, observe = () => {}) {
  while (state.time < until && !state.won) {
    const before = state.time;
    assert.equal(stepSimulation(state), state);
    assert.equal(state.time, before + STEP);
    observe(state);
  }
  return state;
}

function withFaults(ids, patched = false) {
  const state = createSimulation({ patched });
  for (const id of ids) assert.equal(setFault(state, id, true), true);
  return state;
}

function invariants(state) {
  const m = state.metrics;
  assert.ok(m.goodput >= 0 && m.goodput <= 100);
  assert.ok(m.latency === null || (m.latency >= STEP && m.latency <= LIMITS.deadline));
  for (const key of ['pool', 'queue', 'retries', 'offered', 'completed', 'expired', 'shed', 'matured']) {
    assert.ok(Number.isSafeInteger(m[key]) && m[key] >= 0, key);
  }
  assert.ok(m.pool <= LIMITS.pool);
  assert.ok(m.queue <= LIMITS.queue);
  assert.ok(m.shed <= m.expired);
  assert.ok(m.retries <= m.offered * (state.patched ? 1 : 2));
  const pending = [...state._requests.values()].filter(({ status }) => status === 'pending').length;
  assert.equal(m.completed + m.expired + pending, m.offered);
  assert.ok(m.matured <= 16 * LIMITS.window);
  assert.ok(state.events.length <= 20);
  assert.ok(state._seenEvents.size <= 20);
  assert.ok(state._requests.size <= 16 * (LIMITS.deadline + LIMITS.window) + LIMITS.pool + LIMITS.queue);
  assert.ok(state._completions.length <= 16 * (LIMITS.deadline + LIMITS.window));
  const references = new Map();
  for (const attempt of [...state._running, ...state._queue]) {
    assert.ok(state._requests.has(attempt.requestId));
    assert.ok(attempt.remaining > 0 && attempt.remaining <= 0.5);
    references.set(attempt.requestId, (references.get(attempt.requestId) || 0) + 1);
  }
  for (const request of state._requests.values()) {
    assert.equal(request.outstanding, references.get(request.id) || 0);
  }
}

test('stable public API and independent protected aliases', () => {
  assert.equal(STEP, 0.25);
  assert.deepEqual(Object.keys(LIMITS).sort(), ['deadline', 'hold', 'pool', 'queue', 'round', 'window']);
  assert.deepEqual(FAULTS.map(({ id, node }) => [id, node]), [['traffic', 0], ['latency', 6], ['relay', 1], ['compute', 2]]);
  assert.ok(FAULTS.every(({ label, description }) => label && description));
  assert.equal(createSimulation().metrics.latency, null);
  assert.equal(createSimulation({ patched: 'protected' }).patched, true);
  assert.equal(createSimulation({ patched: true }).patched, true);
});

test('baseline survives 120 seconds with all matured originals completed', () => {
  const state = run(createSimulation(), LIMITS.round, invariants);
  assert.equal(state.time, 120);
  assert.equal(state.won, false);
  assert.equal(state.badFor, 0);
  assert.equal(state.metrics.goodput, 100);
  assert.equal(state.metrics.retries, 0);
  assert.equal(state.metrics.expired, 0);
  assert.equal(state.metrics.latency, 0.5);
});

for (const id of IDS) {
  test(`single fault ${id} survives 120 seconds`, () => {
    const state = run(withFaults([id]), LIMITS.round, invariants);
    assert.equal(state.time, 120);
    assert.equal(state.won, false);
    assert.equal(state.metrics.goodput, 100);
    assert.equal(state.metrics.expired, 0);
    if (id === 'latency') {
      assert.ok(state.metrics.retries > 0);
      assert.equal(state.metrics.latency, 1.5);
    }
  });
}

for (const pair of PAIRS) {
  test(`valid pair ${pair.join(' + ')} uses measured deadline goodput`, (t) => {
    let lowSince = null;
    const state = run(withFaults(pair), LIMITS.round, (current) => {
      invariants(current);
      if (current.metrics.matured && current.metrics.goodput < 20) {
        lowSince ??= current.time;
      } else {
        lowSince = null;
      }
      assert.equal(current.badFor, lowSince === null ? 0 : current.time - lowSince + STEP);
      assert.equal(current.won, current.badFor >= LIMITS.hold);
    });
    if (pair.includes('traffic') && pair.includes('latency')) {
      assert.equal(state.won, true);
      assert.ok(state.time < LIMITS.round);
      assert.ok(state.metrics.retries > 0);
      assert.ok(state.metrics.queue > 0);
      assert.ok(state.metrics.goodput < 20);
      assert.equal(state.badFor, 8);
    } else {
      assert.equal(state.time, 120);
      assert.equal(state.won, false);
      assert.equal(state.metrics.goodput, 100);
    }
    t.diagnostic(JSON.stringify({ pair, time: state.time, lowSince, ...state.metrics }));
  });
}

// Exercise changing routes, removal, and staggered faults, not a final snapshot.
const SCHEDULE = [
  { time: 1, id: 'relay', enabled: true },
  { time: 2, id: 'compute', enabled: true },
  { time: 3, id: 'relay', enabled: false },
  { time: 4, id: 'traffic', enabled: true },
  { time: 6, id: 'compute', enabled: false },
  { time: 7, id: 'latency', enabled: true },
];

function replay(actions, patched = false, until = LIMITS.round) {
  const state = createSimulation({ patched });
  let action = 0;
  while (state.time < until && !state.won) {
    while (action < actions.length && actions[action].time === state.time) {
      const { id, enabled } = actions[action++];
      assert.equal(setFault(state, id, enabled), true);
    }
    stepSimulation(state);
    invariants(state);
  }
  return state;
}

test('same discrete action schedule reproduces the entire state deterministically', () => {
  const first = replay(SCHEDULE);
  const second = replay(first.actions);
  assert.deepEqual(first.actions, SCHEDULE);
  assert.deepEqual(second, first);
  assert.equal(first.won, true);
});

test('protected replay preserves actions, materially improves goodput, and never holds an outage', (t) => {
  const original = replay(SCHEDULE);
  const protectedAtSameTime = replay(original.actions, 'protected', original.time);
  const protectedFull = replay(original.actions, true);
  assert.deepEqual(protectedFull.actions, original.actions);
  assert.equal(protectedFull.time, 120);
  assert.equal(protectedFull.won, false);
  assert.equal(protectedFull.badFor, 0);
  assert.ok(protectedAtSameTime.metrics.goodput >= original.metrics.goodput + 30);
  assert.ok(protectedFull.metrics.goodput >= 40);
  assert.ok(protectedFull.metrics.shed > 0);
  assert.ok(protectedAtSameTime.metrics.retries < original.metrics.retries);
  t.diagnostic(JSON.stringify({ originalTime: original.time, original: original.metrics, protectedAtSameTime: protectedAtSameTime.metrics, protected120: protectedFull.metrics }));
});

test('unknown/third faults rejected without mutation; removal and replacement allowed', () => {
  const state = withFaults(['relay', 'compute']);
  const snapshot = structuredClone(state);
  assert.equal(setFault(state, 'traffic', true), false);
  assert.equal(setFault(state, 'missing', false), false);
  assert.equal(setFault(state, 'relay', 'false'), false);
  assert.deepEqual(state, snapshot);
  assert.equal(setFault(state, 'relay', true), true);
  assert.deepEqual(state, snapshot);
  run(state, 1.25);
  assert.equal(setFault(state, 'relay', false), true);
  assert.equal(setFault(state, 'traffic', true), true);
  assert.deepEqual(state.actions.slice(-2), [
    { time: 1.25, id: 'relay', enabled: false },
    { time: 1.25, id: 'traffic', enabled: true },
  ]);
});

test('both offline primaries transfer queued/running work immediately to independent backups', () => {
  const state = run(createSimulation(), 0.5);
  assert.ok(state._running.length > 0);
  const workBefore = state._running.map(({ remaining }) => remaining);
  setFault(state, 'relay', true);
  setFault(state, 'compute', true);
  assert.deepEqual(state._running.map(({ remaining }) => remaining), workBefore);
  assert.ok(state._running.every(({ route, worker }) => route === 'backup' && worker === 'backup'));
  run(state, 120, invariants);
  assert.equal(state.metrics.goodput, 100);
  assert.equal(state.metrics.expired, 0);
});

test('bounded workload state beyond the UI round with repeated fault changes and in protected overload', () => {
  const state = createSimulation();
  for (let cycle = 0; cycle < 20; cycle += 1) {
    setFault(state, 'traffic', true);
    setFault(state, 'latency', true);
    run(state, state.time + 2, invariants);
    setFault(state, 'traffic', false);
    setFault(state, 'latency', false);
    run(state, state.time + 20, invariants);
    assert.equal(state.won, false);
  }
  assert.equal(state.time, 440);
  assert.equal(state.actions.length, 80); // Replay input journal is deliberately not truncated.
  const protectedState = run(withFaults(['traffic', 'latency'], true), 600, invariants);
  assert.equal(protectedState.time, 600);
  assert.ok(protectedState.metrics.goodput >= 40);
});

test('reset creates independent mutable collections and default policy', () => {
  const first = run(withFaults(['latency'], true), 8);
  const before = structuredClone(first);
  const reset = createSimulation();
  for (const key of ['faults', 'actions', 'events', 'metrics', '_requests', '_queue', '_running', '_completions', '_seenEvents']) {
    assert.notEqual(first[key], reset[key]);
  }
  run(reset, 10);
  assert.deepEqual(first, before);
  assert.equal(reset.patched, false);
  assert.equal(reset.metrics.expired, 0);
});

test('removing faults before a latched outage lets the real backlog and matured cohort recover', (t) => {
  const state = run(withFaults(['traffic', 'latency']), 8);
  assert.ok(state.metrics.queue > 0);
  assert.ok(state.metrics.retries > 0);
  setFault(state, 'traffic', false);
  setFault(state, 'latency', false);
  let recovered = null;
  let timerReset = null;
  let maxBad = 0;
  run(state, 40, (current) => {
    invariants(current);
    maxBad = Math.max(maxBad, current.badFor);
    if (maxBad && current.badFor === 0) timerReset ??= current.time;
    if (timerReset && current.metrics.goodput === 100 && current.metrics.queue === 0) recovered ??= current.time;
  });
  assert.ok(maxBad > 0 && maxBad < LIMITS.hold);
  assert.ok(timerReset !== null && recovered !== null);
  assert.equal(state.won, false);
  assert.equal(state.time, 40);
  assert.equal(state.metrics.goodput, 100);
  assert.equal(state.metrics.queue, 0);
  assert.equal(state.badFor, 0);
  t.diagnostic(`Removed at 8s; max badFor ${maxBad}s; timer reset ${timerReset}s; 100% goodput by ${recovered}s`);
});

test('successful originals count once; timed-out duplicate work is not cancelled', () => {
  const state = run(withFaults(['latency']), 1.75);
  const first = [...state._requests.values()][0];
  assert.equal(first.status, 'success');
  assert.equal(first.outstanding, 1);
  assert.ok(state._running.some(({ requestId }) => requestId === first.id));
  run(state, 30, invariants);
  assert.ok(state.metrics.retries > 0);
  assert.equal(state.metrics.expired, 0);
  assert.equal(state.metrics.goodput, 100);
});

test('unprotected expired work retains connections while protected settled work never does', () => {
  const state = run(withFaults(['traffic', 'latency']), 8, invariants);
  assert.ok([...state._running, ...state._queue].some(({ requestId }) => state._requests.get(requestId).status === 'failed'));
  run(withFaults(['traffic', 'latency'], true), 120, (current) => {
    invariants(current);
    assert.ok([...current._running, ...current._queue].every(({ requestId }) => current._requests.get(requestId).status === 'pending'));
  });
});

test('cohort uses original deadlines, includes admission failures, and p95 uses recent unique completions', () => {
  const state = withFaults(['traffic', 'latency']);
  run(state, LIMITS.deadline - STEP);
  assert.equal(state.metrics.matured, 0);
  assert.equal(state.metrics.goodput, 100);
  run(state, LIMITS.deadline);
  assert.equal(state.metrics.matured, 4);
  run(state, 10, (current) => {
    const cohort = [...current._requests.values()].filter(({ deadline }) => deadline <= current.time && deadline > current.time - LIMITS.window);
    const successes = cohort.filter(({ status }) => status === 'success').length;
    assert.equal(current.metrics.matured, cohort.length);
    assert.equal(current.metrics.goodput, 100 * successes / cohort.length);
    const latencies = current._completions.map(({ latency }) => latency).sort((a, b) => a - b);
    assert.equal(current.metrics.latency, latencies.length ? latencies[Math.ceil(0.95 * latencies.length) - 1] : null);
  });
  assert.ok(state.metrics.shed > 0);
});

test('win is latched, stops time and mutations, and empty recent completions give null latency', () => {
  const state = run(withFaults(['traffic', 'latency']), 120);
  assert.equal(state.won, true);
  assert.equal(state.metrics.latency, null);
  const before = structuredClone(state);
  assert.equal(stepSimulation(state), state);
  assert.equal(setFault(state, 'traffic', false), false);
  assert.deepEqual(state, before);
});

test('first-cause event log has bounded unique keys, nondecreasing simulated timestamps, and causal order', () => {
  const state = replay(SCHEDULE);
  assert.ok(state.events.length <= 20);
  assert.equal(state.events.length, state._seenEvents.size);
  assert.ok(state.events.every(({ time, text }, i) => text && time <= state.time && (!i || time >= state.events[i - 1].time)));
  const pool = state.events.findIndex(({ text }) => text.includes('All shared connections'));
  const cohort = state.events.findIndex(({ text }) => text.includes('Fewer than 20%'));
  const win = state.events.findIndex(({ text }) => text.includes('8 consecutive'));
  assert.ok(pool >= 0 && cohort > pool && win > cohort);
});

for (const pair of PAIRS) {
  test(`protected pair ${pair.join(' + ')} survives every tick through 120 seconds`, () => {
    const state = run(withFaults(pair, true), 120, (current) => {
      invariants(current);
      assert.equal(current.badFor, 0);
      assert.ok(current.metrics.retries <= 2 + current.time);
    });
    assert.equal(state.time, 120);
    assert.equal(state.won, false);
    assert.ok(state.metrics.goodput >= 40);
  });
}

test('deadline-boundary completion succeeds in both policies despite floating-point work rounding', () => {
  for (const patched of [false, true]) {
    const state = withFaults(['latency'], patched);
    // Seed a single real in-flight attempt needing exactly one more slow tick.
    state.time = LIMITS.deadline - STEP;
    state.metrics.offered = 1;
    state._requests.set(1, { id: 1, born: 0, deadline: LIMITS.deadline, nextRetry: 1, retryChecks: 2, outstanding: 1, status: 'pending' });
    state._running.push({ requestId: 1, remaining: 1 / 12 + Number.EPSILON, route: 'primary', worker: 'primary' });
    stepSimulation(state);
    assert.equal(state.metrics.completed, 1);
    assert.equal(state.metrics.expired, 0);
    assert.equal(state.metrics.latency, LIMITS.deadline);
    assert.equal(state.metrics.goodput, 100);
    invariants(state);
  }
});

test('exactly 20% and empty matured cohorts reset the timer in either policy', () => {
  for (const patched of [false, true]) {
    const state = createSimulation({ patched });
    state.time = LIMITS.deadline;
    state.badFor = LIMITS.hold - STEP;
    // A synthetic settled cohort isolates the threshold from queue behavior.
    for (let id = 1; id <= 5; id += 1) {
      state._requests.set(id, { id, born: 0, deadline: LIMITS.deadline, nextRetry: 1, retryChecks: 0, outstanding: 0, status: id === 1 ? 'success' : 'failed' });
    }
    Object.assign(state.metrics, { offered: 5, completed: 1, expired: 4 });
    stepSimulation(state);
    assert.equal(state.metrics.goodput, 20);
    assert.equal(state.badFor, 0);
    assert.equal(state.won, false);
    state._requests.clear();
    state.badFor = LIMITS.hold - STEP;
    stepSimulation(state);
    assert.equal(state.metrics.matured, 0);
    assert.equal(state.metrics.goodput, 100);
    assert.equal(state.badFor, 0);
    assert.equal(state.won, false);
    invariants(state);
  }
});

test('protected mode has no hardcoded immunity if actual offered work really overwhelms it', () => {
  const state = createSimulation({ patched: true });
  // Adversarial harness exceeds the catalog's maximum rate. Still uses actual
  // original admission, attempts, deadlines and cohorts, not fabricated metrics.
  while (state.time < 30 && !state.won) {
    state._arrivalCredit += 64;
    stepSimulation(state);
    assert.ok(state.metrics.pool <= LIMITS.pool);
    assert.ok(state.metrics.queue <= LIMITS.queue);
  }
  assert.equal(state.won, true);
  assert.equal(state.badFor, LIMITS.hold);
  assert.ok(state.metrics.goodput < 20);
  assert.deepEqual(state.faults, []);
});