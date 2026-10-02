import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'

const base = JSON.parse(readFileSync('public/data/study.json', 'utf-8'))

async function modelHtml(page: import('@playwright/test').Page, age: number, site: string) {
  const data = { ...base, meta: { ...base.meta, ageLevel: age } }
  await page.route('**/data/study.json', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) }))
  await page.goto('/')
  await expect(page.locator('#loading')).toBeHidden({ timeout: 30000 })
  await page.locator(`.site[data-site="${site}"]`).first().dispatchEvent('click')
  await expect(page.locator('#cap')).toBeVisible()
  return page.locator('#bbs .pop, #bbs .drop').evaluateAll(els => els.map(e => e.outerHTML).join(''))
}

test('the age level changes only the baked paint, never the 3D models', async ({ browser }) => {
  for (const site of ['A', 'C']) {
    const p1 = await browser.newPage(), p2 = await browser.newPage()
    const m1 = await modelHtml(p1, 1, site), m2 = await modelHtml(p2, 2, site)
    expect(m1.length).toBeGreaterThan(500)
    expect(m1).toBe(m2)
  }
})
