import { FAULTS, LIMITS } from "../lib/systemGame";

const names = ["Input", "Relay", "Compute", "Output", "Standby", "Buffer", "Shared connection pool"];
const explanations = [
  "Original requests arrive at 2/s. Every request has a 4-second end-to-end deadline. You control demand, not the output switch.",
  "The primary route forwards work to Compute. If it disappears, work transfers immediately to Buffer → Standby at the same capacity.",
  "Primary worker. Timeout: 1 second. Up to two retries. A timed-out attempt keeps running. Dependency: pool/shared-01.",
  "Counts unique originals completed before their deadline—not retries or late responses. This endpoint cannot be switched off.",
  "Independent backup worker, equal capacity. Same timeout and retry policy as Compute. Dependency: pool/shared-01.",
  "A bounded FIFO for attempts waiting on a connection. Waiting consumes the original request’s deadline. Retries join the same queue.",
  "pool/shared-01 · 12 connections, used by BOTH workers. Each attempt holds one until its work finishes. Normal service time: 0.5 seconds.",
];

export function SystemGamePanel({ controller, selected, onSelect, telemetry, onTelemetry, panelId }) {
  const { game, toggleFault, replay, start, comparison } = controller;
  const { phase, metrics, faults } = game;
  const node = selected ?? 0;
  const ended = ["broken", "patched", "patch-failed", "survived"].includes(phase);
  const availableFaults = FAULTS.filter((fault) => fault.node === node);

  return (
    <section className="system-game" id={panelId} aria-label="Break the system challenge">
      <div className="game-brief">
        <span className="game-kicker">The challenge / two faults. one weak assumption.</span>
        <p>Keep deadline goodput below <strong>20% for 8 consecutive seconds.</strong> You have 120 simulated seconds. Inspect a node. Choose your faults.</p>
      </div>

      <dl className="game-metrics" aria-label="Live simulation metrics">
        <div><dt>Deadline goodput</dt><dd>{metrics.matured ? `${Math.round(metrics.goodput)}%` : "Warming up"}</dd></div>
        <div><dt>Latency · p95</dt><dd>{metrics.latency === null ? "—" : `${metrics.latency.toFixed(2)}s`}</dd></div>
        <div><dt>Fault budget</dt><dd>{faults.length}<small> / 2</small></dd></div>
      </dl>
      <div className="game-outage">
        <div><span>{phase === "replaying" ? "Protected replay · 2×" : `Elapsed ${game.time.toFixed(1)} / ${LIMITS.round}s`}</span><span>Outage {game.badFor.toFixed(1)} / {LIMITS.hold}s</span></div>
        <progress aria-label="Consecutive outage duration" max={LIMITS.hold} value={game.badFor} />
      </div>

      {faults.length > 0 && (
        <div className="game-active-faults" aria-label="Active faults">
          {faults.map((id) => (
            <button key={id} type="button" disabled={phase !== "playing"} onClick={() => toggleFault(id)} aria-label={`Remove ${FAULTS.find((fault) => fault.id === id).label}`}>
              {FAULTS.find((fault) => fault.id === id).label}<span aria-hidden="true"> ×</span>
            </button>
          ))}
        </div>
      )}

      {!ended && (
        <div className="game-inspector">
          <div className="game-inspector-heading"><span className="game-kicker">Inspect / {String(node + 1).padStart(2, "0")}</span><strong>{names[node]}</strong></div>
          <p>{explanations[node]}</p>
          {(node === 2 || node === 4) && <button className="game-inline-link" type="button" onClick={() => onSelect(6)}>Inspect pool/shared-01 <span aria-hidden="true">↗</span></button>}
          {node === 5 && <p className="game-mono">Waiting: {metrics.queue} / {LIMITS.queue} attempts</p>}
          {node === 6 && <div className="game-pool" aria-label={`${metrics.pool} of ${LIMITS.pool} connections occupied`}>{Array.from({ length: LIMITS.pool }, (_, i) => <i key={i} className={i < metrics.pool ? "is-occupied" : ""} />)}</div>}
          {availableFaults.map((fault) => {
            const enabled = faults.includes(fault.id);
            return (
              <button key={fault.id} className="game-fault-button" type="button" aria-pressed={enabled} disabled={phase !== "playing" || (!enabled && faults.length >= 2)} onClick={() => toggleFault(fault.id)}>
                <span>{enabled ? "Remove fault" : fault.label}</span><small>{fault.description}</small>
              </button>
            );
          })}
          {phase === "playing" && faults.length >= 2 && <p className="game-budget-note">Both fault slots are in use. Remove one to try another.</p>}
          <p className="game-inspector-hint">Select another node in the diagram to inspect it.</p>
        </div>
      )}

      {ended && (
        <div className={`game-result${phase === "patched" ? " game-result--patched" : ""}`}>
          <span className="game-kicker">{phase === "broken" ? "Failure reproduced" : phase === "patched" ? "Same incident. Different outcome." : phase === "patch-failed" ? "The patch was not enough" : "The system held"}</span>
          <h3>{phase === "broken" ? <>You didn’t break a server.<br /><em>You found a shared assumption.</em></> : phase === "patched" ? <>Less work.<br /><em>More useful work.</em></> : phase === "patch-failed" ? "Still a failure domain." : <>Two paths.<br /><em>Look a little closer.</em></>}</h3>
          <p>{phase === "broken" ? "Both workers borrowed the same connections. Slow work held them open; timeouts added retries without cancelling originals. The queue grew until useful work missed its deadlines." : phase === "patched" ? "The exact fault timeline was replayed from a clean start. Deadline-aware cancellation, a retry budget, and bounded admission kept the same incident from meeting the outage condition." : phase === "patch-failed" ? "The recorded incident still met the outage condition. A mitigation is not a guarantee; inspect the timeline below." : "No sustained outage in this round. Inspect the workers’ dependencies and ask what happens to work after a timeout."}</p>
          {comparison && <div className="game-comparison"><span>Before <strong>{Math.round(comparison.before)}%</strong></span><span aria-hidden="true">→</span><span>Protected <strong>{Math.round(comparison.after)}%</strong></span></div>}
          {phase === "broken" && <><p className="game-patch-note">The patch: cancel settled or hopeless work, cap queued attempts, and budget retries. Rejected requests still count as failures.</p><button className="game-primary" type="button" onClick={replay}>Patch the design & replay <span aria-hidden="true">↗</span></button></>}
          {phase !== "broken" && <button className="game-primary" type="button" onClick={start}>Try another approach <span aria-hidden="true">↗</span></button>}
          {phase === "patched" && <p className="game-patch-note">Goodput is compared at the same simulated time. Surviving this incident is not proof against every failure.</p>}
        </div>
      )}

      <button className="game-telemetry-toggle" type="button" aria-expanded={telemetry} aria-controls={`${panelId}-telemetry`} onClick={onTelemetry}>
        <span>{telemetry ? "Close the notebook" : "Look closer / telemetry & timeline"}</span><span aria-hidden="true">{telemetry ? "−" : "+"}</span>
      </button>
      <div className={`game-disclosure${telemetry ? " is-open" : ""}`} id={`${panelId}-telemetry`} aria-hidden={!telemetry}>
        <div><div className="game-telemetry">
          <dl>
            <div><dt>Connections in use</dt><dd>{metrics.pool} / {LIMITS.pool}</dd></div>
            <div><dt>Queued attempts</dt><dd>{metrics.queue} / {LIMITS.queue}</dd></div>
            <div><dt>Retries created</dt><dd>{metrics.retries}</dd></div>
            <div><dt>Originals offered</dt><dd>{metrics.offered}</dd></div>
            <div><dt>Completed on time</dt><dd>{metrics.completed}</dd></div>
            <div><dt>Rejected at admission</dt><dd>{metrics.shed}</dd></div>
          </dl>
          <p>Goodput: unique successes among originals whose deadlines fell in the last 5 seconds, including rejections. Latency: p95 of recent on-time completions only; “—” means none, not zero latency.</p>
          <ol aria-label="Incident timeline">
            <li><time>0.0s</time><span>{game.patched ? "Protected policy applied. Replaying recorded fault actions." : "System ready. Primary and backup available."}</span></li>
            {game.events.map((event, i) => <li key={i}><time>{event.time.toFixed(1)}s</time><span>{event.text}</span></li>)}
          </ol>
          <p>Local, deterministic teaching model. Equal-capacity failover is immediate; packets are illustrative. No real traffic is generated.</p>
        </div></div>
      </div>
    </section>
  );
}