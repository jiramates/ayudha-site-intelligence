import { describe, it, expect } from 'vitest'
import { ageParams, V3_LEVEL } from '../src/render/age'

describe('AGE_LEVEL', () => {
  it('level 1.5 reproduces the v3 constants exactly', () => {
    const a = ageParams(V3_LEVEL)
    expect(a).toEqual({ flakes: true, flakeBig: -12.3, flakeSmall: -18.8, stainCount: 5, stainOpacity: 0.22, crackScale: 1 })
  })
  it('level 0 is fresh paint: no flakes, stains or cracks', () => {
    const a = ageParams(0)
    expect(a.flakes).toBe(false); expect(a.stainCount).toBe(0); expect(a.stainOpacity).toBe(0); expect(a.crackScale).toBe(0)
  })
  it('flake density, stain strength and crack count rise with the level', () => {
    const lv = [0.5, 1, 1.5, 2, 3].map(ageParams)
    for (let i = 1; i < lv.length; i++) {
      expect(lv[i].flakeBig).toBeGreaterThan(lv[i - 1].flakeBig)
      expect(lv[i].stainOpacity).toBeGreaterThan(lv[i - 1].stainOpacity)
      expect(lv[i].crackScale).toBeGreaterThan(lv[i - 1].crackScale)
      expect(lv[i].stainCount).toBeGreaterThanOrEqual(lv[i - 1].stainCount)
    }
  })
  it('clamps to 0–3', () => { expect(ageParams(9)).toEqual(ageParams(3)); expect(ageParams(-2)).toEqual(ageParams(0)) })
})
