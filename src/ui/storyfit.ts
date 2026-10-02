/**
 * Phone portrait, chapter 1: heading, scene and the two lines are stacked. If that would be taller than the
 * screen, the two lines become a horizontal swipe pair under the scene instead.
 */
export function initStoryFit() {
  const sec = document.querySelector<HTMLElement>('.s1') as HTMLElement
  const duo = document.getElementById('lines') as HTMLElement
  const portrait = matchMedia('(orientation: portrait)')
  let busy = false
  const fit = () => {
    if (busy) return
    busy = true
    delete duo.dataset.swipe
    if (portrait.matches && sec.scrollHeight > innerHeight) duo.dataset.swipe = ''
    requestAnimationFrame(() => { busy = false })
  }
  const ro = new ResizeObserver(fit)
  ro.observe(duo); ro.observe(sec.querySelector('.stagecell') as HTMLElement)
  addEventListener('resize', fit)
  portrait.addEventListener('change', fit)
  document.fonts?.ready.then(fit)
  fit()
}
