# Elden Rhapsody

Elden Rhapsody è il compagno di viaggio di una blind run italiana di *Elden Ring*.
Durante le live nomi, dialoghi, oggetti e ipotesi si accumulano in fretta; questo
sito serve a rimetterli in ordine senza anticipare ciò che il gioco non ha ancora
mostrato.

Non è una wiki e non prova a ricostruire il gioco a posteriori. Se un'informazione
non è comparsa durante la run, qui non dovrebbe esserci.

[Apri Elden Rhapsody](https://michelebiena.github.io/elden-rhapsody/#/board)

## Cosa contiene

### Fascicoli

La sezione principale organizza gli appunti come una raccolta di dossier su una
lavagna di sughero. Personaggi, luoghi, eventi e temi hanno una scheda propria;
i fili mostrano i rapporti osservati e separano i fatti dalle ipotesi.

Le note appena introdotte sono marcate come **Nuova**, quelle ampliate come
**Aggiornata**. In questo modo, prima di una live, si può leggere soltanto ciò che
è cambiato dall'episodio precedente. La **Lavagna completa** conserva anche la
vista d'insieme con tutte le schede e tutti i collegamenti.

### Questbook

Il Questbook è il diario della partita. Per ogni incarico registra soltanto i
passaggi effettivamente compiuti, l'ultima posizione nota del personaggio e una
destinazione quando il gioco ne ha indicata una. Le piste incerte rimangono
dichiaratamente tali.

La pagina **The Big Boys** raccoglie i portatori di Rune Maggiori conosciuti e
permette di depennare quelli sconfitti. Lo stato resta nel browser del visitatore.

### Mappa

La vecchia mappa è stata ritirata. La sezione mostra temporaneamente una scheda
**Coming soon** con una spada e un fondale attenuato, in attesa di una soluzione
cartografica nuova e anti-spoiler. Gli eventuali pin salvati in precedenza restano
nel browser e non vengono cancellati.

### Analisi

La raccolta dedicata alle traduzioni e agli articoli di approfondimento resta
sigillata fino alla conclusione della blind run. È una scelta editoriale: le
analisi sono preziose, ma appartengono al dopo.

## Come vengono trattati gli appunti

Ogni aggiornamento distingue tre livelli:

1. ciò che è stato visto o letto in gioco;
2. le deduzioni nate collegando più indizi;
3. le domande ancora senza risposta.

Le azioni compiute finiscono nel Questbook; identità, descrizioni e relazioni
restano nei Fascicoli. Questa separazione evita che la lavagna diventi un secondo
diario e rende più facile tornare su un mistero dopo molte ore di gioco.

## Dati locali

Elden Rhapsody è un sito statico e non richiede un account. Posizioni delle
schede, pagina aperta nel Questbook, obiettivi depennati e vecchi pin cartografici
vengono salvati nel `localStorage` del singolo browser. Non vengono inviati a un
server e non si sincronizzano fra dispositivi.

## Sviluppo locale

Il progetto usa React, TypeScript e Vite.

```bash
npm install
npm run dev
```

Per controllare la build di produzione:

```bash
npm run build
npm run preview
```

Con la preview attiva su `http://localhost:4173/`, i controlli browser si avviano
da un secondo terminale:

```bash
npm test
npm run smoke
```

Il branch `main` viene pubblicato automaticamente su GitHub Pages dal workflow in
`.github/workflows/deploy.yml`.

## Struttura essenziale

- `src/data/project.ts`: schede, collegamenti, mappa e archivio post-run;
- `src/data/quests.ts`: pagine e tappe del Questbook;
- `src/data/boardGroups.ts`: ordine dei fascicoli;
- `src/components/`: interfaccia delle quattro sezioni, compreso il placeholder della mappa;
- `public/concepts/` e `public/maps/`: immagini usate dal sito;
- `scripts/`: test di navigazione, layout, persistenza e migrazione dei dati locali.

## Crediti

Elden Rhapsody è un fan project non ufficiale e senza finalità commerciali.
*Elden Ring*, i personaggi e i relativi marchi appartengono ai rispettivi
titolari. Le immagini restano proprietà dei loro autori e delle fonti indicate
nelle schede del sito.
