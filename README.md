# Elden Rhapsody

Companion site statico per seguire una blind run di Elden Ring senza perdere il filo: una lavagna investigativa, un taccuino cartografico collegato a MapGenie e un archivio delle analisi di traduzione.

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

I testi inclusi sono dimostrativi e formulati come appunti. Prima della pubblicazione vanno allineati alla sessione corrente della blind run, separando sempre:

1. ciò che è stato osservato in live;
2. ciò che è solo un’ipotesi;
3. ciò che non è ancora stato verificato.

Elden Rhapsody è un fan project non ufficiale. Elden Ring e i relativi marchi appartengono ai rispettivi titolari.
# elden-rhapsody
