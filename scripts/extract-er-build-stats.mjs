import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const [itemNamesPath, weaponStatsPath, descriptionsPath, modifiersPath, outputPath] = process.argv.slice(2)

if (!itemNamesPath || !weaponStatsPath || !descriptionsPath || !modifiersPath || !outputPath) {
  throw new Error('Uso: node scripts/extract-er-build-stats.mjs <item-names.json> <weapon_stats_generated.go> <descriptions.go> <equip_load_modifiers.go> <output.json>')
}

const names = JSON.parse(readFileSync(resolve(itemNamesPath), 'utf8'))
const weaponSource = readFileSync(resolve(weaponStatsPath), 'utf8')
const descriptionSource = readFileSync(resolve(descriptionsPath), 'utf8')
const modifierSource = readFileSync(resolve(modifiersPath), 'utf8')

function readNumber(body, field) {
  const match = body.match(new RegExp(`\\b${field}:\\s*(-?[\\d.]+)`))
  return match ? Number(match[1]) : 0
}

function compactRequirements(body, prefix = 'StatReq') {
  const fields = {
    strength: `${prefix}Str`,
    dexterity: `${prefix}Dex`,
    intelligence: `${prefix}Int`,
    faith: `${prefix}Fai`,
    arcane: `${prefix}Arc`,
  }
  return Object.fromEntries(Object.entries(fields)
    .map(([key, field]) => [key, readNumber(body, field)])
    .filter(([, value]) => value > 0))
}

function parseStruct(body, field, type) {
  return body.match(new RegExp(`${field}:\\s*&${type}\\{([^}]*)\\}`))?.[1] ?? ''
}

const weapons = {}
for (const match of weaponSource.matchAll(/^\s*(0x[\da-f]+):\s*\{([^\n]+)$/gim)) {
  const id = Number.parseInt(match[1], 16) >>> 0
  if (!names.weapons[String(id)]) continue
  const body = match[2]
  const scaling = Object.fromEntries([
    ['strength', readNumber(body, 'ScalingStrRaw')],
    ['dexterity', readNumber(body, 'ScalingDexRaw')],
    ['intelligence', readNumber(body, 'ScalingIntRaw')],
    ['faith', readNumber(body, 'ScalingFaiRaw')],
    ['arcane', readNumber(body, 'ScalingArcRaw')],
  ].filter(([, value]) => value > 0))
  weapons[id] = {
    weight: readNumber(body, 'Weight'),
    requirements: compactRequirements(body),
    scaling,
  }
}

const armor = {}
const talismans = {}
const spells = {}
for (const match of descriptionSource.matchAll(/^\s*(0x[\da-f]+):\s*\{([^\n]+)$/gim)) {
  const fullId = Number.parseInt(match[1], 16) >>> 0
  const id = fullId & 0x0fffffff
  const category = fullId >>> 28
  const body = match[2]

  if (category === 1 && names.armor[String(id)]) {
    const stats = parseStruct(body, 'Armor', 'ArmorStats')
    if (stats) armor[id] = { weight: readNumber(stats, 'Weight') }
  }

  if (category === 2 && names.talismans[String(id)]) {
    talismans[id] = { weight: readNumber(body, 'Weight') }
  }

  if (category === 4 && names.spellTypes[String(id)]) {
    const stats = parseStruct(body, 'Spell', 'SpellStats')
    if (stats) {
      spells[id] = {
        memorySlots: readNumber(stats, 'Slots') || 1,
        requirements: compactRequirements(stats, 'Req'),
      }
    }
  }
}

for (const match of modifierSource.matchAll(/^\s*(0x[\da-f]+):\s*\{([^}]+)\}/gim)) {
  const fullId = Number.parseInt(match[1], 16) >>> 0
  const id = fullId & 0x0fffffff
  const target = talismans[id] ?? armor[id]
  if (!target) continue
  const enduranceBonus = readNumber(match[2], 'EnduranceBonus')
  const equipLoadRate = readNumber(match[2], 'EquipLoadRate')
  if (enduranceBonus) target.enduranceBonus = enduranceBonus
  if (equipLoadRate) target.equipLoadRate = equipLoadRate
}

const output = {
  source: {
    project: 'oisis/EldenRing-SaveForge',
    revision: 'ee1042d7a5bd933f91e6f8a0162e0e0237a1c4c5',
    note: 'Pesi, requisiti e coefficienti grezzi estratti dai parametri di gioco inclusi nel progetto sorgente.',
  },
  weapons,
  armor,
  talismans,
  spells,
}

writeFileSync(resolve(outputPath), `${JSON.stringify(output)}\n`)
