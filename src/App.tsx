import { EyeOff, GitBranch, Languages, Map as MapIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ConceptBoard } from './components/ConceptBoard'
import { MapWorkspace } from './components/MapWorkspace'
import { TranslationArchive } from './components/TranslationArchive'

type TabId = 'board' | 'map' | 'translations'

interface RouteState {
  tab: TabId
  detail?: string
}

const tabs = [
  { id: 'board', label: 'Lavagna', caption: 'Indizi e legami', icon: GitBranch },
  { id: 'map', label: 'Mappa', caption: 'Luoghi e coordinate', icon: MapIcon },
  { id: 'translations', label: 'Analisi', caption: 'Traduzioni e fonti', icon: Languages },
] as const

function readRoute(): RouteState {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const candidate = parts[0]
  const tab: TabId =
    candidate === 'map' || candidate === 'translations' || candidate === 'board'
      ? candidate
      : 'board'
  return { tab, detail: parts[1] }
}

export default function App() {
  const [route, setRoute] = useState<RouteState>(() => readRoute())
  const mainRef = useRef<HTMLElement>(null)
  const previousTab = useRef(route.tab)

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, '', '#/board')
    }

    const handleHashChange = () => {
      const nextRoute = readRoute()
      setRoute(nextRoute)

      if (nextRoute.tab !== previousTab.current) {
        previousTab.current = nextRoute.tab
        window.requestAnimationFrame(() => mainRef.current?.focus())
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const openConcept = (conceptId: string) => {
    window.location.hash = `/board/${conceptId}`
  }

  const closeConcept = () => {
    if (readRoute().detail) window.location.hash = '/board'
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Vai al contenuto
      </a>

      <header className="site-header">
        <a className="brand" href="#/board" aria-label="Elden Rhapsody, lavagna principale">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>
            <strong>Elden Rhapsody</strong>
            <small>Archivio della Blind Run</small>
          </span>
        </a>

        <nav className="tab-navigation" aria-label="Sezioni principali">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = route.tab === tab.id
            return (
              <a
                key={tab.id}
                href={`#/${tab.id}`}
                className={active ? 'nav-tab is-active' : 'nav-tab'}
                aria-current={active ? 'page' : undefined}
              >
                <Icon aria-hidden="true" />
                <span>
                  <strong>{tab.label}</strong>
                  <small>{tab.caption}</small>
                </span>
              </a>
            )
          })}
        </nav>

        <div className="blind-badge" title="Controllare sempre i contenuti prima della pubblicazione">
          <EyeOff aria-hidden="true" />
          <span>
            <strong>Spoiler safe</strong>
            <small>Demo editoriale</small>
          </span>
        </div>
      </header>

      <main id="main-content" ref={mainRef} tabIndex={-1}>
        {route.tab === 'board' && (
          <ConceptBoard
            activeConceptId={route.detail}
            onOpenConcept={openConcept}
            onCloseConcept={closeConcept}
          />
        )}
        {route.tab === 'map' && <MapWorkspace />}
        {route.tab === 'translations' && (
          <TranslationArchive onOpenConcept={openConcept} />
        )}
      </main>

      <footer className="site-footer">
        <p>
          Fan project non ufficiale · Elden Ring e i relativi marchi appartengono ai
          rispettivi titolari.
        </p>
        <p>Costruito per seguire la scoperta, non per anticiparla.</p>
      </footer>
    </div>
  )
}
