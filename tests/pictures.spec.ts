import { test, expect, type Page } from '@playwright/test'

/** how many pixels the overlay canvas has drawn, and whether two moments differ */
const painted = (page: Page, id: string) => page.locator(`#${id} canvas`).evaluate((c: HTMLCanvasElement) => {
  const g = c.getContext('2d') as CanvasRenderingContext2D
  const d = g.getImageData(0, 0, c.width, c.height).data
  let n = 0, sum = 0
  for (let i = 3; i < d.length; i += 16) if (d[i] > 0) { n++; sum += d[i - 3] + d[i - 2] * 3 + d[i - 1] * 7 + i }
  return { n, sum }
})
const ready = async (page: Page) => {
  await page.goto('/')
  await expect(page.locator('#loading')).toBeHidden({ timeout: 30000 })
}

test('the cover and the chapter 1 painting are the exact images, and they move', async ({ page }) => {
  await ready(page)
  for (const [id, w] of [['cover', 1055], ['planners', 1538]] as const) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    const img = page.locator(`#${id} img`)
    await expect(img).toHaveAttribute('alt', /.+/)
    await expect.poll(() => img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true)
    expect(await img.evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeLessThanOrEqual(w)
    await expect.poll(async () => (await painted(page, id)).n, { timeout: 8000 }).toBeGreaterThan(200)
    const a = await painted(page, id)
    await page.waitForTimeout(700)
    expect((await painted(page, id)).sum, `${id} keeps moving`).not.toBe(a.sum)
  }
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })
  test('the paintings stay still: nothing is drawn over them', async ({ page }) => {
    await ready(page)
    await page.waitForTimeout(2500)
    expect((await painted(page, 'cover')).n).toBe(0)
    await expect(page.locator('#coverImg')).toBeVisible()
  })
})

/** the moving strips must be cut from the right place: where the canvas paints opaque pixels they match the painting beneath */
const offset = (page: Page, id: string) => page.locator(`#${id}`).evaluate(async (box: HTMLElement) => {
  const img = box.querySelector('img') as HTMLImageElement, c = box.querySelector('canvas') as HTMLCanvasElement
  const ref = document.createElement('canvas'); ref.width = c.width; ref.height = c.height
  const r = ref.getContext('2d') as CanvasRenderingContext2D
  r.drawImage(await createImageBitmap(img), 0, 0, c.width, c.height)
  const a = (c.getContext('2d') as CanvasRenderingContext2D).getImageData(0, 0, c.width, c.height).data, b = r.getImageData(0, 0, c.width, c.height).data
  let n = 0, diff = 0
  for (let i = 0; i < a.length; i += 4 * 7) if (a[i + 3] === 255) { n++; diff += Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) }
  return { n, mean: diff / Math.max(1, n) / 3 }
})
for (const [w, h, dpr] of [[390, 844, 2], [1366, 768, 1]] as const) {
  test.describe(`${w}×${h} @${dpr}x`, () => {
    test.use({ viewport: { width: w, height: h }, deviceScaleFactor: dpr })
    test('the moving parts line up with the painting (also with the smaller phone copy)', async ({ page }) => {
      await ready(page)
      for (const id of ['cover', 'planners']) {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded()
        await expect.poll(async () => (await painted(page, id)).n, { timeout: 8000 }).toBeGreaterThan(200)
        const o = await offset(page, id)
        expect(o.n).toBeGreaterThan(100)
        expect(o.mean, `${id}: mean colour difference under the moving strips`).toBeLessThan(18)
      }
    })
  })
}
