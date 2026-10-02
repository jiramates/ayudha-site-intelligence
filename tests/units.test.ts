import { describe, it, expect, beforeAll } from 'vitest'
import { th, fmt, numWord, waTxt, areaTxt, bahtTxt, travel, beds } from '../src/data/units'
import { SITES } from '../src/data/content'
import { installDemo } from './helpers'

beforeAll(() => { installDemo() })

describe('units (behaviour must match reference-v3)', () => {
  it('Thai digits', () => { expect(th(2568)).toBe('๒๕๖๘'); expect(fmt(96000)).toBe('๙๖,๐๐๐'); expect(numWord(3)).toBe('สาม') })
  it('wa from metres (1 wa = 2 m)', () => {
    expect(waTxt(68)).toBe('๓๔ วา'); expect(waTxt(3)).toBe('๑ วาครึ่ง'); expect(waTxt(1)).toBe('ครึ่งวา')
  })
  it('rai-ngan-square wa from m²', () => {
    expect(areaTxt(19200)).toBe('๑๒ ไร่'); expect(areaTxt(9600)).toBe('๖ ไร่'); expect(areaTxt(48000)).toBe('ราว ๓๐ ไร่')
    expect(areaTxt(400)).toBe('๑ งาน'); expect(areaTxt(1000)).toBe('๒ งาน ๕๐ ตารางวา'); expect(areaTxt(0)).toBe('๐')
  })
  it('baht (phela), 1 baht = 6 min', () => {
    expect(bahtTxt(0.5)).toBe('๐.๕ บาท'); expect(bahtTxt(2)).toBe('๒ บาท')
    const t = travel('A', 'horse'); expect(t.min).toBeCloseTo(t.baht * 6)
  })
  it('travel and beds come from data, not constants in code', () => {
    expect(beds(SITES.A)).toBeCloseTo(96000 / 130)
    expect(travel('A', 'walk').sen).toBeGreaterThan(0)
  })
})
