import type { Study, Site } from './schema'
import { th, thaiWord, waTxt, waWord, areaTxt, raiWord } from './format'
import { UNIT, S } from './strings.th'
import { archetypeMeta } from './archetypes'

/**
 * Prose in study.json may contain `{name}` or `{name:format}` placeholders instead of typed numbers, e.g.
 *   "<text> {maxHeight_m:wa}"  →  the height in wa with Thai digits, e.g. "34 wa" written in Thai script
 * `name` is looked up (in this order) on the current site, its `rules`, derived values, `meta.regs`, `meta`.
 * `@B.n` addresses another site by id. Formats: th (default for numbers), word, ceilWord, wa, waWord,
 * area, raiWord, sok, sokWord, sen. Strings (e.g. `{@A.short}`) are inserted as text.
 * Everything else is HTML-escaped; only **bold** survives.
 */
export const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const FORMATS: Record<string, (v: number) => string> = {
  th: v => th(+v.toFixed(2)),
  word: thaiWord,
  ceilWord: v => thaiWord(Math.ceil(v - 1e-9)),
  wa: waTxt,
  waWord,
  area: areaTxt,
  raiWord,
  sok: v => `${th(v)} ${UNIT.cubit}`,
  sokWord: v => `${thaiWord(v)}${UNIT.cubit}`,
  sen: v => `${th(v)} ${UNIT.sen}`,
}
export const FORMAT_NAMES = Object.keys(FORMATS)

type Val = number | string | undefined
const dig = (root: unknown, keys: string[]): Val => {
  let o: unknown = root
  for (const k of keys) { if (o === null || typeof o !== 'object') return undefined; o = (o as Record<string, unknown>)[k] }
  return typeof o === 'number' || typeof o === 'string' ? o : undefined
}

function lookup(path: string, study: Study, site?: Site): Val {
  let ctx = site
  let p = path
  if (p.startsWith('@')) {
    const dot = p.indexOf('.')
    ctx = study.sites.find(s => s.id === p.slice(1, dot))
    if (!ctx) return undefined
    p = p.slice(dot + 1)
  }
  const keys = p.split('.')
  const derived: Record<string, number> = { sitesCount: study.sites.length }
  if (ctx) {
    derived.farActual = ctx.rules.gfa_m2 / ctx.land_m2
    const m = archetypeMeta(ctx.massing)
    if (m.roofTiers !== undefined) derived.roofTiers = m.roofTiers
    if (m.wings !== undefined) derived.wings = m.wings
  }
  const roots: unknown[] = [ctx, ctx?.rules, derived, study.meta.regs, study.meta]
  for (const r of roots) { const v = dig(r, keys); if (v !== undefined) return v }
  return undefined
}

export interface Expanded { out: string; issues: string[] }

export function expand(text: string, study: Study, site: Site | undefined, html: boolean): Expanded {
  const issues: string[] = []
  const base = html ? esc(text) : text
  let out = base.replace(/\{([^{}]+)\}/g, (whole, body: string) => {
    const [path, fmt] = body.split(':')
    const v = lookup(path, study, site)
    if (v === undefined) { issues.push(S.error.unknownToken(path)); return whole }
    if (typeof v === 'string') {
      if (fmt && fmt !== 'text') { issues.push(S.error.badFormat(body)); return whole }
      return html ? esc(v) : v
    }
    const f = FORMATS[fmt ?? 'th']
    if (!f) { issues.push(S.error.badFormat(body)); return whole }
    return f(v)
  })
  out = html ? out.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>') : out.replace(/\*\*/g, '')
  return { out, issues }
}

export interface ProseField { path: (string | number)[]; text: string; site?: Site }

/** Every free-text field that may contain placeholders, with the site it belongs to (if any). */
export function proseFields(d: Study): ProseField[] {
  const f: ProseField[] = []
  d.sites.forEach((s, i) => {
    const at = (...p: (string | number)[]) => ['sites', i, ...p]
    f.push({ path: at('desc'), text: s.desc, site: s }, { path: at('form'), text: s.form, site: s }, { path: at('say'), text: s.say, site: s })
    f.push({ path: at('verdict'), text: s.verdict, site: s }, { path: at('transportNote'), text: s.transportNote, site: s })
    f.push({ path: at('astro', 'text'), text: s.astro.text, site: s }, { path: at('astro', 'fix'), text: s.astro.fix, site: s })
    s.pros.forEach((t, j) => f.push({ path: at('pros', j), text: t, site: s }))
    s.cons.forEach((t, j) => f.push({ path: at('cons', j), text: t, site: s }))
    s.rules.flags.forEach((fl, j) => f.push({ path: at('rules', 'flags', j, 1), text: fl[1], site: s }))
  })
  d.story.forEach((l, i) => f.push({ path: ['story', i, 'text'], text: l.text }))
  d.opinions.forEach((l, i) => f.push({ path: ['opinions', i, 'text'], text: l.text }))
  d.resolution.forEach((t, i) => f.push({ path: ['resolution', i], text: t }))
  d.comingSoon.forEach((t, i) => f.push({ path: ['comingSoon', i], text: t }))
  d.zones.forEach((z, i) => {
    f.push({ path: ['zones', i, 'text'], text: z.text })
    z.tags.forEach((t, j) => f.push({ path: ['zones', i, 'tags', j], text: t }))
  })
  return f
}

export function checkProse(d: Study): { path: (string | number)[]; message: string }[] {
  return proseFields(d).flatMap(p => expand(p.text, d, p.site, false).issues.map(message => ({ path: p.path, message })))
}
