import {
  ArrowRight,
  BookOpen,
  Check,
  Expand,
  Grip,
  Minus,
  Plus,
  RotateCcw,
  X,
} from 'lucide-react'
import {
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { concepts, connections } from '../data/project'
import { usePersistentState } from '../hooks/usePersistentState'
import { isSafeContentUrl } from '../lib/urls'
import type { BoardPosition, ConceptCategory, LoreConcept } from '../types'
import { ConceptImage } from './ConceptImage'

const legacyBoardHeight = 3600
const previousBoardHeight = 4400
const boardHeight = 8000
const previousLayoutConceptIds = new Set([
  'accademia-raya-lucaria',
  'scintipietra',
])
const currentLayoutConceptIds = new Set([
  'godfrey',
  'irina',
  'galere-eterne',
  'sellen',
  'cavalieri-cuculo',
  'cristalliani',
  'caelid',
  'palude-aeonia',
  'marcescenza',
  'sellia',
  'tavola-rotonda',
  'diallos',
  'corhyn',
  'd-cacciatore',
  'hewg',
  'ordine-aureo',
  'fiamma-della-rovina',
  'coloro-che-vivono-nella-morte',
  'santa-trina',
])
const layoutOverrides: Record<string, BoardPosition> = {
  godfrey: { x: 38, y: 9 },
  'mercante-kale': { x: 10, y: 40.5 },
  boc: { x: 30, y: 40.5 },
  roderika: { x: 50, y: 40.5 },
  irina: { x: 70, y: 40.5 },
  'galere-eterne': { x: 90, y: 40.5 },
  'accademia-raya-lucaria': { x: 10, y: 47.85 },
  scintipietra: { x: 30, y: 47.85 },
  sellen: { x: 50, y: 47.85 },
  'cavalieri-cuculo': { x: 70, y: 47.85 },
  cristalliani: { x: 90, y: 47.85 },
  spiriti: { x: 30, y: 93 },
  fia: { x: 90, y: 76 },
  'gideon-ofnir': { x: 30, y: 83 },
}

const defaultPositions = Object.fromEntries(
  concepts.map((concept) => {
    const override = layoutOverrides[concept.id]
    if (override) return [concept.id, override]
    if (currentLayoutConceptIds.has(concept.id)) return [concept.id, concept.position]

    const sourceHeight = previousLayoutConceptIds.has(concept.id)
      ? previousBoardHeight
      : legacyBoardHeight
    return [
      concept.id,
      { ...concept.position, y: concept.position.y * (sourceHeight / boardHeight) },
    ]
  }),
) as Record<string, BoardPosition>

function migrateBoardPositions(
  savedPositions: Record<string, BoardPosition>,
  sourceHeight: number,
) {
  return Object.fromEntries(
    concepts.map((concept) => {
      const override = layoutOverrides[concept.id]
      const savedPosition = savedPositions[concept.id]
      return [
        concept.id,
        override ||
          (savedPosition
            ? { ...savedPosition, y: savedPosition.y * (sourceHeight / boardHeight) }
            : defaultPositions[concept.id]),
      ]
    }),
  ) as Record<string, BoardPosition>
}

function getInitialBoardPositions() {
  try {
    const currentSaved = window.localStorage.getItem('elden-rhapsody:board-positions-v4')
    if (currentSaved) {
      return migrateBoardPositions(
        JSON.parse(currentSaved) as Record<string, BoardPosition>,
        boardHeight,
      )
    }

    const previousSaved = window.localStorage.getItem('elden-rhapsody:board-positions-v3')
    if (previousSaved) {
      return migrateBoardPositions(
        JSON.parse(previousSaved) as Record<string, BoardPosition>,
        previousBoardHeight,
      )
    }

    const legacySaved = window.localStorage.getItem('elden-rhapsody:board-positions-v2')
    if (legacySaved) {
      return migrateBoardPositions(
        JSON.parse(legacySaved) as Record<string, BoardPosition>,
        legacyBoardHeight,
      )
    }
  } catch {
    // Invalid or blocked storage falls back to the curated layout.
  }

  return defaultPositions
}

const stateLabels = {
  osservato: 'Osservato in live',
  ipotesi: 'Ipotesi',
  'da-verificare': 'Da verificare',
} as const

const liveReadLabels = {
  'gia-letto': 'Già letto in live',
  'da-leggere': 'Da leggere in live',
} as const

const zoomMin = 0.7
const zoomMax = 1.4
const zoomStep = 0.1
const boardPositionBounds = {
  minX: 10,
  maxX: 90,
  minY: 3,
  maxY: 96,
} as const

const categoryOrder: ConceptCategory[] = [
  'Tema',
  'Evento',
  'Indizio',
  'Personaggio',
  'Luogo',
]

const categoryClassNames: Record<ConceptCategory, string> = {
  Tema: 'tema',
  Evento: 'evento',
  Indizio: 'indizio',
  Personaggio: 'personaggio',
  Luogo: 'luogo',
}

const boardConceptOrder = [
  'elden-ring',
  'regina-marika',
  'notte-neri-coltelli',
  'runa-della-morte',
  'albero-madre',
  'godfrey',
  'guerra-shattering',
  'semidei',
  'miquella',
  'malenia-la-recisa',
  'radahn',
  'godrick-innestato',
  'senzaluce',
  'grazia',
  'vergini-delle-dita',
  'melina',
  'hoarah-loux',
  'goldmask',
  'mangiasterco',
  'varre',
  'strega-sconosciuta',
  'due-dita',
  'mercante-kale',
  'boc',
  'roderika',
  'irina',
  'galere-eterne',
  'accademia-raya-lucaria',
  'scintipietra',
  'sellen',
  'cavalieri-cuculo',
  'cristalliani',
  'caelid',
  'palude-aeonia',
  'marcescenza',
  'sellia',
  'tavola-rotonda',
  'diallos',
  'corhyn',
  'd-cacciatore',
  'fia',
  'gideon-ofnir',
  'hewg',
  'ordine-aureo',
  'spiriti',
  'fiamma-della-rovina',
  'coloro-che-vivono-nella-morte',
  'santa-trina',
] as const

const orderedConcepts = boardConceptOrder
  .map((conceptId) => concepts.find((concept) => concept.id === conceptId))
  .filter((concept): concept is LoreConcept => Boolean(concept))

const boardZones = [
  {
    id: 'ordine-spezzato',
    label: 'Ordine spezzato',
    note: 'Marika, l’Elden Ring e la guerra dei semidei',
    top: 0.4,
    height: 17.2,
  },
  {
    id: 'chiamata-senzaluce',
    label: 'Chiamata dei Senzaluce',
    note: 'Grazia, vergini e figure dell’introduzione',
    top: 18.9,
    height: 18,
  },
  {
    id: 'primi-incontri',
    label: 'Primi incontri nel viaggio',
    note: 'Mercanti, richieste e prigioni incontrate nel viaggio',
    top: 37.8,
    height: 6.3,
  },
  {
    id: 'sapere-delle-stelle',
    label: 'Sapere delle stelle',
    note: 'Accademia, scintipietra e correnti di studio',
    top: 45.1,
    height: 8.8,
  },
  {
    id: 'terre-marcescenti',
    label: 'Caelid e terre marcescenti',
    note: 'Aeonia, Sellia e la contaminazione scarlatta',
    top: 56,
    height: 12,
  },
  {
    id: 'tavola-rotonda',
    label: 'Visitatori della Tavola Rotonda',
    note: 'Ospiti, membri e prigionieri raccolti attorno alla Tavola',
    top: 70,
    height: 16,
  },
  {
    id: 'fede-morte-sonno',
    label: 'Fede, morte e sonno',
    note: 'Due Dita, spiriti e dottrine ai margini',
    top: 88,
    height: 10,
  },
] as const

interface ConceptBoardProps {
  activeConceptId?: string
  onOpenConcept: (conceptId: string) => void
  onCloseConcept: () => void
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function ConceptBoard({
  activeConceptId,
  onOpenConcept,
  onCloseConcept,
}: ConceptBoardProps) {
  const [zoom, setZoom] = useState(1)
  const [initialPositions] = useState(getInitialBoardPositions)
  const [positions, setPositions] = usePersistentState(
    'elden-rhapsody:board-positions-v5',
    initialPositions,
  )
  const [draggingId, setDraggingId] = useState<string>()
  const dragOffsetRef = useRef<BoardPosition | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const activeConcept = concepts.find((concept) => concept.id === activeConceptId)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (activeConcept && !dialog.open) dialog.showModal()
    if (!activeConcept && dialog.open) dialog.close()
  }, [activeConcept])

  useEffect(() => {
    if (!activeConcept) return
    document.body.classList.add('modal-open')
    return () => document.body.classList.remove('modal-open')
  }, [activeConcept])

  const visibleConcepts = orderedConcepts
  const visibleConnections = connections
  const unreadConcepts = visibleConcepts.filter(
    (concept) => concept.liveReadStatus === 'da-leggere',
  )
  const visibleCategories = categoryOrder
    .map((name) => ({
      name,
      count: visibleConcepts.filter((concept) => concept.category === name).length,
    }))
    .filter((item) => item.count > 0)

  const moveConcept = (conceptId: string, clientX: number, clientY: number) => {
    const board = boardRef.current
    if (!board) return

    const rect = board.getBoundingClientRect()
    const nextPosition = {
      x: clamp(
        ((clientX - rect.left) / rect.width) * 100,
        boardPositionBounds.minX,
        boardPositionBounds.maxX,
      ),
      y: clamp(
        ((clientY - rect.top) / rect.height) * 100,
        boardPositionBounds.minY,
        boardPositionBounds.maxY,
      ),
    }

    setPositions((current) => ({ ...current, [conceptId]: nextPosition }))
  }

  const handlePointerDown = (
    event: PointerEvent<HTMLButtonElement>,
    conceptId: string,
  ) => {
    const card = event.currentTarget.closest<HTMLElement>('.concept-card')
    if (!card) return

    const cardRect = card.getBoundingClientRect()
    dragOffsetRef.current = {
      x: event.clientX - (cardRect.left + cardRect.width / 2),
      y: event.clientY - (cardRect.top + cardRect.height / 2),
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    setDraggingId(conceptId)
  }

  const handlePointerMove = (
    event: PointerEvent<HTMLButtonElement>,
    conceptId: string,
  ) => {
    const dragOffset = dragOffsetRef.current
    if (draggingId !== conceptId || !dragOffset) return
    moveConcept(
      conceptId,
      event.clientX - dragOffset.x,
      event.clientY - dragOffset.y,
    )
  }

  const stopDragging = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    dragOffsetRef.current = null
    setDraggingId(undefined)
  }

  const handleMoveKey = (
    event: KeyboardEvent<HTMLButtonElement>,
    conceptId: string,
  ) => {
    const deltas: Record<string, BoardPosition> = {
      ArrowUp: { x: 0, y: -2 },
      ArrowDown: { x: 0, y: 2 },
      ArrowLeft: { x: -2, y: 0 },
      ArrowRight: { x: 2, y: 0 },
    }
    const delta = deltas[event.key]
    if (!delta) return

    event.preventDefault()
    setPositions((current) => {
      const previous = current[conceptId] || defaultPositions[conceptId]
      return {
        ...current,
        [conceptId]: {
          x: clamp(
            previous.x + delta.x,
            boardPositionBounds.minX,
            boardPositionBounds.maxX,
          ),
          y: clamp(
            previous.y + delta.y,
            boardPositionBounds.minY,
            boardPositionBounds.maxY,
          ),
        },
      }
    })
  }

  const resetLayout = () => {
    setPositions(defaultPositions)
    setZoom(1)
  }

  const changeZoom = (delta: number) => {
    setZoom((current) =>
      Number(clamp(current + delta, zoomMin, zoomMax).toFixed(1)),
    )
  }

  return (
    <section className="page page--board" aria-labelledby="board-title">
      <header className="page-heading board-heading">
        <div>
          <p className="overline">Archivio degli indizi</p>
          <h1 id="board-title">La trama nascosta</h1>
          <p>
            La lavagna cresce soltanto con ciò che emerge durante la blind run.
            Ogni scoperta futura partirà dal primo mistero.
          </p>
        </div>
        <aside
          className={`spoiler-note board-live-note${
            unreadConcepts.length > 0 ? ' has-unread' : ''
          }`}
          aria-label="Stato contenuti per la prossima live"
        >
          <span className="status-dot" aria-hidden="true" />
          <div>
            <strong>
              {unreadConcepts.length > 0
                ? `${unreadConcepts.length} novità da leggere`
                : 'Tutto già letto'}
            </strong>
            <span>
              {visibleConcepts.length} appunti · {visibleConnections.length} fili
            </span>
            {unreadConcepts[0] && (
              <button
                type="button"
                onClick={() => onOpenConcept(unreadConcepts[0].id)}
              >
                <BookOpen aria-hidden="true" />
                Apri la prima novità
              </button>
            )}
          </div>
        </aside>
      </header>

      <div className="board-toolbar board-toolbar--focused" aria-label="Strumenti della lavagna">
        <div className="board-origin-note">
          <span className="board-origin-note__mark" aria-hidden="true" />
          <span>
            <strong>Da qui inizia il gioco</strong>
            <small>L’Elden Ring resta il punto di partenza di ogni scoperta.</small>
          </span>
        </div>

        <div className="zoom-controls" role="group" aria-label="Zoom della lavagna">
          <button
            type="button"
            aria-label="Riduci zoom"
            disabled={zoom <= zoomMin}
            onClick={() => changeZoom(-zoomStep)}
          >
            <Minus aria-hidden="true" />
          </button>
          <output aria-live="polite" aria-label={`Zoom ${Math.round(zoom * 100)}%`}>
            {Math.round(zoom * 100)}%
          </output>
          <button
            type="button"
            aria-label="Aumenta zoom"
            disabled={zoom >= zoomMax}
            onClick={() => changeZoom(zoomStep)}
          >
            <Plus aria-hidden="true" />
          </button>
        </div>

        <button className="icon-text-button" type="button" onClick={resetLayout}>
          <RotateCcw aria-hidden="true" />
          Reimposta vista
        </button>
      </div>

      <section className="board-legend" aria-labelledby="board-legend-title">
        <div>
          <p className="overline">Chiave di lettura</p>
          <h2 id="board-legend-title">Legenda della lavagna</h2>
        </div>
        <div className="board-legend__groups">
          <div className="legend-items" aria-label="Categorie presenti">
            {visibleCategories.map((item) => (
              <span key={item.name}>
                <i
                  className={`category-mark category-mark--${categoryClassNames[item.name]}`}
                  aria-hidden="true"
                />
                {item.name}
                <small>{item.count}</small>
              </span>
            ))}
          </div>
          <div className="legend-items legend-items--threads" aria-label="Tipi di collegamento">
            <span>
              <i className="thread-sample" aria-hidden="true" />
              Traccia osservata
            </span>
            <span>
              <i className="thread-sample is-hypothesis" aria-hidden="true" />
              Ipotesi
            </span>
          </div>
          <div className="legend-items legend-items--live" aria-label="Stato di lettura in live">
            <span>
              <i className="live-status-mark live-status-mark--read" aria-hidden="true" />
              Già letto
            </span>
            <span>
              <i className="live-status-mark live-status-mark--unread" aria-hidden="true" />
              Da leggere
              <small>{unreadConcepts.length}</small>
            </span>
          </div>
        </div>
      </section>

      <div
        className={draggingId ? 'concept-board is-dragging' : 'concept-board'}
        aria-label="Mappa concettuale degli indizi"
      >
        <div
          ref={boardRef}
          className="board-canvas"
          style={
            {
              '--board-zoom': zoom,
              '--board-mobile-gap': `${Math.max(
                48,
                Math.round(80 + (zoom - 1) * 400),
              )}px`,
            } as React.CSSProperties
          }
        >
          <div className="board-stamp" aria-hidden="true">
            DA QUI INIZIA IL GIOCO
          </div>

          <div className="board-zones" aria-hidden="true">
            {boardZones.map((zone, index) => (
              <div
                key={zone.id}
                className={`board-zone board-zone--${zone.id}`}
                style={{ top: `${zone.top}%`, height: `${zone.height}%` }}
              >
                <div className="board-zone__heading">
                  <small>{String(index + 1).padStart(2, '0')}</small>
                  <span>
                    <strong>{zone.label}</strong>
                    <em>{zone.note}</em>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <svg className="thread-layer" aria-hidden="true">
            {visibleConnections.map((connection) => {
              const from = positions[connection.from] || defaultPositions[connection.from]
              const to = positions[connection.to] || defaultPositions[connection.to]
              const fromConcept = concepts.find((concept) => concept.id === connection.from)
              const toConcept = concepts.find((concept) => concept.id === connection.to)
              const isNewConnection = [fromConcept, toConcept].some(
                (concept) => concept?.liveReadStatus === 'da-leggere',
              )
              const isRelated =
                activeConceptId === connection.from || activeConceptId === connection.to

              return (
                <g
                  key={connection.id}
                  className={`${connection.kind === 'ipotesi' ? 'is-hypothesis' : ''}${
                    isRelated ? ' is-related' : ''
                  }${isNewConnection ? ' is-new' : ''}`}
                >
                  <line
                    className="thread-shadow"
                    x1={`${from.x}%`}
                    y1={`${from.y}%`}
                    x2={`${to.x}%`}
                    y2={`${to.y}%`}
                  />
                  <line
                    className="thread"
                    x1={`${from.x}%`}
                    y1={`${from.y}%`}
                    x2={`${to.x}%`}
                    y2={`${to.y}%`}
                  />
                </g>
              )
            })}
          </svg>

          {visibleConcepts.map((concept, index) => {
            const position = positions[concept.id] || defaultPositions[concept.id]
            const relatedToActive = activeConceptId
              ? connections.some(
                  (connection) =>
                    (connection.from === activeConceptId && connection.to === concept.id) ||
                    (connection.to === activeConceptId && connection.from === concept.id),
                )
              : false
            const isDimmed = Boolean(
              activeConceptId && concept.id !== activeConceptId && !relatedToActive,
            )

            return (
              <article
                key={concept.id}
                className={`concept-card concept-card--${(index % 3) + 1}${
                  isDimmed ? ' is-dimmed' : ''
                }${draggingId === concept.id ? ' is-being-dragged' : ''}${
                  concept.liveReadStatus === 'da-leggere' ? ' is-unread' : ' is-read'
                }`}
                style={{ left: `${position.x}%`, top: `${position.y}%` }}
              >
                <span className="push-pin" aria-hidden="true" />
                <button
                  className="drag-handle"
                  type="button"
                  aria-label={`Sposta ${concept.name}. Usa il trascinamento oppure i tasti freccia.`}
                  onPointerDown={(event) => handlePointerDown(event, concept.id)}
                  onPointerMove={(event) => handlePointerMove(event, concept.id)}
                  onPointerUp={stopDragging}
                  onPointerCancel={stopDragging}
                  onKeyDown={(event) => handleMoveKey(event, concept.id)}
                >
                  <Grip aria-hidden="true" />
                </button>
                <div
                  className={`live-read-badge live-read-badge--${concept.liveReadStatus}`}
                  aria-label={`Stato per la live: ${liveReadLabels[concept.liveReadStatus]}`}
                >
                  {concept.liveReadStatus === 'da-leggere' ? (
                    <BookOpen aria-hidden="true" />
                  ) : (
                    <Check aria-hidden="true" />
                  )}
                  {liveReadLabels[concept.liveReadStatus]}
                </div>
                <ConceptImage concept={concept} />
                <div className="concept-card__content">
                  <div className="concept-card__meta">
                    <span
                      className={`concept-category concept-category--${categoryClassNames[concept.category]}`}
                    >
                      {concept.category}
                    </span>
                    <span className={`state-badge state-badge--${concept.state}`}>
                      {concept.id === 'elden-ring'
                        ? 'Punto di partenza'
                        : stateLabels[concept.state]}
                    </span>
                  </div>
                  <h2>{concept.name}</h2>
                  <p>{concept.summary}</p>
                  <button
                    className="card-action"
                    type="button"
                    onClick={() => onOpenConcept(concept.id)}
                  >
                    Apri il fascicolo
                    <Expand aria-hidden="true" />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      <section className="relation-index" aria-labelledby="relations-title">
        <div>
          <p className="overline">Indice accessibile</p>
          <h2 id="relations-title">Relazioni annotate</h2>
        </div>
        <div className="relation-list">
          {visibleConnections.length === 0 && (
            <p className="relation-empty">
              Nessun filo ancora. La prima connessione apparirà quando la run offrirà
              un nuovo indizio.
            </p>
          )}
          {visibleConnections.map((connection) => {
            const from = concepts.find((concept) => concept.id === connection.from)
            const to = concepts.find((concept) => concept.id === connection.to)
            if (!from || !to) return null
            const isNewConnection =
              from.liveReadStatus === 'da-leggere' ||
              to.liveReadStatus === 'da-leggere'
            return (
              <button
                type="button"
                key={connection.id}
                className={isNewConnection ? 'is-new' : undefined}
                onClick={() => onOpenConcept(from.id)}
              >
                <span className={`relation-mark relation-mark--${connection.kind}`} />
                <span>
                  <strong>
                    {from.name} <ArrowRight aria-hidden="true" /> {to.name}
                  </strong>
                  <small>
                    {isNewConnection ? 'Nuovo · ' : ''}
                    {connection.label}
                  </small>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <ConceptDialog
        dialogRef={dialogRef}
        concept={activeConcept}
        onClose={onCloseConcept}
        onOpenConcept={onOpenConcept}
      />
    </section>
  )
}

interface ConceptDialogProps {
  dialogRef: React.RefObject<HTMLDialogElement>
  concept?: LoreConcept
  onClose: () => void
  onOpenConcept: (conceptId: string) => void
}

function ConceptDialog({
  dialogRef,
  concept,
  onClose,
  onOpenConcept,
}: ConceptDialogProps) {
  if (!concept) {
    return <dialog ref={dialogRef} className="concept-dialog" onClose={onClose} />
  }

  const conceptConnections = connections.filter(
    (connection) => connection.from === concept.id || connection.to === concept.id,
  )

  return (
    <dialog
      ref={dialogRef}
      className="concept-dialog"
      aria-labelledby="concept-dialog-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close()
      }}
    >
      <div className="dialog-sheet">
        <button
          className="dialog-close"
          type="button"
          aria-label="Chiudi il fascicolo"
          onClick={() => dialogRef.current?.close()}
        >
          <X aria-hidden="true" />
        </button>
        <ConceptImage concept={concept} large />
        <div className="dialog-content">
          <div className="dialog-kicker">
            <span>{concept.eyebrow}</span>
            <span className={`live-read-badge live-read-badge--${concept.liveReadStatus}`}>
              {concept.liveReadStatus === 'da-leggere' ? (
                <BookOpen aria-hidden="true" />
              ) : (
                <Check aria-hidden="true" />
              )}
              {liveReadLabels[concept.liveReadStatus]}
            </span>
            <span className={`state-badge state-badge--${concept.state}`}>
              {stateLabels[concept.state]}
            </span>
          </div>
          <h2 id="concept-dialog-title">{concept.name}</h2>
          <p className="dialog-lede">{concept.summary}</p>
          <p>{concept.body}</p>

          {concept.gallery && concept.gallery.length > 0 && (
            <section className="concept-gallery" aria-label={`Immagini aggiuntive di ${concept.name}`}>
              {concept.gallery
                .filter((item) => isSafeContentUrl(item.imageUrl))
                .map((item) => (
                  <figure key={`${item.imageUrl}-${item.caption}`}>
                    <img
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      width="720"
                      height="480"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                    <figcaption>{item.caption}</figcaption>
                  </figure>
                ))}
            </section>
          )}

          {(concept.evidence.length > 0 || concept.questions.length > 0) && (
            <div className="dialog-columns">
              <section>
                <h3>Elementi raccolti</h3>
                <ul>
                  {concept.evidence.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3>Domande aperte</h3>
                <ul>
                  {concept.questions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>
          )}

          <section className="dialog-relations" aria-labelledby="dialog-relations-title">
            <h3 id="dialog-relations-title">Fili collegati</h3>
            {conceptConnections.length === 0 && (
              <p className="dialog-relations__empty">
                Nessun collegamento: da qui inizia il gioco.
              </p>
            )}
            {conceptConnections.map((connection) => {
              const otherId =
                connection.from === concept.id ? connection.to : connection.from
              const other = concepts.find((item) => item.id === otherId)
              if (!other) return null
              return (
                <button
                  type="button"
                  key={connection.id}
                  onClick={() => onOpenConcept(other.id)}
                >
                  <span>
                    <strong>{other.name}</strong>
                    <small>
                      {connection.label} · {connection.note}
                    </small>
                  </span>
                  <ArrowRight aria-hidden="true" />
                </button>
              )
            })}
          </section>
        </div>
      </div>
    </dialog>
  )
}
