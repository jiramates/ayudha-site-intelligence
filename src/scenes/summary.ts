import { RM } from '../render/util'
import { st, render } from '../state/store'
import { SITES, STUDY, PEOPLE, CRIT_IDS, total, E, P } from '../data/content'
import { th, fmt, waTxt, areaTxt, bahtTxt, travel, beds } from '../data/units'
import { portrait } from '../render/primitives/figures'
import { S } from '../data/strings.th'

const openRows=new Set<string>();let ledgerBound=false;
export function renderCompare(){
  const H=S.cmp.head;
  const head=`<tr><th>${H.site}</th><th class="n">${H.land}</th><th class="n">${H.gfa}</th><th class="n">${H.beds}</th><th class="n">${H.height}</th><th class="n">${H.horse}</th><th class="n">${H.boat}</th><th>${H.front}</th><th>${H.issue}</th><th class="n">${H.score}</th></tr>`;
  const max=CRIT_IDS.length*5;const topScore=Math.max(...Object.values(SITES).map(total));
  const rows=Object.entries(SITES).map(([k,s])=>{const r=s.rules;const f=r.flags.find(x=>x[0]==='risk')||r.flags[0];
    const sc=total(s),best=sc===topScore;
    return `<tr data-site="${k}" class="${k===st.site?'on':''}${best?' best':''}"><td><b style="font-family:var(--f-display);color:var(--red-dk)">${th(s.n)}</b> ${E(s.name)}${best?` <span class="tag ok">${S.cmp.best}</span>`:''}</td><td class="n">${areaTxt(s.land_m2)}</td><td class="n">${areaTxt(r.gfa_m2)}</td><td class="n">${fmt(beds(s))}</td><td class="n">${waTxt(r.maxHeight_m)}</td><td class="n">${bahtTxt(travel(k,'horse').baht)}</td><td class="n">${bahtTxt(travel(k,'boat').baht)}</td><td><span class="tag ${s.astro.good?'ok':'risk'}">${s.astro.front}</span></td><td>${f?`<span class="tag ${f[0]}">${P(f[1],s)}</span>`:''}</td><td class="n score"><span class="sbar" aria-hidden="true"><i style="width:${sc/max*100}%"></i></span><b style="color:var(--red-dk)">${th(sc)}</b>/${th(max)}</td></tr>`}).join('');
  const t=document.getElementById('cmp') as HTMLElement;t.innerHTML=head+rows;
  const toMap=(k:string|undefined)=>{st.site=k??null;st.mode='site';render('site');document.getElementById('mapsec')?.scrollIntoView({behavior:RM?'auto':'smooth'})};
  t.querySelectorAll<HTMLElement>('tr[data-site]').forEach(tr=>tr.addEventListener('click',()=>toMap(tr.dataset.site)));

  // phones: a short ledger (site, score out of the maximum, buildable floor area); a tap opens the rest of that site's numbers
  const ledger=Object.entries(SITES).map(([k,s])=>{const r=s.rules;const f=r.flags.find(x=>x[0]==='risk')||r.flags[0];const sc=total(s),best=sc===topScore;
    const det=[[H.land,areaTxt(s.land_m2)],[H.beds,fmt(beds(s))],[H.height,waTxt(r.maxHeight_m)],[H.horse,bahtTxt(travel(k,'horse').baht)],[H.boat,bahtTxt(travel(k,'boat').baht)],[H.front,`<span class="tag ${s.astro.good?'ok':'risk'}">${s.astro.front}</span>`],[H.issue,f?`<span class="tag ${f[0]}">${P(f[1],s)}</span>`:'']];
    const on=openRows.has(k);return `<div class="lrow${best?' best':''}" data-site="${k}"><button type="button" class="lhead" aria-expanded="${on}"><span class="s">${th(s.n)}</span><span class="ln"><b>${E(s.short)}</b>${best?` <span class="tag ok">${S.cmp.best}</span>`:''}</span><span class="lg">${areaTxt(r.gfa_m2)}</span><span class="lbar"><span class="sbar" aria-hidden="true"><i style="width:${sc/max*100}%"></i></span><span><b style="color:var(--red-dk)">${th(sc)}</b>/${th(max)}</span></span><span class="lgl">${H.gfa}</span></button><dl class="ldet"${on?'':' hidden'}>${det.map(([l,v])=>`<dt>${l}</dt><dd>${v}</dd>`).join('')}<button type="button" class="linkbtn go">${S.cmp.openMap}</button></dl></div>`}).join('');
  const lg=document.getElementById('ledger') as HTMLElement;lg.innerHTML=ledger;
  if(ledgerBound)return;ledgerBound=true;
  lg.addEventListener('click',e=>{const el=e.target as Element;const row=el.closest<HTMLElement>('.lrow');if(!row)return;
    if(el.closest('.go')){toMap(row.dataset.site);return}
    const head=el.closest('.lhead');if(!head)return;const det=row.querySelector<HTMLElement>('.ldet') as HTMLElement;const open=det.hidden;det.hidden=!open;if(open)openRows.add(row.dataset.site??'');else openRows.delete(row.dataset.site??'');head.setAttribute('aria-expanded',String(open))})}

export function renderOpinions(){
  (document.getElementById('opin') as HTMLElement).innerHTML=STUDY.opinions.map(({speaker:k,text:t})=>`<div class="leaf"><div class="narr2"><div class="pt">${portrait(k)}</div><div><div class="who">${E(PEOPLE[k].name)}</div><div class="dim">${E(PEOPLE[k].role)}</div></div></div><p style="margin-top:8px">“${P(t)}”</p></div>`).join('')}
