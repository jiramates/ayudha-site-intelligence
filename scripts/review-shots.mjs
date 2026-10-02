// node scripts/review-shots.mjs <phase>  →  review/<phase>-age1-*.jpg, <phase>-age2-*.jpg, <phase>-mobile-map.jpg
// Needs a build in dist/. Age level is changed by rewriting meta.ageLevel in the served study.json (no code switch).
import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import { readFileSync, mkdirSync, existsSync } from 'node:fs'

const phase = process.argv[2] ?? 'p2'
const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(existsSync)
mkdirSync('review', { recursive: true })
const server = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], { stdio: 'ignore' })
await new Promise(r => setTimeout(r, 2500))
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] })
const base = JSON.parse(readFileSync('public/data/study.json', 'utf-8'))
const jpg = { type: 'jpeg', quality: 88 }

async function open(viewport, age, mobile = false) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile })
  const data = { ...base, meta: { ...base.meta, ageLevel: age } }
  await page.route('**/data/study.json', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) }))
  await page.goto('http://localhost:4173/')
  await page.waitForFunction(() => document.getElementById('loading')?.hidden === true, null, { timeout: 30000 })
  await page.waitForTimeout(1200)
  return page
}

for (const age of [1, 2]) {
  const p = await open({ width: 1280, height: 900 }, age)
  await p.screenshot({ path: `review/${phase}-age${age}-hero.jpg`, ...jpg })
  await p.locator('#mapbox').scrollIntoViewIfNeeded()
  await p.waitForTimeout(500)
  await p.locator('#mapbox').screenshot({ path: `review/${phase}-age${age}-map.jpg`, ...jpg })
  await p.close()
}

const m = await open({ width: 375, height: 812 }, base.meta.ageLevel, true)
await m.locator('.site[data-site="A"]').first().dispatchEvent('click')
await m.waitForTimeout(2800)
const clip = await m.evaluate(() => {
  const t = document.querySelector('.tabs').getBoundingClientRect(), c = document.getElementById('cap').getBoundingClientRect()
  return { x: 0, y: t.top + scrollY, width: 375, height: c.bottom - t.top + 12 }
})
await m.screenshot({ path: `review/${phase}-mobile-map.jpg`, fullPage: true, clip, ...jpg })
await browser.close(); server.kill()
console.log('screenshots written to review/')
