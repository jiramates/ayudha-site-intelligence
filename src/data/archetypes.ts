/**
 * Massing archetypes. To add one: add an entry here (the name, plus optional facts that prose may cite)
 * and add its drawing function to ARCHETYPE_DRAW in src/scenes/massing.ts (the compiler enforces both).
 * Prose can cite `{roofTiers:word}` / `{wings:word}` so the text always matches the model that is drawn.
 */
export interface ArchetypeMeta {
  /** number of stacked roof tiers on the main building */
  roofTiers?: number
  /** number of side wings */
  wings?: number
  /** drawing scale on the map (default 1.08) */
  scale?: number
}

export const ARCHETYPES = {
  'tower-podium': { roofTiers: 3, wings: 2 },
  'riverside-hall': { roofTiers: 2 },
  'pavilion-campus': { scale: 1.05 },
  'low-courtyard': { roofTiers: 2 },
} satisfies Record<string, ArchetypeMeta>

export type ArchetypeName = keyof typeof ARCHETYPES
export const ARCHETYPE_NAMES = Object.keys(ARCHETYPES) as [ArchetypeName, ...ArchetypeName[]]
export const DEFAULT_MASS_SCALE = 1.08
export const archetypeMeta = (n: ArchetypeName): ArchetypeMeta => ARCHETYPES[n]
