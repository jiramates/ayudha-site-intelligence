import { DIGITS, UNIT, NUM } from './strings.th'

/** Arabic → Thai digits. Data stays in Arabic numerals; this runs only at render time. */
export const th = (v: string | number): string => String(v).replace(/\d/g, d => DIGITS[+d])
export const fmt = (n: number): string => th(Math.round(n).toLocaleString('en-US'))

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

/** Integer 0–999 in Thai words, with the irregular forms for 11, 20–29 (the "-et" and "yi-sip" forms). */
export function thaiWord(n: number): string {
  const v = Math.round(n)
  if (v < 0 || v > 999) return th(v)
  if (v === 0) return NUM.digits[0]
  const h = Math.floor(v / 100), t = Math.floor((v % 100) / 10), u = v % 10
  let out = ''
  if (h) out += NUM.digits[h] + NUM.hundred
  if (t) out += t === 1 ? NUM.ten : t === 2 ? NUM.twenty : NUM.digits[t] + NUM.ten
  if (u) out += u === 1 && (t || h) ? NUM.one : NUM.digits[u]
  return out
}
export const numWord = thaiWord

/** metres → wa in words ("four wa", "one-and-a-half wa"); values that are not whole or half fall back to digits. */
export function waWord(m: number): string {
  const v = m / 2
  if (Number.isInteger(v)) return `${thaiWord(v)}${UNIT.wa}`
  const fl = Math.floor(v)
  if (Math.abs(v - fl - 0.5) < 0.01) return `${fl > 1 ? thaiWord(fl) : ''}${UNIT.waAndHalf}`
  return waTxt(m)
}

/** m² → whole rai in words ("thirty rai"); otherwise rai-ngan-wa digits. */
export function raiWord(m2: number): string {
  const rai = m2 / 1600
  return Number.isInteger(rai) && rai > 0 ? `${thaiWord(rai)}${UNIT.rai}` : areaTxt(m2)
}
