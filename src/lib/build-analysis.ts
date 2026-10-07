import type { BuildItem, CharacterStats, OffensiveStat } from './elden-save-reader'

const baseEquipLoadTenths = [
  450, 450, 450, 450, 450, 450, 450, 450, 450, 466,
  482, 498, 514, 529, 545, 561, 577, 593, 609, 625,
  641, 656, 672, 688, 704, 720, 730, 741, 752, 764,
  776, 789, 802, 815, 828, 841, 854, 868, 881, 895,
  909, 923, 937, 951, 965, 979, 994, 1008, 1022, 1037,
  1052, 1066, 1081, 1096, 1110, 1125, 1140, 1155, 1170, 1185,
  1200, 1210, 1221, 1231, 1241, 1251, 1262, 1272, 1282, 1292,
  1303, 1313, 1323, 1333, 1344, 1354, 1364, 1374, 1385, 1395,
  1405, 1415, 1426, 1436, 1446, 1456, 1467, 1477, 1487, 1497,
  1508, 1518, 1528, 1538, 1549, 1559, 1569, 1579, 1590, 1600,
] as const

export const offensiveStatLabels: Record<OffensiveStat, string> = {
  strength: 'FOR',
  dexterity: 'DES',
  intelligence: 'INT',
  faith: 'FED',
  arcane: 'ARC',
}

export interface RequirementGap {
  stat: OffensiveStat
  current: number
  required: number
}

export type FitTone = 'excellent' | 'good' | 'fair' | 'poor' | 'invalid'

export interface ScalingFit {
  tone: FitTone
  label: string
  score: number
}

export type EquipLoadClass = 'light' | 'medium' | 'heavy' | 'overloaded'

export interface EquipLoadSummary {
  current: number
  maximum: number
  percentage: number
  loadClass: EquipLoadClass
  enduranceBonus: number
  equipLoadRate: number
}

export function getRequirementGaps(item: BuildItem, stats: CharacterStats): RequirementGap[] {
  if (!item.requirements) return []
  return (Object.entries(item.requirements) as Array<[OffensiveStat, number]>)
    .filter(([stat, required]) => stats[stat] < required)
    .map(([stat, required]) => ({ stat, current: stats[stat], required }))
}

export function getScalingFit(item: BuildItem, stats: CharacterStats): ScalingFit | null {
  if (item.category !== 'weapon' || !item.scaling) return null
  if (getRequirementGaps(item, stats).length) {
    return { tone: 'invalid', label: 'Non utilizzabile', score: 0 }
  }

  const entries = (Object.entries(item.scaling) as Array<[OffensiveStat, number]>)
    .filter(([, coefficient]) => coefficient > 0)
  if (!entries.length) return null

  const highestStat = Math.max(...entries.map(([stat]) => stats[stat]), 1)
  const totalWeight = entries.reduce((sum, [, coefficient]) => sum + coefficient, 0)
  const score = entries.reduce(
    (sum, [stat, coefficient]) => sum + (stats[stat] / highestStat) * coefficient,
    0,
  ) / totalWeight

  if (score >= 0.84) return { tone: 'excellent', label: 'Affinità ottima', score }
  if (score >= 0.66) return { tone: 'good', label: 'Affinità buona', score }
  if (score >= 0.48) return { tone: 'fair', label: 'Affinità discreta', score }
  return { tone: 'poor', label: 'Affinità debole', score }
}

export function getEquipLoad(items: Array<BuildItem | null>, endurance: number): EquipLoadSummary {
  const equipped = items.filter((item): item is BuildItem => Boolean(item))
  const enduranceBonus = equipped.reduce((sum, item) => sum + (item.enduranceBonus ?? 0), 0)
  const equipLoadRate = equipped.reduce((sum, item) => sum + (item.equipLoadRate ?? 0), 0)
  const effectiveEndurance = Math.max(0, Math.min(99, endurance + enduranceBonus))
  const maximum = (baseEquipLoadTenths[effectiveEndurance] / 10) * (1 + equipLoadRate)
  const current = equipped.reduce((sum, item) => sum + (item.weight ?? 0), 0)
  const percentage = maximum > 0 ? (current / maximum) * 100 : 100
  const loadClass = percentage < 30
    ? 'light'
    : percentage < 70
      ? 'medium'
      : percentage < 100
        ? 'heavy'
        : 'overloaded'

  return { current, maximum, percentage, loadClass, enduranceBonus, equipLoadRate }
}
