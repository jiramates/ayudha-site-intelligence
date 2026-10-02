import { st, curSite } from '../state/store'
import { E, P } from '../data/content'
import { formatHash } from '../state/url'
import { numWord, fmt, waTxt, areaTxt, beds } from '../data/units'
import { S } from '../data/strings.th'

export function renderCap(){const cap=document.getElementById('cap') as HTMLElement;if(st.mode!=='site'||!st.site){cap.hidden=true;return}
  const s=curSite(),r=s.rules;cap.hidden=false;cap.classList.remove('show');void cap.offsetWidth;cap.classList.add('show');
  cap.innerHTML=`<h3>${S.cap.title(numWord(s.n),E(s.name))}</h3><p>${P(s.form,s)}</p><p class="dim">${S.cap.facts(areaTxt(s.land_m2),waTxt(r.maxHeight_m),areaTxt(r.gfa_m2),fmt(beds(s)))}</p>
    <p class="cap-actions"><button type="button" class="linkbtn" data-copy>${S.cap.copy}</button><span class="copied" role="status" aria-live="polite"></span></p>
    <input class="linkfld" readonly hidden aria-label="${S.cap.linkLabel}" value="${E(siteLink(s.id))}">`;
  bindCopy(cap)}

/** Absolute link to this site's view, built from the page the visitor is on (works on any host and on file://). */
const siteLink=(id:string)=>location.href.split('#')[0]+formatHash({mode:'site',site:id});

function bindCopy(cap:HTMLElement){
  const btn=cap.querySelector<HTMLButtonElement>('[data-copy]'),msg=cap.querySelector<HTMLElement>('.copied'),fld=cap.querySelector<HTMLInputElement>('.linkfld');
  if(!btn||!msg||!fld)return;
  btn.onclick=async()=>{
    try{await navigator.clipboard.writeText(fld.value);fld.hidden=true;msg.textContent=S.cap.copied;setTimeout(()=>{msg.textContent=''},2500)}
    catch{msg.textContent=S.cap.copyFail;fld.hidden=false;fld.focus();fld.select()}
  }}
