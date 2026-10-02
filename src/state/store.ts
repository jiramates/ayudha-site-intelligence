export type Mode = 'site' | 'reg' | 'tr'
export const st = {
  mode: 'site' as Mode,
  site: null as string | null,
  zone: null as string | null,
  tm: { walk: true, horse: true, ele: true, boat: true } as Record<string, boolean>,
}

let impl: (ev?: string) => void = () => {}
export const setRenderer = (f: (ev?: string) => void) => { impl = f }
/** The one state-change entry point: mutate `st`, then call render(eventName). */
export const render = (ev?: string) => impl(ev)
