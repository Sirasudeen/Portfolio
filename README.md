# siras.cloud

A personal software-engineering portfolio built around curiosity, clear systems, and useful experiments.

## The experience

- **Living systems:** a draggable hero network with real graph routing, relay failure, pulse sending, keyboard controls, and reduced-motion support.
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
- `npm run preview` — preview that production build locally.

React 18, Vite, Framer Motion, Lucide icons, and custom responsive CSS. Tailwind remains available for the shared UI components.

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