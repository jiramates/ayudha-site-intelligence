import { z } from 'zod'
import { DIR_NAMES, S } from './strings.th'
import { ARCHETYPE_NAMES } from './archetypes'
import { checkProse } from './prose'

const xy = z.tuple([z.number(), z.number()])
const text = z.string().min(1)
const speaker = z.enum(['khun', 'mor', 'phon'])
const person = z.object({ name: text, role: text })
const side = z.enum(['top', 'bottom', 'left', 'right'])
const route = z.array(xy).min(2)
const score = z.number().int().min(0).max(5)

const water = z.object({ name: text, setback_m: z.number().min(0), side })

export const siteSchema = z.object({
  id: z.string().regex(/^[A-Za-z0-9-]+$/), // letters, digits and hyphens only: ids appear in deep links
  n: z.number().int().min(1).max(9),
  name: text, short: text, pos: xy, parcelPx: xy,
  desc: text, form: text, say: text,
  pros: z.array(text), cons: z.array(text), verdict: text,
  score: z.object({ loc: score, reg: score, acc: score, grow: score }),
  land_m2: z.number().positive(),
  rules: z.object({
    dims_m: xy, road_m: z.number().positive(), roadSide: side, roadSetback_m: z.number().min(0),
    water: water.nullable(), far: z.number().positive(), heightCap_m: z.number().positive().nullable(),
    maxHeight_m: z.number().positive(), floodSok: z.number().min(0),
    gfaAllow_m2: z.number().positive(), gfa_m2: z.number().positive(),
    flags: z.array(z.tuple([z.enum(['ok', 'warn', 'risk']), text])),
  }),
  astro: z.object({ front: z.enum(DIR_NAMES), good: z.boolean(), text, fix: text }),
  massing: z.enum(ARCHETYPE_NAMES),
  routes: z.object({ walk: route, horse: route, ele: route, boat: route }),
  transportNote: text,
})

const mode = z.object({
  name: text, senPerBaht: z.number().positive(), color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  width: z.number().positive(), dash: z.string(), meaning: text, equiv: text,
})
const dest = z.object({ name: text, pt: xy })
const line = z.object({ speaker: z.enum(['khun', 'mor']), text })

export const studySchema = z.object({
  meta: z.object({
    title: text, era: z.object({ label: text, year: z.number().int().positive() }), ageLevel: z.number().min(0).max(2),
    bedDivisor: z.number().positive(), planUnit_m: z.number().positive(), minPerBaht: z.number().positive(),
    /** regulation constants that prose and zones cite, in SI units */
    regs: z.object({
      palaceHeightCap_m: z.number().positive(), palaceRadiusSen: z.number().positive(),
      canalWidthLimit_m: z.number().positive(), canalSetbackSmall_m: z.number().positive(), canalSetback_m: z.number().positive(), riverSetback_m: z.number().positive(),
      minRoad_m: z.number().positive(), roadSetback_m: z.number().positive(),
    }),
  }),
  cast: z.object({ khun: person, mor: person, phon: person }),
  story: z.array(line).min(1).max(2),
  sites: z.array(siteSchema).min(1).max(9),
  zones: z.array(z.object({ id: z.string().min(1), seal: text, pos: xy, title: text, text, tags: z.array(text) })),
  modes: z.object({ walk: mode, horse: mode, ele: mode, boat: mode }),
  destinations: z.object({ walk: dest, horse: dest, ele: dest, boat: dest }),
  criteria: z.object({ loc: text, reg: text, acc: text, grow: text }),
  opinions: z.array(line),
  resolution: z.array(text),
  comingSoon: z.array(text),
}).superRefine((d, ctx) => {
  const dup = (vals: (string | number)[], path: string) => {
    if (new Set(vals).size !== vals.length) ctx.addIssue({ code: 'custom', path: [path], message: S.error.duplicate })
  }
  dup(d.sites.map(s => s.id), 'sites')
  dup(d.sites.map(s => s.n), 'sites')
  dup(d.zones.map(z => z.id), 'zones')
  checkProse(d).forEach(i => ctx.addIssue({ code: 'custom', path: i.path, message: i.message }))
})

export type Study = z.infer<typeof studySchema>
export type Site = Study['sites'][number]
export type Zone = Study['zones'][number]
export type Mode = Study['modes']['walk']
export type ModeId = keyof Study['modes']
export type SpeakerId = keyof Study['cast']
export type XY = [number, number]
export type Side = z.infer<typeof side>
