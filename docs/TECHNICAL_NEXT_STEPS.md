## Velocity Logic Marketing Surface – SSR / Static Roadmap

This app currently ships the marketing site (`/` and `/vs-jobber`) as a client-side React SPA (Vite + React Router).
That works visually but means search engines and AI tools rely on JavaScript execution or the `<noscript>` snapshot.

This document outlines two concrete upgrade paths.

### Option 1 – Migrate marketing pages to Next.js

**Goal:** Keep the existing app logic, but serve `/` and `/vs-jobber` as server-rendered or statically pre-rendered pages.

High-level steps:

1. Create a new `web` (or `marketing`) Next.js app in this repo.
2. Port `LandingPage` and `VsJobberPage` into Next.js pages while preserving the current design and copy.
3. Move shared UI (header, footer, typography tokens) into a small component library consumed by both the Next.js app and the existing dashboard.
4. Configure Vercel so the Next.js app is the primary project entry (root), and point `velocity-logic.vercel.app` to it.
5. Keep the current dashboard as a separate app or mount it under a route (e.g. `/app`) during the migration window.

Pros:

- First-class SEO, Open Graph, and analytics support.
- Simplifies future content experiments and landing-page variants.

### Option 2 – Add pre-rendering on top of Vite

If a full framework migration is out of scope, we can add static pre-rendering for a small set of routes:

1. Introduce a pre-render tool (e.g. `vite-ssg` or a custom script) that:
   - Renders `/` and `/vs-jobber` to HTML at build time.
   - Emits those HTML files into `dist/` so Vercel can serve them directly.
2. Keep the existing React Router SPA behavior on the client so navigation still feels instant.
3. Ensure key marketing content (hero, features, testimonials, pricing, founder blurb) is present in the pre-rendered HTML.

Pros:

- Smaller surface area change.
- Immediately improves how crawlers and AI tools see the site without re-platforming.

### Recommendation

For the next significant iteration, Option 2 is the fastest way to improve crawlability while keeping disruption low.
As the product matures and marketing needs grow, migrating the public-facing site to Next.js (Option 1) will give the most flexibility.

