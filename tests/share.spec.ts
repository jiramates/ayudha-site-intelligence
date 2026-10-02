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

test('map export downloads a non-empty PNG of the current view', async ({ page }) => {
  await page.goto('/#site-A'); await expect(page.locator('#loading')).toBeHidden({ timeout: 30000 })
  await page.waitForTimeout(1500)
  await expect(page.locator('#saveMap')).toHaveText('บันทึกภาพแผนที่')
  const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('#saveMap').click()])
  expect(dl.suggestedFilename()).toBe('ayudha-map-site-A.png')
  const buf = readFileSync((await dl.path()) as string)
  expect(buf.length).toBeGreaterThan(100_000)
  expect([...buf.subarray(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  expect(buf.readUInt32BE(16)).toBe(2000) // width
  expect(buf.readUInt32BE(20)).toBeGreaterThan(1000) // height follows the zoomed view
  await expect(page.locator('#mapStatus')).toHaveText('บันทึกภาพแล้ว')
})
