/**
 * A "moving picture": the painting stays an ordinary <img> (the exact image, shown even without script), and a
 * transparent canvas laid over it redraws only the parts that move — water ripples, a flag, fans and leaves swaying,
 * people breathing — plus light effects (glowing panels, sparks along paths, twinkles, gold dust, birds).
 * All coordinates are in the full-size image's pixels (refW wide); a smaller copy picked by srcset is scaled to match. The loop runs at about 30 fps and only while the picture is on
 * screen; with reduced motion nothing is drawn and the still image remains.
 */
import { RM } from '../render/util'

export type Rect = [x: number, y: number, w: number, h: number]
export type Pt = [x: number, y: number]
export type Effect =
  /** rows slide sideways in a travelling wave (water, clouds); fades out at the top and bottom of the band */
  | { k: 'ripple'; r: Rect; amp: number; wave: number; period: number }
  /** rows slide sideways, most at the top, none at the bottom (trees, fans, umbrellas pivot below) */
  | { k: 'sway'; r: Rect; amp: number; period: number; phase?: number; wave?: number }
  /** columns move up and down, growing away from the left edge (a flag on its pole) */
  | { k: 'flag'; r: Rect; amp: number; wave: number; period: number }
  /** the region stretches a hair taller from its bottom edge (a figure breathing) */
  | { k: 'breathe'; r: Rect; amount: number; period: number; phase?: number }
  /** a soft light over a rect that brightens and dims, with an occasional flicker (glass panels, lamps) */
  | { k: 'glow'; r: Rect; color: string; min: number; max: number; period: number; phase?: number; flicker?: boolean; round?: boolean }
  /** a bright line sweeping down a panel */
  | { k: 'scan'; r: Rect; color: string; period: number; phase?: number }
  /** a diagonal sheen crossing a rect now and then (gilded plaques) */
  | { k: 'sheen'; r: Rect; period: number; phase?: number }
  /** sparks running along quadratic curves */
  | { k: 'sparks'; paths: [Pt, Pt, Pt][]; color: string; period: number; size: number }
  /** fixed points that twinkle */
  | { k: 'twinkle'; r: Rect; n: number; color: string; size: number; seed: number }
  /** rings spreading from points (a pointer touching the map) */
  | { k: 'rings'; at: Pt[]; color: string; period: number; radius: number }
  /** gold dust drifting upward */
  | { k: 'motes'; r: Rect; n: number; color: string; size: number; seed: number }
  /** a few birds circling */
  | { k: 'birds'; c: Pt; rx: number; ry: number; n: number; size: number; period: number; color: string }

const rand = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
const TAU = Math.PI * 2

export function living(box: HTMLElement, effects: Effect[], refW: number) {
  const img = box.querySelector('img') as HTMLImageElement
  const cv = box.querySelector('canvas') as HTMLCanvasElement
  const ctx = cv.getContext('2d')
  if (!ctx || RM) return
  const g: CanvasRenderingContext2D = ctx
  // fixed random layouts for twinkles and dust
  const pts = new Map<Effect, number[][]>()
  for (const e of effects) {
    if (e.k === 'twinkle' || e.k === 'motes') { const r = rand(e.seed); pts.set(e, Array.from({ length: e.n }, () => [r(), r(), r(), r()])) }
  }

  let k = 1, sc = 1, W = 0, H = 0 // k: canvas px per image px; sc: source px per image px (a smaller copy has sc < 1)
  const size = () => {
    const dpr = Math.min(2, devicePixelRatio || 1), b = cv.getBoundingClientRect()
    W = Math.round(b.width * dpr); H = Math.round(b.height * dpr)
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H }
    k = W / refW
  }

  /** draw the image's rows [y, y+h) of the rect shifted by off(row) image px */
  const rows = (r: Rect, off: (t: number, y: number) => number) => {
    const [x, y, w, h] = r, step = Math.max(1, 2 / k)
    for (let yy = y; yy < y + h; yy += step) {
      const o = off((yy - y) / h, yy)
      g.drawImage(src, x * sc, yy * sc, w * sc, step * sc, (x + o) * k, yy * k, w * k, step * k + 0.6)
    }
  }
  const cols = (r: Rect, off: (t: number, x: number) => number) => {
    const [x, y, w, h] = r, step = Math.max(1, 2 / k)
    for (let xx = x; xx < x + w; xx += step) {
      const o = off((xx - x) / w, xx)
      g.drawImage(src, xx * sc, y * sc, step * sc, h * sc, xx * k, (y + o) * k, step * k + 0.6, h * k)
    }
  }
  const quad = (p: [Pt, Pt, Pt], t: number): Pt => {
    const [a, c, b] = p, u = 1 - t
    return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]
  }
  const dot = (x: number, y: number, rad: number, color: string, a: number) => {
    const gr = g.createRadialGradient(x * k, y * k, 0, x * k, y * k, rad * k)
    gr.addColorStop(0, color); gr.addColorStop(1, 'rgba(255,240,200,0)')
    g.globalAlpha = a; g.fillStyle = gr; g.beginPath(); g.arc(x * k, y * k, rad * k, 0, TAU); g.fill()
  }

  const frame = (ms: number) => {
    const s = ms / 1000
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'
    g.clearRect(0, 0, W, H)
    for (const e of effects) {
      g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'
      switch (e.k) {
        case 'ripple':
          rows(e.r, (t, y) => e.amp * Math.sin(Math.PI * t) * Math.sin(TAU * (y / e.wave - s / e.period))); break
        case 'sway': {
          const ph = TAU * s / e.period + (e.phase ?? 0)
          rows(e.r, (t, y) => e.amp * (1 - t) ** 1.6 * Math.sin(ph + (e.wave ? y / e.wave : 0))); break
        }
        case 'flag':
          cols(e.r, (t, x) => e.amp * t * Math.sin(TAU * (x / e.wave - s / e.period))); break
        case 'breathe': {
          const [x, y, w, h] = e.r, f = 1 + e.amount * (0.5 + 0.5 * Math.sin(TAU * s / e.period + (e.phase ?? 0)))
          g.drawImage(src, x * sc, y * sc, w * sc, h * sc, x * k, (y + h - h * f) * k, w * k, h * f * k); break
        }
        case 'glow': {
          const [x, y, w, h] = e.r
          let a = e.min + (e.max - e.min) * (0.5 + 0.5 * Math.sin(TAU * s / e.period + (e.phase ?? 0)))
          if (e.flicker && Math.sin(s * 7.3 + (e.phase ?? 0) * 3) > 0.985) a *= 0.35
          g.globalCompositeOperation = 'screen'; g.globalAlpha = a
          if (e.round) {
            const gr = g.createRadialGradient((x + w / 2) * k, (y + h / 2) * k, 0, (x + w / 2) * k, (y + h / 2) * k, Math.max(w, h) / 2 * k)
            gr.addColorStop(0, e.color); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr
          } else g.fillStyle = e.color
          g.fillRect(x * k, y * k, w * k, h * k); break
        }
        case 'scan': {
          const [x, y, w, h] = e.r, t = ((s / e.period + (e.phase ?? 0)) % 1 + 1) % 1, yy = y + t * (h + 30) - 15
          const gr = g.createLinearGradient(0, (yy - 14) * k, 0, (yy + 14) * k)
          gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(0.5, e.color); gr.addColorStop(1, 'rgba(0,0,0,0)')
          g.save(); g.beginPath(); g.rect(x * k, y * k, w * k, h * k); g.clip()
          g.globalCompositeOperation = 'screen'; g.globalAlpha = 0.55; g.fillStyle = gr; g.fillRect(x * k, (yy - 14) * k, w * k, 28 * k); g.restore(); break
        }
        case 'sheen': {
          const [x, y, w, h] = e.r, t = ((s / e.period + (e.phase ?? 0)) % 1 + 1) % 1
          if (t > 0.3) break
          const cx = x - h + (w + 2 * h) * (t / 0.3)
          g.save(); g.beginPath(); g.rect(x * k, y * k, w * k, h * k); g.clip()
          const gr = g.createLinearGradient((cx - 18) * k, 0, (cx + 18) * k, 0)
          gr.addColorStop(0, 'rgba(255,240,190,0)'); gr.addColorStop(0.5, 'rgba(255,240,190,.75)'); gr.addColorStop(1, 'rgba(255,240,190,0)')
          g.globalCompositeOperation = 'screen'
          g.fillStyle = gr; g.fillRect((cx - 18) * k, y * k, 36 * k, h * k); g.restore(); break
        }
        case 'sparks':
          g.globalCompositeOperation = 'lighter'
          e.paths.forEach((p, i) => {
            const t = ((s / e.period + i * 0.37) % 1)
            for (let j = 0; j < 5; j++) { const tt = t - j * 0.018; if (tt < 0) continue; const [x, y] = quad(p, tt); dot(x, y, e.size * (1 - j * 0.16), e.color, (1 - j * 0.2) * Math.sin(Math.PI * t)) }
          }); break
        case 'twinkle': {
          const [x, y, w, h] = e.r
          g.globalCompositeOperation = 'lighter'
          for (const [a, b, c, d] of pts.get(e) ?? []) {
            const tw = Math.max(0, Math.sin(TAU * (s / (2 + d * 3) + c)))
            if (tw < 0.2) continue
            const px = x + a * w, py = y + b * h, rr = e.size * tw
            dot(px, py, rr * 2.2, e.color, tw * 0.8)
            g.globalAlpha = tw * 0.9; g.strokeStyle = e.color; g.lineWidth = Math.max(1, 0.6 * k)
            g.beginPath(); g.moveTo((px - rr * 2) * k, py * k); g.lineTo((px + rr * 2) * k, py * k); g.moveTo(px * k, (py - rr * 2) * k); g.lineTo(px * k, (py + rr * 2) * k); g.stroke()
          }
          break
        }
        case 'rings':
          g.globalCompositeOperation = 'screen'
          e.at.forEach(([x, y], i) => {
            const t = ((s / e.period + i * 0.33) % 1)
            g.globalAlpha = (1 - t) * 0.8; g.strokeStyle = e.color; g.lineWidth = 2 * k
            g.beginPath(); g.ellipse(x * k, y * k, e.radius * t * k, e.radius * t * 0.45 * k, 0, 0, TAU); g.stroke()
          }); break
        case 'motes': {
          const [x, y, w, h] = e.r
          g.globalCompositeOperation = 'lighter'
          for (const [a, b, c, d] of pts.get(e) ?? []) {
            const life = ((s / (9 + d * 8) + c) % 1)
            const px = x + a * w + Math.sin(TAU * (life * 1.5 + d)) * 14, py = y + h - ((b + life * 0.6) % 1) * h
            dot(px, py, e.size * (0.6 + d * 0.6), e.color, Math.sin(Math.PI * life) * 0.7)
          }
          break
        }
        case 'birds':
          g.globalCompositeOperation = 'source-over'; g.strokeStyle = e.color; g.lineWidth = Math.max(1, 1.6 * k); g.lineCap = 'round'
          for (let i = 0; i < e.n; i++) {
            const a = TAU * (s / e.period + i / e.n * 0.22), bx = e.c[0] + Math.cos(a) * e.rx + i * 9, by = e.c[1] + Math.sin(a) * e.ry + (i % 2) * 7
            const flap = Math.sin(s * 9 + i * 1.7) * e.size * 0.55, z = e.size
            g.globalAlpha = 0.85; g.beginPath()
            g.moveTo((bx - z) * k, (by - flap) * k); g.quadraticCurveTo((bx - z * 0.4) * k, (by - z * 0.2) * k, bx * k, by * k)
            g.quadraticCurveTo((bx + z * 0.4) * k, (by - z * 0.2) * k, (bx + z) * k, (by - flap) * k); g.stroke()
          }
          break
      }
    }
  }

  // decode off the main thread first: the first drawImage of an undecoded picture would block for a long moment
  let decoded = false, src: CanvasImageSource = img
  const decode = () => img.decode()
    .then(() => ('createImageBitmap' in window ? createImageBitmap(img).then(b => { src = b }, () => { src = img }) : undefined))
    // a srcset copy reports naturalWidth in CSS px, not file px: take the scale from what drawImage really reads
    .then(() => { sc = (src instanceof ImageBitmap ? src.width : img.naturalWidth) / refW; decoded = true },
      () => { src = img; sc = img.naturalWidth / refW; decoded = img.complete })
  // srcset may switch to another copy when the window grows: decode again and rescale
  img.addEventListener('load', () => { decoded = false; decode() })
  if (img.complete) decode()
  let on = false, raf = 0, last = 0
  const loop = (ms: number) => {
    raf = requestAnimationFrame(loop)
    if (ms - last < 32) return // about 30 fps is plenty for a painting that breathes
    last = ms
    if (!decoded || !img.naturalWidth) return
    frame(ms)
  }
  const start = () => { if (on) return; on = true; size(); raf = requestAnimationFrame(loop) }
  const stop = () => { on = false; cancelAnimationFrame(raf) }
  new ResizeObserver(() => { if (on) size() }).observe(cv)
  // begin once the page has settled: the still painting is already showing, so a late start is invisible
  const idle = (f: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(f, { timeout: 2500 }) : setTimeout(f, 1200))
  const watch = () => idle(() => new IntersectionObserver(es => es.forEach(en => (en.isIntersecting ? start() : stop())), { threshold: 0.05 }).observe(box))
  if (document.readyState === 'complete') watch(); else addEventListener('load', watch, { once: true })
}
