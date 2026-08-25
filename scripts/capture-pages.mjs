import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const baseUrl = process.env.ELDEN_RHAPSODY_URL || 'http://localhost:4173/'
const executablePath =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const cases = [
  { name: 'board-desktop', route: '#/board', width: 1440, height: 1000 },
  { name: 'board-mobile', route: '#/board', width: 375, height: 812 },
  { name: 'dialog-mobile', route: '#/board/radagon', width: 375, height: 812 },
  { name: 'map-desktop', route: '#/map', width: 1440, height: 1000 },
  {
    name: 'map-loaded',
    route: '#/map',
    width: 1440,
    height: 1000,
    action: '.map-consent .primary-action',
    waitAfterAction: 9000,
  },
  { name: 'translations-desktop', route: '#/translations', width: 1440, height: 1000 },
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
  if (testCase.action) {
    await page.locator(testCase.action).click()
    await page.locator('.map-iframe').waitFor({ state: 'visible' })
    await page.waitForTimeout(testCase.waitAfterAction || 2500)
    const mapFrame = page.frames().find((frame) => frame.url().includes('mapgenie.io'))
    embeddedMapMetrics = await mapFrame?.evaluate(() => ({
      viewport: { width: window.innerWidth, height: window.innerHeight },
      document: {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      },
      largeElements: [...document.querySelectorAll('body *')]
        .map((element) => {
          const rect = element.getBoundingClientRect()
          return {
            tag: element.tagName,
            id: element.id,
            className: String(element.className).slice(0, 120),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          }
        })
        .filter((element) => element.width > 150 && element.height > 400)
        .slice(0, 12),
    }))
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
