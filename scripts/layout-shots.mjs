// node scripts/layout-shots.mjs [outDir]  — screenshots of the map (site A) and the summary at the phone/desktop sizes.
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
const sizes = [[1920, 1080], [1366, 768], [390, 844], [844, 390]]
for (const [w, h] of sizes) {
  const phone = w < 900
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: phone ? 2 : 1, isMobile: phone, hasTouch: phone })
  await p.goto('http://localhost:4173/#site-A')
  await p.waitForFunction(() => document.getElementById('loading')?.hidden === true, null, { timeout: 30000 })
  await p.waitForTimeout(3000); await settle(p)
  await p.screenshot({ path: `${out}/${w}x${h}-map-A.jpg`, type: 'jpeg', quality: 86 })
  await p.evaluate(() => document.querySelector('.s1').scrollIntoView({ behavior: 'instant' }))
  await p.waitForTimeout(700); await settle(p)
  await p.screenshot({ path: `${out}/${w}x${h}-story.jpg`, type: 'jpeg', quality: 86 })
  await p.evaluate(() => document.querySelector('.s3').scrollIntoView({ behavior: 'instant' }))
  await p.waitForTimeout(700); await settle(p)
  await p.screenshot({ path: `${out}/${w}x${h}-summary.jpg`, type: 'jpeg', quality: 86 })
  await p.close()
}
await browser.close(); server.kill()
console.log('written to', out)
