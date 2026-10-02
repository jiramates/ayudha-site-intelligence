import { ROUTES, MODES } from './content'

const UNIT=6

export const TH='๐๑๒๓๔๕๖๗๘๙'
export const th=v=>String(v).replace(/\d/g,d=>TH[d]);
export const fmt=n=>th(Math.round(n).toLocaleString('en-US'));
export function waTxt(m){const v=m/2;if(Number.isInteger(v))return th(v)+' วา';const fl=Math.floor(v);if(Math.abs(v-fl-.5)<.01)return fl?th(fl)+' วาครึ่ง':'ครึ่งวา';return th(v.toFixed(1))+' วา'}
export function areaTxt(m2){let tw=Math.round(m2/4);const r=Math.floor(tw/400);tw-=r*400;const g=Math.floor(tw/100);const w=tw-g*100;
  if(r>=20)return 'ราว '+th(Math.round(m2/1600))+' ไร่';
  return [r?th(r)+' ไร่':'',g?th(g)+' งาน':'',w?th(w)+' ตารางวา':''].filter(Boolean).join(' ')||'๐'}
export const bahtTxt=b=>th(b<1?b.toFixed(1):b.toFixed(1).replace(/\.0$/,''))+' บาท';
export const plen=p=>{let L=0;for(let i=1;i<p.length;i++)L+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);return L};
export function travel(k,mode){const sen=plen(ROUTES[k][mode])*UNIT/40;const baht=sen/MODES[mode].spd;return{sen,baht,min:baht*6}}
