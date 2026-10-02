import { describe, it, expect } from 'vitest'
import { parseHash, formatHash } from '../src/state/url'

const ids = ['A', 'B', 'C', 'D']
describe('deep link grammar', () => {
  it('parses the three link forms', () => {
    expect(parseHash('#site-A', ids)).toEqual({ mode: 'site', site: 'A' })
    expect(parseHash('#lens-reg-B', ids)).toEqual({ mode: 'reg', site: 'B' })
    expect(parseHash('#lens-tr-C', ids)).toEqual({ mode: 'tr', site: 'C' })
    expect(parseHash('lens-site-D', ids)).toEqual({ mode: 'site', site: 'D' })
  })
  it('rejects anything else', () => {
    for (const h of ['', '#', '#site-', '#site-Z', '#lens-xx-A', '#lens-reg', '#site-A/../x', '#site-A x', '#site-<b>', '#SITE-A'])
      expect(parseHash(h, ids), h).toBeNull()
  })
  it('round-trips and uses only letters, digits and hyphens', () => {
    for (const mode of ['site', 'reg', 'tr'] as const) for (const site of ids) {
      const h = formatHash({ mode, site })
      expect(h).toMatch(/^#[A-Za-z0-9-]+$/)
      expect(parseHash(h, ids)).toEqual({ mode, site })
    }
    expect(formatHash({ mode: 'site', site: null })).toBe('')
  })
  it('works for ids with hyphens', () => {
    expect(parseHash('#lens-reg-north-2', ['north-2'])).toEqual({ mode: 'reg', site: 'north-2' })
  })
})
