import { setSeed } from '../render/rng'
import { OL } from '../render/util'
import { bake } from '../render/bake'
import { agePost } from '../render/mural-filter'
import { cloud, rocks, dabs, tufts, tree, palm, bird } from '../render/primitives/nature'
import { hallE, roofE } from '../render/primitives/buildings'
import { figure, portrait, FIG } from '../render/primitives/figures'
import { VEH } from '../render/primitives/vehicles'
import { PEOPLE, STORY, E, P } from '../data/content'
import type { SpeakerId } from '../data/schema'

export function drawScene(){
  const G=document.getElementById('scene') as HTMLElement;G.innerHTML=`<rect width="900" height="480" fill="#e1d4b3"/>`;
  setSeed(73);let s=`<rect width="900" height="270" fill="url(#skyG)"/>`+cloud(520,46,150)+cloud(730,84,120)+cloud(330,70,90);
  s+=rocks(120,262,250,230)+rocks(300,262,160,150,'rockG2')+rocks(620,262,120,80,'rockG2');
  s+=`<rect y="250" width="900" height="205" fill="#d4c79f"/>`+dabs(260,0,250,900,205,['#c6b98c','#dacda4','#b9b585','#c9b98a'],1.2)+tufts(90,0,270,900,180);
  [[860,300,2.2],[30,300,2.2],[640,272,1.4],[600,276,1.2]].forEach(([x,y,k])=>s+=`<g transform="translate(${x} ${y}) scale(${k})">${tree()}</g>`);
  [[880,330],[780,262],[700,258],[20,250]].forEach(([x,y])=>s+=`<g transform="translate(${x} ${y}) scale(1.6)">${palm()}</g>`);
  s+=`<g transform="translate(780 330) scale(2.4)">${VEH.ele}</g><g transform="translate(812 312) scale(1.3)"><circle cx="0" cy="-30" r="3.6" fill="#f0dfc0"/><rect x="-4" y="-27" width="8" height="10" fill="#9e4a32"/></g>`;
  s+=`<g transform="translate(180 410)">${hallE(260,74,{fl:1,d:22})}<g transform="translate(0 -80)">${roofE(260,72,2,22)}</g>
    <rect x="-118" y="-32" width="236" height="22" fill="#cdb187" opacity=".9"/>
    ${[-86,-26,34].map(x=>`<ellipse cx="${x-26}" cy="-26" rx="7" ry="6" fill="#f0dfc0" stroke="${OL}" stroke-width=".7"/><path d="M${x-31} -32 q4 -3 10 0" fill="#2a1c10"/><rect x="${x-19}" y="-32" width="46" height="12" rx="5" fill="#8b9e86" stroke="${OL}" stroke-width=".7"/><path d="M${x-15} -26 h38" stroke="#c09246" stroke-width=".8"/>`).join('')}
    <g transform="translate(98 -12)"><ellipse cx="0" cy="0" rx="11" ry="8" fill="#6e4127" stroke="${OL}"/><path d="M-6 6 l-4 6 M6 6 l4 6" stroke="#3a2819" stroke-width="2"/><path d="M-4 8 q4 -4 8 0" stroke="#d26a3a" stroke-width="2" fill="none"/></g></g>`;
  s+=`<g transform="translate(560 412)"><rect x="-74" y="-30" width="148" height="10" fill="#94452f" stroke="${OL}"/><path d="M-74 -26 h148" stroke="#c09246" stroke-width="1"/><path d="M-64 -20 v20 M64 -20 v20" stroke="#6e3524" stroke-width="7"/>
    <polygon points="-62,-30 62,-30 50,-50 -50,-50" fill="#e5d3a2" stroke="${OL}" stroke-width=".8"/><ellipse cx="0" cy="-40" rx="32" ry="6.5" fill="none" stroke="#7a9e93" stroke-width="3.5"/><path d="M-10 -46 v12 M-32 -40 h64" stroke="#a88456" stroke-width="1.2"/><circle cx="18" cy="-42" r="2.6" fill="#a04a33"/><circle cx="-14" cy="-37" r="2.6" fill="#a04a33"/><circle cx="6" cy="-45" r="2.6" fill="#a04a33"/></g>`;
  s+=`<rect y="452" width="900" height="28" fill="#94462f"/>`+Array.from({length:32},(_,i)=>`<g transform="translate(${14+i*28} 466)" fill="#e8d6ae" opacity=".75"><ellipse cy="-5" rx="2.4" ry="3.2"/><ellipse cy="5" rx="2.4" ry="3.2"/><ellipse cx="-5" rx="3.2" ry="2.4"/><ellipse cx="5" rx="3.2" ry="2.4"/><circle r="1.8" fill="#c08e45"/></g>`).join('');
  const live=()=>{let L='';([['khun',440,412,false],['mor',690,412,true]] as [SpeakerId,number,number,boolean][]).forEach(([k,x,y,flip])=>{L+=`<g transform="translate(${x} ${y}) scale(${flip?-1:1} 1)"><g class="fig" id="f-${k}"><g class="halo" transform="translate(0 -196)"><circle r="24" fill="#f3e4b0" opacity=".55"/><circle class="r" r="31" fill="none" stroke="#c09246" stroke-width="2" stroke-dasharray="3 5"/></g><g class="body" filter="url(#lite)">${figure(FIG[k])}</g></g></g>`});
    L+=`<path class="steam" d="M276 390 q-4 -6 0 -12 q4 -6 0 -12" stroke="#b8a888" fill="none" stroke-width="1.6"/><g class="bird">${bird(80,58)}${bird(102,70)}${bird(120,52)}</g>`;return L};
  bake(900,480,s,agePost(900,480,8),2,(url:string|null)=>{G.innerHTML=(url?`<image class="paintfade" href="${url}" width="900" height="480" preserveAspectRatio="none"/>`:`<g>${s}</g>`)+live();setSpeaker(curSpk)});
  (document.getElementById('lines') as HTMLElement).innerHTML=STORY.map(({speaker:k,text:t},i)=>`<div class="leaf line" data-k="${k}" data-i="${i}"><div class="pt">${portrait(k)}</div><div><div class="who">${E(PEOPLE[k].name)} <small>· ${E(PEOPLE[k].role)}</small></div><p>${P(t)}</p></div></div>`).join('');
  document.querySelectorAll<HTMLElement>('.line').forEach(l=>l.addEventListener('click',()=>{curSpk=+(l.dataset.i??0);setSpeaker(curSpk)}));
}
export let curSpk=0;
export function setSpeaker(i:number){const k=STORY[i].speaker;document.querySelectorAll<HTMLElement>('.fig').forEach(f=>f.classList.toggle('on',f.id==='f-'+k));document.querySelectorAll<HTMLElement>('.line').forEach(l=>l.classList.toggle('on',+(l.dataset.i??0)===i))}

export const nextSpeaker=()=>{curSpk=(curSpk+1)%STORY.length;setSpeaker(curSpk)}
