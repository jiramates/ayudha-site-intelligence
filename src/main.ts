import './styles/fonts.css'
import './styles/mural.css'
import { installTextures } from './styles/textures'
import { installDefs } from './render/defs'
import { RM } from './render/util'
import { drawHero } from './scenes/hero'
import { drawScene, setSpeaker, nextSpeaker } from './scenes/story'
import { drawMap } from './scenes/map'
import { bindMap, tick } from './scenes/map-live'
import { renderOpinions } from './scenes/summary'
import { installRenderer } from './state/render'
import { render } from './state/store'
import { speak } from './ui/narrator'
import { initReveal } from './ui/reveal'
import { SAY } from './data/strings.th'

installTextures()
installDefs()
installRenderer()
renderOpinions()
bindMap()
// draw order matters: the shared seeded RNG must be consumed hero → scene → map, as in v3
drawHero();drawScene();drawMap();render();
speak('khun',SAY.intro);
setSpeaker(0);if(!RM)setInterval(nextSpeaker,5000);
requestAnimationFrame(tick);
initReveal()
