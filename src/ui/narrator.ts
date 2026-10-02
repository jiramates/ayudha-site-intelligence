import { RM } from '../render/util'
import { PEOPLE } from '../data/content'
import { portrait } from '../render/primitives/figures'

export const sayEl=document.getElementById('say'),nWho=document.getElementById('nWho'),nPt=document.getElementById('nPt');let sayTimer=null;
export function speak(k,text){clearTimeout(sayTimer);const p=PEOPLE[k];nWho.innerHTML=`${p.name} <small>· ${p.role}</small>`;nPt.innerHTML=portrait(k);
  if(RM){sayEl.textContent=text;return}const ch=Array.from(text);let i=0;sayEl.textContent='';const step=()=>{i=Math.min(ch.length,i+2);sayEl.textContent=ch.slice(0,i).join('');if(i<ch.length)sayTimer=setTimeout(step,24)};step()}
