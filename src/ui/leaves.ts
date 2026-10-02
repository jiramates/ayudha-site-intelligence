import { RM, f1 } from '../render/util'
import { st, render, curSite } from '../state/store'
import { drawDynamic } from '../scenes/map-live'
import { SITES, ZONES, MODES, DEST, CRIT, CRIT_IDS, MODE_IDS, total } from '../data/content'
import { th, fmt, numWord, waTxt, areaTxt, bahtTxt, travel, beds } from '../data/units'
import { DIRS, DIR_GOOD, DIR_BAD, UNIT, S } from '../data/strings.th'
import type { Site, Side } from '../data/schema'

const panel = document.getElementById('panel') as HTMLElement
const MAX_SCORE = 5
const maxTotal = CRIT_IDS.length * MAX_SCORE

export const scoreBars=(s:Site)=>`<div class="bars">${CRIT_IDS.map(k=>`<div class="bar"><span>${CRIT[k]}</span><span class="t"><i style="width:${s.score[k]*20}%"></i></span><b>${th(s.score[k])}/${th(MAX_SCORE)}</b></div>`).join('')}</div>`;
export function panelSite(){
  if(!st.site)return `<div class="leaf wide"><h3>${S.site.pickTitle}</h3><p class="dim">${S.site.pickHint}</p><div class="sitepick">${Object.entries(SITES).map(([k,s])=>`<button data-pick="${k}"><span class="s">${th(s.n)}</span><span><b>${s.name}</b> — ${s.desc}</span></button>`).join('')}</div></div>`;
  const s=curSite(),r=s.rules;
  return `<div class="leaf"><h3>${S.site.siteTitle(numWord(s.n),s.name)}</h3><p class="dim">${s.desc}</p>
   <div class="stats"><div class="stat"><div class="v">${areaTxt(s.land_m2)}</div><div class="l">${S.site.land}</div></div><div class="stat"><div class="v">${areaTxt(r.gfa_m2)}</div><div class="l">${S.site.gfa}</div></div><div class="stat"><div class="v">${S.site.bedsAbout} ${fmt(beds(s))}</div><div class="l">${S.site.beds}</div></div></div></div>
  <div class="leaf"><h3>${S.site.prosCons}</h3><ul class="pl">${s.pros.map(p=>`<li class="p"><span></span><span>${p}</span></li>`).join('')}${s.cons.map(p=>`<li class="c"><span></span><span>${p}</span></li>`).join('')}</ul></div>
  <div class="leaf wide"><h3>${S.site.verdictTitle}</h3><p>“${s.verdict}”</p><h4>${S.site.scoreTitle(th(total(s)),th(maxTotal))}</h4>${scoreBars(s)}</div>`}
export function parcelSVG(s:Site){const r=s.rules,[w,d]=r.dims_m,W=320,H=230,M=46;const k=Math.min((W-2*M)/w,(H-2*M-6)/d);const pw=w*k,ph=d*k,px=(W-pw)/2,py=(H-ph)/2+2;
  const set:Record<Side,number>={top:2,bottom:2,left:2,right:2};set[r.roadSide]=r.roadSetback_m;if(r.water)set[r.water.side]=r.water.setback_m;
  const band=(side:Side,t:number,fill:string,label:string,lf:string)=>{let x=0,y=0,ww=0,hh=0,tx=0,ty=0,rot=0;
    if(side==='bottom'){x=px-14;y=py+ph;ww=pw+28;hh=t;tx=px+pw/2;ty=y+t/2}if(side==='top'){x=px-14;y=py-t;ww=pw+28;hh=t;tx=px+pw/2;ty=y+t/2}
    if(side==='left'){x=px-t;y=py-14;ww=t;hh=ph+28;tx=x+t/2;ty=py+ph/2;rot=-90}if(side==='right'){x=px+pw;y=py-14;ww=t;hh=ph+28;tx=x+t/2;ty=py+ph/2;rot=90}
    return `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(ww)}" height="${f1(hh)}" fill="${fill}" opacity=".85"/><text x="${f1(tx)}" y="${f1(ty)}" text-anchor="middle" dominant-baseline="middle" transform="rotate(${rot} ${f1(tx)} ${f1(ty)})" style="font-size:11px;fill:${lf}">${label}</text>`};
  const bx=px+set.left*k,by=py+set.top*k,bw=pw-(set.left+set.right)*k,bh=ph-(set.top+set.bottom)*k;const area=(w-set.left-set.right)*(d-set.top-set.bottom);
  const lab=(side:Side,v:number)=>{const m={top:[px+pw/2,py+set.top*k/2+4],bottom:[px+pw/2,py+ph-set.bottom*k/2+4],left:[px+set.left*k/2,py+ph/2+4],right:[px+pw-set.right*k/2-2,py+ph/2-12]}[side];return v>2?`<text x="${f1(m[0])}" y="${f1(m[1])}" text-anchor="middle" style="font-size:10.5px;fill:#743524;font-weight:600">${waTxt(v)}</text>`:''};
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${S.reg.parcelAria}">${band(r.roadSide,22,'#c4aa7c',S.reg.roadLabel(waTxt(r.road_m)),'#3a2819')}${r.water?band(r.water.side,18,'#9fb4a8',r.water.name,'#21403b'):''}
   <rect x="${f1(px)}" y="${f1(py)}" width="${f1(pw)}" height="${f1(ph)}" fill="url(#hatchR)" stroke="#3a2819" stroke-width="1.4"/><rect x="${f1(bx)}" y="${f1(by)}" width="${f1(bw)}" height="${f1(bh)}" fill="#e3cf9c" stroke="#a1412a" stroke-width="1.6" stroke-dasharray="5 3"/>
   <text x="${f1(bx+bw/2)}" y="${f1(by+bh/2-3)}" text-anchor="middle" style="font-size:13px;fill:#3a2819">${S.reg.buildable}</text><text x="${f1(bx+bw/2)}" y="${f1(by+bh/2+13)}" text-anchor="middle" style="font-size:11.5px;fill:#56401f">${areaTxt(area)}</text>
   ${(['top','bottom','left','right'] as Side[]).map(sd=>lab(sd,set[sd])).join('')}<text x="${f1(px+pw)}" y="${f1(py-6-((r.roadSide==='top'||(r.water&&r.water.side==='top'))?20:0))}" text-anchor="end" style="font-size:11px;fill:#56401f">${S.reg.dimsLabel(`${th(w/2)} ${UNIT.wa}`,`${th(d/2)} ${UNIT.wa}`)}</text></svg>`}
export function compassSVG(s:Site){const C=110,R=82;let g='';
  DIRS.forEach(([n,a])=>{const r=(a-90)*Math.PI/180;const isF=n===s.astro.front;const good=DIR_GOOD.includes(n),bad=n===DIR_BAD;
    const fill=isF?(s.astro.good?'#4c7444':'#a1412a'):good?'rgba(76,116,68,.28)':bad?'rgba(161,65,42,.22)':'rgba(180,138,64,.25)';
    const p1=[C+Math.cos(r-.32)*30,C+Math.sin(r-.32)*30],tip=[C+Math.cos(r)*R*.78,C+Math.sin(r)*R*.78],p2=[C+Math.cos(r+.32)*30,C+Math.sin(r+.32)*30];
    g+=`<path d="M${f1(p1[0])} ${f1(p1[1])} Q${f1(C+Math.cos(r-.22)*R*.7)} ${f1(C+Math.sin(r-.22)*R*.7)} ${f1(tip[0])} ${f1(tip[1])} Q${f1(C+Math.cos(r+.22)*R*.7)} ${f1(C+Math.sin(r+.22)*R*.7)} ${f1(p2[0])} ${f1(p2[1])}Z" fill="${fill}" stroke="#5e3420" stroke-width="1"/>`;
    const lp=[C+Math.cos(r)*(R+16),C+Math.sin(r)*(R+16)];g+=`<text x="${f1(lp[0])}" y="${f1(lp[1]+4)}" text-anchor="middle" style="font-size:12.5px;font-weight:${isF?700:400};fill:${isF?(s.astro.good?'#4c7444':'#a1412a'):'#3a2819'}">${n}</text>`});
  g+=`<circle cx="${C}" cy="${C}" r="26" fill="#e3cf9c" stroke="#5e3420"/><text x="${C}" y="${C-2}" text-anchor="middle" style="font-size:11px;fill:#56401f">${S.reg.front}</text><text x="${C}" y="${C+13}" text-anchor="middle" style="font-size:13px;font-weight:700;fill:#743524">${s.astro.front}</text>`;
  return `<svg viewBox="-10 -6 240 232" role="img" aria-label="${S.reg.astroAria}">${g}</svg>`}
export function panelReg(){const s=curSite(),r=s.rules;const z=st.zone?ZONES[st.zone]:undefined;
  const row=(k:string,v:string,style='')=>`<tr><th>${k}</th><td class="n"${style}>${v}</td></tr>`;const R=S.reg.rows;
  return `${z?`<div class="leaf wide zonecard"><button class="x" id="zx" aria-label="${S.reg.close}">${S.reg.closeGlyph}</button><h3>${z.title}</h3><p>${z.text}</p><div style="display:flex;gap:6px;flex-wrap:wrap">${z.tags.map(t=>`<span class="tag mod">${t}</span>`).join('')}</div></div>`:''}
   <div class="leaf"><h3>${S.reg.title(numWord(s.n))}</h3><p class="dim">${S.reg.hint}</p>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin:4px 0 8px">${r.flags.map(f=>`<span class="tag ${f[0]}">${f[1]}</span>`).join('')}</div>
    <table class="tbl">${row(R.land,areaTxt(s.land_m2))}${row(R.road,waTxt(r.road_m))}${row(R.roadSet,waTxt(r.roadSetback_m))}${row(R.waterSet,r.water?waTxt(r.water.setback_m):UNIT.dash)}${row(R.maxHeight,waTxt(r.maxHeight_m))}${row(R.cap,r.heightCap_m?waTxt(r.heightCap_m):R.capNone)}${row(R.far,`${th(r.far)} ${R.farUnit}`)}${row(R.gfa,areaTxt(r.gfa_m2),` style="color:${r.gfa_m2<r.gfaAllow_m2?'var(--risk)':'inherit'}"`)}${row(R.flood,`${th(r.floodSok)} ${UNIT.cubit}`)}</table></div>
   <div class="leaf"><h3>${S.reg.parcelTitle}</h3><div class="diag">${parcelSVG(s)}</div><p class="dim">${S.reg.parcelNote}</p></div>
   <div class="leaf wide"><h3>${S.reg.astroTitle}</h3><div class="astrogrid"><div class="diag">${compassSVG(s)}</div>
     <div><p><span class="tag ${s.astro.good?'ok':'risk'}">${s.astro.good?S.reg.good:S.reg.bad}</span></p><p>${s.astro.text}</p><p><b>${S.reg.advise}</b> ${s.astro.fix}</p>
     <table class="tbl">${S.reg.lore.map(([a,b])=>`<tr><th>${a}</th><td>${b}</td></tr>`).join('')}</table>
     <p class="dim" style="margin-top:6px">${S.reg.loreClimate}</p></div></div></div>`}
export function panelTr(){const s=curSite();const H=S.tr.head;
  const rows=MODE_IDS.map(k=>{const m=MODES[k],t=travel(s.id,k);return `<tr><th><span style="display:inline-block;width:11px;height:11px;border-radius:2px;background:${m.color};margin-right:6px"></span>${m.name}</th><td>${DEST[k].name}<br><span class="tag mod">${m.equiv}</span></td><td class="n">${th(Math.round(t.sen))} ${UNIT.sen}</td><td class="n"><b>${bahtTxt(t.baht)}</b><br><span class="dim">${th(Math.round(t.min))} ${UNIT.minute}</span></td></tr>`}).join('');
  const speeds=MODE_IDS.map(k=>`${MODES[k].name} ${th(+MODES[k].senPerBaht.toFixed(2))}`).join(' ');
  return `<div class="leaf"><h3>${S.tr.title(numWord(s.n))}</h3><p class="dim">${S.tr.hint}</p>
    <div class="modes">${MODE_IDS.map(k=>{const m=MODES[k];return `<button class="mode" data-m="${k}" aria-pressed="${st.tm[k]}"><span class="sw" style="background:${m.color}"></span><span><b>${m.name}</b><small>${m.meaning}</small></span></button>`}).join('')}</div>
    <h4>${S.tr.courierTitle}</h4><p>“${s.transportNote}”</p></div>
   <div class="leaf"><h3>${S.tr.timeTitle}</h3><div class="scroll"><table class="tbl" style="min-width:330px"><tr><th>${H.mode}</th><th>${H.dest}</th><th class="n">${H.dist}</th><th class="n">${H.time}</th></tr>${rows}</table></div><p class="dim" style="margin-top:6px">${S.tr.speeds(speeds)}</p></div>`}
export function renderPanel(){panel.innerHTML=st.mode==='site'?panelSite():st.mode==='reg'?panelReg():panelTr();
  panel.querySelectorAll<HTMLElement>('[data-pick]').forEach(b=>b.addEventListener('click',()=>{st.site=b.dataset.pick??null;render('site');document.getElementById('mapbox')?.scrollIntoView({behavior:RM?'auto':'smooth',block:'center'})}));
  const zx=document.getElementById('zx');if(zx)zx.onclick=()=>{st.zone=null;render('zoneclose')};
  panel.querySelectorAll<HTMLElement>('.mode').forEach(b=>b.addEventListener('click',()=>{const m=b.dataset.m as string;st.tm[m]=!st.tm[m];drawDynamic();renderPanel()}))}
