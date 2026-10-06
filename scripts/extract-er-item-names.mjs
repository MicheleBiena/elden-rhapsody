import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const sourceRoot = process.argv[2]
const outputPath = process.argv[3]

if (!sourceRoot || !outputPath) {
  throw new Error('Uso: node scripts/extract-er-item-names.mjs <cartella-src-db> <output.json>')
}

function readRustMap(filename) {
  const source = readFileSync(resolve(sourceRoot, filename), 'utf8')
  const entries = {}
  const pattern = /\(\s*(0x[\da-f]+|\d+)\s*,\s*"([^"]*)"\s*\)/gi

  for (const match of source.matchAll(pattern)) {
    const id = Number.parseInt(match[1], match[1].startsWith('0x') ? 16 : 10)
    const name = match[2].trim()
    if (name) entries[id] = name
  }

  return entries
}

const database = {
  source: {
    project: 'ClayAmore/ER-Save-Editor',
    license: 'MIT OR Apache-2.0',
    revision: '014107f0ca1cff867b5f7565cb79d6684f9b35df',
  },
  weapons: readRustMap('weapon_name.rs'),
  armor: readRustMap('armor_name.rs'),
  talismans: readRustMap('accessory_name.rs'),
  goods: readRustMap('item_name.rs'),
}

writeFileSync(resolve(outputPath), `${JSON.stringify(database)}\n`)
