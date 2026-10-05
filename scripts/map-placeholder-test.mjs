import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

const baseUrl = process.env.ELDEN_RHAPSODY_URL || 'http://localhost:4173/'
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
})

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))

  const savedMarkers = JSON.stringify([{ id: 'preserved-marker', title: 'Non cancellare' }])
  await page.addInitScript(value => localStorage.setItem('elden-rhapsody:map-markers-v2', value), savedMarkers)
  await page.goto(`${baseUrl}#/map`, { waitUntil: 'networkidle' })

  await page.getByRole('heading', { name: 'Coming soon', exact: true }).waitFor()
  assert.equal(await page.locator('.map-coming-soon__sword svg').count(), 1)
  assert.match(await page.locator('.map-coming-soon__backdrop').getAttribute('src'), /coming-soon-background\.jpg$/)
  assert.equal(await page.locator('.map-layout, .map-iframe, .marker-form').count(), 0)
  assert.equal(await page.evaluate(() => localStorage.getItem('elden-rhapsody:map-markers-v2')), savedMarkers)
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  await page.screenshot({ path: 'artifacts/map-coming-soon-desktop.png', fullPage: true })

  await page.setViewportSize({ width: 375, height: 812 })
  await page.reload({ waitUntil: 'networkidle' })
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  assert.equal(await page.evaluate(() => localStorage.getItem('elden-rhapsody:map-markers-v2')), savedMarkers)
  await page.screenshot({ path: 'artifacts/map-coming-soon-mobile.png', fullPage: true })

  assert.deepEqual(errors, [])
  console.log('Map placeholder passed: sword, backdrop, responsive layout and preserved local markers.')
} finally {
  await browser.close()
}
