import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { readFileSync } from 'node:fs'

// One self-contained HTML file for review: JS + CSS inlined, study.json inlined (no fetch on file://).
// Fonts are inlined as data URIs by scripts/build-single.mjs after this build.
export default defineConfig({
  base: './',
  plugins: [viteSingleFile()],
  define: { __INLINE_STUDY__: JSON.stringify(process.env.STUDY_FILE ? readFileSync(process.env.STUDY_FILE, 'utf-8') : readFileSync('public/data/study.json', 'utf-8')) },
  build: { outDir: 'dist-single', emptyOutDir: true, target: 'es2022' },
})
