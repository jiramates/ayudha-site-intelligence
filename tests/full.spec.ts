import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'

const base = JSON.parse(readFileSync('public/data/study.json', 'utf-8'))
const withContact = (contact: string) => JSON.stringify({ ...base, meta: { ...base.meta, contact } })

async function open(page: import('@playwright/test').Page, body: string | null) {
  if (body) await page.route('**/data/study.json', r => r.fulfill({ status: 200, contentType: 'application/json', body }))
  await page.goto('/')
  await expect(page.locator('#loading')).toBeHidden({ timeout: 30000 })
  await page.evaluate(() => document.querySelector('.s3')!.scrollIntoView({ behavior: 'instant' }))
  await page.evaluate(() => document.querySelectorAll<HTMLElement>('.page')[3].scrollIntoView({ behavior: 'instant', inline: 'start', block: 'nearest' }))
}

test('the full-version button is hidden while meta.contact is empty (the public demo)', async ({ page }) => {
  await open(page, null)
  await expect(page.locator('#fullBtn')).toBeHidden()
})

test('with a contact line the button opens a palm-leaf note showing it; Esc and the close button dismiss it', async ({ page }) => {
  await open(page, withContact('นัดหมายทางอีเมล demo@example.com'))
  await expect(page.locator('#fullBtn')).toBeVisible()
  await expect(page.locator('#fullBtn')).toHaveText('ขอชมฉบับเต็ม')
  await page.locator('#fullBtn').click()
  const dlg = page.locator('#fullDlg')
  await expect(dlg).toBeVisible()
  await expect(dlg).toContainText('โดยนัดหมาย')
  await expect(dlg).toContainText('demo@example.com')
  await page.keyboard.press('Escape')
  await expect(dlg).toBeHidden()
  await page.locator('#fullBtn').click()
  await page.locator('#fullClose').click()
  await expect(dlg).toBeHidden()
})

test('the contact line is shown as text, never as markup', async ({ page }) => {
  await open(page, withContact('<u class="xss">x</u> ติดต่อ'))
  await page.locator('#fullBtn').click()
  await expect(page.locator('#fullContact')).toContainText('<u class="xss">')
  expect(await page.locator('.xss').count()).toBe(0)
})
