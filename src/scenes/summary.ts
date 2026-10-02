import { RM } from '../render/util'
import { st, render } from '../state/store'
import { SITES, STUDY, PEOPLE, CRIT_IDS, total } from '../data/content'
import { th, fmt, waTxt, areaTxt, bahtTxt, travel, beds } from '../data/units'
import { portrait } from '../render/primitives/figures'
import { S } from '../data/strings.th'

export function renderCompare(){
  const H=S.cmp.head;
  const head=`<tr><th>${H.site}</th><th class="n">${H.land}</th><th class="n">${H.gfa}</th><th class="n">${H.beds}</th><th class="n">${H.height}</th><th class="n">${H.horse}</th><th class="n">${H.boat}</th><th>${H.front}</th><th>${H.issue}</th><th class="n">${H.score}</th></tr>`;
  const max=CRIT_IDS.length*5;
  const rows=Object.entries(SITES).map(([k,s])=>{const r=s.rules;const f=r.flags.find(x=>x[0]==='risk')||r.flags[0];
    return `<tr data-site="${k}" class="${k===st.site?'on':''}"><td><b style="font-family:var(--f-display);color:var(--red-dk)">${th(s.n)}</b> ${s.name}</td><td class="n">${areaTxt(s.land_m2)}</td><td class="n">${areaTxt(r.gfa_m2)}</td><td class="n">${fmt(beds(s))}</td><td class="n">${waTxt(r.maxHeight_m)}</td><td class="n">${bahtTxt(travel(k,'horse').baht)}</td><td class="n">${bahtTxt(travel(k,'boat').baht)}</td><td><span class="tag ${s.astro.good?'ok':'risk'}">${s.astro.front}</span></td><td>${f?`<span class="tag ${f[0]}">${f[1]}</span>`:''}</td><td class="n"><b style="color:var(--red-dk)">${th(total(s))}</b>/${th(max)}</td></tr>`}).join('');
  const t=document.getElementById('cmp') as HTMLElement;t.innerHTML=head+rows;
  t.querySelectorAll<HTMLElement>('tr[data-site]').forEach(tr=>tr.addEventListener('click',()=>{st.site=tr.dataset.site??null;st.mode='site';render('site');document.getElementById('mapsec')?.scrollIntoView({behavior:RM?'auto':'smooth'})}))}

export function renderOpinions(){
  (document.getElementById('opin') as HTMLElement).innerHTML=STUDY.opinions.map(({speaker:k,text:t})=>`<div class="leaf rv"><div class="narr"><div class="pt">${portrait(k)}</div><div><div class="who">${PEOPLE[k].name}</div><div class="dim">${PEOPLE[k].role}</div></div></div><p style="margin-top:8px">“${t}”</p></div>`).join('')}
