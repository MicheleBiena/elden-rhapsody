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
  assert.equal(await page.locator('#dossier-page-title').textContent(), 'Stregoneria')
  assert.equal(await page.locator('.dossier-note').count(), 18)
  assert.equal(await page.locator('.dossier-note.is-unread').count(), 8)
  assert.equal(await page.locator('#dossier-detail-title').textContent(), 'Accademia di Raya Lucaria')
  await page.getByRole('button', { name: 'Apri Iji', exact: true }).click()
  assert.doesNotMatch(await page.locator('.dossier-detail-meta').textContent(), /Nuova|Aggiornata/)
  assert.match(await page.locator('.dossier-detail').textContent(), /Maniero Cariano.*trappola incantata.*ultima principessa della Luna/is)
  assert.equal(await page.locator('.dossier-detail-scroll > .dossier-image-open img.concept-image').count(), 1)
  await page.locator('.dossier-detail-scroll > .dossier-image-open img.concept-image').evaluate(image => image.decode())
  assert.equal(await page.locator('.concept-dialog[open]').count(), 0)
  assert.doesNotMatch(await page.locator('body').innerText(), /una fortezza, due doveri|un castello in rivolta\. una lettera|Ogni legame, una scoperta|La trama nascosta/i)
  await page.locator('.dossier-note img').evaluateAll(images => images.forEach(image => { image.loading = 'eager' }))
  await page.locator('.dossier-note img').evaluateAll(images => Promise.all(images.map(image => image.decode())))
  await page.screenshot({ path: 'artifacts/dossiers-desktop.png', fullPage: true })

  const groupButtons = page.locator('.dossier-rail button')
  assert.equal(await groupButtons.count(), 13)
  await groupButtons.nth(6).click()
  await page.getByRole('button', { name: 'Apri Chanting Winged Dames', exact: true }).click()
  assert.equal(await page.locator('.dossier-text-section').count(), 2)
  assert.match(await page.locator('.dossier-text-section').nth(1).textContent(), /quella terra, un tempo benedetta/i)
  assert.equal(await page.locator('.dossier-external-links a').getAttribute('href'), 'https://www.youtube.com/watch?v=GnnvyQn9EPo')
  const allIds = new Set()
  for (let index = 0; index < 13; index++) {
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
  assert.equal(allIds.size, 112)

  await groupButtons.nth(0).click()
  await page.getByRole('button', { name: 'Apri Radahn', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /Signore d’Alabastro.*destriero.*marcescenza.*stelle/is)
  assert.ok(await page.locator('.live-update-highlight').count() > 0)
  await page.getByRole('button', { name: 'Apri Albero Madre', exact: true }).click()
  assert.deepEqual(await page.locator('.dossier-gallery figcaption').allTextContents(), [
    'Albero Madre Minore · produce resine magiche',
    'Arboscello · nasce dai Semi d’oro dopo lo Shattering',
  ])
  await page.locator('.dossier-gallery img').evaluateAll(images => Promise.all(images.map(image => image.decode())))

  await groupButtons.nth(2).click()
  assert.equal(await page.locator('.dossier-note').count(), 9)
  assert.equal(await page.locator('.dossier-note.is-unread').count(), 1)
  await page.getByRole('button', { name: 'Apri Patches', exact: true }).click()
  assert.doesNotMatch(await page.locator('.dossier-detail-meta').textContent(), /Nuova|Aggiornata/)
  assert.match(await page.locator('.dossier-detail').textContent(), /mercante.*ingann/is)
  await page.getByRole('button', { name: 'Apri Yura', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /Dita Sanguinanti/i)
  await page.getByRole('button', { name: 'Apri Kenneth Haight', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /occhi dorati/i)
  assert.equal(await page.locator('.dossier-detail-scroll > .dossier-image-open img.concept-image').evaluate(image => getComputedStyle(image).objectPosition), '50% 16%')
  await page.getByRole('button', { name: 'Apri Blaidd il Mezzolupo', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /ombra fedele di Ranni.*Maschera del Lupo Nero/is)
  assert.ok(await page.locator('.live-update-highlight').count() > 0)
  await page.screenshot({ path: 'artifacts/dossiers-new-notes.png', fullPage: true })

  await groupButtons.nth(3).click()
  assert.equal(await page.locator('.dossier-note').count(), 18)
  assert.equal(await page.locator('.dossier-note.is-unread').count(), 8)
  await page.getByRole('button', { name: 'Apri Accademia di Raya Lucaria', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /neutralità.*sigilli.*Chiave di scintipietra/is)
  assert.equal(await page.locator('.live-update-highlight').count(), 0)
  await page.getByRole('button', { name: 'Apri Maschere di scintipietra', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /Epitome dei Bisavi.*ogni genere.*Cometa di scintipietra.*Scoppio cristalliano/is)
  assert.match(await page.locator('.dossier-detail').textContent(), /Epitome di Lazuli.*luna.*stelle/is)
  assert.match(await page.locator('.dossier-detail').textContent(), /Olivinus.*Lusat.*meteore/is)
  assert.match(await page.locator('.dossier-detail').textContent(), /Karolos.*Azur.*comete/is)
  assert.equal(await page.locator('.dossier-gallery').count(), 6)
  await page.locator('.dossier-gallery img').evaluateAll(images => Promise.all(images.map(image => image.decode())))
  await page.getByRole('button', { name: 'Apri Ritratti di Raya Lucaria', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /quattro ritratti.*Karolos.*Olivinus.*Lazuli.*Bisavi/is)
  assert.equal(await page.locator('.dossier-gallery').count(), 1)
  await page.locator('.dossier-detail-scroll img').evaluateAll(images => Promise.all(images.map(image => image.decode())))
  assert.equal(await page.locator('.dossier-detail-scroll .image-open-button').count(), 2)
  const portraitLightboxTrigger = page.getByRole('button', { name: 'Ingrandisci: Figura femminile · stessa scintipietra della stregona incontrata', exact: true })
  await portraitLightboxTrigger.click()
  await page.locator('.image-lightbox[open]').waitFor()
  assert.equal(await page.locator('.image-lightbox__image').evaluate(image => image.naturalWidth), 1030)
  await page.locator('.image-lightbox__image').click()
  await page.locator('.image-lightbox').waitFor({ state: 'detached' })
  assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), await portraitLightboxTrigger.getAttribute('aria-label'))
  await page.getByRole('button', { name: 'Apri Rennala', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /uovo d’ambra.*reincarnazione.*imperfe/is)
  assert.match(await page.locator('.dossier-detail').textContent(), /Ranni.*spiritica.*pieno.*potenza/is)
  assert.equal(await page.locator('.dossier-text-section').count(), 3)
  await page.getByRole('button', { name: 'Apri Cavalieri cariani', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /scudo.*goccia.*magia.*sacro/is)
  await page.getByRole('button', { name: 'Apri Soldati Marionetta', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /creat[ei].*stregone.*Raya Lucaria.*cariana/is)
  await page.getByRole('button', { name: 'Apri Corrente Primeva', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /tradizione proibita.*semi di stelle.*ricerca scientifica/is)
  assert.equal(await page.locator('.dossier-gallery').count(), 1)
  await page.locator('.dossier-detail-scroll img').evaluateAll(images => Promise.all(images.map(image => image.decode())))
  await page.getByRole('button', { name: 'Apri Cristalliani', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /inorganici.*vivi.*Corrente Primeva.*ospiti venerati/is)
  await page.getByRole('button', { name: 'Apri Azur', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /oltre la sapienza della pietra.*più PA/is)
  await page.getByRole('button', { name: 'Apri Ranni, Principessa Lunare', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /Renna.*corpo fisico.*vecchia strega delle nevi.*Luna Nera/is)
  await page.getByRole('button', { name: 'Apri Guardia Reale Loretta', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /spirito.*cavallo.*stregonerie cariane.*arco/is)
  await page.getByRole('button', { name: 'Apri Seluvis', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /Ranni.*pozioni.*bambole/is)
  await page.screenshot({ path: 'artifacts/dossiers-magic-update.png', fullPage: true })

  await groupButtons.nth(4).click()
  assert.equal(await page.locator('.dossier-note').count(), 10)
  assert.equal(await page.locator('.dossier-note.is-unread').count(), 3)
  await page.getByRole('button', { name: 'Apri “Ragno-Mani”', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /mani mozzate.*dita.*trappole.*anelli/is)
  await page.getByRole('button', { name: 'Apri Hyetta', exact: true }).click()
  assert.equal(await page.locator('.dossier-gallery').count(), 2)
  assert.match(await page.locator('.dossier-detail').textContent(), /bulbo oculare.*luce lontana/is)
  await page.locator('.dossier-gallery img').evaluateAll(images => Promise.all(images.map(image => image.decode())))
  await page.getByRole('button', { name: 'Apri Thops', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /Barriera di Thops.*devia.*nuova Epitome/is)
  assert.ok(await page.locator('.live-update-highlight').count() > 0)
  await page.locator('.dossier-detail-scroll > .dossier-image-open img.concept-image').evaluate(image => image.decode())
  await page.getByRole('button', { name: 'Apri Rya', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /Lady Tanith.*Villa Vulcano.*medaglione/is)
  await page.getByRole('button', { name: 'Apri Mercante di gamberi', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /medaglione.*donna.*paese straniero/is)

  await groupButtons.nth(7).click()
  assert.equal(await page.locator('.dossier-note').count(), 8)
  assert.equal(await page.locator('.dossier-note.is-unread').count(), 5)
  await page.getByRole('button', { name: 'Apri Festival di Radahn', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /Jerren.*nove campioni.*Dune Gementi.*Nokron/is)
  assert.equal(await page.locator('.dossier-gallery').count(), 1)
  await page.locator('.dossier-detail-scroll img').evaluateAll(images => Promise.all(images.map(image => image.decode())))
  await page.getByRole('button', { name: 'Apri Jerren', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /morte.*guerriero.*Mantorosso/is)
  await page.getByRole('button', { name: 'Apri Alexander, Vaso Guerriero', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /incrina.*resti.*più forte/is)
  await page.getByRole('button', { name: 'Apri Palude di Aeonia', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /Malenia.*Radahn.*fioritura/is)

  await groupButtons.nth(8).click()
  assert.equal(await page.locator('.dossier-note').count(), 6)
  assert.equal(await page.locator('.dossier-note.is-unread').count(), 1)
  await page.getByRole('button', { name: 'Apri Soldato Draconico di Nokstella', exact: true }).click()
  assert.equal(await page.locator('.dossier-text-section').count(), 2)
  assert.match(await page.locator('.dossier-detail').textContent(), /quattro ali.*fulmini.*congelare/is)
  await page.getByRole('button', { name: 'Apri Bestia meteoritica non identificata', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /cranio umano.*occhio.*cielo stellato/is)
  await page.getByRole('button', { name: 'Apri Culto ancestrale', exact: true }).click()
  assert.match(await page.locator('.dossier-detail').textContent(), /scrittura.*metallurgia.*rinascita.*Spirito Ancestrale.*pire/is)
  await page.locator('.dossier-note img').evaluateAll(images => Promise.all(images.map(image => image.decode())))
  await page.screenshot({ path: 'artifacts/dossiers-siofra.png', fullPage: true })

  await groupButtons.nth(5).click()
  await page.waitForURL(/#\/board\/irina$/)
  for (const [id, position] of [['edgar-castellano', '50% 28%'], ['progenie', '100% 20%']]) {
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
  const savedPositions = await page.evaluate(() => localStorage.getItem('elden-rhapsody:dossier-positions-v2'))
  await page.reload({ waitUntil: 'domcontentloaded' })
  assert.equal(await page.evaluate(() => localStorage.getItem('elden-rhapsody:dossier-positions-v2')), savedPositions)
  await handle.focus()
  await page.keyboard.press('ArrowRight')
  assert.notEqual(await page.evaluate(() => localStorage.getItem('elden-rhapsody:dossier-positions-v2')), savedPositions)

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

  const liveNotes = [
    ['malenia-la-recisa', 'Aggiornata'],
    ['radahn', 'Aggiornata'],
    ['torri-divine', 'Aggiornata'],
    ['mezzolupo', 'Aggiornata'],
    ['maschere-scintipietra', 'Aggiornata'],
    ['cristalliani', 'Nuova'],
    ['azur', 'Nuova'],
    ['ranni-principessa-lunare', 'Aggiornata'],
    ['loretta', 'Nuova'],
    ['seluvis', 'Nuova'],
    ['radagon', 'Aggiornata'],
    ['guerra-civile-liurnia', 'Aggiornata'],
    ['ragno-mani', 'Nuova'],
    ['cacciatore-globi-cinerei', 'Nuova'],
    ['thops', 'Aggiornata'],
    ['dracotumulo', 'Nuova'],
    ['palude-aeonia', 'Aggiornata'],
    ['festival-radahn', 'Nuova'],
    ['jerren', 'Nuova'],
    ['alexander-vaso-guerriero', 'Aggiornata'],
    ['seguaci-ancestrali', 'Aggiornata'],
    ['tavola-rotonda', 'Aggiornata'],
    ['santa-trina', 'Aggiornata'],
    ['farum-azula-in-frantumi', 'Nuova'],
  ]
  await page.getByRole('button', { name: '24 da leggere', exact: true }).click()
  for (let index = 0; index < liveNotes.length; index++) {
    const [id, kind] = liveNotes[index]
    await page.waitForURL(new RegExp(`#/board/${id}$`))
    await page.waitForFunction(({ expected, total }) => document.querySelector('.dossier-stepper')?.textContent.includes(`Live ${expected} di ${total}`), { expected: index + 1, total: liveNotes.length })
    assert.match(await page.locator('.dossier-detail-meta').textContent(), new RegExp(kind))
    if (index < liveNotes.length - 1) await page.getByRole('button', { name: 'Appunto successivo', exact: true }).click()
  }
  await page.getByRole('button', { name: 'Esci dalla lettura live', exact: true }).click()
  await groupButtons.nth(0).click()
  await page.getByRole('button', { name: 'Apri Regina Marika l’Eterna', exact: true }).click()
  await page.waitForURL(/#\/board\/regina-marika$/)
  assert.equal(await page.locator('.live-update-highlight').count(), 0)
  assert.equal(await page.locator('.dossier-text-section.is-highlighted').count(), 0)
  assert.match(await page.locator('.dossier-text-section').allTextContents().then(items => items.join(' ')), /Privo ciascuno di voi della Grazia/)
  await page.getByRole('button', { name: 'Appunto successivo', exact: true }).click()
  await page.waitForFunction(() => document.querySelector('#dossier-detail-title').textContent === 'Notte dei Neri Coltelli')

  await page.getByRole('searchbox', { name: 'Cerca nell’archivio', exact: true }).fill('Sellen')
  await page.getByRole('button', { name: 'Apri Strega Sellen', exact: true }).click()
  await page.waitForURL(/#\/board\/sellen$/)
  await page.waitForFunction(() => document.querySelector('#dossier-page-title').textContent === 'Stregoneria')
  assert.equal(await page.locator('#dossier-page-title').textContent(), 'Stregoneria')
  assert.equal(await page.locator('.dossier-gallery figcaption').textContent(), 'Piedi')
  assert.match(await page.locator('.dossier-detail').textContent(), /seconda Sellen/i)
  assert.equal(await page.locator('.live-update-highlight').count(), 0)
  await page.getByRole('button', { name: 'Solo da leggere', exact: true }).click()
  assert.equal(await page.locator('.dossier-note').count(), 8)
  await page.getByRole('button', { name: 'Solo da leggere', exact: true }).click()
  assert.equal(await page.locator('.dossier-note').count(), 18)
  await page.getByRole('searchbox').fill('nessun-risultato-inesistente')
  assert.equal(await page.locator('.dossier-note').count(), 0)
  await page.getByRole('button', { name: 'Mostra il fascicolo', exact: true }).click()

  // A saved preference from the previous release must not restore the warm theme.
  await page.evaluate(() => localStorage.setItem('elden-rhapsody:dossier-theme', JSON.stringify('warm')))
  await page.reload({ waitUntil: 'domcontentloaded' })
  assert.equal(await page.getByRole('button', { name: /Sughero/i }).count(), 0)
  assert.equal(await page.locator('.dossier-page').evaluate(element => getComputedStyle(element).getPropertyValue('--dossier-board').trim()), '#292d27')
  await groupButtons.nth(5).click()

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
  await page.evaluate(() => localStorage.removeItem('elden-rhapsody:board-positions-v21'))
  await page.evaluate(() => localStorage.removeItem('elden-rhapsody:board-positions-v20'))
  await page.evaluate(() => localStorage.removeItem('elden-rhapsody:board-positions-v19'))
  await page.evaluate(() => localStorage.removeItem('elden-rhapsody:board-positions-v18'))
  await page.evaluate(() => localStorage.removeItem('elden-rhapsody:board-positions-v17'))
  await page.evaluate(() => localStorage.removeItem('elden-rhapsody:board-positions-v16'))
  await page.evaluate(() => localStorage.removeItem('elden-rhapsody:board-positions-v15'))
  await page.evaluate(() => localStorage.removeItem('elden-rhapsody:board-positions-v11'))
  await page.evaluate(() => localStorage.removeItem('elden-rhapsody:board-positions-v12'))
  await page.evaluate(() => localStorage.removeItem('elden-rhapsody:board-positions-v13'))
  await page.evaluate(() => localStorage.removeItem('elden-rhapsody:board-positions-v14'))
  await page.evaluate(() => localStorage.removeItem('elden-rhapsody:board-positions-v10'))
  await page.evaluate(() => localStorage.removeItem('elden-rhapsody:board-positions-v9'))
  await page.evaluate(() => localStorage.removeItem('elden-rhapsody:board-positions-v8'))
  await page.evaluate(() => localStorage.removeItem('elden-rhapsody:board-positions-v7'))
  await page.getByRole('button', { name: 'Lavagna completa', exact: true }).click()
  assert.equal(await page.locator('.concept-card').count(), 112)
  assert.equal(await page.evaluate(() => localStorage.getItem('elden-rhapsody:board-positions-v6')), oldPositions)
  await page.waitForFunction(() => Object.keys(JSON.parse(localStorage.getItem('elden-rhapsody:board-positions-v21') || '{}')).length === 112)
  const v10Positions = '{"elden-ring":{"x":22,"y":4.8},"godrick-innestato":{"x":40,"y":18}}'
  await page.evaluate(value => {
    localStorage.setItem('elden-rhapsody:board-positions-v10', value)
    localStorage.removeItem('elden-rhapsody:board-positions-v21')
    localStorage.removeItem('elden-rhapsody:board-positions-v20')
    localStorage.removeItem('elden-rhapsody:board-positions-v19')
    localStorage.removeItem('elden-rhapsody:board-positions-v18')
    localStorage.removeItem('elden-rhapsody:board-positions-v17')
    localStorage.removeItem('elden-rhapsody:board-positions-v16')
    localStorage.removeItem('elden-rhapsody:board-positions-v15')
    localStorage.removeItem('elden-rhapsody:board-positions-v11')
    localStorage.removeItem('elden-rhapsody:board-positions-v12')
    localStorage.removeItem('elden-rhapsody:board-positions-v13')
    localStorage.removeItem('elden-rhapsody:board-positions-v14')
  }, v10Positions)
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => Boolean(localStorage.getItem('elden-rhapsody:board-positions-v21')))
  const migrated = await page.evaluate(() => JSON.parse(localStorage.getItem('elden-rhapsody:board-positions-v21')))
  assert.ok(Math.abs(migrated['godrick-innestato'].y - 18 * 12000 / 29000) < .0001)
  assert.equal(migrated['godrick-innestato'].x, 40)
  assert.ok(Math.abs(migrated['nepheli-loux'].y - 97 * 12500 / 29000) < .0001)
  assert.equal(await page.evaluate(() => localStorage.getItem('elden-rhapsody:board-positions-v10')), v10Positions)
  await page.getByRole('button', { name: 'Chiudi il fascicolo', exact: true }).click()
  await page.getByRole('button', { name: 'Fascicoli', exact: true }).click()
  await page.setViewportSize({ width: 1440, height: 1080 })
  await page.evaluate(() => {
    localStorage.setItem('elden-rhapsody:dossier-group', JSON.stringify('ordine-spezzato'))
    localStorage.setItem('elden-rhapsody:dossier-positions-v1', JSON.stringify({
      'elden-ring': { x: 440, y: 358 },
      'regina-marika': { x: 440, y: 358 },
    }))
    localStorage.removeItem('elden-rhapsody:dossier-positions-v2')
  })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => localStorage.getItem('elden-rhapsody:dossier-positions-v2') !== null)
  assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('elden-rhapsody:dossier-positions-v2'))), {})
  const repairedCards = await page.locator('.dossier-note').evaluateAll(elements => elements.map(element => {
    const rect = element.getBoundingClientRect()
    return { id: element.dataset.conceptId, x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom }
  }))
  for (let a = 0; a < repairedCards.length; a++) for (let b = a + 1; b < repairedCards.length; b++) {
    assert.equal(repairedCards[a].x < repairedCards[b].right && repairedCards[a].right > repairedCards[b].x && repairedCards[a].y < repairedCards[b].bottom && repairedCards[a].bottom > repairedCards[b].y, false, `Migrated cards overlap: ${repairedCards[a].id}, ${repairedCards[b].id}`)
  }
  await page.goto(`${baseUrl}#/board/non-esiste`, { waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { name: 'Scheda non trovata', exact: true }).waitFor()
  await page.getByRole('button', { name: 'Torna al fascicolo', exact: true }).click()
  await page.waitForURL(/#\/board$/)
  assert.deepEqual(errors, [])
  console.log('Dossiers passed: 112 cards, 24 unread, including the Radahn Festival, Jerren, Carian Manor, overlap repair, dragging, keyboard, zoom, links, history, search, mobile and legacy migration.')
} finally {
  await browser.close()
}
