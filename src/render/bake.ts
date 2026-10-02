import { bakeDefs } from './defs'
import { paintFilter } from './mural-filter'
import { ageParams, getAgeLevel } from './age'
import { COARSE } from './util'

/** hash of the source files that draw the art (set by vite.config.ts); a change makes prebaked art stale */
declare const __ART_SRC__: string | undefined
/** set only in the single-file review build, which has no art folder (and cannot fetch from file://) */
declare const __INLINE_STUDY__: string | undefined

const MOBILE_SCALE = 1.5

export function bake(w:number,h:number,inner:string,post:string,fullScale:number,cb:(url:string|null)=>void){
  const scale=COARSE?Math.min(fullScale,MOBILE_SCALE):fullScale;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(w*scale)}" height="${Math.round(h*scale)}" viewBox="0 0 ${w} ${h}"><defs>${bakeDefs(ageParams(getAgeLevel()).stainOpacity)}${paintFilter(w,h)}</defs><rect width="${w}" height="${h}" fill="#e3d6b6"/><g filter="url(#op)">${inner}</g>${post}</svg>`;
  const url='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  const img=new Image();
  img.onload=()=>{try{const c=document.createElement('canvas');c.width=Math.round(w*scale);c.height=Math.round(h*scale);c.getContext('2d')!.drawImage(img,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',window.__artQuality??.9))}catch(e){cb(url)}};
  img.onerror=()=>cb(null);img.src=url}

/* ---------- prebaked art ----------
 * The three painted scenes (hero, story, map) are deterministic, and baking them through the heavy paint filter
 * blocks the browser for several seconds. `npm run art` bakes them once, offline, into public/art/*.jpg together with
 * a manifest of signatures. At load the signature is recomputed from the source files, the age level, the sizes and
 * (for the map) the site positions: if it matches, the JPEG is used and the drawing code is skipped; if not
 * (another ageLevel, moved sites, changed drawing code) the art is baked in the browser as before.
 */
export interface Art { inner: string; post: string }

const fnv = (s: string) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) } return (h >>> 0).toString(16) }
let manifest: Record<string, { sig: string }> = {}

export async function loadArtManifest() {
  if (typeof __INLINE_STUDY__ === 'string') return
  try { const r = await fetch(`${import.meta.env.BASE_URL}art/manifest.json`); if (r.ok) manifest = await r.json() } catch { /* no prebaked art: bake in the browser */ }
}

export const artSig = (key: string, w: number, h: number, scale: number, extra: unknown) =>
  fnv(JSON.stringify([typeof __ART_SRC__ === 'string' ? __ART_SRC__ : '', key, w, h, scale, ageParams(getAgeLevel()), extra]))

export function bakeArt(key: string, w: number, h: number, scale: number, extra: unknown, build: () => Art, cb: (url: string | null, inner: string) => void) {
  const sig = artSig(key, w, h, scale, extra)
  const how = (window.__art ??= {})
  const runtime = () => {
    how[key] = 'baked'
    const a = build()
    bake(w, h, a.inner, a.post, scale, url => { if (url && window.__saveArt) window.__saveArt(key, sig, url); cb(url, a.inner) })
  }
  if (window.__artForce || manifest[key]?.sig !== sig) { runtime(); return }
  const src = `${import.meta.env.BASE_URL}art/${key}.jpg`
  const img = new Image()
  img.onload = () => { how[key] = 'prebaked'; cb(src, '') }
  img.onerror = runtime
  img.src = src
}
