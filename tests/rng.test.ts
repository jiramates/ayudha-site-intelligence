import { describe, it, expect } from 'vitest'
import { rnd, setSeed, withSeed, seedFrom } from '../src/render/rng'

describe('per-site random stream', () => {
  it('gives the same numbers whatever the shared stream did before, and leaves it untouched', () => {
    setSeed(11); rnd(); rnd(); const before = rnd(); setSeed(11); rnd(); rnd()
    const a = withSeed(seedFrom('C'), () => [rnd(), rnd(), rnd()])
    expect(rnd()).toBe(before) // shared stream continues as if withSeed never ran
    setSeed(999); for (let i = 0; i < 50; i++) rnd()
    const b = withSeed(seedFrom('C'), () => [rnd(), rnd(), rnd()])
    expect(b).toEqual(a)
    expect(withSeed(seedFrom('D'), () => rnd())).not.toBe(a[0])
  })
})
