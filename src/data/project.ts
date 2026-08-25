import type { LoreConcept, LoreConnection, TranslationPost } from '../types'

/**
 * Contenuti dimostrativi.
 *
 * Per aggiungere le immagini fornite dal progetto, valorizzare `imageUrl` con
 * un URL HTTPS (o un percorso relativo in /public) e compilare `imageAlt`.
 * Le formulazioni sono volutamente presentate come appunti/ipotesi: prima di
 * pubblicare, sostituirle con ciò che è già emerso nella blind run.
 */
export const concepts: LoreConcept[] = [
  {
    id: 'radagon',
    name: 'Radagon',
    eyebrow: 'Nome ricorrente',
    category: 'Personaggio',
    state: 'da-verificare',
    summary: 'Un nome che ritorna in dialoghi, descrizioni e simboli.',
    body: 'Questa scheda è predisposta per raccogliere soltanto le informazioni già emerse in live. Il testo definitivo potrà distinguere fatti, testimonianze e interpretazioni.',
    evidence: ['Citazione da inserire', 'Oggetto o dialogo da documentare'],
    questions: ['Quali eventi collegano davvero questi indizi?', 'La traduzione cambia il senso del passaggio?'],
    tags: ['identità', 'ordine'],
    position: { x: 49, y: 40 },
  },
  {
    id: 'miriel',
    name: 'Miriel',
    eyebrow: 'Testimonianza',
    category: 'Personaggio',
    state: 'osservato',
    summary: 'Una fonte da confrontare con cronache e descrizioni.',
    body: 'Qui può essere trascritto il dialogo visto in diretta, indicando sessione e timestamp. Le osservazioni del traduttore possono poi essere collegate dalla scheda Analisi.',
    evidence: ['Dialogo ascoltato in live', 'Contesto della conversazione'],
    questions: ['Quanto è affidabile la testimonianza?'],
    tags: ['testimonianza', 'dialogo'],
    position: { x: 19, y: 27 },
  },
  {
    id: 'chiesa-dei-voti',
    name: 'Chiesa dei Voti',
    eyebrow: 'Luogo d’indagine',
    category: 'Luogo',
    state: 'osservato',
    summary: 'Un luogo in cui architettura e racconto si incontrano.',
    body: 'La scheda luogo può includere coordinate, screenshot e personaggi incontrati. Il relativo punto sulla mappa si può conservare nel Taccuino cartografico.',
    evidence: ['Posizione visitata', 'Dettaglio ambientale da catalogare'],
    questions: ['Quale parte della storia viene conservata qui?'],
    tags: ['luogo', 'storia'],
    position: { x: 20, y: 71 },
  },
  {
    id: 'statua',
    name: 'Il segreto della statua',
    eyebrow: 'Pista aperta',
    category: 'Indizio',
    state: 'ipotesi',
    summary: 'Un dettaglio visivo che potrebbe nascondere un secondo livello.',
    body: 'Usare questo spazio per descrivere ciò che lo streamer ha visto, senza anticipare soluzioni non ancora scoperte. Le ipotesi restano separate dalle prove.',
    evidence: ['Immagine da collegare', 'Iscrizione da trascrivere'],
    questions: ['Serve un gesto, un oggetto o una conoscenza specifica?'],
    tags: ['simbolo', 'mistero'],
    position: { x: 78, y: 24 },
  },
  {
    id: 'ordine-aureo',
    name: 'Ordine Aureo',
    eyebrow: 'Tema centrale',
    category: 'Tema',
    state: 'da-verificare',
    summary: 'Parole, simboli e istituzioni da leggere come un unico sistema.',
    body: 'Una scheda tematica può aggregare molti fili senza trasformare ogni coincidenza in una certezza. Le relazioni tratteggiate indicano sempre un’ipotesi.',
    evidence: ['Simbolo ricorrente', 'Formula lessicale da confrontare'],
    questions: ['Il termine italiano conserva tutte le sfumature dell’originale?'],
    tags: ['religione', 'lessico'],
    position: { x: 80, y: 72 },
  },
  {
    id: 'regressione',
    name: 'Legge della Regressione',
    eyebrow: 'Formula da analizzare',
    category: 'Indizio',
    state: 'ipotesi',
    summary: 'Una formulazione che merita confronto fra testo italiano e giapponese.',
    body: 'La scheda è pronta per contenere testo a schermo, originale giapponese, resa italiana e nota filologica. Il collegamento al post completo resta sempre attribuito alla fonte.',
    evidence: ['Testo italiano da acquisire', 'Originale giapponese da citare'],
    questions: ['“Regressione” è il termine più preciso nel contesto?'],
    tags: ['traduzione', 'incantesimo'],
    position: { x: 50, y: 78 },
  },
]

export const connections: LoreConnection[] = [
  {
    id: 'miriel-radagon',
    from: 'miriel',
    to: 'radagon',
    label: 'testimonianza',
    note: 'Il dialogo viene registrato come fonte, non come conferma assoluta.',
    kind: 'traccia',
  },
  {
    id: 'miriel-chiesa',
    from: 'miriel',
    to: 'chiesa-dei-voti',
    label: 'incontro',
    note: 'Personaggio e luogo sono stati osservati nello stesso contesto.',
    kind: 'traccia',
  },
  {
    id: 'radagon-statue',
    from: 'radagon',
    to: 'statua',
    label: 'nome associato',
    note: 'Associazione da verificare con una prova vista durante la run.',
    kind: 'ipotesi',
  },
  {
    id: 'radagon-order',
    from: 'radagon',
    to: 'ordine-aureo',
    label: 'affinità',
    note: 'Pista tematica ancora aperta.',
    kind: 'ipotesi',
  },
  {
    id: 'statue-regression',
    from: 'statua',
    to: 'regressione',
    label: 'formula',
    note: 'Il significato della formula va verificato prima di consolidare il filo.',
    kind: 'ipotesi',
  },
  {
    id: 'regression-order',
    from: 'regressione',
    to: 'ordine-aureo',
    label: 'lessico',
    note: 'Collegamento utile per l’analisi della terminologia.',
    kind: 'traccia',
  },
  {
    id: 'chiesa-order',
    from: 'chiesa-dei-voti',
    to: 'ordine-aureo',
    label: 'iconografia',
    note: 'Dettagli ambientali da documentare con immagini e note.',
    kind: 'ipotesi',
  },
]

export const translationPosts: TranslationPost[] = [
  {
    id: 'segreto-radagon',
    title: 'Il segreto di Radagon',
    eyebrow: 'Analisi principale · URL da collegare',
    excerpt: 'Spazio predisposto per un’introduzione editoriale al post del traduttore, con rimando chiaro alla fonte originale.',
    sourceName: 'Blog del traduttore',
    readingMinutes: 8,
    tags: ['Radagon', 'terminologia', 'giapponese'],
    linkedConceptIds: ['radagon', 'statua', 'regressione'],
    featured: true,
  },
  {
    id: 'lessico-ordine',
    title: 'Il lessico dell’Ordine',
    eyebrow: 'Scheda in preparazione',
    excerpt: 'Un punto di raccolta per confrontare termini ricorrenti, contesto originale e scelte della localizzazione italiana.',
    sourceName: 'Blog del traduttore',
    readingMinutes: 6,
    tags: ['Ordine Aureo', 'glossario'],
    linkedConceptIds: ['ordine-aureo', 'regressione'],
  },
  {
    id: 'nomi-e-titoli',
    title: 'Nomi, titoli e ambiguità',
    eyebrow: 'Scheda in preparazione',
    excerpt: 'Un formato riutilizzabile per mostrare il termine giapponese, la resa ufficiale e la nota del traduttore senza duplicarne il lavoro.',
    sourceName: 'Blog del traduttore',
    readingMinutes: 5,
    tags: ['onomastica', 'adattamento'],
    linkedConceptIds: ['radagon', 'miriel'],
  },
]

export const mapgenieEmbedUrl =
  'https://mapgenie.io/elden-ring/maps/the-lands-between?embed=light'

export const mapgeniePublicUrl =
  'https://mapgenie.io/elden-ring/maps/the-lands-between'
