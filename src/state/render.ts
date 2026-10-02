import { RM } from '../render/util'
import { st, setRenderer, render } from './store'
import { SITES, ZONES } from '../data/content'
import { bahtTxt, travel } from '../data/units'
import { drawDynamic, zoomTo, siteBox } from '../scenes/map-live'
import { renderPanel } from '../ui/leaves'
import { renderCap } from '../ui/caption'
import { renderCompare } from '../scenes/summary'
import { speak } from '../ui/narrator'
import { HINT } from '../data/strings.th'

export function installRenderer(){
const hint=document.getElementById('hint')!,zoomBtn=document.getElementById('zoomOut') as HTMLButtonElement;
zoomBtn.onclick=()=>{st.site=null;render('out')};
setRenderer(function(ev?:string){
  if(st.mode!=='site'&&!st.site)st.site='A';
  document.querySelectorAll<HTMLElement>('.tab').forEach(t=>t.setAttribute('aria-selected',String(t.dataset.mode===st.mode)));
  drawDynamic();renderPanel();renderCap();renderCompare();
  const zoomed=st.mode==='site'&&st.site;zoomBtn.hidden=!zoomed;
  if(ev)zoomTo(zoomed?siteBox(st.site):[0,0,1000,700],ev==='zone'||ev==='zoneclose'?0:1000);
  hint.textContent=st.mode==='site'?(st.site?HINT.siteOn:HINT.siteNone):HINT[st.mode];
  if(!ev||ev==='zoneclose')return;const s=st.site&&SITES[st.site];
  if(st.mode==='site')speak('khun',s?s.say:'ท่านจงกดธงชาดทำเลใดก็ได้ หุ่นโรงหมอจักผุดขึ้น');
  else if(st.mode==='reg')speak('khun',ev==='zone'&&st.zone?`ตรา${ZONES[st.zone].t} ข้าคลี่ใบลานให้อ่านข้างล่างแล้ว`:`ทำเล${s.name} ${s.astro.good?'หันหน้าต้องตำรา':'หันหน้าผิดตำรา'} ข้าจดข้อห้ามไว้ข้างล่าง`);
  else speak('phon',`ม้าเร็วจากทำเลนี้ถึงประตูวังราว ${bahtTxt(travel(st.site,'horse').baht)} ขอรับ`)});
document.querySelectorAll<HTMLElement>('.tab').forEach(t=>t.addEventListener('click',()=>{st.mode=t.dataset.mode as any;st.zone=null;if(st.mode==='site')st.site=null;render('tab')}));
}
