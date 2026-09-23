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
  await page.getByRole('heading', { name: 'I offer you an accord', exact: true }).waitFor()
  assert.deepEqual(await page.locator('.quest-index-link').evaluateAll(links => links.map(link => link.dataset.questId)), [
    'melina', 'varre', 'boc', 'alexander', 'sellen', 'blaidd', 'rogier', 'roderika',
    'renna', 'd', 'kenneth', 'gurranq', 'edgar-irina', 'nepheli', 'diallos',
  ])
  assert.equal(await page.getByRole('searchbox', { name: 'Cerca una quest' }).isDisabled(), false)
  assert.match(await page.locator('.questbook-count').textContent(), /14 in corso/)
  assert.match(await page.locator('.quest-next-step').textContent(), /Raggiungere l’Albero Madre/)
  const proportion = await page.locator('.quest-book').evaluate(book => {
    const index = book.querySelector('.quest-index').getBoundingClientRect()
    const detail = book.querySelector('.quest-page').getBoundingClientRect()
    return detail.width / index.width
  })
  assert.ok(proportion >= 1.9 && proportion <= 2.3)
  await page.locator('.quest-portrait img').evaluate(image => image.decode())
  await page.screenshot({ path: 'artifacts/questbook-desktop.png', fullPage: true })

  await page.getByRole('searchbox').fill('varre')
  assert.equal(await page.locator('.quest-index-link').count(), 1)
  await page.locator('[data-quest-id="varre"]').click()
  await page.getByRole('heading', { name: 'La Maschera Bianca', exact: true }).waitFor()
  assert.match(await page.locator('.quest-whereabouts').textContent(), /Primo Passo/)
  assert.match(await page.locator('.quest-history').textContent(), /Godrick sconfitto/)
  assert.match(await page.locator('.quest-history').textContent(), /Udienza dalle Due Dita/)
  assert.equal(await page.locator('.quest-next-step').count(), 0, 'Do not invent a follow-up for Varré')
  assert.equal(await page.locator('.quest-status').textContent(), 'In corso', 'Initial task completed does not conclude the whole quest')
  assert.equal(await page.locator('.quest-lore-links a').count(), 3)
  await page.locator('.quest-portrait img').evaluate(image => image.decode())
  await page.getByRole('searchbox').fill('')
  await page.locator('[data-quest-id="boc"]').click()
  await page.getByRole('heading', { name: 'Il vestito è un po’ antiquato…', exact: true }).waitFor()
  assert.match(await page.locator('.quest-whereabouts').textContent(), /Sepolcride centrale/)
  assert.match(await page.locator('.quest-next-step').textContent(), /grotta sulla spiaggia a ovest di Sepolcride/)
  assert.equal(await page.locator('.quest-history li').count(), 1, 'The cave is a future step, not already visited')
  await page.locator('.quest-portrait img').evaluate(image => image.decode())

  const newQuests = [
    { id: 'alexander', title: 'Amico Vaso', lastSeen: 'Sepolcride nord', destination: 'Castel Mantorosso', step: /lo aiutiamo a liberarsi/, links: 1, image: true },
    { id: 'sellen', title: 'Maestra di stelle', lastSeen: 'Sepolcride centrale', destination: 'Non ancora nota', step: /seconda figura identica a Sellen/, links: 1, image: true },
    { id: 'blaidd', title: 'Berserk', lastSeen: 'Galera eterna del limiere alacre', destination: 'Un fabbro gigante a nord', step: /Darriwil/, links: 2, image: true },
    { id: 'rogier', title: 'Beata ignoranza', lastSeen: 'Chiesa di Grantempesta', destination: 'Non ancora nota', step: /Margit/, links: 0, image: false },
    { id: 'roderika', title: 'Crisalidi', lastSeen: 'Capanna a Grantempesta', destination: 'Non ancora nota', step: /cumulo di cadaveri/, links: 2, image: true },
    { id: 'renna', title: 'La luna nera', lastSeen: 'Chiesa di Elleh', destination: 'Non ancora nota', step: /strega Renna/, links: 1, image: true },
    { id: 'd', title: 'La doppia faccia', lastSeen: 'Tavola Rotonda', destination: 'Non ancora nota', step: /uccidiamo il marinaio/, links: 2, image: true },
    { id: 'kenneth', title: 'Successione', lastSeen: 'Forte Haight', destination: 'Non ancora nota', step: /degno erede/, links: 1, image: true },
    { id: 'gurranq', title: 'Consumare la morte', lastSeen: 'Santuario Ferino, Dracotumulo', destination: 'Santuario Ferino', step: /occhio per trovare le radici mortali/, links: 1, image: false },
    { id: 'edgar-irina', title: 'Insurrezione', lastSeen: 'Ponte dei Sacrifici', destination: 'Non ancora nota', step: /Irina morta/, links: 3, image: true },
    { id: 'nepheli', title: 'Via col vento', lastSeen: 'Grantempesta', destination: 'Non ancora nota', step: /Uccidiamo Godrick/, links: 1, image: false },
    { id: 'diallos', title: 'Vocazione', lastSeen: 'Tavola Rotonda', destination: 'Non ancora nota', step: /Lanya/, links: 1, image: true },
  ]
  for (const quest of newQuests) {
    await page.locator(`[data-quest-id="${quest.id}"]`).click()
    await page.getByRole('heading', { name: quest.title, exact: true }).waitFor()
    assert.deepEqual(await page.locator('.quest-whereabouts dd strong').allTextContents(), [quest.lastSeen, quest.destination])
    assert.match(await page.locator('.quest-history').textContent(), quest.step)
    assert.equal(await page.locator('.quest-lore-links a').count(), quest.links)
    assert.equal(await page.locator('.quest-portrait img').count(), quest.image ? 1 : 0)
    if (quest.image) await page.locator('.quest-portrait img').evaluate(image => image.decode())
    assert.equal(await page.locator('.quest-status').textContent(), quest.id === 'edgar-irina' ? 'Conclusa' : 'In corso')
    if (quest.id === 'sellen' || quest.id === 'kenneth') assert.match(await page.locator('.quest-next-step').textContent(), /Pista da verificare/)
    if (['rogier', 'roderika', 'renna', 'd', 'edgar-irina', 'nepheli'].includes(quest.id)) {
      assert.equal(await page.locator('.quest-next-step').count(), 0, 'No invented follow-up for an unknown destination')
    }
    if (quest.id === 'd') assert.match(await page.locator('.quest-history').textContent(), /raggiunto e incontrato/)
    if (quest.id === 'gurranq') assert.match(await page.locator('.quest-next-step').textContent(), /radici mortali/)
    if (quest.id === 'diallos') assert.match(await page.locator('.quest-next-step').textContent(), /Trovare Lanya/)
  }
  await page.getByRole('button', { name: 'Concluse', exact: true }).click()
  assert.equal(await page.locator('.quest-index-link').count(), 1)
  await page.locator('[data-quest-id="edgar-irina"]').click()
  await page.getByRole('heading', { name: 'Insurrezione', exact: true }).waitFor()
  await page.locator('.quest-gallery img').evaluate(image => image.decode())
  await page.getByRole('button', { name: 'Ingrandisci: Irina al nostro primo incontro' }).click()
  await page.locator('.quest-photo-dialog[open]').waitFor()
  await page.keyboard.press('Escape')
  await page.locator('.quest-photo-dialog').waitFor({ state: 'detached' })
  await page.getByRole('button', { name: 'In corso', exact: true }).click()
  assert.equal(await page.locator('.quest-index-link').count(), 14)
  assert.equal(await page.locator('[data-quest-id="edgar-irina"]').count(), 0)
  await page.getByRole('button', { name: 'Tutte', exact: true }).click()
  await page.locator('[data-quest-id="sellen"]').click()
  await page.getByRole('heading', { name: 'Maestra di stelle', exact: true }).waitFor()
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.screenshot({ path: 'artifacts/questbook-sellen-desktop.png', fullPage: true })

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
  await page.locator('.quest-index').waitFor()
  await page.locator('[data-quest-id="diallos"]').click()
  await page.getByRole('heading', { name: 'Vocazione', exact: true }).waitFor()
  await page.getByRole('link', { name: 'Indice delle quest', exact: true }).click()
  await page.locator('.quest-index').waitFor()
  await page.waitForFunction(() => document.activeElement.dataset.questId === 'diallos')
  await page.locator('[data-quest-id="melina"]').click()
  await page.getByRole('heading', { name: 'I offer you an accord', exact: true }).waitFor()
  await page.locator('a.nav-tab[href="#/map"]').click()
  await page.locator('.map-layout').waitFor()
  await page.locator('a.nav-tab[href="#/board"]').click()
  assert.equal(await page.getByRole('button', { name: '0 da leggere', exact: true }).isDisabled(), true)
  assert.deepEqual(errors, [])
  await page.close()

  // Technical fixtures exist only in this isolated browser response. The actual
  // quests.ts and production bundle retain only the user-provided quest entries.
  fixtureServer = await createServer({ server: { host: '127.0.0.1', port: 4187, strictPort: true }, logLevel: 'error' })
  await fixtureServer.listen()
  const emptyPage = await browser.newPage({ viewport: { width: 375, height: 812 } })
  emptyPage.on('pageerror', error => errors.push(error.message))
  await emptyPage.route('**/src/data/quests.ts*', route => route.fulfill({ contentType: 'application/javascript', body: 'export const quests = []' }))
  await emptyPage.goto('http://127.0.0.1:4187/#/questbook', { waitUntil: 'networkidle' })
  await emptyPage.getByRole('heading', { name: 'Il diario è ancora vuoto' }).waitFor()
  assert.equal(await emptyPage.locator('.quest-index-link').count(), 0)
  assert.equal(await emptyPage.locator('.quest-search input').isDisabled(), true)
  await emptyPage.goto('http://127.0.0.1:4187/#/questbook/non-esiste')
  await emptyPage.getByRole('heading', { name: 'Quest non trovata' }).waitFor()
  await emptyPage.getByRole('link', { name: 'Torna all’indice' }).click()
  await emptyPage.getByRole('heading', { name: 'Il diario è ancora vuoto' }).waitFor()
  await emptyPage.close()
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
  console.log('Questbook passed: fifteen user-provided quests, fourteen active and one concluded, known and unknown destinations, responsive navigation, isolated empty state and fixture search, filters, deep links, history, focus, photos, mobile and large text.')
} finally {
  await browser.close()
  await fixtureServer?.close()
}
