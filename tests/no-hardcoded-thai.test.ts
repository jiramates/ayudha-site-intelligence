import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const walk = (d: string): string[] => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p] })

describe('copy discipline (CLAUDE.md)', () => {
  it('Thai text lives only in src/data/strings.th.ts', () => {
    const offenders = walk('src').filter(f => f.endsWith('.ts') && !f.endsWith('strings.th.ts'))
      .filter(f => /[฀-๿]/.test(readFileSync(f, 'utf-8')))
    expect(offenders).toEqual([])
  })
  it('index.html has no hard-coded Thai', () => {
    expect(/[฀-๿]/.test(readFileSync('index.html', 'utf-8'))).toBe(false)
  })
  it('no `any` in src', () => {
    const offenders = walk('src').filter(f => f.endsWith('.ts')).filter(f => /(:\s*any\b|\bas any\b|<any>)/.test(readFileSync(f, 'utf-8')))
    expect(offenders).toEqual([])
  })
})
