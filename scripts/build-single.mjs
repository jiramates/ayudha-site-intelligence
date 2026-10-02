// npm run build:single [-- p1]  →  review/ayudha-<phase>.html : one self-contained file, opens by double-click (no server).
import { build } from 'vite'
import { chromium } from '@playwright/test'
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const pkg = JSON.parse(readFileSync('package.json', 'utf-8'))
const phase = process.argv[2] ?? pkg.ayudhaPhase ?? 'dev'
const out = resolve('review', `ayudha-${phase}.html`)

await build({ configFile: 'vite.single.config.ts', logLevel: 'warn' })

// inline the self-hosted fonts (CSS references them as url(.../fonts/x.woff2))
let html = readFileSync('dist-single/index.html', 'utf-8')
let n = 0
html = html.replace(/url\(\s*["']?[^)"']*?fonts\/([\w.-]+\.woff2)["']?\s*\)/g, (_, f) => {
  n++
  return `url(data:font/woff2;base64,${readFileSync(`public/fonts/${f}`).toString('base64')})`
})
if (!n) throw new Error('no font urls found to inline')
const external = html.match(/(?:src|href)=["']https?:[^"']+|url\(\s*["']?https?:[^)"']+|@import[^;]*https?:[^;]+/)
if (external) throw new Error('review file must be self-contained, found: ' + external[0])
mkdirSync('review', { recursive: true })
writeFileSync(out, html)

// verify: open from file:// with no server, check it boots and has no console errors
const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(existsSync)
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const errors = []
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', e => errors.push(e.message))
await page.goto('file://' + out)
await page.waitForFunction(() => document.getElementById('loading')?.hidden === true, null, { timeout: 30000 })
await page.locator('.site[data-site]').first().dispatchEvent('click')
await page.waitForSelector('#cap:not([hidden])')
const fonts = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter(f => f.status === 'loaded').length })
// deep links must work from file:// too
const links = []
for (const [h, mode] of [['#site-C', 'site'], ['#lens-reg-B', 'reg'], ['#lens-tr-D', 'tr']]) {
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  p.on('pageerror', e => errors.push(e.message))
  await p.goto('file://' + out + h)
  await p.waitForFunction(() => document.getElementById('loading')?.hidden === true, null, { timeout: 30000 })
  const got = await p.evaluate(() => document.querySelector('.tab[aria-selected="true"]').dataset.mode + ' ' + location.hash)
  if (got !== `${mode} ${h}`) errors.push(`deep link ${h} restored "${got}"`)
  links.push(h)
  await p.close()
}
await browser.close()
if (errors.length || !fonts) { console.error('VERIFY FAILED', { errors, fontsLoaded: fonts }); process.exit(1) }
console.log(`review file ok: ${out} (${(statSync(out).size / 1024).toFixed(0)} kB, ${fonts} font faces loaded, no console errors, deep links ${links.join(' ')} restore)`)
