# Questbook — guida rapida

Per aggiungere o aggiornare le quest basta modificare **[src/data/quests.ts](src/data/quests.ts)**. Non serve toccare la grafica.

## Esempio da copiare

Il file contiene già le quest annotate: non cancellarle per aggiungerne altre. Copia solo un nuovo blocco `{ ... },` dentro la lista esistente, prima della parentesi `]` finale. Qui sotto trovi la struttura completa di esempio; sostituisci i testi prima di pubblicare.

```ts
export const quests: QuestEntry[] = [
  {
    id: 'nome-quest',
    title: 'Titolo della quest',
    npc: 'Nome personaggio',
    region: 'Sepolcride',
    status: 'in-corso',
    summary: 'Breve riassunto della situazione.',

    lastSeen: {
      location: 'Ultimo luogo dove lo abbiamo incontrato',
      note: 'Eventuale dettaglio.',
    },
    destination: {
      location: 'Dove ci ha indicato di andare',
    },

    steps: [
      {
        title: 'Primo incontro',
        text: "Abbiamo incontrato l'NPC e ascoltato la sua richiesta.",
      },
      {
        title: 'Secondo incontro',
        text: 'Che cosa abbiamo fatto successivamente.',
      },
    ],

    nextStep: {
      text: 'Che cosa resta da fare.',
      hypothetical: false,
    },

    portrait: {
      imageUrl: 'https://indirizzo-immagine...',
      imageAlt: 'Ritratto del personaggio',
      imagePosition: '50% 25%',
    },
  },
]
```

Per altre quest, duplica l'intero blocco `{ ... },` dentro la lista. L'ordine nel file determina quello nel diario.

## Regole essenziali

- **`id`**: unico, minuscolo, senza spazi; usa i trattini. Non cambiarlo dopo la pubblicazione: identifica il link diretto alla quest.
- **`status`**: scegli `'in-corso'`, `'pista'` oppure `'conclusa'`.
- **`steps`**: solo tappe già avvenute, dalla più vecchia alla più recente. Può essere `[]` se non hai ancora annotato tappe.
- **`nextStep.hypothetical`**: `true` per una pista da verificare; `false` per un prossimo passo noto.
- **Campi facoltativi**: puoi eliminare `lastSeen`, `destination`, `nextStep` e `portrait`. Per i luoghi mancanti il diario mostra che non sono ancora noti/annotati.
- **Immagini**: sostituisci l'URL di esempio oppure elimina `portrait`. `imagePosition` regola l'inquadratura: prima percentuale orizzontale, seconda verticale.
- **Apostrofi nei testi**: usa virgolette doppie, ad esempio `text: "Abbiamo incontrato l'NPC."`.
- Conserva virgole, parentesi e nomi dei campi. Salva il file in UTF-8 per mantenere gli accenti.

## Immagini extra e collegamenti

Dentro una quest puoi aggiungere una galleria e i collegamenti alle schede della lavagna:

```ts
gallery: [
  {
    imageUrl: 'https://indirizzo-immagine...',
    imageAlt: 'Descrizione della scena',
    caption: 'Didascalia del momento della quest',
  },
],
linkedConceptIds: ['id-della-scheda-lore'],
```

Gli ID devono corrispondere a schede già presenti nella lavagna, non ai loro titoli. Entrambi i campi sono facoltativi.

## Controllare e pubblicare

1. Esegui `npm run dev` e apri il Questbook per controllare il risultato.
2. Esegui `npm run build`: verifica anche eventuali errori nella struttura delle voci.
3. Fai commit e push su `main`: GitHub Actions ricostruisce e pubblica il sito.

Nota per chi mantiene i test: `scripts/questbook-test.mjs` controlla anche l’elenco delle quest pubblicate. Quando cambia la lista, aggiorna quelle aspettative. Il diario vuoto viene verificato separatamente con dati di prova.

## Gli altri file

| File | A cosa serve |
| --- | --- |
| [src/types.ts](src/types.ts) | Tutti i campi disponibili: cerca `QuestEntry` e `QuestImage` |
| [src/components/Questbook.tsx](src/components/Questbook.tsx) | Struttura della pagina e comportamento |
| [src/questbook.css](src/questbook.css) | Aspetto grafico |
| [README.md](README.md#questbook) | Documentazione del progetto e del Questbook |

Per compilare la lista non occorre modificare questi file.
