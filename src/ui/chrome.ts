import { S } from '../data/strings.th'
import { STUDY, E, P } from '../data/content'
import { th, numWord } from '../data/units'

const lookup = (path: string): string => {
  const v = path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], S)
  if (typeof v !== 'string') throw new Error(`strings.th: missing key ${path}`)
  return v
}
const el = (id: string) => document.getElementById(id) as HTMLElement

/** Static copy that needs no study data. Runs before the study loads so the loading text shows. */
export function fillStatic() {
  document.querySelectorAll<HTMLElement>('[data-t]').forEach(e => { e.textContent = lookup(e.dataset.t as string) })
  document.querySelectorAll<HTMLElement>('[data-aria]').forEach(e => e.setAttribute('aria-label', lookup(e.dataset.aria as string)))
  document.querySelectorAll<HTMLElement>('.dot').forEach(e => e.setAttribute('aria-label', S.pages.dot(th(Number(e.dataset.page) + 1))))
  document.querySelectorAll<HTMLElement>('[data-num]').forEach(e => { e.textContent = th(e.dataset.num as string) })
  document.querySelectorAll<HTMLElement>('[data-chapter]').forEach(e => { e.textContent = S.chapter(Number(e.dataset.chapter)).replace(/\d+/, d => th(d)) })
}

/** Copy that depends on study.json. */
export function fillStudy() {
  const count = numWord(STUDY.sites.length)
  el('heroTitle').textContent = STUDY.meta.title
  el('heroLead').textContent = S.hero.lead(count)
  el('heroSvg').setAttribute('aria-label', S.hero.aria)
  el('map').setAttribute('aria-label', S.map.aria(count))
  el('cmpTitle').textContent = S.cmp.title(count)
  el('resolution').innerHTML = STUDY.resolution.map(p => `<p>${P(p)}</p>`).join('')
  el('comingSoon').innerHTML = STUDY.comingSoon.map(t => `<li>${P(t)}</li>`).join('')
  el('colophon').textContent = S.end.colophon(`${STUDY.meta.era.label} ${th(STUDY.meta.era.year)}`)
}

export function showLoadError(issues: string[]) {
  const wrap = document.querySelector('.wrap') as HTMLElement
  wrap.innerHTML = `<div class="leaf" role="alert"><h3>${S.error.title}</h3><p>${S.error.lead}</p><ul>${issues.map(i => `<li>${E(i)}</li>`).join('')}</ul></div>`
}
