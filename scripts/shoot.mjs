// Screenshots hero / full map / map after flag 1, for the built app and for reference-v3.html.
// Usage: npm run build && node scripts/shoot.mjs   (writes shots/{new,ref}-*.png and prints a diff report)
import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const CHROME = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium'].find(existsSync)
const out = resolve('shots'); mkdirSync(out, { recursive: true })
const server = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], { stdio: 'ignore' })
await new Promise(r => setTimeout(r, 2500))

const targets = [
  ['new', 'http://localhost:4173/'],
  ['ref', 'file://' + resolve('reference-v3.html')],
]
const report = {}
const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] })
for (const [tag, url] of targets) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  const errors = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', e => errors.push('pageerror: ' + e.message))
  if (tag === 'ref') {
    // reference-v3.html loads Google Fonts; serve the same font files from public/fonts so both sides render with real fonts
    const css = readFileSync('src/styles/fonts.css', 'utf-8').replace(/url\("\/fonts\/([^"]+)"\)/g, (_, f) => `url(data:font/woff2;base64,${readFileSync('public/fonts/' + f).toString('base64')})`)
    await page.route(/fonts\.googleapis\.com/, r => r.fulfill({ status: 200, contentType: 'text/css', body: css }))
  }
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => document.getElementById('loading')?.hidden === true, null, { timeout: 30000 })
  await page.waitForTimeout(1500)
  await page.evaluate(() => scrollTo(0, 0))
  await page.screenshot({ path: `${out}/${tag}-1-hero.png` })
  await page.locator('#mapbox').scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)
  await page.locator('#mapbox').screenshot({ path: `${out}/${tag}-2-map.png` })
  await page.locator('.site[data-site="A"]').first().dispatchEvent('click')
  await page.waitForTimeout(3500)
  await page.locator('#mapbox').screenshot({ path: `${out}/${tag}-3-flag1.png` })
  report[tag] = { errors }
  await page.close()
}
// pixel diff in-browser (no extra deps)
const p = await browser.newPage()
for (const n of ['1-hero', '2-map', '3-flag1']) {
  const a = readFileSync(`${out}/new-${n}.png`).toString('base64'), b = readFileSync(`${out}/ref-${n}.png`).toString('base64')
  const r = await p.evaluate(async ([a, b]) => {
    const load = s => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + s })
    const [A, B] = await Promise.all([load(a), load(b)])
    const w = Math.min(A.width, B.width), h = Math.min(A.height, B.height)
    const d = i => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.drawImage(i, 0, 0); return x.getImageData(0, 0, w, h).data }
    const da = d(A), db = d(B); let sum = 0, big = 0
    for (let i = 0; i < da.length; i += 4) { const e = (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2])) / 3; sum += e; if (e > 40) big++ }
    return { size: [A.width, A.height, B.width, B.height], meanAbsDiff: +(sum / (da.length / 4)).toFixed(2), pctPixelsOver40: +(big / (da.length / 4) * 100).toFixed(2) }
  }, [a, b])
  report['diff-' + n] = r
}
await browser.close(); server.kill()
writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
