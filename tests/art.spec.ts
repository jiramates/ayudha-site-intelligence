import { test, expect, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'

const base = JSON.parse(readFileSync('public/data/study.json', 'utf-8'))
const serve = (page: Page, data: unknown) =>
  page.route('**/data/study.json', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) }))

async function art(page: Page) {
  await page.goto('/')
  await expect(page.locator('#loading')).toBeHidden({ timeout: 60000 })
  await page.waitForTimeout(500)
  return page.evaluate(() => window.__art)
}

test('the demo uses the prebaked art (fast start); stale art would show up here as "baked"', async ({ page }) => {
  expect(await art(page)).toEqual({ hero: 'prebaked', scene: 'prebaked', map: 'prebaked' })
})

test('another age level bakes in the browser and still looks right (the knob keeps working)', async ({ page }) => {
  await serve(page, { ...base, meta: { ...base.meta, ageLevel: 1 } })
  expect(await art(page)).toEqual({ hero: 'baked', scene: 'baked', map: 'baked' })
  await expect(page.locator('#art image')).toHaveCount(1)
})

test('moving a site makes the map art stale, so it is baked again; the other scenes stay prebaked', async ({ page }) => {
  const moved = JSON.parse(JSON.stringify(base))
  moved.sites[0].pos = [540, 410]
  await serve(page, moved)
  expect(await art(page)).toEqual({ hero: 'prebaked', scene: 'prebaked', map: 'baked' })
})

test('the page is ready quickly with prebaked art (no long main-thread task over 300 ms)', async ({ page }) => {
  await page.addInitScript(() => {
    ;(window as unknown as { __lt: number[] }).__lt = []
    new PerformanceObserver(l => l.getEntries().forEach(e => (window as unknown as { __lt: number[] }).__lt.push(e.duration))).observe({ entryTypes: ['longtask'] })
  })
  await page.goto('/')
  await expect(page.locator('#loading')).toBeHidden({ timeout: 60000 })
  await page.waitForTimeout(500)
  const longest = await page.evaluate(() => Math.max(0, ...(window as unknown as { __lt: number[] }).__lt))
  expect(longest).toBeLessThan(300)
})
