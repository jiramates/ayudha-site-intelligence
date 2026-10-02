export const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const NS = 'http://www.w3.org/2000/svg'
export const f1 = (n: number | string) => (+n).toFixed(1)
export const OL = '#5e3420'

/**
 * Scroll to an element at once. `behavior: 'instant'` is not understood by older Safari (it throws), and plain
 * `auto` would follow the page's smooth scrolling, so smooth scrolling is switched off for the jump.
 */
export function jumpTo(el: Element) {
  const root = document.documentElement
  const was = root.style.scrollBehavior
  root.style.scrollBehavior = 'auto'
  el.scrollIntoView({ block: 'start' })
  root.style.scrollBehavior = was
}

/** Phones and tablets: the painted art is baked smaller so it finishes quickly on a weak GPU (BUILD_BRIEF §10). */
export const COARSE = window.matchMedia('(pointer: coarse)').matches
