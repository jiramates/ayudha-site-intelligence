import { rnd } from './rng'
import { f1 } from './util'

export function paintFilter(w:number,h:number){return `<filter id="op" filterUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}" color-interpolation-filters="sRGB">
 <feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="4" result="w"/>
 <feDisplacementMap in="SourceGraphic" in2="w" scale="3" xChannelSelector="R" yChannelSelector="G" result="d"/>
 <feTurbulence type="fractalNoise" baseFrequency=".009 .015" numOctaves="3" seed="8" result="m"/>
 <feColorMatrix in="m" values="0.36 0.36 0.36 0 0.37  0.36 0.36 0.36 0 0.37  0.36 0.36 0.36 0 0.34  0 0 0 0 1" result="mg"/>
 <feBlend in="d" in2="mg" mode="multiply" result="p1"/>
 <feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="2" seed="2" result="g"/>
 <feColorMatrix in="g" values="0.32 0.32 0.32 0 0.58  0.32 0.32 0.32 0 0.58  0.32 0.32 0.32 0 0.55  0 0 0 0 1" result="gg"/>
 <feBlend in="p1" in2="gg" mode="multiply" result="p2"/>
 <feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="4" seed="21" result="f"/>
 <feColorMatrix in="f" values="0 0 0 0 .93  0 0 0 0 .89  0 0 0 0 .79  18 0 0 0 -12.3" result="fl"/>
 <feTurbulence type="fractalNoise" baseFrequency=".2" numOctaves="2" seed="31" result="f2"/>
 <feColorMatrix in="f2" values="0 0 0 0 .95  0 0 0 0 .92  0 0 0 0 .84  26 0 0 0 -18.8" result="fl2"/>
 <feMerge><feMergeNode in="p2"/><feMergeNode in="fl"/><feMergeNode in="fl2"/></feMerge></filter>`}
export function agePost(w:number,h:number,n=8){let s='';
  for(let i=0;i<5;i++)s+=`<ellipse cx="${f1(rnd()*w)}" cy="${f1(rnd()*h)}" rx="${f1(60+rnd()*140)}" ry="${f1(40+rnd()*90)}" fill="url(#stainG)"/>`;
  for(let i=0;i<4;i++)s+=`<ellipse cx="${f1(rnd()*w)}" cy="${f1(rnd()*h)}" rx="${f1(80+rnd()*120)}" ry="${f1(50+rnd()*60)}" fill="url(#hazeG)"/>`;
  for(let c=0;c<n;c++){let x=rnd()*w,y=rnd()*h,a=rnd()*6.28;let d=`M${f1(x)} ${f1(y)}`;const steps=10+rnd()*22;for(let i=0;i<steps;i++){a+=(rnd()-.5)*1.1;x+=Math.cos(a)*(4+rnd()*8);y+=Math.sin(a)*(4+rnd()*8);d+=` L${f1(x)} ${f1(y)}`}
    s+=`<path d="${d}" fill="none" stroke="#fff6e2" stroke-width="1" opacity=".5" transform="translate(.8 .8)"/><path d="${d}" fill="none" stroke="#4f3a24" stroke-width=".75" opacity=".55"/>`}
  s+=`<rect y="${h*.8}" width="${w}" height="${h*.2}" fill="url(#dampG)"/><rect width="${w}" height="${h}" fill="url(#vigG)"/>`;return s}
