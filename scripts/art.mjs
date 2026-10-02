// npm run art  →  public/art/map.jpg + manifest.json: the painted map, baked once through the mural filter.
// The browser uses them while their signature matches the drawing code, the age level and the site positions;
// otherwise it bakes in the browser as before. Re-run after changing the art code, meta.ageLevel or site positions.
import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'

const QUALITY = 0.8
const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(existsSync)
mkdirSync('public/art', { recursive: true })
const server = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], { stdio: 'ignore' })
await new Promise(r => setTimeout(r, 2500))
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] })
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  const got = {}
  await page.exposeFunction('__saveArt', (key, sig, url) => { got[key] = { sig, bytes: Buffer.from(url.split(',')[1], 'base64') } })
  await page.addInitScript(q => { window.__artForce = true; window.__artQuality = q }, QUALITY)
  await page.goto('http://localhost:4173/')
  await page.waitForFunction(() => document.getElementById('loading')?.hidden === true, null, { timeout: 120000 })
  await page.waitForTimeout(3000)
  const manifest = {}
  for (const key of ['map']) {
    if (!got[key]) throw new Error(`art "${key}" was not baked`)
    writeFileSync(`public/art/${key}.jpg`, got[key].bytes)
    manifest[key] = { sig: got[key].sig }
    console.log(`${key}.jpg ${(got[key].bytes.length / 1024).toFixed(0)} kB`)
  }
  writeFileSync('public/art/manifest.json', JSON.stringify(manifest, null, 1) + '\n')
} finally { await browser.close(); server.kill() }
