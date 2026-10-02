/** Shared seeded RNG. Call order must stay identical to v3 so the painted scenes stay stable. */
let seed = 11
export const setSeed = (n: number) => { seed = n }
export const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
export const pick = <T>(a: T[]): T => a[Math.floor(rnd() * a.length)]

/** Stable seed from a string (a site id), kept inside the generator's range. */
export const seedFrom = (s: string): number => {
  let h = 7
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 233280
  return h
}

/** Run `fn` on its own random stream; the shared stream is left exactly as it was. */
export function withSeed<T>(n: number, fn: () => T): T {
  const saved = seed
  seed = n
  try { return fn() } finally { seed = saved }
}
