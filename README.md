# siras.cloud

A personal software-engineering portfolio built around curiosity, clear systems, and useful experiments.

## The experience

- **Living systems:** a draggable hero network with graph routing, pulse sending, keyboard controls, and a playable two-fault system-design challenge.
- **Selected work:** an asymmetric project gallery with full-interface screenshots and expandable engineering notes.
- **About:** a personal introduction and current areas of exploration.
- **Approach:** keyboard-accessible principle tabs with custom SVG illustrations.
- **Contact:** direct email, clipboard copying with error feedback, and social links.

Native scrolling and links are preserved. The mobile menu uses a native modal dialog, and motion is reduced when requested. The hero network stops animating while offscreen or in a hidden tab.

## Development

Requires a supported Node.js release and npm.

- `npm install` — install dependencies.
- `npm run dev` — start the Vite development server.
- `npm run build` — create the production build in `dist`.
- `npm test` — run deterministic simulation tests with Node's built-in test runner.
- `npm run preview` — preview that production build locally.

React 18, Vite, Framer Motion, Lucide icons, and custom responsive CSS. Tailwind remains available for the shared UI components.

## The systems challenge

Select **Try to break it**, inspect nodes, and inject at most two simultaneous faults. A round lasts up to 120 simulated seconds. The win condition is measured, not combination-based: fewer than 20% of unique originals finish within their 4-second deadline for 8 consecutive seconds. Goodput uses originals whose deadlines fell in the trailing 5-second window; rejected requests remain in the denominator. Latency is p95 of recent on-time completions only, so no completions display a dash rather than zero.

The local fixed-step engine models originals, duplicate retry attempts, a bounded FIFO, and a shared connection pool. The diagram is illustrative, not a per-request packet trace. Equal-capacity backup routing is instantaneous in this teaching model; dragging changes layout, not topology or capacity. No real network load is generated.

The clock and decorative signals suspend offscreen or in a hidden tab. The pause control freezes simulation time but still allows inspection and fault selection. Reduced motion disables signal travel, not gameplay.

### Maintainer solution and replay

Traffic alone, dependency latency alone, and primary failures all survive. Inspecting Compute or Standby exposes `pool/shared-01`. Combining **Traffic burst** and **Slow dependency** saturates that shared pool. Timed-out original attempts keep working while retries compete for the same connections. The queue fills and requests miss deadlines.

After an outage, **Patch the design & replay** replays the complete timestamped fault-action journal at the same fixed timestep, from clean initial state, at 2× presentation speed. Protection cancels settled or impossible work, limits admission, and budgets retries. It does not increase capacity or omit rejected originals from metrics. Before/after goodput is compared at the exact same simulated time; this is evidence for that incident, not a universal reliability guarantee.

- Engine and invariants: [src/lib/systemGame.js](src/lib/systemGame.js), [src/lib/systemGame.test.js](src/lib/systemGame.test.js).
- Clock, pause, and replay: [src/hooks/use-system-game.js](src/hooks/use-system-game.js).
- Inspection, telemetry, and results: [src/componentss/SystemGamePanel.jsx](src/componentss/SystemGamePanel.jsx).

## Editing

- Section order and reduced-motion configuration: [src/pages/Home.jsx](src/pages/Home.jsx).
- Project descriptions, screenshots, and destinations: [src/componentss/ProjectsSection.jsx](src/componentss/ProjectsSection.jsx).
- Network interaction: [src/componentss/SystemsPlayground.jsx](src/componentss/SystemsPlayground.jsx).
- Global design system: [src/index.css](src/index.css).
- Navigation styles: [src/componentss/Navigation.css](src/componentss/Navigation.css).
- Search and social metadata: [index.html](index.html).

## Deployment

Build with `npm run build` and serve `dist` using a static host. Configure SPA fallback to the generated index document for client-side routing. The canonical URL, social image URLs, robots file, and sitemap currently target **https://siras.cloud/**.

Before publishing, verify the external demo destinations and email/social links. Browser layout checks do not prove that third-party services are available.