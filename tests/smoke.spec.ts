import { test, expect } from '@playwright/test'

test('load, click flag, model rises, switch lens, no console errors, Thai-only text', async ({ page }) => {
  const errors: string[] = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', e => errors.push(e.message))
  const external: string[] = []
  page.on('request', r => { const u = new URL(r.url()); if (u.hostname !== 'localhost' && u.protocol.startsWith('http')) external.push(r.url()) })

  await page.goto('/')
  await expect(page.locator('#loading')).toBeHidden({ timeout: 30000 })
  await expect(page.locator('.site[data-site]')).toHaveCount(4)

  await page.locator('.site[data-site="A"]').first().dispatchEvent('click')
  await expect(page.locator('#cap')).toBeVisible()
  await expect(page.locator('#bbs .pop').first()).toBeAttached()
  await expect(page.locator('#zoomOut')).toBeVisible()

  await page.locator('#t-reg').click()
  await expect(page.locator('.zic')).toHaveCount(5)
  await page.locator('#t-tr').click()
  await expect(page.locator('#tokens > g')).toHaveCount(4)

  // no Arabic digits / Latin letters in visible text (the page has no English UI copy)
  const text = await page.evaluate(() => document.body.innerText)
  expect(text.match(/[0-9A-Za-z]/g) ?? []).toEqual([])
  expect(errors).toEqual([])

  // self-hosted fonts really load (no external requests, no fallback)
  const fonts = await page.evaluate(async () => {
    await document.fonts.ready
    return ['Srisakdi', 'Charm', 'Taviraj'].map(f => [f, [...document.fonts].some(ff => ff.family.replace(/"/g, '') === f && ff.status === 'loaded')])
  })
  expect(fonts).toEqual([['Srisakdi', true], ['Charm', true], ['Taviraj', true]])
  expect(external).toEqual([])
})
