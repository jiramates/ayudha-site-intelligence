import { defineConfig, type Plugin } from 'vitest/config'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { S } from './src/data/strings.th'
import { thaiWord } from './src/data/format'

const attr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Open Graph + Twitter tags. SITE_URL (e.g. https://ayudha.example.com) makes the image and page links absolute. */
export function ogMeta(env: Record<string, string | undefined> = process.env): Plugin {
  return {
    name: 'og-meta',
    transformIndexHtml(html) {
      const study = JSON.parse(readFileSync(env.STUDY_FILE ?? 'public/data/study.json', 'utf-8')) as { meta: { title: string }; sites: unknown[] }
      const site = (env.SITE_URL ?? '').replace(/\/+$/, '')
      if (!site) console.warn('[og-meta] SITE_URL is not set: the preview image link is relative; link previews need an absolute URL.')
      const abs = (p: string) => (site ? `${site}/${p}` : `./${p}`)
      const title = attr(study.meta.title), desc = attr(S.og.description(thaiWord(study.sites.length))), alt = attr(S.og.imageAlt), img = attr(abs('og-image.jpg'))
      const tags = [
        `<meta name="description" content="${desc}">`,
        site && `<link rel="canonical" href="${attr(site + '/')}">`,
        `<meta property="og:type" content="website">`,
        `<meta property="og:locale" content="th_TH">`,
        `<meta property="og:title" content="${title}">`,
        `<meta property="og:description" content="${desc}">`,
        site && `<meta property="og:url" content="${attr(site + '/')}">`,
        `<meta property="og:image" content="${img}">`,
        `<meta property="og:image:type" content="image/jpeg">`,
        `<meta property="og:image:width" content="1200">`,
        `<meta property="og:image:height" content="630">`,
        `<meta property="og:image:alt" content="${alt}">`,
        `<meta name="twitter:card" content="summary_large_image">`,
        `<meta name="twitter:title" content="${title}">`,
        `<meta name="twitter:description" content="${desc}">`,
        `<meta name="twitter:image" content="${img}">`,
        `<meta name="twitter:image:alt" content="${alt}">`,
      ].filter(Boolean).join('\n')
      if (!html.includes('<!--og-meta-->')) throw new Error('index.html is missing the <!--og-meta--> marker')
      return html.replace('<!--og-meta-->', tags)
    },
  }
}

/** Hash of the files that draw the painted art: prebaked art (public/art) is used only while it matches. */
function artSource(): string {
  const walk = (d: string): string[] => readdirSync(d).flatMap(f => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]))
  const files = [...walk('src/render'), 'src/scenes/hero.ts', 'src/scenes/story.ts', 'src/scenes/map.ts'].sort()
  const h = createHash('sha1')
  for (const f of files) h.update(f).update(readFileSync(f))
  return h.digest('hex').slice(0, 12)
}

export default defineConfig({
  base: './',
  plugins: [ogMeta()],
  define: { __INLINE_STUDY__: 'undefined', __ART_SRC__: JSON.stringify(artSource()) },
  build: { target: 'es2022' },
  test: { include: ['tests/**/*.test.ts'], environment: 'node' },
})
