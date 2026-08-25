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

L’iframe ufficiale viene caricato solo dopo un’azione esplicita dell’utente. Le credenziali Pro non devono mai essere inserite nel repository o nel JavaScript.

I punti aggiunti nel Taccuino cartografico:

- restano nel `localStorage` del singolo dispositivo;
- non possono sincronizzarsi automaticamente con l’iframe cross-origin;
- possono contenere il link pubblico di una nota MapGenie Pro;
- possono essere esportati in JSON.

Per contenuti condivisi e versionati, trasferire i punti approvati nel file dati prima della build. Prima di pubblicare link Pro, verificarli in una finestra anonima.

### Analisi di traduzione

Le schede in `translationPosts` prevedono `sourceUrl`, attribuzione, estratto breve e collegamenti ai concetti della lavagna. Il testo integrale del blog va riadattato o ripubblicato solo con l’autorizzazione dell’autore.

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
