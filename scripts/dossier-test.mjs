import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

const baseUrl = process.env.ELDEN_RHAPSODY_URL || 'http://localhost:4173/'
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 }, reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`${baseUrl}#/board`, { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => document.fonts.ready)
  assert.equal(await page.locator('#dossier-page-title').textContent(), 'Ordine spezzato')
  assert.equal(await page.locator('.dossier-note').count(), 12)
  assert.equal(await page.locator('.dossier-note.is-unread').count(), 6)
  assert.equal(await page.locator('#dossier-detail-title').textContent(), 'Elden Ring')
  assert.match(await page.locator('.dossier-detail-meta').textContent(), /Già letta/)
  assert.equal(await page.locator('.live-update-highlight').count(), 0)
  assert.equal(await page.locator('.concept-dialog[open]').count(), 0)
  assert.doesNotMatch(await page.locator('body').innerText(), /una fortezza, due doveri|un castello in rivolta\. una lettera|Ogni legame, una scoperta|La trama nascosta/i)
  await page.locator('.dossier-note img').evaluateAll(images => images.forEach(image => { image.loading = 'eager' }))
  await page.locator('.dossier-note img').evaluateAll(images => Promise.all(images.map(image => image.decode())))
  await page.screenshot({ path: 'artifacts/dossiers-desktop.png', fullPage: true })

  const groupButtons = page.locator('.dossier-rail button')
  assert.equal(await groupButtons.count(), 9)
  await groupButtons.nth(5).click()
  await page.getByRole('button', { name: 'Apri Chanting Winged Dames', exact: true }).click()
  assert.equal(await page.locator('.dossier-text-section').count(), 2)
  assert.match(await page.locator('.dossier-text-section').nth(1).textContent(), /quella terra, un tempo benedetta/i)
  assert.equal(await page.locator('.dossier-external-links a').getAttribute('href'), 'https://www.youtube.com/watch?v=GnnvyQn9EPo')
  const allIds = new Set()
  for (let index = 0; index < 9; index++) {
    await groupButtons.nth(index).click()
    await page.waitForFunction(index => document.querySelectorAll('.dossier-rail button')[index]?.getAttribute('aria-current') === 'true', index)
    const cards = await page.locator('.dossier-note').evaluateAll(elements => elements.map(element => {
      const rect = element.getBoundingClientRect()
      return { id: element.dataset.conceptId, x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom }
    }))
    cards.forEach(card => { assert.ok(!allIds.has(card.id), `Duplicate group assignment: ${card.id}`); allIds.add(card.id) })
    for (let a = 0; a < cards.length; a++) for (let b = a + 1; b < cards.length; b++) {
      assert.equal(cards[a].x < cards[b].right && cards[a].right > cards[b].x && cards[a].y < cards[b].bottom && cards[a].bottom > cards[b].y, false, `Cards overlap: ${cards[a].id}, ${cards[b].id}`)
    }
  }
  assert.equal(allIds.size, 58)

  await groupButtons.nth(0).click()
  await page.getByRole('button', { name: 'Apri Albero Madre', exact: true }).click()
  assert.deepEqual(await page.locator('.dossier-gallery figcaption').allTextContents(), [
    'Albero Madre Minore · produce resine magiche',
    'Arboscello · nasce dai Semi d’oro dopo lo Shattering',
  ])
  await page.locator('.dossier-gallery img').evaluateAll(images => Promise.all(images.map(image => image.decode())))

  await groupButtons.nth(2).click()
  assert.equal(await page.locator('.dossier-note').count(), 7)
  assert.equal(await page.locator('.dossier-note.is-unread').count(), 4)
  await page.getByRole('button', { name: 'Apri Kenneth Haight', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /occhi dorati/i)
  assert.equal(await page.locator('.dossier-detail-scroll > img.concept-image').evaluate(image => getComputedStyle(image).objectPosition), '50% 16%')
  await page.screenshot({ path: 'artifacts/dossiers-new-notes.png', fullPage: true })

  await groupButtons.nth(4).click()
  await page.waitForURL(/#\/board\/irina$/)
  for (const [id, position] of [['edgar-castellano', '50% 10%'], ['progenie', '100% 20%']]) {
    assert.equal(await page.locator(`[data-concept-id="${id}"] img`).evaluate(image => getComputedStyle(image).objectPosition), position)
  }
  const card = page.locator('[data-concept-id="irina"]')
  const handle = card.locator('.dossier-drag')
  await handle.scrollIntoViewIfNeeded()
  const before = await card.boundingBox()
  const grip = await handle.boundingBox()
  await page.mouse.move(grip.x + grip.width / 2, grip.y + grip.height / 2)
  await page.mouse.down()
  const grabbed = await card.boundingBox()
  assert.ok(Math.abs(grabbed.x - before.x) < 1 && Math.abs(grabbed.y - before.y) < 1, 'Card jumps on grab')
  await page.mouse.move(grip.x + grip.width / 2 + 42, grip.y + grip.height / 2 + 32)
  await page.mouse.up()
  const moved = await card.boundingBox()
  assert.ok(Math.abs(moved.x - before.x - 42) < 2 && Math.abs(moved.y - before.y - 32) < 2, 'Card does not preserve grab offset')
  const savedPositions = await page.evaluate(() => localStorage.getItem('elden-rhapsody:dossier-positions-v1'))
  await page.reload({ waitUntil: 'domcontentloaded' })
  assert.equal(await page.evaluate(() => localStorage.getItem('elden-rhapsody:dossier-positions-v1')), savedPositions)
  await handle.focus()
  await page.keyboard.press('ArrowRight')
  assert.notEqual(await page.evaluate(() => localStorage.getItem('elden-rhapsody:dossier-positions-v1')), savedPositions)

  const previousZoom = await page.locator('.dossier-zoom output').textContent()
  await page.getByRole('button', { name: 'Aumenta zoom', exact: true }).click()
  assert.notEqual(await page.locator('.dossier-zoom output').textContent(), previousZoom)
  await page.getByRole('button', { name: 'Inquadra', exact: true }).click()
  const focusedCount = await page.locator('.dossier-wires path').count()
  await page.getByRole('button', { name: 'Fili della selezione', exact: true }).click()
  assert.ok(await page.locator('.dossier-wires path').count() > focusedCount)

  await page.getByRole('button', { name: 'Apri Progenie', exact: true }).click()
  await page.waitForURL(/#\/board\/progenie$/)
  await page.locator('.dossier-relations button').filter({ hasText: 'Maestro Fabbro Hewg' }).click()
  await page.waitForURL(/#\/board\/hewg$/)
  await page.waitForFunction(() => document.querySelector('#dossier-page-title').textContent === 'Tavola Rotonda')
  await page.goBack()
  await page.waitForFunction(() => document.querySelector('#dossier-page-title').textContent === 'Castel Morne')
  assert.equal(await page.locator('#dossier-detail-title').textContent(), 'Progenie')

  await page.getByRole('button', { name: '13 da leggere', exact: true }).click()
  await page.waitForURL(/#\/board\/regina-marika$/)
  assert.match(await page.locator('.dossier-stepper').textContent(), /Live 1 di 13/)
  assert.equal(await page.locator('.live-update-highlight').count(), 2)
  assert.match(await page.locator('.live-update-highlight').first().textContent(), /Aggiunto ora.*Terza Chiesa/i)
  assert.equal(await page.locator('.dossier-text-section.is-highlighted').count(), 1)
  assert.match(await page.locator('.dossier-text-section.is-highlighted').textContent(), /Aggiunto ora.*Privo ciascuno di voi della Grazia/is)
  await page.screenshot({ path: 'artifacts/dossiers-highlight.png', fullPage: true })
  for (let index = 0; index < 12; index++) {
    await page.getByRole('button', { name: 'Appunto successivo', exact: true }).click()
    await page.waitForFunction(step => document.querySelector('.dossier-stepper').textContent.includes(`Live ${step} di 13`), index + 2)
  }
  assert.equal(await page.locator('#dossier-detail-title').textContent(), 'Lord del Sangue')
  assert.equal(await page.getByRole('button', { name: 'Appunto successivo', exact: true }).isDisabled(), true)
  assert.equal(await page.locator('.dossier-note.is-unread').count(), 1)

  await page.getByRole('searchbox', { name: 'Cerca nell’archivio', exact: true }).fill('Sellen')
  await page.getByRole('button', { name: 'Apri Strega Sellen', exact: true }).click()
  await page.waitForURL(/#\/board\/sellen$/)
  await page.waitForFunction(() => document.querySelector('#dossier-page-title').textContent === 'Stregoneria')
  assert.equal(await page.locator('#dossier-page-title').textContent(), 'Stregoneria')
  assert.equal(await page.locator('.dossier-gallery figcaption').textContent(), 'Piedi')
  assert.match(await page.locator('.dossier-detail').textContent(), /seconda Sellen/i)
  assert.equal(await page.locator('.live-update-highlight').count(), 0)
  await page.getByRole('button', { name: 'Solo da leggere', exact: true }).click()
  assert.equal(await page.locator('.dossier-note').count(), 0)
  await page.getByRole('button', { name: 'Solo da leggere', exact: true }).click()
  assert.equal(await page.locator('.dossier-note').count(), 3)
  await page.getByRole('searchbox').fill('nessun-risultato-inesistente')
  assert.equal(await page.locator('.dossier-note').count(), 0)
  await page.getByRole('button', { name: 'Mostra il fascicolo', exact: true }).click()

  // A saved preference from the previous release must not restore the warm theme.
  await page.evaluate(() => localStorage.setItem('elden-rhapsody:dossier-theme', JSON.stringify('warm')))
  await page.reload({ waitUntil: 'domcontentloaded' })
  assert.equal(await page.getByRole('button', { name: /Sughero/i }).count(), 0)
  assert.equal(await page.locator('.dossier-page').evaluate(element => getComputedStyle(element).getPropertyValue('--dossier-board').trim()), '#292d27')
  await groupButtons.nth(4).click()

  for (const [width, height] of [[375, 812], [812, 375], [1024, 768], [1280, 720]]) {
    await page.setViewportSize({ width, height })
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${width}`)
  }
  await page.setViewportSize({ width: 375, height: 812 })
  await page.getByRole('button', { name: 'Apri Progenie', exact: true }).click()
  await page.waitForURL(/#\/board\/progenie$/)
  await page.waitForFunction(() => document.querySelector('#dossier-detail-title').textContent === 'Progenie')
  assert.equal(await page.locator('#dossier-detail-title').textContent(), 'Progenie')
  assert.equal(await page.locator('.dossier-drag').first().isVisible(), false)
  await page.getByRole('button', { name: 'Torna agli appunti', exact: true }).click()
  assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'Apri Progenie')
  await page.screenshot({ path: 'artifacts/dossiers-mobile.png', fullPage: true })

  const oldPositions = '{"elden-ring":{"x":22,"y":4.8}}'
  await page.evaluate(value => localStorage.setItem('elden-rhapsody:board-positions-v6', value), oldPositions)
  await page.evaluate(() => localStorage.removeItem('elden-rhapsody:board-positions-v8'))
  await page.evaluate(() => localStorage.removeItem('elden-rhapsody:board-positions-v7'))
  await page.getByRole('button', { name: 'Lavagna completa', exact: true }).click()
  assert.equal(await page.locator('.concept-card').count(), 58)
  assert.equal(await page.evaluate(() => localStorage.getItem('elden-rhapsody:board-positions-v6')), oldPositions)
  await page.waitForFunction(() => Object.keys(JSON.parse(localStorage.getItem('elden-rhapsody:board-positions-v8') || '{}')).length === 58)
  await page.getByRole('button', { name: 'Chiudi il fascicolo', exact: true }).click()
  await page.getByRole('button', { name: 'Fascicoli', exact: true }).click()
  await page.goto(`${baseUrl}#/board/non-esiste`, { waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { name: 'Scheda non trovata', exact: true }).waitFor()
  await page.getByRole('button', { name: 'Torna al fascicolo', exact: true }).click()
  await page.waitForURL(/#\/board$/)
  assert.deepEqual(errors, [])
  console.log('Dossiers passed: all 58 cards, groups, song text and link, dragging, persistence, keyboard, zoom, threads, cross-group links, history, thirteen-item live queue, highlights, search, fixed cool theme, mobile, legacy layout and invalid links.')
} finally {
  await browser.close()
}
