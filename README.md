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

### Concetti e immagini

Ogni concetto contiene:

- `id`: identificatore stabile, usato anche dai collegamenti;
- `name`, `summary`, `body`: testo della scheda;
- `state`: `osservato`, `ipotesi` oppure `da-verificare`;
- `imageUrl`: URL HTTPS opzionale o percorso relativo a un file in `public/`;
- `imageAlt`: descrizione accessibile dell’immagine;
- `position`: posizione iniziale in percentuale sulla lavagna.

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
un’immagine locale del frammento già sbloccato in gioco. Salvare, per esempio,
`public/maps/sepolcride-01.webp` e assegnare `./maps/sepolcride-01.webp` a
`currentMapStage.imageUrl` in `src/data/project.ts`. Se il valore resta vuoto, appare
un empty state privo di spoiler e il Taccuino continua a funzionare.

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
