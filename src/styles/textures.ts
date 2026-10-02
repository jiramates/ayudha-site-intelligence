

export function installTextures(){const enc=(s:string)=>`url("data:image/svg+xml,${encodeURIComponent(s)}")`;const r=document.documentElement.style;
  // calm plaster grain for the page, tabs and badges: fine grain only (it tiles without a seam) — no flakes, no cracks; those live inside the painted frames. Soft mottling comes from gradients in layout.css
  r.setProperty('--tx-plaster',enc(`<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260"><filter id="b"><feTurbulence stitchTiles="stitch" type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="6"/><feColorMatrix values="0 0 0 0 .35 0 0 0 0 .25 0 0 0 0 .14 0 0 0 .26 0"/></filter><rect width="260" height="260" filter="url(#b)"/></svg>`));
  r.setProperty('--tx-fiber',enc(`<svg xmlns="http://www.w3.org/2000/svg" width="420" height="90"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency=".004 .5" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 .42 0 0 0 0 .28 0 0 0 0 .1 0 0 0 1.6 -.62"/></filter><rect width="420" height="90" filter="url(#f)"/></svg>`));
  r.setProperty('--tx-fox',enc(`<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="3" seed="9"/><feColorMatrix values="0 0 0 0 .4 0 0 0 0 .25 0 0 0 0 .08 9 0 0 0 -5.7"/></filter><rect width="360" height="200" filter="url(#g)" opacity=".5"/></svg>`));
}
