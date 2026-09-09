# Elden Rhapsody

Companion site statico per seguire una blind run di Elden Ring senza perdere il filo: una lavagna investigativa, un taccuino cartografico collegato a MapGenie e un archivio delle analisi di traduzione.

## Leftoff per il prossimo agente — 9 settembre 2026

Leggere questa sezione prima di intervenire. Il progetto è già funzionante e
pubblicato: non va ricreato né riportato alla sola anteprima.

### Stato alla consegna

- Sito: [Elden Rhapsody](https://michelebiena.github.io/elden-rhapsody/#/board).
- Repository: `MicheleBiena/elden-rhapsody`, branch di lavoro e pubblicazione `main`.
- Stack: React 18, TypeScript, Vite 6, CSS, icone Lucide; sito statico senza backend.
- Redesign **Fascicoli** già pubblico, con 8 gruppi, 50 schede e 77 collegamenti.
  La vecchia **Lavagna completa** resta disponibile: è una seconda vista, non un tema.
- Unico tema dei Fascicoli: **sughero freddo**. Toggle e variante calda rimossi;
  la vecchia preferenza `elden-rhapsody:dossier-theme` viene ignorata.
- Ultima modifica applicativa: commit `819f9e4`, inquadrature dei volti di Edgar
  (`imagePosition: '50% 10%'`) e Progenie (`'100% 20%'`). Il componente condiviso
  applica il punto focale alle miniature e alle immagini di dettaglio.
- Build locale e `npm test` superati; ritagli controllati visivamente a 1440 e
  375 px. [Deploy di `819f9e4`](https://github.com/MicheleBiena/elden-rhapsody/actions/runs/34246450060)
  completato con successo. Il precedente deploy `a79231e` era fallito con un
  `403` nel recupero degli artefatti; quello successivo include anche tale modifica.
- Nessuna modifica funzionale rimasta da completare: attendere il prossimo
  aggiornamento dell'utente. Questa sezione fotografa lo stato, non è una lista di
  nuove funzionalità da implementare.

### Preferenze e vincoli dell'utente

- Scrivere in italiano. Testi brevi e concreti, senza slogan, frasi decorative o
  sottotitoli come «una fortezza, due doveri»: basta il titolo del fascicolo.
- Usare la skill `ui-ux-pro-max` per interventi UI/UX; in questo ambiente si trova
  in `C:/Users/Michele/.codex/skills/ui-ux-pro-max/SKILL.md`. Leggerla prima del lavoro.
- **Non usare ImageGen.** Le immagini vengono fornite dall'utente; per correggere
  i ritagli usare `imagePosition`, senza rigenerare o sovrascrivere gli originali.
- Commit e push sono autorizzati dopo le verifiche, salvo esplicita istruzione
  contraria («testiamo ma non pushiamo / committiamo»). Conservare eventuali
  modifiche dell'utente già presenti nel worktree.
- Non aggiungere conoscenze future del gioco. Le wiki possono contenere spoiler:
  usare solo informazioni compatibili con ciò che l'utente ha raccontato in live.
- Non sbloccare Analisi o nuove regioni della mappa senza richiesta. Non cancellare
  pin, posizioni personali o chiavi di storage per semplificare una modifica.

### Punto della blind run e novità

Ultimo episodio: esplorazione di Castel Morne. Edgar è stato incontrato e ha
ricevuto la lettera; Irina è stata trovata morta, ma non siamo tornati da Edgar.
La Progenie Leonina **non è stata sconfitta**. La somiglianza Progenie–Hewg resta
un'ipotesi visiva, non un'appartenenza confermata.

Le sole 5 schede «da leggere» sono `irina` (aggiornata), `castel-morne`,
`edgar-castellano`, `progenie`, `progenie-leonina` (nuove). Tutte le altre sono
già lette. Non segnare queste cinque come lette solo perché è stato corretto il layout.

Per il prossimo episodio, in `src/data/project.ts`:

1. Aggiornare `conceptArchive` e `connections`, mantenendo stabili gli ID esistenti.
2. Sostituire `currentEpisodeConceptIds` con gli ID nuovi o aggiornati di quella live.
3. Aggiornare anche il calcolo di `liveUpdateKind` nell'export `concepts`: al momento
   distingue esplicitamente `irina` dalle quattro schede nuove. Non basta modificare
   il campo `liveReadStatus` dentro `conceptArchive`, perché viene sovrascritto.
4. Assegnare gli ID nuovi in `src/data/boardGroups.ts`. Se si condensano schede,
   controllare tutti i riferimenti e i collegamenti; non lasciare ID orfani.
5. Adeguare le aspettative editoriali dei test (conteggi, gruppi, sequenza delle
   novità) quando cambia davvero il contenuto, senza rimuovere i controlli funzionali.

### Dove intervenire

| File | Responsabilità |
| --- | --- |
| `src/data/project.ts` | Schede, fili, novità, articoli, mappa corrente e blocco post-run |
| `src/data/boardGroups.ts` | Gruppi dei Fascicoli e ordine delle schede |
| `src/components/ConceptBoard.tsx` | Selettore Fascicoli / Lavagna completa |
| `src/components/DossierBoard.tsx` + `src/dossier-board.css` | Redesign pubblico, ricerca, drag, zoom, pannello e navigazione delle novità |
| `src/components/ClassicBoard.tsx` | Lavagna precedente e compatibilità delle posizioni |
| `src/components/ConceptImage.tsx` | Immagini condivise, punto focale e fallback |
| `src/components/MapWorkspace.tsx` + `src/lib/mapMarkers.ts` | Mappa locale, annotazioni X/Y, export e migrazione pin |
| `src/components/TranslationArchive.tsx` | Archivio esclusivamente post-run |
| `src/App.tsx` | Navigazione hash e integrazione delle tre sezioni |
| `src/types.ts` | Tipi dei contenuti e dei marker |
| `public/concepts/`, `public/maps/` | Immagini locali fornite dall'utente |
| `scripts/dossier-test.mjs`, `scripts/map-migration-test.mjs`, `scripts/smoke-test.mjs` | Test browser |
| `design-system/elden-rhapsody/` | Studio e prototipo storico; `atelier.html` non è l'app pubblicata |

### Verifica e pubblicazione: sequenza pratica

Controllare prima `git status --short --branch`. Se mancano le dipendenze, usare
`npm ci`. Poi, da due terminali:

```powershell
# Terminale 1: ricompilare prima di ogni verifica della preview
npm run build
npm run preview -- --host 127.0.0.1
```

```powershell
# Terminale 2: con la preview disponibile sulla porta 4173
npm test
npm run smoke
git diff --check
git diff --stat
```

I test usano `playwright-core` e Chrome installato localmente. Il percorso
predefinito è `C:/Program Files/Google/Chrome/Application/chrome.exe`; se diverso,
impostare `CHROME_PATH`. `ELDEN_RHAPSODY_URL` cambia l'URL di test, normalmente
`http://localhost:4173/`. Gli screenshot vanno in `artifacts/`, ignorata da Git:
eventuali script temporanei al suo interno non sono necessari su un clone nuovo.

Se compare `ERR_CONNECTION_REFUSED`, avviare la preview; se compare un errore di
permessi del sandbox (`EPERM`, ad esempio su `C:/Users/Michele`), richiedere
l'esecuzione autorizzata invece di modificare il codice. Nei test, aspettare il
render della destinazione oltre al cambio di hash: il solo `waitForURL` può
precedere l'aggiornamento del titolo React.

Dopo le verifiche, aggiungere al commit solo i file pertinenti e fare push su
`main`. Il workflow parte automaticamente: controllare su GitHub Actions che
**build e deploy** siano riusciti prima di dichiarare il sito aggiornato.
In caso di errore leggere job e annotazioni; per un problema transitorio di
artefatti usare «Re-run failed jobs», senza cambiare il workflow alla cieca.
Non versionare `dist/`, `node_modules/` o `artifacts/`.

## Avvio locale

```bash
npm install
npm run dev
```

La build di produzione si verifica con:

```bash
npm run build
npm run preview
```

## Aggiornare i contenuti

I contenuti editoriali sono raccolti in `src/data/project.ts`.

### Fascicoli e lavagna completa

La vista iniziale è **Fascicoli**: otto gruppi tematici definiti in
`src/data/boardGroups.ts`, ricerca sull’intero archivio, filtro delle novità e
pannello di lettura laterale. Su telefono le carte diventano un elenco e il
dettaglio si raggiunge toccando la scheda; «Torna agli appunti» ripristina il focus.
La sequenza «da leggere» non cambia lo stato editoriale delle schede.

Il tema usa soltanto il sughero freddo. Su desktop, le maniglie consentono di
spostare le carte anche con i tasti freccia; lo sfondo si trascina per esplorare.
Zoom e «Inquadra» sono indipendenti dalle posizioni. Il ripristino riguarda solo
il fascicolo corrente e richiede conferma. Le posizioni dei fascicoli sono salvate
separatamente in `elden-rhapsody:dossier-positions-v1`.

**Lavagna completa** conserva la vista precedente con tutte le schede, tutti i
fili e le disposizioni personali già salvate in `elden-rhapsody:board-positions-v6`.
La modalità e l’ultimo fascicolo vengono ricordati nel browser; i link
`#/board/<id>` continuano ad aprire la scheda in entrambe le modalità.

Per aggiungere un concetto, assegnarne l’ID a un gruppo. Gli ID non assegnati
compaiono comunque in «Altri appunti». Impostare `currentEpisodeConceptIds` per le
novità e `liveUpdateKind` per distinguere schede nuove e aggiornate; non aggiungere
slogan o sottotitoli decorativi ai fascicoli.

Verifica completa: con la preview avviata, `npm test` controlla fascicoli e
migrazione dei pin; `npm run smoke` verifica la lavagna completa, mappa e gate
post-run. Gli screenshot di test finiscono in `artifacts/` (non versionata).

### Concetti e immagini

Ogni concetto contiene:

- `id`: identificatore stabile, usato anche dai collegamenti;
- `name`, `summary`, `body`: testo della scheda;
- `state`: `osservato`, `ipotesi` oppure `da-verificare`;
- `imageUrl`: URL HTTPS opzionale o percorso relativo a un file in `public/`;
- `imageAlt`: descrizione accessibile dell’immagine;
- `imagePosition`: punto focale CSS opzionale dell’immagine;
- `position`: posizione iniziale in percentuale sulla lavagna completa.

Esempio:

```ts
{
  id: 'nuovo-indizio',
  name: 'Nuovo indizio',
  imageUrl: 'https://example.com/immagine.jpg',
  imageAlt: 'Descrizione precisa di ciò che si vede',
  // ...
}
```

Se `imageUrl` è assente o non raggiungibile, l’interfaccia mostra automaticamente un segnaposto. Le posizioni spostate dal visitatore vengono conservate solo nel suo browser.

### Fili rossi

I collegamenti sono nell’array `connections`. `kind: 'traccia'` produce un filo continuo; `kind: 'ipotesi'` un filo tratteggiato. Entrambi hanno sempre una descrizione testuale accessibile.

### MapGenie e coordinate

Durante la blind run il pannello principale **non carica MapGenie**: mostra soltanto
un’immagine locale dei frammenti già sbloccati in gioco. La carta attuale è
`public/maps/sepolcride-penisola-del-pianto.jpg` (1080 × 1509), fornita dall’utente
[tramite Reddit](https://preview.redd.it/the-map-of-limgrave-and-weeping-peninsula-in-high-quality-v0-g2stod2v35c91.jpg?width=1080&crop=smart&auto=webp&s=db5a66c9ef34e8bbf424b63d3a8d566a2672c4d2).
Immagine, dimensioni e identificativo sono in `currentMapStage` in `src/data/project.ts`.
Se `imageUrl` resta vuoto, appare
un empty state privo di spoiler e il Taccuino continua a funzionare.

La carta precedente, `sepolcride-01.webp` (1080 × 760), coincide con il ritaglio
superiore della nuova. Al primo accesso alla mappa, i pin locali vengono copiati da
`elden-rhapsody:map-markers` a `elden-rhapsody:map-markers-v2`: X resta invariata,
Y diventa `Y × 760 / 1509`. I valori percentuali cambiano ma i luoghi indicati no.
La chiave precedente rimane intatta come copia di sicurezza; il caricamento
successivo usa la v2, anche quando è vuota, evitando conversioni ripetute o il
ripristino di pin cancellati. Le note senza X/Y e i riferimenti scritti a mano
vengono conservati. Ogni nuovo pin registra `mapStageId`; l’export JSON v2 include
anche identificativo e dimensioni della carta. Per altre immagini, aggiungere una
migrazione esplicita: non cambiare soltanto il file o le dimensioni.

Verifica dedicata: dopo `npm run build`, avviare `npm run preview` e lanciare
`npm run test:map`. Il test usa un browser isolato e controlla corrispondenza delle
immagini, migrazione, copia originale, click su mobile, export e cancellazione.

MapGenie resta in una sezione secondaria chiusa e richiede due azioni esplicite prima
di caricare l’iframe. Il suo preset usa il sentinel inesistente `locationIds=-1` per
forzare una selezione vuota e disattivare tutte le categorie, insieme a una camera
verificata su Sepolcride
(`x=-0.718767643`, `y=0.62524538`,
`zoom=13.3`). Il parametro tecnico `route=p0;0` fa applicare la camera al client
MapGenie attuale, senza produrre marker o tracciati visibili; `popup=false` evita
l’apertura di schede. Pan e zoom restano inoltre bloccati finché l’utente non accetta
di nuovo il rischio di vedere altre regioni.

MapGenie non offre un ritaglio rigido della regione: dopo aver abilitato la
navigazione è ancora possibile spostarsi oltre Sepolcride o ridurre lo zoom. I
parametri del preset funzionano nell’embed attuale ma non sono documentati
pubblicamente, quindi vanno ricontrollati quando si aggiorna la mappa. Le credenziali
Pro non devono mai essere inserite nel repository o nel JavaScript.

I punti aggiunti nel Taccuino cartografico:

- restano nel `localStorage` del singolo dispositivo;
- non possono sincronizzarsi automaticamente con l’iframe cross-origin;
- possono contenere il link pubblico di una nota MapGenie Pro;
- possono essere esportati in JSON.

Per contenuti condivisi e versionati, trasferire i punti approvati nel file dati prima della build. Prima di pubblicare link Pro, verificarli in una finestra anonima.

### Analisi di traduzione

La scheda **Analisi è esclusivamente post-run**. Finché la blind run non è conclusa,
`isTranslationArchiveReleased` deve restare impostato su `false`: il sito mostra solo
un avviso e non renderizza titoli, sintesi o link. Dopo il finale, portare il valore a
`true` e pubblicare una nuova build.

L’indice in `translationPosts` raccoglie i 19 articoli italiani completi dedicati a
Elden Ring pubblicati da Mirko (ミルコ) su Medium, verificati al 25 agosto 2026. Sono
esclusi i duplicati in inglese, le risposte brevi e gli articoli su altri giochi. Ogni
scheda contiene una sintesi editoriale originale, attribuzione, link alla fonte e gli
eventuali collegamenti ai concetti della lavagna; il testo integrale non viene
duplicato.

> Nota: il blocco protegge l’esperienza sul sito, non rende segreti i dati presenti in
> un repository pubblico. Se anche il codice sorgente deve restare privo di spoiler,
> i contenuti vanno conservati fuori dal branch pubblico fino alla fine della run.

## Pubblicazione su GitHub Pages

Il workflow `.github/workflows/deploy.yml` esegue automaticamente la build e pubblica `dist/` a ogni push su `main`. Nelle impostazioni del repository, selezionare **Settings → Pages → Source: GitHub Actions**.

Vite usa asset relativi e la navigazione usa hash (`#/board`, `#/map`, `#/translations`), quindi il sito funziona anche sotto il path di un repository GitHub Pages senza regole server aggiuntive.

## Nota editoriale

I testi sono appunti editoriali della blind run. A ogni aggiornamento vanno allineati alla sessione corrente, separando sempre:

1. ciò che è stato osservato in live;
2. ciò che è solo un’ipotesi;
3. ciò che non è ancora stato verificato.

Elden Rhapsody è un fan project non ufficiale. Elden Ring e i relativi marchi appartengono ai rispettivi titolari.
