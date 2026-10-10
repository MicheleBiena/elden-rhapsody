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

L’aggiornamento corrente riparte dopo la lettura completa della lavagna. Le sei
novità riguardano la dinastia Mohgwyn, Rya e Villa Vulcano, Iji, Ranni e la casa
reale cariana. Il totale è di 100 schede: 94 già lette e sei da leggere. Tutte le
note sono state rilette e condensate: la lavagna conserva identità, lore e ipotesi,
mentre azioni compiute, posizioni e prossimi passi restano nel Questbook. Quando
un fatto è già spiegato altrove, il testo rimanda a quella scheda.

### Questbook

Il Questbook è il diario della partita. Per ogni incarico registra soltanto i
passaggi effettivamente compiuti, l'ultima posizione nota del personaggio e una
destinazione quando il gioco ne ha indicata una. Le piste incerte rimangono
dichiaratamente tali.

La pagina **The Big Boys** raccoglie i portatori di Rune Maggiori conosciuti e
permette di depennare quelli sconfitti. Lo stato resta nel browser del visitatore.
Il diario contiene 23 quest: 21 in corso e due concluse. Le novità correnti sono
gli avanzamenti di Varré, Blaidd e Rya.

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
gli oggetti possono essere spostati tra slot compatibili o rimossi dalla bozza.
Equipaggiare o rimuovere la Luna di Nokstella aggiorna subito anche i due slot bonus.
Le Rune Maggiori attivate possono essere scelte da una griglia di simboli quadrati;
ogni runa ha una scheda con immagine grande, effetto e descrizione narrativa.
Salvataggio, personaggio
selezionato e modifiche della build restano in memoria passando tra le schede del sito,
ma vengono dimenticati ricaricando la pagina.

L’analisi della bozza controlla i requisiti di armi e magie, calcola peso corrente,
carico massimo e classe di rotolata includendo i bonus permanenti degli oggetti
equipaggiati. Le armi ricevono inoltre una valutazione colorata — accompagnata sempre
da un’etichetta testuale — della consonanza tra scaling e attributi attuali. Questa
valutazione è orientativa e non sostituisce un calcolo completo del danno finale.

Il controllo dei requisiti include i bonus agli attributi dei sigilli di Radagon
e Marika, dei cimeli del Flagello celeste, della portatrice di protesi,
dell’astrologa e delle Due Dita, oltre alla Protesi di Millicent. Una compatibilità
ottenuta con questi talismani è indicata esplicitamente. La Runa maggiore di Godrick
è invece trattata come condizionale: il suo +5 viene mostrato come sufficiente solo
se la runa selezionata viene attivata con un Arco runico; quando il bonus non risulta
attivo nel save, l’interfaccia avverte che arma o magia tornerebbe inutilizzabile.

Il comando **Valutazione esaustiva** apre, soltanto quando serve, un riepilogo di
punti forti, criticità e attributi da far crescere. I target usano le soglie del
prospetto dei soft cap fornito per la run e danno priorità ai requisiti mancanti;
subito sotto viene calcolato il costo cumulativo di ogni livello necessario e la
quota ancora da farmare, sottraendo le rune già possedute. Il costo per passare dal
livello `L` a `L + 1` segue la formula di gioco documentata dalla comunità:
`floor((max(0, (L - 11) × 0,02) + 0,1) × (L + 81)² + 1)`.

L’inventario offre un filtro generale per categoria e filtri contestuali più brevi:
tipi principali per armi, parti del corpo per armature, stregonerie/incantesimi e
alcune famiglie riconoscibili per le magie. Le opzioni senza risultati non vengono
mostrate, così la lista dei filtri non diventa più grande dell’inventario utile.

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
fissati a una revisione precisa e distribuiti con licenza GPL-3.0. Pesi, requisiti,
slot delle magie, coefficienti grezzi di scaling e modificatori del carico provengono
dagli stessi parametri di gioco documentati da SaveForge e vengono salvati in
`src/data/build/item-stats.json` per funzionare senza chiamate a una wiki.
La formula del costo per livello è stata verificata anche contro
[un’implementazione open source con esempi](https://github.com/tavvfiq/elden-rim-leveling-system/blob/master/leveling_curve.md).

Per rigenerare localizzazione, descrizioni e riferimenti alle miniature dopo aver
estratto i file `*Name.fmg.xml` e `*Caption.fmg.xml` con WitchyBND:

```bash
node scripts/enrich-er-build-data.mjs src/data/build/item-names.json <cartella-fmg-xml> <cartella-saveforge>
```

Usare `-` al posto della cartella FMG per aggiornare soltanto i riferimenti alle
miniature; usare `-` al posto della cartella SaveForge per aggiornare soltanto
localizzazione e descrizioni.

Per rigenerare i dati numerici della build da una copia locale di SaveForge:

```bash
node scripts/extract-er-build-stats.mjs src/data/build/item-names.json <weapon_stats_generated.go> <descriptions.go> <equip_load_modifiers.go> src/data/build/item-stats.json
```
