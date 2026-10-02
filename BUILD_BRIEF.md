# Ayudha Site Intelligence — Build Brief for Claude Code

> Paste this file into the root of a new repo as `BUILD_BRIEF.md`, place `reference-v3.html` next to it, open Claude Code in that folder, and use the kickoff prompt in §12.

---

## 0. Executive summary

| Item | Decision |
|---|---|
| **What** | An interactive, story-driven hospital site study, styled as an aged Ayutthaya-era temple mural. It is the public teaser ("sneak peek") for the full Test Fit Dashboard. |
| **Who** | Executives, investors and stakeholders who see a link. They should understand 4 site options in about 3 minutes without a briefing. |
| **Core job** | Compare sites on **3 lenses**: (1) location and massing, (2) land rules and auspicious direction, (3) access by walk, horse, elephant and boat. |
| **Starting point** | `reference-v3.html` is a working single-file prototype (v3). Rebuild it as a maintainable, data-driven tool. Do not rewrite it from scratch. |
| **Shareable means** | A static site with one public URL, deep links per site and per lens, a link preview image, and no login. |
| **Reusable means** | All site content lives in **one data file**. Swapping the 4 demo sites for real project options must need zero code changes. |

---

## 1. Product story (top → bottom)

The page reads as one continuous mural wall, top to bottom. Keep this order.

| # | Section | Content | Interaction |
|---|---|---|---|
| Hero | Painted riverside panorama of Ayutthaya, title, subtitle, "scroll down" hint | — | Birds fly across, water flows |
| Ch. 1 | **ปรารภสร้างโรงหมอ** — mural scene: old hospital pavilion with patients, map table, two figures | 2 palm-leaf dialogue lines only | Speakers alternate every 5 s; the speaking figure bobs and shows a halo; clicking a leaf selects that speaker |
| Ch. 2 | **ออกสำรวจทำเลทั่วพระนคร** — bird's-eye mural map + 3 lens tabs + narrator leaf + detail leaves | See §3 | Main interactive area |
| Ch. 3 | **บทสรุปแห่งการสำรวจ** — comparison table, two opinion leaves, the council's resolution, "coming in full version" list, colophon | Click a table row to jump back to that site on the map | Leaves slide in on scroll |

**Cast (keep it to two speakers):**
- ขุนวิเศษสถาปนิก — royal builder; narrator on the map
- หมอหลวงพรหม — court physician
- นายมั่น — courier rider; one line only, in the transport lens

**Hard rule:** keep dialogue short. One sentence per map click, and at most 2 lines in Chapter 1.

---

## 2. Language, units and copy rules

| Rule | Detail |
|---|---|
| Language | All UI and content in Thai with an Ayutthaya flavour: ข้า, ท่าน, เอ็ง, เพลา, พลขับ, ขอรับ, แล, จัก |
| No English | Use Thai terms or Thai transliteration ("เทสต์ฟิต แดชบอร์ด", "โอพีดี ไอพีดี ไอซียู"). The one exception is the modern-Thai footnote. |
| Numerals | Show all numbers as Thai digits (๐–๙). Store data as Arabic numerals and convert only at render time. |
| Area | ไร่ – งาน – ตารางวา (1 ไร่ = 4 งาน = 400 ตร.วา = 1,600 m²) |
| Length | วา (2 m), ศอก (≈0.5 m), เส้น (20 วา = 40 m) |
| Time | บาท/เพลา (1 บาท = 6 minutes) with minutes in small text |
| Removed on purpose | **No 2H / height-to-road-width rule.** It is replaced by the "ทางหน้าแปลง" rule (road ≥ 5 วา, setback 3 วา). |
| Disclaimer | Footnote in modern Thai: all data is demo data; rules are simplified; directions follow traditional house-building lore |

Keep every string in `src/data/strings.th.ts` (or in the data JSON) so the copy can be edited without touching components.

---

## 3. Interactive map spec (Chapter 2)

### 3.1 Map rendering
- **Projection:** bird's-eye mural view. Use the reference `pj(x,y)` function: plan coordinates 0–1000 × 0–760, compressed toward the top, with scale 0.74 → 1.0 by depth.
- **Billboard objects** (houses, trees, palms, prangs, chedi, forts, junks) stand upright at their projected point and are depth-sorted by y.
- **Static landmarks:** walled island, rivers (Chao Phraya, Pa Sak, Lopburi), canals (คลองท่อ, คลองในไก่, คลองประตูข้าวเปลือก), Royal Palace, Wat Phra Si Sanphet, Wat Phu Khao Thong, ตลาดป่าตะกั่ว, ประตูไชย, ท่าสำเภา.
- **Live layers** above the baked art: water-flow dashes, ambient boats, site flags, lens overlays, moving vehicles and the pop-up model.

### 3.2 Lens 1 — ทำเลที่ตั้ง (Site and 3D massing)
1. The default view shows the whole city with 4 waving red flags and pulsing rings.
2. Clicking a flag animates the camera (viewBox tween, about 1 s, ease-in-out-cubic) to frame that site.
3. A Thai-style massing model then **rises piece by piece**: a dust puff, then walls scaling up from the ground, then roof tiers dropping in with a bounce, staggered 130 ms apart.
4. A **palm-leaf caption** slides up over the map with the site name, a one-line description of the building form, land area, max height, buildable floor area and estimated beds.
5. Leaves below the map show stats, pros and cons, the builder's verdict, and a 4-criterion score bar out of 20.
6. Clicking the same flag again, or "ถอยดูทั้งพระนคร", zooms back out.

Each site has its own massing archetype: a tower on a podium, a riverside hall with a pier, a campus of pavilions, or a low courtyard under a red height-cap line.

### 3.3 Lens 2 — ข้อห้ามแลทิศ (Land rules and auspicious direction)
- **Map overlays:** the 25-เส้น palace height zone (8 วา cap), the flood-plain hatch, the river setback line, a ground compass rose, and on the selected parcel the setback hatch, the buildable line and a "หน้าโรง" direction arrow (green if auspicious, red if not).
- **Clickable seals** สูง · น้ำ · ร่น · ทาง · ทิศ each open a rule leaf.
- **Detail leaves:** a rule table, a parcel plan with setbacks in วา, and a **ทักษาทิศ 8-direction rose** with a verdict and a fix.
- **Direction lore:** patient bed heads face บูรพา/ทักษิณ (never ประจิม); shrine to the อีสาน; kitchen and medicine stove to the อาคเนย์; morgue to the ประจิม; medical library to the อุดร. Point out that the lore matches the climate: the west side takes the hot afternoon sun.

### 3.4 Lens 3 — ทางสัญจร (Transport)
- 4 modes with distinct line styles: walking (dotted brown), courier horse (dashed red), elephant (solid ochre with a shadow, drawn in), boat (long-dash teal).
- **Animated vehicles** travel each route in a loop, at a speed proportional to the mode, and flip horizontally when heading left.
- Each destination is marked with a small pennant.
- Detail leaves hold the mode toggles and a travel-time table (distance in เส้น, time in บาท and minutes). Each mode is mapped to its modern hospital equivalent: OPD walk-in, emergency, logistics and service, medical tourism.

---

## 4. Visual direction — the "aged mural" system

This is what separates a draft from a finished piece. Treat it as a requirement, not polish.

### 4.1 Palette (lime plaster and faded mineral pigments)
`plaster #e6d9ba` · `cinnabar #a04a33 / #743524` · `gold #b48a40 / #c09246` · `ink #3a2819` · `leaf #e1c992 → #cdb072` · `celadon rock #c9d1c2 → #6f8579` · `water #9fb4a8` · `foliage #4e6a48 / #88a275`

### 4.2 Typography (Google Fonts, with fallbacks)
- Display: **Srisakdi** (titles, chapter heads, seals)
- Palm-leaf script: **Charm** (all leaf body text)
- Data and tables: **Taviraj**

### 4.3 Old-paint pipeline (critical technique)
SVG filters are too slow to run live while zooming. **Bake once, then animate on top:**
1. Compose the static art as an SVG string.
2. Wrap it in a single heavy filter: `feDisplacementMap` for brush wobble, a low-frequency multiply for mottled pigment, a high-frequency multiply for grain, and a thresholded noise merge of plaster colour for **flaking and loss**.
3. Add post-layers on top: stains, haze patches, procedural cracks (a random walk with a light offset copy), damp darkening at the bottom, and a vignette.
4. Rasterise to `<canvas>` at 2–2.4× resolution, export as JPEG at quality 0.9, and place it as an `<image>`.
5. Draw the live elements (flags, models, vehicles, figures) **above** the baked image with a *light* filter (wobble and grain only).
6. Show "ช่างกำลังลงสีแผนที่…" while baking.

**Tuning knob:** expose one `AGE_LEVEL` (0–3) that scales flake density, stain opacity and crack count. v3 shipped at about level 1.5. At level 3 it looked like snowfall, so avoid that.

### 4.4 Painted vocabulary (procedural, seeded RNG so the scene is stable)
- **Trees:** clusters of leaf pads with small light-leaf dabs; also sugar palms.
- **Houses:** stilted, with plank walls and either thatch or tile roofs.
- **Prang** with gradient shading and stacked tiers; **chedi** with a gold spire.
- **Rocks:** layered เขามอ with highlights and moss dots.
- **Water:** mural wave pattern; **clouds:** curled scallops; **fields:** rice ticks with bunds.
- **Figures:** mural style (side face, almond eye, patterned chong kraben, tall lomphok hat for the official).

### 4.5 Palm-leaf (ใบลาน) component
Horizontal fibre noise, age-spot foxing, burnt edges, two string holes, an engraved text shadow and a soft drop shadow. It is used for **every** content block.

---

## 5. Data model (the key to reuse)

All content lives in `public/data/study.json`. Validate it with a schema (zod or JSON Schema) at load time and show a readable Thai error if it is malformed.

```jsonc
{
  "meta": { "title": "ศึกษาทำเลโรงหมอหลวง กรุงศรีอยุธยา", "eraDate": "จุลศักราช ๑๓๘๘", "ageLevel": 1.5 },
  "cast": { "khun": { "name": "ขุนวิเศษสถาปนิก", "role": "นายช่างหลวง" }, "mor": { ... }, "phon": { ... } },
  "story": [ { "speaker": "mor", "text": "..." }, { "speaker": "khun", "text": "..." } ],
  "sites": [
    {
      "id": "A", "n": 1, "name": "กลางเกาะ ย่านป่าตะกั่ว",
      "pos": [560, 400], "parcelPx": [56, 42],
      "desc": "...", "form": "...", "say": "...",
      "pros": ["..."], "cons": ["..."], "verdict": "...",
      "score": { "loc": 5, "reg": 3, "acc": 4, "grow": 2 },
      "land_m2": 19200,
      "rules": { "dims_m": [160,120], "road_m": 16, "roadSide": "bottom", "roadSetback_m": 6,
                 "water": { "name": "คลองประตูข้าวเปลือก", "setback_m": 3, "side": "right" },
                 "far": 5, "heightCap_m": null, "maxHeight_m": 68, "floodSok": 1,
                 "gfaAllow_m2": 96000, "gfa_m2": 96000, "flags": [["ok","..."],["warn","..."]] },
      "astro": { "front": "ทักษิณ", "good": true, "text": "...", "fix": "..." },
      "massing": "tower-podium",
      "routes": { "walk": [[560,400],[560,340],[520,340]], "horse": [...], "ele": [...], "boat": [...] },
      "transportNote": "..."
    }
  ],
  "zones": [ { "id": "palace", "seal": "สูง", "pos": [430,150], "title": "...", "text": "...", "tags": ["..."] } ],
  "modes": { "walk": { "name": "เดินเท้า", "senPerBaht": 10, "equiv": "เทียบ: ผู้ป่วยนอก" }, ... },
  "resolution": ["...", "...", "..."],
  "comingSoon": ["...", "..."]
}
```

- **Store SI units** (m, m²). Convert to วา, ไร่-งาน-ตร.วา and Thai digits only in the view.
- `massing` names an archetype from a registry: `tower-podium`, `riverside-hall`, `pavilion-campus`, `low-courtyard`. Adding one means adding one function.
- Beds = `gfa_m2 / 130` by default; make the divisor configurable in `meta`.

---

## 6. Architecture

| Layer | Choice | Why |
|---|---|---|
| Build | **Vite + TypeScript**, no UI framework (or Preact if state grows) | The page is mostly SVG strings plus small state; the bundle stays tiny |
| Structure | `src/render/` (projection, primitives, mural-filter, bake), `src/scenes/` (hero, story, map, summary), `src/ui/` (leaves, tabs, narrator), `src/data/` (schema, loader, units) | Clear seams for review |
| State | One store: `{ lens, siteId, zoneId, modes }`, synced to the URL hash | Deep links |
| Animation | CSS keyframes plus one `requestAnimationFrame` loop for vehicles and boats | Already proven in v3 |
| Tests | Vitest for `units.ts` (วา, ไร่-งาน-ตร.วา, Thai digits, บาท) and the schema; one Playwright smoke test (load, click a flag, model appears, switch lens, no console errors) | The logic that must not regress |
| Assets | Inline SVG only; fonts from Google Fonts with fallbacks; no external images | Self-contained and fast |

### Shareability features
1. **Deep links:** `#site-A`, `#lens-reg-B`, `#lens-tr-C`. Opening a link restores the view and zoom.
2. **Copy-link button** on each site caption ("คัดลอกลิงก์ทำเลนี้").
3. **Open Graph preview image**: a pre-rendered 1200×630 PNG of the hero, generated in a build step with Playwright.
4. **"บันทึกภาพแผนที่"**: export the current map view as a PNG via canvas.
5. **Mobile:** single column, map fits the width, caption leaf goes under the map, tabs stack.
6. **Reduced motion:** with `prefers-reduced-motion`, stop all loops and skip the tweens.

### Deployment (choose one at decision point D3)
- **GitHub Pages:** free; make the repo private with Pages restricted if your plan supports it.
- **Vercel or Netlify:** preview URLs per branch and password protection on paid tiers.
- **Single-file export:** `vite-plugin-singlefile` builds one HTML file you can email or publish as a Claude artifact.

---

## 7. Accessibility and quality bar
- Every flag and seal is focusable and works with Enter/Space; each has an `aria-label` in Thai.
- The narrator region uses `aria-live="polite"`.
- Text contrast on palm leaves is ≥ 4.5:1; check it after the aging overlay.
- No horizontal page scroll at 375 px; tables scroll inside their own leaf.
- Lighthouse performance ≥ 85 on desktop; the map bake finishes in < 2 s on a mid-range laptop.

---

## 8. Acceptance checklist
- [ ] Hero, Chapter 1 scene and map all show visible paint texture, flaking, cracks and stains (not flat vector).
- [ ] Only 2 dialogue leaves in Chapter 1; the map narrator says one sentence per click.
- [ ] Clicking each of the 4 flags zooms in, the model rises in stages and the caption leaf appears.
- [ ] Lens 2 shows the 5 seals, parcel setbacks in วา and the 8-direction rose with the correct verdict per site.
- [ ] Lens 3 shows 4 moving vehicle types; the toggles work; times show in บาท and minutes.
- [ ] No English or Arabic numerals anywhere except the modern footnote.
- [ ] No 2H rule anywhere.
- [ ] Replacing `study.json` with a different 4-site file works with no code change.
- [ ] Deep links restore state; the OG image appears when the link is pasted into LINE or Slack.
- [ ] Playwright smoke test passes with zero console errors.

---

## 9. Phased roadmap with decision points

| Phase | Output | Decision point |
|---|---|---|
| **P0 — Port** | Vite project; the reference split into modules; runs identically to v3 | **D1:** Vanilla TS or Preact? (Default: vanilla) |
| **P1 — Data-drive** | `study.json` plus schema; all strings and numbers moved out of code; unit tests | **D2:** Keep demo data public, or prepare a private real-data variant? |
| **P2 — Polish** | `AGE_LEVEL` knob, better figures, model archetype registry, mobile pass | Review the visual look together before P3 |
| **P3 — Share** | Deep links, copy-link, PNG export, OG image, deploy | **D3:** Hosting choice and access control |
| **P4 — Bridge** | "ดูฉบับเต็ม" button linking to the real Test Fit Dashboard; optional Project D data variant behind a password | **D4:** What real data, if any, may leave the company network? |

---

## 10. Risks and blind spots

| Risk | Why it matters | Mitigation |
|---|---|---|
| **Confidential data on a public URL** | If real land, area or IRR figures go into `study.json` and deploy publicly, that is a disclosure risk | Keep the public build on demo data only; real data goes in a separate, access-controlled deploy |
| **Style over substance** | Stakeholders may remember the elephant, not the analysis | Every lens ends in a clear verdict and a number; the summary table is the payoff |
| **Pseudo-historical language** | Native readers may find the Ayutthaya phrasing forced | Get one proofread by a Thai-literate reviewer before external use |
| **Bake performance on weak devices** | Heavy filters can take several seconds on old phones | Bake at a lower scale on mobile (1.5×); cache the result in memory |
| **Font blocking** | Corporate networks may block Google Fonts | Self-host the three fonts in `/public/fonts` for the production build |
| **Scope creep into the real dashboard** | The teaser is not the tool | Hard-stop at P4; the full Test Fit Dashboard stays a separate project |

---

## 11. CLAUDE.md to create in the repo

```md
# Ayudha Site Intelligence
- Read BUILD_BRIEF.md before any change. reference-v3.html is the visual source of truth.
- Thai-only UI, Ayutthaya flavour; Thai digits in views; SI units in data.
- Never add the 2H rule. Never add English UI text.
- All content comes from public/data/study.json, never hard-coded.
- Static art is baked once through the mural filter; live elements sit above it with the light filter.
- Run `npm test` and the Playwright smoke test before saying a task is done.
- Work phase by phase (BUILD_BRIEF §9). Stop at each decision point and ask.
```

---

## 12. Kickoff prompt (paste into Claude Code)

```
Read BUILD_BRIEF.md and reference-v3.html in full.

Goal: rebuild the reference as a maintainable, data-driven, shareable static web app,
exactly as specified in the brief. Keep the reference's look and behaviour; do not
redesign it.

Start with Phase P0 only:
1. Use plan mode first. Propose the folder structure and module split, and how you
   will move each part of reference-v3.html (projection, primitives, mural bake,
   scenes, UI leaves, state) into it.
2. After I approve, scaffold Vite + TypeScript, port the code, and create CLAUDE.md
   from §11.
3. Run it, take one screenshot each of the hero, the map, and the map after
   clicking flag 1, and compare them with the reference.
4. Stop at decision point D1 and summarise what changed, what still differs, and
   what is next.

Rules: Thai-only UI, Thai digits, no 2H rule, no English UI copy. Ask before adding
any dependency beyond Vite, TypeScript, zod, Vitest and Playwright.
```

**Follow-up prompts, one per phase:**
- P1: `Proceed to P1. Move all content into public/data/study.json with a zod schema and unit tests for units.ts. Prove it by swapping in a test file with different site names.`
- P2: `Proceed to P2. Add the AGE_LEVEL knob (0–3) and the massing archetype registry, and do a mobile pass at 375 px. Show me screenshots at age 1 and 2.`
- P3: `Proceed to P3. Add deep links, copy-link, PNG export and an OG image build step. Then ask me D3 before deploying.`
