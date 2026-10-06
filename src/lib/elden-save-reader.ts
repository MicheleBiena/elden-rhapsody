import itemNames from '../data/build/item-names.json'

const SLOT_COUNT = 10
const HEADER_SIZE = 0x300
const SLOT_DATA_SIZE = 0x280000
const SLOT_STRIDE = 0x280010
const COMMON_ITEM_CAPACITY = 0xa80
const KEY_ITEM_CAPACITY = 0x180
const INVENTORY_ENTRY_SIZE = 12
const EMPTY_ITEM = 0xffffffff

type ItemCategory = 'weapon' | 'armor' | 'talisman' | 'spell'

interface NameDatabase {
  weapons: Record<string, string>
  armor: Record<string, string>
  talismans: Record<string, string>
  goods: Record<string, string>
  spellTypes: Record<string, 'sorcery' | 'incantation'>
  icons: {
    baseUrl: string
    weapons: Record<string, string>
    armor: Record<string, string>
    talismans: Record<string, string>
    sorceries: Record<string, string>
    incantations: Record<string, string>
  }
}

const names = itemNames as NameDatabase

export interface CharacterStats {
  vigor: number
  mind: number
  endurance: number
  strength: number
  dexterity: number
  intelligence: number
  faith: number
  arcane: number
}

export interface BuildItem {
  id: number
  name: string
  category: ItemCategory
  quantity: number
  equipped: boolean
  iconUrl?: string
  upgradeLevel?: number
  spellType?: 'sorcery' | 'incantation'
}

export interface EquippedBuild {
  rightHand: Array<BuildItem | null>
  leftHand: Array<BuildItem | null>
  armor: Array<BuildItem | null>
  talismans: Array<BuildItem | null>
  spells: BuildItem[]
  greatRune: string | null
  greatRuneActive: boolean
  availableGreatRunes: string[]
}

export interface BuildCharacter {
  slotIndex: number
  name: string
  level: number
  runes: number
  hp: number
  maxHp: number
  fp: number
  maxFp: number
  stamina: number
  maxStamina: number
  stats: CharacterStats
  talismanSlots: number
  memoryStones: number
  memorySlots: number
  potentialMemorySlots: number
  moonOfNokstellaEquipped: boolean
  inventory: {
    weapons: BuildItem[]
    armor: BuildItem[]
    talismans: BuildItem[]
    spells: BuildItem[]
  }
  equipped: EquippedBuild
  unresolvedItems: number
}

export interface ParsedBuildSave {
  fileSize: number
  characters: BuildCharacter[]
}

interface RawInventoryEntry {
  handle: number
  quantity: number
}

interface InventoryLayout {
  entries: RawInventoryEntry[]
  endOffset: number
}

interface ParsedGaItems {
  endOffset: number
  itemIds: Map<number, number>
}

function readUint32(view: DataView, offset: number, limit = view.byteLength): number {
  if (offset < 0 || offset + 4 > limit) return EMPTY_ITEM
  return view.getUint32(offset, true)
}

function readName(buffer: ArrayBuffer, offset: number): string {
  return new TextDecoder('utf-16le')
    .decode(buffer.slice(offset, offset + 32))
    .replaceAll('\0', '')
    .trim()
}

function isEmpty(value: number): boolean {
  return value === 0 || value === EMPTY_ITEM
}

function parseGaItems(view: DataView, start: number, slotEnd: number): ParsedGaItems {
  let offset = start
  const itemIds = new Map<number, number>()

  for (let index = 0; index < 5120; index += 1) {
    if (offset + 8 > slotEnd) throw new Error('Tabella oggetti incompleta nel salvataggio.')

    const handle = readUint32(view, offset, slotEnd)
    const itemId = readUint32(view, offset + 4, slotEnd)
    const type = (handle >>> 28) & 0xf
    if (!isEmpty(handle)) itemIds.set(handle, itemId)

    offset += 8
    if (handle !== 0 && type !== 0xc) {
      offset += 8
      if (type === 0x8) offset += 5
    }
  }

  return { endOffset: offset, itemIds }
}

function getInventoryLayout(view: DataView, chrAsmOffset: number, slotEnd: number): InventoryLayout {
  const candidates = [chrAsmOffset + 0x58, chrAsmOffset + 0x60]

  for (const start of candidates) {
    const commonCount = readUint32(view, start, slotEnd)
    const commonEntriesStart = start + 4
    const keyCountOffset = commonEntriesStart + COMMON_ITEM_CAPACITY * INVENTORY_ENTRY_SIZE
    const keyCount = readUint32(view, keyCountOffset, slotEnd)
    const keyEntriesStart = keyCountOffset + 4
    const endOffset = keyEntriesStart + KEY_ITEM_CAPACITY * INVENTORY_ENTRY_SIZE + 8

    if (
      commonCount > COMMON_ITEM_CAPACITY ||
      keyCount > KEY_ITEM_CAPACITY ||
      endOffset > slotEnd
    ) continue

    const entries: RawInventoryEntry[] = []
    const readEntries = (entryStart: number, count: number) => {
      for (let index = 0; index < count; index += 1) {
        const offset = entryStart + index * INVENTORY_ENTRY_SIZE
        const handle = readUint32(view, offset, slotEnd)
        const quantity = readUint32(view, offset + 4, slotEnd)
        if (!isEmpty(handle) && quantity > 0 && quantity < 1_000_000) {
          entries.push({ handle, quantity })
        }
      }
    }

    readEntries(commonEntriesStart, commonCount)
    readEntries(keyEntriesStart, keyCount)

    const validEntries = entries.filter(({ handle }) => {
      const type = (handle >>> 28) & 0xf
      return type >= 0x8 && type <= 0xc
    }).length

    if (entries.length === 0 || validEntries / entries.length >= 0.8) {
      return { entries, endOffset }
    }
  }

  return { entries: [], endOffset: chrAsmOffset + 0x9070 }
}

function getIconUrl(category: Exclude<ItemCategory, 'spell'>, id: number): string | undefined {
  const lookupId = category === 'weapon' ? Math.floor(id / 10_000) * 10_000 : id
  const group = category === 'weapon'
    ? names.icons.weapons
    : category === 'armor'
      ? names.icons.armor
      : names.icons.talismans
  const path = group[String(lookupId)]
  return path ? `${names.icons.baseUrl}${path}` : undefined
}

function resolveSpell(id: number, quantity = 1, equipped = false): BuildItem | null {
  const spellType = names.spellTypes[String(id)]
  const name = names.goods[String(id)]
  const iconPath = spellType === 'sorcery'
    ? names.icons.sorceries[String(id)]
    : spellType === 'incantation'
      ? names.icons.incantations[String(id)]
      : undefined
  return spellType && name
    ? {
        id,
        name,
        category: 'spell',
        quantity,
        equipped,
        spellType,
        iconUrl: iconPath ? `${names.icons.baseUrl}${iconPath}` : undefined,
      }
    : null
}

function resolveHandle(
  handle: number,
  category: ItemCategory,
  itemIds: Map<number, number>,
  quantity = 1,
  equipped = false,
): BuildItem | null {
  if (isEmpty(handle)) return null
  const type = (handle >>> 28) & 0xf

  if (category === 'weapon' && type === 0x8) {
    const itemId = itemIds.get(handle)
    if (itemId === undefined) return null
    const upgradeLevel = itemId % 100
    const baseId = Math.floor(itemId / 100) * 100
    if (baseId === 110000) return null
    const name = names.weapons[String(baseId)]
    const iconUrl = getIconUrl('weapon', baseId)
    return name && iconUrl
      ? { id: baseId, name, category, quantity, equipped, upgradeLevel, iconUrl }
      : null
  }

  if (category === 'armor' && type === 0x9) {
    const itemId = itemIds.get(handle)
    if (itemId === undefined) return null
    const baseId = (itemId ^ 0x10000000) >>> 0
    const name = names.armor[String(baseId)]
    return name ? { id: baseId, name, category, quantity, equipped, iconUrl: getIconUrl('armor', baseId) } : null
  }

  if (category === 'talisman' && type === 0xa) {
    const baseId = handle & 0x0fffffff
    const name = names.talismans[String(baseId)]
    return name ? { id: baseId, name, category, quantity, equipped, iconUrl: getIconUrl('talisman', baseId) } : null
  }

  if (category === 'spell' && type === 0xb) {
    const baseId = handle & 0x0fffffff
    return resolveSpell(baseId, quantity, equipped)
  }

  return null
}

function readEquippedSpells(
  view: DataView,
  inventoryEnd: number,
  slotEnd: number,
): BuildItem[] {
  let best: BuildItem[] = []

  for (let candidate = inventoryEnd - 8; candidate <= inventoryEnd + 16; candidate += 4) {
    const spells: BuildItem[] = []
    let valid = true

    for (let index = 0; index < 14; index += 1) {
      const id = readUint32(view, candidate + index * 8, slotEnd)
      if (isEmpty(id)) continue
      const spell = resolveSpell(id, 1, true)
      if (!spell) {
        valid = false
        break
      }
      spells.push(spell)
    }

    if (valid && spells.length >= best.length) best = spells
  }

  return best
}

function aggregateItems(items: BuildItem[]): BuildItem[] {
  const result = new Map<string, BuildItem>()
  for (const item of items) {
    const key = `${item.category}:${item.id}:${item.upgradeLevel ?? 0}`
    const existing = result.get(key)
    if (existing) {
      existing.quantity += item.quantity
      existing.equipped ||= item.equipped
    } else {
      result.set(key, { ...item })
    }
  }
  return [...result.values()].sort((a, b) => a.name.localeCompare(b.name))
}

function parseCharacter(
  buffer: ArrayBuffer,
  view: DataView,
  slotIndex: number,
): BuildCharacter | null {
  const checksumOffset = HEADER_SIZE + slotIndex * SLOT_STRIDE
  const dataStart = checksumOffset + 0x10
  const slotEnd = dataStart + SLOT_DATA_SIZE
  if (slotEnd > view.byteLength) return null

  const checksumPresent = new Uint8Array(buffer, checksumOffset, 16).some((byte) => byte !== 0)
  const version = readUint32(view, dataStart, slotEnd)
  if (!checksumPresent || version === 0) return null

  const gaItems = parseGaItems(view, dataStart + 0x20, slotEnd)
  const playerData = gaItems.endOffset
  const name = readName(buffer, playerData + 0x94)
  const level = readUint32(view, playerData + 0x60, slotEnd)
  if (!name || level > 713) return null

  const chrAsmOffset = playerData + 0x34c
  const handleAt = (relativeOffset: number) => readUint32(view, chrAsmOffset + relativeOffset, slotEnd)
  const leftHandles = [0x00, 0x08, 0x10].map(handleAt)
  const rightHandles = [0x04, 0x0c, 0x14].map(handleAt)
  const armorHandles = [0x30, 0x34, 0x38, 0x3c].map(handleAt)
  const talismanHandles = [0x44, 0x48, 0x4c, 0x50].map(handleAt)

  const rightHand = rightHandles.map((handle) => resolveHandle(handle, 'weapon', gaItems.itemIds, 1, true))
  const leftHand = leftHandles.map((handle) => resolveHandle(handle, 'weapon', gaItems.itemIds, 1, true))
  const equippedArmor = armorHandles.map((handle) => resolveHandle(handle, 'armor', gaItems.itemIds, 1, true))
  const equippedTalismans = talismanHandles.map((handle) => resolveHandle(handle, 'talisman', gaItems.itemIds, 1, true))

  const inventoryLayout = getInventoryLayout(view, chrAsmOffset, slotEnd)
  const inventoryItems: BuildItem[] = []
  let unresolvedItems = 0
  let memoryStones = 0
  const availableGreatRuneIds = new Set<number>()

  for (const entry of inventoryLayout.entries) {
    const type = (entry.handle >>> 28) & 0xf
    let item: BuildItem | null = null
    if (type === 0x8) item = resolveHandle(entry.handle, 'weapon', gaItems.itemIds, entry.quantity)
    if (type === 0x9) item = resolveHandle(entry.handle, 'armor', gaItems.itemIds, entry.quantity)
    if (type === 0xa) item = resolveHandle(entry.handle, 'talisman', gaItems.itemIds, entry.quantity)
    if (type === 0xb) {
      const baseId = entry.handle & 0x0fffffff
      if (baseId === 10030) memoryStones += entry.quantity
      if (baseId >= 191 && baseId <= 196) availableGreatRuneIds.add(baseId)
      item = resolveHandle(entry.handle, 'spell', gaItems.itemIds, entry.quantity)
    }
    if (item) inventoryItems.push(item)
    else if (
      (type === 0x8 && getIconUrl('weapon', Math.floor((gaItems.itemIds.get(entry.handle) ?? 0) / 100) * 100)) ||
      type === 0x9 ||
      type === 0xa
    ) unresolvedItems += 1
  }

  const equippedSpells = readEquippedSpells(view, inventoryLayout.endOffset, slotEnd)
  const equippedSpellIds = new Set(equippedSpells.map((item) => item.id))
  for (const item of inventoryItems) {
    if (item.category === 'spell') item.equipped = equippedSpellIds.has(item.id)
  }

  const markEquipped = (items: BuildItem[], handles: number[], category: ItemCategory) => {
    const equippedIds = handles
      .map((handle) => resolveHandle(handle, category, gaItems.itemIds)?.id)
      .filter((id): id is number => id !== undefined)
    for (const item of items) item.equipped ||= equippedIds.includes(item.id)
  }

  const weapons = aggregateItems(inventoryItems.filter((item) => item.category === 'weapon'))
  const armor = aggregateItems(inventoryItems.filter((item) => item.category === 'armor'))
  const talismans = aggregateItems(inventoryItems.filter((item) => item.category === 'talisman'))
  const spells = aggregateItems(inventoryItems.filter((item) => item.category === 'spell'))
  markEquipped(weapons, [...leftHandles, ...rightHandles], 'weapon')
  markEquipped(armor, armorHandles, 'armor')
  markEquipped(talismans, talismanHandles, 'talisman')

  const greatRuneRaw = readUint32(view, playerData + 0x31c, slotEnd)
  const equippedGreatRuneGoodsId: Record<number, number> = {
    0x40000053: 191,
    0x40000054: 192,
    0x40000055: 193,
    0x40000056: 194,
    0x40000057: 196,
    0x40000058: 195,
  }
  const greatRuneGoodsId = equippedGreatRuneGoodsId[greatRuneRaw]
  const greatRune = greatRuneGoodsId ? names.goods[String(greatRuneGoodsId)] ?? null : null
  const availableGreatRunes = [...availableGreatRuneIds]
    .map((id) => names.goods[String(id)])
    .filter((name): name is string => Boolean(name))
  const moonOfNokstellaEquipped = equippedTalismans.some((item) => item?.id === 1140)
  const permanentSlots = Math.min(10, 2 + Math.min(8, memoryStones))
  const moonOwned = talismans.some((item) => item.id === 1140)

  return {
    slotIndex,
    name,
    level,
    runes: readUint32(view, playerData + 0x64, slotEnd),
    hp: readUint32(view, playerData + 0x08, slotEnd),
    maxHp: readUint32(view, playerData + 0x0c, slotEnd),
    fp: readUint32(view, playerData + 0x14, slotEnd),
    maxFp: readUint32(view, playerData + 0x18, slotEnd),
    stamina: readUint32(view, playerData + 0x24, slotEnd),
    maxStamina: readUint32(view, playerData + 0x28, slotEnd),
    stats: {
      vigor: readUint32(view, playerData + 0x34, slotEnd),
      mind: readUint32(view, playerData + 0x38, slotEnd),
      endurance: readUint32(view, playerData + 0x3c, slotEnd),
      strength: readUint32(view, playerData + 0x40, slotEnd),
      dexterity: readUint32(view, playerData + 0x44, slotEnd),
      intelligence: readUint32(view, playerData + 0x48, slotEnd),
      faith: readUint32(view, playerData + 0x4c, slotEnd),
      arcane: readUint32(view, playerData + 0x50, slotEnd),
    },
    talismanSlots: Math.min(4, 1 + view.getUint8(playerData + 0xbe)),
    memoryStones: Math.min(8, memoryStones),
    memorySlots: permanentSlots + (moonOfNokstellaEquipped ? 2 : 0),
    potentialMemorySlots: permanentSlots + (moonOwned ? 2 : 0),
    moonOfNokstellaEquipped,
    inventory: { weapons, armor, talismans, spells },
    equipped: {
      rightHand,
      leftHand,
      armor: equippedArmor,
      talismans: equippedTalismans,
      spells: equippedSpells,
      greatRune,
      greatRuneActive: view.getUint8(playerData + 0xf7) === 1,
      availableGreatRunes,
    },
    unresolvedItems,
  }
}

export function parseBuildSave(buffer: ArrayBuffer): ParsedBuildSave {
  if (buffer.byteLength < HEADER_SIZE + SLOT_STRIDE) {
    throw new Error('Il file è troppo piccolo per essere un salvataggio di Elden Ring.')
  }

  const magic = new TextDecoder('ascii').decode(buffer.slice(0, 4))
  if (magic !== 'BND4' && magic !== 'SL2\0') {
    throw new Error('Formato non riconosciuto: seleziona il file PC ER0000.sl2 originale.')
  }

  const view = new DataView(buffer)
  const characters: BuildCharacter[] = []
  for (let slotIndex = 0; slotIndex < SLOT_COUNT; slotIndex += 1) {
    const character = parseCharacter(buffer, view, slotIndex)
    if (character) characters.push(character)
  }

  if (characters.length === 0) {
    throw new Error('Non sono stati trovati personaggi leggibili nel salvataggio.')
  }

  return { fileSize: buffer.byteLength, characters }
}
