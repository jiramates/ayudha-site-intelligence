import { f1, RM } from '../render/util'
import { pj, pathP, scaleAround, circleP, bb } from '../render/projection'
import { map, ISL, boatsAmb, boatG } from './map'
import { MASS } from './massing'
import { st, render } from '../state/store'
import { SITES, ZONES, MODES, DEST } from '../data/content'
import { DIRS, DIR, S } from '../data/strings.th'
import type { XY, Side, ModeId } from '../data/schema'
import { th } from '../data/units'
import { VEH } from '../render/primitives/vehicles'

type Box=[number,number,number,number]
interface Token{k:ModeId;segs:[number[],number[],number,number][];L:number;v:number;el?:Element|null}
interface Item{x:number;y:number;h:string;k?:number;top?:boolean}
const VEHICLE_SPEED=1.6 // plan units per second per (sen per baht)
export let vb:Box=[0,0,1000,700],vbAnim=0

export function zoomTo(t:Box,dur=1000){const from=vb.slice();const t0=performance.now();cancelAnimationFrame(vbAnim);const ease=(x:number)=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
  const step=(n:number)=>{const k=RM||!dur?1:Math.min(1,(n-t0)/dur);const e=ease(k);vb=from.map((v,i)=>v+(t[i]-v)*e) as Box;map.setAttribute('viewBox',vb.map(f1).join(' '));if(k<1)vbAnim=requestAnimationFrame(step)};vbAnim=requestAnimationFrame(step)}
export function siteBox(k:string):Box{const q=pj(...SITES[k].pos);const w=520,h=364;let x=q[0]-w/2,y=q[1]-h*.66;x=Math.max(0,Math.min(1000-w,x));y=Math.max(0,Math.min(700-h,y));return[x,y,w,h]}
export let tokens:Token[]=[];
export function drawDynamic(){
  const ground=document.getElementById('ground') as HTMLElement,routes=document.getElementById('routes') as HTMLElement;let gs='',rs='';const items:Item[]=[];
  Object.entries(SITES).forEach(([k,s])=>{const on=k===st.site;const [x,y]=s.pos,hw=s.parcelPx[0]/2,hh=s.parcelPx[1]/2;const P=[[x-hw,y-hh],[x+hw,y-hh],[x+hw,y+hh],[x-hw,y+hh]];
    gs+=`<path d="${pathP(P,true)}" fill="${on?'rgba(160,74,51,.24)':'rgba(160,74,51,.1)'}" stroke="#743524" stroke-width="${on?2:1.2}" stroke-dasharray="4 3"/>`;
    if(st.mode==='reg'&&on){const r=s.rules,set:Record<Side,number>={top:2,bottom:2,left:2,right:2};set[r.roadSide]=r.roadSetback_m;if(r.water)set[r.water.side]=r.water.setback_m;const fx=(v:number)=>v/r.dims_m[0]*s.parcelPx[0]*2.2,fy=(v:number)=>v/r.dims_m[1]*s.parcelPx[1]*2.2;
      const ix1=x-hw+fx(set.left),ix2=x+hw-fx(set.right),iy1=y-hh+fy(set.top),iy2=y+hh-fy(set.bottom);
      gs+=`<path d="${pathP(P,true)}" fill="url(#hatchR)"/><path d="${pathP([[ix1,iy1],[ix2,iy1],[ix2,iy2],[ix1,iy2]],true)}" fill="#e0d3ad" stroke="#a1412a" stroke-width="1.6" stroke-dasharray="5 3"/>`;
      const dir=s.astro.front===DIR.south?[0,1]:[-1,0];const a0:XY=[x+dir[0]*hw,y+dir[1]*hh],a1:XY=[a0[0]+dir[0]*55,a0[1]+dir[1]*55];const c=s.astro.good?'#4c7444':'#a1412a';
      gs+=`<path d="${pathP([a0,a1])}" stroke="${c}" stroke-width="4" stroke-linecap="round" class="fade"/>`;
      items.push({x:a1[0],y:a1[1]+4,h:`<rect x="-46" y="-36" width="92" height="22" rx="3" fill="${c}"/><text y="-20" text-anchor="middle" style="font-size:13px;fill:#f4e6c8">${S.map.front(s.astro.front)}</text>`,k:1.1})}
    if(!(st.mode==='site'&&on)){const q=pj(x,y);gs+=`<ellipse class="ring" cx="${f1(q[0])}" cy="${f1(q[1])}" rx="${f1(20*q[2])}" ry="${f1(9*q[2])}" fill="none" stroke="#a04a33" stroke-width="2"/>`}
  });
  if(st.mode==='reg'){
    gs+=`<g class="fade"><path d="${pathP(circleP(300,250,168,168),true)}" fill="rgba(160,74,51,.08)" stroke="#a04a33" stroke-width="1.8" stroke-dasharray="8 5"/><path d="${pathP(circleP(230,110,210,62),true)}" fill="url(#hatchB)" stroke="#46717f" stroke-dasharray="4 3"/><path d="${pathP(scaleAround(ISL,510,410,.915),true)}" fill="none" stroke="#a04a33" stroke-width="1.6" stroke-dasharray="2 4"/></g>`;
    const cx=905,cy=640;DIRS.forEach(([n,a])=>{const r=a*Math.PI/180;const e:[number,number]=[cx+Math.sin(r)*60,cy-Math.cos(r)*42];gs+=`<path d="${pathP([[cx,cy],e])}" stroke="${n===DIR.west?'#a1412a':'#6a553d'}" stroke-width="${a%90?1:2}"/>`;const q=pj(...e);gs+=`<text x="${f1(q[0])}" y="${f1(q[1]+4)}" text-anchor="middle" style="font-size:11px;fill:${n===DIR.west?'#a1412a':'#3a2819'};paint-order:stroke;stroke:rgba(225,215,185,.9);stroke-width:3px">${n}</text>`});
    Object.entries(ZONES).forEach(([k,z])=>items.push({x:z.pos[0],y:z.pos[1],top:true,k:1.15,h:`<g class="zic${st.zone===k?' on':''}" data-zone="${k}" tabindex="0" role="button" aria-label="${z.title}"><line x1="0" y1="0" x2="0" y2="-18" stroke="#5e3420" stroke-width="2"/><circle class="s" cy="-36" r="19" fill="#e9dcbc" stroke="#a04a33" stroke-width="2.4"/><circle cy="-36" r="14.5" fill="none" stroke="#a04a33" stroke-width=".8" stroke-dasharray="2 2"/><text y="-30" text-anchor="middle" style="font-size:15px;font-weight:600;fill:#743524">${z.seal}</text></g>`}));
  }
  tokens=[];
  if(st.mode==='tr'&&st.site){(Object.entries(SITES[st.site].routes) as [ModeId,XY[]][]).forEach(([k,p])=>{if(!st.tm[k])return;const m=MODES[k];const d=pathP(p);
    if(k==='ele')rs+=`<path d="${d}" class="routeln" stroke="#4a2c1b" stroke-width="${m.width+3}" opacity=".45"/>`;
    rs+=`<path d="${d}" class="routeln${m.dash?'':' draw'}" stroke="${m.color}" stroke-width="${m.width}" ${m.dash?`stroke-dasharray="${m.dash}"`:'pathLength="1000" stroke-dasharray="1000" style="--len:1000"'}/>`;
    items.push({x:DEST[k].pt[0],y:DEST[k].pt[1],h:`<line x1="0" y1="0" x2="0" y2="-36" stroke="#4a2c1b" stroke-width="2"/><path class="flag" d="M0 -36 L24 -30 L0 -24Z" fill="${m.color}"/>`});
    const segs:Token['segs']=[];let L=0;for(let i=1;i<p.length;i++){const l=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);segs.push([p[i-1],p[i],L,l]);L+=l}tokens.push({k,segs,L,v:m.senPerBaht*VEHICLE_SPEED})})}
  ground.innerHTML=gs;routes.innerHTML=rs;
  Object.entries(SITES).forEach(([k,s])=>{const on=k===st.site;if(st.mode==='site'&&on)return;
    items.push({x:s.pos[0],y:s.pos[1],top:true,k:1.15,h:`<g class="site" data-site="${k}" tabindex="0" role="button" aria-label="${S.map.siteAria(s.name)}"><ellipse rx="12" ry="4" fill="#3a2819" opacity=".22"/><line x1="0" y1="0" x2="0" y2="-62" stroke="#4a2c1b" stroke-width="2.6"/><path class="flag" d="M1 -62 L40 -52 L1 -42Z" fill="${on?'#743524':'#a04a33'}" stroke="#5f2c1e"/><circle cy="-70" r="15" fill="${on?'#743524':'#a04a33'}" stroke="#c09246" stroke-width="2.2"/><circle cy="-70" r="11" fill="none" stroke="#e9d3a0" stroke-width=".7" stroke-dasharray="2 2"/><text y="-63" text-anchor="middle" style="font-family:var(--f-display);font-weight:700;font-size:19px;fill:#f4e6c8">${th(s.n)}</text></g>`})});
  if(st.mode==='site'&&st.site){const s=SITES[st.site];const parts=MASS[s.massing](s);
    items.push({x:s.pos[0],y:s.pos[1]+2,k:s.massing==='pavilion-campus'?1.05:1.08,h:`<ellipse class="dust" rx="120" ry="16" fill="#c9b78c" opacity=".6"/><ellipse rx="110" ry="12" fill="#3a2819" opacity=".16"/><g filter="url(#lite)">`+parts.map((p:{h:string;drop?:number},i:number)=>`<g class="${p.drop?'drop':'pop'}" style="--i:${i}">${p.h}</g>`).join('')+`</g><g data-site="${st.site}" class="site" tabindex="0" role="button" aria-label="${S.map.hideModel}" transform="translate(-130 -30)"><circle r="13" fill="#743524" stroke="#c09246" stroke-width="2"/><text y="6" text-anchor="middle" style="font-family:var(--f-display);font-weight:700;font-size:17px;fill:#f4e6c8">${th(s.n)}</text></g>`})}
  items.sort((a,b)=>(a.top?1:0)-(b.top?1:0)||a.y-b.y);
  (document.getElementById('bbs') as HTMLElement).innerHTML=items.map(it=>bb(it.x,it.y,it.h,it.k||1)).join('');
  (document.getElementById('tokens') as HTMLElement).innerHTML=tokens.map(t=>`<g id="tk-${t.k}"><g filter="url(#lite)">${VEH[t.k]}</g></g>`).join('');
  tokens.forEach(t=>t.el=document.getElementById('tk-'+t.k));
}
export function bindMap(){
map.addEventListener('click',e=>{const sEl=(e.target as Element).closest<HTMLElement>('[data-site]'),zEl=(e.target as Element).closest<HTMLElement>('[data-zone]');
  if(zEl){st.zone=st.zone===zEl.dataset.zone?null:(zEl.dataset.zone??null);render('zone');return}
  if(sEl){const k=sEl.dataset.site??null;if(st.mode==='site'&&st.site===k){st.site=null;render('out')}else{st.site=k;st.zone=null;render('site')}}});
map.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const t=(e.target as Element).closest<HTMLElement>('[data-site],[data-zone]');if(t){e.preventDefault();t.dispatchEvent(new MouseEvent('click',{bubbles:true}))}});
}
export function tick(now:number){const t=now/1000;
  tokens.forEach(k=>{if(!k.el)return;const d=RM?k.L*.6:(t*k.v)%k.L;const sg=k.segs.find(g=>d>=g[2]&&d<=g[2]+g[3])||k.segs[k.segs.length-1];const f=(d-sg[2])/sg[3];
    const q=pj(sg[0][0]+(sg[1][0]-sg[0][0])*f,sg[0][1]+(sg[1][1]-sg[0][1])*f);const fl=sg[1][0]<sg[0][0]?-1:1;k.el.setAttribute('transform',`translate(${f1(q[0])} ${f1(q[1])}) scale(${(fl*q[2]*1.25).toFixed(3)} ${(q[2]*1.25).toFixed(3)})`)});
  if(!RM&&ISL.length)boatsAmb.forEach(b=>{const n=ISL.length-1;const f=((b.o+t*b.v)%1)*n;const i=Math.floor(f),r=f-i;const a=ISL[i],c=ISL[Math.min(n,i+1)];const q=pj(a[0]+(c[0]-a[0])*r,a[1]+(c[1]-a[1])*r);b.e.setAttribute('transform',`translate(${f1(q[0])} ${f1(q[1])}) scale(${(q[2]*1.1).toFixed(3)})`)});
  requestAnimationFrame(tick)}
