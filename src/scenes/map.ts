import { setSeed, rnd, pick } from '../render/rng'
import { f1, NS, OL } from '../render/util'
import { bakeArt, type Art } from '../render/bake'
import { agePost } from '../render/mural-filter'
import { pj, sampleEl, pathP, scaleAround, bb } from '../render/projection'
import { cloud, rocks, tree, palm } from '../render/primitives/nature'
import { house, prang, chedi, junk, fort, roofE } from '../render/primitives/buildings'
import { SITES } from '../data/content'
import { S as STR } from '../data/strings.th'
import type { XY } from '../data/schema'

export let ISL:XY[]=[];
export const map=document.getElementById('map') as unknown as SVGSVGElement;
export const boatsAmb:{e:SVGGElement;o:number;v:number}[]=[];
export const boatG=`<path d="M-12 0 C-6 4 6 4 13 -2 L-12 -2Z" fill="#6e4127" stroke="#3a2819" stroke-width=".7"/><circle cx="-2" cy="-7" r="2.6" fill="#f0dfc0"/><path d="M-2 -4 V-1" stroke="#9e4a32" stroke-width="3"/><path d="M2 -6 L10 3" stroke="#5e3f26" stroke-width="1.2"/>`;
export function drawMap(){
  ISL=sampleEl('islandSrc',180);setSeed(11);
  const W=sampleEl('rvW',40),N=sampleEl('rvN',30),E=sampleEl('rvE',40),S=sampleEl('rvS',30);
  const isl=document.getElementById('islandSrc') as unknown as SVGGeometryElement;const inIsl=(x:number,y:number)=>isl.isPointInFill(new DOMPoint(x,y));
  const art=():Art=>{setSeed(11);let s=`<rect width="1000" height="230" fill="url(#skyG)"/>`;
  s+=cloud(110,62,140)+cloud(620,40,160)+cloud(860,86,110)+cloud(380,96,90);
  [[60,196,180,100],[200,190,160,80],[340,194,220,110],[520,190,170,90],[680,194,230,120],[860,190,200,100],[990,196,180,110]].forEach((m:number[])=>s+=rocks(...(m as [number,number,number,number]),'rockG2'));
  [[130,200,200,120],[430,202,240,130],[760,202,260,140]].forEach((m:number[])=>s+=rocks(...(m as [number,number,number,number])));
  s+=`<path d="${pathP([[-600,0],[1600,0],[1600,760],[-600,760]],true)}" fill="#d3c69b"/>`;
  // ground dabs (projected)
  for(let i=0;i<1100;i++){const x=-300+rnd()*1600,y=rnd()*760;const q=pj(x,y);s+=`<ellipse cx="${f1(q[0])}" cy="${f1(q[1])}" rx="${f1((5+rnd()*12)*q[2])}" ry="${f1((1.6+rnd()*2.6)*q[2])}" fill="${pick(['#c6b98b','#dcd0a7','#bab688','#c9bd8f','#a9ab7c'])}" opacity="${f1(.25+rnd()*.35)}"/>`}
  [[20,600,170,140],[700,40,170,120],[40,380,90,120],[860,640,140,110],[300,690,200,60],[560,20,120,90],[-200,200,180,300],[1020,300,180,300],[-250,560,220,180],[1000,560,260,200]].forEach(r=>{const pts=[[r[0],r[1]],[r[0]+r[2],r[1]],[r[0]+r[2],r[1]+r[3]],[r[0],r[1]+r[3]]];s+=`<path d="${pathP(pts,true)}" fill="#bfc28c" stroke="#9c9468" stroke-width="1"/><path d="${pathP(pts,true)}" fill="url(#rice)"/>`;
    for(let gx=r[0]+30;gx<r[0]+r[2];gx+=30)s+=`<path d="${pathP([[gx,r[1]],[gx,r[1]+r[3]]])}" stroke="#a49a6c" stroke-width=".9"/>`;for(let gy=r[1]+30;gy<r[1]+r[3];gy+=30)s+=`<path d="${pathP([[r[0],gy],[r[0]+r[2],gy]])}" stroke="#a49a6c" stroke-width=".9"/>`});
  const riv=(pts:number[][],w:number,close?:boolean)=>`<path d="${pathP(pts,close)}" stroke="#6f8a7c" stroke-width="${w+6}" fill="none" stroke-linecap="round"/><path d="${pathP(pts,close)}" stroke="#9fb4a8" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="${pathP(pts,close)}" stroke="url(#waves)" stroke-width="${w-4}" fill="none" stroke-linecap="round"/>`;
  s+=riv(W,40)+riv(N,26)+riv(E,36)+riv(S,44)+riv(ISL,42,true);
  s+=`<path d="${pathP(ISL,true)}" fill="#e0d3ad"/>`;
  for(let i=0;i<500;i++){const x=170+rnd()*680,y=170+rnd()*480;if(!inIsl(x,y))continue;const q=pj(x,y);s+=`<ellipse cx="${f1(q[0])}" cy="${f1(q[1])}" rx="${f1((4+rnd()*10)*q[2])}" ry="${f1((1.5+rnd()*2.2)*q[2])}" fill="${pick(['#d3c59c','#e9dfc1','#cfc392','#c5bd8c'])}" opacity="${f1(.3+rnd()*.35)}"/>`}
  const wall=scaleAround(ISL,510,410,.952);
  s+=`<path d="${pathP(wall,true)}" fill="none" stroke="#6f3424" stroke-width="9"/><path d="${pathP(wall,true)}" fill="none" stroke="#b06a4c" stroke-width="6"/><path d="${pathP(wall,true)}" fill="none" stroke="#e7d4b0" stroke-width="2" stroke-dasharray="3 4"/>`;
  s+=riv([[600,168],[600,655]],8)+riv([[228,580],[838,580]],8)+riv([[380,260],[600,260]],8);
  const roads=[[[440,98],[440,655]],[[178,340],[852,340]],[[205,510],[842,510]],[[560,340],[560,510]],[[255,98],[440,98]],[[440,225],[482,225]],[[770,470],[770,510]]];
  s+=`<g fill="none" stroke-linecap="round"><g stroke="#9d8058" stroke-width="10">${roads.map(r=>`<path d="${pathP(r)}"/>`).join('')}</g><g stroke="#ebe0c2" stroke-width="6.5">${roads.map(r=>`<path d="${pathP(r)}"/>`).join('')}</g><g stroke="#c4ae86" stroke-width="1" stroke-dasharray="4 5">${roads.map(r=>`<path d="${pathP(r)}"/>`).join('')}</g></g>`;
  // static billboards
  const B=[];
  for(let i=0;i<18;i++){const p=wall[Math.floor(i*wall.length/18)];B.push({x:p[0],y:p[1],h:fort()})}
  B.push({x:300,y:296,k:.62,h:`<rect x="-74" y="-24" width="148" height="24" fill="#ebe1c8" stroke="${OL}"/>${Array.from({length:18},(_,i)=>`<path d="M${-73+i*8.1} -24 v-4 l2.5 -3.5 l2.5 3.5 v4" fill="#ebe1c8" stroke="${OL}" stroke-width=".6"/>`).join('')}<path d="M-8 0 V-13 Q0 -22 8 -13 V0Z" fill="#3e2416" stroke="#c09246"/><g transform="translate(-44 -24)">${roofE(40,40,2,6)}</g><g transform="translate(44 -24)">${roofE(40,40,2,6)}</g><g transform="translate(0 -24)">${roofE(60,62,3,10)}</g><path d="M0 -${24+62*.42*2+62*.55} v-26" stroke="#c09246" stroke-width="3"/>`});
  [[300,420,1.05],[272,428,.72],[328,428,.72]].forEach(([x,y,k])=>B.push({x,y,h:prang(),k}));
  B.push({x:330,y:62,h:chedi(),k:1.15});
  B.push({x:520,y:338,h:[0,1,2,3].map(i=>`<g transform="translate(${-21+i*14} 0)"><rect x="-5" y="-9" width="10" height="9" fill="#c4a06c" stroke="${OL}" stroke-width=".6"/><path d="M-7 -9 L0 -16 L7 -9Z" fill="#a04a33"/><path d="M-7 -9 L0 -16 L7 -9Z" fill="url(#tileP)"/></g>`).join('')});
  B.push({x:440,y:660,h:`<rect x="-12" y="-26" width="24" height="26" fill="#c08560" stroke="${OL}"/><path d="M-5 0 V-13 Q0 -19 5 -13 V0Z" fill="#3e2416"/><g transform="translate(0 -26)">${roofE(26,24,2)}</g>`});
  B.push({x:792,y:668,h:junk()},{x:752,y:676,h:junk(),k:.8},{x:830,y:660,h:junk(),k:.7});
  const avoid=[[300,250,95],[300,415,45],[520,335,30],[440,655,30],...Object.values(SITES).map(t=>[t.pos[0],t.pos[1],50])];
  const nearLine=(x:number,y:number)=>Math.abs(x-440)<11||Math.abs(y-340)<11||Math.abs(y-510)<11||Math.abs(x-600)<11||Math.abs(y-580)<10||(Math.abs(y-260)<10&&x>380&&x<600)||(Math.abs(x-560)<11&&y>340&&y<510);
  let tries=0,cnt=0;while(cnt<110&&tries<3000){tries++;const x=180+rnd()*660,y=180+rnd()*460;const sc=scaleAround([[x,y]],510,410,1/.92)[0];
    if(!inIsl(sc[0],sc[1])||nearLine(x,y)||avoid.some(a=>Math.hypot(a[0]-x,a[1]-y)<a[2]))continue;const r=rnd();B.push({x,y,h:r>.38?house():r>.12?tree():palm(),k:.9+rnd()*.3});cnt++}
  [[90,250,50],[930,300,50],[880,560,30],[150,700,50],[700,725,30],[620,80,40],[160,40,40],[380,130,25],[960,700,30],[60,500,40],[-40,380,60],[1040,460,60],[520,730,40]].forEach(c=>{for(let i=0;i<7;i++)B.push({x:c[0]+(rnd()-.5)*c[2]*2,y:c[1]+(rnd()-.5)*c[2],h:rnd()>.25?tree():palm(),k:1+rnd()*.5})});
  for(let i=0;i<26;i++){const p=ISL[Math.floor(rnd()*ISL.length)];const o=scaleAround([p],510,410,1.09)[0];B.push({x:o[0],y:o[1],h:rnd()>.4?palm():tree(),k:.9})}
  B.sort((a,b)=>a.y-b.y);s+=B.map(it=>bb(it.x,it.y,it.h,it.k||1)).join('');
  return {inner:s,post:agePost(1000,700,10)}}
  // live skeleton
  const liveTop=`<g id="flows"><path class="flow" d="${pathP(ISL,true)}"/><path class="flow" d="${pathP(W)}"/><path class="flow" d="${pathP(S)}"/></g><g id="ground"></g><g id="routes"></g><g id="boats"></g><g id="labels"></g><g id="bbs"></g><g id="tokens"></g>`;
  map.innerHTML=`<rect width="1000" height="700" fill="#e1d4b3"/><g id="art"></g>`+liveTop;
  const P=STR.map.places,W_=STR.map.waters;const L:[number,number,string,number][]=[[300,300,P.palace,22],[300,432,P.wat,18],[330,66,P.phuKhao,14],[520,342,P.market,22],[440,666,P.gate,14],[792,674,P.wharf,16]];
  (document.getElementById('labels') as HTMLElement).innerHTML=L.map(([x,y,t,o])=>{const q=pj(x,y);return `<text x="${f1(q[0])}" y="${f1(q[1]+o*q[2])}" text-anchor="middle" style="font-size:${f1(13*q[2]+2)}px;fill:#3a2819;paint-order:stroke;stroke:rgba(236,226,200,.85);stroke-width:3px">${t}</text>`}).join('')+
   ([[95,210,W_.chaoPhraya],[905,210,W_.pasak],[620,700,W_.river],[606,470,W_.khaoPluek],[300,592,W_.naiKai],[530,252,W_.tho]] as [number,number,string][]).map(([x,y,t])=>{const q=pj(x,y);return `<text x="${f1(q[0])}" y="${f1(q[1])}" text-anchor="middle" style="font-size:${f1(12*q[2]+1)}px;fill:#2f504a;font-style:italic;paint-order:stroke;stroke:rgba(225,215,185,.8);stroke-width:2.5px">${t}</text>`}).join('')+
   `<g transform="translate(28 30)"><rect width="250" height="40" fill="#9a4630" stroke="#5f2c1e" stroke-width="2"/><rect x="4" y="4" width="242" height="32" fill="none" stroke="#efe0bd" stroke-dasharray="3 3"/><text x="125" y="27" text-anchor="middle" style="font-family:var(--f-display);font-weight:700;font-size:20px;fill:#f1e3c4">${STR.map.title}</text></g>`;
  const bg=document.getElementById('boats') as HTMLElement;[0,.34,.7].forEach((o,i)=>{const e=document.createElementNS(NS,'g');e.innerHTML=boatG;bg.appendChild(e);boatsAmb.push({e,o,v:.005+i*.002})});
  bakeArt('map',1000,700,2.4,Object.values(SITES).map(t=>t.pos),art,(url:string|null,inner:string)=>{const a=document.getElementById('art') as HTMLElement;a.innerHTML=url?`<image class="paintfade" href="${url}" width="1000" height="700" preserveAspectRatio="none"/>`:inner;(document.getElementById('loading') as HTMLElement).hidden=true});
}
