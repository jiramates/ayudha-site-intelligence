import { test, expect } from '@playwright/test'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const phase = JSON.parse(readFileSync('package.json', 'utf-8')).ayudhaPhase as string
const file = resolve('review', `ayudha-${phase}.html`)
const url = (hash = '') => 'file://' + file + hash

test.skip(!existsSync(file), `run npm run build:single first (review/ayudha-${phase}.html)`)

test.describe('the single-file review build (opened from file://)', () => {
  for (const [hash, mode] of [['#site-A', 'site'], ['#site-D', 'site'], ['#lens-reg-B', 'reg'], ['#lens-tr-C', 'tr']] as const) {
    test(`deep link ${hash}`, async ({ page }) => {
      const errors: string[] = []
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
      page.on('pageerror', e => errors.push(e.message))
      await page.goto(url(hash))
      await expect(page.locator('#loading')).toBeHidden({ timeout: 30000 })
      expect(await page.locator('.tab[aria-selected="true"]').getAttribute('data-mode')).toBe(mode)
      expect(await page.evaluate(() => location.hash)).toBe(hash)
      if (mode === 'site') await expect(page.locator('#cap')).toBeVisible()
      expect(errors).toEqual([])
    })
  }

  test('copy link gives a link or selects it, and the map exports a JPEG', async ({ page }) => {
    await page.goto(url('#site-B'))
    await expect(page.locator('#loading')).toBeHidden({ timeout: 30000 })
    await page.waitForTimeout(1500)
    await page.locator('[data-copy]').click()
    await expect(page.locator('.copied')).not.toHaveText('')
    const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('#saveMap').click()])
    expect(dl.suggestedFilename()).toBe('ayudha-map-site-B.jpg')
    expect(readFileSync((await dl.path()) as string).length).toBeGreaterThan(100_000)
  })

  test('back and forward work between lenses', async ({ page }) => {
    await page.goto(url('#site-A'))
    await expect(page.locator('#loading')).toBeHidden({ timeout: 30000 })
    await page.locator('#t-reg').click()
    expect(await page.evaluate(() => location.hash)).toBe('#lens-reg-A')
    await page.goBack()
    expect(await page.evaluate(() => location.hash)).toBe('#site-A')
    await expect(page.locator('#cap')).toBeVisible()
  })
})
