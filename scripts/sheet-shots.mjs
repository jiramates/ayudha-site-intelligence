// node scripts/sheet-shots.mjs [outDir] — every section at the phone sizes (hero, ch.1, ch.2 closed, ch.2 site A half, ch.3) plus ch.2 at 1366×768.
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
  return p
}
const to = async (p, sel) => { await p.evaluate(s => document.querySelector(s).scrollIntoView({ behavior: 'instant' }), sel); await settle(p); await p.waitForTimeout(500) }
const shot = (p, name) => p.screenshot({ path: `${out}/${name}.jpg`, type: 'jpeg', quality: 88 })

const d = await open(1366, 768, false)
await to(d, '#mapsec')
await d.locator('.site[data-site="A"]').first().dispatchEvent('click'); await d.waitForTimeout(3000)
await shot(d, 'p4-1366x768-map')
for (const [w, h] of [[390, 844], [390, 700]]) {
  const p = await open(w, h, true), n = `p4-${w}x${h}`
  await shot(p, `${n}-1-hero`)
  await to(p, '.s1'); await shot(p, `${n}-2-ch1`)
  await to(p, '#mapsec'); await shot(p, `${n}-3-ch2-closed`)
  await p.locator('.peekbtn[data-peek="A"]').tap(); await p.waitForTimeout(3200)
  await shot(p, `${n}-4-ch2-half`)
  await to(p, '.s3'); await shot(p, `${n}-5-ch3`)
  await p.locator('.lhead').nth(1).tap(); await p.waitForTimeout(600); await shot(p, `${n}-6-ch3-open`)
}
await browser.close(); server.kill()
console.log('written to', out)
