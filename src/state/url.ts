import type { Mode } from './store'

/**
 * Deep links. Plain letters, digits and hyphens only:
 *   #site-A        lens 1 (location and massing), zoomed to site A
 *   #lens-reg-B    lens 2 (rules and direction), site B selected
 *   #lens-tr-C     lens 3 (transport), site C selected
 * (#lens-site-A is accepted as an alias of #site-A). No hash = the whole city.
 */
export interface View { mode: Mode; site: string | null }

const RE = /^#?(?:(site)|lens-(site|reg|tr))-([A-Za-z0-9-]+)$/

export function parseHash(hash: string, siteIds: string[]): View | null {
  const m = RE.exec(hash)
  if (!m || !siteIds.includes(m[3])) return null
  return { mode: (m[1] ? 'site' : m[2]) as Mode, site: m[3] }
}

export function formatHash(v: View): string {
  if (v.mode === 'site') return v.site ? `#site-${v.site}` : ''
  return v.site ? `#lens-${v.mode}-${v.site}` : ''
}
