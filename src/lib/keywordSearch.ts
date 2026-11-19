import type { LoreConcept, QuestEntry } from '../types'

export interface KeywordSearchProps {
  query: string
  setQuery: (value: string) => void
}

export function normalizeKeyword(text: string) {
  return text.normalize('NFD').replace(/\p{M}/gu, '').replace(/[’‘]/g, "'").toLocaleLowerCase('it')
}

export function findKeywordExcerpt(fields: (string | undefined)[], keyword: string) {
  if (!keyword) return undefined
  for (const field of fields) {
    if (!field) continue
    const normalized = normalizeKeyword(field)
    const index = normalized.indexOf(keyword)
    if (index < 0) continue
    if (normalized.length !== field.length) return field
    // Keep the whole matching phrase plus a little context on either side.
    const start = Math.max(0, index - 28)
    const end = index + keyword.length + 65
    return `${start ? '…' : ''}${field.slice(start, end)}${end < field.length ? '…' : ''}`
  }
}

export function conceptExcerpt(concept: LoreConcept, keyword: string) {
  return findKeywordExcerpt([
    concept.name, concept.summary, concept.body, concept.eyebrow, concept.category,
    ...concept.textSections?.flatMap(section => [section.title, section.text]) ?? [],
    ...concept.evidence, ...concept.questions, ...concept.tags,
    ...concept.gallery?.map(image => image.caption) ?? [],
    ...concept.externalLinks?.map(link => link.label) ?? [],
  ], keyword)
}

export function questExcerpt(quest: QuestEntry, keyword: string) {
  // Trainer advice remains sealed and is excluded from search results.
  return findKeywordExcerpt([
    quest.title, quest.summary, quest.npc, quest.region,
    quest.lastSeen?.location, quest.lastSeen?.note, quest.destination?.location, quest.destination?.note,
    ...quest.steps.flatMap(step => [step.title, step.text]), quest.nextStep?.text,
    ...quest.targets?.flatMap(target => [target.name, target.epithet, target.location, target.description]) ?? [],
    ...quest.gallery?.map(image => image.caption) ?? [],
  ], keyword)
}
