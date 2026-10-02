import './styles/fonts.css'
import './styles/mural.css'
import './styles/layout.css'
import { installTextures } from './styles/textures'
import { installDefs } from './render/defs'
import { RM } from './render/util'
import { setAgeLevel } from './render/age'
import { loadStudy } from './data/loader'
import { loadArtManifest } from './render/bake'
import { installStudy, SITES } from './data/content'
import { numWord } from './data/units'
import { S } from './data/strings.th'
import { fillStatic, fillStudy, showLoadError } from './ui/chrome'
import { drawHero } from './scenes/hero'
import { drawScene, setSpeaker, nextSpeaker } from './scenes/story'
import { drawMap } from './scenes/map'
import { bindMap, tick } from './scenes/map-live'
import { renderOpinions } from './scenes/summary'
import { installRenderer, startUrlSync } from './state/render'
import { render } from './state/store'
import { speak } from './ui/narrator'
import { initPager } from './ui/pager'
import { initSheet } from './ui/sheet'
import { initPeek } from './ui/peek'
import { initFull } from './ui/full'
import { initStoryFit } from './ui/storyfit'
import { initHeroFit } from './ui/herofit'
import { initExport } from './ui/export'

async function boot() {
  fillStatic()
  installTextures()
  installDefs()
  const [res] = await Promise.all([loadStudy(), loadArtManifest()])
  if (!res.ok) { showLoadError(res.issues); return }
  installStudy(res.study)
  setAgeLevel(res.study.meta.ageLevel)
  fillStudy()
  installRenderer()
  renderOpinions()
  bindMap()
  // draw order matters: the shared seeded RNG must be consumed hero → scene → map, as in v3
  drawHero(); drawScene(); drawMap(); render()
  speak('khun', S.narrator.intro(numWord(Object.keys(SITES).length)))
  setSpeaker(0); if (!RM) setInterval(nextSpeaker, 5000)
  requestAnimationFrame(tick)
  initPager()
  initStoryFit()
  initHeroFit()
  initPeek()
  initFull()
  initSheet()
  startUrlSync() // after the sheet exists: a deep link opens it
  initExport()
}
boot()
