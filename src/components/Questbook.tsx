import { ArrowLeft, ArrowRight, BookOpen, Bookmark, Check, CheckCheck, Compass, Expand, Feather, MapPin, Search, Signpost, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { quests } from '../data/quests'
import { concepts } from '../data/project'
import { usePersistentState } from '../hooks/usePersistentState'
import { isSafeContentUrl } from '../lib/urls'
import type { QuestImage, QuestStatus } from '../types'
import '../questbook.css'

const statusLabels: Record<QuestStatus, string> = {
  'in-corso': 'In corso', pista: 'Pista da verificare', conclusa: 'Conclusa',
}
const filters = [
  { id: 'tutte', label: 'Tutte', icon: BookOpen },
  { id: 'in-corso', label: 'In corso', icon: Bookmark },
  { id: 'pista', label: 'Piste', icon: Compass },
  { id: 'conclusa', label: 'Concluse', icon: CheckCheck },
] as const
type QuestFilter = typeof filters[number]['id']
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('it')

function JournalImage({ photo }: { photo: QuestImage }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [photo.imageUrl])
  return !failed && isSafeContentUrl(photo.imageUrl)
    ? <img src={photo.imageUrl} alt={photo.imageAlt} style={{ objectPosition: photo.imagePosition || '50% 50%' }} width={640} height={480} loading="lazy" decoding="async" onError={() => setFailed(true)} />
    : <span className="quest-image-fallback" role="img" aria-label="Immagine non disponibile"><Feather aria-hidden="true" /><span>Immagine non disponibile</span></span>
}

function PhotoViewer({ photo, onClose }: { photo: QuestImage; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = overflow; dialog?.close() }
  }, [])
  return <dialog className="quest-photo-dialog" ref={dialogRef} aria-labelledby="quest-photo-caption" onClose={event => {
    // Ignore a queued close from StrictMode's effect cleanup if already reopened.
    if (!event.currentTarget.open) onClose()
  }} onClick={event => {
    if (event.target !== event.currentTarget) return
    const rect = event.currentTarget.getBoundingClientRect()
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.currentTarget.close()
  }}>
    <button type="button" className="quest-photo-close" aria-label="Chiudi immagine" onClick={() => dialogRef.current?.close()}><X aria-hidden="true" /></button>
    <JournalImage photo={photo} />
    <p id="quest-photo-caption">{photo.caption || photo.imageAlt}</p>
  </dialog>
}

export function Questbook({ activeQuestId }: { activeQuestId?: string }) {
  const [filter, setFilter] = useState<QuestFilter>('tutte')
  const [query, setQuery] = useState('')
  const [lastQuestId, setLastQuestId] = usePersistentState('elden-rhapsody:questbook-page', '')
  const [photo, setPhoto] = useState<QuestImage>()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const indexRef = useRef<HTMLElement>(null)
  const previousId = useRef(activeQuestId)
  const selected = quests.find(quest => quest.id === (activeQuestId || lastQuestId)) || quests[0]
  const invalidRoute = Boolean(activeQuestId && !quests.some(quest => quest.id === activeQuestId))
  const search = normalize(query.trim())
  const visibleQuests = quests.filter(quest => (filter === 'tutte' || quest.status === filter) &&
    (!search || normalize([quest.title, quest.npc, quest.region, quest.summary, quest.lastSeen?.location, quest.destination?.location].join(' ')).includes(search)))
  const selectedIndex = visibleQuests.findIndex(quest => quest.id === selected?.id)
  const linkedConcepts = concepts.filter(concept => selected?.linkedConceptIds?.includes(concept.id))
  const activeCount = quests.filter(quest => quest.status === 'in-corso').length
  const leadCount = quests.filter(quest => quest.status === 'pista').length

  useEffect(() => {
    if (activeQuestId && !invalidRoute) setLastQuestId(activeQuestId)
    const oldId = previousId.current
    previousId.current = activeQuestId
    if (activeQuestId) {
      const frame = requestAnimationFrame(() => {
        headingRef.current?.focus({ preventScroll: true })
        const page = headingRef.current?.closest('.quest-page')
        const headingTop = headingRef.current?.getBoundingClientRect().top ?? 0
        if (window.matchMedia('(max-width: 760px)').matches || headingTop < 105 || headingTop > innerHeight) {
          page?.scrollIntoView({ block: 'start', behavior: 'instant' })
        }
      })
      return () => cancelAnimationFrame(frame)
    }
    if (oldId && window.matchMedia('(max-width: 760px)').matches) {
      const frame = requestAnimationFrame(() => {
        const link = Array.from(indexRef.current?.querySelectorAll<HTMLAnchorElement>('.quest-index-link') || []).find(item => item.dataset.questId === oldId)
        const target = link || indexRef.current
        target?.focus({ preventScroll: true })
        target?.scrollIntoView({ block: 'center', behavior: 'instant' })
      })
      return () => cancelAnimationFrame(frame)
    }
  }, [activeQuestId, invalidRoute, setLastQuestId])

  function resetFilters() { setFilter('tutte'); setQuery('') }

  return <section className="questbook" aria-labelledby="questbook-title">
    <header className="questbook-heading">
      <div><p className="overline">Diario di viaggio</p><h1 id="questbook-title">Questbook</h1></div>
      <p className="questbook-count"><BookOpen aria-hidden="true" />{quests.length ? `${activeCount} in corso · ${leadCount} ${leadCount === 1 ? 'pista' : 'piste'}` : 'Nessuna quest annotata'}</p>
    </header>

    <div className={`quest-journal${activeQuestId ? ' has-open-page' : ''}${quests.length ? '' : ' is-empty'}`}>
      <nav className="quest-bookmarks" aria-label="Filtra le quest">
        {filters.map(item => {
          const Icon = item.icon
          return <button key={item.id} type="button" className={filter === item.id ? 'is-active' : ''} aria-pressed={filter === item.id} disabled={quests.length === 0 && item.id !== 'tutte'} onClick={() => setFilter(item.id)}><Icon aria-hidden="true" /><span>{item.label}</span></button>
        })}
      </nav>

      <div className="quest-book">
        <aside className="quest-index" ref={indexRef} tabIndex={-1} aria-label="Indice delle quest">
          <div className="quest-index-heading"><Feather aria-hidden="true" /><h2>Indice</h2><span>{String(quests.length).padStart(2, '0')}</span></div>
          <label className="quest-search"><Search aria-hidden="true" /><span className="sr-only">Cerca una quest</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Cerca nome o luogo" disabled={!quests.length} /></label>
          <div className="quest-index-scroll">
            {visibleQuests.length ? <nav aria-label="Quest annotate"><ol>{visibleQuests.map(quest => <li key={quest.id}>
              <a className={`quest-index-link${selected?.id === quest.id && !invalidRoute ? ' is-selected' : ''}`} href={`#/questbook/${quest.id}`} data-quest-id={quest.id} aria-current={selected?.id === quest.id && !invalidRoute ? 'page' : undefined}>
                <Bookmark aria-hidden="true" /><span><strong>{quest.title}</strong><small>{quest.region} · {statusLabels[quest.status]}</small></span><ArrowRight className="quest-index-arrow" aria-hidden="true" />
              </a>
            </li>)}</ol></nav> : <div className="quest-index-empty">
              <p>{quests.length ? 'Nessuna quest trovata.' : 'Nessuna voce, per ora.'}</p>
              {quests.length > 0 && <button type="button" className="quest-text-button" onClick={resetFilters}>Mostra tutte le quest <ArrowRight aria-hidden="true" /></button>}
            </div>}
          </div>
          <p className="quest-index-foot" aria-live="polite">{quests.length ? `${visibleQuests.length} ${visibleQuests.length === 1 ? 'voce' : 'voci'} nell’indice` : 'Appunti della blind run'}</p>
        </aside>

        <article className="quest-page" aria-labelledby="quest-page-title">
          <a className="quest-return" href="#/questbook"><ArrowLeft aria-hidden="true" />Indice delle quest</a>
          {invalidRoute ? <div className="quest-empty-page"><Compass aria-hidden="true" /><h2 id="quest-page-title" ref={headingRef} tabIndex={-1}>Quest non trovata</h2><p>Questa pagina non è presente nel diario.</p><a className="quest-text-button" href="#/questbook">Torna all’indice <ArrowRight aria-hidden="true" /></a></div> : !selected ? <div className="quest-empty-page">
            <div className="quest-empty-emblem" aria-hidden="true"><Feather /></div>
            <p className="quest-small-label">Prima pagina</p>
            <h2 id="quest-page-title" ref={headingRef} tabIndex={-1}>Il diario è ancora vuoto</h2>
            <p>In attesa delle quest e delle tappe della live.</p>
            <div className="quest-empty-fields" aria-label="Informazioni previste per ogni quest">
              <span><MapPin aria-hidden="true" />Ultima posizione nota</span>
              <span><Signpost aria-hidden="true" />Destinazione o prossima pista</span>
              <span><CheckCheck aria-hidden="true" />Tappe percorse e immagini</span>
            </div>
          </div> : <>
            <div className="quest-page-top"><span className="quest-small-label">{selected.region}</span><span className={`quest-status quest-status--${selected.status}`}>{selected.status === 'conclusa' ? <CheckCheck aria-hidden="true" /> : selected.status === 'pista' ? <Compass aria-hidden="true" /> : <Bookmark aria-hidden="true" />}{statusLabels[selected.status]}</span></div>
            <header className={`quest-entry-heading${selected.portrait ? ' has-portrait' : ''}`}>
              <div><h2 id="quest-page-title" ref={headingRef} tabIndex={-1}>{selected.title}</h2><p className="quest-npc">{selected.npc}</p><p className="quest-summary">{selected.summary}</p></div>
              {selected.portrait && <button className="quest-portrait" type="button" aria-label={`Ingrandisci: ${selected.portrait.imageAlt}`} onClick={() => setPhoto(selected.portrait)}><JournalImage photo={selected.portrait} /><Expand aria-hidden="true" /></button>}
            </header>

            <dl className="quest-whereabouts">
              <div><dt><MapPin aria-hidden="true" />Ultima posizione nota</dt><dd><strong>{selected.lastSeen?.location || 'Non ancora annotata'}</strong>{selected.lastSeen?.note && <p>{selected.lastSeen.note}</p>}</dd></div>
              <div><dt><Signpost aria-hidden="true" />Destinazione indicata</dt><dd><strong>{selected.destination?.location || 'Non ancora nota'}</strong>{selected.destination?.note && <p>{selected.destination.note}</p>}</dd></div>
            </dl>

            <section className="quest-history" aria-labelledby="quest-history-title"><h3 id="quest-history-title">Tappe percorse</h3>{selected.steps.length ? <ol>{selected.steps.map((step, index) => <li key={`${selected.id}-${index}`}><span className="quest-step-mark"><Check aria-hidden="true" /><span className="sr-only">Tappa annotata {index + 1}</span></span><div><h4>{step.title}</h4><p>{step.text}</p></div></li>)}</ol> : <p>Nessuna tappa ancora annotata.</p>}</section>

            {selected.nextStep && <section className="quest-next-step"><Compass aria-hidden="true" /><div><h3>{selected.nextStep.hypothetical ? 'Pista da verificare' : 'Prossimo passo'}</h3><p>{selected.nextStep.text}</p></div></section>}

            {selected.gallery && selected.gallery.length > 0 && <section className="quest-gallery" aria-labelledby="quest-gallery-title"><h3 id="quest-gallery-title">Immagini e incontri</h3><div>{selected.gallery.map((item, index) => <figure key={`${selected.id}-${index}`}><button type="button" aria-label={`Ingrandisci: ${item.caption || item.imageAlt}`} onClick={() => setPhoto(item)}><JournalImage photo={item} /><Expand aria-hidden="true" /></button>{item.caption && <figcaption>{item.caption}</figcaption>}</figure>)}</div></section>}

            {linkedConcepts.length > 0 && <section className="quest-lore-links" aria-label="Appunti collegati"><h3>Sulla lavagna</h3>{linkedConcepts.map(concept => <a key={concept.id} href={`#/board/${concept.id}`}>{concept.name}<ArrowRight aria-hidden="true" /></a>)}</section>}
          </>}
          <footer className="quest-page-footer"><span>{selected && !invalidRoute ? `Pagina ${String(quests.indexOf(selected) + 1).padStart(2, '0')}` : 'Elden Rhapsody'}</span><span className="quest-page-ornament" aria-hidden="true" /><nav aria-label="Sfoglia il diario">
            {selectedIndex > 0 && <a href={`#/questbook/${visibleQuests[selectedIndex - 1].id}`} aria-label="Quest precedente"><ArrowLeft aria-hidden="true" /></a>}
            {selectedIndex >= 0 && selectedIndex < visibleQuests.length - 1 && <a href={`#/questbook/${visibleQuests[selectedIndex + 1].id}`} aria-label="Quest successiva"><ArrowRight aria-hidden="true" /></a>}
          </nav></footer>
        </article>
      </div>
    </div>
    {photo && <PhotoViewer photo={photo} onClose={() => setPhoto(undefined)} />}
  </section>
}
