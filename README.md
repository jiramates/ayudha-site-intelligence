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
| `npm run og` | re-render `public/og-image.jpg` (1200×630 link preview, under 300 kB); the JPEG is committed |
| `npm run art` | re-bake the painted map into `public/art/` (see "Prebaked art"); commit the result |

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
- **Save map image** button: exports the map exactly as shown (current zoom, model, routes) as a 2000 px wide JPEG (quality about 0.9, under 1.5 MB).
- **Link preview:** `public/og-image.jpg` plus Open Graph / Twitter tags generated at build time from `meta.title` and `strings.th.ts`. Set `SITE_URL` (for example `https://ayudha.pages.dev`, no trailing path) so the image and page links are absolute; without it the build still works but the tags are relative and crawlers cannot use them. The JPEG is committed (a deploy build needs no browser); run `npm run og` after changing the title or the cover painting. Link previews only work where the page is public: a crawler cannot pass a login.

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

## Moving pictures
The cover (`src/assets/cover.webp`) and the chapter 1 painting (`src/assets/planners.webp`) are finished paintings shown exactly as they are, as ordinary images. `src/ui/living.ts` lays a canvas over each and redraws only what moves (water, the flag, fans and trees swaying, people breathing, glowing glass panels, sparks, gold dust, birds); the list of effects and where they sit, in each image's own pixels, is in `src/scenes/pictures.ts`. Replacing a painting means replacing the file and re-placing those rectangles. The animation starts once the page is idle, runs about 30 frames a second only while the picture is on screen, and is off for readers who ask for reduced motion (the still painting stays).

## Prebaked art (why the page opens in half a second)
The painted map is baked through the heavy aged-paint filter once, offline, by `npm run art`, and committed as `public/art/*.jpg` with a manifest of signatures. The browser uses them while their signature matches the drawing code, `meta.ageLevel`, the picture sizes and the site positions. If something no longer matches (another age level, a moved site, changed drawing code) the browser quietly bakes the art itself as before: the page still works, it is just slower to start. Re-run `npm run art` and commit `public/art` after changing any of those; the Playwright test `tests/art.spec.ts` fails when the committed art is stale.

## Layout
A section is never taller than the screen (`max-height: 100svh`) but takes its height from its content, packed from the top with one even gap (about 24–32px) and 40px between sections. Only the map section (and, on wide screens, the cover) fills exactly one screen. Wide screens: the map is sized by the screen height with a side panel. Portrait: full-width map, the narrator under it, and a bottom sheet (closed = one 72px strip with four site chips docked at the bottom, half, full). On phones the whole cover painting and the title under it take about 90% of the screen so chapter 1 peeks, chapter 1's two lines become a swipe pair if they would not fit, and chapter 3 shows a short ledger (site, score bar out of 20, buildable floor area; tap a row for the rest). Chapter 3 is four pages (tabs on wide screens, swipe + dots on phones) and the pager is as tall as the page shown. `tests/layout.spec.ts` checks sections, gaps, the map and the sheet at 1920×1080, 1366×768, 1280×720, 768×1024, 390×844, 375×667, 844×390, 390×700 and 375×600. Lighthouse on the production build (simulated mobile and desktop): performance 100 on desktop and 89–91 on mobile; accessibility, best practices and SEO 100.

## How to update the content (no coding needed)
Everything the page says lives in one file: **`public/data/study.json`**. Labels and button texts are in `src/data/strings.th.ts` (ask a developer or Claude to change those).

1. On GitHub open `public/data/study.json`, click the pencil (Edit), and change the values. Commit to a **new branch** (not `main`) and open a pull request. Cloudflare then builds a **preview link** for that branch: open it on your phone and check.
2. If the page shows a torn palm leaf with a list of paths (for example `sites.1.rules.road_m`), the file has a mistake at that path. Fix it and commit again.
3. When the preview looks right, merge the pull request into `main`. Cloudflare publishes it by itself in about two minutes.

What you can change safely
- **Names and sentences** (`name`, `short`, `desc`, `verdict`, `pros`, `cons`, `say`, `transportNote`, story lines, opinions, the resolution). Do not type numbers into sentences: write a placeholder such as `{maxHeight_m:wa}` and the page shows it in Thai wa with Thai digits (the full list is under "Editing study.json"). Use `**bold**` for emphasis; nothing else is allowed.
- **Numbers** in the data fields are always SI units (metres, square metres) written with ordinary digits: `land_m2`, `road_m`, `maxHeight_m`, `gfa_m2` and so on. The page converts them to วา, ไร่-งาน-ตารางวา and Thai digits.
- **Scores** are whole numbers 0–5 (four criteria, 20 in total).
- **Sites**: 1 to 9. Each needs a unique `id` (letters, digits and hyphens only, because it appears in the link, for example `#site-A`) and a unique `n`. `routes` are lists of `[x, y]` points on the 1000×760 plan.
- **`meta.contact`**: one line of plain text (an e-mail, a LINE id, a phone number). While it is empty the "ขอชมฉบับเต็ม" button is hidden. Only put a contact you are happy to show publicly.

Also needed in some cases
- Changed **`meta.title`**? The link-preview picture shows the title. Ask a developer (or Claude) to run `npm run og` and commit `public/og-image.jpg`.
- Moved a site, or changed **`meta.ageLevel`** (0–2, 1–2 recommended)? The page still works but starts more slowly until `npm run art` is run and `public/art` is committed.
- **Never put real project figures in this repository**, not even on a branch. Real data belongs in a separate private deploy (see "Demo data only").
