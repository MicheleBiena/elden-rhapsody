import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

const baseUrl = process.env.ELDEN_RHAPSODY_URL || 'http://localhost:4173/'
const executablePath =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const browser = await chromium.launch({ executablePath, headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })

async function assertBoardZonesSpanCanvas(targetPage) {
  const geometry = await targetPage.locator('.board-canvas').evaluate((canvas) => {
    const canvasRect = canvas.getBoundingClientRect()
    const zones = [...canvas.querySelectorAll('.board-zone')].map((zone) => {
      const rect = zone.getBoundingClientRect()
      const style = getComputedStyle(zone)
      return {
        leftInset: rect.left - canvasRect.left,
        rightInset: canvasRect.right - rect.right,
        widthRatio: rect.width / canvasRect.width,
        borderTopWidth: Number.parseFloat(style.borderTopWidth),
        borderTopStyle: style.borderTopStyle,
      }
    })

    return { zones }
  })

  for (const zone of geometry.zones) {
    assert.ok(zone.leftInset <= 14 && zone.rightInset <= 14, 'Il bordo della sezione non copre la lavagna')
    assert.ok(zone.widthRatio >= 0.97, 'La sezione occupa meno del 97% della larghezza utile')
    assert.ok(zone.borderTopWidth >= 5 && zone.borderTopStyle === 'solid', 'Il divisore di sezione non Ã¨ visibile')
  }
}

await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
await page.evaluate(() => localStorage.clear())
await page.reload({ waitUntil: 'domcontentloaded' })

assert.equal(new URL(page.url()).hash, '#/board')
assert.equal(await page.locator('h1').textContent(), 'La trama nascosta')
assert.equal(await page.locator('.concept-card').count(), 28)
assert.deepEqual(
  await page.locator('.concept-card h2').allTextContents(),
  [
    'Elden Ring',
    'Regina Marika l’Eterna',
    'Notte dei Neri Coltelli',
    'Runa della Morte',
    'Albero Madre',
    'Semi d’oro',
    'Guerra dello Shattering',
    'Semidei',
    'Miquella',
    'Malenia la Recisa',
    'Radahn',
    'Godrick l’Innestato',
    'I Senzaluce',
    'Grazia',
    'Vergini delle Dita',
    'Melina',
    'Hoarah Loux',
    'Goldmask',
    'Fia',
    'Mangiasterco',
    'Sir Gideon Ofnir l’Onnisciente',
    'Varré',
    'Strega Renna',
    'Due Dita',
    'Kalé',
    'Boc',
    'Roderika',
    'Spiriti',
  ],
)
assert.match(await page.locator('.board-origin-note').textContent(), /Da qui inizia il gioco/)
assert.equal(await page.locator('.board-zone').count(), 3)
assert.match(await page.locator('.board-zones').textContent(), /Ordine spezzato/)
assert.match(await page.locator('.board-zones').textContent(), /Chiamata dei Senzaluce/)
assert.match(await page.locator('.board-zones').textContent(), /Primi incontri in Sepolcride/)
assert.deepEqual(await page.locator('.board-zone__heading small').allTextContents(), ['01', '02', '03'])
await assertBoardZonesSpanCanvas(page)
assert.equal(await page.locator('.thread-layer g').count(), 37)
assert.equal(await page.locator('.thread-layer line').count(), 74)
assert.equal(await page.locator('.relation-list button').count(), 37)
assert.equal(await page.locator('.concept-image:not(.concept-image--placeholder)').count(), 22)
assert.equal(await page.locator('.concept-image--placeholder').count(), 6)
assert.deepEqual(
  await page.locator('.concept-card:has(.concept-image--placeholder) h2').allTextContents(),
  [
    'Runa della Morte',
    'Semidei',
    'Godrick l’Innestato',
    'Grazia',
    'Vergini delle Dita',
    'Due Dita',
  ],
)
await page.locator('.concept-card img').evaluateAll((images) => {
  images.forEach((image) => {
    image.loading = 'eager'
  })
})
await page.waitForFunction(() =>
  [...document.querySelectorAll('.concept-card img')].every((image) => image.complete),
)
await page.locator('.concept-card img').evaluateAll((images) =>
  Promise.all(images.map((image) => image.decode().catch(() => undefined))),
)
assert.deepEqual(
  await page.locator('.concept-card img').evaluateAll((images) =>
    images
      .filter((image) => image.naturalWidth === 0)
      .map((image) => image.getAttribute('alt')),
  ),
  [],
)
assert.match(await page.locator('.board-legend').textContent(), /Evento\s*2/)
assert.match(await page.locator('.board-legend').textContent(), /Personaggio\s*16/)
assert.match(await page.locator('.board-legend').textContent(), /Luogo\s*1/)
assert.equal(await page.locator('.concept-card.is-read').count(), 6)
assert.equal(await page.locator('.concept-card.is-unread').count(), 22)
assert.equal(await page.locator('.thread-layer g.is-new').count(), 31)
assert.equal(await page.locator('.relation-list button.is-new').count(), 31)
assert.match(await page.locator('.board-live-note').textContent(), /22 novità da leggere/)
assert.match(await page.locator('.board-legend').textContent(), /Da leggere\s*22/)

await page.getByRole('button', { name: 'Apri la prima novità' }).click()
await page.locator('.concept-dialog[open]').waitFor()
assert.equal(await page.locator('#concept-dialog-title').textContent(), 'Regina Marika l’Eterna')
assert.match(await page.locator('.dialog-content').textContent(), /Da leggere in live/)
await page.locator('.dialog-close').click()
await page.waitForURL(/#\/board$/)

const desktopCards = await page.locator('.concept-card').evaluateAll((cards) =>
  cards.map((card) => {
    const rect = card.getBoundingClientRect()
    return {
      name: card.querySelector('h2')?.textContent || 'Scheda senza nome',
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
    }
  }),
)
const desktopBoard = await page.locator('.concept-board').evaluate((board) => {
  const rect = board.getBoundingClientRect()
  return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom }
})
for (const card of desktopCards) {
  assert.ok(
    card.left >= desktopBoard.left &&
      card.right <= desktopBoard.right &&
      card.top >= desktopBoard.top &&
      card.bottom <= desktopBoard.bottom,
    `La scheda “${card.name}” esce dai bordi della lavagna`,
  )
}
for (let first = 0; first < desktopCards.length; first += 1) {
  for (let second = first + 1; second < desktopCards.length; second += 1) {
    const a = desktopCards[first]
    const b = desktopCards[second]
    const overlaps =
      a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
    assert.equal(overlaps, false, `Le schede “${a.name}” e “${b.name}” si sovrappongono`)
  }
}

const draggedCard = page.locator('.concept-card').first()
const dragHandle = draggedCard.locator('.drag-handle')
const cardBeforeDrag = await draggedCard.boundingBox()
const handleBeforeDrag = await dragHandle.boundingBox()
assert.ok(cardBeforeDrag && handleBeforeDrag, 'Scheda o maniglia di spostamento non misurabile')

const grabPoint = {
  x: handleBeforeDrag.x + handleBeforeDrag.width / 2,
  y: handleBeforeDrag.y + handleBeforeDrag.height / 2,
}
await page.mouse.move(grabPoint.x, grabPoint.y)
await page.mouse.down()
const cardAfterGrab = await draggedCard.boundingBox()
assert.ok(cardAfterGrab, 'Scheda non misurabile dopo la presa')
assert.ok(
  Math.abs(cardAfterGrab.x - cardBeforeDrag.x) < 1 &&
    Math.abs(cardAfterGrab.y - cardBeforeDrag.y) < 1,
  'La scheda salta verso il cursore appena si afferra la maniglia',
)

const dragDelta = { x: 64, y: 48 }
await page.mouse.move(grabPoint.x + dragDelta.x, grabPoint.y + dragDelta.y)
const cardAfterMove = await draggedCard.boundingBox()
const handleAfterMove = await dragHandle.boundingBox()
await page.mouse.up()
assert.ok(cardAfterMove && handleAfterMove, 'Scheda o maniglia non misurabile dopo lo spostamento')
assert.ok(
  Math.abs(cardAfterMove.x - cardBeforeDrag.x - dragDelta.x) < 2 &&
    Math.abs(cardAfterMove.y - cardBeforeDrag.y - dragDelta.y) < 2,
  'La scheda non segue il movimento mantenendo il punto di presa',
)
assert.ok(
  Math.abs(handleAfterMove.x + handleAfterMove.width / 2 - (grabPoint.x + dragDelta.x)) < 2 &&
    Math.abs(handleAfterMove.y + handleAfterMove.height / 2 - (grabPoint.y + dragDelta.y)) < 2,
  'La maniglia non resta sotto il cursore durante lo spostamento',
)
await page.getByRole('button', { name: 'Reimposta vista' }).click()

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
await page.waitForTimeout(250)

const zoomedHandleBeforeDrag = await dragHandle.boundingBox()
assert.ok(zoomedHandleBeforeDrag, 'Maniglia non misurabile con zoom al 110%')
const zoomedGrabPoint = {
  x: zoomedHandleBeforeDrag.x + zoomedHandleBeforeDrag.width / 2,
  y: zoomedHandleBeforeDrag.y + zoomedHandleBeforeDrag.height / 2,
}
const zoomedDragDelta = { x: 36, y: 28 }
await page.mouse.move(zoomedGrabPoint.x, zoomedGrabPoint.y)
await page.mouse.down()
await page.mouse.move(
  zoomedGrabPoint.x + zoomedDragDelta.x,
  zoomedGrabPoint.y + zoomedDragDelta.y,
)
const zoomedHandleAfterMove = await dragHandle.boundingBox()
await page.mouse.up()
assert.ok(zoomedHandleAfterMove, 'Maniglia non misurabile dopo il trascinamento al 110%')
const zoomedHandleCenter = {
  x: zoomedHandleAfterMove.x + zoomedHandleAfterMove.width / 2,
  y: zoomedHandleAfterMove.y + zoomedHandleAfterMove.height / 2,
}
const zoomedPointerTarget = {
  x: zoomedGrabPoint.x + zoomedDragDelta.x,
  y: zoomedGrabPoint.y + zoomedDragDelta.y,
}
assert.ok(
  Math.abs(zoomedHandleCenter.x - zoomedPointerTarget.x) < 2 &&
    Math.abs(zoomedHandleCenter.y - zoomedPointerTarget.y) < 2,
  `La maniglia non resta sotto il cursore con la lavagna ingrandita: maniglia ${JSON.stringify(
    zoomedHandleCenter,
  )}, cursore ${JSON.stringify(zoomedPointerTarget)}`,
)
await page.getByRole('button', { name: 'Reimposta vista' }).click()
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

// A 1920 px window at 150% browser zoom exposes roughly a 1280 px CSS viewport.
const zoomedDesktop = await browser.newPage({ viewport: { width: 1280, height: 720 } })
await zoomedDesktop.goto(`${baseUrl}#/board`, { waitUntil: 'domcontentloaded' })
await assertBoardZonesSpanCanvas(zoomedDesktop)
assert.deepEqual(await zoomedDesktop.locator('.board-zone__heading small').allTextContents(), ['01', '02', '03'])
await zoomedDesktop.close()

const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } })
await mobile.goto(`${baseUrl}#/board`, { waitUntil: 'domcontentloaded' })
for (let step = 0; step < 4; step += 1) {
  await mobile.getByRole('button', { name: 'Aumenta zoom' }).click()
}
assert.equal(await mobile.locator('.zoom-controls output').textContent(), '140%')
const widths = await mobile.evaluate(() => ({
  viewport: window.innerWidth,
  document: document.documentElement.scrollWidth,
}))
assert.equal(widths.document, widths.viewport)

const mobileCards = await mobile.locator('.concept-card').evaluateAll((cards) =>
  cards.map((card) => {
    const rect = card.getBoundingClientRect()
    return { top: rect.top, bottom: rect.bottom }
  }),
)
for (let index = 1; index < mobileCards.length; index += 1) {
  assert.ok(
    mobileCards[index].top >= mobileCards[index - 1].bottom,
    `Le schede mobile ${index} e ${index + 1} si sovrappongono al 140%`,
  )
}

await mobile.close()
await page.evaluate(() => localStorage.clear())
await browser.close()

console.log(
  'Smoke test completato: board, trascinamento, legenda, zoom, coordinate da click, marker persistenti, embed e 375 px.',
)
