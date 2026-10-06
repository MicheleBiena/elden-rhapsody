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

function writeCharacter(slot, name, level, stats) {
  const checksum = 0x300 + slot * SLOT_STRIDE
  const data = checksum + 0x10
  const playerData = data + 0x20 + 5120 * 8
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
}

writeCharacter(0, 'Irydol', 32, [25, 14, 18, 20, 16, 9, 8, 7])
writeCharacter(1, 'Red', 77, [40, 18, 25, 30, 24, 12, 10, 9])

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
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
  assert.match(await page.locator('.build-memory').textContent(), /2\s*slot attuali/i)
  assert.match(await page.locator('.build-great-rune').textContent(), /Nessuna Runa Maggiore equipaggiata/i)
  assert.equal(await page.evaluate(() => localStorage.getItem('elden-rhapsody:map-markers-v2')), savedMarkers)
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  await page.screenshot({ path: 'artifacts/build-lab-desktop.png', fullPage: true })

  await page.goto(`${baseUrl}#/map`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: 'Build Lab', exact: true }).waitFor()
  assert.equal(await page.locator('a[href="#/build"]').getAttribute('aria-current'), 'page')

  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto(`${baseUrl}#/build`, { waitUntil: 'networkidle' })
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  assert.equal(await page.evaluate(() => localStorage.getItem('elden-rhapsody:map-markers-v2')), savedMarkers)
  await page.screenshot({ path: 'artifacts/build-lab-mobile.png', fullPage: true })

  assert.deepEqual(errors, [])
  console.log('Build Lab passed: upload locale, selezione personaggio, lettura dati, alias mappa e layout responsive.')
} finally {
  await browser.close()
}
