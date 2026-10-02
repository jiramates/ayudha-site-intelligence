import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })

test('375 px: no horizontal scroll, caption under the map, tabs stacked', async ({ page }) => {
  const noHScroll = async () =>
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)

  await page.goto('/')
  await expect(page.locator('#loading')).toBeHidden({ timeout: 30000 })
  await noHScroll()

  // tabs stack: each one starts below the previous one
  const tops = await page.locator('.tab').evaluateAll(els => els.map(e => { const r = e.getBoundingClientRect(); return [r.top, r.bottom] }))
  expect(tops).toHaveLength(3)
  expect(tops[1][0]).toBeGreaterThanOrEqual(tops[0][1] - 1)
  expect(tops[2][0]).toBeGreaterThanOrEqual(tops[1][1] - 1)

  // caption leaf sits under the map and inside the screen width
  await page.locator('.site[data-site="A"]').first().dispatchEvent('click')
  await expect(page.locator('#cap')).toBeVisible()
  const box = await page.evaluate(() => {
    const c = document.getElementById('cap')!.getBoundingClientRect(), m = document.getElementById('map')!.getBoundingClientRect()
    return { capTop: c.top, mapBottom: m.bottom, capLeft: c.left, capRight: c.right, w: document.documentElement.clientWidth }
  })
  expect(box.capTop).toBeGreaterThanOrEqual(box.mapBottom - 1)
  expect(box.capLeft).toBeGreaterThanOrEqual(0)
  expect(box.capRight).toBeLessThanOrEqual(box.w)
  await noHScroll()

  for (const tab of ['#t-reg', '#t-tr']) { await page.locator(tab).click(); await noHScroll() }
  // wide tables scroll inside their own leaf
  expect(await page.evaluate(() => { const s = document.querySelector('.cmp')!.parentElement!; return s.scrollWidth > s.clientWidth && getComputedStyle(s).overflowX === 'auto' })).toBe(true)
})
