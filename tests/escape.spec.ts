import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'

const PAYLOAD = (s: string) => `<img src=x onerror="window.__xss=1"><u class="xss">${s}</u>`
const TEXT_KEYS = new Set(['name', 'short', 'desc', 'form', 'say', 'verdict', 'transportNote', 'text', 'fix', 'title', 'seal', 'role', 'meaning', 'equiv',
  'loc', 'reg', 'acc', 'grow', 'label'])
const LIST_KEYS = new Set(['pros', 'cons', 'tags', 'resolution', 'comingSoon'])

function taint(o: unknown, key = ''): unknown {
  if (typeof o === 'string') return TEXT_KEYS.has(key) ? PAYLOAD(o) : o
  if (Array.isArray(o)) {
    if (LIST_KEYS.has(key)) return o.map(x => (typeof x === 'string' ? PAYLOAD(x) : x))
    if (key === 'flags') return o.map(([k, t]: [string, string]) => [k, PAYLOAD(t)])
    return o.map(x => taint(x, key))
  }
  if (o && typeof o === 'object') return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, taint(v, k)]))
  return o
}

test('markup in study.json text is shown as text, never executed', async ({ page }) => {
  const data = taint(JSON.parse(readFileSync('public/data/study.json', 'utf-8')))
  const errors: string[] = []
  page.on('pageerror', e => errors.push(e.message))
  await page.route('**/data/study.json', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) }))
  await page.goto('/')
  await expect(page.locator('#loading')).toBeHidden({ timeout: 30000 })

  for (const id of ['A', 'B', 'C', 'D']) {
    await page.locator(`.site[data-site="${id}"]`).first().dispatchEvent('click')
    await page.locator('#t-reg').click()
    for (const z of ['palace', 'flood', 'river', 'road', 'astro']) await page.locator(`.zic[data-zone="${z}"]`).dispatchEvent('click')
    await page.locator('#t-tr').click()
    await page.locator('.tab[data-mode="site"]').click()
  }
  expect(await page.locator('.xss').count()).toBe(0)
  expect(await page.locator('img[onerror]').count()).toBe(0)
  expect(await page.evaluate(() => (window as unknown as { __xss?: number }).__xss)).toBeUndefined()
  // the payload is visible as plain text instead
  expect(await page.evaluate(() => document.body.innerText)).toContain('<u class="xss">')
  expect(errors).toEqual([])
})
