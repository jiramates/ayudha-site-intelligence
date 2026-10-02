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

## Demo data only, real data never in this repo
`public/data/study.json` and `tests/fixtures/` are **demo data**. Real project figures must never be committed to this repository, on any branch.
`.gitignore` blocks `private/`, `study.private*.json` and `.env*` as a safeguard.

Planned design for a later private deploy (not built yet, decision D2):
- The real `study.json` lives **outside the repo** and is injected at build time. `npm run build:single` already accepts `STUDY_FILE=/path/to/real.json`, which is inlined into the output file.
- For a hosted build, the same variable (or a runtime URL from an environment variable) points the loader at the real file; the site is then served behind a password (host-level access control, decision D3).
- The private output is never written to `review/` or committed; the public build stays demo data only.
