import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { build } from 'vite'
import type { Rollup } from 'vite'

describe('link preview', () => {
  it('public/og-image.jpg is a 1200×630 JPEG under 300 kB', () => {
    const b = readFileSync('public/og-image.jpg')
    expect([...b.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff])
    let i = 2, w = 0, h = 0
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue }
      const m = b[i + 1], len = b.readUInt16BE(i + 2)
      if (m >= 0xc0 && m <= 0xc3) { h = b.readUInt16BE(i + 5); w = b.readUInt16BE(i + 7); break }
      i += 2 + len
    }
    expect([w, h]).toEqual([1200, 630])
    expect(b.length).toBeLessThan(300_000)
    expect(existsSync('public/og-image.png')).toBe(false)
  })

  async function html(site?: string) {
    const old = process.env.SITE_URL
    if (site) process.env.SITE_URL = site; else delete process.env.SITE_URL
    try {
      const out = (await build({ configFile: 'vite.config.ts', logLevel: 'silent', build: { write: false } })) as Rollup.RollupOutput
      return String((out.output.find(o => o.fileName === 'index.html') as Rollup.OutputAsset).source)
    } finally { if (old === undefined) delete process.env.SITE_URL; else process.env.SITE_URL = old }
  }

  it('SITE_URL makes the Open Graph and Twitter links absolute', async () => {
    const h = await html('https://ayudha.example.com/')
    expect(h).toContain('<meta property="og:image" content="https://ayudha.example.com/og-image.jpg">')
    expect(h).toContain('<meta property="og:image:type" content="image/jpeg">')
    expect(h).toContain('<meta name="twitter:image" content="https://ayudha.example.com/og-image.jpg">')
    expect(h).toContain('<meta property="og:url" content="https://ayudha.example.com/">')
    expect(h).toContain('<meta name="twitter:card" content="summary_large_image">')
    expect(h).toContain('<meta property="og:title" content="ศึกษาทำเลโรงหมอหลวง กรุงศรีอยุธยา">')
    expect(h).toContain('<meta property="og:image:width" content="1200">')
    expect(h).not.toContain('<!--og-meta-->')
    expect(h).toContain('<title>Ayudha Site Intelligence</title>')
  }, 60000)

  it('without SITE_URL the build still works and the image link is relative', async () => {
    const h = await html()
    expect(h).toContain('<meta property="og:image" content="./og-image.jpg">')
    expect(h).not.toContain('og:url')
  }, 60000)
})
