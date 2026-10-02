import { RM } from '../render/util'
import { st, render } from '../state/store'
import { SITES, PEOPLE, NUMW, LAND, total } from '../data/content'
import { th, fmt, waTxt, areaTxt, bahtTxt, travel } from '../data/units'
import { portrait } from '../render/primitives/figures'
import { OPIN } from '../data/strings.th'

export function renderCompare(){
  const head=`<tr><th>ทำเล</th><th class="n">เนื้อที่</th><th class="n">พื้นอาคารได้จริง</th><th class="n">เตียง</th><th class="n">สูงได้</th><th class="n">ม้าเร็วถึงวัง</th><th class="n">เรือถึงท่าสำเภา</th><th>หน้าโรง</th><th>ข้อติดสำคัญ</th><th class="n">คะแนน</th></tr>`;
  const rows=Object.entries(SITES).map(([k,s])=>{const r=s.reg;const f=r.flags.find(x=>x[0]==='risk')||r.flags[0];
    return `<tr data-site="${k}" class="${k===st.site?'on':''}"><td><b style="font-family:var(--f-display);color:var(--red-dk)">${th(s.n)}</b> ${s.name}</td><td class="n">${areaTxt(LAND[k])}</td><td class="n">${areaTxt(r.gfa)}</td><td class="n">${fmt(r.gfa/130)}</td><td class="n">${waTxt(r.top)}</td><td class="n">${bahtTxt(travel(k,'horse').baht)}</td><td class="n">${bahtTxt(travel(k,'boat').baht)}</td><td><span class="tag ${s.astro.good?'ok':'risk'}">${s.astro.front}</span></td><td><span class="tag ${f[0]}">${f[1]}</span></td><td class="n"><b style="color:var(--red-dk)">${th(total(s))}</b>/๒๐</td></tr>`}).join('');
  const t=document.getElementById('cmp');t.innerHTML=head+rows;
  t.querySelectorAll<HTMLElement>('tr[data-site]').forEach(tr=>tr.addEventListener('click',()=>{st.site=tr.dataset.site;st.mode='site';render('site');document.getElementById('mapsec').scrollIntoView({behavior:RM?'auto':'smooth'})}))}

export function renderOpinions(){
document.getElementById('opin')!.innerHTML=OPIN.map(([k,t])=>`<div class="leaf rv"><div class="narr"><div class="pt">${portrait(k)}</div><div><div class="who">${PEOPLE[k].name}</div><div class="dim">${PEOPLE[k].role}</div></div></div><p style="margin-top:8px">“${t}”</p></div>`).join('')}
