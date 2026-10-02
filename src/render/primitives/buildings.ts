import { rnd, pick } from '../rng'
import { f1 } from '../util'
import { OL } from '../util'

export function house(){const thatch=rnd()>.55;const roof=thatch?'#b4955a':pick(['#9a4a32','#8e5236','#a5583a']);let s='';
  s+=`<path d="M-9 0 V-8 M9 0 V-8 M0 0 V-8" stroke="#5e3f26" stroke-width="1.6"/><path d="M12 0 L15 -8 M14 -2 h2 M13 -5 h2.5" stroke="#5e3f26" stroke-width="1"/>`;
  s+=`<rect x="-12" y="-9" width="24" height="2" fill="#7a5536"/><rect x="-11" y="-19" width="22" height="10" fill="#c4a06c" stroke="${OL}" stroke-width=".6"/><rect x="-11" y="-19" width="22" height="10" fill="url(#plank)"/><rect x="-3" y="-16" width="5" height="6" fill="#4a2c1b"/>`;
  s+=`<path d="M-15 -18 L0 -36 L15 -18Z" fill="${roof}" stroke="${OL}" stroke-width=".8"/><path d="M-15 -18 L0 -36 L15 -18Z" fill="url(#${thatch?'thatch':'tileP'})"/><path d="M0 -36 L15 -18 L7 -18Z" fill="#3a2010" opacity=".18"/><path d="M-6 -24 L0 -31 L6 -24Z" fill="#e2cfa4" opacity=".6"/>`;
  if(!thatch)s+=`<path d="M0 -36 q-1 -4 2.5 -6.5" stroke="#c09246" stroke-width="1.3" fill="none"/>`;return s}
export function prang(){return `<rect x="-24" y="-6" width="48" height="6" fill="#d8c7a2" stroke="${OL}" stroke-width=".7"/><rect x="-19" y="-12" width="38" height="6" fill="#d0b994" stroke="${OL}" stroke-width=".7"/>
 <path d="M-16 -12 L-12 -24 L-11 -46 C-11 -62 -4 -70 0 -82 C4 -70 11 -62 11 -46 L12 -24 L16 -12Z" fill="url(#prangG)" stroke="${OL}" stroke-width="1"/>
 <path d="M-11.5 -28 H11.5 M-11 -40 H11 M-9.5 -52 H9.5 M-7 -62 H7 M-4 -71 H4" stroke="${OL}" stroke-width=".8" opacity=".75"/>
 <path d="M-11 -28 q-4 -4 -2 -8 M11 -28 q4 -4 2 -8 M-10 -40 q-4 -4 -2 -8 M10 -40 q4 -4 2 -8" stroke="#e7cfa0" stroke-width="1.2" fill="none"/>
 <path d="M-3.5 -12 v-12 q3.5 -5 7 0 v12z" fill="#4a2c1b"/><line x1="0" y1="-82" x2="0" y2="-96" stroke="#c09246" stroke-width="2.2"/><circle cx="0" cy="-88" r="1.8" fill="#c09246"/><circle cx="0" cy="-93" r="1.3" fill="#c09246"/>`}
export function chedi(){return `<rect x="-26" y="-8" width="52" height="8" fill="#e3d8bd" stroke="${OL}" stroke-width=".7"/><rect x="-21" y="-15" width="42" height="7" fill="#e7ddc4" stroke="${OL}" stroke-width=".7"/><rect x="-17" y="-20" width="34" height="5" fill="#ebe2cb" stroke="${OL}" stroke-width=".7"/>
 <path d="M-15 -20 C-15 -36 -8 -42 0 -44 C8 -42 15 -36 15 -20Z" fill="url(#chediG)" stroke="${OL}"/><rect x="-5" y="-49" width="10" height="5" fill="#e3d8bd" stroke="${OL}" stroke-width=".6"/>
 <path d="M-3.5 -49 L0 -76 L3.5 -49Z" fill="#c4994c" stroke="${OL}" stroke-width=".7"/><path d="M-3 -53 h6 M-2.4 -58 h4.8 M-1.8 -63 h3.6 M-1.2 -68 h2.4" stroke="#7a5a2c" stroke-width=".6"/>`}
export function junk(){return `<path d="M-22 0 C-12 7 12 7 24 -3 L18 -3 L-18 -3Z" fill="#6e4127" stroke="#3a2819" stroke-width=".8"/><path d="M-18 -3 C-8 0 8 0 18 -3" stroke="#c09246" stroke-width=".8" fill="none"/>
 <path d="M-3 -3 L-3 -34 L13 -27 L13 -9Z" fill="#cdb187" stroke="#3a2819" stroke-width=".7"/><path d="M-3 -7 H13 M-3 -15 H13 M-3 -23 H13" stroke="#7a5a3a" stroke-width=".6"/><path d="M-14 -3 L-14 -20 L-5 -16 L-5 -6Z" fill="#c2a378" stroke="#3a2819" stroke-width=".6"/><path d="M18 -3 q4 -8 8 -6" stroke="#6e4127" stroke-width="1.6" fill="none"/>`}
export function fort(){return `<rect x="-9" y="-16" width="18" height="16" fill="#c08560" stroke="${OL}" stroke-width=".8"/><path d="M-9 -16 v-3 h3 v3 h3 v-3 h3 v3 h3 v-3 h3 v3" fill="#c08560" stroke="${OL}" stroke-width=".6"/><path d="M-11 -19 L0 -29 L11 -19Z" fill="#8e4a31" stroke="${OL}" stroke-width=".8"/><path d="M-11 -19 L0 -29 L11 -19Z" fill="url(#tileP)"/><rect x="-2" y="-8" width="4" height="8" fill="#4a2c1b"/>`}
export function hallE(w:number,h:number,o:{d?:number,fl?:number}={}){const d=o.d||0,fl=o.fl||1,base=6;let s='';
  s+=`<rect x="${-w/2-6}" y="${-base}" width="${w+12}" height="${base}" fill="#ebe1c8" stroke="${OL}" stroke-width=".8"/><path d="M${-w/2-6} ${-base+2} h${w+12}" stroke="#c09246" stroke-width=".8"/>`;
  if(d)s+=`<polygon points="${w/2+6},${-base} ${w/2+6+d},${-base-d*.5} ${w/2+6+d},${-d*.5} ${w/2+6},0" fill="#d2c4a4" stroke="${OL}" stroke-width=".7"/><polygon points="${w/2},${-base} ${w/2+d},${-base-d*.5} ${w/2+d},${-base-h-d*.5} ${w/2},${-base-h}" fill="#cbb78f" stroke="${OL}" stroke-width=".8"/>`;
  s+=`<rect x="${-w/2}" y="${-base-h}" width="${w}" height="${h}" fill="#eae0c6" stroke="${OL}" stroke-width=".9"/><rect x="${-w/2}" y="${-base-h}" width="${w}" height="4" fill="#3a2010" opacity=".2"/>`;
  const cols=Math.max(2,Math.round(w/22));for(let i=0;i<=cols;i++){const x=-w/2+i*w/cols;s+=`<rect x="${f1(x-1.8)}" y="${-base-h}" width="3.6" height="${h}" fill="#94452f"/><rect x="${f1(x-2.4)}" y="${-base-h}" width="4.8" height="2.4" fill="#c09246"/>`}
  const fh=h/fl;for(let k=0;k<fl;k++){const y=-base-h+k*fh+fh*.25;for(let i=0;i<cols;i++){const x=-w/2+(i+.5)*w/cols;if(k===fl-1&&i===Math.floor(cols/2))continue;s+=`<path d="M${f1(x-3.6)} ${f1(y+fh*.5)} V${f1(y+3)} Q${f1(x)} ${f1(y-1.5)} ${f1(x+3.6)} ${f1(y+3)} V${f1(y+fh*.5)}Z" fill="#4a2c1b" stroke="#c09246" stroke-width=".6"/>`}}
  const mx=-w/2+(Math.floor(cols/2)+.5)*w/cols;s+=`<path d="M${f1(mx-5.5)} ${-base} V${f1(-base-fh*.62)} Q${f1(mx)} ${f1(-base-fh*.84)} ${f1(mx+5.5)} ${f1(-base-fh*.62)} V${-base}Z" fill="#3e2416" stroke="#c09246" stroke-width=".8"/>`;
  if(d)for(let k=0;k<fl;k++){const y=-base-h+k*fh+fh*.3;s+=`<line x1="${w/2+3}" y1="${f1(y-1.5)}" x2="${w/2+d-3}" y2="${f1(y-d*.5+1.5)}" stroke="#6e4b2c" stroke-width="2" stroke-dasharray="3 3"/>`}
  return s}
export function roofE(w,h,tiers,d=0){let s='';for(let t=0;t<tiers;t++){const k=1-t*.2,ww=w*k,yb=-t*h*.42,yt=yb-h*.42;
  const sk=`${f1(-ww/2-10)},${f1(yb)} ${f1(ww/2+10)},${f1(yb)} ${f1(ww*.3)},${f1(yt)} ${f1(-ww*.3)},${f1(yt)}`;
  if(d)s+=`<polygon points="${f1(ww/2+10)},${f1(yb)} ${f1(ww/2+10+d)},${f1(yb-d*.5)} ${f1(ww*.3+d)},${f1(yt-d*.5)} ${f1(ww*.3)},${f1(yt)}" fill="#7d3c27" stroke="${OL}" stroke-width=".8"/><polygon points="${f1(ww/2+10)},${f1(yb)} ${f1(ww/2+10+d)},${f1(yb-d*.5)} ${f1(ww*.3+d)},${f1(yt-d*.5)} ${f1(ww*.3)},${f1(yt)}" fill="url(#tileP)"/>`;
  s+=`<polygon points="${sk}" fill="#a3553a" stroke="${OL}" stroke-width=".9"/><polygon points="${sk}" fill="url(#tileP)"/><polygon points="${f1(-ww*.3)},${f1(yt)} ${f1(ww*.3)},${f1(yt)} ${f1(ww*.36)},${f1(yt+h*.08)} ${f1(-ww*.36)},${f1(yt+h*.08)}" fill="#f0dfb4" opacity=".22"/>`;
  s+=`<line x1="${f1(-ww/2-10)}" y1="${f1(yb)}" x2="${f1(ww/2+10)}" y2="${f1(yb)}" stroke="#c09246" stroke-width="1.8"/><path d="M${f1(-ww/2-10)} ${f1(yb)} q-6 -2 -6 -9" fill="none" stroke="#c09246" stroke-width="1.8"/><path d="M${f1(ww/2+10)} ${f1(yb)} q6 -2 6 -9" fill="none" stroke="#c09246" stroke-width="1.8"/>`;
  if(t===tiers-1){const ay=yt-h*.55;
   if(d)s+=`<polygon points="${f1(ww*.3)},${f1(yt)} ${f1(ww*.3+d)},${f1(yt-d*.5)} ${f1(d)},${f1(ay-d*.5)} 0,${f1(ay)}" fill="#72331f" stroke="${OL}" stroke-width=".8"/><line x1="0" y1="${f1(ay)}" x2="${d}" y2="${f1(ay-d*.5)}" stroke="#c09246" stroke-width="2"/>`;
   s+=`<polygon points="${f1(-ww*.3)},${f1(yt)} ${f1(ww*.3)},${f1(yt)} 0,${f1(ay)}" fill="#c4994c" stroke="${OL}" stroke-width=".9"/><polygon points="${f1(-ww*.22)},${f1(yt-2)} ${f1(ww*.22)},${f1(yt-2)} 0,${f1(ay+h*.12)}" fill="#9a4a32"/>`;
   s+=`<path d="M${f1(-ww*.12)} ${f1(yt-3)} q${f1(ww*.12)} ${f1(-h*.22)} ${f1(ww*.24)} 0" fill="none" stroke="#e2c98c" stroke-width="1.2"/><circle cx="0" cy="${f1(yt-h*.16)}" r="${f1(Math.max(2,ww*.035))}" fill="#e7d3a0"/>`;
   s+=`<path d="M${f1(-ww*.3)} ${f1(yt)} L0 ${f1(ay)} L${f1(ww*.3)} ${f1(yt)}" fill="none" stroke="#efe0bb" stroke-width="2.4" stroke-dasharray="2 2.4"/><path d="M0 ${f1(ay)} q-3 -8 3 -14" fill="none" stroke="#c09246" stroke-width="2.4" stroke-linecap="round"/>`}
 }return s}
