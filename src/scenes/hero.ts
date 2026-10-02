import { setSeed, rnd, pick } from '../render/rng'
import { f1, OL } from '../render/util'
import { bake } from '../render/bake'
import { agePost } from '../render/mural-filter'
import { cloud, rocks, dabs, tree, palm, bird } from '../render/primitives/nature'
import { prang, chedi, house, junk } from '../render/primitives/buildings'

export function drawHero(){
  const H=document.getElementById('heroSvg');H.innerHTML=`<rect width="1000" height="380" fill="#e1d4b3"/>`;
  setSeed(41);let s=`<rect width="1000" height="230" fill="url(#skyG)"/>`;
  s+=cloud(560,52,170)+cloud(810,96,130)+cloud(390,110,100)+cloud(80,40,140);
  [[470,206,150,130],[610,210,190,160],[770,206,170,120],[900,212,170,150],[1000,210,160,120]].forEach((m:number[])=>s+=rocks(...(m as [number,number,number,number]),'rockG'));
  s+=`<rect y="200" width="1000" height="80" fill="#d3c7a0"/>`+dabs(140,0,200,1000,80,['#c9bb8f','#ddd0a8','#bdb88a']);
  const items=[];for(let i=0;i<34;i++){const x=400+i*18+rnd()*14;items.push([x,232+rnd()*18,pick(['house','house','tree','palm','chedi','prang']),.5+rnd()*.35])}
  items.push([700,250,'prang',1.3],[655,256,'prang',.9],[745,256,'prang',.9],[560,254,'chedi',1],[860,252,'chedi',.9]);
  items.sort((a,b)=>a[1]-b[1]).forEach(([x,y,k,sc])=>{const f={prang,chedi,tree:()=>tree(),house,palm}[k];s+=`<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc)})">${f()}</g>`});
  s+=`<rect x="370" y="262" width="630" height="13" fill="#b5714f" stroke="${OL}"/>${Array.from({length:62},(_,i)=>`<path d="M${373+i*10} 262 v-4 l2.5 -3 l2.5 3 v4" fill="#b5714f" stroke="${OL}" stroke-width=".6"/>`).join('')}`;
  s+=`<rect y="275" width="1000" height="105" fill="#9fb6ab"/><rect y="275" width="1000" height="105" fill="url(#waves)"/>`;
  s+=`<g transform="translate(520 322)">${junk()}</g><g transform="translate(700 352) scale(.8)">${junk()}</g><g transform="translate(880 310) scale(.7)">${junk()}</g>`;
  s+=`<rect width="560" height="380" fill="url(#hazeG)" opacity=".9"/>`;
  bake(1000,380,s,agePost(1000,380,9),2,url=>{if(!url)return;H.innerHTML=`<image class="paintfade" href="${url}" width="1000" height="380" preserveAspectRatio="none"/><path class="flow" d="M0 300 H1000 M0 336 H1000 M0 366 H1000"/><g class="bird">${bird(100,60)}${bird(124,72)}${bird(140,54)}</g>`});
}
