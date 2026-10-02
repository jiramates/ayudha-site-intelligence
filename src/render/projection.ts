import { f1 } from './util'

export function pj(x:number,y:number):[number,number,number]{const u=y/760;const s=.74+.26*u;return[500+(x-500)*s,175+501.6*(.85*u+.15*u*u),s]}
export function sampleEl(id:string,n:number){const p=document.getElementById(id) as unknown as SVGGeometryElement;const L=p.getTotalLength();const a:[number,number][]=[];for(let i=0;i<=n;i++){const q=p.getPointAtLength(L*i/n);a.push([q.x,q.y])}return a}
export const pathP=(pts:number[][],close?:boolean)=>'M'+pts.map(p=>{const q=pj(p[0],p[1]);return f1(q[0])+' '+f1(q[1])}).join(' L')+(close?'Z':'');
export const scaleAround=(pts:number[][],cx:number,cy:number,k:number)=>pts.map(p=>[cx+(p[0]-cx)*k,cy+(p[1]-cy)*k]);
export const circleP=(cx:number,cy:number,rx:number,ry:number,n=64)=>Array.from({length:n+1},(_,i)=>[cx+rx*Math.cos(i/n*2*Math.PI),cy+ry*Math.sin(i/n*2*Math.PI)]);
export const bb=(x:number,y:number,inner:string,k=1,extra='')=>{const q=pj(x,y);return `<g transform="translate(${f1(q[0])} ${f1(q[1])}) scale(${(q[2]*k).toFixed(3)})" ${extra}>${inner}</g>`};
