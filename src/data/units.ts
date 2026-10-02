import { DIGITS, UNIT, NUM_WORDS } from './strings.th'
import { SITES, MODES, STUDY } from './content'
import type { ModeId, Site, XY } from './schema'

const M_PER_SEN = 40 // 1 sen (20 wa) = 40 m

/** Arabic → Thai digits. Data stays in Arabic numerals; this runs only at render time. */
export const th = (v: string | number): string => String(v).replace(/\d/g, d => DIGITS[+d])
export const fmt = (n: number): string => th(Math.round(n).toLocaleString('en-US'))
export const numWord = (n: number): string => NUM_WORDS[n] ?? th(n)

/** metres → wa (1 wa = 2 m) */
export function waTxt(m: number): string {
  const v = m / 2
  if (Number.isInteger(v)) return `${th(v)} ${UNIT.wa}`
  const fl = Math.floor(v)
  if (Math.abs(v - fl - 0.5) < 0.01) return fl ? `${th(fl)} ${UNIT.waAndHalf}` : UNIT.halfWa
  return `${th(v.toFixed(1))} ${UNIT.wa}`
}

/** m² → rai-ngan-square wa (1 rai = 400 sq wa = 1,600 m²) */
export function areaTxt(m2: number): string {
  let tw = Math.round(m2 / 4)
  const rai = Math.floor(tw / 400)
  tw -= rai * 400
  const ngan = Math.floor(tw / 100)
  const wa = tw - ngan * 100
  if (rai >= 20) return `${UNIT.about} ${th(Math.round(m2 / 1600))} ${UNIT.rai}`
  return [rai ? `${th(rai)} ${UNIT.rai}` : '', ngan ? `${th(ngan)} ${UNIT.ngan}` : '', wa ? `${th(wa)} ${UNIT.sqWa}` : '']
    .filter(Boolean).join(' ') || UNIT.zero
}

/** 1 baht (phela) = 6 minutes */
export const bahtTxt = (b: number): string =>
  `${th(b < 1 ? b.toFixed(1) : b.toFixed(1).replace(/\.0$/, ''))} ${UNIT.baht}`

export const plen = (p: XY[]): number => {
  let L = 0
  for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])
  return L
}

export function travel(siteId: string, mode: ModeId) {
  const sen = plen(SITES[siteId].routes[mode]) * STUDY.meta.planUnit_m / M_PER_SEN
  const baht = sen / MODES[mode].senPerBaht
  return { sen, baht, min: baht * STUDY.meta.minPerBaht }
}

export const beds = (s: Site): number => s.rules.gfa_m2 / STUDY.meta.bedDivisor
