import { st, setRenderer, render, curSite } from './store'
import { SITES, ZONES, PT } from '../data/content'
import { bahtTxt, travel } from '../data/units'
import { drawDynamic, zoomTo, siteBox } from '../scenes/map-live'
import { renderPanel } from '../ui/leaves'
import { renderCap } from '../ui/caption'
import { renderCompare } from '../scenes/summary'
import { speak } from '../ui/narrator'
import { S } from '../data/strings.th'
import type { Mode } from './store'
import { parseHash, formatHash } from './url'

/** true while the view is being set from the address bar, so it is not pushed back as a new history entry */
let fromUrl=false;
function syncUrl(){
  const h=formatHash({mode:st.mode,site:st.site});
  if(h!==location.hash)history.pushState(null,'',h||location.pathname+location.search);
}
/** Restore the view from the address bar (deep link, back/forward). */
function applyUrl(initial:boolean){
  const v=parseHash(location.hash,Object.keys(SITES))??{mode:'site' as Mode,site:null};
  if(initial?v.site===null:(v.mode===st.mode&&v.site===st.site))return;
  fromUrl=true;
  try{st.mode=v.mode;st.site=v.site;st.zone=null;render(initial?'restore':v.mode!=='site'?'tab':v.site?'site':'out')}
  finally{fromUrl=false}
}
export function startUrlSync(){
  addEventListener('popstate',()=>applyUrl(false));
  addEventListener('hashchange',()=>applyUrl(false));
  applyUrl(true);
}

export function installRenderer(){
const hint=document.getElementById('hint') as HTMLElement,zoomBtn=document.getElementById('zoomOut') as HTMLButtonElement;
zoomBtn.onclick=()=>{st.site=null;render('out')};
setRenderer((ev?:string)=>{
  if(st.mode!=='site'&&!st.site)st.site=Object.keys(SITES)[0];
  document.querySelectorAll<HTMLElement>('.tab').forEach(t=>t.setAttribute('aria-selected',String(t.dataset.mode===st.mode)));
  drawDynamic();renderPanel();renderCap();renderCompare();
  const zoomed=st.mode==='site'&&!!st.site;zoomBtn.hidden=!zoomed;
  if(ev)zoomTo(zoomed?siteBox(st.site as string):[0,0,1000,700],ev==='zone'||ev==='zoneclose'||ev==='restore'?0:1000);
  if(ev&&!fromUrl&&ev!=='restore')syncUrl();
  hint.textContent=st.mode==='site'?(st.site?S.map.hint.siteOn:S.map.hint.siteNone):S.map.hint[st.mode];
  if(!ev||ev==='zoneclose')return;
  if(st.mode==='site')speak('khun',st.site?PT(curSite().say,curSite()):S.narrator.siteNone);
  else if(st.mode==='reg')speak('khun',ev==='zone'&&st.zone?S.narrator.zone(ZONES[st.zone].title):S.narrator.reg(curSite().name,curSite().astro.good));
  else speak('phon',S.narrator.courier(bahtTxt(travel(curSite().id,'horse').baht)))});
document.querySelectorAll<HTMLElement>('.tab').forEach(t=>t.addEventListener('click',()=>{st.mode=t.dataset.mode as Mode;st.zone=null;if(st.mode==='site')st.site=null;render('tab')}));
}
