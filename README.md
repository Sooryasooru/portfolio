# Soorya T — Portfolio

One-page portfolio for a Data Scientist / AI-ML Engineer specializing in healthcare AI.
Editorial light theme, typography-led, no images — the 3D skill cluster, RAG chat demo
and recruiter mode do the talking.

## Stack

- **Vite + React 19 + TypeScript** — single-page app, no router
- **Tailwind CSS v4** — CSS-first theme tokens (`src/styles/index.css`)
- **Motion** (`motion/react`) — reveals, parallax, expand-in-place cards
- **React Three Fiber v9 + drei** — 3D skill cluster, lazy-loaded chunk
- **lucide-react** — icons; **@fontsource-variable** — self-hosted Fraunces + Inter

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-checks, then outputs dist/
npm run preview  # serves the production build
```

## Deploy

Static output — works on Vercel or Netlify out of the box.

- **Vercel**: import the repo, framework preset "Vite". `vercel.json` rewrites `/resume` to the SPA.
- **Netlify**: build command `npm run build`, publish directory `dist`. `public/_redirects` handles `/resume`.

## Editing content

Everything on the site — hero copy, skill clusters with proficiency + project evidence,
projects (problem → architecture → stack → outcome → links), recruiter-mode fit matrix,
resume page and the chat knowledge base — comes from one module:

```
src/data/content.ts
```

To update a skill, add a `{ name, level, evidence, evidenceSource }` entry to the right
cluster. To add a project, append to `projects` — the resume page and chat both pick it
up automatically. Chat answers come from `knowledgeBase` chunks: add or edit a chunk
(id, title, source, keywords, text) and retrieval finds it.

## How the pieces work

- **3D skill cluster** (`src/components/three/SkillClusterScene.tsx`) — six cluster nodes
  orbit a hub; hover/tap a node to load its skills into the evidence panel. Labels are
  DOM elements positioned by projecting 3D coordinates to screen space each frame
  (no drei `<Html>` portals). The chunk loads lazily and pauses its render loop
  (`frameloop="never"`) whenever the section is off-screen. Falls back to a static
  grid on small screens, reduced-motion preference, or missing WebGL.
- **Recruiter mode** (`src/components/RecruiterView.tsx`) — collapses the page to
  role-fit evidence, the condensed HAIP card and contact. Session-persisted and
  deep-linkable: share `https://yoursite.com/?recruiter=1`.
- **RAG chat demo** (`src/components/chat/ChatWidget.tsx` + `src/lib/retrieval.ts`) —
  client-side TF-IDF-style retrieval over the knowledge base with confidence gating and
  source chips. No backend, no API keys — deliberately honest, and deliberately a demo
  of the retrieval pattern used in HAIP.
- **Resume** — `/resume` (or `?view=resume` on any host) renders a print-optimized
  one-pager from the same content module; "Save as PDF" runs `window.print()` with
  A4 print styles.

## Performance

Initial JS ≈ 64 KB gzip (app + motion vendor). The three.js chunk (~317 KB gzip) is a
separate lazy chunk loaded only when the skills section mounts on a WebGL-capable
≥640px viewport. No image assets; two self-hosted variable fonts.
