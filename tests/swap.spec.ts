import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'

const fixture = readFileSync('tests/fixtures/study.swapped.json', 'utf-8')

test('a swapped study.json renders with no code change', async ({ page }) => {
  const errors: string[] = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', e => errors.push(e.message))
  await page.route('**/data/study.json', r => r.fulfill({ status: 200, contentType: 'application/json', body: fixture }))
  await page.goto('/')
  await expect(page.locator('#loading')).toBeHidden({ timeout: 30000 })
  await expect(page.locator('h1')).toHaveText('ศึกษาทำเลโรงพยาบาลสาธิต กรุงเก่า')
  await expect(page.locator('.site[data-site="A"]').first()).toHaveAttribute('aria-label', 'ทำเล ท่าช้าง ย่านวัดพนัญเชิง')
  await expect(page.locator('#cmp')).toContainText('ใกล้ประตูเมือง ข้างวัดมหาธาตุ')
  await page.locator('.site[data-site="A"]').first().dispatchEvent('click')
  await expect(page.locator('#cap')).toContainText('ท่าช้าง ย่านวัดพนัญเชิง')
  await expect(page.locator('#cap')).toContainText('๑๕ ไร่')
  const text = await page.evaluate(() => document.body.innerText)
  expect(text.match(/[0-9A-Za-z]/g) ?? []).toEqual([])
  expect(errors).toEqual([])
})

test('a malformed study.json shows a readable Thai error, not a blank page', async ({ page }) => {
  const bad = JSON.parse(fixture)
  delete bad.sites[0].rules.road_m
  await page.route('**/data/study.json', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(bad) }))
  await page.goto('/')
  await expect(page.getByRole('alert')).toContainText('ใบลานชำรุด')
  await expect(page.getByRole('alert')).toContainText('sites.0.rules.road_m')
})
