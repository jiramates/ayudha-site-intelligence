import { RM, f1 } from '../render/util'
import { st, render } from '../state/store'
import { drawDynamic } from '../scenes/map-live'
import { SITES, ZONES, MODES, DEST, DIRS, CRIT, NUMW, LAND, total } from '../data/content'
import { th, fmt, waTxt, areaTxt, bahtTxt, travel } from '../data/units'

export const panel=document.getElementById('panel');
export const scoreBars=s=>`<div class="bars">${Object.entries(CRIT).map(([k,l])=>`<div class="bar"><span>${l}</span><span class="t"><i style="width:${s.score[k]*20}%"></i></span><b>${th(s.score[k])}/๕</b></div>`).join('')}</div>`;
export function panelSite(){
  if(!st.site)return `<div class="leaf wide"><h3>เลือกทำเลที่จะพินิจ</h3><p class="dim">กดธงชาดบนแผนที่ หรือเลือกจากบัญชีนี้</p><div class="sitepick">${Object.entries(SITES).map(([k,s])=>`<button data-pick="${k}"><span class="s">${th(s.n)}</span><span><b>${s.name}</b> — ${s.desc}</span></button>`).join('')}</div></div>`;
  const s=SITES[st.site],r=s.reg;
  return `<div class="leaf"><h3>ทำเล${NUMW[s.n]} · ${s.name}</h3><p class="dim">${s.desc}</p>
   <div class="stats"><div class="stat"><div class="v">${areaTxt(LAND[st.site])}</div><div class="l">เนื้อที่ดิน</div></div><div class="stat"><div class="v">${areaTxt(r.gfa)}</div><div class="l">พื้นอาคารได้จริง</div></div><div class="stat"><div class="v">ราว ${fmt(r.gfa/130)}</div><div class="l">เตียงคนไข้</div></div></div></div>
  <div class="leaf"><h3>ส่วนดี ส่วนเสีย</h3><ul class="pl">${s.pros.map(p=>`<li class="p"><span></span><span>${p}</span></li>`).join('')}${s.cons.map(p=>`<li class="c"><span></span><span>${p}</span></li>`).join('')}</ul></div>
  <div class="leaf wide"><h3>คำวินิจฉัยของขุนวิเศษ</h3><p>“${s.verdict}”</p><h4>คะแนนทำเล ${th(total(s))} ใน ๒๐</h4>${scoreBars(s)}</div>`}
export function parcelSVG(s){const r=s.reg,[w,d]=r.dims,W=320,H=230,M=46;const k=Math.min((W-2*M)/w,(H-2*M-6)/d);const pw=w*k,ph=d*k,px=(W-pw)/2,py=(H-ph)/2+2;
  const set={top:2,bottom:2,left:2,right:2};set[r.roadSide]=r.roadSet;if(r.water)set[r.water.side]=r.water.set;
  const band=(side,t,fill,label,lf)=>{let x,y,ww,hh,tx,ty,rot=0;
    if(side==='bottom'){x=px-14;y=py+ph;ww=pw+28;hh=t;tx=px+pw/2;ty=y+t/2}if(side==='top'){x=px-14;y=py-t;ww=pw+28;hh=t;tx=px+pw/2;ty=y+t/2}
    if(side==='left'){x=px-t;y=py-14;ww=t;hh=ph+28;tx=x+t/2;ty=py+ph/2;rot=-90}if(side==='right'){x=px+pw;y=py-14;ww=t;hh=ph+28;tx=x+t/2;ty=py+ph/2;rot=90}
    return `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(ww)}" height="${f1(hh)}" fill="${fill}" opacity=".85"/><text x="${f1(tx)}" y="${f1(ty)}" text-anchor="middle" dominant-baseline="middle" transform="rotate(${rot} ${f1(tx)} ${f1(ty)})" style="font-size:11px;fill:${lf}">${label}</text>`};
  const bx=px+set.left*k,by=py+set.top*k,bw=pw-(set.left+set.right)*k,bh=ph-(set.top+set.bottom)*k;const area=(w-set.left-set.right)*(d-set.top-set.bottom);
  const lab=(side,v)=>{const m={top:[px+pw/2,py+set.top*k/2+4],bottom:[px+pw/2,py+ph-set.bottom*k/2+4],left:[px+set.left*k/2,py+ph/2+4],right:[px+pw-set.right*k/2-2,py+ph/2-12]}[side];return v>2?`<text x="${f1(m[0])}" y="${f1(m[1])}" text-anchor="middle" style="font-size:10.5px;fill:#743524;font-weight:600">${waTxt(v)}</text>`:''};
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="ผังแปลงที่ดินแลระยะร่น">${band(r.roadSide,22,'#c4aa7c',`ทางกว้าง ${waTxt(r.road)}`,'#3a2819')}${r.water?band(r.water.side,18,'#9fb4a8',r.water.name,'#21403b'):''}
   <rect x="${f1(px)}" y="${f1(py)}" width="${f1(pw)}" height="${f1(ph)}" fill="url(#hatchR)" stroke="#3a2819" stroke-width="1.4"/><rect x="${f1(bx)}" y="${f1(by)}" width="${f1(bw)}" height="${f1(bh)}" fill="#e3cf9c" stroke="#a1412a" stroke-width="1.6" stroke-dasharray="5 3"/>
   <text x="${f1(bx+bw/2)}" y="${f1(by+bh/2-3)}" text-anchor="middle" style="font-size:13px;fill:#3a2819">แนวสร้างได้</text><text x="${f1(bx+bw/2)}" y="${f1(by+bh/2+13)}" text-anchor="middle" style="font-size:11.5px;fill:#56401f">${areaTxt(area)}</text>
   ${['top','bottom','left','right'].map(sd=>lab(sd,set[sd])).join('')}<text x="${f1(px+pw)}" y="${f1(py-6-((r.roadSide==='top'||(r.water&&r.water.side==='top'))?20:0))}" text-anchor="end" style="font-size:11px;fill:#56401f">กว้าง ${th(w/2)} วา ลึก ${th(d/2)} วา</text></svg>`}
export function compassSVG(s){const C=110,R=82;let g='';
  DIRS.forEach(([n,a])=>{const r=(a-90)*Math.PI/180;const isF=n===s.astro.front;const good=['บูรพา','ทักษิณ'].includes(n),bad=n==='ประจิม';
    const fill=isF?(s.astro.good?'#4c7444':'#a1412a'):good?'rgba(76,116,68,.28)':bad?'rgba(161,65,42,.22)':'rgba(180,138,64,.25)';
    const p1=[C+Math.cos(r-.32)*30,C+Math.sin(r-.32)*30],tip=[C+Math.cos(r)*R*.78,C+Math.sin(r)*R*.78],p2=[C+Math.cos(r+.32)*30,C+Math.sin(r+.32)*30];
    g+=`<path d="M${f1(p1[0])} ${f1(p1[1])} Q${f1(C+Math.cos(r-.22)*R*.7)} ${f1(C+Math.sin(r-.22)*R*.7)} ${f1(tip[0])} ${f1(tip[1])} Q${f1(C+Math.cos(r+.22)*R*.7)} ${f1(C+Math.sin(r+.22)*R*.7)} ${f1(p2[0])} ${f1(p2[1])}Z" fill="${fill}" stroke="#5e3420" stroke-width="1"/>`;
    const lp=[C+Math.cos(r)*(R+16),C+Math.sin(r)*(R+16)];g+=`<text x="${f1(lp[0])}" y="${f1(lp[1]+4)}" text-anchor="middle" style="font-size:12.5px;font-weight:${isF?700:400};fill:${isF?(s.astro.good?'#4c7444':'#a1412a'):'#3a2819'}">${n}</text>`});
  g+=`<circle cx="${C}" cy="${C}" r="26" fill="#e3cf9c" stroke="#5e3420"/><text x="${C}" y="${C-2}" text-anchor="middle" style="font-size:11px;fill:#56401f">หน้าโรง</text><text x="${C}" y="${C+13}" text-anchor="middle" style="font-size:13px;font-weight:700;fill:#743524">${s.astro.front}</text>`;
  return `<svg viewBox="-10 -6 240 232" role="img" aria-label="ทักษาทิศ">${g}</svg>`}
export function panelReg(){const s=SITES[st.site],r=s.reg;const z=st.zone&&ZONES[st.zone];
  return `${z?`<div class="leaf wide zonecard"><button class="x" id="zx" aria-label="ปิด">×</button><h3>${z.t}</h3><p>${z.p}</p><div style="display:flex;gap:6px;flex-wrap:wrap">${z.tags.map(t=>`<span class="tag mod">${t}</span>`).join('')}</div></div>`:''}
   <div class="leaf"><h3>ข้อห้ามแห่งทำเล${NUMW[s.n]}</h3><p class="dim">กดตราประทับ สูง · น้ำ · ร่น · ทาง · ทิศ บนแผนที่เพื่ออ่านทีละข้อ</p>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin:4px 0 8px">${r.flags.map(f=>`<span class="tag ${f[0]}">${f[1]}</span>`).join('')}</div>
    <table class="tbl"><tr><th>เนื้อที่ดิน</th><td class="n">${areaTxt(LAND[st.site])}</td></tr><tr><th>ทางหน้าแปลงกว้าง</th><td class="n">${waTxt(r.road)}</td></tr><tr><th>ร่นจากเขตทาง</th><td class="n">${waTxt(r.roadSet)}</td></tr><tr><th>ร่นจากน้ำ</th><td class="n">${r.water?waTxt(r.water.set):'—'}</td></tr><tr><th>สูงได้มากที่สุด</th><td class="n">${waTxt(r.top)}</td></tr><tr><th>เพดานเขตพระราชฐาน</th><td class="n">${r.cap?waTxt(r.cap):'ไม่ติด'}</td></tr><tr><th>พื้นอาคารตามเกณฑ์</th><td class="n">${th(r.far)} เท่าของที่ดิน</td></tr><tr><th>พื้นอาคารได้จริง</th><td class="n" style="color:${r.gfa<r.gfaAllow?'var(--risk)':'inherit'}">${areaTxt(r.gfa)}</td></tr><tr><th>ยกพื้นหนีน้ำ</th><td class="n">${th(r.flood)} ศอก</td></tr></table></div>
   <div class="leaf"><h3>ผังแปลงแลระยะร่น</h3><div class="diag">${parcelSVG(s)}</div><p class="dim">ลายทแยงคือแนวร่นที่สร้างมิได้ เส้นประแดงคือแนวตั้งตัวโรง</p></div>
   <div class="leaf wide"><h3>ทักษาทิศตามตำราปลูกเรือน</h3><div class="astrogrid"><div class="diag">${compassSVG(s)}</div>
     <div><p><span class="tag ${s.astro.good?'ok':'risk'}">${s.astro.good?'ต้องตามตำรา':'ผิดตำรา ต้องแก้'}</span></p><p>${s.astro.txt}</p><p><b>ข้าแนะว่า</b> ${s.astro.fix}</p>
     <table class="tbl"><tr><th>หัวเตียงคนไข้</th><td>บูรพา หรือ ทักษิณ ห้ามประจิม</td></tr><tr><th>หอพระ ศาลพระภูมิ</th><td>อีสาน</td></tr><tr><th>โรงครัว เตาต้มยา</th><td>อาคเนย์</td></tr><tr><th>เรือนเก็บศพ</th><td>ประจิม</td></tr><tr><th>หอตำราหมอ</th><td>อุดร</td></tr></table>
     <p class="dim" style="margin-top:6px">ตำรานี้ตรงกับแดดลมด้วย ทิศประจิมรับแดดบ่ายร้อนจัด ควรเป็นเรือนบริการ มิใช่เรือนคนไข้</p></div></div></div>`}
export function panelTr(){const s=SITES[st.site];
  const rows=Object.keys(MODES).map(k=>{const m=MODES[k],t=travel(st.site,k);return `<tr><th><span style="display:inline-block;width:11px;height:11px;border-radius:2px;background:${m.color};margin-right:6px"></span>${m.name}</th><td>${DEST[k].name}<br><span class="tag mod">${m.eq}</span></td><td class="n">${th(Math.round(t.sen))} เส้น</td><td class="n"><b>${bahtTxt(t.baht)}</b><br><span class="dim">${th(Math.round(t.min))} นาที</span></td></tr>`}).join('');
  const note={A:'ช้างเสบียงต้องผ่านหน้าตลาด ควรเปิดประตูเสบียงด้านหลังติดคลอง',B:'ทางน้ำดีที่สุดในสี่ทำเล ท่าเรือติดประตูโรงหมอ',C:'ม้าเร็วต้องข้ามแม่น้ำ ทางเข้ากว้างเพียงสี่วา ช้างสวนกันมิได้',D:'ใกล้วังที่สุด แต่ช้างเสบียงต้องเลี่ยงเขตพระราชฐาน'}[st.site];
  return `<div class="leaf"><h3>ทางสัญจรจากทำเล${NUMW[s.n]}</h3><p class="dim">กดเปิดปิดพาหนะ บนแผนที่จะเห็นคน ม้า ช้าง เรือ เดินทางจริง</p>
    <div class="modes">${Object.entries(MODES).map(([k,m])=>`<button class="mode" data-m="${k}" aria-pressed="${st.tm[k]}"><span class="sw" style="background:${m.color}"></span><span><b>${m.name}</b><small>${m.mean}</small></span></button>`).join('')}</div>
    <h4>ข้อสังเกตของพลขับ</h4><p>“${note}”</p></div>
   <div class="leaf"><h3>เพลาเดินทาง</h3><div class="scroll"><table class="tbl" style="min-width:330px"><tr><th>พาหนะ</th><th>ปลายทาง</th><th class="n">ระยะ</th><th class="n">เพลา</th></tr>${rows}</table></div><p class="dim" style="margin-top:6px">ความเร็วสมมุติ เดินเท้า ๑๐ ม้าเร็ว ๓๐ ช้าง ๑๑ เรือ ๑๒ เส้นต่อบาท</p></div>`}
export function renderPanel(){panel.innerHTML=st.mode==='site'?panelSite():st.mode==='reg'?panelReg():panelTr();
  panel.querySelectorAll<HTMLElement>('[data-pick]').forEach(b=>b.addEventListener('click',()=>{st.site=b.dataset.pick;render('site');document.getElementById('mapbox').scrollIntoView({behavior:RM?'auto':'smooth',block:'center'})}));
  const zx=document.getElementById('zx');if(zx)zx.onclick=()=>{st.zone=null;render('zoneclose')};
  panel.querySelectorAll<HTMLElement>('.mode').forEach(b=>b.addEventListener('click',()=>{st.tm[b.dataset.m]=!st.tm[b.dataset.m];drawDynamic();renderPanel()}))}
