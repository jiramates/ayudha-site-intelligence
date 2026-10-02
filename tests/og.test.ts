import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { build } from 'vite'
import type { Rollup } from 'vite'

describe('link preview', () => {
  it('public/og-image.png is a 1200×630 PNG', () => {
    const b = readFileSync('public/og-image.png')
    expect([...b.subarray(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    expect([b.readUInt32BE(16), b.readUInt32BE(20)]).toEqual([1200, 630])
    expect(b.length).toBeLessThan(5_000_000)
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
    expect(h).toContain('<meta property="og:image" content="https://ayudha.example.com/og-image.png">')
    expect(h).toContain('<meta name="twitter:image" content="https://ayudha.example.com/og-image.png">')
    expect(h).toContain('<meta property="og:url" content="https://ayudha.example.com/">')
    expect(h).toContain('<meta name="twitter:card" content="summary_large_image">')
    expect(h).toContain('<meta property="og:title" content="ศึกษาทำเลโรงหมอหลวง กรุงศรีอยุธยา">')
    expect(h).toContain('<meta property="og:image:width" content="1200">')
    expect(h).not.toContain('<!--og-meta-->')
    expect(h).toContain('<title>Ayudha Site Intelligence</title>')
  }, 60000)

  it('without SITE_URL the build still works and the image link is relative', async () => {
    const h = await html()
    expect(h).toContain('<meta property="og:image" content="./og-image.png">')
    expect(h).not.toContain('og:url')
  }, 60000)
})
