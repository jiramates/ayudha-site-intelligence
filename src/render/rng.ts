/** Shared seeded RNG. Call order must stay identical to v3 so the painted scenes stay stable. */
let seed = 11
export const setSeed = (n: number) => { seed = n }
export const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
export const pick = <T>(a: T[]): T => a[Math.floor(rnd() * a.length)]
