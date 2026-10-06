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

### Build Lab

Il Build Lab legge localmente un salvataggio PC `ER0000.sl2`, mostra i personaggi
presenti e ricostruisce statistiche, equipaggiamento, armi, armature, talismani,
magie, slot memoria e Rune Maggiori. I nomi arrivano dai testi italiani del
gioco, le munizioni sono escluse dalle armi e le miniature aiutano a riconoscere
subito equipaggiamento, stregonerie e incantesimi. Questa prima versione è esclusivamente di
consultazione: non scrive mai nel salvataggio. Il vecchio indirizzo `#/map` porta
alla nuova scheda senza cancellare eventuali pin conservati nel browser.

Il pulsante informativo accanto a ogni oggetto apre una scheda con miniatura grande
e descrizione ufficiale italiana. Il catalogo delle descrizioni è caricato soltanto
alla prima apertura, così non appesantisce l'accesso iniziale alla pagina.

L'equipaggiamento può essere modificato in una bozza temporanea trascinando armi,
armature e talismani dall'inventario, oppure selezionandoli e scegliendo uno slot.
Ogni oggetto è accettato soltanto negli slot compatibili e sostituisce quello già
presente. Il comando di ripristino ricarica il loadout letto dal save; anche questa
funzione resta interamente in memoria e non scrive mai sul file `.sl2`.
L'equipaggiamento è disposto in quadrati attorno alla sagoma del personaggio, mentre
le magie usano una griglia compatta di icone generata dal totale degli slot memoria.
Ogni quadrato occupato conserva il pulsante `i` per aprire immagine e descrizione;
equipaggiare o rimuovere la Luna di Nokstella aggiorna subito anche i due slot bonus.

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
server e non si sincronizzano fra dispositivi. Anche il file `.sl2` scelto nel
Build Lab viene elaborato soltanto in memoria: non viene caricato, copiato o
conservato dal sito e sparisce ricaricando la pagina.

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

- `src/data/project.ts`: schede, collegamenti e archivio post-run;
- `src/data/quests.ts`: pagine e tappe del Questbook;
- `src/data/boardGroups.ts`: ordine dei fascicoli;
- `src/lib/elden-save-reader.ts`: lettore locale e in sola lettura dei salvataggi PC;
- `src/data/build/`: dizionario degli oggetti riconosciuti dal Build Lab;
- `src/components/`: interfaccia delle quattro sezioni, compreso il Build Lab;
- `public/concepts/` e `public/maps/`: immagini usate dal sito;
- `scripts/`: test di navigazione, layout, persistenza e migrazione dei dati locali.

## Crediti

Elden Rhapsody è un fan project non ufficiale e senza finalità commerciali.
*Elden Ring*, i personaggi e i relativi marchi appartengono ai rispettivi
titolari. Le immagini restano proprietà dei loro autori e delle fonti indicate
nelle schede del sito.

Il dizionario degli identificativi usato dal Build Lab è generato dai dati di
[ClayAmore/ER-Save-Editor](https://github.com/ClayAmore/ER-Save-Editor), distribuiti
con licenza MIT oppure Apache-2.0. La struttura binaria è stata verificata anche
con la documentazione comunitaria di
[EldenRing-SaveForge](https://github.com/oisis/EldenRing-SaveForge/blob/main/docs/sl2-binary-format-spec.md).
I nomi italiani sono estratti dai file FMG dell'installazione locale del gioco;
le miniature vengono caricate, con fallback locale, dagli asset di SaveForge
fissati a una revisione precisa e distribuiti con licenza GPL-3.0.

Per rigenerare localizzazione, descrizioni e riferimenti alle miniature dopo aver
estratto i file `*Name.fmg.xml` e `*Caption.fmg.xml` con WitchyBND:

```bash
node scripts/enrich-er-build-data.mjs src/data/build/item-names.json <cartella-fmg-xml> <cartella-saveforge>
```

Usare `-` al posto della cartella FMG per aggiornare soltanto i riferimenti alle
miniature; usare `-` al posto della cartella SaveForge per aggiornare soltanto
localizzazione e descrizioni.
