# Ayudha Site Intelligence
- Read BUILD_BRIEF.md before any change. reference-v3.html is the visual source of truth.
- Thai-only UI, Ayutthaya flavour; Thai digits in views; SI units in data.
- Never add the 2H rule. Never add English UI text.
- All content comes from public/data/study.json, never hard-coded.
- Static art is baked once through the mural filter; live elements sit above it with the light filter.
- Run `npm test` and the Playwright smoke test before saying a task is done.
- Work phase by phase (BUILD_BRIEF §9). Stop at each decision point and ask.
- TypeScript is strict; no `any`. Thai text lives only in `src/data/strings.th.ts` and `public/data/study.json` (enforced by `npm test`).
- Each phase ends with `npm run build:single` and a committed `review/ayudha-<phase>.html` (bump `ayudhaPhase` in package.json).
