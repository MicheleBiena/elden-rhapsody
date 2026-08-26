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

/**
 * Portare a `true` soltanto dopo la conclusione pubblica della blind run.
 * Finché resta `false`, titoli, sintesi e link non vengono renderizzati nel sito.
 */
export const isTranslationArchiveReleased: boolean = false

export const translationAuthorProfileUrl = 'https://medium.com/@Mirko_LaMi'

const translationSourceName = 'Mirko (ミルコ) · Medium'

/**
 * Indice verificato il 25 agosto 2026. Include i 19 articoli italiani completi
 * dedicati a Elden Ring; esclude duplicati ENG, risposte brevi e altri giochi.
 */
export const translationPosts: TranslationPost[] = [
  {
    id: 'foglie-cadute-capitolo-1',
    title: 'Le Foglie Cadute: la Cronologia completa di Elden Ring — Capitolo 1 (ITA)',
    eyebrow: 'Cronologia · Capitolo 1',
    excerpt:
      'Avvia la ricostruzione cronologica dalla preistoria dell’Albero Madre, ordinando gli indizi sulle origini cosmiche, Farum Azula e le prime civiltà dell’Interregno. Separa le prove di gioco dalle ipotesi ancora aperte.',
    sourceName: translationSourceName,
    sourceUrl:
      'https://medium.com/@Mirko_LaMi/le-foglie-cadute-la-cronologia-completa-di-elden-ring-capitolo-1-ita-9311d4494851',
    publishedAt: '2026-08-11',
    readingMinutes: 49,
    tags: ['cronologia', 'preistoria', 'Farum Azula'],
    linkedConceptIds: ['ordine-aureo'],
  },
  {
    id: 'frammenti-lore-iv',
    title: 'Frammenti di Lore IV: Pergamena del Rito segreto (Elden Ring Lore ITA)',
    eyebrow: 'Frammenti di Lore · IV',
    excerpt:
      'Confronta la Pergamena del Rito segreto con il testo giapponese: il ritorno del dio è guidato da un lord, la cui anima necessita di un ricettacolo. L’analisi distingue questo rito, legato a Miquella e Radahn, dall’ascesa di Marika.',
    sourceName: translationSourceName,
    sourceUrl:
      'https://medium.com/@Mirko_LaMi/frammenti-di-lore-iv-pergamena-del-rito-segreto-elden-ring-lore-ita-b7ade28441bc',
    publishedAt: '2026-04-09',
    readingMinutes: 10,
    tags: ['rito segreto', 'Miquella', 'testo giapponese'],
    linkedConceptIds: ['ordine-aureo'],
  },
  {
    id: 'foglie-cadute-prologo',
    title: 'Le Foglie Cadute: la Cronologia completa di Elden Ring — Prologo (ITA)',
    eyebrow: 'Cronologia · Prologo',
    excerpt:
      'Presenta metodo e limiti di una cronologia complessiva di gioco base e DLC. La localizzazione italiana resta il riferimento principale, affiancata dallo script giapponese quando una sfumatura è utile alla ricostruzione.',
    sourceName: translationSourceName,
    sourceUrl:
      'https://medium.com/@Mirko_LaMi/le-foglie-cadute-la-cronologia-completa-di-elden-ring-prologo-ita-ac263e6cd224',
    publishedAt: '2026-03-03',
    readingMinutes: 5,
    tags: ['cronologia', 'metodo', 'fonti'],
    linkedConceptIds: ['ordine-aureo'],
  },
  {
    id: 'terra-dei-numen',
    title: 'La terra dei Numen è nel Regno dell’Ombra (Elden Ring Lore ITA)',
    eyebrow: 'Popoli · Origini',
    excerpt:
      'Parte dal termine giapponese marebito, dalla longevità e dalla rarità dei Numen per indagarne l’origine. Mette in relazione le loro proprietà con le sciamane, Marika e il Regno dell’Ombra, dichiarando apertamente i passaggi più speculativi.',
    sourceName: translationSourceName,
    sourceUrl:
      'https://medium.com/@Mirko_LaMi/la-terra-dei-numen-%C3%A8-nel-regno-dellombra-elden-ring-lore-ita-f64473c7e5c0',
    publishedAt: '2025-07-01',
    readingMinutes: 17,
    tags: ['Numen', 'marebito', 'Regno dell’Ombra'],
    linkedConceptIds: ['ordine-aureo'],
  },
  {
    id: 'radagon-marika-revisione',
    title: 'Radagon e Marika — una risposta al mistero più grande di Elden Ring (Elden Ring Lore ITA)',
    eyebrow: 'Radagon · Ricostruzione aggiornata',
    excerpt:
      'Rivede la spiegazione proposta nel 2022 e cerca basi più solide nella Legge del Regresso, nella Runa del Mai Nato e nel tema della rinascita. Interpreta Radagon come alter ego di Marika che, vivendo separatamente, sviluppa una volontà propria.',
    sourceName: translationSourceName,
    sourceUrl:
      'https://medium.com/@Mirko_LaMi/radagon-e-marika-una-risposta-al-mistero-pi%C3%B9-grande-di-elden-ring-elden-ring-lore-ita-bde790fed398',
    publishedAt: '2025-04-11',
    readingMinutes: 27,
    tags: ['Radagon', 'Marika', 'rinascita'],
    linkedConceptIds: ['radagon', 'statua', 'regressione', 'ordine-aureo'],
  },
  {
    id: 'frammenti-lore-iii',
    title: 'Frammenti di Lore III: Radagon e la maledizione dei Giganti (Elden Ring Lore ITA)',
    eyebrow: 'Frammenti di Lore · III',
    excerpt:
      'Rilegge la descrizione della Treccia Rossa del Gigante nelle diverse versioni linguistiche. Il giapponese collega la maledizione alla condanna del Gigante del Fuoco, non a un sortilegio sui capelli o alle origini di Radagon.',
    sourceName: translationSourceName,
    sourceUrl:
      'https://medium.com/@Mirko_LaMi/frammenti-di-lore-iii-radagon-e-la-maledizione-dei-giganti-elden-ring-lore-ita-7b6090aee963',
    publishedAt: '2025-03-24',
    readingMinutes: 9,
    tags: ['Radagon', 'Giganti', 'Treccia Rossa'],
    linkedConceptIds: ['radagon'],
  },
  {
    id: 'frammenti-lore-ii',
    title: 'Frammenti di Lore II: La prima divinità (Elden Ring Lore ITA)',
    eyebrow: 'Frammenti di Lore · II',
    excerpt:
      'Indaga la fanciulla scolpita nell’arena di Maliketh e il contesto antichissimo di Farum Azula. La identifica in via ipotetica con la prima divinità e ricettacolo dell’Elden Ring, legata a Placidusax e forse ai Nox.',
    sourceName: translationSourceName,
    sourceUrl:
      'https://medium.com/@Mirko_LaMi/frammenti-di-lore-ii-la-prima-divinit%C3%A0-elden-ring-lore-ita-57368e349b4d',
    publishedAt: '2025-03-17',
    readingMinutes: 12,
    tags: ['Farum Azula', 'Placidusax', 'prima divinità'],
    linkedConceptIds: ['ordine-aureo'],
  },
  {
    id: 'frammenti-lore-i',
    title: 'Frammenti di Lore I: Come è nato l’Albero Ombra (Elden Ring Lore ITA)',
    eyebrow: 'Frammenti di Lore · I',
    excerpt:
      'Collega la nascita dell’Albero Ombra a quella dell’Albero Madre e al rapporto tra Marika, Elden Ring e Ordine. L’ombra viene letta come manifestazione dei pensieri più oscuri associati all’inizio del nuovo ordine.',
    sourceName: translationSourceName,
    sourceUrl:
      'https://medium.com/@Mirko_LaMi/frammenti-di-lore-i-come-%C3%A8-nato-lalbero-ombra-elden-ring-lore-ita-28473cf1d8c2',
    publishedAt: '2025-02-14',
    readingMinutes: 5,
    tags: ['Albero Ombra', 'Marika', 'Ordine'],
    linkedConceptIds: ['ordine-aureo'],
  },
  {
    id: 'seduction-betrayal',
    title: 'The Seduction and the Betrayal: di come Marika ha tradito le sciamane per diventare una dea — Elden Ring Lore (ITA)',
    eyebrow: 'Marika · Teoria estesa',
    excerpt:
      'Ricostruisce l’ascesa di Marika attraverso il Villaggio delle sciamane, gli Araldi del Corno e il Cancello divino. La teoria, non confermata apertamente dal gioco, propone che la futura dea abbia accettato il sacrificio del proprio clan per reclamare l’Elden Ring.',
    sourceName: translationSourceName,
    sourceUrl:
      'https://medium.com/@Mirko_LaMi/the-seduction-and-the-betrayal-di-come-marika-ha-tradito-la-sua-famiglia-per-diventare-una-dea-9339b524a3c7',
    publishedAt: '2024-12-09',
    readingMinutes: 45,
    tags: ['Marika', 'sciamane', 'Cancello divino'],
    linkedConceptIds: ['radagon', 'ordine-aureo'],
  },
  {
    id: 'cancello-divino',
    title: 'Spiegazione del Cancello divino — Elden Ring Lore (ITA)',
    eyebrow: 'Regno dell’Ombra · Divinità',
    excerpt:
      'Spiega il funzionamento del Cancello divino partendo da rune, Grazia e Crogiolo come forme di energia vitale. L’ascesa viene letta come accumulo e trasferimento di potere, non come privilegio irraggiungibile dei soli dèi.',
    sourceName: translationSourceName,
    sourceUrl:
      'https://medium.com/@Mirko_LaMi/spiegazione-del-cancello-divino-elden-ring-lore-ita-2f386992202d',
    publishedAt: '2024-10-23',
    readingMinutes: 18,
    tags: ['Cancello divino', 'Grazia', 'Crogiolo'],
    linkedConceptIds: ['ordine-aureo'],
  },
  {
    id: 'lost-in-translation',
    title: 'Shadow of the Erdtree — Lost in translation (ITA)',
    eyebrow: 'Traduzione · DLC',
    excerpt:
      'Cataloga sfumature ed errori individuati confrontando il DLC con lo script giapponese, dal Villaggio delle sciamane ad alcuni passaggi centrali della lore. L’autore contestualizza i limiti del lavoro di localizzazione senza trasformare l’analisi in un attacco ai traduttori.',
    sourceName: translationSourceName,
    sourceUrl:
      'https://medium.com/@Mirko_LaMi/shadow-of-the-erdtree-lost-in-translation-ita-0a815ea306d2',
    publishedAt: '2024-07-14',
    readingMinutes: 18,
    tags: ['traduzione', 'testo giapponese', 'DLC'],
    linkedConceptIds: ['ordine-aureo'],
  },
  {
    id: 'altra-roba-shadow',
    title: 'E’ uscita ALTRA roba su Shadow of the Erdtree…',
    eyebrow: 'Archivio pre-release · III',
    excerpt:
      'Raccoglie le informazioni dello Story Trailer e del playtest, confrontando anche i sottotitoli giapponesi. Le teorie su Messmer, Marika, Crogiolo e Regno dell’Ombra sono conservate come fotografia del dibattito prima dell’uscita del DLC.',
    sourceName: translationSourceName,
    sourceUrl:
      'https://medium.com/@Mirko_LaMi/e-uscita-altra-roba-su-shadow-of-the-erdtree-66e579959b28',
    publishedAt: '2024-06-07',
    readingMinutes: 26,
    tags: ['pre-release', 'Messmer', 'Story Trailer'],
    linkedConceptIds: ['ordine-aureo'],
  },
  {
    id: 'trailer-shadow-appendice',
    title: 'E’ uscito il trailer di Shadow of the Erdtree… (APPENDICE)',
    eyebrow: 'Archivio pre-release · II',
    excerpt:
      'Parte da un’immagine promozionale per esaminare una figura mascherata e la cultura suggerita dalla narrazione ambientale. Scarta alcune letture e conserva come congettura pre-release un possibile legame fra umanità antica e Crogiolo.',
    sourceName: translationSourceName,
    sourceUrl:
      'https://medium.com/@Mirko_LaMi/e-uscito-il-trailer-di-shadow-of-the-erdtree-appendice-e9559dafa2f8',
    publishedAt: '2024-05-20',
    readingMinutes: 8,
    tags: ['pre-release', 'immagine promozionale', 'ambiente'],
    linkedConceptIds: [],
  },
  {
    id: 'trailer-shadow',
    title: 'E’ uscito il trailer di Shadow of the Erdtree…',
    eyebrow: 'Archivio pre-release · I',
    excerpt:
      'Raccoglie indizi, traduzioni e teorie emerse dal primo gameplay trailer e dalle interviste a Miyazaki. È presentato come documento pre-release: utile per seguire l’evoluzione delle ipotesi, non come ricostruzione definitiva del DLC.',
    sourceName: translationSourceName,
    sourceUrl:
      'https://medium.com/@Mirko_LaMi/e-uscito-il-trailer-di-shadow-of-the-erdtree-2fba3b6cf24a',
    publishedAt: '2024-05-16',
    readingMinutes: 45,
    tags: ['pre-release', 'trailer', 'Miquella'],
    linkedConceptIds: [],
  },
  {
    id: 'maledizione-presagi',
    title: 'Le origini della Maledizione dei Presagi (Elden Ring Lore ITA)',
    eyebrow: 'Presagi · Teoria',
    excerpt:
      'Esamina corna, spiriti rancorosi, Catacombe e linfa dell’Albero Madre per proporre un’origine della maledizione dei Presagi. La tesi la interpreta come effetto collaterale del ciclo della Grazia e come falla interna all’Ordine di Marika.',
    sourceName: translationSourceName,
    sourceUrl:
      'https://medium.com/@Mirko_LaMi/le-origini-della-maledizione-dei-presagi-elden-ring-lore-ita-36ba79f89ca7',
    publishedAt: '2024-04-08',
    readingMinutes: 12,
    tags: ['Presagi', 'spiriti', 'Grazia'],
    linkedConceptIds: ['ordine-aureo'],
  },
  {
    id: 'testo-originale-lore',
    title: 'Ma il testo originale è davvero così fondamentale per comprendere la Lore?',
    eyebrow: 'Metodo · Traduzione',
    excerpt:
      'Usa i pronomi di Malenia e Marika per mostrare come lo script giapponese possa conservare sfumature sociali e caratteriali difficili da trasferire. Non svaluta le localizzazioni: spiega quando il confronto con l’originale può precisare una lettura.',
    sourceName: translationSourceName,
    sourceUrl:
      'https://medium.com/@Mirko_LaMi/ma-il-testo-originale-%C3%A8-davvero-cos%C3%AC-fondamentale-per-comprendere-la-lore-8c11b358da5',
    publishedAt: '2023-09-06',
    readingMinutes: 5,
    tags: ['testo giapponese', 'Malenia', 'metodo'],
    linkedConceptIds: ['ordine-aureo'],
  },
  {
    id: 'crogiolo',
    title: 'Il Crogiolo (ITA)',
    eyebrow: 'Cosmologia · Origini',
    excerpt:
      'Interpreta il Crogiolo come fase primordiale dell’Albero Madre e sua forza vitale originaria, non come entità indipendente precedente all’Elden Ring. Collega inoltre i tratti atavici al ciclo di vita e morte, segnalando come ipotesi i passaggi più incerti.',
    sourceName: translationSourceName,
    sourceUrl: 'https://medium.com/@Mirko_LaMi/il-crogiolo-ita-de336ddb5202',
    publishedAt: '2023-01-12',
    readingMinutes: 7,
    tags: ['Crogiolo', 'Albero Madre', 'vita primordiale'],
    linkedConceptIds: ['ordine-aureo'],
  },
  {
    id: 'dei-elden-ring',
    title: 'Gli dei di Elden Ring (ITA)',
    eyebrow: 'Divinità · Testo giapponese',
    excerpt:
      'Partendo dal concetto shintoista di kami, mette in discussione l’idea degli Dei Esterni come fazioni cosmiche in guerra. Li interpreta come manifestazioni immanenti di forze naturali e li distingue dagli individui divini capaci di imporre un Ordine tramite l’Elden Ring.',
    sourceName: translationSourceName,
    sourceUrl: 'https://medium.com/@Mirko_LaMi/gli-dei-di-elden-ring-ita-af6b6d88d05b',
    publishedAt: '2022-12-20',
    readingMinutes: 10,
    tags: ['Dei Esterni', 'kami', 'Volontà Superiore'],
    linkedConceptIds: ['ordine-aureo', 'radagon'],
  },
  {
    id: 'segreto-radagon',
    title: 'Il segreto di Radagon (ITA)',
    eyebrow: 'Radagon · Analisi del 2022',
    excerpt:
      'Affronta l’identità di Radagon e Marika attraverso dialoghi, descrizioni giapponesi, rinascita e Ordine Aureo. È una tappa storica della ricerca dell’autore: la successiva analisi del 2025 ne rivede la tesi e propone basi differenti.',
    sourceName: translationSourceName,
    sourceUrl: 'https://medium.com/@Mirko_LaMi/il-segreto-di-radagon-ita-e5c0923dc8a8',
    publishedAt: '2022-11-11',
    readingMinutes: 22,
    tags: ['Radagon', 'Marika', 'rinascita'],
    linkedConceptIds: ['radagon', 'statua', 'regressione', 'ordine-aureo', 'miriel'],
    featured: true,
  },
]

export const mapgenieEmbedUrl =
  'https://mapgenie.io/elden-ring/maps/the-lands-between?embed=light&locationIds=-1&route=p0%3B0&popup=false&x=-0.718767643&y=0.62524538&zoom=13.3'

export const currentMapStage = {
  id: 'sepolcride-01',
  label: 'Sepolcride',
  imageUrl: undefined as string | undefined,
  imageAlt: 'Frammento di Sepolcride scoperto durante la blind run',
}
