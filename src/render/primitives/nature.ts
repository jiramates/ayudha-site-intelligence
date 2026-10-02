import { rnd, pick } from '../rng'
import { f1 } from '../util'

export function tree(scale=1){const g=pick([['#4e6a48','#88a275'],['#5b7650','#9cb183'],['#45603f','#7f9a6c'],['#5f6f45','#a3ad78']]);let s=`<path d="M-2.6 0 Q-4.5 -10 -1.6 -20 L-6 -27 M1.6 -20 L6 -28 M-1.6 -20 L1.6 -20 Q4.2 -10 2.6 0Z" fill="#5e3f26" stroke="#5e3f26" stroke-width="1.6"/>`;
  const pads=[[0,-30,11],[-10,-23,8.5],[10,-24,8.5],[-6,-38,8],[6,-37,8],[0,-21,7]];
  pads.forEach(([x,y,r])=>{s+=`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f1(r*.82)}" fill="${g[0]}" stroke="#2f422c" stroke-width=".7"/>`;
    for(let i=0;i<6;i++){const a=rnd()*6.28,d=rnd()*r*.7;s+=`<ellipse cx="${f1(x+Math.cos(a)*d)}" cy="${f1(y+Math.sin(a)*d*.8)}" rx="2.1" ry="1" transform="rotate(${Math.round(rnd()*180)} ${f1(x+Math.cos(a)*d)} ${f1(y+Math.sin(a)*d*.8)})" fill="${g[1]}" opacity=".8"/>`}});
  return `<g transform="scale(${scale})">${s}</g>`}
export function palm(){let s=`<path d="M0 0 Q-3 -24 3 -48" fill="none" stroke="#6b4a2c" stroke-width="3"/>`;for(let i=0;i<7;i++)s+=`<path d="M${f1(-1.2+i*.4)} ${-6-i*6} h3" stroke="#3e2a18" stroke-width=".6"/>`;
  const fr=[[-22,-40],[-18,-56],[-6,-62],[8,-62],[20,-56],[24,-42],[0,-38]];fr.forEach(([x,y])=>{s+=`<path d="M3 -48 Q${f1((3+x)/2)} ${f1(y-6)} ${x} ${y}" fill="none" stroke="#4e6a48" stroke-width="2.6" stroke-linecap="round"/><path d="M3 -48 Q${f1((3+x)/2)} ${f1(y-6)} ${x} ${y}" fill="none" stroke="#9ab27f" stroke-width=".7" stroke-dasharray="1.5 1.5"/>`});
  s+=`<circle cx="2" cy="-46" r="2.4" fill="#7a5a2c"/><circle cx="5" cy="-45" r="2.2" fill="#7a5a2c"/>`;return s}
export function rocks(x,yb,w,h,g='rockG'){let s='';const n=4;for(let i=0;i<n;i++){const ww=w*(1-i*.2),hh=h*(1-i*.15)/n*1.8,y=yb-i*h/n*.9,xx=x+(i%2?w*.07:-w*.06);
  s+=`<path d="M${f1(xx-ww/2)} ${f1(y)} Q${f1(xx-ww/2)} ${f1(y-hh)} ${f1(xx-ww*.15)} ${f1(y-hh*1.05)} Q${f1(xx+ww*.1)} ${f1(y-hh*1.3)} ${f1(xx+ww*.35)} ${f1(y-hh*.9)} Q${f1(xx+ww/2)} ${f1(y-hh*.6)} ${f1(xx+ww/2)} ${f1(y)}Z" fill="url(#${g})" stroke="#4f6355" stroke-width="1.1"/>`;
  s+=`<path d="M${f1(xx-ww*.42)} ${f1(y-hh*.55)} Q${f1(xx-ww*.3)} ${f1(y-hh*1.02)} ${f1(xx-ww*.1)} ${f1(y-hh*1.05)}" stroke="#eef0e2" stroke-width="2" fill="none" opacity=".75"/><path d="M${f1(xx+ww*.05)} ${f1(y-hh*.2)} q${f1(ww*.06)} ${f1(-hh*.4)} ${f1(ww*.2)} ${f1(-hh*.55)} M${f1(xx-ww*.2)} ${f1(y-hh*.15)} q${f1(ww*.04)} ${f1(-hh*.3)} ${f1(ww*.12)} ${f1(-hh*.4)}" stroke="#4f6355" stroke-width=".9" fill="none" opacity=".8"/>`;
  for(let j=0;j<3;j++){const sx=xx-ww*.3+rnd()*ww*.6,sy=y-hh*(.8+rnd()*.25);s+=`<circle cx="${f1(sx)}" cy="${f1(sy)}" r="${f1(1.6+rnd()*2.4)}" fill="#5b7650" opacity=".8"/>`}}
  return s}
export function cloud(x,y,w){let s='';const n=6;for(let i=0;i<n;i++){const cx=x+i*w/n,cy=y-(i%2)*w*.05-Math.sin(i/n*3.14)*w*.06,r=w*.11+(i%3)*w*.015;s+=`<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" fill="#ece3cc" stroke="#b9a882" stroke-width="1"/>`}
  for(let i=1;i<n-1;i++){const cx=x+i*w/n,cy=y-(i%2)*w*.05;s+=`<path d="M${f1(cx-w*.04)} ${f1(cy)} a${f1(w*.04)} ${f1(w*.04)} 0 1 1 ${f1(w*.05)} ${f1(w*.02)}" stroke="#b9a882" fill="none" stroke-width=".9"/>`}
  s+=`<path d="M${f1(x-w*.05)} ${f1(y+w*.1)} H${f1(x+w*.95)}" stroke="#ece3cc" stroke-width="${f1(w*.07)}"/>`;return `<g opacity=".85">${s}</g>`}
export const bird=(x,y)=>`<path d="M${x} ${y} q5 -5 10 0 q5 -5 10 0" fill="none" stroke="#4e3a26" stroke-width="1.3"/>`;
export function dabs(n:number,x0:number,y0:number,w:number,h:number,cols:string[],sz=1,test?:(x:number,y:number)=>boolean){let s='';for(let i=0;i<n;i++){const x=x0+rnd()*w,y=y0+rnd()*h;if(test&&!test(x,y))continue;s+=`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1((4+rnd()*10)*sz)}" ry="${f1((1.5+rnd()*2.5)*sz)}" fill="${pick(cols)}" opacity="${f1(.25+rnd()*.35)}"/>`}return s}
export function tufts(n:number,x0:number,y0:number,w:number,h:number,test?:(x:number,y:number)=>boolean){let s='';for(let i=0;i<n;i++){const x=x0+rnd()*w,y=y0+rnd()*h;if(test&&!test(x,y))continue;s+=`<path d="M${f1(x-3)} ${f1(y)} l2 -5 M${f1(x)} ${f1(y)} l.4 -6 M${f1(x+3)} ${f1(y)} l-1.5 -5" stroke="#6a7f4e" stroke-width=".8" opacity=".6"/>`}return s}
