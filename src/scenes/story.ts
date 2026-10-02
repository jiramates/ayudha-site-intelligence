import { portrait } from '../render/primitives/figures'
import { PEOPLE, STORY, E, P } from '../data/content'

/** Chapter 1: the two speakers' lines under the painting; the one speaking is lit in turn. */
export function drawStory(){
  (document.getElementById('lines') as HTMLElement).innerHTML=STORY.map(({speaker:k,text:t},i)=>`<div class="leaf line" data-k="${k}" data-i="${i}"><div class="pt">${portrait(k)}</div><div><div class="who">${E(PEOPLE[k].name)} <small>· ${E(PEOPLE[k].role)}</small></div><p>${P(t)}</p></div></div>`).join('');
  document.querySelectorAll<HTMLElement>('.line').forEach(l=>l.addEventListener('click',()=>{curSpk=+(l.dataset.i??0);setSpeaker(curSpk)}));
}
export let curSpk=0;
export function setSpeaker(i:number){document.querySelectorAll<HTMLElement>('.line').forEach(l=>l.classList.toggle('on',+(l.dataset.i??0)===i))}

export const nextSpeaker=()=>{curSpk=(curSpk+1)%STORY.length;setSpeaker(curSpk)}
