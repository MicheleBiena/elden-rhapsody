import {
  Archive as ArchiveIcon,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  ExternalLink,
  Languages,
  Link2,
  LockKeyhole,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  concepts,
  isTranslationArchiveReleased,
  translationAuthorProfileUrl,
  translationPosts,
} from '../data/project'
import { isSafeContentUrl } from '../lib/urls'

interface TranslationArchiveProps {
  onOpenConcept: (conceptId: string) => void
}

export function TranslationArchive({ onOpenConcept }: TranslationArchiveProps) {
  if (!isTranslationArchiveReleased) {
    return <LockedArchive />
  }

  return <ReleasedArchive onOpenConcept={onOpenConcept} />
}

function LockedArchive() {
  return (
    <section className="page page--translations" aria-labelledby="translations-title">
      <header className="page-heading translation-heading">
        <div>
          <p className="overline">言葉と物語 · Archivio editoriale</p>
          <h1 id="translations-title">Archivio post-run</h1>
          <p>
            Una sezione riservata alle analisi dal giapponese, da consultare soltanto
            dopo la conclusione della blind run.
          </p>
        </div>
        <div className="translation-monogram translation-monogram--locked" aria-hidden="true">
          <LockKeyhole />
        </div>
      </header>

      <section
        className="post-run-gate"
        aria-labelledby="post-run-gate-title"
        aria-describedby="post-run-gate-description"
      >
        <div className="post-run-gate__seal" aria-hidden="true">
          <LockKeyhole />
          <span>POST<br />RUN</span>
        </div>
        <div className="post-run-gate__content">
          <p className="overline">Sezione sigillata · spoiler finali</p>
          <h2 id="post-run-gate-title">Si apre soltanto a run conclusa</h2>
          <p id="post-run-gate-description">
            Per proteggere la scoperta in diretta, titoli, sintesi, fonti e collegamenti
            restano nascosti fino all’annuncio pubblico del finale. Non è prevista
            un’anteprima durante la run.
          </p>

          <div className="post-run-gate__facts" aria-label="Stato dell’archivio">
            <span>
              <ArchiveIcon aria-hidden="true" />
              {translationPosts.length} analisi già catalogate
            </span>
            <span>
              <ShieldCheck aria-hidden="true" />
              Nessun titolo spoiler mostrato
            </span>
          </div>

          <a className="post-run-gate__action" href="#/board">
            <ArrowLeft aria-hidden="true" />
            Torna alla lavagna
          </a>
        </div>
      </section>
    </section>
  )
}

function ReleasedArchive({ onOpenConcept }: TranslationArchiveProps) {
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
  const firstRemainingIndex = featured ? 2 : 1

  return (
    <section className="page page--translations" aria-labelledby="translations-title">
      <header className="page-heading translation-heading">
        <div>
          <p className="overline">言葉と物語 · Parole e storia</p>
          <h1 id="translations-title">Archivio post-run</h1>
          <p>
            Analisi della lore e del testo giapponese curate da Mirko (ミルコ),
            riassunte con attribuzione e rimando alla fonte originale.
          </p>
        </div>
        <div className="translation-monogram" aria-hidden="true">
          訳
        </div>
      </header>

      <div className="post-run-status">
        <ShieldCheck aria-hidden="true" />
        <div>
          <strong>Archivio post-run aperto</strong>
          <span>Questi contenuti sono stati pubblicati solo dopo la conclusione della run.</span>
        </div>
      </div>

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
            <ArticleMeta post={featured} />
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
              <span className="article-index">
                {String(index + firstRemainingIndex).padStart(2, '0')}
              </span>
              <span>{post.eyebrow}</span>
            </header>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <ArticleMeta post={post} compact />
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
        <div className="source-policy__copy">
          <p>
            Ogni scheda offre una sintesi editoriale originale e rimanda al testo di
            Mirko. Gli articoli in inglese che duplicano un’edizione italiana non sono
            inclusi in questo indice.
          </p>
          <a
            href={translationAuthorProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visita il profilo Medium dell’autore
            <ExternalLink aria-hidden="true" />
          </a>
        </div>
      </aside>
    </section>
  )
}

function ArticleMeta({
  post,
  compact = false,
}: {
  post: (typeof translationPosts)[number]
  compact?: boolean
}) {
  return (
    <div className="post-meta">
      {!compact && (
        <span>
          <BookOpen aria-hidden="true" />
          {post.sourceName}
        </span>
      )}
      {post.publishedAt && (
        <span>
          <CalendarDays aria-hidden="true" />
          <time dateTime={post.publishedAt}>{formatPublishedAt(post.publishedAt)}</time>
        </span>
      )}
      <span>
        <Clock3 aria-hidden="true" />
        {post.readingMinutes} min
      </span>
      {compact && <span>{post.tags[0]}</span>}
    </div>
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
      className={
        compact
          ? 'source-action source-action--compact is-disabled'
          : 'source-action is-disabled'
      }
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

  if (linkedConcepts.length === 0) return null

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

function formatPublishedAt(value: string) {
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T12:00:00Z`))
}
