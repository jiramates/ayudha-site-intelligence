/**
 * Portrait layout: the detail leaves live in a bottom sheet with three positions (closed / half / full).
 * The map and the narrator stay visible above the half position. In landscape the same element is a plain
 * side panel and none of this runs.
 */
type Pos = 'closed' | 'half' | 'full'

const portrait = matchMedia('(orientation: portrait)')
let pos: Pos = 'closed'
let applyFn: (p: Pos, animate?: boolean) => void = () => {}

export function initSheet() {
  const side = document.getElementById('side') as HTMLElement
  const handle = document.getElementById('sheetHandle') as HTMLButtonElement
  const body = document.getElementById('sheetBody') as HTMLElement
  const panel = document.getElementById('panel') as HTMLElement
  const narr = document.getElementById('narr') as HTMLElement
  const sec = document.getElementById('mapsec') as HTMLElement
  const cap = document.getElementById('cap') as HTMLElement
  const mapbox = document.getElementById('mapbox') as HTMLElement

  /**
   * translateY (px) of the sheet for each position; the sheet is `height` tall and anchored at the bottom.
   *  closed = "peek": it fills the space under the narrator with the four site buttons
   *  half   = its top edge sits just under the map (the whole map stays visible above it)
   *  full   = almost the whole screen
   */
  const geometry = () => {
    const H = side.offsetHeight, secTop = sec.getBoundingClientRect().top
    const narrBottom = narr.getBoundingClientRect().bottom - secTop
    const mapBottom = mapbox.getBoundingClientRect().bottom - secTop
    const peek = Math.max(130, innerHeight - narrBottom - 8)
    const half = Math.min(innerHeight * 0.72, Math.max(peek + 40, innerHeight - mapBottom - 6))
    return { H, peek, stops: { closed: H - peek, half: H - half, full: 0 } as Record<Pos, number> }
  }
  const stops = () => geometry().stops
  const apply = (p: Pos, animate = true) => {
    pos = p
    const g = geometry()
    side.classList.toggle('dragging', !animate)
    side.dataset.pos = p
    side.style.setProperty('--sheet-y', `${g.stops[p]}px`)
    side.style.setProperty('--peekH', `${g.peek - (handle.offsetHeight || 52) - 16}px`)
    handle.setAttribute('aria-expanded', String(p !== 'closed'))
    cap.inert = panel.inert = p === 'closed' // only the site buttons are reachable while peeking
  }

  applyFn = apply
  const place = () => {
    if (portrait.matches) body.insertBefore(cap, panel)
    else mapbox.appendChild(cap)
    if (portrait.matches) apply(pos); else { side.style.removeProperty('--sheet-y'); cap.inert = panel.inert = false }
  }
  portrait.addEventListener('change', place)
  const relayout = () => { if (portrait.matches) apply(pos, false) }
  addEventListener('resize', relayout)
  new ResizeObserver(relayout).observe(narr) // the narrator line grows as the text types
  place()

  // only while the map section is on screen
  new IntersectionObserver(es => es.forEach(e => side.classList.toggle('live', e.isIntersecting)), { threshold: 0.55 }).observe(sec)

  // drag the handle; a tap cycles closed → half → full → closed
  let startY = 0, startT = 0, moved = false, dragging = false
  const order: Pos[] = ['closed', 'half', 'full']
  handle.addEventListener('pointerdown', e => {
    dragging = true; moved = false; startY = e.clientY
    startT = stops()[pos]; handle.setPointerCapture(e.pointerId); side.classList.add('dragging')
  })
  handle.addEventListener('pointermove', e => {
    if (!dragging) return
    const dy = e.clientY - startY
    if (Math.abs(dy) > 5) moved = true
    const s = stops()
    side.style.setProperty('--sheet-y', `${Math.min(s.closed, Math.max(0, startT + dy))}px`)
  })
  const release = (e: PointerEvent) => {
    if (!dragging) return
    dragging = false
    if (!moved) { apply(order[(order.indexOf(pos) + 1) % 3]); return }
    const s = stops(), y = startT + (e.clientY - startY)
    apply(order.reduce((best, p) => (Math.abs(s[p] - y) < Math.abs(s[best] - y) ? p : best), 'closed' as Pos))
  }
  handle.addEventListener('pointerup', release)
  handle.addEventListener('pointercancel', release)
  handle.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') { e.preventDefault(); apply(pos === 'closed' ? 'half' : 'full') }
    if (e.key === 'ArrowDown') { e.preventDefault(); apply(pos === 'full' ? 'half' : 'closed') }
  })
}

/** Called after every view change: in portrait a new selection opens the sheet to half, going back to the city closes it. */
export function sheetFor(ev: string, hasSite: boolean) {
  if (!portrait.matches) return
  if (ev === 'out' || (ev === 'tab' && !hasSite)) applyFn('closed')
  else if ((ev === 'site' || ev === 'tab' || ev === 'restore') && pos === 'closed') applyFn('half')
}
