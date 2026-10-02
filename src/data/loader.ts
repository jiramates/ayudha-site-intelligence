import { studySchema, type Study } from './schema'
import { S } from './strings.th'

/** Set by vite only in the single-file review build, where fetch() on file:// is not available. */
declare const __INLINE_STUDY__: string | undefined

export type LoadResult = { ok: true; study: Study } | { ok: false; issues: string[] }

export function parseStudy(raw: unknown): LoadResult {
  const r = studySchema.safeParse(raw)
  if (r.success) return { ok: true, study: r.data }
  return { ok: false, issues: r.error.issues.map(i => `${i.path.join('.') || '(root)'} — ${i.message}`) }
}

export async function loadStudy(): Promise<LoadResult> {
  let text: string
  if (typeof __INLINE_STUDY__ === 'string') text = __INLINE_STUDY__
  else {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}data/study.json`)
      if (!res.ok) return { ok: false, issues: [`${S.error.fetchFail} (${res.status})`] }
      text = await res.text()
    } catch {
      return { ok: false, issues: [S.error.fetchFail] }
    }
  }
  let raw: unknown
  try { raw = JSON.parse(text) } catch { return { ok: false, issues: [S.error.notJson] } }
  return parseStudy(raw)
}
