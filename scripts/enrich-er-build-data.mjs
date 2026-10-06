import { readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'

const [databasePath, fmgRoot, saveForgeRoot] = process.argv.slice(2)

if (!databasePath || !fmgRoot || !saveForgeRoot) {
  throw new Error('Uso: node scripts/enrich-er-build-data.mjs <item-names.json> <cartella-fmg-xml|-> <cartella-saveforge|->')
}

const database = JSON.parse(readFileSync(resolve(databasePath), 'utf8'))
const skipLocalization = fmgRoot === '-'
const skipIcons = saveForgeRoot === '-'

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

database.spellTypes ??= {}
for (const [id, name] of Object.entries(database.goods)) {
  if (name.startsWith('[Sorcery] ')) database.spellTypes[id] = 'sorcery'
  if (name.startsWith('[Incantation] ')) database.spellTypes[id] = 'incantation'
}

if (!skipLocalization) {
  const italian = {
    weapons: readFmg('WeaponName.fmg.xml'),
    armor: readFmg('ProtectorName.fmg.xml'),
    talismans: readFmg('AccessoryName.fmg.xml'),
    goods: readFmg('GoodsName.fmg.xml'),
  }

  for (const category of ['weapons', 'armor', 'talismans', 'goods']) {
    for (const id of Object.keys(database[category])) {
      if (italian[category][id]) database[category][id] = italian[category][id]
    }
  }

  const captions = {
    weapons: readFmg('WeaponCaption.fmg.xml'),
    armor: readFmg('ProtectorCaption.fmg.xml'),
    talismans: readFmg('AccessoryCaption.fmg.xml'),
    spells: readFmg('GoodsCaption.fmg.xml'),
  }
  const selectKnown = (entries, ids) => Object.fromEntries(
    ids.flatMap((id) => entries[id] ? [[id, entries[id]]] : []),
  )
  const descriptions = {
    source: {
      language: 'it-IT',
      source: basename(fmgRoot),
      note: 'Descrizioni ufficiali estratte dai file FMG italiani dell’installazione locale di Elden Ring.',
    },
    weapons: selectKnown(
      captions.weapons,
      Object.keys(database.weapons).filter((id) => Number(id) % 10_000 === 0),
    ),
    armor: selectKnown(captions.armor, Object.keys(database.armor)),
    talismans: selectKnown(captions.talismans, Object.keys(database.talismans)),
    spells: selectKnown(captions.spells, Object.keys(database.spellTypes)),
  }
  const descriptionsPath = resolve(dirname(databasePath), 'item-descriptions.json')
  writeFileSync(descriptionsPath, `${JSON.stringify(descriptions)}\n`)
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

if (!skipIcons) {
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
    sorceries: readIconMap(['sorceries.go'], true),
    incantations: readIconMap(['incantations.go'], true),
  }
}

if (!skipLocalization) {
  database.source.localization = {
    language: 'it-IT',
    source: basename(fmgRoot),
    note: 'Nomi estratti dai file FMG italiani dell’installazione locale di Elden Ring.',
  }
}

writeFileSync(resolve(databasePath), `${JSON.stringify(database)}\n`)
