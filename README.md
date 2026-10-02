# Ayudha Site Intelligence

Interactive, story-driven hospital site study in the style of an aged Ayutthaya mural. Demo data only. See `BUILD_BRIEF.md`.

| Command | What it does |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | typecheck + production build to `dist/` |
| `npm run build:single` | one self-contained file `review/ayudha-<phase>.html` (double-click to open; no server) |
| `npm test` | Vitest: units, schema, data swap, copy rules |
| `npm run test:e2e` | Playwright: smoke test, data swap in the browser, error panel |
| `npm run review:shots` | screenshots at AGE_LEVEL 1 and 2 and a 375 px mobile map into `review/` |
| `npm run og` | re-render `public/og-image.png` (1200×630 link preview); the PNG is committed |
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

## Editing study.json
- **Numbers in sentences are placeholders, never typed.** Write `สูงได้ {maxHeight_m:wa}`, not a hand-typed number. Names are looked up on the current site, its `rules`, derived values (`sitesCount`, `farActual`, `roofTiers`, `wings`), `meta.regs`, then `meta`; `{@B.n:word}` addresses another site. Formats: `th` (default), `word`, `ceilWord`, `wa`, `waWord`, `area`, `raiWord`, `sok`, `sokWord`, `sen`. A wrong name or format is reported at load with its path; `npm test` fails on any Thai digit typed in a string.
- **All text is HTML-escaped.** Only `**bold**` is allowed.
- **`meta.ageLevel` (0–2, default 1.5)** sets how weathered the baked mural looks: 0 fresh, 1.5 the v3 look, 2 heavy. **1–2 is recommended**; the schema rejects values above 2. It changes only the baked paint, never the 3D models.
- **Massing archetypes:** a new one = one entry in `src/data/archetypes.ts` (the name, plus facts prose may cite) and one drawing function in `src/scenes/massing.ts`; the compiler enforces both and the schema accepts the new name automatically.

## Sharing
- **Deep links** (letters, digits and hyphens only): `#site-A` (lens 1, zoomed to site A), `#lens-reg-B` (lens 2, site B), `#lens-tr-C` (lens 3, site C). Opening one restores lens, site and zoom; browser back/forward move between views. An unknown link opens the whole city.
- **Copy link** button on each site caption; if the clipboard is refused the link is selected instead.
- **Save map image** button: exports the map exactly as shown (current zoom, model, routes) as a 2000 px wide PNG.
- **Link preview:** `public/og-image.png` plus Open Graph / Twitter tags generated at build time from `meta.title` and `strings.th.ts`. Set `SITE_URL` (for example `https://ayudha.pages.dev`, no trailing path) so the image and page links are absolute; without it the build still works but the tags are relative and crawlers cannot use them. The PNG is committed (a deploy build needs no browser); run `npm run og` after changing the title or the hero art. Link previews only work where the page is public: a crawler cannot pass a login.

## Deploy: Cloudflare Pages (repo stays private)
The build output is a plain static folder, so the same settings work on Vercel or Netlify.

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | (blank) |
| Environment variable `NODE_VERSION` | `22` |
| Environment variable `SITE_URL` | the public address, e.g. `https://ayudha-site-intelligence.pages.dev` |

Do not set `NODE_ENV=production` (the build needs the dev dependencies). `review/`, `tests/` and `scripts/` are not published; only `dist/` is.
