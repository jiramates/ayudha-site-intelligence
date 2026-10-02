import { describe, it, expect } from 'vitest'
import { th, fmt, waTxt, areaTxt, bahtTxt, travel } from '../src/data/units'

describe('units (behaviour must match reference-v3)', () => {
  it('Thai digits', () => { expect(th(2568)).toBe('๒๕๖๘'); expect(fmt(96000)).toBe('๙๖,๐๐๐') })
  it('วา from metres (1 วา = 2 m)', () => {
    expect(waTxt(68)).toBe('๓๔ วา'); expect(waTxt(3)).toBe('๑ วาครึ่ง'); expect(waTxt(1)).toBe('ครึ่งวา')
  })
  it('ไร่-งาน-ตารางวา from m²', () => {
    expect(areaTxt(19200)).toBe('๑๒ ไร่'); expect(areaTxt(9600)).toBe('๖ ไร่'); expect(areaTxt(48000)).toBe('ราว ๓๐ ไร่')
    expect(areaTxt(400)).toBe('๑ งาน')
  })
  it('บาท (เพลา), 1 บาท = 6 min', () => {
    expect(bahtTxt(0.5)).toBe('๐.๕ บาท'); expect(bahtTxt(2)).toBe('๒ บาท')
    const t = travel('A', 'horse'); expect(t.min).toBeCloseTo(t.baht * 6)
  })
})
