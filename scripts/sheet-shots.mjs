// node scripts/sheet-shots.mjs [outDir] — chapter 2 at 1366×768 and the phone sizes with the sheet closed (peek) and half open.
import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import { mkdirSync, existsSync } from 'node:fs'

const out = process.argv[2] ?? 'review/layout'
mkdirSync(out, { recursive: true })
const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(existsSync)
const server = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], { stdio: 'ignore' })
await new Promise(r => setTimeout(r, 2500))
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] })
const settle = async p => { let last = -1; for (let i = 0; i < 40; i++) { const y = await p.evaluate(() => scrollY); if (y === last) return; last = y; await p.waitForTimeout(250) } }
const open = async (w, h, phone) => {
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: phone ? 2 : 1, isMobile: phone, hasTouch: phone })
  await p.goto('http://localhost:4173/')
  await p.waitForFunction(() => document.getElementById('loading')?.hidden === true, null, { timeout: 30000 })
  await p.waitForTimeout(1500)
  await p.evaluate(() => document.getElementById('mapsec').scrollIntoView({ behavior: 'instant' }))
  await settle(p); await p.waitForTimeout(600)
  return p
}
const d = await open(1366, 768, false)
await d.locator('.site[data-site="A"]').first().dispatchEvent('click'); await d.waitForTimeout(3000)
await d.screenshot({ path: `${out}/p4-1366x768-map.jpg`, type: 'jpeg', quality: 88 })
for (const [w, h] of [[390, 844], [375, 667]]) {
  const p = await open(w, h, true)
  await p.screenshot({ path: `${out}/p4-${w}x${h}-closed.jpg`, type: 'jpeg', quality: 88 })
  await p.locator('.peekbtn[data-peek="A"]').tap()
  await p.waitForTimeout(3200)
  await p.screenshot({ path: `${out}/p4-${w}x${h}-half.jpg`, type: 'jpeg', quality: 88 })
}
await browser.close(); server.kill()
console.log('written to', out)
