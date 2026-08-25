import {
  ArrowRight,
  Expand,
  Grip,
  ListFilter,
  RotateCcw,
  Search,
  X,
} from 'lucide-react'
import {
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { concepts, connections } from '../data/project'
import { usePersistentState } from '../hooks/usePersistentState'
import type { BoardPosition, ConceptCategory, LoreConcept } from '../types'
import { ConceptImage } from './ConceptImage'

const defaultPositions = Object.fromEntries(
  concepts.map((concept) => [concept.id, concept.position]),
) as Record<string, BoardPosition>

const categories: Array<ConceptCategory | 'Tutti'> = [
  'Tutti',
  'Personaggio',
  'Luogo',
  'Indizio',
  'Tema',
]

const stateLabels = {
  osservato: 'Osservato in live',
  ipotesi: 'Ipotesi',
  'da-verificare': 'Da verificare',
} as const

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
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ConceptCategory | 'Tutti'>('Tutti')
  const [positions, setPositions] = usePersistentState(
    'elden-rhapsody:board-positions',
    defaultPositions,
  )
  const [draggingId, setDraggingId] = useState<string>()
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

  const visibleConcepts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('it')

    return concepts.filter((concept) => {
      const matchesCategory = category === 'Tutti' || concept.category === category
      const haystack = [concept.name, concept.summary, ...concept.tags]
        .join(' ')
        .toLocaleLowerCase('it')
      return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery))
    })
  }, [category, query])

  const visibleIds = useMemo(
    () => new Set(visibleConcepts.map((concept) => concept.id)),
    [visibleConcepts],
  )

  const visibleConnections = connections.filter(
    (connection) => visibleIds.has(connection.from) && visibleIds.has(connection.to),
  )

  const moveConcept = (conceptId: string, clientX: number, clientY: number) => {
    const board = boardRef.current
    if (!board) return

    const rect = board.getBoundingClientRect()
    const nextPosition = {
      x: clamp(((clientX - rect.left) / rect.width) * 100, 10, 90),
      y: clamp(((clientY - rect.top) / rect.height) * 100, 18, 80),
    }

    setPositions((current) => ({ ...current, [conceptId]: nextPosition }))
  }

  const handlePointerDown = (
    event: PointerEvent<HTMLButtonElement>,
    conceptId: string,
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    setDraggingId(conceptId)
    moveConcept(conceptId, event.clientX, event.clientY)
  }

  const handlePointerMove = (
    event: PointerEvent<HTMLButtonElement>,
    conceptId: string,
  ) => {
    if (draggingId !== conceptId) return
    moveConcept(conceptId, event.clientX, event.clientY)
  }

  const stopDragging = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
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
          x: clamp(previous.x + delta.x, 10, 90),
          y: clamp(previous.y + delta.y, 18, 80),
        },
      }
    })
  }

  const resetLayout = () => setPositions(defaultPositions)

  return (
    <section className="page page--board" aria-labelledby="board-title">
      <header className="page-heading board-heading">
        <div>
          <p className="overline">Archivio degli indizi</p>
          <h1 id="board-title">La trama nascosta</h1>
          <p>
            Sposta le schede, segui i fili e apri ogni appunto. Le linee continue
            indicano una traccia osservata; quelle tratteggiate un’ipotesi.
          </p>
        </div>
        <aside className="spoiler-note" aria-label="Stato contenuti">
          <span className="status-dot" aria-hidden="true" />
          <div>
            <strong>Modalità blind attiva</strong>
            <span>Contenuti demo da allineare alla run</span>
          </div>
        </aside>
      </header>

      <div className="board-toolbar" aria-label="Strumenti della lavagna">
        <label className="search-field">
          <Search aria-hidden="true" />
          <span className="sr-only">Cerca un concetto</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cerca persone, luoghi, indizi…"
          />
        </label>

        <div className="filter-strip" aria-label="Filtra per tipo">
          <ListFilter aria-hidden="true" />
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? 'filter-chip is-active' : 'filter-chip'}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <button className="icon-text-button" type="button" onClick={resetLayout}>
          <RotateCcw aria-hidden="true" />
          Ripristina
        </button>
      </div>

      <div
        ref={boardRef}
        className={draggingId ? 'concept-board is-dragging' : 'concept-board'}
        aria-label="Mappa concettuale degli indizi"
      >
        <div className="board-stamp" aria-hidden="true">
          SOLO FATTI EMERSI
        </div>

        <svg className="thread-layer" aria-hidden="true">
          {visibleConnections.map((connection) => {
            const from = positions[connection.from] || defaultPositions[connection.from]
            const to = positions[connection.to] || defaultPositions[connection.to]
            const isRelated =
              activeConceptId === connection.from || activeConceptId === connection.to

            return (
              <g
                key={connection.id}
                className={`${connection.kind === 'ipotesi' ? 'is-hypothesis' : ''}${
                  isRelated ? ' is-related' : ''
                }`}
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
              }${draggingId === concept.id ? ' is-being-dragged' : ''}`}
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
              <ConceptImage concept={concept} />
              <div className="concept-card__content">
                <div className="concept-card__meta">
                  <span>{concept.category}</span>
                  <span className={`state-badge state-badge--${concept.state}`}>
                    {stateLabels[concept.state]}
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

        {visibleConcepts.length === 0 && (
          <div className="board-empty" role="status">
            <Search aria-hidden="true" />
            <strong>Nessun indizio corrisponde alla ricerca.</strong>
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setCategory('Tutti')
              }}
            >
              Azzera i filtri
            </button>
          </div>
        )}
      </div>

      <section className="relation-index" aria-labelledby="relations-title">
        <div>
          <p className="overline">Indice accessibile</p>
          <h2 id="relations-title">Relazioni annotate</h2>
        </div>
        <div className="relation-list">
          {visibleConnections.map((connection) => {
            const from = concepts.find((concept) => concept.id === connection.from)
            const to = concepts.find((concept) => concept.id === connection.to)
            if (!from || !to) return null
            return (
              <button
                type="button"
                key={connection.id}
                onClick={() => onOpenConcept(from.id)}
              >
                <span className={`relation-mark relation-mark--${connection.kind}`} />
                <span>
                  <strong>
                    {from.name} <ArrowRight aria-hidden="true" /> {to.name}
                  </strong>
                  <small>{connection.label}</small>
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
            <span className={`state-badge state-badge--${concept.state}`}>
              {stateLabels[concept.state]}
            </span>
          </div>
          <h2 id="concept-dialog-title">{concept.name}</h2>
          <p className="dialog-lede">{concept.summary}</p>
          <p>{concept.body}</p>

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

          <section className="dialog-relations" aria-labelledby="dialog-relations-title">
            <h3 id="dialog-relations-title">Fili collegati</h3>
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
