/**
 * The hero painting is 1000×520. On a tall, narrow screen the frame is cropped at the sides instead of letterboxed:
 * the viewBox becomes a window of the painting that keeps the prang skyline (right of centre) and the river in view.
 */
const W = 1000, H = 520, FOCUS = 760

export function initHeroFit() {
  const svg = document.getElementById('heroSvg') as unknown as SVGSVGElement
  const frame = svg.parentElement as HTMLElement
  const fit = () => {
    const r = frame.getBoundingClientRect()
    if (!r.width || !r.height) return
    const w = Math.min(W, H * (r.width / r.height))
    const x = Math.min(W - w, Math.max(0, FOCUS - w / 2))
    svg.setAttribute('viewBox', `${x.toFixed(1)} 0 ${w.toFixed(1)} ${H}`)
  }
  new ResizeObserver(fit).observe(frame)
  fit()
}
