import { DEFS } from './defs'
import { paintFilter } from './mural-filter'

/** v3 shipped at about level 1.5; not wired to the filters until P2 (BUILD_BRIEF §4.3). */
export const AGE_LEVEL = 1.5

export function bake(w,h,inner,post,scale,cb){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(w*scale)}" height="${Math.round(h*scale)}" viewBox="0 0 ${w} ${h}"><defs>${DEFS}${paintFilter(w,h)}</defs><rect width="${w}" height="${h}" fill="#e3d6b6"/><g filter="url(#op)">${inner}</g>${post}</svg>`;
  const url='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  const img=new Image();
  img.onload=()=>{try{const c=document.createElement('canvas');c.width=Math.round(w*scale);c.height=Math.round(h*scale);c.getContext('2d').drawImage(img,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.9))}catch(e){cb(url)}};
  img.onerror=()=>cb(null);img.src=url}
