import type { Study, Site, Zone, ModeId, SpeakerId } from './schema'

/** Live bindings, filled once by installStudy() before anything is drawn. */
export let STUDY = {} as Study
export let SITES: Record<string, Site> = {}
export let ZONES: Record<string, Zone> = {}
export let MODES = {} as Study['modes']
export let DEST = {} as Study['destinations']
export let CRIT = {} as Study['criteria']
export let PEOPLE = {} as Study['cast']
export let STORY: Study['story'] = []

export const MODE_IDS: ModeId[] = ['walk', 'horse', 'ele', 'boat']
export const CRIT_IDS = ['loc', 'reg', 'acc', 'grow'] as const

export function installStudy(s: Study) {
  STUDY = s
  SITES = Object.fromEntries(s.sites.map(x => [x.id, x]))
  ZONES = Object.fromEntries(s.zones.map(x => [x.id, x]))
  MODES = s.modes; DEST = s.destinations; CRIT = s.criteria; PEOPLE = s.cast; STORY = s.story
}

export const person = (k: SpeakerId) => PEOPLE[k]
export const total = (s: Site) => s.score.loc + s.score.reg + s.score.acc + s.score.grow
