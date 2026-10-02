// npm run pictures  →  smaller copies of the two paintings for phones (src/assets/*-<width>.webp), made with the
// browser's own WebP encoder. Re-run after replacing src/assets/cover.webp or src/assets/planners.webp, and commit.
import { chromium } from '@playwright/test'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const JOBS = [['cover', 720], ['planners', 1000]]
const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(existsSync)
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] })
try {
  const page = await browser.newPage()
  for (const [name, w] of JOBS) {
    const src = `data:image/webp;base64,${readFileSync(`src/assets/${name}.webp`).toString('base64')}`
    const out = await page.evaluate(async ([src, w]) => {
      const img = new Image(); img.src = src; await img.decode()
      const h = Math.round(img.naturalHeight * w / img.naturalWidth)
      const c = document.createElement('canvas'); c.width = w; c.height = h
      const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(img, 0, 0, w, h)
      return c.toDataURL('image/webp', 0.72).split(',')[1]
    }, [src, w])
    const buf = Buffer.from(out, 'base64')
    writeFileSync(`src/assets/${name}-${w}.webp`, buf)
    console.log(`src/assets/${name}-${w}.webp ${(buf.length / 1024).toFixed(0)} kB`)
  }
} finally { await browser.close() }
