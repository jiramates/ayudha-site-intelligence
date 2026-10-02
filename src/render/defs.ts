

export const DEFS=`
<pattern id="tileP" width="7" height="5" patternUnits="userSpaceOnUse"><path d="M0 5 Q3.5 0 7 5" fill="none" stroke="#5a2618" stroke-width=".8" opacity=".6"/></pattern>
<pattern id="thatch" width="4" height="9" patternUnits="userSpaceOnUse"><path d="M1 0 L2 9 M3 0 L3.6 9" stroke="#7a5a30" stroke-width=".6" opacity=".7"/></pattern>
<pattern id="plank" width="3.5" height="10" patternUnits="userSpaceOnUse"><line x1=".5" y1="0" x2=".5" y2="10" stroke="#6e4b2c" stroke-width=".5" opacity=".7"/></pattern>
<pattern id="rice" width="9" height="7" patternUnits="userSpaceOnUse"><path d="M1 6.5 l1.6 -4.5 M4.5 6.5 l.8 -5.5 M7.5 6.5 l1.6 -4.5" stroke="#5c7a49" stroke-width=".9" fill="none" opacity=".7"/></pattern>
<pattern id="waves" width="20" height="11" patternUnits="userSpaceOnUse"><path d="M0 8 q5 -6.5 10 0 q5 -6.5 10 0" fill="none" stroke="#dbe3d6" stroke-width="1.1" opacity=".8"/><path d="M-10 2.5 q5 -6 10 0 q5 -6 10 0 q5 -6 10 0" fill="none" stroke="#6e8c82" stroke-width=".8" opacity=".6"/></pattern>
<pattern id="clothDot" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#4f6a49"/><circle cx="3" cy="3" r="1.2" fill="#d4bb82"/><circle cx="0" cy="0" r=".6" fill="#b5893f"/></pattern>
<pattern id="clothBr" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#71331f"/><path d="M0 0 L7 7 M7 0 L0 7" stroke="#c4964a" stroke-width=".6"/><circle cx="3.5" cy="3.5" r="1" fill="#e2cb92"/></pattern>
<pattern id="hatchR" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="#a04a33" stroke-width="1.2" opacity=".55"/></pattern>
<pattern id="hatchB" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)"><line x1="0" y1="0" x2="0" y2="8" stroke="#46717f" stroke-width="1.3" opacity=".5"/></pattern>
<linearGradient id="rockG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9d1c2"/><stop offset=".55" stop-color="#9fb0a3"/><stop offset="1" stop-color="#6f8579"/></linearGradient>
<linearGradient id="rockG2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6d2bd"/><stop offset="1" stop-color="#93a395"/></linearGradient>
<linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c7b892"/><stop offset=".45" stop-color="#ddd1b0"/><stop offset="1" stop-color="#e6dcc3"/></linearGradient>
<linearGradient id="prangG" x1="0" x2="1"><stop offset="0" stop-color="#dba57a"/><stop offset=".5" stop-color="#c98b5f"/><stop offset=".52" stop-color="#a86b45"/><stop offset="1" stop-color="#8f5838"/></linearGradient>
<linearGradient id="chediG" x1="0" x2="1"><stop offset="0" stop-color="#f4ecd8"/><stop offset=".5" stop-color="#e6dcc3"/><stop offset=".52" stop-color="#c9bc9e"/><stop offset="1" stop-color="#b3a585"/></linearGradient>
<radialGradient id="stainG"><stop offset="0" stop-color="#6b4a24" stop-opacity=".22"/><stop offset="1" stop-color="#6b4a24" stop-opacity="0"/></radialGradient>
<radialGradient id="hazeG"><stop offset="0" stop-color="#f6eedb" stop-opacity=".55"/><stop offset="1" stop-color="#f6eedb" stop-opacity="0"/></radialGradient>
<radialGradient id="vigG" cx="50%" cy="50%" r="72%"><stop offset="62%" stop-color="#4a2e12" stop-opacity="0"/><stop offset="100%" stop-color="#4a2e12" stop-opacity=".42"/></radialGradient>
<linearGradient id="dampG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a3e1e" stop-opacity="0"/><stop offset="1" stop-color="#5a3e1e" stop-opacity=".28"/></linearGradient>`;
export const LITE=`<filter id="lite" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="4" result="w"/><feDisplacementMap in="SourceGraphic" in2="w" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="d"/><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="2" seed="2" result="g"/><feColorMatrix in="g" values="0.3 0.3 0.3 0 0.58  0.3 0.3 0.3 0 0.58  0.3 0.3 0.3 0 0.56  0 0 0 0 1" result="gg"/><feBlend in="d" in2="gg" mode="multiply" result="p"/><feComposite in="p" in2="SourceGraphic" operator="in"/></filter>`;

export function installDefs(){document.getElementById('gdefs')!.innerHTML=DEFS+LITE}
