import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Pause, Play, RotateCcw, X, Zap } from "lucide-react";
import { useSystemGame } from "../hooks/use-system-game";
import { LIMITS } from "../lib/systemGame";
import { SystemGamePanel } from "./SystemGamePanel";
import "./SystemsPlayground.css";

const initialNodes = [
  { x: 55, y: 220, name: "Input", detail: "Every good system starts with a question." },
  { x: 155, y: 83, name: "Relay", detail: "The direct route. Useful, but never a single point of failure." },
  { x: 360, y: 100, name: "Compute", detail: "Turn the incoming signal into something useful." },
  { x: 445, y: 257, name: "Output", detail: "A different path. The same destination." },
  { x: 328, y: 381, name: "Standby", detail: "A second path, ready when the first one is not." },
  { x: 130, y: 360, name: "Buffer", detail: "A little breathing room makes the whole system more resilient." },
];
const edges = [[0, 1], [1, 2], [2, 3], [0, 5], [5, 4], [4, 3]];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// Breadth-first search keeps routing tied to the live graph, not a visual preset.
function findRoute(failed) {
  const queue = [[0]];
  const visited = new Set([0]);
  while (queue.length) {
    const path = queue.shift();
    const current = path[path.length - 1];
    if (current === 3) return path;
    for (const [from, to] of edges) {
      const next = from === current ? to : to === current ? from : null;
      if (next === null || next === failed || visited.has(next)) continue;
      visited.add(next);
      queue.push([...path, next]);
    }
  }
  return [];
}

function curve(from, to) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  return `Q ${midX + (midX - 250) * 0.2} ${midY + (midY - 230) * 0.2} ${to.x} ${to.y}`;
}

export const SystemsPlayground = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [selected, setSelected] = useState(null);
  const [animationPaused, setAnimationPaused] = useState(false);
  const [telemetry, setTelemetry] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [pulse, setPulse] = useState(0);
  const [sending, setSending] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const stageRef = useRef(null);
  const playgroundRef = useRef(null);
  const dragRef = useRef(null);
  const previousPlaying = useRef(false);
  const helpId = useId();
  const panelId = useId();
  const controller = useSystemGame(inView && pageVisible);
  const { game, active, paused, setPaused, start, exit } = controller;
  const playing = game.phase !== "idle";
  const offlineNodes = [game.faults.includes("relay") ? 1 : null, game.faults.includes("compute") ? 2 : null].filter((id) => id !== null);
  const failed = offlineNodes[0] ?? null;
  const slow = game.faults.includes("latency");
  const congested = playing && game.metrics.queue > 12;
  const showDependency = playing && (selected === 2 || selected === 4 || selected === 6 || telemetry);
  const stopped = playing ? paused || !active : animationPaused;
  const status = game.phase === "broken" ? "Outage reproduced. You found the shared failure domain. Patch and replay below."
    : game.phase === "patched" ? "Protected replay complete. The same incident no longer caused a sustained outage."
    : game.phase === "patch-failed" ? "The recorded incident still caused an outage under the protected policy."
    : game.phase === "survived" ? "Round complete. The system held. Try another approach."
    : playing && paused ? "Simulation paused. Inspect the system or change faults, then resume."
    : playing && (!inView || !pageVisible) ? "Simulation suspended while the playground is out of view."
    : game.phase === "replaying" ? "Replaying your exact fault timeline with deadline-aware protection."
    : playing && game.badFor > 0 ? "Deadline goodput is below 20%. The outage clock is running."
    : congested ? "Connections are busy. The queue is growing."
    : playing ? "Everything is green. Prove it wrong."
    : sending ? "Pulse sent: input to output." : "All connected. Can you find the weak assumption?";
  // Start one-shot SVG motion on insertion, not at the SVG document's time zero.
  const beginPulse = useCallback((animation) => animation?.beginElement(), []);
  const route = findRoute(failed);
  const running = !stopped && !reducedMotion && inView && pageVisible;
  const signalDuration = slow ? 7.2 : 4.8;
  const signalCount = playing && game.metrics.retries > 0 ? 6 : 3;
  const routePath = `M ${nodes[0].x} ${nodes[0].y} ${route.slice(1).map((id, i) => curve(nodes[route[i]], nodes[id])).join(" ")}`;

  useEffect(() => {
    if (previousPlaying.current === playing) return;
    previousPlaying.current = playing;
    requestAnimationFrame(() => {
      const playground = playgroundRef.current;
      if (!playground) return;
      const navigation = document.querySelector(".site-nav");
      const desktop = window.matchMedia("(min-width: 761px)").matches;
      const navigationBottom = (navigation?.getBoundingClientRect().bottom ?? 65)
        - (desktop && !navigation?.classList.contains("site-nav--scrolled") ? 12 : 0);
      const target = playing && window.matchMedia("(min-width: 761px)").matches
        ? document.querySelector(".system-game") || playground
        : playground;
      const offset = -(navigationBottom + 8);
      const request = new CustomEvent("portfolio:scroll-to", {
        detail: { target, offset, handled: false },
      });
      window.dispatchEvent(request);
      if (!request.detail.handled) {
        const top = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? "auto" : "smooth" });
      }
      requestAnimationFrame(() => {
        const correction = target.getBoundingClientRect().top + offset;
        if (Math.abs(correction) < 1) return;
        window.scrollBy({ top: correction, behavior: "auto" });
      });
    });
  }, [playing, reducedMotion]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(playgroundRef.current);
    const onVisibility = () => setPageVisible(!document.hidden);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPreference = () => setReducedMotion(preference.matches);
    onVisibility();
    onPreference();
    document.addEventListener("visibilitychange", onVisibility);
    preference.addEventListener("change", onPreference);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      preference.removeEventListener("change", onPreference);
    };
  }, []);

  useEffect(() => {
    if (!sending) return;
    const timer = setTimeout(() => setSending(false), 2200);
    return () => clearTimeout(timer);
  }, [sending, pulse]);

  const moveNode = (id, x, y) => {
    setNodes((current) => current.map((node, index) => index === id
      ? { ...node, x: clamp(x, 45, 455), y: clamp(y, 60, 385) }
      : node));
  };

  const startDrag = (event, id) => {
    if (!event.isPrimary || event.button !== 0) return;
    const bounds = stageRef.current.getBoundingClientRect();
    dragRef.current = {
      id, pointer: event.pointerId,
      offsetX: (event.clientX - bounds.left) * 500 / bounds.width - nodes[id].x,
      offsetY: (event.clientY - bounds.top) * 460 / bounds.height - nodes[id].y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelected(id);
  };

  const drag = (event) => {
    const active = dragRef.current;
    if (!active || event.pointerId !== active.pointer) return;
    const bounds = stageRef.current.getBoundingClientRect();
    moveNode(active.id,
      (event.clientX - bounds.left) * 500 / bounds.width - active.offsetX,
      (event.clientY - bounds.top) * 460 / bounds.height - active.offsetY);
  };

  const keyboardMove = (event, id) => {
    const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (!directions[event.key]) return;
    event.preventDefault();
    const [x, y] = directions[event.key];
    const step = event.shiftKey ? 20 : 8;
    moveNode(id, nodes[id].x + x * step, nodes[id].y + y * step);
  };

  const reset = () => {
    dragRef.current = null;
    setNodes(initialNodes);
    setSelected(null);
    setSending(false);
    setPulse(0);
    setTelemetry(false);
    setAnimationPaused(false);
    if (playing) start();
  };

  const beginChallenge = () => {
    setSending(false);
    setSelected(0);
    setTelemetry(false);
    start();
  };

  return (
    <div ref={playgroundRef} className={`systems-playground${failed !== null ? " systems-playground--rerouted" : ""}${playing ? " systems-playground--game" : ""}${congested ? " systems-playground--congested" : ""}`} role="group" aria-label="Interactive systems playground">
      <div className="systems-eyeline">
        <span><i /> {playing ? "A small challenge" : "A small experiment"}</span>
        <span>{playing ? "01 / find the failure" : "01 / living systems"}</span>
      </div>

      <div className="systems-stage" ref={stageRef}>
        <svg className="systems-map" viewBox="0 0 500 460" aria-hidden="true">
          <circle className="systems-orbit" cx="250" cy="230" r="146" />
          <circle className="systems-orbit systems-orbit--outer" cx="250" cy="230" r="194" />
          {Array.from({ length: 60 }, (_, i) => (
            <line key={i} className="systems-tick" x1="250" y1="29" x2="250" y2={i % 5 === 0 ? "36" : "32"} transform={`rotate(${i * 6} 250 230)`} />
          ))}
          {edges.map(([from, to]) => {
            const offline = offlineNodes.includes(from) || offlineNodes.includes(to);
            const active = route.some((id, i) => id === from && route[i + 1] === to || id === to && route[i + 1] === from);
            return <path key={`${from}-${to}`} className={`systems-link${offline ? " systems-link--offline" : active ? " systems-link--active" : ""}`} d={`M ${nodes[from].x} ${nodes[from].y} ${curve(nodes[from], nodes[to])}`} />;
          })}
          <path className={`systems-route${sending ? " systems-route--sending" : ""}`} d={routePath} />
          {showDependency && [2, 4].map((id) => <path key={`dependency-${id}`} className="systems-dependency-link" d={`M ${nodes[id].x} ${nodes[id].y} Q 400 420 250 425`} />)}
          {running && Array.from({ length: signalCount }, (_, i) => i).map((signal) => (
            <circle className="systems-signal" r={signal === 0 ? "4" : "3"} key={`${failed}-${signal}`}>
              <animateMotion path={routePath} dur={`${signalDuration}s`} begin={`${signal * -signalDuration / signalCount}s`} repeatCount="indefinite" />
            </circle>
          ))}
          {sending && !reducedMotion && inView && pageVisible && (
            <circle className="systems-pulse" r="7" key={`pulse-${pulse}-${failed}`}>
              <animateMotion ref={beginPulse} path={routePath} begin="indefinite" dur="2s" fill="freeze" />
            </circle>
          )}
        </svg>

        <div className="systems-center" aria-hidden="true">
          <span className="systems-center-index">{game.phase === "broken" ? "Failure reproduced." : game.patched ? "Deadline-aware design." : playing ? "Everything is green?" : "Order is easy."}</span>
          <span className="systems-center-title">{game.phase === "broken" ? <>Shared<br /><em>fate.</em></> : game.patched ? <>Less.<br /><em>But better.</em></> : congested ? <>Still up.<br /><em>Not useful.</em></> : playing ? <>Find the<br /><em>weak link.</em></> : <>What if<br /><em>it breaks?</em></>}</span>
          <span className="systems-center-note">{playing ? stopped ? "Paused. Take a closer look." : "Two faults. Make them count." : <>Go on. Find out. <ArrowDownLeft size={11} aria-hidden="true" /></>}</span>
        </div>

        {nodes.map((node, id) => (
          <button
            key={id}
            type="button"
            className={`systems-node${id === 0 || id === 3 ? " systems-node--terminal" : ""}${id === 3 ? " systems-node--output" : ""}${offlineNodes.includes(id) ? " systems-node--offline" : ""}${selected === id ? " systems-node--selected" : ""}`}
            style={{ left: `${node.x / 5}%`, top: `${node.y / 4.6}%` }}
            aria-label={`${node.name}${offlineNodes.includes(id) ? ", offline" : ""}`}
            aria-pressed={playing ? selected === id : undefined}
            aria-describedby={helpId}
            onPointerDown={(event) => startDrag(event, id)}
            onPointerMove={drag}
            onPointerUp={() => { dragRef.current = null; }}
            onPointerCancel={() => { dragRef.current = null; }}
            onLostPointerCapture={() => { dragRef.current = null; }}
            onKeyDown={(event) => keyboardMove(event, id)}
            onClick={() => setSelected(id)}
            onFocus={() => setSelected(id)}
          >
            <span className="systems-node-disc">{id === 0 ? <ArrowUpRight size={19} /> : id === 3 ? (
              <svg className="systems-output-mark" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true" focusable="false">
                <path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5" />
              </svg>
            ) : offlineNodes.includes(id) ? <X size={22} aria-hidden="true" /> : <span className="systems-node-dot" />}</span>
            <span className="systems-node-label">{node.name}{playing && id === 5 && game.metrics.queue > 0 ? ` · ${game.metrics.queue}` : ""}</span>
          </button>
        ))}
        {showDependency && <button className={`systems-pool-node${selected === 6 ? " is-selected" : ""}`} type="button" aria-label="Inspect shared connection pool" aria-pressed={selected === 6} onClick={() => setSelected(6)}>pool <span>{game.metrics.pool}/{LIMITS.pool}</span></button>}
      </div>

      <div className="systems-controls">
        <button className="systems-fault" type="button" aria-expanded={playing} aria-controls={panelId} onClick={() => { if (playing) { exit(); setSelected(null); } else beginChallenge(); }}>
          {playing ? "Exit challenge" : "Try to break it"} <ArrowUpRight size={14} aria-hidden="true" />
        </button>
        {!playing && (
        <button className="systems-send" type="button" onClick={() => { setPulse((current) => current + 1); setSending(true); }}>
          <Zap size={14} /> Send pulse
        </button>
        )}
        <button className="systems-icon-button" type="button" onClick={() => { if (playing) setPaused(!paused); else setAnimationPaused(!animationPaused); setSending(false); }} aria-label={playing ? paused ? "Resume challenge" : "Pause challenge" : animationPaused ? "Resume signal animation" : "Pause signal animation"} disabled={playing ? !active : !!reducedMotion}>
          {(playing ? paused : animationPaused || reducedMotion) ? <Play size={14} /> : <Pause size={14} />}
        </button>
        <button className="systems-icon-button" type="button" onClick={reset} aria-label={playing ? "Restart challenge" : "Reset network"}><RotateCcw size={14} /></button>
      </div>

      <div className="systems-readout" role="status" aria-live="polite" aria-atomic="true">
        <span className="systems-readout-dot" />
        <span>{status}</span>
      </div>
      <p className="systems-hint" id={helpId}>{playing ? "Tap to inspect. Drag to rearrange. Faults change behavior—not geometry." : "Drag the nodes. Change the shape, not the outcome."}<span>Keyboard: focus a node and use the arrow keys.</span></p>
      {playing ? <SystemGamePanel controller={controller} selected={selected} onSelect={setSelected} telemetry={telemetry} onTelemetry={() => setTelemetry(!telemetry)} panelId={panelId} /> : <div id={panelId}><p className="systems-detail">{selected === null ? "A playground for the way I think. Not a production monitor." : nodes[selected]?.detail}</p></div>}
    </div>
  );
};