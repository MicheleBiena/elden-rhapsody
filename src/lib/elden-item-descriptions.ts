import descriptions from '../data/build/item-descriptions.json'
import type { BuildItem } from './elden-save-reader'

interface DescriptionDatabase {
  weapons: Record<string, string>
  armor: Record<string, string>
  talismans: Record<string, string>
  spells: Record<string, string>
}

const itemDescriptions = descriptions as DescriptionDatabase

export function getItemDescription(item: BuildItem): string | null {
  if (item.category === 'weapon') {
    return itemDescriptions.weapons[String(item.id)]
      ?? itemDescriptions.weapons[String(Math.floor(item.id / 10_000) * 10_000)]
      ?? null
  }
  if (item.category === 'armor') return itemDescriptions.armor[String(item.id)] ?? null
  if (item.category === 'talisman') return itemDescriptions.talismans[String(item.id)] ?? null
  return itemDescriptions.spells[String(item.id)] ?? null
}
