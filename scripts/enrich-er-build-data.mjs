import { readFileSync, writeFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'

const [databasePath, fmgRoot, saveForgeRoot] = process.argv.slice(2)

if (!databasePath || !fmgRoot || !saveForgeRoot) {
  throw new Error('Uso: node scripts/enrich-er-build-data.mjs <item-names.json> <cartella-fmg-xml> <cartella-saveforge>')
}

const database = JSON.parse(readFileSync(resolve(databasePath), 'utf8'))

function decodeXml(value) {
  return value
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
    .replace(/&#x([\da-f]+);/gi, (_, number) => String.fromCodePoint(Number.parseInt(number, 16)))
}

function readFmg(filename) {
  const xml = readFileSync(resolve(fmgRoot, filename), 'utf8')
  const entries = {}
  for (const match of xml.matchAll(/<text id="(\d+)">([\s\S]*?)<\/text>/g)) {
    const name = decodeXml(match[2]).trim()
    if (name && name !== '%null%' && name !== '[ERROR]') entries[match[1]] = name
  }
  return entries
}

const italian = {
  weapons: readFmg('WeaponName.fmg.xml'),
  armor: readFmg('ProtectorName.fmg.xml'),
  talismans: readFmg('AccessoryName.fmg.xml'),
  goods: readFmg('GoodsName.fmg.xml'),
}

database.spellTypes ??= {}
for (const [id, name] of Object.entries(database.goods)) {
  if (name.startsWith('[Sorcery] ')) database.spellTypes[id] = 'sorcery'
  if (name.startsWith('[Incantation] ')) database.spellTypes[id] = 'incantation'
}

for (const category of ['weapons', 'armor', 'talismans', 'goods']) {
  for (const id of Object.keys(database[category])) {
    if (italian[category][id]) database[category][id] = italian[category][id]
  }
}

function readIconMap(files, highNibble) {
  const icons = {}
  for (const filename of files) {
    const source = readFileSync(resolve(saveForgeRoot, 'backend', 'db', 'data', filename), 'utf8')
    const pattern = /^\s*(0x[\da-f]+):\s*\{[^\n]*?IconPath:\s*"([^"]+)"/gim
    for (const match of source.matchAll(pattern)) {
      const fullId = Number.parseInt(match[1], 16) >>> 0
      const normalizedId = highNibble ? fullId & 0x0fffffff : fullId
      icons[normalizedId] = match[2]
    }
  }
  return icons
}

const revision = 'ee1042d7a5bd933f91e6f8a0162e0e0237a1c4c5'
database.icons = {
  source: {
    project: 'oisis/EldenRing-SaveForge',
    license: 'GPL-3.0',
    revision,
  },
  baseUrl: `https://raw.githubusercontent.com/oisis/EldenRing-SaveForge/${revision}/frontend/public/`,
  weapons: readIconMap(['melee_armaments.go', 'ranged_and_catalysts.go', 'shields.go'], false),
  armor: readIconMap(['head.go', 'chest.go', 'arms.go', 'legs.go'], true),
  talismans: readIconMap(['talismans.go'], true),
}

database.source.localization = {
  language: 'it-IT',
  source: basename(fmgRoot),
  note: 'Nomi estratti dai file FMG italiani dell’installazione locale di Elden Ring.',
}

writeFileSync(resolve(databasePath), `${JSON.stringify(database)}\n`)
