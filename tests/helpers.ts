import { readFileSync } from 'node:fs'
import { studySchema, type Study } from '../src/data/schema'
import { installStudy } from '../src/data/content'

export const readJson = (path: string): unknown => JSON.parse(readFileSync(path, 'utf-8'))
export const loadDemo = (): Study => studySchema.parse(readJson('public/data/study.json'))
export const installDemo = (): Study => { const s = loadDemo(); installStudy(s); return s }

/** Set a value at a dotted path in plain JSON (undefined deletes the key). */
export function setPath(root: unknown, path: string, value: unknown): void {
  const keys = path.split('.')
  const last = keys.pop() as string
  const parent = keys.reduce<Record<string, unknown>>((o, k) => o[k] as Record<string, unknown>, root as Record<string, unknown>)
  if (value === undefined) delete parent[last]; else parent[last] = value
}
