// npm run og  →  public/og-image.jpg (1200×630, under 300 kB): the painted hero plus the title, rendered from the built app.
// The JPEG is committed, so deploy builds need no browser. Re-run when the title or the hero art changes.
import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(existsSync)
const server = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], { stdio: 'ignore' })
await new Promise(r => setTimeout(r, 2500))
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] })
try {
  // a viewport shaped like the hero painting, so the frame is about 2.6:1 whatever the screen
  const app = await browser.newPage({ viewport: { width: 1180, height: 470 } })
  await app.goto('http://localhost:4173/')
  await app.waitForFunction(() => document.getElementById('loading')?.hidden === true, null, { timeout: 30000 })
  await app.waitForTimeout(1500)
  await app.addStyleTag({ content: '.hero-t{display:none!important}' })
  const title = await app.locator('#heroTitle').evaluate(e => e.textContent)
  const hero = (await app.locator('header.frame').screenshot()).toString('base64')

  const fonts = readFileSync('src/styles/fonts.css', 'utf-8')
  const html = `<!doctype html><meta charset="utf-8"><style>${fonts}
    html,body{margin:0;width:1200px;height:630px;background:#e6d9ba;overflow:hidden}
    .card{box-sizing:border-box;width:1200px;height:630px;padding:36px;background:#e6d9ba;position:relative}
    .card::before{content:"";position:absolute;inset:14px;border:3px solid #7e3d2a;outline:1px solid #7e3d2a;outline-offset:4px}
    img{display:block;width:1128px;height:auto;margin:0 auto}
    .t{margin-top:16px;height:92px;display:grid;place-items:center;background:#a04a33;border:2px solid #5f2c1e;box-shadow:inset 0 0 0 2px rgba(241,227,196,.3);
       font:700 54px/1.1 "Srisakdi","Taviraj",serif;color:#f1e3c4;text-shadow:0 2px 0 rgba(60,20,10,.45)}
  </style><div class="card"><img src="data:image/png;base64,${hero}"><div class="t"></div></div>`
  const card = await browser.newPage({ viewport: { width: 1200, height: 630 } })
  await card.route('http://localhost:4173/__og', r => r.fulfill({ status: 200, contentType: 'text/html', body: html }))
  await card.goto('http://localhost:4173/__og')
  await card.locator('.t').evaluate((e, t) => { e.textContent = t }, title)
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
