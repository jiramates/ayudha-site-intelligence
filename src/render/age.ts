/**
 * AGE_LEVEL (0–3): how weathered the baked mural looks. 0 = fresh paint, 1.5 = the v3 look, 3 = heavy
 * (the brief warns that 3 reads as snowfall). Set from study.json `meta.ageLevel`.
 * Scales: flake density, stain strength and count, crack count. Brush wobble and grain are unaffected.
 */
export const V3_LEVEL = 1.5

let level = V3_LEVEL
export const setAgeLevel = (n: number): void => { level = Math.min(3, Math.max(0, n)) }
export const getAgeLevel = (): number => level

export interface AgeParams {
  /** false at level 0: the plaster-loss layers are left out entirely */
  flakes: boolean
  /** alpha offsets of the two flake thresholds (higher = more flaking); v3 used -12.3 and -18.8 */
  flakeBig: number
  flakeSmall: number
  stainCount: number
  /** peak opacity of one stain; v3 used 0.22 */
  stainOpacity: number
  /** multiplier for the number of cracks; 1 at v3 */
  crackScale: number
}

export function ageParams(lvl: number): AgeParams {
  const L = Math.min(3, Math.max(0, lvl))
  const r = (x: number) => +x.toFixed(2)
  return {
    flakes: L > 0,
    flakeBig: r(-13.5 + 0.8 * L),
    flakeSmall: r(-20 + 0.8 * L),
    stainCount: Math.round((5 * L) / V3_LEVEL),
    stainOpacity: r((0.22 * L) / V3_LEVEL),
    crackScale: L / V3_LEVEL,
  }
}
