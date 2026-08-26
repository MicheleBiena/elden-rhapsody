import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const baseUrl = process.env.ELDEN_RHAPSODY_URL || 'http://localhost:4173/'
const executablePath =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const cases = [
  { name: 'board-desktop', route: '#/board', width: 1440, height: 1000 },
  { name: 'board-mobile', route: '#/board', width: 375, height: 812 },
  { name: 'dialog-mobile', route: '#/board/elden-ring', width: 375, height: 812 },
  { name: 'map-desktop', route: '#/map', width: 1440, height: 1000 },
  {
    name: 'map-loaded',
    route: '#/map',
    width: 1440,
    height: 1000,
    openAction: '.mapgenie-disclosure > summary',
    action: '.map-consent .primary-action',
    waitAfterAction: 9000,
  },
  {
    name: 'map-loaded-mobile',
    route: '#/map',
    width: 375,
    height: 812,
    openAction: '.mapgenie-disclosure > summary',
    action: '.map-consent .primary-action',
    waitAfterAction: 9000,
  },
  { name: 'translations-desktop', route: '#/translations', width: 1440, height: 1000 },
  { name: 'translations-mobile', route: '#/translations', width: 375, height: 812 },
]

await mkdir('artifacts', { recursive: true })

const browser = await chromium.launch({ executablePath, headless: true })
const results = []

for (const testCase of cases) {
  const page = await browser.newPage({
    viewport: { width: testCase.width, height: testCase.height },
    reducedMotion: 'reduce',
  })

  await page.goto(`${baseUrl}${testCase.route}`, { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => document.fonts.ready)
  let embeddedMapMetrics
  if (testCase.openAction) {
    await page.locator(testCase.openAction).click()
  }
  if (testCase.action) {
    await page.locator(testCase.action).click()
    await page.locator('.map-iframe').waitFor({ state: 'visible' })
    await page.waitForTimeout(testCase.waitAfterAction || 2500)
    const mapFrame = page.frames().find((frame) => frame.url().includes('mapgenie.io'))
    assert.ok(mapFrame, `${testCase.name}: iframe MapGenie non disponibile`)
    await mapFrame.waitForFunction(
      ({ lng, lat, zoom }) => {
        const center = window.map?.getCenter?.()
        const currentZoom = window.map?.getZoom?.()
        const routeLayers = (window.map?.getStyle?.().layers || []).filter((layer) =>
          /route/i.test(layer.id),
        ).length

        return (
          document.querySelectorAll('.category-item.category-visible').length === 0 &&
          document.querySelectorAll('.category-item:not(.category-visible)').length > 0 &&
          document.querySelectorAll('.maplibregl-marker').length === 0 &&
          routeLayers === 0 &&
          center &&
          Math.abs(center.lng - lng) < 1e-9 &&
          Math.abs(center.lat - lat) < 1e-9 &&
          Math.abs(currentZoom - zoom) < 1e-9
        )
      },
      { lng: -0.718767643, lat: 0.62524538, zoom: 13.3 },
      { timeout: 30_000 },
    )
    await page.locator('.map-iframe.is-ready').waitFor({ timeout: 30_000 })
    embeddedMapMetrics = await mapFrame.evaluate(() => ({
      url: window.location.href,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      document: {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      },
      visibleCategories: document.querySelectorAll('.category-item.category-visible').length,
      hiddenCategories: document.querySelectorAll('.category-item:not(.category-visible)').length,
      renderedMarkers: document.querySelectorAll('.maplibregl-marker').length,
      camera: {
        center: window.map?.getCenter?.(),
        zoom: window.map?.getZoom?.(),
      },
      renderedRouteLayers: (window.map?.getStyle?.().layers || []).filter((layer) =>
        /route/i.test(layer.id),
      ).length,
    }))
    assert.equal(
      embeddedMapMetrics.visibleCategories,
      0,
      `${testCase.name}: MapGenie ha categorie visibili`,
    )
    assert.ok(
      embeddedMapMetrics.hiddenCategories > 0,
      `${testCase.name}: stato dei filtri MapGenie non rilevato`,
    )
    assert.equal(
      embeddedMapMetrics.renderedMarkers,
      0,
      `${testCase.name}: MapGenie ha renderizzato marker`,
    )
    assert.equal(
      embeddedMapMetrics.renderedRouteLayers,
      0,
      `${testCase.name}: il waypoint tecnico ha prodotto un tracciato`,
    )
    assert.ok(
      Math.abs(embeddedMapMetrics.camera.center.lng - -0.718767643) < 1e-9 &&
        Math.abs(embeddedMapMetrics.camera.center.lat - 0.62524538) < 1e-9 &&
        Math.abs(embeddedMapMetrics.camera.zoom - 13.3) < 1e-9,
      `${testCase.name}: MapGenie non ha applicato la camera di Sepolcride`,
    )
  }
  await page.screenshot({ path: `artifacts/${testCase.name}.png`, fullPage: true })

  const metrics = await page.evaluate(() => {
    const undersizedControls = [...document.querySelectorAll('button, .nav-tab, summary')]
      .filter((element) => {
        const rect = element.getBoundingClientRect()
        return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)
      })
      .map((element) => ({
        label: element.getAttribute('aria-label') || element.textContent?.trim().slice(0, 60),
        width: Math.round(element.getBoundingClientRect().width),
        height: Math.round(element.getBoundingClientRect().height),
      }))

    return {
      viewportWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      undersizedControls,
    }
  })

  results.push({ name: testCase.name, ...metrics, embeddedMapMetrics })
  await page.close()
}

await browser.close()
console.log(JSON.stringify(results, null, 2))
