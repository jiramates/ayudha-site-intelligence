# Ayudha Site Intelligence

Interactive, story-driven hospital site study in the style of an aged Ayutthaya mural. Demo data only. See `BUILD_BRIEF.md`.

| Command | What it does |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | typecheck + production build to `dist/` |
| `npm run build:single` | one self-contained file `review/ayudha-<phase>.html` (double-click to open; no server) |
| `npm test` | Vitest: units, schema, data swap, copy rules |
| `npm run test:e2e` | Playwright: smoke test, data swap in the browser, error panel |
| `npm run shoot` | screenshots of the build vs `reference-v3.html` with a pixel-diff report |

Content: `public/data/study.json` (validated by zod, SI units). UI copy: `src/data/strings.th.ts`.
Fonts (Srisakdi, Charm, Taviraj) are self-hosted in `public/fonts`.
