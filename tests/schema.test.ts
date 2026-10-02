import { describe, it, expect } from 'vitest'
import { parseStudy } from '../src/data/loader'
import { readJson, setPath } from './helpers'

const demo = () => readJson('public/data/study.json')
const sites = (d: unknown) => (d as { sites: { land_m2: number; rules: { road_m: number } }[] }).sites

describe('study.json schema', () => {
  it('accepts the demo data', () => { expect(parseStudy(demo()).ok).toBe(true) })
  it('stores SI units: land and floor area in m², lengths in m', () => {
    const d = sites(demo()); expect(d[0].land_m2).toBe(19200); expect(d[0].rules.road_m).toBe(16)
  })
  it('reports readable paths for a malformed file', () => {
    const d = demo(); setPath(d, 'sites.1.rules.road_m', undefined); setPath(d, 'sites.2.massing', 'castle')
    const r = parseStudy(d)
    expect(r.ok).toBe(false)
    if (!r.ok) { expect(r.issues.some(i => i.startsWith('sites.1.rules.road_m'))).toBe(true); expect(r.issues.some(i => i.startsWith('sites.2.massing'))).toBe(true) }
  })
  it('rejects duplicate site ids and a third speaker in the story', () => {
    const d = demo(); setPath(d, 'sites.1.id', 'A')
    expect(parseStudy(d).ok).toBe(false)
    const e = demo(); setPath(e, 'story.0.speaker', 'phon')
    expect(parseStudy(e).ok).toBe(false)
  })
  it('does not contain the 2H rule', () => {
    expect(JSON.stringify(demo())).not.toMatch(/2H|2h|สองเท่าของความกว้างถนน/)
  })
})
