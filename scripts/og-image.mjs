// npm run og  →  public/og-image.jpg (1200×630, under 300 kB): the cover painting plus the title (from the built app).
// The JPEG is committed, so deploy builds need no browser. Re-run when the title or the cover painting changes.
import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(existsSync)
const server = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], { stdio: 'ignore' })
await new Promise(r => setTimeout(r, 2500))
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] })
try {
  const app = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  await app.goto('http://localhost:4173/')
  await app.waitForFunction(() => document.getElementById('loading')?.hidden === true, null, { timeout: 30000 })
  const [title, eyebrow] = await Promise.all(['#heroTitle', '.hero-t .eyebrow'].map(s => app.locator(s).evaluate(e => e.textContent)))
  const cover = readFileSync('src/assets/cover.webp').toString('base64')

  // the cover painting on the right (whole, as in the app), the title on a red board on the left
  const fonts = readFileSync('src/styles/fonts.css', 'utf-8')
  const html = `<!doctype html><meta charset="utf-8"><style>${fonts}
    html,body{margin:0;width:1200px;height:630px;background:#e6d9ba;overflow:hidden}
    .card{box-sizing:border-box;width:1200px;height:630px;padding:36px 36px 36px 56px;background:#e6d9ba;position:relative;display:flex;align-items:center;gap:40px}
    .card::before{content:"";position:absolute;inset:14px;border:3px solid #7e3d2a;outline:1px solid #7e3d2a;outline-offset:4px}
    .txt{flex:1;display:flex;flex-direction:column;gap:18px}
    .e{font:400 26px/1.3 "Charm","Taviraj",serif;color:#7e3d2a}
    .t{padding:18px 24px;background:#a04a33;border:2px solid #5f2c1e;box-shadow:inset 0 0 0 2px rgba(241,227,196,.3);
       white-space:pre-line;font:700 56px/1.2 "Srisakdi","Taviraj",serif;color:#f1e3c4;text-shadow:0 2px 0 rgba(60,20,10,.45)}
    img{display:block;height:558px;width:auto;border:4px solid #7e3d2a;flex:none}
  </style><div class="card"><div class="txt"><div class="e"></div><div class="t"></div></div><img src="data:image/webp;base64,${cover}"></div>`
  const card = await browser.newPage({ viewport: { width: 1200, height: 630 } })
  await card.route('http://localhost:4173/__og', r => r.fulfill({ status: 200, contentType: 'text/html', body: html }))
  await card.goto('http://localhost:4173/__og')
  await card.locator('.t').evaluate((e, t) => { e.textContent = t.replace(/ (?=[^ ]*$)/, '\n') }, title) // break at the last space, never inside a word
  await card.locator('.e').evaluate((e, t) => { e.textContent = t }, eyebrow)
  await card.evaluate(() => document.fonts.ready)
  await card.waitForTimeout(300)
  let jpg = Buffer.alloc(0), q = 0
  for (q of [90, 86, 82, 78, 74, 70, 66, 62]) {
    jpg = await card.screenshot({ type: 'jpeg', quality: q, clip: { x: 0, y: 0, width: 1200, height: 630 } })
    if (jpg.length < 300_000) break
  }
  if (jpg.length >= 300_000) throw new Error(`og image is ${jpg.length} bytes, over the 300 kB target`)
  writeFileSync('public/og-image.jpg', jpg)
  console.log(`public/og-image.jpg written (${(jpg.length / 1024).toFixed(0)} kB, quality ${q})`)
} finally { await browser.close(); server.kill() }
