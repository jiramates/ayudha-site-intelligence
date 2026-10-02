import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'

test.describe('copy link', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] })
  test('copies the link to this site', async ({ page }) => {
    await page.goto('/'); await expect(page.locator('#loading')).toBeHidden({ timeout: 30000 })
    await page.locator('.site[data-site="C"]').first().dispatchEvent('click')
    await expect(page.locator('#cap')).toBeVisible()
    await expect(page.locator('[data-copy]')).toHaveText('คัดลอกลิงก์ทำเลนี้')
    await page.locator('[data-copy]').click()
    await expect(page.locator('.copied')).toHaveText('คัดลอกลิงก์แล้ว')
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('http://localhost:4173/#site-C')
    await expect(page.locator('.linkfld')).toBeHidden()
  })
})

test('when the clipboard fails the link is selected instead', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('denied')) }, configurable: true })
  })
  await page.goto('/'); await expect(page.locator('#loading')).toBeHidden({ timeout: 30000 })
  await page.locator('.site[data-site="B"]').first().dispatchEvent('click')
  await page.locator('[data-copy]').click()
  const fld = page.locator('.linkfld')
  await expect(fld).toBeVisible()
  await expect(fld).toHaveValue('http://localhost:4173/#site-B')
  const sel = await fld.evaluate((e: HTMLInputElement) => ({ s: e.selectionStart, e: e.selectionEnd, len: e.value.length, focused: document.activeElement === e }))
  expect(sel).toEqual({ s: 0, e: sel.len, len: sel.len, focused: true })
  await expect(page.locator('.copied')).toContainText('เลือกลิงก์ไว้แล้ว')
})

test('map export downloads a JPEG of the current view, 2000 px wide and under 1.5 MB', async ({ page }) => {
  await page.goto('/#site-A'); await expect(page.locator('#loading')).toBeHidden({ timeout: 30000 })
  await page.waitForTimeout(1500)
  await expect(page.locator('#saveMap')).toHaveText('บันทึกภาพแผนที่')
  const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('#saveMap').click()])
  expect(dl.suggestedFilename()).toBe('ayudha-map-site-A.jpg')
  const buf = readFileSync((await dl.path()) as string)
  expect(buf.length).toBeGreaterThan(100_000)
  expect(buf.length).toBeLessThanOrEqual(1_500_000)
  expect([...buf.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff]) // JPEG
  // size from the SOF marker
  let i = 2, w = 0, h = 0
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue }
    const m = buf[i + 1], len = buf.readUInt16BE(i + 2)
    if (m >= 0xc0 && m <= 0xc3) { h = buf.readUInt16BE(i + 5); w = buf.readUInt16BE(i + 7); break }
    i += 2 + len
  }
  expect(w).toBe(2000)
  expect(h).toBeGreaterThan(1000)
  await expect(page.locator('#mapStatus')).toHaveText('บันทึกภาพแล้ว')
})
