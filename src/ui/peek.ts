import { SITES, E } from '../data/content'
import { st } from '../state/store'
import { selectSite } from '../scenes/map-live'
import { th } from '../data/units'

/** Phone portrait, sheet closed: the four site buttons fill the space under the narrator. A tap acts like the flag. */
export function renderPeek() {
  const el = document.getElementById('peek') as HTMLElement
  el.innerHTML = Object.entries(SITES).map(([k, s]) =>
    `<button type="button" class="peekbtn" data-peek="${E(k)}" aria-pressed="${st.site === k}"><span class="s">${th(s.n)}</span><b>${E(s.short)}</b></button>`).join('')
}

export function initPeek() {
  (document.getElementById('peek') as HTMLElement).addEventListener('click', e => {
    const b = (e.target as Element).closest<HTMLElement>('[data-peek]')
    if (b?.dataset.peek) selectSite(b.dataset.peek)
  })
}
