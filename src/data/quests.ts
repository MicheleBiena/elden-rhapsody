import type { QuestEntry } from "../types";

// Il Questbook viene compilato esclusivamente con le quest e le tappe fornite
// dall’utente. Non ricostruire missioni dalle schede lore o da guide esterne.
export const quests: QuestEntry[] = [
  {
    id: "melina",
    title: "I offer you an accord",
    npc: "Melina",
    region: "Sepolcride",
    status: "in-corso",
    summary:
      "Acquisire abbastanza Rune Maggiori per entrare nella capitale, dove Melina ci aspetta, e accompagnarla ai piedi dell’Albero Madre.",

    destination: {
      location: "Leyndell, ai piedi dell’Albero Madre",
      note: "Melina ci aspetta nella capitale; l’accesso richiede abbastanza Rune Maggiori.",
    },

    steps: [
      {
        title: "La creatura innestata",
        text: "All’inizio del viaggio incontriamo una creatura con numerose membra innestate.",
      },
      {
        title: "Incontro con Melina",
        text: "Incontriamo Melina e accettiamo di accompagnarla ai piedi dell’Albero Madre.",
      },
      {
        title: "Margit a guardia di Grantempesta",
        text: "Affrontiamo Margit con l’aiuto di Rogier. Alla sconfitta Margit scompare in una luce dorata, ma la sua voce ci avvisa che verremo perseguitati dalla notte.",
      },
      {
        title: "Gli innesti nel castello",
        text: "A Grantempesta ritroviamo una creatura dello stesso tipo di quella incontrata all’inizio del gioco, un altro risultato degli innesti.",
      },
      {
        title: "Godrick sconfitto",
        text: "Combattiamo Godrick: durante lo scontro si innesta la testa di un drago e invoca i propri avi. Lo sconfiggiamo, ma la meta concordata con Melina resta l’Albero Madre.",
      },
      {
        title: "La via per la capitale",
        text: "Scopriamo che per accedere a Leyndell dobbiamo prima acquisire abbastanza Rune Maggiori. Melina ci aspetta nella capitale.",
      },
    ],

    nextStep: {
      text: "Acquisire abbastanza Rune Maggiori per entrare a Leyndell e raggiungere Melina.",
      hypothetical: false,
    },

    portrait: {
      imageUrl: "./concepts/melina.png",
      imageAlt: "Melina con un occhio chiuso e un simbolo scuro sul volto",
      imagePosition: "50% 25%",
    },
    gallery: [
      {
        imageUrl: "./concepts/margit.png",
        imageAlt: "Margit a guardia di Grantempesta",
        caption: "Margit il Presagio",
      },
      {
        imageUrl: "./concepts/godrick.png",
        imageAlt: "Godrick con le sue membra innestate",
        caption: "Godrick l’Innestato",
      },
      {
        imageUrl: "./concepts/progenie-innestata.webp",
        imageAlt: "La creatura con numerosi arti innestati",
        caption: "La creatura innestata di Grantempesta",
      },
    ],
    linkedConceptIds: [
      "melina",
      "albero-madre",
      "margit",
      "godrick-innestato",
      "progenie-innestata",
    ],
  },
  {
    id: "big-boys",
    title: "The Big Boys",
    npc: "Araldi delle Rune Maggiori",
    region: "Interregno",
    status: "in-corso",
    summary:
      "I cinque portatori di Rune Maggiori indicati da Gideon. Ottenere abbastanza rune aprirà la strada verso Leyndell.",
    lastSeen: {
      location: "Tavola Rotonda",
      note: "Gideon ci ha descritto i principali obiettivi conosciuti.",
    },
    destination: {
      location: "Leyndell, capitale reale",
      note: "Le Due Dita vietano di entrarvi finché non avremo raccolto abbastanza Rune Maggiori.",
    },
    steps: [
      {
        title: "L’elenco di Gideon",
        text: "Gideon identifica cinque portatori di Rune Maggiori: Godrick, Radahn, Rykard, Morgott e Rennala.",
      },
      {
        title: "Godrick eliminato",
        text: "Godrick l’Innestato è stato sconfitto a Grantempesta e la sua Runa Maggiore è in nostro possesso.",
      },
      {
        title: "La Torre Divina di Sepolcride",
        text: "Raggiungiamo la sommità della Torre Divina di Sepolcride e riattiviamo il potere della Runa Maggiore di Godrick davanti a Due Dita avvizzite.",
      },
      {
        title: "Rennala affrontata",
        text: "Affrontiamo Rennala nella biblioteca di Raya Lucaria: cade a terra stringendo l'uovo d'ambra e la seconda fase mostra la sua versione spiritica al pieno potere.",
      },
    ],
    nextStep: {
      text: "Sconfiggere altri portatori e acquisire abbastanza Rune Maggiori per ottenere accesso a Leyndell.",
      hypothetical: false,
    },
    targets: [
      {
        id: "godrick",
        name: "Godrick l’Innestato",
        epithet: "Signore di Grantempesta",
        location: "Sepolcride nord-occidentale",
        description:
          "Pur discendendo da Godfrey, Gideon lo considera un vecchio grottesco e sciocco, affamato di potere. Il suo castello sorge sulla scogliera a nord-ovest di Sepolcride.",
        image: {
          imageUrl: "./concepts/godrick.png",
          imageAlt:
            "Godrick l’Innestato con le numerose membra aggiunte al corpo",
          imagePosition: "50% 22%",
        },
        linkedConceptId: "godrick-innestato",
        initiallyDefeated: true,
      },
      {
        id: "radahn",
        name: "Generale Radahn",
        epithet: "Leone Rosso, flagello delle stelle",
        location: "Caelid",
        description:
          "Leone Rosso e conquistatore delle stelle, sopravvissuto allo scontro con Malenia ma divorato dalla marcescenza fino a perdere il senno.",
        image: {
          imageUrl: "./concepts/radahn.webp",
          imageAlt: "Il generale Radahn in armatura rossa",
          imagePosition: "50% 24%",
        },
        linkedConceptId: "radahn",
      },
      {
        id: "rykard",
        name: "Pretore Rykard",
        epithet: "Signore di Villa Vulcano",
        location: "Monte Gelmir, Altopiano di Altus occidentale",
        description:
          "Giustiziere spietato a capo di una compagnia di inquisitori, disprezzato per il suo contegno serpentino. Sul Monte Gelmir si combatté la battaglia più terribile dello Shattering; la sua blasfemia lo ha reso un nemico imperdonabile.",
      },
      {
        id: "morgott",
        name: "Morgott, il Benedetto dalla Grazia",
        epithet: "Monarca Velato e signore di Leyndell",
        location: "Leyndell, Altopiano di Altus orientale",
        description:
          "Governa la capitale ai piedi dell’Albero Madre. Le Due Dita ci vietano di raggiungerlo finché non avremo ottenuto abbastanza Rune Maggiori per riparare l’Elden Ring.",
      },
      {
        id: "rennala",
        name: "Rennala",
        epithet: "Regina dei reali cariani",
        location: "Accademia di Raya Lucaria, Liurnia",
        description:
          "Governa l’Accademia, ma non è una semidea. La sua Runa Maggiore dimora nell’uovo d’ambra donatole da Radagon, che la lasciò per diventare secondo marito di Marika e Re Consorte.",
        image: {
          imageUrl: "./concepts/rennala.webp",
          imageAlt: "Rennala spiritica al pieno potere davanti alla luna piena",
        },
        linkedConceptId: "rennala",
      },
    ],
    linkedConceptIds: [
      "gideon-ofnir",
      "godrick-innestato",
      "radahn",
      "rennala",
      "leyndell",
      "torri-divine",
    ],
  },
  {
    id: "varre",
    title: "La Maschera Bianca",
    npc: "Varré",
    region: "Liurnia Lacustre",
    status: "in-corso",
    summary:
      "Dopo tre invasioni e la prova del sangue di vergine, Varré ci consacra come Dito Sanguinante di Mohg e ci affida una medaglia per ottenere udienza.",

    lastSeen: {
      location: "Chiesa della Rosa, Liurnia",
      note: "Qui completa la nostra iniziazione al servizio della dinastia Mohgwyn.",
    },
    nextStep: {
      text: "Usare la Medaglia del Cavaliere Purosangue quando vorremo ottenere udienza da Mohg.",
      hypothetical: false,
    },
    steps: [
      {
        title: "Incontro al Primo Passo",
        text: "Varré sottolinea che siamo senza vergine e ci indica la strada verso Grantempesta: uccidere Godrick per ottenere udienza dalle Due Dita.",
      },
      {
        title: "Godrick sconfitto",
        text: "Raggiungiamo Grantempesta e sconfiggiamo Godrick.",
      },
      {
        title: "Udienza dalle Due Dita",
        text: "Otteniamo udienza dalle Due Dita, completando l’incarico iniziale indicato da Varré.",
      },
      {
        title: "Verso Liurnia",
        text: "Varré ci consiglia di raggiungerlo alla Chiesa della Rosa a Liurnia (Nord).",
      },
      {
        title: "La Chiesa della Rosa",
        text: "Ritroviamo Varré alla Chiesa della Rosa. Non si fida delle Due Dita: le considera scombussolate dalla Disgregazione e sostiene che odino noi Senzaluce.",
      },
      {
        title: "Le dita sanguinanti",
        text: "Varré ci consegna dita sanguinanti e ci chiede di partecipare a tre duelli online.",
      },
      {
        title: "Tre invasioni",
        text: "Usiamo le dita ricevute e invadiamo altri mondi tre volte. Varré interpreta la prova come dimostrazione del nostro gusto per il sangue nobile.",
      },
      {
        title: "La prova del sangue di vergine",
        text: "Accettiamo di essere consacrati al servizio di Mohg. Varré ci consegna un drappo da impregnare con il sangue di una vergine e glielo riportiamo dopo aver completato la prova.",
      },
      {
        title: "Dito Sanguinante",
        text: "Offriamo il dito a Varré e sopportiamo il rito. Riceviamo il Dito Sanguinante permanente e diventiamo formalmente cavalieri della futura dinastia Mohgwyn.",
      },
      {
        title: "Udienza da Mohg",
        text: "Varré ci dona la Medaglia del Cavaliere Purosangue, capace di condurci da Mohg. Ci chiede di attendere perché il Lord del Sangue dorme ancora accanto alla Divinità.",
      },
    ],
    portrait: {
      imageUrl: "./concepts/varre.webp",
      imageAlt: "Varré con la sua maschera bianca",
      imagePosition: "50% 20%",
    },
    gallery: [
      {
        imageUrl: "./concepts/dito-sanguinante.webp",
        imageAlt: "Un dito pallido dal lungo artiglio intriso di sangue",
        caption: "Dito Sanguinante",
      },
      {
        imageUrl: "./concepts/medaglia-sangue-puro.webp",
        imageAlt: "Medaglia dorata dei Cavalieri Purosangue ornata di rosso",
        caption: "Medaglia del Cavaliere Purosangue",
      },
    ],
    linkedConceptIds: ["varre", "godrick-innestato", "due-dita", "lord-del-sangue"],
  },
  {
    id: "boc",
    title: "Il vestito è un po’ antiquato…",
    npc: "Boc il semiumano",
    region: "Sepolcride",
    status: "in-corso",
    summary:
      "Boc ha recuperato ago e filo della madre e si è offerto di seguirci come nostro sarto. Non conosciamo il prossimo passo.",

    lastSeen: {
      location: "Rupe sul Lago, Liurnia Lacustre",
      note: "Si trova presso il luogo di Grazia Lake-Facing Cliffs.",
    },
    steps: [
      {
        title: "Incontro con Boc",
        text: "Incontriamo Boc, un semiumano, nella Sepolcride centrale.",
      },
      {
        title: "Gli strumenti di sua madre",
        text: "Nella grotta sulla spiaggia recuperiamo l’ago e il filo appartenuti alla madre di Boc e glieli consegniamo.",
      },
      {
        title: "Il nostro sarto",
        text: "Ritroviamo Boc presso la Rupe sul Lago. Si offre di diventare il nostro sarto e di seguirci durante il viaggio.",
      },
    ],
    portrait: {
      imageUrl: "./concepts/boc.jpg",
      imageAlt: "Boc, il piccolo semiumano con un cappello",
      imagePosition: "50% 25%",
    },
    linkedConceptIds: ["boc"],
  },
  {
    id: "alexander",
    title: "Amico Vaso",
    npc: "Alexander Iron Fist",
    region: "Sepolcride e Caelid",
    status: "in-corso",
    updateKind: "aggiornata",
    summary:
      "Dopo essersi ricostruito con i resti del Festival, Alexander si è incastrato di nuovo vicino a Vasburgo. Stavolta i colpi non bastano: serve qualcosa di scivoloso.",
    lastSeen: {
      location: "Sopra Vasburgo, Liurnia",
      note: "È bloccato in una buca e chiede di essere reso abbastanza scivoloso da poterne uscire.",
    },
    steps: [
      {
        title: "Verso Castello Mantorosso",
        text: "Liberiamo Alexander dal terreno e, più tardi, dalla miniera fra Sepolcride e Caelid. Il Vaso Guerriero prosegue verso il festival di combattimento.",
      },
      {
        title: "La prova del festival",
        text: "A Castello Mantorosso Alexander giura di affrontare Radahn senza arretrare, nonostante la fama del semidio lo faccia tremare.",
      },
      {
        title: "Il vaso incrinato",
        text: "Un solo colpo lo rompe e gli fa perdere le interiora. Alexander ammette di essersi nascosto, ma non rinuncia al proprio viaggio.",
      },
      {
        title: "Resti di guerrieri",
        text: "Raccoglie nel proprio corpo i resti dei caduti dello Shattering per diventare più forte. Che fra questi ci sia anche Radahn è possibile, ma non confermato.",
      },
      {
        title: "Incastrato, ancora",
        text: "Ritroviamo Alexander vicino a Vasburgo, nuovamente bloccato nel terreno. Questa volta occorre qualcosa di scivoloso per liberarlo.",
      },
    ],
    nextStep: {
      text: "Trovare qualcosa di abbastanza scivoloso da liberare Alexander.",
      hypothetical: false,
    },
    trainerAdvice: "Cerca un mercante al fiume Siofra, sul lato sinistro.",
    trainerAdviceImage: {
      imageUrl: "./quests/alexander-siofra-suggestion.png",
      imageAlt: "Percorso tracciato sulle impalcature del fiume Siofra verso il mercante",
      caption: "Indizio visivo · segui le impalcature indicate",
      imagePosition: "50% 50%",
    },
    portrait: {
      imageUrl: "./concepts/alexander.webp",
      imageAlt: "Alexander, il grande vaso guerriero incastrato nel terreno",
      imagePosition: "50% 45%",
    },
    linkedConceptIds: ["alexander-vaso-guerriero", "festival-radahn", "radahn"],
  },
  {
    id: "sellen",
    title: "Maestra di stelle",
    npc: "Sellen",
    region: "Sepolcride",
    status: "in-corso",
    updateKind: "aggiornata",
    summary:
      "Oltre alla Sellen imprigionata, nel nascondiglio segreto di Seluvis abbiamo trovato un fantoccio con il suo aspetto. Il rapporto fra questi corpi resta da chiarire.",
    lastSeen: {
      location: "Sepolcride centrale",
    },
    steps: [
      {
        title: "Incontro con Sellen",
        text: "Incontriamo la strega Sellen nella Sepolcride centrale.",
      },
      {
        title: "Il manichino",
        text: "Troviamo anche una seconda figura identica a Sellen: per ora il suo legame con la maestra rimane da chiarire.",
      },
      {
        title: "Il fantoccio di Seluvis",
        text: "Nel nascondiglio segreto di Seluvis troviamo un fantoccio con l’aspetto di Sellen. La scoperta lega lo stregone ai suoi molteplici corpi, senza ancora spiegarne il funzionamento.",
      },
    ],
    nextStep: {
      text: "Capire quale rapporto unisca la maestra, la prigioniera e il fantoccio conservato da Seluvis.",
      hypothetical: true,
    },
    portrait: {
      imageUrl: "./concepts/sellen.png",
      imageAlt: "La strega Sellen con la sua maschera di pietra",
      imagePosition: "50% 20%",
    },
    linkedConceptIds: ["sellen", "seluvis", "fantocci-seluvis"],
  },
  {
    id: "blaidd",
    title: "Era delle Stelle",
    npc: "Ranni e i suoi seguaci",
    region: "Liurnia, Caelid, Limgrave e Nokron",
    status: "in-corso",
    updateKind: "aggiornata",
    summary:
      "Consegnato il tesoro di Nokron, Ranni parte sul sentiero oscuro che solo lei può percorrere. La statuetta ricevuta apre la Torre Divina di Liurnia, dove troviamo il suo corpo e il Marchio della Morte.",
    lastSeen: {
      location: "Guglia di Ranni, Tre Sorelle",
      note: "Dopo aver ricevuto il tesoro, Ranni ci congeda e parte per il proprio viaggio.",
    },
    steps: [
      {
        title: "Blaidd e Iji",
        text: "Dopo aver sconfitto Darriwil insieme a Blaidd, incontriamo Iji, fabbro dei reali cariani e suo alleato.",
      },
      {
        title: "La vera identità di Renna",
        text: "Nel Maniero Cariano incontriamo Ranni: è la strega che si era presentata come Renna. Accettiamo di servirla e di cercare il tesoro custodito a Nokron, la Città Eterna.",
      },
      {
        title: "I tre seguaci",
        text: "Ranni ci presenta Blaidd, Iji e Seluvis. Blaidd parte per cercare Nokron dal Siofra; Seluvis ci indirizza da Sellen.",
      },
      {
        title: "Nokron fuori portata",
        text: "Raggiungiamo Blaidd al Siofra. La Città Eterna è visibile, ma troppo in alto: manca ancora un accesso.",
      },
      {
        title: "Il destino fermato",
        text: "Sellen spiega che le stelle regolano il destino dei reali cariani. Radahn ne ha arrestato il moto: soltanto la sua morte permetterebbe alle stelle e al destino di Ranni di riprendere il corso.",
      },
      {
        title: "Il festival di Radahn",
        text: "A Castello Mantorosso ritroviamo Blaidd fra i campioni radunati. Ci chiede di non morire: il duello serve anche al destino di Ranni.",
      },
      {
        title: "Una stella apre la strada",
        text: "Sconfitto Radahn, il suo dominio gravitazionale cede. Una stella precipita nel Tetrobosco, in Limgrave, e Blaidd capisce che il cammino verso Nokron è finalmente aperto.",
      },
      {
        title: "Nokron, città gemella",
        text: "Iji spiega che Nokstella ha una gemella, Nokron, localizzata sotto il pozzo del Tetrobosco. Nessuna via era stata trovata: Blaidd vi si era arenato.",
      },
      {
        title: "La galera di Blaidd",
        text: "Iji confessa di aver rinchiuso Blaidd nella galera eterna del Limiere: se Ranni resiste alle Due Dita, la sua ombra impazzisce. Red lo libera e Blaidd corre dalla principessa.",
      },
      {
        title: "La discesa nel cratere",
        text: "Red scende nel cratere aperto dalla stella caduta, presso il pozzo del Tetrobosco, e raggiunge Nokron.",
      },
      {
        title: "Lacrime e soldati emaciati",
        text: "Nella città incontriamo lacrime d’argento, soldati pallidi della Compagnia del Falco Caduto e seguaci ancestrali.",
      },
      {
        title: "Il tesoro di Nokron",
        text: "In fondo alla città troviamo una lama nata da un cadavere, intrisa di sangue: prova dell’alto tradimento della Città Eterna e simbolo della sua caduta.",
      },
      {
        title: "Tutti i pezzi al loro posto",
        text: "Consegniamo la lama a Ranni. La principessa ci ringrazia, dice che tutto è pronto e parte lungo un sentiero oscuro che soltanto lei può percorrere.",
      },
      {
        title: "Il dono capovolto",
        text: "Prima di congedarci Ranni ci affida una statuetta. Collocata sul globo della Torre di Studio Cariana, ne capovolge la struttura e rivela il passaggio verso la Torre Divina.",
      },
      {
        title: "Il corpo e il Marchio",
        text: "Sulla Torre Divina di Liurnia, oltre un guardiano mastodontico che usa fiamme nere, troviamo il corpo fisico di Ranni e il Marchio della Morte inciso sulla carne.",
      },
      {
        title: "La torre vuota di Seluvis",
        text: "Troviamo Seluvis senza vita e scopriamo il suo nascondiglio di fantocci, fra cui uno con l’aspetto di Sellen.",
      },
    ],
    trainerAdvice: "Esplora la torre di Renna.",
    portrait: {
      imageUrl: "./concepts/strega-sconosciuta.webp",
      imageAlt: "Ranni nella sua forma di bambola, sotto un grande cappello",
      imagePosition: "50% 20%",
    },
    gallery: [
      {
        imageUrl: "./concepts/festival-radahn.webp",
        imageAlt: "Radahn circondato dai campioni del festival nelle Dune Gementi",
        caption: "Il duello finale del Festival di Radahn · fanart di Aljerek",
      },
      {
        imageUrl: "./concepts/jerren.png",
        imageAlt: "Jerren seduto in abiti eccentrici a Castello Mantorosso",
        caption: "Jerren · araldo del Festival",
      },
      {
        imageUrl: "./concepts/citta-eterna.webp",
        imageAlt: "Nokron sotto il cielo stellato sotterraneo",
        caption: "Nokron · la Città Eterna sotto il cielo stellato",
      },
      {
        imageUrl: "./concepts/galere-eterne.png",
        imageAlt: "Il sigillo della Galera Eterna del Limiere",
        caption: "La Galera Eterna del Limiere · prigione di Blaidd",
      },
      {
        imageUrl: "./concepts/tesoro-di-nokron.png",
        imageAlt: "La lama del tesoro di Nokron, un feticcio scuro e insanguinato",
        caption: "Il tesoro di Nokron · lama nata da un cadavere",
      },
    ],
    linkedConceptIds: [
      "ranni-principessa-lunare", "mezzolupo", "radahn", "festival-radahn", "jerren",
      "citta-eterna", "iji", "galere-eterne", "tesoro-di-nokron", "lacrime-argento",
      "compagnia-falco-caduto", "torre-studio-cariana", "marchio-centipede", "seluvis",
      "fantocci-seluvis",
    ],
  },
  {
    id: "rogier",
    title: "Beata ignoranza",
    npc: "Stregone Rogier",
    region: "Grantempesta",
    status: "conclusa",
    updateKind: "aggiornata",
    summary:
      "Rogier è morto consumato dal morbo mortale. La sua ultima lettera indica il fratello minore di D, addormentato nell’acquedotto presso Nokron vicino al Principe della Morte.",
    lastSeen: {
      location: "Tavola Rotonda",
      note: "Ritrovato senza vita, con una lettera scritta da una mano tremante.",
    },
    steps: [
      {
        title: "L’aiuto contro Margit",
        text: "Rogier ci aiuta nel combattimento contro Margit.",
      },
      {
        title: "L’insegnante nella chiesa",
        text: "Incontriamo poi Rogier nella chiesa di Grantempesta, dove consultiamo il suo negozio e le descrizioni delle tecniche offerte.",
      },
      {
        title: "Il cadavere sotto Grantempesta",
        text: "Sotto il castello troviamo un cadavere deforme e quasi sciolto, segnato dal morbo mortale. Interagendo con la reliquia vediamo lo spirito di Rogier venire impalato.",
      },
      {
        title: "Rogier infermo",
        text: "Alla Tavola Rotonda ritroviamo Rogier infermo e contaminato. Ci spiega che il cadavere è una reliquia della congiura dei Neri Coltelli e che il contatto con quella creatura è responsabile delle sue condizioni.",
      },
      {
        title: "La ricerca sulla morte",
        text: "Rogier studia la congiura e il morbo mortale per comprendere come il mondo sia diventato così distorto. D, un tempo suo compagno di viaggio in questa ricerca, ora lo considera perduto.",
      },
      {
        title: "Il Marchio del Centipede",
        text: "D ha scoperto il Marchio del Centipede, antico simbolo del marchio maledetto. Rogier vorrebbe parlare con chi lo troverà e usarlo per formare un’alleanza, purché non abbia intenzioni malvagie.",
      },
      {
        title: "L’Assassina dei Neri Coltelli",
        text: "Con l’aiuto di D affrontiamo un’Assassina dei Neri Coltelli e otteniamo il Grafopugnale Nero, impronta del rito compiuto sulle lame della congiura.",
      },
      {
        title: "Il nome nell’impronta",
        text: "Consegniamo il Grafopugnale a Rogier. Dopo averlo esaminato ce lo restituisce e identifica la Principessa Lunare Ranni come la persona che officiò il rito.",
      },
      {
        title: "Il marchio di Ranni",
        text: "Rogier ci chiede di procurarci il marchio maledetto della Morte Fatidica che Ranni dovrebbe portare sulla carne. Indica come pista la dimora reale cariana a nord dell’Accademia.",
      },
      {
        title: "Salvare chi vive nella morte",
        text: "Rogier chiarisce il proprio scopo: Coloro che vivono nella morte non hanno commesso colpe, ma hanno toccato una falla nell’Ordine. Cerca il marchio per provare a salvarli.",
      },
      {
        title: "Il corpo abbandonato",
        text: "Ranni rivela di aver lasciato il proprio corpo fisico. Il marchio cercato da Rogier deve trovarsi su quella carne, non sulla bambola che la ospita.",
      },
      {
        title: "Entrare al servizio di Ranni",
        text: "Rogier ci consiglia di servire Ranni per avvicinarci ai suoi segreti. Seguiamo il suggerimento e accettiamo l’incarico della principessa.",
      },
      {
        title: "L’ultimo avvertimento",
        text: "Rogier ci confessa di sentirsi sull’orlo di un sonno profondo e senza fondo. Teme che possa crearci problemi e vuole scusarsi in anticipo.",
      },
      {
        title: "La morte di Rogier",
        text: "Torniamo alla Tavola Rotonda e troviamo Rogier morto, ormai sopraffatto dal morbo mortale.",
      },
      {
        title: "La lettera tremante",
        text: "Rogier lascia scritto che D ha un fratello minore: dorme nell’acquedotto presso Nokron e si dice abbia sostato davanti al Principe della Morte.",
      },
    ],
    portrait: {
      imageUrl: "./concepts/rogier.png",
      imageAlt:
        "Rogier con il cappello da stregone nella chiesa di Grantempesta",
      imagePosition: "50% 20%",
    },
    linkedConceptIds: ["rogier", "ranni-principessa-lunare", "assassine-neri-coltelli", "morbo-mortale", "marchio-centipede", "notte-neri-coltelli", "runa-della-morte", "coloro-che-vivono-nella-morte", "d-cacciatore", "citta-eterna", "lord-della-morte"],
  },
  {
    id: "fia",
    title: "Con la morte in seno",
    npc: "Fia, Compagna di Morte",
    region: "Tavola Rotonda",
    status: "in-corso",
    updateKind: "aggiornata",
    summary:
      "Fia conosce la ricerca di Rogier sui Neri Coltelli e ci affida un pugnale rovinato da restituire al proprietario. Dopo la morte di D rivendica il gesto e annuncia che il Signore della Morte risorgerà.",
    lastSeen: {
      location: "Tavola Rotonda",
      note: "Accanto al corpo di D, dopo aver rivendicato il gesto.",
    },
    steps: [
      {
        title: "Le impronte dei Neri Coltelli",
        text: "Fia ci parla dei Grafopugnali che nascondono la verità della congiura. Ricorda che Rogier ne parlava piangendo quando giaceva con lei.",
      },
      {
        title: "L’indizio del Grafopugnale",
        text: "Fia ha saputo da un’altra persona dove cercare un’impronta. Non vuole consegnare la pista direttamente a Rogier, infermo alla Tavola Rotonda, e la affida a noi.",
      },
      {
        title: "Rogier aiutato",
        text: "Dopo che abbiamo consegnato il Grafopugnale a Rogier, Fia ci ringrazia per avergli dato nuova forza e ci dona un Ramoscello sacrificale.",
      },
      {
        title: "Il pugnale da restituire",
        text: "Fia ci chiede di trovare il proprietario di un pugnale rovinato e di restituirglielo. Lo ha ricevuto in dono da una persona a cui tiene molto e lo considera un oggetto prezioso.",
      },
      {
        title: "Il pugnale riconsegnato",
        text: "Consegniamo il pugnale a D. Dichiara di sapere bene di chi è e si offre di restituirlo lui stesso.",
      },
      {
        title: "La morte di D",
        text: "Poco dopo troviamo D morto, trafitto dal morbo mortale. Fia è accanto al cadavere e si assume la responsabilità del gesto. Ci chiede di riferire alla Tavola Rotonda di non turbare la morte di Godwyn l’Elevato: Coloro che vivono nella morte attendono il proprio Signore, che risorgerà, signore dei molti e dei miti.",
      },
    ],
    nextStep: {
      text: "Riferire alla Tavola Rotonda il monito di Fia.",
      hypothetical: false,
    },
    portrait: {
      imageUrl: "./concepts/fia-tavola-rotonda.png",
      imageAlt: "Fia seduta nella propria stanza alla Tavola Rotonda",
      imagePosition: "50% 20%",
    },
    gallery: [
      {
        imageUrl: "./concepts/pugnale-rovinato.png",
        imageAlt: "Il Pugnale Rovinato ricevuto da Fia, consunto e segnato da una fenditura nera",
        caption: "Pugnale Rovinato · da restituire al legittimo proprietario",
      },
    ],
    linkedConceptIds: ["fia", "rogier", "assassine-neri-coltelli", "notte-neri-coltelli", "pugnale-rovinato", "lord-della-morte", "d-cacciatore"],
  },
  {
    id: "roderika",
    title: "Crisalidi",
    npc: "Roderika",
    region: "Grantempesta",
    status: "conclusa",
    summary:
      "Dopo aver scoperto il destino dei suoi compagni, Roderika riconosce il proprio potenziale come Spirit Tuner e trova un nuovo scopo sotto la guida di Hewg.",
    lastSeen: {
      location: "Tavola Rotonda",
      note: "Studia come Spirit Tuner sotto la guida del Maestro Fabbro Hewg.",
    },
    steps: [
      {
        title: "Il messaggio per i suoi uomini",
        text: "Roderika ci chiede di portare un messaggio ai suoi uomini a Grantempesta.",
      },
      {
        title: "Il cumulo di cadaveri",
        text: "Troviamo i suoi uomini nel cumulo di cadaveri utilizzati per gli innesti.",
      },
      {
        title: "Un nuovo scopo",
        text: "Roderika comprende il proprio potenziale come Spirit Tuner e inizia a coltivarlo sotto la guida di Hewg, trovando un nuovo scopo dopo il destino terribile dei suoi compagni.",
      },
    ],
    portrait: {
      imageUrl: "./concepts/roderika.jpg",
      imageAlt: "Roderika con il mantello rosso all’interno della capanna",
      imagePosition: "50% 25%",
    },
    linkedConceptIds: ["roderika", "godrick-innestato", "hewg", "spiriti"],
  },
  {
    id: "d",
    title: "La doppia faccia",
    npc: "D, cacciatore di non morti",
    region: "Tavola Rotonda",
    status: "in-corso",
    updateKind: "aggiornata",
    summary:
      "Il gemello di D è stato trovato nell’acquedotto di Nokron. Gli abbiamo consegnato l’Armatura gemella e poco dopo ci ha aiutato contro i Gargoyle.",
    lastSeen: {
      location: "Acquedotto presso Nokron",
      note: "Il gemello era rannicchiato e disperato; dopo aver ricevuto l’armatura è intervenuto nello scontro poco più avanti.",
    },
    steps: [
      {
        title: "L’avvertimento di D",
        text: "D ci mette in guardia dal marinaio non morto.",
      },
      {
        title: "Il marinaio sconfitto",
        text: "Affrontiamo e uccidiamo il marinaio non morto.",
      },
      {
        title: "L’incontro con Gurranq",
        text: "D ci indirizza verso Gurranq, la bestia ecclesiastica. Lo abbiamo raggiunto e incontrato.",
      },
      {
        title: "Il pugnale rovinato",
        text: "D riconosce il pugnale ricevuto da Fia, dice di sapere bene di chi è e si offre di restituirlo lui stesso.",
      },
      {
        title: "La morte di D",
        text: "Poco dopo lo troviamo morto, trafitto dal morbo mortale. Fia è accanto al cadavere e rivendica il gesto.",
      },
      {
        title: "Il fratello minore",
        text: "Nella sua ultima lettera Rogier rivela che il fratello minore di D dorme in un acquedotto presso Nokron e che avrebbe sostato davanti al Principe della Morte.",
      },
      {
        title: "L’Armatura gemella",
        text: "Troviamo il gemello rannicchiato nell’acquedotto e gli consegniamo l’armatura appartenuta a D.",
      },
      {
        title: "Contro i Gargoyle",
        text: "Poco più avanti il gemello risponde alla chiamata e combatte al nostro fianco contro i Gargoyle.",
      },
    ],
    portrait: {
      imageUrl: "./concepts/d.jpg",
      imageAlt: "D con l’armatura gemella e una seconda testa sulla spalla",
      imagePosition: "50% 20%",
    },
    linkedConceptIds: [
      "d-cacciatore",
      "coloro-che-vivono-nella-morte",
      "gurranq",
      "pugnale-rovinato",
      "fia",
      "lord-della-morte",
      "morbo-mortale",
      "rogier",
      "citta-eterna",
    ],
  },
  {
    id: "kenneth",
    title: "Successione",
    npc: "Kenneth Haight",
    region: "Sepolcride",
    status: "in-corso",
    summary:
      "Abbiamo liberato il forte di Kenneth. Ora attende un degno erede al trono di Sepolcride.",
    lastSeen: {
      location: "Forte Haight",
    },
    steps: [
      {
        title: "Il forte liberato",
        text: "Liberiamo il forte di Kenneth.",
      },
      {
        title: "In attesa di un erede",
        text: "Kenneth aspetta un degno erede al trono di Sepolcride. Non abbiamo ancora un candidato da indicargli.",
      },
    ],
    nextStep: {
      text: "Individuare un possibile erede degno del trono di Sepolcride.",
      hypothetical: true,
    },
    portrait: {
      imageUrl: "./concepts/kenneth-haight.png",
      imageAlt:
        "Kenneth Haight, nobile dai capelli chiari e dagli occhi dorati",
      imagePosition: "50% 16%",
    },
    linkedConceptIds: ["kenneth-haight"],
  },
  {
    id: "gurranq",
    title: "Consumare la morte",
    npc: "Gurranq, bestia ecclesiastica",
    region: "Dracotumulo",
    status: "in-corso",
    summary:
      "Le radici mortali comparvero dopo la Notte dei Neri Coltelli e precedettero i non morti. Gurranq vuole consumarle; Red ipotizza che consegnargliele tutte possa fermare la piaga.",
    lastSeen: {
      location: "Santuario Ferino, Dracotumulo",
    },
    destination: {
      location: "Santuario Ferino",
      note: "Dove portare a Gurranq le radici mortali trovate.",
    },
    steps: [
      {
        title: "Incontro al Santuario Ferino",
        text: "Incontriamo Gurranq, la bestia ecclesiastica, al Santuario Ferino nel Dracotumulo.",
      },
      {
        title: "L’occhio e il sigillo",
        text: "Gurranq ci consegna un occhio per trovare le radici mortali e il Sigillo artiglio. Leggiamo le descrizioni dei due oggetti; per ora non abbiamo annotato altri sviluppi.",
      },
      {
        title: "La piaga delle radici",
        text: "Scopriamo che le radici mortali si diffusero dopo la congiura dei Neri Coltelli e che in seguito apparvero Coloro che vivono nella morte. Red ipotizza che farle consumare tutte a Gurranq possa porre fine ai non morti, ma non è ancora confermato.",
      },
    ],
    nextStep: {
      text: "Cercare radici mortali con l’aiuto dell’occhio e portarle a Gurranq.",
      hypothetical: false,
    },
    portrait: {
      imageUrl: "./concepts/gurranq.webp",
      imageAlt: "Gurranq, la bestia ecclesiastica del Santuario Ferino",
      imagePosition: "50% 35%",
    },
    linkedConceptIds: ["gurranq", "d-cacciatore", "radici-mortali", "coloro-che-vivono-nella-morte", "notte-neri-coltelli"],
  },
  {
    id: "edgar-irina",
    title: "Insurrezione",
    npc: "Edgar e Irina",
    region: "Penisola del Pianto e Liurnia",
    status: "conclusa",
    summary:
      "Dopo la morte di Irina, Edgar perde il senno e diventa un vendicatore assetato di sangue. Lo uccidiamo in una capanna di Liurnia.",
    lastSeen: {
      location: "Capanna del Vendicatore, Liurnia",
      note: "Edgar ci attacca e muore nello scontro. La storia di padre e figlia è terminata.",
    },
    steps: [
      {
        title: "La lettera di Irina",
        text: "Irina ci racconta della rivolta a Castel Morne e ci affida una lettera per suo padre Edgar, rimasto a difendere la fortezza.",
      },
      {
        title: "Edgar a Castel Morne",
        text: "Consegniamo la lettera a Edgar. Ci dona un ramoscello, ma resta nella fortezza per adempiere al proprio dovere.",
      },
      {
        title: "La morte di Irina",
        text: "Ritroviamo Irina morta al Ponte dei Sacrifici. Accanto al corpo c’è un’arma usata dalle Progenie. La sua storia si conclude qui.",
      },
      {
        title: "La promessa di Edgar",
        text: "Al Ponte dei Sacrifici, Edgar dice che vendicherà sua figlia. La sua storia resta aperta; non sappiamo ancora dove si dirigerà.",
      },
      {
        title: "Edgar il Vendicatore",
        text: "Ritroviamo Edgar presso una capanna di Liurnia, circondato dai corpi delle persone che ha ucciso. Ha perso il senno, ci assale e lo uccidiamo nello scontro.",
      },
      {
        title: "L’Uva di Shabriri",
        text: "Edgar lascia un’Uva di Shabriri. Il legame con la Frenesia è plausibile, ma resta un’ipotesi.",
      },
    ],
    portrait: {
      imageUrl: "./concepts/edgar-vendicatore.webp",
      imageAlt: "Edgar il Vendicatore combatte presso una capanna di Liurnia",
      imagePosition: "50% 28%",
    },
    gallery: [
      {
        imageUrl: "./concepts/irina.png",
        imageAlt: "Irina seduta presso il Ponte dei Sacrifici",
        caption: "Irina al nostro primo incontro",
      },
      {
        imageUrl: "./concepts/edgar.png",
        imageAlt: "Edgar il castellano in armatura sulle mura di Castel Morne",
        caption: "Edgar prima della morte di Irina",
      },
    ],
    linkedConceptIds: ["edgar-castellano", "irina", "castel-morne", "frenesia", "hyetta"],
  },
  {
    id: "nepheli",
    title: "Via col vento",
    npc: "Nepheli Loux",
    region: "Grantempesta",
    status: "in-corso",
    summary:
      "Seluvis vuole far bere a Nepheli una pozione. Gideon propone di eliminarla di nascosto e mentire allo stregone, che definisce un molestatore di bambole.",
    lastSeen: {
      location: "Tavola Rotonda",
    },
    steps: [
      {
        title: "La richiesta di Nepheli",
        text: "Nepheli si presenta come Senzaluce e guerriera, arrivata per ordine del padre. Ci chiede aiuto per liberare Grantempesta dalla sozzura compiuta da Godrick.",
      },
      {
        title: "Combattere insieme",
        text: "Evochiamo Nepheli e combattiamo insieme contro Godrick.",
      },
      {
        title: "Godrick ucciso",
        text: "Uccidiamo Godrick, portando a termine l’obiettivo indicato da Nepheli.",
      },
      {
        title: "Il padre adottivo",
        text: "Ritroviamo Nepheli alla Tavola Rotonda e scopriamo che Gideon è suo padre adottivo. Nepheli continuerà a svolgere incarichi per lui ed è pronta ad aiutarci ancora in battaglia.",
      },
      {
        title: "La pista del Re Falco",
        text: "Troviamo le ceneri dell’antico Re Falco di Grantempesta. Poiché Nepheli condanna Godrick per aver insozzato i venti della fortezza, annotiamo un possibile legame da verificare.",
      },
      {
        title: "La pozione di Seluvis",
        text: "Seluvis ci affida una pozione destinata a Nepheli. Gideon suggerisce di consegnargliela perché possa eliminarla di nascosto, poi riferire a Seluvis che il piano è riuscito. Non sappiamo ancora se voglia soltanto proteggere la figlia adottiva o perseguire un altro scopo.",
      },
    ],
    nextStep: {
      text: "Decidere se affidare la pozione a Gideon per proteggere Nepheli e ingannare Seluvis.",
      hypothetical: true,
    },
    trainerAdvice: "Fra le acque di Liurnia, in un cupo anfratto cosparso di impiccagioni.",
    portrait: {
      imageUrl: "./concepts/nepheli.png",
      imageAlt: "Nepheli Loux con abiti da guerriera e una grande ascia",
      imagePosition: "50% 22%",
    },
    linkedConceptIds: [
      "nepheli-loux",
      "godrick-innestato",
      "senzaluce",
      "hoarah-loux",
      "gideon-ofnir",
      "antica-grantempesta",
      "seluvis",
    ],
  },
  {
    id: "diallos",
    title: "Vocazione",
    npc: "Diallos Hoslow",
    region: "Tavola Rotonda",
    status: "in-corso",
    summary:
      "Diallos cerca la sua serva Lanya. Non sappiamo ancora dove si trovi.",
    lastSeen: {
      location: "Tavola Rotonda",
    },
    steps: [
      {
        title: "La ricerca di Lanya",
        text: "Incontriamo Diallos alla Tavola Rotonda. Ci chiede aiuto per trovare la sua serva Lanya.",
      },
    ],
    nextStep: {
      text: "Trovare Lanya, la serva di Diallos.",
      hypothetical: false,
    },
    trainerAdvice: "Sui ponti crollati del lago.",
    portrait: {
      imageUrl: "./concepts/diallos.png",
      imageAlt: "Diallos con l’armatura decorata della casata Hoslow",
      imagePosition: "50% 20%",
    },
    linkedConceptIds: ["diallos"],
  },
  {
    id: "patches",
    title: "Con amici come questi",
    npc: "Patches",
    region: "Sepolcride",
    status: "in-corso",
    summary:
      "Patches si è arreso dopo averci aggredito, ha aperto il suo emporio e ci ha poi ingannati con un forziere che ci ha teletrasportati a Tetrobosco.",
    lastSeen: {
      location: "Grotta di Acquafosca",
      note: "Siamo tornati a parlargli dopo essere sfuggiti alla trappola di trasferimento.",
    },
    steps: [
      {
        title: "Il forziere nella grotta",
        text: "Apriamo un forziere nella Grotta di Acquafosca e Patches ci aggredisce accusandoci di furto.",
      },
      {
        title: "La resa di Patches",
        text: "Durante lo scontro Patches si arrende. Lo risparmiamo e al nostro ritorno lo troviamo alla guida del suo emporio.",
      },
      {
        title: "La trappola di trasferimento",
        text: "Patches ci indirizza verso un altro forziere: aprendolo veniamo teletrasportati a Tetrobosco, senza poter viaggiare rapidamente finché non troviamo un luogo di grazia.",
      },
      {
        title: "Ritorno alla grotta",
        text: "Torniamo da Patches dopo la trappola. Si mostra sorpreso di vederci vivi e tratta l’inganno come una lezione, poi riprende i suoi affari.",
      },
    ],
    portrait: {
      imageUrl: "./concepts/patches.png",
      imageAlt: "Primo piano di Patches, mercante calvo dal volto segnato",
      imagePosition: "50% 32%",
    },
    linkedConceptIds: ["patches"],
  },
  {
    id: "yura",
    title: "Il cacciatore solitario",
    npc: "Yura, cacciatore di Dita Sanguinanti",
    region: "Sepolcride",
    status: "in-corso",
    summary:
      "Yura è intervenuto contro il Dito Sanguinante Nerijus. Dopo la vittoria si è presentato come cacciatore dei Senzaluce corrotti dal sangue che perseguitano i propri simili.",
    lastSeen: {
      location: "Costa di Acquafosca",
      note: "Lo abbiamo incontrato subito dopo l’invasione di Nerijus.",
    },
    steps: [
      {
        title: "Un incontro non registrato",
        text: "Abbiamo perso il dialogo introduttivo di Yura e non ne annotiamo il contenuto.",
      },
      {
        title: "L’invasione di Nerijus",
        text: "Il Dito Sanguinante Nerijus ci invade lungo il corso di Acquafosca. Yura entra nello scontro e ci aiuta a sconfiggerlo.",
      },
      {
        title: "Il cacciatore di Dita Sanguinanti",
        text: "Dopo lo scontro Yura loda la nostra sopravvivenza e si presenta. Descrive le Dita Sanguinanti come Senzaluce soggiogati da un sangue corrotto: fanatici che cacciano i propri simili e con cui, secondo lui, non è più possibile ragionare.",
      },
    ],
    trainerAdvice: "Cancelli dell'accademia.",
    portrait: {
      imageUrl: "./concepts/yura.jpg",
      imageAlt: "Yura con il grande cappello di ferro dopo lo scontro con Nerijus",
      imagePosition: "22% 50%",
    },
    linkedConceptIds: ["yura"],
  },
  {
    id: "hyetta",
    title: "Grant Us Eyes",
    npc: "Hyetta",
    region: "Liurnia Lacustre",
    status: "in-corso",
    updateKind: "aggiornata",
    summary:
      "Al Ponte della Città del Cancello abbiamo dato a Hyetta un’altra Uva di Shabriri e le abbiamo rivelato che si tratta di occhi umani. La scoperta l’ha sconvolta.",
    lastSeen: {
      location: "Ponte della Città del Cancello, Liurnia Lacustre",
      note: "È rimasta vicino alla grazia dopo aver scoperto la vera natura delle uve.",
    },
    steps: [
      {
        title: "Una fanciulla dal volto noto",
        text: "Incontriamo Hyetta dopo la morte di Irina. È cieca e il suo aspetto è identico a quello della giovane della Penisola del Pianto.",
      },
      {
        title: "Le Uve di Shabriri",
        text: "Hyetta ci chiede uve per farsi guidare verso una luce lontana. Scopriamo che si tratta di bulbi oculari ingialliti e marci, strappati da alcuni fedeli per essere donati a lei.",
      },
      {
        title: "Rovine Purificate",
        text: "L’ultima volta incontriamo Hyetta presso le Rovine Purificate di Liurnia Lacustre.",
      },
      {
        title: "La verità sulle uve",
        text: "Ritroviamo Hyetta presso il Ponte della Città del Cancello. Dopo un’altra uva le diciamo che sono occhi umani: reagisce con disgusto e malessere.",
      },
    ],
    nextStep: {
      text: "Esaurire il dialogo con Hyetta nell’ultima posizione.",
      hypothetical: false,
    },
    trainerAdvice: "Le manca ancora un dialogo nell’ultima posizione; poi cerca la chiesa più alta di Liurnia.",
    portrait: {
      imageUrl: "./concepts/hyetta.jpg",
      imageAlt: "Primo piano di Hyetta con gli occhi coperti da una benda",
      imagePosition: "50% 24%",
    },
    gallery: [
      {
        imageUrl: "./concepts/hyetta-grapes-fanart.jpg",
        imageAlt: "Fanart di Hyetta che regge un occhio simile a un’uva",
        caption: "Hyetta e le Uve di Shabriri · fanart",
      },
      {
        imageUrl: "./concepts/uva-shabriri.png",
        imageAlt: "Un bulbo oculare ingiallito e deformato chiamato Uva di Shabriri",
        caption: "Uva di Shabriri",
      },
    ],
    linkedConceptIds: ["hyetta", "irina", "liurnia-lacustre"],
  },
  {
    id: "thops",
    title: "Un maestro senza allievo",
    npc: "Thops",
    region: "Liurnia Lacustre",
    status: "conclusa",
    summary:
      "Consegnata la seconda Chiave di scintipietra, Thops torna a Raya Lucaria e completa una barriera degna di una nuova Epitome. Lo ritroviamo morto alla sua scrivania.",
    lastSeen: {
      location: "Accademia di Raya Lucaria",
      note: "Giace senza vita alla sua scrivania, accanto alla stregoneria che ha creato.",
    },
    steps: [
      {
        title: "Incontro alla Chiesa di Irith",
        text: "Incontriamo Thops, studente di Raya Lucaria rimasto fuori dai cancelli dopo lo Shattering.",
      },
      {
        title: "Una piccola donazione",
        text: "Gli doniamo dieci rune. Thops si presenta e mantiene la promessa di insegnarci i pochi incantesimi, piuttosto deboli, che conosce.",
      },
      {
        title: "I sigilli dell’Accademia",
        text: "Thops spiega che Raya Lucaria dichiarò la propria neutralità nello Shattering e sigillò i cancelli orientale e meridionale. Senza una Chiave di scintipietra non è possibile entrare né proseguire verso la capitale.",
      },
      {
        title: "Una chiave anche per Thops",
        text: "Ci chiede di cercare una Chiave di scintipietra e, se ne troveremo una seconda dopo aver sistemato i nostri affari, di donargliela per permettergli di tornare all’Accademia.",
      },
      {
        title: "La prima chiave",
        text: "Troviamo una Chiave di scintipietra che ci permette di entrare a Raya Lucaria. Thops rifiuta di prenderla e insiste perché usiamo noi questa occasione; accetterebbe soltanto un secondo esemplare.",
      },
      {
        title: "Il ritorno all’Accademia",
        text: "Gli consegniamo una seconda chiave. In lacrime per la gioia, Thops ci ringrazia e parte finalmente per Raya Lucaria.",
      },
      {
        title: "Una nuova Epitome",
        text: "Lo ritroviamo morto alla sua scrivania. Prima di morire ha completato la Barriera di Thops, capace di deviare stregonerie e incantesimi: una scoperta che le generazioni future riterranno degna di una nuova Epitome.",
      },
    ],
    portrait: {
      imageUrl: "./concepts/thops.jpg",
      imageAlt: "Thops seduto su una panca con le vesti da studioso di scintipietra",
      imagePosition: "50% 34%",
    },
    gallery: [
      {
        imageUrl: "./concepts/barriera-thops.png",
        imageAlt: "Icona della Barriera di Thops",
        caption: "Barriera di Thops · la sua eredità accademica",
      },
    ],
    linkedConceptIds: ["thops", "accademia-raya-lucaria", "scintipietra", "liurnia-lacustre"],
  },
  {
    id: "rya",
    title: "Family’s complicated",
    npc: "Rya l’esploratrice",
    region: "Liurnia Lacustre",
    status: "in-corso",
    summary:
      "Recuperato il medaglione, Rya rivela di servire Lady Tanith e ci invita ufficialmente a Villa Vulcano sull’Altopiano di Altus.",
    lastSeen: {
      location: "Centro di Liurnia Lacustre",
      note: "Ci consegna l’invito di Villa Vulcano e spera di incontrarci di nuovo.",
    },
    destination: {
      location: "Altopiano di Altus",
      note: "Rya indica il Grande Montacarichi di Dectus oppure il vecchio tunnel scavato nella rupe a nord di Liurnia.",
    },
    steps: [
      {
        title: "L’esploratrice di Liurnia",
        text: "Incontriamo Rya nel centro di Liurnia. La sua pelle chiarissima e la postura fortemente curva la rendono immediatamente riconoscibile.",
      },
      {
        title: "Il medaglione rubato",
        text: "Rya racconta che qualcuno le ha sottratto un medaglione e ci chiede di recuperarlo. Il responsabile dovrebbe trovarsi poco distante.",
      },
      {
        title: "Il Mercante di gamberi",
        text: "Troviamo il ladro presso una baracca di Liurnia e recuperiamo il medaglione, decorato con il ritratto di una donna dall’aspetto dignitoso proveniente da un paese straniero.",
      },
      {
        title: "L’invito di Villa Vulcano",
        text: "Restituiamo il medaglione. Rya rivela di servire Lady Tanith di Villa Vulcano e, giudicandoci adatti alla sua famiglia di campioni, ci consegna un invito ufficiale.",
      },
      {
        title: "Due vie verso Altus",
        text: "Rya ci invita a raggiungere l’Altopiano di Altus. Oltre al Grande Montacarichi di Dectus, segnala un vecchio tunnel che attraversa la rupe alla base della valle.",
      },
    ],
    nextStep: {
      text: "Raggiungere l’Altopiano di Altus attraverso il tunnel a nord di Liurnia oppure completando il Medaglione di Dectus, quindi cercare Rya e Villa Vulcano.",
      hypothetical: false,
    },
    portrait: {
      imageUrl: "./concepts/rya.png",
      imageAlt: "Rya in abito verde, con pelle chiarissima e postura curva",
      imagePosition: "50% 20%",
    },
    gallery: [
      {
        imageUrl: "./concepts/mercante-gamberi.webp",
        imageAlt: "Il mercante di gamberi accovacciato accanto a una grande pentola a Liurnia",
        caption: "Il ladro del medaglione",
      },
    ],
    linkedConceptIds: ["rya", "liurnia-lacustre", "mercante-gamberi", "medaglione-dectus"],
  },
  {
    id: "ehi-cuggi",
    title: "EHI CUGGI",
    npc: "Vasi di Vasburgo",
    region: "Liurnia Lacustre",
    status: "in-corso",
    summary:
      "A Vasburgo un piccolo vaso ci chiama cuggino e ci propone di diventare Potentato. Dopo l’attacco ai vasi, l’assoluzione alla Chiesa dei Voti ha salvato la storia dalla chiusura prematura.",
    lastSeen: {
      location: "Vasburgo, Liurnia Lacustre",
      note: "Il piccolo vaso resta nel villaggio e ci invita a tornare a trovarlo.",
    },
    destination: {
      location: "Non ancora nota",
    },
    steps: [
      {
        title: "Arrivo a Vasburgo",
        text: "Raggiungiamo un villaggio abitato da vasi pacifici, che non mostrano ostilità al nostro arrivo.",
      },
      {
        title: "L’attacco ai vasi",
        text: "Red attacca i vasi di Vasburgo e i superstiti diventano ostili: la storia del villaggio sembra interrompersi.",
      },
      {
        title: "Assoluzione",
        text: "Alla Chiesa dei Voti chiediamo l’assoluzione dei peccati per l’attacco ai vasi: la storia di Vasburgo torna aperta.",
      },
      {
        title: "Il piccolo cuggino",
        text: "Un piccolo vaso ci accoglie chiamandoci cuggino, un nomignolo affettuoso in stile bro, e ci chiede se vogliamo diventare il nuovo Potentato, termine arcaico per vasaio. Accettiamo e ci sottopone alla prova delle mani: le nostre non sono abbastanza lisce e scivolose, così rifiuta, ma resta amichevole e ci invita a tornare.",
      },
      {
        title: "Fiori e zio Alexander",
        text: "Il vaso ci segnala i fiori rari del villaggio che possiamo raccogliere e ci parla dello zio Alexander, partito per diventare campione. Ci chiede di farci insegnare a combattere da lui se lo incontriamo. Confessa di essere anche lui un vaso guerriero e di voler un giorno lasciare il villaggio.",
      },
    ],
    nextStep: {
      text: "Trovare qualcuno con mani più lisce e adatte a diventare Potentato. Non abbiamo ancora un nome o un luogo da seguire.",
      hypothetical: true,
    },
    portrait: {
      imageUrl: "./concepts/vasburgo-vaso.webp",
      imageAlt: "Un piccolo vaso senziente seduto fra i fiori di Vasburgo",
      imagePosition: "30% 46%",
    },
    linkedConceptIds: ["liurnia-lacustre", "chiesa-dei-voti", "miriel", "alexander-vaso-guerriero"],
  },
];
