import { describe, it, expect } from 'vitest'
import { studySchema, type Study } from '../src/data/schema'
import { expand, proseFields, esc } from '../src/data/prose'
import { parseStudy } from '../src/data/loader'
import { readJson, setPath } from './helpers'

const demo = () => studySchema.parse(readJson('public/data/study.json'))
const strings = (o: unknown, path = ''): [string, string][] =>
  typeof o === 'string' ? [[path, o]]
    : Array.isArray(o) ? o.flatMap((x, i) => strings(x, `${path}.${i}`))
    : o && typeof o === 'object' ? Object.entries(o).flatMap(([k, v]) => strings(v, `${path}.${k}`)) : []

describe('placeholders in prose', () => {
  it('no Thai digit is hard-typed in any string of study.json or the swap fixture', () => {
    for (const f of ['public/data/study.json', 'tests/fixtures/study.swapped.json']) {
      const offenders = strings(readJson(f)).filter(([, v]) => /[๐-๙]/.test(v))
      expect(offenders, f).toEqual([])
    }
  })

  it('expanded prose equals the P1 text word for word (nothing changed on screen)', () => {
    const now = proseFields(demo())
    const before = proseFields(readJson('tests/fixtures/study.p1-baseline.json') as unknown as Study)
    expect(now.length).toBe(before.length)
    const study = demo()
    now.forEach((f, i) => {
      expect(expand(f.text, study, f.site, false).out, f.path.join('.')).toBe(before[i].text.replace(/\*\*/g, ''))
    })
  })

  it('numbers follow the data: change a field and the sentence changes', () => {
    const s = demo()
    s.sites[0].rules.maxHeight_m = 40
    expect(expand('สูงได้ {maxHeight_m:wa}', s, s.sites[0], false).out).toBe('สูงได้ ๒๐ วา')
    expect(expand('{road_m:waWord} {floodSok:sokWord} {land_m2:raiWord} {@C.n:word}', s, s.sites[1], false).out).toBe('หกวา สองศอก เก้าไร่ สาม')
  })

  it('an unknown placeholder or format is rejected with its path', () => {
    const d = readJson('public/data/study.json')
    setPath(d, 'sites.0.verdict', 'สูง {noSuchField:wa}')
    setPath(d, 'sites.1.desc', 'กว้าง {road_m:furlong}')
    const r = parseStudy(d)
    expect(r.ok).toBe(false)
    if (!r.ok) { expect(r.issues.some(i => i.startsWith('sites.0.verdict'))).toBe(true); expect(r.issues.some(i => i.startsWith('sites.1.desc'))).toBe(true) }
  })
})

describe('escaping', () => {
  it('escapes markup by default and keeps only **bold**', () => {
    const s = demo()
    expect(expand('<img src=x onerror=alert(1)> **ตัวหนา** & "q"', s, undefined, true).out)
      .toBe('&lt;img src=x onerror=alert(1)&gt; <b>ตัวหนา</b> &amp; &quot;q&quot;')
    expect(esc(`'<>`)).toBe('&#39;&lt;&gt;')
  })
  it('text inserted by a placeholder is escaped too', () => {
    const s = demo()
    s.sites[0].short = '<u>x</u>'
    expect(expand('{@A.short}', s, undefined, true).out).toBe('&lt;u&gt;x&lt;/u&gt;')
  })
})

describe('archetype facts in prose', () => {
  it('{roofTiers} follows the archetype of the site, so text matches the drawn model', () => {
    const s = demo()
    const a = s.sites[0]
    expect(expand('ซ้อน{roofTiers:word}ชั้น', s, a, false).out).toBe('ซ้อนสามชั้น')
    a.massing = 'riverside-hall'
    expect(expand('ซ้อน{roofTiers:word}ชั้น', s, a, false).out).toBe('ซ้อนสองชั้น')
  })
  it('an archetype without that fact is reported at load', () => {
    const d = readJson('public/data/study.json')
    setPath(d, 'sites.0.massing', 'pavilion-campus')
    const r = parseStudy(d)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.issues.some(i => i.startsWith('sites.0.form') && i.includes('roofTiers'))).toBe(true)
  })
})
