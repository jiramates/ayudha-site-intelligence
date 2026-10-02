import { describe, it, expect } from 'vitest'
import { studySchema } from '../src/data/schema'
import { installStudy, SITES, STUDY } from '../src/data/content'
import { areaTxt, beds } from '../src/data/units'
import { readJson } from './helpers'

describe('swapping study.json needs no code change', () => {
  it('a file with different site names validates and installs', () => {
    const s = studySchema.parse(readJson('tests/fixtures/study.swapped.json'))
    installStudy(s)
    expect(STUDY.meta.title).toBe('ศึกษาทำเลโรงพยาบาลสาธิต กรุงเก่า')
    expect(SITES.A.name).toBe('ท่าช้าง ย่านวัดพนัญเชิง')
    expect(areaTxt(SITES.A.land_m2)).toBe('๑๕ ไร่')
    expect(beds(SITES.A)).toBeCloseTo(48000 / 130)
  })
})
