import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

const baseUrl = process.env.ELDEN_RHAPSODY_URL || 'http://localhost:4173/'
const executablePath =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const browser = await chromium.launch({ executablePath, headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })

await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
await page.evaluate(() => localStorage.clear())
await page.reload({ waitUntil: 'domcontentloaded' })

assert.equal(new URL(page.url()).hash, '#/board')
assert.equal(await page.locator('h1').textContent(), 'La trama nascosta')

await page.locator('.concept-card').first().locator('.card-action').click()
await page.locator('.concept-dialog[open]').waitFor()
assert.match(new URL(page.url()).hash, /^#\/board\//)
await page.locator('.dialog-close').click()
await page.waitForURL(/#\/board$/)

await page.locator('a[href="#/map"]').click()
await page.waitForURL(/#\/map$/)
await page.getByLabel('Nome del punto').fill('Punto di prova')
await page.getByLabel('Regione').fill('Sepolcride')
await page.getByLabel('Coordinate / riferimento').fill('X 42 · Y 61')
await page.getByRole('button', { name: 'Salva il punto' }).click()
await page.getByRole('heading', { name: 'Punto di prova' }).waitFor()
await page.reload({ waitUntil: 'domcontentloaded' })
await page.getByRole('heading', { name: 'Punto di prova' }).waitFor()

await page.getByRole('button', { name: 'Carica la mappa' }).click()
const iframe = page.locator('.map-iframe')
await iframe.waitFor({ state: 'visible' })
assert.match((await iframe.getAttribute('src')) || '', /^https:\/\/mapgenie\.io\//)

await page.locator('a[href="#/translations"]').click()
await page.waitForURL(/#\/translations$/)
await page.getByRole('button', { name: /^Radagon/ }).first().click()
await page.waitForURL(/#\/board\/radagon$/)
await page.locator('.concept-dialog[open]').waitFor()

const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } })
await mobile.goto(`${baseUrl}#/board`, { waitUntil: 'domcontentloaded' })
const widths = await mobile.evaluate(() => ({
  viewport: window.innerWidth,
  document: document.documentElement.scrollWidth,
}))
assert.equal(widths.document, widths.viewport)

await mobile.close()
await page.evaluate(() => localStorage.clear())
await browser.close()

console.log('Smoke test completato: routing, dialog, marker persistenti, embed e 375 px.')
