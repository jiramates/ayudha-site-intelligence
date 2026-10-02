import { st } from '../state/store'
import { SITES, NUMW, LAND } from '../data/content'
import { fmt, waTxt, areaTxt } from '../data/units'

export function renderCap(){const cap=document.getElementById('cap');if(st.mode!=='site'||!st.site){cap.hidden=true;return}
  const s=SITES[st.site],r=s.reg;cap.hidden=false;cap.classList.remove('show');void cap.offsetWidth;cap.classList.add('show');
  cap.innerHTML=`<h3>ทำเล${NUMW[s.n]} · ${s.name}</h3><p>${s.form}</p><p class="dim">เนื้อที่ ${areaTxt(LAND[st.site])} · สูงได้ ${waTxt(r.top)} · พื้นอาคาร${areaTxt(r.gfa)} · ราว ${fmt(r.gfa/130)} เตียง</p>`}
