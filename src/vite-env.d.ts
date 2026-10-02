/// <reference types="vite/client" />

interface Window {
  /** set only by scripts/art.mjs: bake in the browser and hand the result to the script */
  __artForce?: boolean
  __artQuality?: number
  __saveArt?: (key: string, sig: string, dataUrl: string) => void
  /** how each painted scene was produced; the tests read it */
  __art?: Record<string, 'prebaked' | 'baked'>
}
