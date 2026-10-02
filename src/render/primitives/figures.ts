import { OL } from '../util'
import type { SpeakerId } from '../../data/schema'

export interface FigOpts{hat?:boolean;top?:string;cloth:string;pose:'point'|'pot'|'leaf'}
export function figure(o:FigOpts){const sk='#f0dfc0',ol='#6e3f26';let s='';
  const arm=(d:string,c:string,w=7)=>`<path d="${d}" fill="none" stroke="${ol}" stroke-width="${w+1.8}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  s+=`<ellipse cx="-8" cy="-3" rx="7" ry="3" fill="${sk}" stroke="${ol}" stroke-width=".8"/><ellipse cx="9" cy="-3" rx="7" ry="3" fill="${sk}" stroke="${ol}" stroke-width=".8"/>`;
  s+=`<polygon points="-12,-46 -4,-46 -6,-5 -11,-5" fill="${sk}" stroke="${ol}" stroke-width=".8"/><polygon points="4,-46 12,-46 11,-5 6,-5" fill="${sk}" stroke="${ol}" stroke-width=".8"/><path d="M-11 -10 h5 M6 -10 h5" stroke="#c09246" stroke-width="1.6"/>`;
  s+=`<path d="M-17 -112 L17 -112 L20 -54 Q12 -44 4 -52 L0 -68 L-4 -52 Q-12 -44 -20 -54Z" fill="url(#${o.cloth})" stroke="${ol}" stroke-width=".9"/><path d="M-19 -56 Q-12 -47 -4 -53 M4 -53 Q12 -47 19 -56" stroke="#c09246" stroke-width="1.2" fill="none"/>`;
  const tc=o.top||sk;
  s+=arm('M-15 -164 Q-23 -136 -18 -110',tc)+`<circle cx="-18" cy="-108" r="4" fill="${sk}" stroke="${ol}" stroke-width=".7"/>`;
  s+=`<path d="M-18 -168 Q-21 -140 -15 -112 L15 -112 Q21 -140 18 -168 Q0 -175 -18 -168Z" fill="${tc}" stroke="${ol}" stroke-width=".9"/>`;
  if(o.top)s+=`<path d="M-6 -170 L0 -150 L6 -170" fill="none" stroke="${ol}" stroke-width=".8"/><path d="M-15 -116 H15" stroke="#c09246" stroke-width="3.2"/><path d="M-16 -140 Q0 -136 16 -140" stroke="${ol}" stroke-width=".5" opacity=".5" fill="none"/>`;
  else s+=`<path d="M-17 -166 L15 -118" stroke="#c09246" stroke-width="4"/>`;
  s+=`<rect x="-4" y="-180" width="8" height="13" fill="${sk}"/><path d="M-7 -171 Q0 -165 7 -171" stroke="#c09246" stroke-width="1.6" fill="none"/><ellipse cx="0" cy="-193" rx="12" ry="15" fill="${sk}" stroke="${ol}" stroke-width=".9"/>`;
  s+=`<path d="M2 -198 q5 -3 9 0" stroke="#2a1c10" stroke-width="1" fill="none"/><path d="M3 -193 q4 2 8 0" stroke="#2a1c10" stroke-width="1.2" fill="none"/><path d="M6 -183 q2 1 4 0" stroke="#9a4a32" stroke-width="1.3" fill="none"/>`;
  s+=`<path d="M-12 -195 Q-13 -210 0 -209 Q12 -210 12 -197 Q6 -204 -2 -202 Q-8 -202 -12 -195Z" fill="#2a1c10"/>`;
  if(o.hat)s+=`<path d="M-12 -201 L12 -201 L4 -262 Q0 -267 -4 -262Z" fill="#efe6d0" stroke="${ol}" stroke-width=".9"/><path d="M-6 -230 L6 -230" stroke="${ol}" stroke-width=".5" opacity=".5"/><rect x="-12.5" y="-207" width="25" height="6" fill="#c09246" stroke="${ol}" stroke-width=".6"/><circle cx="0" cy="-265" r="2.4" fill="#c09246"/>`;
  if(o.pose==='point'){s+=arm('M15 -164 Q36 -150 56 -160',tc)+`<circle cx="58" cy="-161" r="4" fill="${sk}" stroke="${ol}" stroke-width=".7"/><path d="M61 -162 L70 -165" stroke="${sk}" stroke-width="2.4" stroke-linecap="round"/>`}
  else if(o.pose==='pot'){s+=arm('M15 -164 Q26 -136 12 -126',tc)+`<ellipse cx="6" cy="-122" rx="12" ry="9" fill="#7a4b2c" stroke="${ol}"/><path d="M-5 -124 h22" stroke="#c09246" stroke-width="1"/><rect x="-1" y="-134" width="14" height="5" fill="#5e3f26"/><circle cx="10" cy="-125" r="4" fill="${sk}" stroke="${ol}" stroke-width=".7"/>`}
  else{s+=arm('M15 -164 Q26 -136 10 -128',tc)+`<rect x="-14" y="-136" width="34" height="8" rx="2" fill="#dcc48c" stroke="${ol}" stroke-width=".8"/><rect x="-16" y="-137" width="4" height="10" fill="#94452f"/><rect x="18" y="-137" width="4" height="10" fill="#94452f"/><circle cx="8" cy="-128" r="4" fill="${sk}" stroke="${ol}" stroke-width=".7"/>`}
  return s}
export const FIG:Record<SpeakerId,FigOpts>={khun:{hat:true,top:'#9e4a32',cloth:'clothDot',pose:'point'},mor:{top:'#efe8d6',cloth:'clothBr',pose:'pot'},phon:{cloth:'clothBr',pose:'leaf'}};
/** Face and shoulders for everyone: the official's tall hat is cut off so the face shows in the circle. */
export function portrait(k:SpeakerId){const v=[-30,-224,60,60];return `<svg viewBox="${v.join(' ')}"><rect x="${v[0]}" y="${v[1]}" width="${v[2]}" height="${v[3]}" fill="#e2d3ae"/>${figure(FIG[k])}</svg>`}
