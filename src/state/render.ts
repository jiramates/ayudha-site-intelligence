import { st, setRenderer, render, curSite } from './store'
import { SITES, ZONES, PT } from '../data/content'
import { bahtTxt, travel } from '../data/units'
import { drawDynamic, zoomTo, siteBox } from '../scenes/map-live'
import { renderPanel } from '../ui/leaves'
import { renderCap } from '../ui/caption'
import { renderCompare } from '../scenes/summary'
import { speak } from '../ui/narrator'
import { sheetFor } from '../ui/sheet'
import { renderPeek } from '../ui/peek'
import { RM, jumpTo } from '../render/util'
import { S } from '../data/strings.th'
import type { Mode } from './store'
import { parseHash, formatHash } from './url'

/** true while the view is being set from the address bar, so it is not pushed back as a new history entry */
let fromUrl=false;
/** the lens of the current history entry: switching lens adds an entry, switching site only rewrites the address */
let lensInUrl:Mode=st.mode;
function syncUrl(){
  const h=formatHash({mode:st.mode,site:st.site});
  if(h===location.hash)return;
  const url=h||location.pathname+location.search;
  // an embedded or sandboxed page may not be allowed to change its address: the app then simply works without links
  try{if(st.mode!==lensInUrl)history.pushState(null,'',url);else history.replaceState(null,'',url)}catch{/* no address bar to update */}
  lensInUrl=st.mode;
}
/**
 * A deep link opens on the map. While the page is still settling (fonts, the browser's own toolbar, first resize)
 * keep the map section aligned to the top, unless the reader has started to scroll.
 */
function holdMapInView(){
  const sec=document.getElementById('mapsec') as HTMLElement;
  let live=true;
  const align=()=>{if(live)jumpTo(sec)};
  const stop=()=>{live=false};
  for(const e of ['wheel','touchstart','keydown','pointerdown'])addEventListener(e,stop,{once:true,passive:true});
  align();
  document.fonts?.ready.then(align);
  addEventListener('resize',align);
  // stay aligned until the page has been loaded for a few seconds (a slow device may take longer than that to load)
  const end=()=>setTimeout(()=>{live=false;removeEventListener('resize',align)},4000);
  if(document.readyState==='complete')end();else addEventListener('load',()=>{align();end()},{once:true});
}

/** Restore the view from the address bar (deep link, back/forward). */
function applyUrl(initial:boolean){
  const v=parseHash(location.hash,Object.keys(SITES))??{mode:'site' as Mode,site:null};
  if(initial?v.site===null:(v.mode===st.mode&&v.site===st.site))return;
  fromUrl=true;lensInUrl=v.mode;
  try{st.mode=v.mode;st.site=v.site;st.zone=null;render(initial?'restore':v.mode!=='site'?'tab':v.site?'site':'out')
    if(v.site){if(initial)holdMapInView();else{const m=document.getElementById('mapsec') as HTMLElement;if(RM)jumpTo(m);else m.scrollIntoView({behavior:'smooth',block:'start'})}}}
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
  drawDynamic();renderPanel();renderCap();renderCompare();renderPeek();
  const zoomed=st.mode==='site'&&!!st.site;zoomBtn.hidden=!zoomed;
  if(ev)zoomTo(zoomed?siteBox(st.site as string):[0,0,1000,700],ev==='zone'||ev==='zoneclose'||ev==='restore'?0:1000);
  if(ev&&!fromUrl&&ev!=='restore')syncUrl();
  if(ev)sheetFor(ev,!!st.site);
  hint.textContent=st.mode==='site'?(st.site?S.map.hint.siteOn:S.map.hint.siteNone):S.map.hint[st.mode];
  if(!ev||ev==='zoneclose')return;
  if(st.mode==='site')speak('khun',st.site?PT(curSite().say,curSite()):S.narrator.siteNone);
  else if(st.mode==='reg')speak('khun',ev==='zone'&&st.zone?S.narrator.zone(ZONES[st.zone].title):S.narrator.reg(curSite().name,curSite().astro.good));
  else speak('phon',S.narrator.courier(bahtTxt(travel(curSite().id,'horse').baht)))});
document.querySelectorAll<HTMLElement>('.tab').forEach(t=>t.addEventListener('click',()=>{st.mode=t.dataset.mode as Mode;st.zone=null;if(st.mode==='site')st.site=null;render('tab')}));
}
