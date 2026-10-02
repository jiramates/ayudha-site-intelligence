import { test, expect, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'

const study = JSON.parse(readFileSync('public/data/study.json', 'utf-8')) as { sites: { id: string; name: string }[] }
const name = (id: string) => study.sites.find(s => s.id === id)!.name

async function ready(page: Page) {
  await expect(page.locator('#loading')).toBeHidden({ timeout: 30000 })
}
const mode = (page: Page) => page.locator('.tab[aria-selected="true"]').getAttribute('data-mode')
const viewBoxWidth = (page: Page) => page.locator('#map').evaluate(e => Number((e.getAttribute('viewBox') as string).split(' ')[2]))
const hash = (page: Page) => page.evaluate(() => location.hash)

test.describe('deep links', () => {
  for (const id of ['A', 'B', 'C', 'D']) {
    test(`#site-${id} restores lens 1, zoom and caption`, async ({ page }) => {
      await page.goto(`/#site-${id}`)
      await ready(page)
      expect(await mode(page)).toBe('site')
      await expect(page.locator('#cap')).toContainText(name(id))
      await expect(page.locator('#zoomOut')).toBeVisible()
      await expect.poll(() => viewBoxWidth(page)).toBeLessThan(700) // zoomed in at once, no tween on restore
      await expect(page.locator('#bbs .pop').first()).toBeAttached() // the model rises
    })
  }

  test('#lens-reg-B restores lens 2 with site B', async ({ page }) => {
    await page.goto('/#lens-reg-B')
    await ready(page)
    expect(await mode(page)).toBe('reg')
    await expect(page.locator('.zic')).toHaveCount(5)
    await expect(page.locator('#panel h3').first()).toContainText('สอง') // "rules of site two"
    expect(await viewBoxWidth(page)).toBe(1000)
    expect(await hash(page)).toBe('#lens-reg-B')
  })

  test('#lens-tr-C restores lens 3 with site C', async ({ page }) => {
    await page.goto('/#lens-tr-C')
    await ready(page)
    expect(await mode(page)).toBe('tr')
    await expect(page.locator('#tokens > g')).toHaveCount(4)
    await expect(page.locator('#panel h3').first()).toContainText('สาม')
  })

  test('#lens-site-D is accepted as an alias', async ({ page }) => {
    await page.goto('/#lens-site-D')
    await ready(page)
    await expect(page.locator('#cap')).toContainText(name('D'))
  })

  for (const bad of ['#site-Z', '#lens-reg-', '#lens-xx-A', '#foo', '#site-A%20x', '#site-<b>']) {
    test(`an unknown link ${bad} opens the whole city and breaks nothing`, async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', e => errors.push(e.message))
      await page.goto('/' + bad)
      await ready(page)
      expect(await mode(page)).toBe('site')
      await expect(page.locator('#cap')).toBeHidden()
      expect(await viewBoxWidth(page)).toBe(1000)
      expect(errors).toEqual([])
    })
  }

  test('reload keeps the view', async ({ page }) => {
    await page.goto('/#lens-tr-B'); await ready(page)
    await page.reload(); await ready(page)
    expect(await mode(page)).toBe('tr')
    expect(await hash(page)).toBe('#lens-tr-B')
  })

  test('back and forward move between views', async ({ page }) => {
    await page.goto('/'); await ready(page)
    await page.locator('.site[data-site="A"]').first().dispatchEvent('click')
    expect(await hash(page)).toBe('#site-A')
    await page.locator('.site[data-site="B"]').first().dispatchEvent('click')
    expect(await hash(page)).toBe('#site-B')
    await page.locator('#t-reg').click()
    expect(await hash(page)).toBe('#lens-reg-B')

    await page.goBack()
    expect(await hash(page)).toBe('#site-B')
    expect(await mode(page)).toBe('site')
    await expect(page.locator('#cap')).toContainText(name('B'))
    await page.goBack()
    await expect(page.locator('#cap')).toContainText(name('A'))
    await page.goBack()
    expect(await hash(page)).toBe('')
    await expect(page.locator('#cap')).toBeHidden()
    await expect.poll(() => viewBoxWidth(page)).toBe(1000) // zoomed back out

    await page.goForward()
    await expect(page.locator('#cap')).toContainText(name('A'))
    await page.goForward(); await page.goForward()
    expect(await mode(page)).toBe('reg')
    expect(await hash(page)).toBe('#lens-reg-B')
  })

  test('editing the address bar hash changes the view', async ({ page }) => {
    await page.goto('/'); await ready(page)
    await page.evaluate(() => { location.hash = '#lens-tr-D' })
    await expect.poll(() => mode(page)).toBe('tr')
    await expect(page.locator('#panel h3').first()).toContainText('สี่')
  })

  test('the hash holds only letters, digits and hyphens', async ({ page }) => {
    await page.goto('/'); await ready(page)
    for (const id of ['A', 'B', 'C', 'D']) {
      await page.locator('.site[data-site="' + id + '"]').first().dispatchEvent('click')
      for (const tab of ['#t-reg', '#t-tr']) { await page.locator(tab).click(); expect(await hash(page)).toMatch(/^#[A-Za-z0-9-]+$/) }
      await page.locator('.tab[data-mode="site"]').click()
    }
  })
})
