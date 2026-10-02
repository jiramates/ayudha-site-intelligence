import { RM } from '../render/util'

/**
 * Chapter 3: four pages in one section. Page tabs on wide screens, swipe + dots on phones (same scroller).
 * The scroller is as tall as the page being shown (never taller than the screen), so a short page leaves no blank space.
 */
export function initPager() {
  const pages = document.getElementById('pages') as HTMLElement
  const sec = pages.closest('section') as HTMLElement
  const dotsRow = document.getElementById('dots') as HTMLElement
  const tabs = Array.from(document.querySelectorAll<HTMLElement>('.ptab'))
  const dots = Array.from(document.querySelectorAll<HTMLElement>('.dot'))
  const items = Array.from(pages.querySelectorAll<HTMLElement>('.page'))
  let cur = 0

  const fit = () => {
    const secBox = sec.getBoundingClientRect(), top = pages.getBoundingClientRect().top - secBox.top
    const cs = getComputedStyle(sec), gap = parseFloat(getComputedStyle(pages.parentElement as HTMLElement).rowGap) || 0
    const below = dotsRow.offsetParent ? dotsRow.offsetHeight + gap : 0
    const avail = Math.floor(innerHeight - top - below - parseFloat(cs.paddingBottom))
    pages.style.setProperty('--pageMax', `${avail}px`)
    pages.style.height = `${Math.min(items[cur].scrollHeight, avail)}px`
  }
  const mark = (i: number) => { cur = i; [...tabs, ...dots].forEach(b => b.setAttribute('aria-selected', String(Number(b.dataset.page) === i))); fit() }
  const go = (i: number) => { cur = i; fit(); pages.scrollTo({ left: items[i].offsetLeft, behavior: RM ? 'auto' : 'smooth' }) }
  ;[...tabs, ...dots].forEach(b => b.addEventListener('click', () => go(Number(b.dataset.page))))

  let raf = 0
  pages.addEventListener('scroll', () => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      const at = pages.scrollLeft
      const i = items.reduce((best, el, k) => (Math.abs(el.offsetLeft - at) < Math.abs(items[best].offsetLeft - at) ? k : best), 0)
      if (i !== cur) mark(i)
    })
  }, { passive: true })

  const ro = new ResizeObserver(fit)
  items.forEach(el => { ro.observe(el); Array.from(el.children).forEach(c => ro.observe(c)) })
  addEventListener('resize', fit)
  document.fonts?.ready.then(fit)
  fit()
}
