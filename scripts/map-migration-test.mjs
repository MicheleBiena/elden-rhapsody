import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const baseUrl = process.env.ELDEN_RHAPSODY_URL || 'http://localhost:4173/'
const legacyKey = 'elden-rhapsody:map-markers'
const currentKey = 'elden-rhapsody:map-markers-v2'
const stageId = 'sepolcride-penisola-del-pianto'
const legacyMarkers = [
  { id: 'center', title: 'Pin precedente', region: 'Sepolcride', coordinates: 'X 50.00% · Y 50.00%', note: 'Da conservare', x: 50, y: 50, mapUrl: 'https://mapgenie.io/elden-ring', createdAt: '2026-09-01T12:00:00.000Z' },
  { id: 'top', title: 'Angolo nord', region: 'Sepolcride', coordinates: 'X 0.00% · Y 0.00%', note: '', x: 0, y: 0, createdAt: '2026-09-01T12:00:00.000Z' },
  { id: 'bottom', title: 'Angolo sud', region: 'Sepolcride', coordinates: 'X 100.00% · Y 100.00%', note: '', x: 100, y: 100, createdAt: '2026-09-01T12:00:00.000Z' },
  { id: 'reference', title: 'Nota senza pin', region: 'Sepolcride', coordinates: 'Vicino al ponte', note: 'Riferimento testuale', createdAt: '2026-09-01T12:00:00.000Z' },
  { id: 'custom', title: 'Riferimento personalizzato', region: 'Sepolcride', coordinates: 'Ingresso delle rovine', note: '', x: 25, y: 80, createdAt: '2026-09-01T12:00:00.000Z' },
]

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
})

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`${baseUrl}#/map`, { waitUntil: 'domcontentloaded' })

  const alignment = await page.evaluate(async () => {
    async function loadMap(path) {
      const image = new Image()
      image.src = new URL(path, document.baseURI).href
      await image.decode()
      return image
    }
    const oldMap = await loadMap('./maps/sepolcride-01.webp')
    const newMap = await loadMap('./maps/sepolcride-penisola-del-pianto.jpg')
    const canvas = document.createElement('canvas')
    canvas.width = oldMap.naturalWidth
    canvas.height = oldMap.naturalHeight
    const context = canvas.getContext('2d', { willReadFrequently: true })
    context.drawImage(oldMap, 0, 0)
    const oldPixels = context.getImageData(0, 0, canvas.width, canvas.height).data
    context.drawImage(newMap, 0, 0)
    const newPixels = context.getImageData(0, 0, canvas.width, canvas.height).data
    let error = 0
    for (let i = 0; i < oldPixels.length; i += 4) {
      for (let channel = 0; channel < 3; channel++) error += Math.abs(oldPixels[i + channel] - newPixels[i + channel])
    }
    return {
      oldSize: [oldMap.naturalWidth, oldMap.naturalHeight],
      newSize: [newMap.naturalWidth, newMap.naturalHeight],
      meanError: error / (canvas.width * canvas.height * 3),
    }
  })
  assert.deepEqual(alignment.oldSize, [1080, 760])
  assert.deepEqual(alignment.newSize, [1080, 1509])
  assert.ok(alignment.meanError < 8, `Le mappe non coincidono in alto: ${JSON.stringify(alignment)}`)

  await page.evaluate(({ legacyKey, currentKey, legacyMarkers }) => {
    localStorage.setItem(legacyKey, JSON.stringify(legacyMarkers))
    localStorage.removeItem(currentKey)
  }, { legacyKey, currentKey, legacyMarkers })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { name: 'Pin precedente', exact: true }).waitFor()
  const readMarkers = () => page.evaluate(key => JSON.parse(localStorage.getItem(key)), currentKey)
  const migrated = await readMarkers()
  assert.equal(migrated.length, legacyMarkers.length)
  for (const [index, original] of legacyMarkers.entries()) {
    const marker = migrated[index]
    assert.equal(marker.mapStageId, stageId)
    for (const field of ['id', 'title', 'region', 'note', 'mapUrl', 'createdAt', 'x']) assert.equal(marker[field], original[field])
    if (original.y !== undefined) assert.ok(Math.abs(marker.y - original.y * 760 / 1509) < 1e-10)
  }
  assert.equal(migrated[0].coordinates, 'X 50.00% · Y 25.18%')
  assert.equal(migrated[3].coordinates, 'Vicino al ponte')
  assert.equal(migrated[4].coordinates, 'Ingresso delle rovine')
  assert.equal(await page.evaluate(key => localStorage.getItem(key), legacyKey), JSON.stringify(legacyMarkers))
  assert.equal(await page.locator('.map-annotation-pin:not(.is-draft)').count(), 4)

  const image = page.locator('.discovered-map__canvas img')
  await image.evaluate(image => image.decode())
  const canvas = page.locator('.discovered-map__canvas')
  const verifyPinPlacement = async () => {
    const placement = await canvas.evaluate(element => {
      // Read both rects in the same frame: fonts/viewport changes can move the page.
      const bounds = element.getBoundingClientRect()
      const pin = element.querySelector('.map-annotation-pin').getBoundingClientRect()
      return {
        dx: pin.x + pin.width / 2 - (bounds.x + bounds.width * .5),
        dy: pin.y + pin.height / 2 - (bounds.y + bounds.width / 1080 * 760 * .5),
        overflow: document.documentElement.scrollWidth > innerWidth,
      }
    })
    assert.ok(Math.abs(placement.dx) < 1 && Math.abs(placement.dy) < 1,
      `Pin fuori allineamento: ${JSON.stringify(placement)}`)
    assert.equal(placement.overflow, false)
  }
  await verifyPinPlacement()
  await page.screenshot({ path: 'artifacts/map-expanded-desktop.png', fullPage: true })

  for (const [width, height] of [[375, 812], [812, 375]]) {
    await page.setViewportSize({ width, height })
    await verifyPinPlacement()
  }
  await page.setViewportSize({ width: 375, height: 812 })
  await page.screenshot({ path: 'artifacts/map-expanded-mobile.png', fullPage: true })
  await canvas.scrollIntoViewIfNeeded()
  await canvas.click({ position: { x: (await canvas.boundingBox()).width * .6, y: (await canvas.boundingBox()).height * .85 } })
  const clickCoordinates = (await page.getByLabel('Coordinate / riferimento').inputValue()).match(/^X ([\d.]+)% · Y ([\d.]+)%$/)
  assert.ok(clickCoordinates)
  // Browser clicks round clientX/clientY to physical pixels on a narrow image.
  assert.ok(Math.abs(Number(clickCoordinates[1]) - 60) < .4)
  assert.ok(Math.abs(Number(clickCoordinates[2]) - 85) < .4)
  await page.getByLabel('Nome del punto').fill('Nuovo pin nella Penisola')
  await page.getByRole('button', { name: 'Salva il punto' }).click()
  const withNewMarker = await readMarkers()
  assert.equal(withNewMarker[0].mapStageId, stageId)
  assert.equal(withNewMarker[0].y, Number(clickCoordinates[2]))

  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { name: 'Nuovo pin nella Penisola', exact: true }).waitFor()
  assert.deepEqual(await readMarkers(), withNewMarker, 'La migrazione non deve ripetersi al ricaricamento')

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Esporta taccuino JSON' }).click(),
  ])
  const exported = JSON.parse(await readFile(await download.path(), 'utf8'))
  assert.equal(exported.schemaVersion, 2)
  assert.deepEqual(exported.mapStage, { id: stageId, width: 1080, height: 1509 })
  assert.deepEqual(exported.markers, withNewMarker)

  page.on('dialog', dialog => dialog.accept())
  while (await page.locator('.delete-marker').count()) await page.locator('.delete-marker').first().click()
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.getByText('Il taccuino è ancora vuoto.', { exact: true }).waitFor()
  assert.deepEqual(await readMarkers(), [], 'Non ripristinare pin eliminati dalla copia precedente')
  assert.equal(await page.evaluate(key => localStorage.getItem(key), legacyKey), JSON.stringify(legacyMarkers))
  assert.equal(await page.locator('.map-iframe').count(), 0)
  assert.deepEqual(errors, [])
  console.log('Map migration passed: top alignment, legacy backup, pins, text references, reload, mobile click, export and deletion.', alignment)
} finally {
  await browser.close()
}
