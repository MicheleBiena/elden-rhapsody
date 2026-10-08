import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

const baseUrl = process.env.ELDEN_RHAPSODY_URL || 'http://localhost:4173/'
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
})

const SLOT_STRIDE = 0x280010
const saveBuffer = Buffer.alloc(0x300 + SLOT_STRIDE * 2)
saveBuffer.write('BND4', 0, 'ascii')

function writeCharacter(slot, name, level, stats, withBuildItems = false) {
  const checksum = 0x300 + slot * SLOT_STRIDE
  const data = checksum + 0x10
  let gaitemOffset = data + 0x20
  const inventoryHandles = []
  if (withBuildItems) {
    const gaitems = [
      [0x80000001, 3180000], // Claymore
      [0x80000002, 50000000], // Freccia: deve essere esclusa dalle armi
      [0x80000003, 2000000], // Spada lunga: alternativa per la bozza
    ]
    for (const [handle, id] of gaitems) {
      saveBuffer.writeUInt32LE(handle, gaitemOffset)
      saveBuffer.writeUInt32LE(id, gaitemOffset + 4)
      gaitemOffset += 21
      inventoryHandles.push(handle)
    }
  }
  gaitemOffset += (5120 - inventoryHandles.length) * 8
  const playerData = gaitemOffset
  saveBuffer[checksum] = 1
  saveBuffer.writeUInt32LE(261, data)
  saveBuffer.write(name, playerData + 0x94, 32, 'utf16le')
  saveBuffer.writeUInt32LE(level, playerData + 0x60)
  saveBuffer.writeUInt32LE(12345, playerData + 0x64)
  saveBuffer.writeUInt32LE(700, playerData + 0x08)
  saveBuffer.writeUInt32LE(700, playerData + 0x0c)
  saveBuffer.writeUInt32LE(120, playerData + 0x14)
  saveBuffer.writeUInt32LE(120, playerData + 0x18)
  saveBuffer.writeUInt32LE(95, playerData + 0x24)
  saveBuffer.writeUInt32LE(95, playerData + 0x28)
  stats.forEach((value, index) => saveBuffer.writeUInt32LE(value, playerData + 0x34 + index * 4))

  if (withBuildItems) {
    saveBuffer.writeUInt32LE(0x80000001, playerData + 0x34c + 0x04)
    saveBuffer.writeUInt32LE(0x40000053, playerData + 0x31c)

    const inventory = playerData + 0x3a4
    const entries = [...inventoryHandles, 0xa0000438, 0xa0000474, 0xb00000bf, 0xb00000c0, 0xb0000fa0, 0xb0000fa1]
    saveBuffer.writeUInt32LE(entries.length, inventory)
    entries.forEach((handle, index) => {
      saveBuffer.writeUInt32LE(handle, inventory + 4 + index * 12)
      saveBuffer.writeUInt32LE(1, inventory + 8 + index * 12)
    })
  }
}

writeCharacter(0, 'Irydol', 32, [25, 14, 18, 20, 16, 9, 8, 7])
writeCharacter(1, 'Red', 77, [40, 18, 25, 30, 24, 12, 10, 9], true)

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
  await page.route('https://raw.githubusercontent.com/**', route => route.fulfill({
    status: 200,
    contentType: 'image/png',
    body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+XxXYAAAAAElFTkSuQmCC', 'base64'),
  }))
  const errors = []
  page.on('pageerror', error => errors.push(error.message))

  const savedMarkers = JSON.stringify([{ id: 'preserved-marker', title: 'Non cancellare' }])
  await page.addInitScript(value => localStorage.setItem('elden-rhapsody:map-markers-v2', value), savedMarkers)
  await page.goto(`${baseUrl}#/build`, { waitUntil: 'networkidle' })

  await page.getByRole('heading', { name: 'Build Lab', exact: true }).waitFor()
  assert.equal(await page.locator('input[type=file][accept*=".sl2"]').count(), 1)
  assert.match(await page.locator('.build-privacy').textContent(), /dati restano in questo browser/i)
  assert.match(await page.locator('.build-readonly-badge').textContent(), /sola lettura/i)

  await page.locator('input[type=file]').setInputFiles({
    name: 'note.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('non è un salvataggio'),
  })
  await page.getByRole('alert').waitFor()
  assert.match(await page.getByRole('alert').textContent(), /estensione \.sl2/i)

  await page.locator('input[type=file]').setInputFiles({
    name: 'ER0000.sl2',
    mimeType: 'application/octet-stream',
    buffer: saveBuffer,
  })
  await page.locator('.build-character-picker').waitFor()
  assert.match(await page.locator('.build-status').textContent(), /2 personaggi leggibili/)
  assert.deepEqual(await page.locator('.build-character-list strong').allTextContents(), ['Irydol', 'Red'])
  assert.equal(await page.getByRole('heading', { name: 'Irydol', exact: true }).count(), 1)

  await page.getByRole('button', { name: /Red/ }).click()
  await page.getByRole('heading', { name: 'Red', exact: true }).waitFor()
  assert.match(await page.locator('.build-character-header').textContent(), /Livello 77/)
  assert.deepEqual(await page.locator('.build-stats-grid dd').allTextContents(), ['40', '18', '25', '30', '24', '12', '10', '9'])
  assert.match(await page.locator('.build-memory').textContent(), /2\s*slot nella bozza/i)
  assert.equal(await page.locator('[data-equip-target^="spell-"]').count(), 2)
  assert.equal(await page.locator('.build-paper-doll').count(), 1)
  assert.equal(await page.locator('.build-paper-doll__silhouette svg').count(), 1)
  assert.equal(await page.locator('.build-equipped-group').count(), 0)
  const buildAnalysis = page.locator('.build-analysis')
  assert.match(await buildAnalysis.textContent(), /Tutto compatibile/i)
  assert.match(await buildAnalysis.textContent(), /9\.0\s*\/\s*72\.0/)
  assert.match(await buildAnalysis.textContent(), /Carico leggero/i)
  assert.match(await buildAnalysis.textContent(), /Affinità ottima/i)
  assert.match(await page.locator('.build-great-rune').textContent(), /Runa maggiore di Godrick/i)
  assert.match(await page.locator('.build-great-rune').textContent(), /potere non è attivo/i)
  assert.match(await page.locator('.build-great-rune').textContent(), /Rune attivate disponibili: Runa maggiore di Godrick, Runa maggiore di Radahn/i)
  const greatRuneOptions = page.locator('.build-great-rune__options')
  assert.equal(await greatRuneOptions.locator('.build-rune-choice').count(), 3)
  assert.equal(await greatRuneOptions.locator('.build-rune-info').count(), 2)
  const godrickRune = greatRuneOptions.getByRole('button', { name: 'Equipaggia Runa maggiore di Godrick', exact: true })
  const godrickRuneBox = await godrickRune.boundingBox()
  assert.ok(godrickRuneBox && Math.abs(godrickRuneBox.width - godrickRuneBox.height) <= 2)
  await greatRuneOptions.getByRole('button', { name: 'Apri la descrizione di Runa maggiore di Godrick', exact: true }).click()
  const godrickDialog = page.getByRole('dialog', { name: 'Runa maggiore di Godrick' })
  await godrickDialog.waitFor()
  assert.match(await godrickDialog.textContent(), /Aumenta tutti gli attributi/i)
  assert.match(await godrickDialog.textContent(), /stirpe aurea/i)
  assert.match(await godrickDialog.locator('img').getAttribute('src'), /godricks_great_rune\.png$/)
  await page.keyboard.press('Escape')
  await godrickDialog.waitFor({ state: 'hidden' })
  await greatRuneOptions.getByRole('button', { name: 'Equipaggia Runa maggiore di Radahn', exact: true }).click()
  assert.match(await page.locator('.build-great-rune > strong').textContent(), /Runa maggiore di Radahn/)
  assert.match(await page.locator('.build-great-rune').textContent(), /potere non attivo/i)
  await greatRuneOptions.getByRole('button', { name: 'Nessuna Runa Maggiore', exact: true }).click()
  assert.match(await page.locator('.build-great-rune > strong').textContent(), /Nessuna Runa Maggiore equipaggiata/i)
  await page.getByRole('button', { name: /Ripristina save/i }).click()
  assert.match(await page.locator('.build-great-rune > strong').textContent(), /Runa maggiore di Godrick/i)
  const categoryFilter = page.locator('.build-category-filter select')
  await categoryFilter.selectOption('weapons')
  assert.equal(await page.locator('.build-inventory-section').count(), 1)
  assert.match(await page.locator('.build-inventory-section summary').textContent(), /Armi/)
  await categoryFilter.selectOption('all')
  assert.equal(await page.locator('.build-inventory-section').count(), 4)
  const weapons = page.locator('.build-inventory-section').filter({ hasText: /^Armi/ })
  await weapons.locator('summary').click()
  assert.equal(await weapons.locator('li').count(), 2)
  assert.match(await weapons.textContent(), /Claymore/)
  assert.match(await weapons.textContent(), /Spada lunga/)
  assert.doesNotMatch(await weapons.textContent(), /Freccia/)
  assert.match(await weapons.locator('img').first().getAttribute('src'), /claymore\.png$/)
  assert.match(await weapons.textContent(), /Affinità ottima/i)
  const rightHandSlot = page.locator('[data-equip-target="rightHand-0"]')
  const leftHandSlot = page.locator('[data-equip-target="leftHand-0"]')
  const talismanSlot = page.locator('[data-equip-target="talisman-0"]')
  assert.match(await rightHandSlot.textContent(), /Claymore/)
  await page.setViewportSize({ width: 1440, height: 3000 })
  await weapons.getByRole('button', { name: 'Seleziona Spada lunga per equipaggiarlo' }).dragTo(rightHandSlot)
  assert.match(await rightHandSlot.textContent(), /Spada lunga/)
  await weapons.getByRole('button', { name: 'Seleziona Claymore per equipaggiarlo' }).dragTo(talismanSlot)
  assert.doesNotMatch(await talismanSlot.textContent(), /Claymore/)
  await weapons.getByRole('button', { name: 'Seleziona Claymore per equipaggiarlo' }).click()
  await talismanSlot.click()
  assert.match(await page.locator('.build-draft-status').textContent(), /non può essere inserito/i)
  await leftHandSlot.click()
  assert.match(await leftHandSlot.textContent(), /Claymore/)
  await page.getByRole('button', { name: /Ripristina save/i }).click()
  assert.match(await rightHandSlot.textContent(), /Claymore/)
  assert.doesNotMatch(await leftHandSlot.textContent(), /Claymore/)
  assert.equal(await rightHandSlot.getAttribute('draggable'), 'true')
  await rightHandSlot.dragTo(leftHandSlot, { sourcePosition: { x: 18, y: 56 }, targetPosition: { x: 30, y: 30 } })
  assert.match(await leftHandSlot.textContent(), /Claymore/)
  assert.match(await rightHandSlot.textContent(), /Slot vuoto/)
  await leftHandSlot.click()
  const removalActions = page.locator('.build-selection-actions')
  assert.match(await removalActions.textContent(), /Claymore/)
  await page.screenshot({ path: 'artifacts/build-lab-remove-action-desktop.png', fullPage: true })
  await removalActions.getByRole('button', { name: /Rimuovi dalla build/i }).click()
  assert.match(await leftHandSlot.textContent(), /Slot vuoto/)
  assert.match(await page.locator('.build-draft-status').textContent(), /rimosso dalla build/i)
  await page.getByRole('button', { name: /Ripristina save/i }).click()
  assert.match(await rightHandSlot.textContent(), /Claymore/)
  await weapons.getByRole('button', { name: 'Apri la descrizione di Claymore' }).click()
  const claymoreDialog = page.getByRole('dialog', { name: 'Claymore' })
  await claymoreDialog.waitFor()
  await claymoreDialog.getByText(/Spadone a lama lunga e dritta/).waitFor()
  assert.match(await claymoreDialog.textContent(), /Spadone a lama lunga e dritta/)
  assert.match(await claymoreDialog.locator('img').getAttribute('src'), /claymore\.png$/)
  await page.screenshot({ path: 'artifacts/build-lab-item-lore-desktop.png', fullPage: true })
  await page.keyboard.press('Escape')
  await claymoreDialog.waitFor({ state: 'hidden' })
  const talismans = page.locator('.build-inventory-section').filter({ hasText: /^Talismani/ })
  await talismans.locator('summary').click()
  await talismans.getByRole('button', { name: 'Seleziona Luna di Nokstella per equipaggiarlo' }).click()
  await talismanSlot.click()
  assert.match(await page.locator('.build-memory').textContent(), /4\s*slot nella bozza/i)
  assert.equal(await page.locator('[data-equip-target^="spell-"]').count(), 4)
  await page.getByText('Magie equipaggiabili', { exact: true }).click()
  const spells = page.locator('.build-inventory-section').filter({ hasText: /^Magie equipaggiabili/ })
  assert.match(await spells.textContent(), /Ciottolo di scintipietra/)
  assert.match(await spells.textContent(), /Scheggia di scintipietra maggiore/)
  assert.match(await spells.locator('img').first().getAttribute('src'), /glintstone_pebble\.png$/)
  const spellFilter = spells.locator('.build-section-filter select')
  assert.match(await spellFilter.locator('option').allTextContents().then((items) => items.join(' ')), /Stregonerie.*Scintipietra/)
  await spellFilter.selectOption('glintstone')
  assert.equal(await spells.locator('li').count(), 2)
  await spellFilter.selectOption('all')
  const firstSpellSlot = page.locator('[data-equip-target="spell-0"]')
  const secondSpellSlot = page.locator('[data-equip-target="spell-1"]')
  const pebble = spells.getByRole('button', { name: 'Seleziona Ciottolo di scintipietra per equipaggiarlo' })
  const greatShard = spells.getByRole('button', { name: 'Seleziona Scheggia di scintipietra maggiore per equipaggiarlo' })
  assert.equal(await pebble.getAttribute('draggable'), 'true')
  await page.setViewportSize({ width: 1440, height: 3000 })
  await pebble.dragTo(firstSpellSlot)
  assert.match(await firstSpellSlot.textContent(), /Ciottolo di scintipietra/)
  const firstSpellBox = await firstSpellSlot.boundingBox()
  assert.ok(firstSpellBox && Math.abs(firstSpellBox.width - firstSpellBox.height) <= 2)
  const equippedSpellInfo = firstSpellSlot.locator('..').getByRole('button', { name: 'Apri la descrizione di Ciottolo di scintipietra' })
  assert.equal(await equippedSpellInfo.count(), 1)
  await equippedSpellInfo.click()
  const equippedSpellDialog = page.getByRole('dialog', { name: 'Ciottolo di scintipietra' })
  await equippedSpellDialog.waitFor()
  assert.match(await equippedSpellDialog.textContent(), /Stregoneria scintipietra da apprendista/)
  await page.keyboard.press('Escape')
  await equippedSpellDialog.waitFor({ state: 'hidden' })
  await weapons.getByRole('button', { name: 'Seleziona Claymore per equipaggiarlo' }).dragTo(secondSpellSlot)
  assert.doesNotMatch(await secondSpellSlot.textContent(), /Claymore/)
  await greatRuneOptions.getByRole('button', { name: 'Equipaggia Runa maggiore di Radahn', exact: true }).click()
  await greatShard.click()
  await secondSpellSlot.click()
  assert.match(await secondSpellSlot.textContent(), /Scheggia di scintipietra maggiore/)
  assert.match(await buildAnalysis.textContent(), /1 incompatibilità/i)
  assert.match(await buildAnalysis.textContent(), /INT 12\/16/i)
  assert.match(await buildAnalysis.textContent(), /4 livelli · 147\.595 rune totali/i)
  await buildAnalysis.getByRole('button', { name: 'Valutazione esaustiva' }).click()
  const assessment = page.locator('#build-exhaustive-assessment')
  await assessment.waitFor()
  assert.match(await assessment.textContent(), /Punti di forza/i)
  assert.match(await assessment.textContent(), /Punti deboli/i)
  assert.match(await assessment.textContent(), /Statistiche da far crescere/i)
  assert.match(await assessment.textContent(), /INT 12 → 16/i)
  assert.match(await assessment.textContent(), /135\.250 da farmare/i)
  assert.match(await assessment.textContent(), /livello 77 → 81/i)
  await godrickRune.click()
  assert.match(await buildAnalysis.textContent(), /1 compatibilità condizionata/i)
  assert.match(await buildAnalysis.textContent(), /Solo con Runa di Godrick attiva/i)
  assert.match(await buildAnalysis.textContent(), /Quando l’effetto termina, tornano non soddisfatti/i)
  assert.match(await spells.textContent(), /Con Runa attiva/i)
  assert.doesNotMatch(await buildAnalysis.textContent(), /135\.250 da farmare/i)
  assert.match(await assessment.textContent(), /Nessun livello obbligatorio con Godrick/i)
  const thirdSpellSlot = page.locator('[data-equip-target="spell-2"]')
  await secondSpellSlot.dragTo(thirdSpellSlot, { sourcePosition: { x: 18, y: 56 }, targetPosition: { x: 30, y: 30 } })
  assert.match(await thirdSpellSlot.textContent(), /Scheggia di scintipietra maggiore/)
  await talismanSlot.click()
  await page.locator('.build-selection-actions').getByRole('button', { name: /Rimuovi dalla build/i }).click()
  assert.equal(await page.locator('[data-equip-target^="spell-"]').count(), 2)
  assert.match(await page.locator('.build-draft-status').textContent(), /1 magia rimossa/i)
  assert.equal(await page.locator('.build-equipped-pill').count(), 0)
  await page.getByRole('button', { name: /Ripristina save/i }).click()
  assert.equal(await page.locator('[data-equip-target^="spell-"]').count(), 2)
  assert.match(await firstSpellSlot.textContent(), /Slot vuoto/)
  assert.match(await secondSpellSlot.textContent(), /Slot vuoto/)
  await talismans.getByRole('button', { name: "Seleziona Cimelio dell'astrologa per equipaggiarlo" }).click()
  await talismanSlot.click()
  await greatShard.click()
  await firstSpellSlot.click()
  assert.match(await buildAnalysis.textContent(), /Compatibile con bonus/i)
  assert.match(await buildAnalysis.textContent(), /Cimelio dell'astrologa: INT \+5/i)
  assert.match(await spells.textContent(), /Con talismano/i)
  assert.doesNotMatch(await buildAnalysis.textContent(), /Serve attivare la Runa di Godrick/i)
  await page.getByRole('button', { name: /Ripristina save/i }).click()
  await page.setViewportSize({ width: 1440, height: 1000 })
  assert.equal(await page.evaluate(() => localStorage.getItem('elden-rhapsody:map-markers-v2')), savedMarkers)
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  await page.screenshot({ path: 'artifacts/build-lab-desktop.png', fullPage: true })

  await greatRuneOptions.getByRole('button', { name: 'Equipaggia Runa maggiore di Radahn', exact: true }).click()
  await rightHandSlot.dragTo(leftHandSlot, { sourcePosition: { x: 18, y: 56 }, targetPosition: { x: 30, y: 30 } })
  await page.goto(`${baseUrl}#/board`, { waitUntil: 'networkidle' })
  await page.locator('#dossier-page-title').waitFor()
  await page.goto(`${baseUrl}#/build`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: 'Red', exact: true }).waitFor()
  assert.match(await page.locator('.build-dropzone').textContent(), /ER0000\.sl2/)
  assert.match(await page.locator('[data-equip-target="leftHand-0"]').textContent(), /Claymore/)
  assert.match(await page.locator('.build-great-rune > strong').textContent(), /Runa maggiore di Radahn/)
  await page.reload({ waitUntil: 'networkidle' })
  assert.equal(await page.locator('.build-character-picker').count(), 0)
  assert.match(await page.locator('.build-dropzone').textContent(), /Scegli o trascina il file/i)

  await page.goto(`${baseUrl}#/map`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: 'Build Lab', exact: true }).waitFor()
  assert.equal(await page.locator('a[href="#/build"]').getAttribute('aria-current'), 'page')

  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto(`${baseUrl}#/build`, { waitUntil: 'networkidle' })
  await page.locator('input[type=file]').setInputFiles({
    name: 'ER0000.sl2',
    mimeType: 'application/octet-stream',
    buffer: saveBuffer,
  })
  await page.getByRole('button', { name: /Red/ }).click()
  assert.equal(await page.locator('.build-paper-doll').count(), 1)
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  await page.screenshot({ path: 'artifacts/build-lab-paper-doll-mobile.png', fullPage: true })
  await page.getByText('Magie equipaggiabili', { exact: true }).click()
  const mobileSpells = page.locator('.build-inventory-section').filter({ hasText: /^Magie equipaggiabili/ })
  await mobileSpells.getByRole('button', { name: 'Apri la descrizione di Ciottolo di scintipietra' }).click()
  const spellDialog = page.getByRole('dialog', { name: 'Ciottolo di scintipietra' })
  await spellDialog.waitFor()
  await spellDialog.getByText(/Stregoneria scintipietra da apprendista/).waitFor()
  assert.match(await spellDialog.textContent(), /Stregoneria scintipietra da apprendista/)
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  assert.equal(await page.evaluate(() => localStorage.getItem('elden-rhapsody:map-markers-v2')), savedMarkers)
  await page.screenshot({ path: 'artifacts/build-lab-item-lore-mobile.png', fullPage: true })
  await page.keyboard.press('Escape')
  await spellDialog.waitFor({ state: 'hidden' })
  await mobileSpells.getByRole('button', { name: 'Seleziona Scheggia di scintipietra maggiore per equipaggiarlo' }).click()
  await page.locator('[data-equip-target="spell-0"]').click()
  await page.locator('.build-analysis').getByRole('button', { name: 'Valutazione esaustiva' }).click()
  await page.locator('#build-exhaustive-assessment').waitFor()
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  await page.screenshot({ path: 'artifacts/build-lab-assessment-mobile.png', fullPage: true })
  await page.setViewportSize({ width: 812, height: 375 })
  assert.equal(await page.locator('[data-equip-target^="spell-"]').count(), 2)
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))

  assert.deepEqual(errors, [])
  console.log('Build Lab passed: valutazione esaustiva, costo rune, filtri, Rune Maggiori illustrate, requisiti, carico, scaling, persistenza di sessione, drag/click, info e layout responsive.')
} finally {
  await browser.close()
}
