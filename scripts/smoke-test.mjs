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
assert.equal(await page.locator('.concept-card').count(), 1)
assert.equal(await page.locator('.concept-card h2').textContent(), 'Elden Ring')
assert.match(await page.locator('.board-origin-note').textContent(), /Da qui inizia il gioco/)
assert.equal(await page.locator('.thread-layer line').count(), 0)

const zoomOutput = page.locator('.zoom-controls output')
const canvas = page.locator('.board-canvas')
const initialZoom = await canvas.evaluate((element) =>
  element.style.getPropertyValue('--board-zoom'),
)
assert.equal(await zoomOutput.textContent(), '100%')
await page.getByRole('button', { name: 'Aumenta zoom' }).click()
assert.equal(await zoomOutput.textContent(), '110%')
const zoomedValue = await canvas.evaluate((element) =>
  element.style.getPropertyValue('--board-zoom'),
)
assert.equal(initialZoom, '1')
assert.equal(zoomedValue, '1.1')
await page.getByRole('button', { name: 'Riduci zoom' }).click()
assert.equal(await zoomOutput.textContent(), '100%')

await page.locator('.concept-card').first().locator('.card-action').click()
await page.locator('.concept-dialog[open]').waitFor()
assert.match(new URL(page.url()).hash, /^#\/board\//)
await page.locator('.dialog-close').click()
await page.waitForURL(/#\/board$/)

await page.locator('a[href="#/map"]').click()
await page.waitForURL(/#\/map$/)

const discoveredMap = page.locator('.discovered-map__canvas')
await discoveredMap.scrollIntoViewIfNeeded()
await discoveredMap.evaluate((element) => {
  const rect = element.getBoundingClientRect()
  element.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      detail: 1,
      clientX: rect.left + rect.width * 0.25,
      clientY: rect.top + rect.height * 0.4,
    }),
  )
})
const selectedCoordinates = await page
  .getByLabel('Coordinate / riferimento')
  .inputValue()
const coordinateMatch = selectedCoordinates.match(
  /^X ([\d.]+)% · Y ([\d.]+)%$/,
)
assert.ok(coordinateMatch, 'Le coordinate prodotte dal click non sono nel formato X/Y atteso')
assert.ok(
  Math.abs(Number(coordinateMatch[1]) - 25) < 0.5,
  `Coordinata X inattesa: ${selectedCoordinates}`,
)
assert.ok(
  Math.abs(Number(coordinateMatch[2]) - 40) < 0.5,
  `Coordinata Y inattesa: ${selectedCoordinates}`,
)
assert.equal(await page.getByLabel('Regione').inputValue(), 'Sepolcride')
assert.equal(await page.locator('.map-annotation-pin.is-draft').count(), 1)
await page.getByLabel('Nome del punto').fill('Punto di prova')
await page.getByRole('button', { name: 'Salva il punto' }).click()
await page.getByRole('heading', { name: 'Punto di prova' }).waitFor()
assert.equal(await page.locator('.map-annotation-pin:not(.is-draft)').count(), 1)
await page.reload({ waitUntil: 'domcontentloaded' })
await page.getByRole('heading', { name: 'Punto di prova' }).waitFor()
assert.equal(await page.locator('.map-annotation-pin:not(.is-draft)').count(), 1)

assert.equal(await page.locator('.map-iframe').count(), 0)
await page.locator('.mapgenie-disclosure > summary').click()
await page.getByRole('button', { name: 'Carica MapGenie · rischio spoiler' }).click()
const iframe = page.locator('.map-iframe')
await iframe.waitFor({ state: 'visible' })
const mapUrl = new URL((await iframe.getAttribute('src')) || '')
assert.equal(mapUrl.origin, 'https://mapgenie.io')
assert.equal(mapUrl.searchParams.get('locationIds'), '-1')
assert.equal(mapUrl.searchParams.has('catIds'), false)
assert.equal(mapUrl.searchParams.get('route'), 'p0;0')
assert.equal(mapUrl.searchParams.get('popup'), 'false')
assert.equal(mapUrl.searchParams.get('x'), '-0.718767643')
assert.equal(mapUrl.searchParams.get('y'), '0.62524538')
assert.equal(mapUrl.searchParams.get('zoom'), '13.3')
assert.equal(await iframe.getAttribute('tabindex'), '-1')
await page.getByRole('button', { name: 'Abilita navigazione · rischio spoiler' }).click()
assert.equal(await iframe.getAttribute('tabindex'), '0')
await page.getByRole('button', { name: 'Blocca navigazione' }).click()
assert.equal(await iframe.getAttribute('tabindex'), '-1')

await page.locator('a[href="#/translations"]').click()
await page.waitForURL(/#\/translations$/)
await page.locator('.post-run-gate, .post-run-status').first().waitFor()
const postRunGate = page.getByRole('heading', { name: 'Si apre soltanto a run conclusa' })
if ((await postRunGate.count()) > 0) {
  await postRunGate.waitFor()
  assert.equal(await page.getByText('Il segreto di Radagon (ITA)', { exact: true }).count(), 0)
  assert.equal(await page.getByRole('link', { name: /analisi originale/i }).count(), 0)
  assert.match(
    (await page.locator('a[href="#/translations"]').getAttribute('aria-label')) || '',
    /solo dopo la conclusione della run/i,
  )
} else {
  await page.getByRole('button', { name: /^Radagon/ }).first().click()
  await page.waitForURL(/#\/board\/radagon$/)
  await page.locator('.concept-dialog[open]').waitFor()
}

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

console.log(
  'Smoke test completato: board iniziale, zoom, coordinate da click, marker persistenti, embed e 375 px.',
)
