import {
  Download,
  ExternalLink,
  Map as MapIcon,
  MapPin,
  Plus,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { mapgenieEmbedUrl, mapgeniePublicUrl } from '../data/project'
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
  const [markers, setMarkers] = usePersistentState<MapMarker[]>(
    'elden-rhapsody:map-markers',
    [],
  )
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

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
            Consulta MapGenie e conserva qui luoghi, coordinate e link condivisibili
            emersi durante la run.
          </p>
        </div>
        <a
          className="secondary-action"
          href={mapgeniePublicUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Apri MapGenie
          <ExternalLink aria-hidden="true" />
        </a>
      </header>

      <div className="map-layout">
        <section className="map-card" aria-labelledby="interactive-map-title">
          <div className="panel-heading">
            <div>
              <span className="panel-index">01</span>
              <div>
                <h2 id="interactive-map-title">Mappa interattiva</h2>
                <p>Servizio esterno · MapGenie</p>
              </div>
            </div>
            {mapLoaded && (
              <span className={mapReady ? 'load-state is-ready' : 'load-state'}>
                {mapReady ? 'Mappa caricata' : 'Caricamento…'}
              </span>
            )}
          </div>

          <div className="map-frame">
            {!mapLoaded ? (
              <div className="map-consent">
                <div className="map-seal" aria-hidden="true">
                  <MapIcon />
                </div>
                <p className="overline">Connessione esterna</p>
                <h3>Caricare la mappa di MapGenie?</h3>
                <p>
                  L’embed può usare cookie e risorse di terze parti. Non inviamo né
                  conserviamo le credenziali del tuo account Pro.
                </p>
                <button
                  className="primary-action"
                  type="button"
                  onClick={() => setMapLoaded(true)}
                >
                  <MapIcon aria-hidden="true" />
                  Carica la mappa
                </button>
              </div>
            ) : (
              <>
                {!mapReady && <div className="map-loading" aria-live="polite">Caricamento mappa…</div>}
                <iframe
                  className={mapReady ? 'map-iframe is-ready' : 'map-iframe'}
                  src={mapgenieEmbedUrl}
                  title="Mappa interattiva di Elden Ring su MapGenie"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  onLoad={() => setMapReady(true)}
                />
              </>
            )}
          </div>

          <div className="provider-note">
            <ShieldCheck aria-hidden="true" />
            <p>
              I punti salvati in questa pagina non si sincronizzano automaticamente
              con l’iframe. Usa il link del punto MapGenie per mantenere un riferimento
              preciso anche dopo pan e zoom.
            </p>
          </div>
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
