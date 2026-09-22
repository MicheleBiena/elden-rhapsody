import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
import { createServer } from 'vite'

const baseUrl = process.env.ELDEN_RHAPSODY_URL || 'http://localhost:4173/'
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true })
let fixtureServer
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 }, reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`${baseUrl}#/questbook`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  assert.equal(await page.getByRole('heading', { name: 'Questbook', exact: true }).count(), 1)
  assert.equal(await page.locator('a[href="#/questbook"].nav-tab').getAttribute('aria-current'), 'page')
  assert.equal(await page.getByRole('heading', { name: 'Il diario è ancora vuoto' }).count(), 1)
  assert.equal(await page.locator('.quest-index-link').count(), 0, 'No invented quests may ship')
  assert.equal(await page.getByRole('searchbox', { name: 'Cerca una quest' }).isDisabled(), true)
  const proportion = await page.locator('.quest-book').evaluate(book => {
    const index = book.querySelector('.quest-index').getBoundingClientRect()
    const detail = book.querySelector('.quest-page').getBoundingClientRect()
    return detail.width / index.width
  })
  assert.ok(proportion >= 1.9 && proportion <= 2.3)
  await page.screenshot({ path: 'artifacts/questbook-desktop.png', fullPage: true })

  for (const [width, height] of [[320, 700], [375, 812], [812, 375], [768, 1024], [861, 768], [1024, 768], [1181, 820], [1280, 720]]) {
    await page.setViewportSize({ width, height })
    const outside = await page.locator('.nav-tab, .quest-bookmarks button, .quest-book').evaluateAll(elements => elements.filter(element => {
      const rect = element.getBoundingClientRect()
      return rect.left < -1 || rect.right > innerWidth + 1
    }).map(element => element.textContent))
    assert.deepEqual(outside, [], `Clipped navigation or journal at ${width}`)
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  }
  await page.setViewportSize({ width: 375, height: 812 })
  await page.screenshot({ path: 'artifacts/questbook-mobile.png', fullPage: true })
  await page.goto(`${baseUrl}#/questbook/non-esiste`)
  await page.getByRole('heading', { name: 'Quest non trovata' }).waitFor()
  await page.getByRole('link', { name: 'Torna all’indice' }).click()
  await page.getByRole('heading', { name: 'Il diario è ancora vuoto' }).waitFor()
  await page.locator('a.nav-tab[href="#/map"]').click()
  await page.locator('.map-layout').waitFor()
  await page.locator('a.nav-tab[href="#/board"]').click()
  assert.equal(await page.getByRole('button', { name: '0 da leggere', exact: true }).isDisabled(), true)
  assert.deepEqual(errors, [])
  await page.close()

  // Technical fixtures exist only in this isolated browser response. The actual
  // quests.ts and production bundle remain empty; no story is inferred or shipped.
  fixtureServer = await createServer({ server: { host: '127.0.0.1', port: 4187, strictPort: true }, logLevel: 'error' })
  await fixtureServer.listen()
  const fixturePage = await browser.newPage({ viewport: { width: 1440, height: 1080 }, reducedMotion: 'reduce' })
  fixturePage.on('pageerror', error => errors.push(error.message))
  const fixtures = [
    {
      id: 'test-a', title: 'Voce di prova A', npc: 'Personaggio di prova', region: 'Regione di prova', status: 'in-corso',
      summary: 'Test di impaginazione e navigazione. Questo contenuto non viene pubblicato.',
      portrait: { imageUrl: './elden-ring.webp', imageAlt: 'Immagine di prova', imagePosition: '50% 20%' },
      lastSeen: { location: 'Luogo già visitato', note: 'Posizione osservata durante il test.' },
      destination: { location: 'Destinazione indicata', note: 'Indicazione da tenere distinta dalla posizione attuale.' },
      steps: [{ title: 'Tappa di prova', text: 'Una tappa registrata nel diario.' }],
      nextStep: { text: 'Possibile azione da verificare.', hypothetical: true },
      gallery: [{ imageUrl: './elden-ring.webp', imageAlt: 'Seconda immagine di prova', caption: 'Didascalia di prova' }],
      linkedConceptIds: ['elden-ring'],
    },
    { id: 'test-b', title: 'Voce di prova B', npc: 'Altro personaggio', region: 'Città di prova', status: 'pista', summary: 'Test di una pista ancora incerta.', steps: [] },
    { id: 'test-c', title: 'Voce di prova C', npc: 'Personaggio concluso', region: 'Regione di prova', status: 'conclusa', summary: 'Test di una voce archiviata.', steps: [{ title: 'Tappa finale', text: 'Conclusione annotata.' }] },
  ]
  await fixturePage.route('**/src/data/quests.ts*', route => route.fulfill({ contentType: 'application/javascript', body: `export const quests = ${JSON.stringify(fixtures)}` }))
  await fixturePage.goto('http://127.0.0.1:4187/#/questbook', { waitUntil: 'networkidle' })
  assert.equal(await fixturePage.locator('.quest-index-link').count(), 3)
  await fixturePage.getByRole('button', { name: 'Piste', exact: true }).click()
  assert.equal(await fixturePage.locator('.quest-index-link').count(), 1)
  await fixturePage.getByRole('button', { name: 'Tutte', exact: true }).click()
  await fixturePage.getByRole('searchbox').fill('citta')
  assert.equal(await fixturePage.locator('.quest-index-link').count(), 1, 'Accent-insensitive location search')
  await fixturePage.locator('.quest-index-link').click()
  await fixturePage.waitForURL(/#\/questbook\/test-b$/)
  await fixturePage.getByRole('heading', { name: 'Voce di prova B' }).waitFor()
  assert.match(await fixturePage.locator('.quest-whereabouts').textContent(), /Non ancora nota/)
  await fixturePage.getByRole('searchbox').fill('nessun-risultato')
  await fixturePage.getByRole('button', { name: 'Mostra tutte le quest' }).click()
  await fixturePage.locator('[data-quest-id="test-a"]').focus()
  await fixturePage.keyboard.press('Enter')
  await fixturePage.getByRole('heading', { name: 'Voce di prova A' }).waitFor()
  assert.equal(await fixturePage.evaluate(() => document.activeElement.id), 'quest-page-title')
  assert.match(await fixturePage.locator('.quest-next-step').textContent(), /Pista da verificare/)
  await fixturePage.locator('.quest-page img').evaluateAll(images => Promise.all(images.map(image => image.decode())))
  await fixturePage.getByRole('button', { name: 'Ingrandisci: Didascalia di prova' }).click()
  await fixturePage.locator('.quest-photo-dialog[open]').waitFor()
  await fixturePage.keyboard.press('Escape')
  await fixturePage.locator('.quest-photo-dialog').waitFor({ state: 'detached' })
  assert.equal(await fixturePage.evaluate(() => document.activeElement.getAttribute('aria-label')), 'Ingrandisci: Didascalia di prova')
  await fixturePage.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await fixturePage.screenshot({ path: 'artifacts/questbook-fixture-desktop.png', fullPage: true })
  await fixturePage.getByRole('link', { name: 'Quest successiva', exact: true }).click()
  await fixturePage.getByRole('heading', { name: 'Voce di prova B' }).waitFor()
  await fixturePage.goBack()
  await fixturePage.getByRole('heading', { name: 'Voce di prova A' }).waitFor()
  await fixturePage.reload({ waitUntil: 'networkidle' })
  await fixturePage.getByRole('heading', { name: 'Voce di prova A' }).waitFor()
  await fixturePage.getByRole('link', { name: 'Elden Ring', exact: true }).click()
  await fixturePage.waitForURL(/#\/board\/elden-ring$/)
  await fixturePage.locator('a.nav-tab[href="#/questbook"]').click()
  await fixturePage.getByRole('heading', { name: 'Voce di prova A' }).waitFor()

  await fixturePage.setViewportSize({ width: 375, height: 812 })
  assert.equal(await fixturePage.locator('.quest-page').isVisible(), false)
  await fixturePage.locator('[data-quest-id="test-a"]').click()
  await fixturePage.getByRole('heading', { name: 'Voce di prova A' }).waitFor()
  assert.equal(await fixturePage.locator('.quest-index').isVisible(), false)
  await fixturePage.evaluate(() => { document.documentElement.style.fontSize = '24px' })
  assert.ok(await fixturePage.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Large text must reflow on mobile')
  await fixturePage.evaluate(() => { document.documentElement.style.fontSize = '' })
  await fixturePage.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await fixturePage.screenshot({ path: 'artifacts/questbook-fixture-mobile.png', fullPage: true })
  await fixturePage.getByRole('link', { name: 'Indice delle quest', exact: true }).click()
  await fixturePage.locator('.quest-index').waitFor()
  await fixturePage.waitForFunction(() => document.activeElement.dataset.questId === 'test-a')
  assert.equal(await fixturePage.evaluate(() => document.activeElement.dataset.questId), 'test-a')
  await fixturePage.goto('http://127.0.0.1:4187/#/questbook/non-esiste')
  await fixturePage.getByRole('heading', { name: 'Quest non trovata' }).waitFor()
  assert.deepEqual(errors, [])
  console.log('Questbook passed: empty production journal, responsive navigation, isolated fixture search, filters, deep links, history, focus, photos, mobile and large text.')
} finally {
  await browser.close()
  await fixtureServer?.close()
}
