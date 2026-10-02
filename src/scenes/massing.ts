import { OL } from '../render/util'
import { tree, palm } from '../render/primitives/nature'
import { hallE, roofE } from '../render/primitives/buildings'
import { boatG } from './map'
import { waTxt } from '../data/units'
import { S } from '../data/strings.th'
import type { Site } from '../data/schema'

type Massing=Site['massing']
export interface Part{h:string;drop?:number}

export const MASS:Record<Massing,(s:Site)=>Part[]>={
 'tower-podium':()=>[{h:hallE(176,26,{d:22,fl:1})},{h:`<g transform="translate(-66 -32)">${roofE(40,26,1,10)}</g><g transform="translate(66 -32)">${roofE(40,26,1,10)}</g>`,drop:1},{h:`<g transform="translate(0 -32)">${hallE(88,80,{d:16,fl:4})}</g>`},{h:`<g transform="translate(0 -118)">${roofE(88,48,3,16)}</g>`,drop:1}],
 'riverside-hall':()=>[{h:`<polygon points="-140,12 140,12 150,0 -130,0" fill="#9fb4a8"/><polygon points="-140,12 140,12 150,0 -130,0" fill="url(#waves)"/>`},{h:hallE(200,32,{d:22,fl:2})},{h:`<g transform="translate(0 -38)">${roofE(200,52,2,22)}</g>`,drop:1},{h:`<rect x="-14" y="0" width="28" height="10" fill="#8a6644" stroke="${OL}"/><g transform="translate(46 11) scale(1.1)">${boatG}</g>`}],
 'pavilion-campus':()=>[{h:`<g transform="translate(-88 -6) scale(.85)">${hallE(70,22,{d:12})}<g transform="translate(0 -28)">${roofE(70,32,1,12)}</g></g>`},{h:`<g transform="translate(90 -6) scale(.85)">${hallE(70,22,{d:12})}<g transform="translate(0 -28)">${roofE(70,32,1,12)}</g></g>`},{h:`<g transform="translate(-40 6) scale(1.5)">${tree()}</g><g transform="translate(42 6) scale(1.4)">${palm()}</g>`},{h:`${hallE(96,28,{d:14})}<g transform="translate(0 -34)">${roofE(96,42,2,14)}</g>`}],
 'low-courtyard':(s)=>[{h:hallE(160,18,{d:20})},{h:`<g transform="translate(0 -24)">${roofE(160,30,2,20)}</g>`,drop:1},{h:`<g transform="translate(0 10) scale(.8)">${hallE(36,12,{d:6})}<g transform="translate(0 -18)">${roofE(36,18,1,6)}</g></g>`},{h:`<line x1="-115" y1="-74" x2="130" y2="-74" stroke="#a1412a" stroke-width="2" stroke-dasharray="6 4"/><text x="132" y="-70" style="font-size:12px;fill:#743524">${S.map.capLine(waTxt(s.rules.heightCap_m??s.rules.maxHeight_m))}</text>`,drop:1}]
};
