import {
  ArrowRight,
  BookOpen,
  Clock3,
  ExternalLink,
  Languages,
  Link2,
  Search,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { concepts, translationPosts } from '../data/project'
import { isSafeContentUrl } from '../lib/urls'

interface TranslationArchiveProps {
  onOpenConcept: (conceptId: string) => void
}

export function TranslationArchive({ onOpenConcept }: TranslationArchiveProps) {
  const [query, setQuery] = useState('')

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('it')
    if (!normalizedQuery) return translationPosts

    return translationPosts.filter((post) =>
      [post.title, post.excerpt, ...post.tags]
        .join(' ')
        .toLocaleLowerCase('it')
        .includes(normalizedQuery),
    )
  }, [query])

  const featured = filteredPosts.find((post) => post.featured)
  const remaining = filteredPosts.filter((post) => post.id !== featured?.id)

  return (
    <section className="page page--translations" aria-labelledby="translations-title">
      <header className="page-heading translation-heading">
        <div>
          <p className="overline">言葉と物語 · Parole e storia</p>
          <h1 id="translations-title">Dietro le parole</h1>
          <p>
            Un indice editoriale delle analisi dal giapponese: sintesi contestuale,
            attribuzione chiara e accesso al post originale.
          </p>
        </div>
        <div className="translation-monogram" aria-hidden="true">
          訳
        </div>
      </header>

      <div className="archive-toolbar">
        <label className="search-field search-field--light">
          <Search aria-hidden="true" />
          <span className="sr-only">Cerca nelle analisi</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cerca un termine, personaggio o tema…"
          />
        </label>
        <p>
          <strong>{filteredPosts.length}</strong>{' '}
          {filteredPosts.length === 1 ? 'analisi' : 'analisi'} in archivio
        </p>
      </div>

      {featured && (
        <article className="featured-analysis">
          <div className="featured-visual" aria-hidden="true">
            <span className="vertical-copy">TRANSLATION NOTES</span>
            <Languages />
            <strong>日本語</strong>
            <small>→ ITALIANO</small>
          </div>
          <div className="featured-content">
            <p className="overline">{featured.eyebrow}</p>
            <h2>{featured.title}</h2>
            <p className="featured-excerpt">{featured.excerpt}</p>
            <div className="post-meta">
              <span>
                <BookOpen aria-hidden="true" />
                {featured.sourceName}
              </span>
              <span>
                <Clock3 aria-hidden="true" />
                {featured.readingMinutes} min
              </span>
            </div>
            <div className="tag-list" aria-label="Argomenti">
              {featured.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <SourceAction post={featured} />
            <LinkedConcepts
              conceptIds={featured.linkedConceptIds}
              onOpenConcept={onOpenConcept}
            />
          </div>
        </article>
      )}

      <div className="analysis-grid">
        {remaining.map((post, index) => (
          <article className="analysis-card" key={post.id}>
            <header>
              <span className="article-index">{String(index + 2).padStart(2, '0')}</span>
              <span>{post.eyebrow}</span>
            </header>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <div className="post-meta">
              <span>
                <Clock3 aria-hidden="true" />
                {post.readingMinutes} min
              </span>
              <span>{post.tags[0]}</span>
            </div>
            <SourceAction post={post} compact />
            <LinkedConcepts
              conceptIds={post.linkedConceptIds}
              onOpenConcept={onOpenConcept}
            />
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="archive-empty" role="status">
          <Search aria-hidden="true" />
          <h2>Nessuna analisi trovata</h2>
          <p>Prova un nome diverso o azzera la ricerca.</p>
          <button type="button" onClick={() => setQuery('')}>
            Azzera la ricerca
          </button>
        </div>
      )}

      <aside className="source-policy">
        <div>
          <Link2 aria-hidden="true" />
          <h2>Adattare, non duplicare</h2>
        </div>
        <p>
          Ogni scheda introduce il tema e rimanda alla fonte. Estratti più lunghi o
          rielaborazioni integrali verranno pubblicati solo con l’autorizzazione del
          traduttore.
        </p>
      </aside>
    </section>
  )
}

function SourceAction({
  post,
  compact = false,
}: {
  post: (typeof translationPosts)[number]
  compact?: boolean
}) {
  if (post.sourceUrl && isSafeContentUrl(post.sourceUrl)) {
    return (
      <a
        className={compact ? 'source-action source-action--compact' : 'source-action'}
        href={post.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Leggi l’analisi originale
        <ExternalLink aria-hidden="true" />
      </a>
    )
  }

  return (
    <span
      className={compact ? 'source-action source-action--compact is-disabled' : 'source-action is-disabled'}
      aria-label="Link alla fonte ancora da inserire"
    >
      Link alla fonte da inserire
      <ExternalLink aria-hidden="true" />
    </span>
  )
}

function LinkedConcepts({
  conceptIds,
  onOpenConcept,
}: {
  conceptIds: string[]
  onOpenConcept: (conceptId: string) => void
}) {
  const linkedConcepts = conceptIds
    .map((id) => concepts.find((concept) => concept.id === id))
    .filter((concept) => concept !== undefined)

  return (
    <div className="linked-concepts" aria-label="Concetti collegati">
      <span>Fascicoli collegati</span>
      <div>
        {linkedConcepts.map((concept) => (
          <button key={concept.id} type="button" onClick={() => onOpenConcept(concept.id)}>
            {concept.name}
            <ArrowRight aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  )
}
