import { SITES, MODES, STUDY } from './content'
import type { ModeId, Site, XY } from './schema'

export * from './format'

const M_PER_SEN = 40 // 1 sen (20 wa) = 40 m

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
