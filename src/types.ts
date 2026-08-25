export type ConceptCategory = 'Personaggio' | 'Luogo' | 'Indizio' | 'Tema'
export type ConceptState = 'osservato' | 'ipotesi' | 'da-verificare'

export interface BoardPosition {
  x: number
  y: number
}

export interface LoreConcept {
  id: string
  name: string
  eyebrow: string
  category: ConceptCategory
  state: ConceptState
  summary: string
  body: string
  imageUrl?: string
  imageAlt?: string
  evidence: string[]
  questions: string[]
  tags: string[]
  position: BoardPosition
}

export interface LoreConnection {
  id: string
  from: string
  to: string
  label: string
  note: string
  kind: 'traccia' | 'ipotesi'
}

export interface TranslationPost {
  id: string
  title: string
  eyebrow: string
  excerpt: string
  sourceName: string
  sourceUrl?: string
  publishedAt?: string
  readingMinutes: number
  tags: string[]
  linkedConceptIds: string[]
  featured?: boolean
}

export interface MapMarker {
  id: string
  title: string
  region: string
  coordinates: string
  note: string
  mapUrl?: string
  createdAt: string
}
