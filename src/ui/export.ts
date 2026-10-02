import { S } from '../data/strings.th'
import { st } from '../state/store'
import { formatHash } from '../state/url'
import { map } from '../scenes/map'

const OUT_WIDTH = 2000
const MAX_BYTES = 1_500_000 // target size of the saved picture
const QUALITIES = [0.9, 0.86, 0.82, 0.78, 0.74, 0.7]

const toDataUrl = (blob: Blob) => new Promise<string>((res, rej) => {
  const r = new FileReader(); r.onload = () => res(r.result as string); r.onerror = () => rej(r.error); r.readAsDataURL(blob)
})

/** The page's own CSS (so the picture is styled exactly like the screen), with the web fonts embedded as data URIs. */
let cssCache: Promise<string> | null = null
function pageCss(): Promise<string> {
  cssCache ??= (async () => {
    const out: string[] = []
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList
      try { rules = sheet.cssRules } catch { continue }
      for (const rule of Array.from(rules)) {
        if (rule instanceof CSSKeyframesRule) continue
        if (rule instanceof CSSFontFaceRule) {
          let text = rule.cssText
          for (const m of Array.from(text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g))) {
            if (m[1].startsWith('data:')) continue
            const blob = await (await fetch(new URL(m[1], sheet.href ?? document.baseURI))).blob()
            text = text.replace(m[0], `url("${await toDataUrl(blob)}")`)
          }
          out.push(text)
        } else out.push(rule.cssText)
      }
    }
    return out.join('\n')
  })()
  return cssCache
}

/** Serialise the map as it is on screen right now (current zoom, models, routes, vehicles). */
async function mapSvg(): Promise<{ svg: string; w: number; h: number }> {
  const vb = (map.getAttribute('viewBox') as string).split(/\s+/).map(Number)
  const w = OUT_WIDTH, h = Math.round(OUT_WIDTH * vb[3] / vb[2])
  const clone = map.cloneNode(true) as SVGSVGElement
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('width', String(w)); clone.setAttribute('height', String(h))
  const defs = (document.getElementById('gdefs') as HTMLElement).innerHTML
  // a still picture: no running animation (the models would sit at their first frame), no dust puff
  const still = '*{animation:none!important;transition:none!important}.dust{display:none}'
  const head = `<defs>${defs}</defs><style>${await pageCss()}\n${still}</style>`
  const text = new XMLSerializer().serializeToString(clone)
  const at = text.indexOf('>') + 1
  return { svg: text.slice(0, at) + head + text.slice(at), w, h }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

export async function mapJpeg(): Promise<Blob> {
  const { svg, w, h } = await mapSvg()
  const img = new Image()
  await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error('svg')); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) })
  const c = document.createElement('canvas'); c.width = w; c.height = h
  const g = c.getContext('2d') as CanvasRenderingContext2D
  g.fillStyle = '#e1d4b3'; g.fillRect(0, 0, w, h) // JPEG has no transparency
  g.drawImage(img, 0, 0, w, h)
  await sleep(200) // embedded fonts decode lazily: paint once, wait, paint again
  g.fillRect(0, 0, w, h); g.drawImage(img, 0, 0, w, h)
  // JPEG at about 0.9; step the quality down only if the file would be over the size target
  let blob: Blob | null = null
  for (const q of QUALITIES) {
    blob = await new Promise<Blob | null>(res => c.toBlob(res, 'image/jpeg', q))
    if (blob && blob.size <= MAX_BYTES) break
  }
  if (!blob) throw new Error('jpeg')
  return blob
}

export const exportName = () => 'ayudha-map' + formatHash({ mode: st.mode, site: st.site }).replace('#', '-').replace('lens-', '')

export function initExport() {
  const btn = document.getElementById('saveMap') as HTMLButtonElement
  const status = document.getElementById('mapStatus') as HTMLElement
  btn.addEventListener('click', async () => {
    btn.disabled = true; status.textContent = S.map.saving
    try {
      const blob = await mapJpeg()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = `${exportName()}.jpg`
      document.body.appendChild(a); a.click(); a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 10000)
      status.textContent = S.map.saved
    } catch { status.textContent = S.map.saveFail }
    finally { btn.disabled = false }
  })
}
