import { RM } from '../render/util'

/** Chapter 3: four pages in one screen. Page tabs on wide screens, swipe + dots on phones (same scroller). */
export function initPager() {
  const pages = document.getElementById('pages') as HTMLElement
  const tabs = Array.from(document.querySelectorAll<HTMLElement>('.ptab'))
  const dots = Array.from(document.querySelectorAll<HTMLElement>('.dot'))
  const items = Array.from(pages.querySelectorAll<HTMLElement>('.page'))

  const mark = (i: number) => [...tabs, ...dots].forEach(b => b.setAttribute('aria-selected', String(Number(b.dataset.page) === i)))
  const go = (i: number) => pages.scrollTo({ left: items[i].offsetLeft, behavior: RM ? 'auto' : 'smooth' })
  ;[...tabs, ...dots].forEach(b => b.addEventListener('click', () => go(Number(b.dataset.page))))

  let raf = 0
  pages.addEventListener('scroll', () => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      const at = pages.scrollLeft
      mark(items.reduce((best, el, i) => (Math.abs(el.offsetLeft - at) < Math.abs(items[best].offsetLeft - at) ? i : best), 0))
    })
  }, { passive: true })
}
