import {
  AlertTriangle,
  ChevronDown,
  Download,
  ExternalLink,
  LockKeyhole,
  Map as MapIcon,
  MapPin,
  Plus,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import { type FormEvent, useEffect, useRef, useState } from 'react'
import { currentMapStage, mapgenieEmbedUrl } from '../data/project'
import { usePersistentState } from '../hooks/usePersistentState'
import { isSafeContentUrl } from '../lib/urls'
import type { MapMarker } from '../types'

const emptyForm = {
  title: '',
  region: '',
  coordinates: '',
  note: '',
  mapUrl: '',
}

function createMarkerId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `marker-${Date.now()}`
}

export function MapWorkspace() {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapReady, setMapReady] = useState(false)
  const [mapInteractionEnabled, setMapInteractionEnabled] = useState(false)
  const mapFrameRef = useRef<HTMLIFrameElement>(null)
  const discoveredMapUrl = isSafeContentUrl(currentMapStage.imageUrl)
    ? currentMapStage.imageUrl
    : undefined
  const [markers, setMarkers] = usePersistentState<MapMarker[]>(
    'elden-rhapsody:map-markers',
    [],
  )
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!mapLoaded) return

    const handleMapMessage = (event: MessageEvent) => {
      if (
        event.origin !== 'https://mapgenie.io' ||
        event.source !== mapFrameRef.current?.contentWindow ||
        typeof event.data !== 'object' ||
        event.data === null ||
        event.data.type !== 'mapready'
      ) {
        return
      }

      setMapReady(true)
    }

    window.addEventListener('message', handleMapMessage)
    return () => window.removeEventListener('message', handleMapMessage)
  }, [mapLoaded])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!form.title.trim() || !form.region.trim() || !form.coordinates.trim()) {
      setError('Inserisci nome, regione e riferimento/coordinate del punto.')
      return
    }

    if (form.mapUrl.trim() && !isSafeContentUrl(form.mapUrl.trim())) {
      setError('Il link MapGenie deve iniziare con https://.')
      return
    }

    const marker: MapMarker = {
      id: createMarkerId(),
      title: form.title.trim(),
      region: form.region.trim(),
      coordinates: form.coordinates.trim(),
      note: form.note.trim(),
      mapUrl: form.mapUrl.trim() || undefined,
      createdAt: new Date().toISOString(),
    }

    setMarkers((current) => [marker, ...current])
    setForm(emptyForm)
  }

  const exportMarkers = () => {
    const payload = JSON.stringify(
      {
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        markers,
      },
      null,
      2,
    )
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `elden-rhapsody-markers-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const removeMarker = (marker: MapMarker) => {
    if (!window.confirm(`Rimuovere “${marker.title}” dal taccuino locale?`)) return
    setMarkers((current) => current.filter((item) => item.id !== marker.id))
  }

  return (
    <section className="page page--map" aria-labelledby="map-title">
      <header className="page-heading map-heading">
        <div>
          <p className="overline">Atlante delle Terre Intermedie</p>
          <h1 id="map-title">Segna la strada</h1>
          <p>
            Esplora soltanto ciò che la run ha già scoperto e conserva qui luoghi,
            coordinate e collegamenti utili.
          </p>
        </div>
        <div
          className="map-spoiler-status"
          aria-label={`Modalità blind run attiva: ${currentMapStage.label}, MapGenie sigillata`}
        >
          <ShieldCheck aria-hidden="true" />
          <span>
            <strong>Modalità blind run</strong>
            <small>{currentMapStage.label} · MapGenie sigillata</small>
          </span>
        </div>
      </header>

      <div className="map-layout">
        <section className="map-card" aria-labelledby="interactive-map-title">
          <div className="panel-heading">
            <div>
              <span className="panel-index">01</span>
              <div>
                <h2 id="interactive-map-title">Carta scoperta</h2>
                <p>Frammenti pubblicati dalla run</p>
              </div>
            </div>
            <span className={discoveredMapUrl ? 'load-state is-ready' : 'load-state'}>
              {discoveredMapUrl ? currentMapStage.label : 'In attesa'}
            </span>
          </div>

          <div className="discovered-map-frame">
            {discoveredMapUrl ? (
              <figure className="discovered-map">
                <img
                  src={discoveredMapUrl}
                  alt={currentMapStage.imageAlt}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>
                  <ShieldCheck aria-hidden="true" />
                  {currentMapStage.label} · frammento scoperto durante la run
                </figcaption>
              </figure>
            ) : (
              <div className="map-empty-state">
                <div className="map-seal" aria-hidden="true">
                  <MapIcon />
                </div>
                <p className="overline">Progressione cartografica</p>
                <h3>Nessun frammento cartografico pubblicato</h3>
                <p>
                  Qui comparirà soltanto l’immagine della mappa già sbloccata in gioco.
                  Nel frattempo il taccuino resta disponibile senza mostrare altre zone.
                </p>
              </div>
            )}
          </div>

          <details className="mapgenie-disclosure">
            <summary>
              <div>
                <AlertTriangle aria-hidden="true" />
                <span>
                  <strong>Apri lo strumento MapGenie</strong>
                  <small>Servizio esterno · può mostrare l’intera mappa</small>
                </span>
              </div>
              <span className="mapgenie-risk-label">Rischio spoiler</span>
              <ChevronDown className="mapgenie-chevron" aria-hidden="true" />
            </summary>

            <div className="mapgenie-disclosure__body">
              <div className="mapgenie-warning">
                <AlertTriangle aria-hidden="true" />
                <div>
                  <strong>MapGenie non può essere isolata davvero su Sepolcride.</strong>
                  <p>
                    Il preset spegne ogni categoria e prova a inquadrare la regione,
                    ma il primo frame può già contenere nomi o porzioni di altre aree.
                  </p>
                </div>
              </div>

              <div className="map-frame map-frame--external">
                {!mapLoaded ? (
                  <div className="map-consent">
                    <div className="map-seal" aria-hidden="true">
                      <MapIcon />
                    </div>
                    <p className="overline">Strumento esterno</p>
                    <h3>Caricare MapGenie?</h3>
                    <p>
                      Tutti gli indicatori partiranno disattivati. Proseguendo accetti
                      che la base cartografica possa anticipare zone non ancora scoperte
                      e che l’embed usi cookie o risorse di terze parti.
                    </p>
                    <button
                      className="primary-action"
                      type="button"
                      onClick={() => setMapLoaded(true)}
                    >
                      <AlertTriangle aria-hidden="true" />
                      Carica MapGenie · rischio spoiler
                    </button>
                  </div>
                ) : (
                  <>
                    {!mapReady && (
                      <div className="map-loading" aria-live="polite">
                        Caricamento mappa…
                      </div>
                    )}
                    <iframe
                      ref={mapFrameRef}
                      className={`map-iframe${mapReady ? ' is-ready' : ''}${
                        mapInteractionEnabled ? ' is-interactive' : ''
                      }`}
                      src={mapgenieEmbedUrl}
                      title="MapGenie con tutti gli indicatori disattivati; può mostrare altre regioni"
                      loading="lazy"
                      tabIndex={mapInteractionEnabled ? 0 : -1}
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                    {mapReady && !mapInteractionEnabled && (
                      <div className="map-interaction-scrim" aria-hidden="true">
                        <span>
                          <LockKeyhole />
                          Anteprima bloccata
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {mapLoaded && (
                <div className="map-safety-controls">
                  <div>
                    {mapInteractionEnabled ? (
                      <MapIcon aria-hidden="true" />
                    ) : (
                      <LockKeyhole aria-hidden="true" />
                    )}
                    <span>
                      <strong>
                        {mapInteractionEnabled
                          ? 'Navigazione abilitata'
                          : 'Navigazione protetta'}
                      </strong>
                      <small>
                        {mapInteractionEnabled
                          ? 'Pan e zoom possono mostrare altre regioni.'
                          : 'Pan e zoom sono bloccati per limitare gli spoiler accidentali.'}
                      </small>
                    </span>
                  </div>
                  <button
                    type="button"
                    className={
                      mapInteractionEnabled
                        ? 'map-lock-button is-active'
                        : 'map-lock-button'
                    }
                    aria-pressed={mapInteractionEnabled}
                    onClick={() => setMapInteractionEnabled((current) => !current)}
                  >
                    {mapInteractionEnabled
                      ? 'Blocca navigazione'
                      : 'Abilita navigazione · rischio spoiler'}
                  </button>
                </div>
              )}

              <div className="provider-note">
                <ShieldCheck aria-hidden="true" />
                <div>
                  <strong>Preset verificato, contenimento non garantito.</strong>
                  <p>
                    Il preset è configurato con una camera su Sepolcride e zero
                    categorie. La verifica del 26 agosto 2026 ha rilevato 0 marker su
                    desktop e mobile, ma MapGenie può cambiare comportamento. L’iframe
                    cross-origin non ci permette di imporre i confini o controllare le
                    modifiche fatte al suo interno.
                  </p>
                  <p>
                    I punti del taccuino restano soltanto su questo dispositivo e non si
                    sincronizzano con l’iframe o con l’account MapGenie Pro.
                  </p>
                </div>
              </div>
            </div>
          </details>
        </section>

        <aside className="marker-ledger" aria-labelledby="marker-ledger-title">
          <div className="panel-heading">
            <div>
              <span className="panel-index">02</span>
              <div>
                <h2 id="marker-ledger-title">Taccuino cartografico</h2>
                <p>Salvato su questo dispositivo</p>
              </div>
            </div>
            <span className="marker-count">{markers.length}</span>
          </div>

          <details className="marker-form-shell" open={markers.length === 0}>
            <summary>
              <Plus aria-hidden="true" />
              Aggiungi un punto
            </summary>
            <form className="marker-form" onSubmit={handleSubmit} noValidate>
              <label>
                Nome del punto
                <input
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  placeholder="Es. ingresso della catacomba"
                  required
                />
              </label>
              <div className="form-row">
                <label>
                  Regione
                  <input
                    value={form.region}
                    onChange={(event) => setForm({ ...form, region: event.target.value })}
                    placeholder="Sepolcride"
                    required
                  />
                </label>
                <label>
                  Coordinate / riferimento
                  <input
                    value={form.coordinates}
                    onChange={(event) =>
                      setForm({ ...form, coordinates: event.target.value })
                    }
                    placeholder="X 42 · Y 61"
                    required
                  />
                </label>
              </div>
              <label>
                Link del punto su MapGenie <span>(facoltativo)</span>
                <input
                  type="url"
                  value={form.mapUrl}
                  onChange={(event) => setForm({ ...form, mapUrl: event.target.value })}
                  placeholder="https://mapgenie.io/…"
                />
              </label>
              <label>
                Nota <span>(facoltativa)</span>
                <textarea
                  value={form.note}
                  onChange={(event) => setForm({ ...form, note: event.target.value })}
                  placeholder="Perché vogliamo tornarci?"
                  rows={3}
                />
              </label>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button className="primary-action" type="submit">
                <MapPin aria-hidden="true" />
                Salva il punto
              </button>
            </form>
          </details>

          <div className="marker-list">
            {markers.length === 0 ? (
              <div className="marker-empty">
                <MapPin aria-hidden="true" />
                <strong>Il taccuino è ancora vuoto.</strong>
                <p>Aggiungi il primo luogo scoperto durante la prossima live.</p>
              </div>
            ) : (
              markers.map((marker, index) => (
                <article className="marker-item" key={marker.id}>
                  <span className="marker-number">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="marker-region">{marker.region}</p>
                    <h3>{marker.title}</h3>
                    <code>{marker.coordinates}</code>
                    {marker.note && <p>{marker.note}</p>}
                    {marker.mapUrl && isSafeContentUrl(marker.mapUrl) && (
                      <a href={marker.mapUrl} target="_blank" rel="noopener noreferrer">
                        Apri il punto
                        <ExternalLink aria-hidden="true" />
                      </a>
                    )}
                  </div>
                  <button
                    className="delete-marker"
                    type="button"
                    aria-label={`Rimuovi ${marker.title}`}
                    onClick={() => removeMarker(marker)}
                  >
                    <Trash2 aria-hidden="true" />
                  </button>
                </article>
              ))
            )}
          </div>

          {markers.length > 0 && (
            <button className="export-button" type="button" onClick={exportMarkers}>
              <Download aria-hidden="true" />
              Esporta taccuino JSON
            </button>
          )}
        </aside>
      </div>
    </section>
  )
}
