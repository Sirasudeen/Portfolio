import { useEffect, useRef, useState } from "react";
import { createSimulation, LIMITS, setFault, STEP, stepSimulation } from "../lib/systemGame";

function snapshot(sim, phase) {
  return {
    phase, time: sim.time, faults: [...sim.faults], badFor: sim.badFor,
    metrics: { ...sim.metrics }, events: sim.events.map((event) => ({ ...event })),
    patched: sim.patched,
  };
}

export function useSystemGame(visible) {
  const simulation = useRef(null);
  const incident = useRef(null);
  const replayIndex = useRef(0);
  const [game, setGame] = useState(() => snapshot(createSimulation(), "idle"));
  const [paused, setPaused] = useState(false);
  const [comparison, setComparison] = useState(null);
  const active = game.phase === "playing" || game.phase === "replaying";

  useEffect(() => {
    if (!active || paused || !visible) return;
    const timer = setInterval(() => {
      const sim = simulation.current;
      if (!sim) return;
      const replaying = game.phase === "replaying";
      // Replay at 2x, but always integrate at the identical fixed timestep.
      for (let i = 0; i < (replaying ? 2 : 1); i += 1) {
        if (replaying) {
          const actions = incident.current.actions;
          while (replayIndex.current < actions.length && actions[replayIndex.current].time <= sim.time) {
            const action = actions[replayIndex.current++];
            setFault(sim, action.id, action.enabled);
          }
        }
        stepSimulation(sim);
        if (sim.won) {
          if (!replaying) {
            incident.current = {
              actions: sim.actions.map((action) => ({ ...action })),
              duration: sim.time, goodput: sim.metrics.goodput,
            };
          }
          setGame(snapshot(sim, replaying ? "patch-failed" : "broken"));
          return;
        }
        if (replaying && sim.time >= incident.current.duration) {
          setComparison({ before: incident.current.goodput, after: sim.metrics.goodput });
          setGame(snapshot(sim, "patched"));
          return;
        }
        if (!replaying && sim.time >= LIMITS.round) {
          setGame(snapshot(sim, "survived"));
          return;
        }
      }
      setGame(snapshot(sim, game.phase));
    }, STEP * 1000);
    return () => clearInterval(timer);
  }, [active, game.phase, paused, visible]);

  const start = () => {
    simulation.current = createSimulation();
    incident.current = null;
    setPaused(false);
    setComparison(null);
    setGame(snapshot(simulation.current, "playing"));
  };

  const toggleFault = (id) => {
    if (game.phase !== "playing") return;
    const sim = simulation.current;
    if (setFault(sim, id, !sim.faults.includes(id))) setGame(snapshot(sim, "playing"));
  };

  const replay = () => {
    if (!incident.current) return;
    simulation.current = createSimulation({ patched: true });
    replayIndex.current = 0;
    setPaused(false);
    setComparison(null);
    setGame(snapshot(simulation.current, "replaying"));
  };

  const exit = () => {
    simulation.current = null;
    incident.current = null;
    setPaused(false);
    setComparison(null);
    setGame(snapshot(createSimulation(), "idle"));
  };

  return { game, active, paused, setPaused, start, toggleFault, replay, exit, comparison };
}