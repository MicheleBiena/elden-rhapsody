import { ArrowLeft, ArrowRight, BookOpen, Check, Grip, Minus, Plus, RotateCcw, Search, X } from 'lucide-react'
import { type CSSProperties, type KeyboardEvent, type PointerEvent, useEffect, useRef, useState } from 'react'
import { boardGroups, defaultBoardGroup, groupForConcept } from '../data/boardGroups'
import { concepts, connections } from '../data/project'
import { usePersistentState } from '../hooks/usePersistentState'
import { isSafeContentUrl } from '../lib/urls'
import type { BoardPosition, LoreConcept } from '../types'
import type { ConceptBoardProps } from './ConceptBoard'
import { ConceptImage } from './ConceptImage'

const sceneWidth = 880
const cardHeight = 262
const cardWidth = 208
const stateLabels = { osservato: 'Osservato in live', ipotesi: 'Ipotesi', 'da-verificare': 'Da verificare' }
const orderedConcepts = boardGroups.flatMap(group => group.conceptIds.map(id => concepts.find(item => item.id === id)!))
const unreadConcepts = orderedConcepts.filter(item => item.liveReadStatus === 'da-leggere')
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('it')

function readLabel(concept: LoreConcept) {
  if (concept.liveReadStatus !== 'da-leggere') return 'Già letta in live'
  return concept.liveUpdateKind === 'aggiornata' ? 'Aggiornata · da leggere' : 'Nuova · da leggere'
}

function sceneLayout(ids: string[]) {
  if (ids.length === 5) {
    const points = [{ x: 178, y: 192 }, { x: 440, y: 358 }, { x: 702, y: 192 }, { x: 178, y: 526 }, { x: 702, y: 526 }]
    return { height: 708, positions: Object.fromEntries(ids.map((id, index) => [id, points[index]])) }
  }
  const columns = Math.min(ids.length, 3)
  return {
    height: Math.max(650, Math.ceil(ids.length / columns) * 310 + 64),
    positions: Object.fromEntries(ids.map((id, index) => [id, {
      x: (sceneWidth / columns) * ((index % columns) + .5), y: 190 + Math.floor(index / columns) * 310,
    }])),
  }
}

export function DossierBoard({ activeConceptId, onOpenConcept, onCloseConcept }: ConceptBoardProps) {
  const [groupId, setGroupId] = usePersistentState('elden-rhapsody:dossier-group', defaultBoardGroup.id)
  const [positions, setPositions] = usePersistentState<Record<string, BoardPosition>>('elden-rhapsody:dossier-positions-v1', {})
  const [query, setQuery] = useState('')
  const [onlyUnread, setOnlyUnread] = useState(false)
  const [focusedWires, setFocusedWires] = useState(true)
  const [liveMode, setLiveMode] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [draggingId, setDraggingId] = useState<string>()
  const viewportRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const inspectorRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const detailScrollRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ id: string; x: number; y: number; start: BoardPosition }>()
  const panRef = useRef<{ x: number; y: number; left: number; top: number }>()
  const group = boardGroups.find(item => item.id === groupId) || defaultBoardGroup
  const groupConcepts = group.conceptIds.map(id => concepts.find(item => item.id === id)!)
  const selectedConcept = concepts.find(item => item.id === activeConceptId) || groupConcepts[0]
  const invalidRoute = Boolean(activeConceptId && !concepts.some(item => item.id === activeConceptId))
  const normalizedQuery = normalize(query.trim())
  const candidates = normalizedQuery ? orderedConcepts : groupConcepts
  const visibleConcepts = candidates.filter(concept =>
    (!onlyUnread || concept.liveReadStatus === 'da-leggere') &&
    (!normalizedQuery || normalize(`${concept.name} ${concept.summary} ${concept.tags.join(' ')}`).includes(normalizedQuery)),
  )
  const layout = sceneLayout(group.conceptIds)
  const pointFor = (id: string) => {
    const saved = positions[id]
    const fallback = layout.positions[id]
    return saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)
      ? { x: clamp(saved.x, 122, sceneWidth - 122), y: clamp(saved.y, 156, layout.height - 156) }
      : fallback
  }
  const visibleIds = new Set(visibleConcepts.map(item => item.id))
  const groupConnections = connections.filter(item => visibleIds.has(item.from) && visibleIds.has(item.to))
  const shownConnections = groupConnections.filter(item => !focusedWires || item.from === selectedConcept.id || item.to === selectedConcept.id)
  const sequence = liveMode ? unreadConcepts : groupConcepts
  const sequenceIndex = sequence.findIndex(item => item.id === selectedConcept.id)

  useEffect(() => {
    if (!activeConceptId) return
    const target = groupForConcept(activeConceptId)
    if (target) setGroupId(target.id)
    detailScrollRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [activeConceptId, setGroupId])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const fitWidth = viewport.clientWidth / sceneWidth
    const fitHeight = group.conceptIds.length <= 6 ? viewport.clientHeight / layout.height : 1
    setZoom(clamp(Math.min(1, fitWidth, fitHeight), .45, 1))
    viewport.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [group.id, group.conceptIds.length, layout.height])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    const showActiveGroup = () => {
      if (!window.matchMedia('(max-width: 1180px)').matches) return
      const active = rail.querySelector<HTMLElement>('[aria-current="true"]')
      if (!active) return
      const railRect = rail.getBoundingClientRect()
      const activeRect = active.getBoundingClientRect()
      rail.scrollTo({ left: rail.scrollLeft + activeRect.left - railRect.left - (rail.clientWidth - activeRect.width) / 2, behavior: 'instant' })
    }
    showActiveGroup()
    const observer = new ResizeObserver(showActiveGroup)
    observer.observe(rail)
    return () => observer.disconnect()
  }, [group.id])

  const revealInspector = () => {
    if (window.matchMedia('(max-width: 820px)').matches) inspectorRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
    headingRef.current?.focus({ preventScroll: true })
  }

  const openConcept = (id: string, reading = false) => {
    setLiveMode(reading)
    setQuery('')
    setOnlyUnread(false)
    onOpenConcept(id)
    window.requestAnimationFrame(revealInspector)
  }

  const chooseGroup = (id: string) => {
    const target = boardGroups.find(item => item.id === id)!
    setGroupId(id)
    setQuery('')
    setOnlyUnread(false)
    setLiveMode(false)
    onOpenConcept(target.conceptIds[0])
  }

  const moveCard = (id: string, point: BoardPosition) => setPositions(current => ({ ...current, [id]: {
    x: clamp(point.x, 122, sceneWidth - 122), y: clamp(point.y, 156, layout.height - 156),
  } }))

  const startDrag = (event: PointerEvent<HTMLButtonElement>, id: string) => {
    if (event.button !== 0) return
    event.preventDefault()
    dragRef.current = { id, x: event.clientX, y: event.clientY, start: pointFor(id) }
    event.currentTarget.setPointerCapture(event.pointerId)
    setDraggingId(id)
  }

  const moveDrag = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    if (!drag) return
    moveCard(drag.id, { x: drag.start.x + (event.clientX - drag.x) / zoom, y: drag.start.y + (event.clientY - drag.y) / zoom })
  }

  const stopDrag = () => { dragRef.current = undefined; setDraggingId(undefined) }

  const moveKey = (event: KeyboardEvent<HTMLButtonElement>, id: string) => {
    const deltas: Record<string, BoardPosition> = { ArrowLeft: { x: -12, y: 0 }, ArrowRight: { x: 12, y: 0 }, ArrowUp: { x: 0, y: -12 }, ArrowDown: { x: 0, y: 12 } }
    const delta = deltas[event.key]
    if (!delta) return
    event.preventDefault()
    const point = pointFor(id)
    moveCard(id, { x: point.x + delta.x, y: point.y + delta.y })
  }

  const fit = () => {
    const viewport = viewportRef.current
    if (!viewport) return
    setZoom(clamp(Math.min(viewport.clientWidth / sceneWidth, viewport.clientHeight / layout.height), .45, 1))
    viewport.scrollTo({ left: 0, top: 0, behavior: 'instant' })
  }

  const resetPositions = () => {
    if (!window.confirm('Ripristinare le posizioni di questo fascicolo? Le note non verranno modificate.')) return
    setPositions(current => Object.fromEntries(Object.entries(current).filter(([id]) => !group.conceptIds.includes(id))))
    fit()
  }

  return (
    <section className="dossier-page" aria-labelledby="dossier-page-title">
      <header className="dossier-heading">
        <div><p className="dossier-eyebrow">Fascicoli</p><h1 id="dossier-page-title">{normalizedQuery ? 'Risultati della ricerca' : group.label}</h1></div>
        <button className="dossier-primary" type="button" disabled={!unreadConcepts.length} onClick={() => openConcept(unreadConcepts[0].id, true)}><BookOpen aria-hidden="true" />{unreadConcepts.length} da leggere <ArrowRight aria-hidden="true" /></button>
      </header>

      <div className="dossier-workspace">
        <nav className="dossier-rail" ref={railRef} aria-label="Fascicoli tematici">
          <p className="dossier-eyebrow">Archivio <span>{concepts.length}</span></p>
          {boardGroups.map((item, index) => {
            const unread = concepts.filter(concept => item.conceptIds.includes(concept.id) && concept.liveReadStatus === 'da-leggere').length
            return <button key={item.id} type="button" className={item.id === group.id && !normalizedQuery ? 'is-active' : ''} aria-current={item.id === group.id && !normalizedQuery ? 'true' : undefined} aria-label={`${item.label}, ${item.conceptIds.length} appunti${unread ? `, ${unread} da leggere` : ''}`} onClick={() => chooseGroup(item.id)}><small>{String(index + 1).padStart(2, '0')}</small><span>{item.label}</span>{unread > 0 && <em>{unread}</em>}</button>
          })}
        </nav>

        <section className="dossier-board" aria-label={`Appunti: ${group.label}`}>
          <div className="dossier-tools">
            <label className="dossier-search"><Search aria-hidden="true" /><span className="sr-only">Cerca nell’archivio</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Cerca nell’archivio" /></label>
            <button type="button" className="dossier-control" aria-pressed={onlyUnread} onClick={() => setOnlyUnread(value => !value)}>Solo da leggere</button>
            <button type="button" className="dossier-control dossier-wire-toggle" aria-pressed={focusedWires} disabled={Boolean(normalizedQuery)} onClick={() => setFocusedWires(value => !value)}>{focusedWires ? 'Fili della selezione' : 'Tutti i fili'}</button>
          </div>

          <div className="dossier-board-status" aria-live="polite"><span>{visibleConcepts.length} appunti{normalizedQuery ? ' trovati' : ` · ${groupConnections.length} legami interni`}</span>{liveMode && <span>Lettura live</span>}</div>
          <div className={`dossier-viewport${normalizedQuery ? ' is-search' : ''}`} ref={viewportRef} tabIndex={0} aria-label="Area della lavagna; scorri per esplorare" onPointerDown={event => {
            if (event.button !== 0 || event.pointerType === 'touch' || (event.target as HTMLElement).closest('button, input, a')) return
            const viewport = event.currentTarget
            panRef.current = { x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop }
            viewport.setPointerCapture(event.pointerId)
          }} onPointerMove={event => {
            const pan = panRef.current
            if (pan) event.currentTarget.scrollTo({ left: pan.left - event.clientX + pan.x, top: pan.top - event.clientY + pan.y, behavior: 'instant' })
          }} onPointerUp={() => { panRef.current = undefined }} onPointerCancel={() => { panRef.current = undefined }}>
            {visibleConcepts.length === 0 ? <div className="dossier-empty"><p>Nessun appunto trovato.</p><button className="dossier-control" type="button" onClick={() => { setQuery(''); setOnlyUnread(false) }}>Mostra il fascicolo</button></div> : (
              <div className="dossier-extent" style={{ width: sceneWidth * zoom, height: layout.height * zoom }}>
                <div className="dossier-canvas" ref={canvasRef} style={{ width: sceneWidth, height: layout.height, transform: `scale(${zoom})`, '--scene-zoom': zoom } as CSSProperties}>
                  {!normalizedQuery && <svg className="dossier-wires" viewBox={`0 0 ${sceneWidth} ${layout.height}`} aria-hidden="true">{shownConnections.map(connection => {
                    const from = pointFor(connection.from), to = pointFor(connection.to)
                    return <path key={connection.id} data-kind={connection.kind} d={`M ${from.x} ${from.y} Q ${(from.x + to.x) / 2 + 16} ${(from.y + to.y) / 2 + 20} ${to.x} ${to.y}`} />
                  })}</svg>}
                  {visibleConcepts.map((concept, index) => {
                    const point = normalizedQuery ? { x: 0, y: 0 } : pointFor(concept.id)
                    const selected = selectedConcept.id === concept.id
                    return <article key={concept.id} data-concept-id={concept.id} className={`dossier-note${selected ? ' is-selected' : ''}${draggingId === concept.id ? ' is-dragging' : ''}${concept.liveReadStatus === 'da-leggere' ? ' is-unread' : ''}`} style={{ left: point.x, top: point.y, '--note-angle': `${[-1.5, .7, 1.5][index % 3]}deg`, '--note-width': `${cardWidth}px`, '--note-height': `${cardHeight}px` } as CSSProperties}>
                      <button className="dossier-note-open" type="button" aria-label={`Apri ${concept.name}`} aria-pressed={selected} onClick={() => openConcept(concept.id)}>
                        <ConceptImage concept={concept} />
                        {concept.liveReadStatus === 'da-leggere' && <span className="dossier-note-flag">{concept.liveUpdateKind === 'aggiornata' ? 'Aggiornata' : 'Nuova'} · da leggere</span>}
                        <span className="dossier-note-category">{concept.category}{concept.id === 'elden-ring' ? ' · Punto di partenza' : ''}</span>
                        <h2>{concept.name}</h2><p>{concept.summary}</p>
                      </button>
                      {!normalizedQuery && <button className="dossier-drag" type="button" aria-label={`Sposta ${concept.name}. Trascina o usa i tasti freccia.`} onPointerDown={event => startDrag(event, concept.id)} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag} onLostPointerCapture={stopDrag} onKeyDown={event => moveKey(event, concept.id)}><Grip aria-hidden="true" /></button>}
                    </article>
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="dossier-board-footer">
            <div className="dossier-wire-legend"><span>Osservato</span><span>Ipotesi</span></div>
            {!normalizedQuery && <div className="dossier-zoom" role="group" aria-label="Zoom del fascicolo">
              <button type="button" aria-label="Riduci zoom" disabled={zoom <= .45} onClick={() => setZoom(value => clamp(value - .1, .45, 1.5))}><Minus aria-hidden="true" /></button>
              <output aria-live="polite">{Math.round(zoom * 100)}%</output>
              <button type="button" aria-label="Aumenta zoom" disabled={zoom >= 1.5} onClick={() => setZoom(value => clamp(value + .1, .45, 1.5))}><Plus aria-hidden="true" /></button>
              <button type="button" onClick={fit}>Inquadra</button>
              <button type="button" aria-label="Ripristina posizioni del fascicolo" onClick={resetPositions}><RotateCcw aria-hidden="true" /></button>
            </div>}
          </div>
        </section>

        <aside className="dossier-inspector" ref={inspectorRef} aria-labelledby="dossier-detail-title">
          <button type="button" className="dossier-return" onClick={() => {
            const card = canvasRef.current?.querySelector<HTMLButtonElement>(`[data-concept-id="${selectedConcept.id}"] .dossier-note-open`)
            if (card) { card.scrollIntoView({ block: 'center', behavior: 'instant' }); card.focus({ preventScroll: true }) }
            else viewportRef.current?.focus()
          }}><ArrowLeft aria-hidden="true" />Torna agli appunti</button>
          <div className="dossier-detail-scroll" ref={detailScrollRef}>
            {invalidRoute ? <div className="dossier-detail"><h2 id="dossier-detail-title">Scheda non trovata</h2><button className="dossier-control" type="button" onClick={onCloseConcept}>Torna al fascicolo</button></div> : <>
              <ConceptImage concept={selectedConcept} large />
              <div className="dossier-detail">
                <div className="dossier-detail-meta"><span>{selectedConcept.category}</span><span className={selectedConcept.liveReadStatus === 'da-leggere' ? 'is-unread' : ''}>{selectedConcept.liveReadStatus === 'da-leggere' ? <BookOpen aria-hidden="true" /> : <Check aria-hidden="true" />}{readLabel(selectedConcept)}</span></div>
                <h2 id="dossier-detail-title" ref={headingRef} tabIndex={-1}>{selectedConcept.name}</h2>
                <p className="dossier-state">{selectedConcept.id === 'elden-ring' ? 'Punto di partenza del gioco' : stateLabels[selectedConcept.state]}</p>
                <p className="dossier-summary">{selectedConcept.summary}</p><p>{selectedConcept.body}</p>
                {selectedConcept.gallery?.filter(item => isSafeContentUrl(item.imageUrl)).map(item => <figure className="dossier-gallery" key={item.imageUrl}><img src={item.imageUrl} alt={item.imageAlt} loading="lazy" decoding="async" referrerPolicy="no-referrer" /><figcaption>{item.caption}</figcaption></figure>)}
                {selectedConcept.evidence.length > 0 && <details key={`evidence-${selectedConcept.id}`} className="dossier-evidence"><summary>Elementi raccolti · {selectedConcept.evidence.length}</summary><ul>{selectedConcept.evidence.map(item => <li key={item}>{item}</li>)}</ul></details>}
                {selectedConcept.questions.length > 0 && <section><h3>Domande aperte</h3><ul>{selectedConcept.questions.map(item => <li key={item}>{item}</li>)}</ul></section>}
                <section className="dossier-relations" aria-label="Collegamenti della scheda"><h3>Collegamenti</h3>{connections.filter(item => item.from === selectedConcept.id || item.to === selectedConcept.id).map(connection => {
                  const otherId = connection.from === selectedConcept.id ? connection.to : connection.from
                  const other = concepts.find(item => item.id === otherId)!
                  const otherGroup = groupForConcept(otherId)
                  return <button type="button" key={connection.id} onClick={() => openConcept(otherId)}><strong>{other.name}<ArrowRight aria-hidden="true" /></strong><small>{connection.kind === 'ipotesi' ? 'Ipotesi · ' : ''}{connection.label}{otherGroup?.id !== group.id ? ` · ${otherGroup?.label}` : ''}</small><span>{connection.note}</span></button>
                })}{!connections.some(item => item.from === selectedConcept.id || item.to === selectedConcept.id) && <p>Nessun collegamento.</p>}</section>
              </div>
            </>}
          </div>
          <div className="dossier-stepper"><div><span aria-live="polite">{liveMode ? 'Live' : 'Appunto'} {sequenceIndex + 1} di {sequence.length}</span>{liveMode && <button type="button" onClick={() => setLiveMode(false)}><X aria-hidden="true" />Esci dalla lettura live</button>}</div><div><button type="button" aria-label="Appunto precedente" disabled={sequenceIndex <= 0} onClick={() => openConcept(sequence[sequenceIndex - 1].id, liveMode)}><ArrowLeft aria-hidden="true" /></button><button type="button" aria-label="Appunto successivo" disabled={sequenceIndex < 0 || sequenceIndex >= sequence.length - 1} onClick={() => openConcept(sequence[sequenceIndex + 1].id, liveMode)}><ArrowRight aria-hidden="true" /></button></div></div>
        </aside>
      </div>
    </section>
  )
}
