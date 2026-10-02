import { test, expect, type Page } from '@playwright/test'

const SIZES: [number, number][] = [[1920, 1080], [1366, 768], [1280, 720], [768, 1024], [390, 844], [375, 667], [844, 390], [390, 700], [375, 600]]
const DESIGNATED = '.sheet-body, .pages, .page, .scroll, .diag, #side, .duo'

async function ready(page: Page) {
  await expect(page.locator('#loading')).toBeHidden({ timeout: 30000 })
  await page.waitForTimeout(600)
}
/** wait until smooth scrolling and snapping have stopped */
async function settle(page: Page) {
  let last = -1
  for (let i = 0; i < 40; i++) {
    const y = await page.evaluate(() => scrollY)
    if (y === last) return
    last = y
    await page.waitForTimeout(200)
  }
}
const toSection = async (page: Page, sel: string) => {
  await page.evaluate(s => (document.querySelector(s) as HTMLElement).scrollIntoView({ behavior: 'instant' }), sel)
  await settle(page)
}
const rect = (page: Page, sel: string) => page.locator(sel).first().evaluate(e => { const r = e.getBoundingClientRect(); return { top: r.top, left: r.left, right: r.right, bottom: r.bottom } })
async function inside(page: Page, sel: string, label = sel) {
  const r = await rect(page, sel), vw = page.viewportSize()!.width, vh = page.viewportSize()!.height
  expect(r.top, `${label} top`).toBeGreaterThanOrEqual(-1)
  expect(r.left, `${label} left`).toBeGreaterThanOrEqual(-1)
  expect(r.right, `${label} right`).toBeLessThanOrEqual(vw + 1)
  expect(r.bottom, `${label} bottom`).toBeLessThanOrEqual(vh + 1)
}

/** vertical gap above each block, measured to the nearest block above that overlaps it sideways */
async function gaps(page: Page, sec: string, blocks: string[]) {
  return page.evaluate(([sec, blocks]) => {
    const rs = blocks.flatMap(b => Array.from(document.querySelectorAll<HTMLElement>(`${sec} ${b}`)))
      .filter(e => e.offsetParent !== null).map(e => e.getBoundingClientRect()).filter(r => r.height > 0)
    const secBox = (document.querySelector(sec) as HTMLElement).getBoundingClientRect()
    const first = Math.min(...rs.map(r => r.top))
    const out: number[] = []
    for (const r of rs) {
      if (r.top <= first + 1) continue
      const above = rs.filter(o => o !== r && o.bottom <= r.top + 1 && Math.min(o.right, r.right) - Math.max(o.left, r.left) > 20)
      if (above.length) out.push(r.top - Math.max(...above.map(o => o.bottom)))
    }
    return { gaps: out, tail: secBox.bottom - Math.max(...rs.map(r => r.bottom)) }
  }, [sec, blocks] as [string, string[]])
}

for (const [w, h] of SIZES) {
  const phone = w < 900
  const portrait = h > w
  test.describe(`${w}×${h}`, () => {
    test.use({ viewport: { width: w, height: h }, isMobile: phone, hasTouch: phone })

    test('every section fits one screen; the map is fully visible; nothing scrolls except the designated panels', async ({ page }) => {
      await page.goto('/'); await ready(page)

      // section heights, no horizontal page scroll
      const heights = await page.locator('.screen').evaluateAll(els => els.map(e => e.getBoundingClientRect().height))
      expect(heights).toHaveLength(4)
      for (const hh of heights) expect(hh).toBeLessThanOrEqual(h + 1)
      // only the map section (and the hero painting) fill the screen; the others take their content's height
      expect(heights[2], 'map section = one screen').toBeGreaterThanOrEqual(h - 1)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)

      // hero
      await toSection(page, '.hero')
      await inside(page, '.hero-t'); await inside(page, '.hero .frame')
      if (portrait) expect(heights[0], 'phone hero ≈ 88svh').toBeLessThanOrEqual(h * 0.9)

      // chapter 1: the scene and both lines are on screen
      await toSection(page, '.s1')
      await inside(page, '.s1 .frame')
      if (await page.locator('.duo[data-swipe]').count()) await inside(page, '.duo') // swipe pair: the first leaf and its neighbour peeking
      else { await inside(page, '.duo .leaf:first-child'); await inside(page, '.duo .leaf:last-child') }

      // chapter 2: tabs, the whole map and the narrator
      await toSection(page, '#mapsec')
      await inside(page, '.tabs'); await inside(page, '#mapbox'); await inside(page, '#narr')
      await page.locator('.site[data-site="A"]').first().dispatchEvent('click')
      await page.waitForTimeout(1500)
      await inside(page, '#mapbox')
      if (!portrait) await inside(page, '#cap') // the caption stays inside the map frame
      if (!portrait) {
        const [c, m] = await Promise.all([rect(page, '#cap'), rect(page, '#mapbox')])
        expect(c.left).toBeGreaterThanOrEqual(m.left - 1); expect(c.right).toBeLessThanOrEqual(m.right + 1)
        expect(c.top).toBeGreaterThanOrEqual(m.top - 1); expect(c.bottom).toBeLessThanOrEqual(m.bottom + 1)
      }

      // chapter 3: tabs/dots and the first page
      await toSection(page, '.s3')
      await inside(page, '.s3 .top'); await inside(page, '.page[data-page="0"] .leaf')
      // on desktop-sized screens the whole comparison table fits without sideways scrolling
      if (w >= 1280) expect(await page.locator('.page[data-page="0"] .scroll').evaluate(e => e.scrollWidth <= e.clientWidth + 1)).toBe(true)
      for (const i of [1, 2, 3]) {
        await page.evaluate(n => document.querySelectorAll<HTMLElement>('.page')[n].scrollIntoView({ behavior: 'instant', inline: 'start', block: 'nearest' }), i)
        await settle(page); await page.waitForTimeout(400) // the pager eases to the new page's height
        await inside(page, `.page[data-page="${i}"] .leaf`)
      }

      // nothing scrolls except the designated panels (the page itself scrolls vertically, section by section)
      const rogue = await page.evaluate(sel => {
        const bad: string[] = []
        for (const e of Array.from(document.querySelectorAll<HTMLElement>('body *'))) {
          if (e.closest(sel)) continue
          const cs = getComputedStyle(e)
          if (!/(auto|scroll)/.test(cs.overflowX + cs.overflowY)) continue
          if (e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1) bad.push(e.tagName + '.' + e.className)
        }
        return bad
      }, DESIGNATED)
      expect(rogue).toEqual([])

      // no leaf spills over its own box (text is never cut off inside a leaf outside the scrolling panels)
      const spill = await page.evaluate(sel => Array.from(document.querySelectorAll<HTMLElement>('.leaf')).filter(l => !l.closest(sel) && l.offsetParent !== null && (l.scrollHeight > l.clientHeight + 2 || l.scrollWidth > l.clientWidth + 2)).map(l => l.className + ':' + (l.textContent ?? '').slice(0, 20)), DESIGNATED)
      expect(spill).toEqual([])
    })

    test('content is packed: even gaps inside each section, no big empty space', async ({ page }) => {
      await page.goto('/'); await ready(page)
      const secs: [string, string[]][] = [
        ['.s1', ['.top', '.stagecell .frame', '.duo > .leaf']],
        ['.s3', ['.top', '.pages', '.dots']],
      ]
      for (const [sec, blocks] of secs) {
        await toSection(page, sec)
        const g = await gaps(page, sec, blocks)
        for (const x of g.gaps) expect(x, `${sec} gap`).toBeLessThanOrEqual(48)
        expect(g.tail, `${sec} empty space below the content`).toBeLessThanOrEqual(48)
      }
      // gaps between sections
      const between = await page.locator('.screen').evaluateAll(els => els.slice(1).map((e, i) => e.getBoundingClientRect().top - els[i].getBoundingClientRect().bottom))
      for (const [i, x] of between.entries()) expect(x, `between sections ${i}`).toBeLessThanOrEqual(i === 0 ? 40 : 48)
    })

    test('a deep link scrolls to the map and fits it on screen', async ({ page }) => {
      await page.goto('/#site-A'); await ready(page); await settle(page)
      await expect.poll(async () => Math.abs((await rect(page, '#mapsec')).top), { timeout: 8000 }).toBeLessThanOrEqual(2)
      await inside(page, '#mapbox')
      await expect(page.locator('#zoomOut')).toBeVisible()
    })

    if (portrait && phone) {
      test('sheet: closed shows one compact row of four site chips; half keeps the selected site visible above the sheet', async ({ page }) => {
        await page.goto('/'); await ready(page); await toSection(page, '#mapsec')
        // closed: the WHOLE map is visible and not overlapped by the sheet; one compact row of four chips docked under the narrator
        const side = await rect(page, '#side'), sideClip = await page.locator('#side').evaluate(e => getComputedStyle(e).clipPath)
        expect(sideClip).not.toBe('none')
        const mapC = await rect(page, '#mapbox'), narrC = await rect(page, '#narr')
        await inside(page, '#mapbox'); await inside(page, '#narr')
        expect(mapC.bottom).toBeLessThanOrEqual(side.top + 1)
        expect(narrC.bottom).toBeLessThanOrEqual(side.top + 1)
        const btns = await page.locator('.peekbtn').evaluateAll(els => els.map(e => { const r = e.getBoundingClientRect(); return [r.top, r.bottom, r.left, r.right] }))
        expect(btns).toHaveLength(4)
        const narrB = narrC.bottom
        for (const [t, b, l, r] of btns) { expect(t).toBeGreaterThan(narrB); expect(b).toBeLessThanOrEqual(h); expect(h - side.top, 'closed strip height').toBeLessThanOrEqual(76); expect(l).toBeGreaterThanOrEqual(0); expect(r).toBeLessThanOrEqual(w) }
        expect(new Set(btns.map(x => Math.round(x[0] / 6))).size, 'one row').toBe(1)

        // tapping a button selects the site exactly like its flag
        await page.locator('.peekbtn[data-peek="C"]').tap()
        expect(await page.evaluate(() => location.hash)).toBe('#site-C')
        await expect(page.locator('#side')).toHaveAttribute('data-pos', 'half')
        await page.waitForTimeout(1800)

        // half: the whole map is above the sheet and the selected site's marker and model are inside it
        const sheetTop = (await rect(page, '#side')).top
        const map = await rect(page, '#mapbox')
        expect(map.bottom).toBeLessThanOrEqual(sheetTop + 1)
        for (const sel of ['#bbs [data-site="C"]', '#bbs .pop']) {
          const r = await rect(page, sel)
          expect(r.top, sel).toBeGreaterThanOrEqual(map.top - 1); expect(r.bottom, sel).toBeLessThanOrEqual(Math.min(map.bottom, sheetTop) + 1)
          expect(r.left, sel).toBeGreaterThanOrEqual(map.left - 1); expect(r.right, sel).toBeLessThanOrEqual(map.right + 1)
        }
        // the caption (with the copy button) sits in the sheet
        await expect(page.locator('#side #cap')).toBeVisible()
      })

      test('sheet: drag the handle through half and full, and back to closed', async ({ page }) => {
        await page.goto('/'); await ready(page); await toSection(page, '#mapsec')
        const handle = (await rect(page, '#sheetHandle'))
        const x = (handle.left + handle.right) / 2, y = (handle.top + handle.bottom) / 2
        const drag = async (dy: number) => { await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x, y + dy / 2, { steps: 4 }); await page.mouse.move(x, y + dy, { steps: 4 }); await page.mouse.up(); await page.waitForTimeout(500) }
        await drag(-(h * 0.9))
        await expect(page.locator('#side')).toHaveAttribute('data-pos', 'full')
        const h2 = await rect(page, '#sheetHandle')
        await page.mouse.move((h2.left + h2.right) / 2, (h2.top + h2.bottom) / 2); await page.mouse.down()
        await page.mouse.move((h2.left + h2.right) / 2, h, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(500)
        await expect(page.locator('#side')).toHaveAttribute('data-pos', 'closed')
        await page.locator('#sheetHandle').click()
        await expect(page.locator('#side')).toHaveAttribute('data-pos', 'half')
      })
    }
  })
}
