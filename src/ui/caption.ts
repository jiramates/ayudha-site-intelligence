import { st, curSite } from '../state/store'
import { numWord, fmt, waTxt, areaTxt, beds } from '../data/units'
import { S } from '../data/strings.th'

export function renderCap(){const cap=document.getElementById('cap') as HTMLElement;if(st.mode!=='site'||!st.site){cap.hidden=true;return}
  const s=curSite(),r=s.rules;cap.hidden=false;cap.classList.remove('show');void cap.offsetWidth;cap.classList.add('show');
  cap.innerHTML=`<h3>${S.cap.title(numWord(s.n),s.name)}</h3><p>${s.form}</p><p class="dim">${S.cap.facts(areaTxt(s.land_m2),waTxt(r.maxHeight_m),areaTxt(r.gfa_m2),fmt(beds(s)))}</p>`}
