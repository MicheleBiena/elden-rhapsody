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

export type CharacterStat = keyof CharacterStats

export const characterStatLabels: Record<CharacterStat, string> = {
  vigor: 'VIG',
  mind: 'MND',
  endurance: 'END',
  strength: 'FOR',
  dexterity: 'DES',
  intelligence: 'INT',
  faith: 'FED',
  arcane: 'ARC',
}

const characterStats = Object.keys(characterStatLabels) as CharacterStat[]

const talismanStatBonusCatalog: Record<number, Partial<CharacterStats>> = {
  1050: { vigor: 3, endurance: 3, strength: 3, dexterity: 3 },
  1051: { vigor: 5, endurance: 5, strength: 5, dexterity: 5 },
  1060: { strength: 5 },
  1070: { dexterity: 5 },
  1080: { intelligence: 5 },
  1090: { faith: 5 },
  1220: { mind: 3, intelligence: 3, faith: 3, arcane: 3 },
  1221: { mind: 5, intelligence: 5, faith: 5, arcane: 5 },
  1250: { dexterity: 5 },
}

export interface StatBonusSource {
  item: BuildItem
  bonuses: Partial<CharacterStats>
}

export interface RequirementContext {
  baseStats: CharacterStats
  talismanStats: CharacterStats
  projectedStats: CharacterStats
  talismanSources: StatBonusSource[]
  godrickSelected: boolean
  godrickActive: boolean
}

export type RequirementSupport = 'base' | 'talisman' | 'godrick-active' | 'godrick-conditional' | 'unmet'

export interface RequirementEvaluation {
  support: RequirementSupport
  gaps: RequirementGap[]
  baseGaps: RequirementGap[]
  stats: CharacterStats
}

function addStatBonuses(stats: CharacterStats, bonuses: Partial<CharacterStats>): CharacterStats {
  return Object.fromEntries(characterStats.map((stat) => [
    stat,
    Math.min(99, stats[stat] + (bonuses[stat] ?? 0)),
  ])) as unknown as CharacterStats
}

export function getRequirementContext(
  stats: CharacterStats,
  talismans: Array<BuildItem | null>,
  greatRune: string | null,
  godrickActive = false,
): RequirementContext {
  const talismanSources = talismans
    .filter((item): item is BuildItem => Boolean(item && talismanStatBonusCatalog[item.id]))
    .map((item) => ({ item, bonuses: talismanStatBonusCatalog[item.id] }))
  const talismanBonuses = talismanSources.reduce<Partial<CharacterStats>>((total, source) => {
    characterStats.forEach((stat) => {
      const bonus = source.bonuses[stat] ?? 0
      if (bonus) total[stat] = (total[stat] ?? 0) + bonus
    })
    return total
  }, {})
  const talismanStats = addStatBonuses(stats, talismanBonuses)
  const godrickSelected = greatRune === 'Runa maggiore di Godrick'
  const godrickBonuses = godrickSelected
    ? Object.fromEntries(characterStats.map((stat) => [stat, 5])) as unknown as CharacterStats
    : {}
  const projectedStats = addStatBonuses(talismanStats, godrickBonuses)
  return { baseStats: stats, talismanStats, projectedStats, talismanSources, godrickSelected, godrickActive }
}

export function evaluateRequirements(item: BuildItem, context: RequirementContext): RequirementEvaluation {
  const baseGaps = getRequirementGaps(item, context.baseStats)
  if (!baseGaps.length) return { support: 'base', gaps: [], baseGaps, stats: context.baseStats }

  const talismanGaps = getRequirementGaps(item, context.talismanStats)
  if (!talismanGaps.length) return { support: 'talisman', gaps: [], baseGaps, stats: context.talismanStats }

  if (context.godrickSelected) {
    const projectedGaps = getRequirementGaps(item, context.projectedStats)
    if (!projectedGaps.length) {
      return {
        support: context.godrickActive ? 'godrick-active' : 'godrick-conditional',
        gaps: [],
        baseGaps,
        stats: context.projectedStats,
      }
    }
    return { support: 'unmet', gaps: talismanGaps, baseGaps, stats: context.talismanStats }
  }

  return { support: 'unmet', gaps: talismanGaps, baseGaps, stats: context.talismanStats }
}

/** Soglie riportate nel riferimento fornito per la pianificazione della build. */
export const statSoftCaps: Record<CharacterStat, number[]> = {
  vigor: [40, 60],
  mind: [55, 60],
  endurance: [25, 50, 60],
  strength: [20, 55, 80],
  dexterity: [20, 55, 80],
  intelligence: [20, 50, 60, 80],
  faith: [20, 50, 60, 80],
  arcane: [20, 30, 45, 50, 80],
}

export interface RequirementFunding {
  targets: Partial<Record<OffensiveStat, number>>
  points: number
  targetLevel: number
  totalRunes: number
  ownedRunes: number
  runesToFarm: number
}

export interface BuildRecommendation {
  stat: CharacterStat
  current: number
  target: number
  reason: string
  priority: 'alta' | 'media'
}

export interface BuildAssessment {
  strengths: string[]
  weaknesses: string[]
  recommendations: BuildRecommendation[]
  funding: RequirementFunding
}

export interface BuildAssessmentInput {
  stats: CharacterStats
  level: number
  runes: number
  equipment: Array<BuildItem | null>
  spells: Array<BuildItem | null>
  talismans?: Array<BuildItem | null>
  greatRune?: string | null
  greatRuneActive?: boolean
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

export function getRuneCostForNextLevel(level: number): number {
  const safeLevel = Math.max(1, Math.min(712, Math.trunc(level)))
  const growth = Math.max(0, (safeLevel - 11) * 0.02)
  return Math.floor((growth + 0.1) * ((safeLevel + 81) ** 2) + 1 + 1e-6)
}

export function getRuneCostForLevels(currentLevel: number, levels: number): number {
  const count = Math.max(0, Math.min(713 - currentLevel, Math.trunc(levels)))
  let total = 0
  for (let offset = 0; offset < count; offset += 1) {
    total += getRuneCostForNextLevel(currentLevel + offset)
  }
  return total
}

export function getRequirementFunding(
  items: Array<BuildItem | null>,
  stats: CharacterStats,
  level: number,
  runes: number,
): RequirementFunding {
  const targets: Partial<Record<OffensiveStat, number>> = {}
  items.filter((item): item is BuildItem => Boolean(item)).forEach((item) => {
    Object.entries(item.requirements ?? {}).forEach(([rawStat, required]) => {
      const stat = rawStat as OffensiveStat
      if (required > stats[stat]) targets[stat] = Math.max(targets[stat] ?? 0, required)
    })
  })
  const points = (Object.entries(targets) as Array<[OffensiveStat, number]>)
    .reduce((total, [stat, target]) => total + Math.max(0, target - stats[stat]), 0)
  const totalRunes = getRuneCostForLevels(level, points)
  return {
    targets,
    points,
    targetLevel: level + points,
    totalRunes,
    ownedRunes: runes,
    runesToFarm: Math.max(0, totalRunes - runes),
  }
}

function nextCap(stat: CharacterStat, value: number, preferredCaps?: number[]) {
  return (preferredCaps ?? statSoftCaps[stat]).find((cap) => cap > value) ?? null
}

function pushRecommendation(
  recommendations: BuildRecommendation[],
  stats: CharacterStats,
  stat: CharacterStat,
  target: number | null,
  reason: string,
  priority: BuildRecommendation['priority'],
) {
  if (!target || target <= stats[stat]) return
  const existing = recommendations.find((entry) => entry.stat === stat)
  if (existing) {
    if (priority === 'alta' || target < existing.target) {
      existing.target = target
      existing.reason = reason
      existing.priority = priority
    }
    return
  }
  recommendations.push({ stat, current: stats[stat], target, reason, priority })
}

export function getBuildAssessment({
  stats,
  level,
  runes,
  equipment,
  spells,
  talismans = [],
  greatRune = null,
  greatRuneActive = false,
}: BuildAssessmentInput): BuildAssessment {
  const equipped = equipment.filter((item): item is BuildItem => Boolean(item))
  const equippedWeapons = equipped.filter((item) => item.category === 'weapon')
  const memorizedSpells = spells.filter((item): item is BuildItem => Boolean(item))
  const checkedItems = [...equippedWeapons, ...memorizedSpells]
  const requirementContext = getRequirementContext(stats, talismans, greatRune, greatRuneActive)
  const requirementChecks = checkedItems.map((item) => evaluateRequirements(item, requirementContext))
  const unmetItems = checkedItems.filter((_, index) => requirementChecks[index].support === 'unmet')
  const funding = getRequirementFunding(unmetItems, requirementContext.talismanStats, level, runes)
  const load = getEquipLoad(equipment, stats.endurance)
  const fits = equippedWeapons
    .map((item) => getScalingFit(item, evaluateRequirements(item, requirementContext).stats))
    .filter((fit): fit is ScalingFit => Boolean(fit))
  const strengths: string[] = []
  const weaknesses: string[] = []
  const recommendations: BuildRecommendation[] = []

  if (checkedItems.length && requirementChecks.every((check) => check.support !== 'unmet' && check.support !== 'godrick-conditional')) strengths.push('Tutti i requisiti delle armi e magie in bozza sono rispettati.')
  if (requirementChecks.some((check) => check.support === 'talisman')) strengths.push('I talismani equipaggiati coprono alcuni requisiti mancanti nelle statistiche base.')
  if (load.loadClass === 'light') strengths.push(`Carico leggero (${load.percentage.toFixed(1)}%): schivate molto agili.`)
  if (load.loadClass === 'medium') strengths.push(`Carico medio controllato (${load.percentage.toFixed(1)}%): buona libertà di equipaggiamento.`)
  if (fits.some((fit) => fit.tone === 'excellent')) strengths.push('Almeno un’arma sfrutta molto bene gli attributi attuali.')
  if (stats.vigor >= 40) strengths.push(`VIG ${stats.vigor}: raggiunta la prima soglia difensiva importante.`)
  if (memorizedSpells.length) {
    const sorceries = memorizedSpells.filter((spell) => spell.spellType === 'sorcery').length
    const incantations = memorizedSpells.length - sorceries
    strengths.push(`${memorizedSpells.length} ${memorizedSpells.length === 1 ? 'magia armonizzata' : 'magie armonizzate'}${sorceries && incantations ? ', con repertorio misto' : sorceries ? ', orientate alla stregoneria' : ', orientate agli incantesimi'}.`)
  }

  const godrickDependencies = requirementChecks.filter((check) => check.support === 'godrick-conditional').length
  if (godrickDependencies) weaknesses.push(`${godrickDependencies} ${godrickDependencies === 1 ? 'elemento dipende' : 'elementi dipendono'} dall’attivazione della Runa di Godrick.`)
  if (funding.points > 0) {
    const deficits = (Object.entries(funding.targets) as Array<[OffensiveStat, number]>)
      .map(([stat, target]) => `${offensiveStatLabels[stat]} ${requirementContext.talismanStats[stat]}/${target}`)
      .join(' · ')
    weaknesses.push(`Requisiti non raggiunti: ${deficits}.`)
    ;(Object.entries(funding.targets) as Array<[OffensiveStat, number]>).forEach(([stat, target]) => {
      const missingLevels = Math.max(0, target - requirementContext.talismanStats[stat])
      pushRecommendation(recommendations, stats, stat, stats[stat] + missingLevels, 'Sblocca gli elementi già inseriti mantenendo i bonus della bozza.', 'alta')
    })
  }
  if (load.loadClass === 'heavy') weaknesses.push(`Carico pesante (${load.percentage.toFixed(1)}%): la schivata perde efficacia.`)
  if (load.loadClass === 'overloaded') weaknesses.push(`Sovraccarico (${load.percentage.toFixed(1)}%): occorre alleggerire subito la build.`)
  if (stats.vigor < 40) weaknesses.push(`VIG ${stats.vigor}: sotto la prima soglia consigliata per la sopravvivenza.`)
  if (fits.some((fit) => fit.tone === 'poor' || fit.tone === 'fair')) weaknesses.push('Una o più armi sfruttano solo in parte gli attributi attuali.')
  if (!equippedWeapons.length) weaknesses.push('Nessuna arma in bozza: lo scaling offensivo non è ancora valutabile.')

  if (stats.vigor < 40) pushRecommendation(recommendations, stats, 'vigor', 40, 'Prima soglia efficiente per i punti vita.', 'media')
  if (load.loadClass === 'heavy' || load.loadClass === 'overloaded') {
    pushRecommendation(recommendations, stats, 'endurance', nextCap('endurance', stats.endurance, [25, 60]), 'Aumenta il carico massimo; valuta anche equipaggiamento più leggero.', 'alta')
  }

  const scalingWeight: Partial<Record<OffensiveStat, number>> = {}
  equippedWeapons.forEach((weapon) => {
    ;(Object.entries(weapon.scaling ?? {}) as Array<[OffensiveStat, number]>).forEach(([stat, value]) => {
      scalingWeight[stat] = (scalingWeight[stat] ?? 0) + value
    })
  })
  const dominantScaling = (Object.entries(scalingWeight) as Array<[OffensiveStat, number]>)
    .sort((a, b) => b[1] - a[1])[0]?.[0]
  if (dominantScaling) {
    pushRecommendation(recommendations, stats, dominantScaling, nextCap(dominantScaling, stats[dominantScaling]), `È l’attributo con lo scaling complessivo più forte nelle armi scelte.`, 'media')
  }
  if (memorizedSpells.some((spell) => spell.spellType === 'sorcery')) {
    pushRecommendation(recommendations, stats, 'intelligence', nextCap('intelligence', stats.intelligence, [60, 80]), 'Le stregonerie beneficiano soprattutto dell’INT e del catalizzatore.', 'media')
  }
  if (memorizedSpells.some((spell) => spell.spellType === 'incantation')) {
    pushRecommendation(recommendations, stats, 'faith', nextCap('faith', stats.faith, [60, 80]), 'Gli incantesimi beneficiano soprattutto della FED e del sigillo.', 'media')
  }

  if (!strengths.length) strengths.push('La bozza è ancora neutra: aggiungi equipaggiamento per far emergere una direzione precisa.')
  if (!weaknesses.length) weaknesses.push('Nessuna criticità evidente nei controlli disponibili.')

  return { strengths: strengths.slice(0, 4), weaknesses: weaknesses.slice(0, 4), recommendations: recommendations.slice(0, 4), funding }
}
