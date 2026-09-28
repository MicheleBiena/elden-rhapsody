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
    updateKind: "nuova",
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
          "Guerriero feroce che combatté Malenia e la sua marcescenza fino a uno stallo. Caelid è ormai sommersa dal marcio scarlatto; Radahn sembra essere ancora lì, ma forse non assomiglia più a com’era un tempo.",
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
      },
    ],
    linkedConceptIds: [
      "gideon-ofnir",
      "godrick-innestato",
      "radahn",
      "leyndell",
    ],
  },
  {
    id: "varre",
    title: "La Maschera Bianca",
    npc: "Varré",
    region: "Sepolcride",
    status: "in-corso",
    summary:
      "Abbiamo seguito l’indicazione di Varré: Godrick è sconfitto e abbiamo ottenuto udienza dalle Due Dita.",

    lastSeen: {
      location: "Primo Passo",
    },
    nextStep: {
      text: "Chiesa della Rosa (Liurnia)",
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
        text: "Varré ci consiglia di raggiungerlo alla Chiesa della Rosa a Liurnia (Nord)",
      },
    ],
    portrait: {
      imageUrl: "./concepts/varre.webp",
      imageAlt: "Varré con la sua maschera bianca",
      imagePosition: "50% 20%",
    },
    linkedConceptIds: ["varre", "godrick-innestato", "due-dita"],
  },
  {
    id: "boc",
    title: "Il vestito è un po’ antiquato…",
    npc: "Boc il semiumano",
    region: "Sepolcride",
    status: "in-corso",
    updateKind: "aggiornata",
    summary:
      "Abbiamo recuperato nella grotta sulla spiaggia l’ago e il filo appartenuti alla madre di Boc e glieli abbiamo consegnati. Non conosciamo il prossimo passo.",

    lastSeen: {
      location: "Grotta sulla spiaggia a ovest di Sepolcride",
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
    region: "Sepolcride",
    status: "in-corso",
    updateKind: "aggiornata",
    summary:
      "Alexander è rimasto bloccato dietro una porta chiusa in una miniera fra Sepolcride e Caelid. Potrebbe essere necessario raggiungere l’ingresso sul lato di Caelid.",
    lastSeen: {
      location: "Miniera fra Sepolcride e Caelid",
      note: "È dietro una porta che non possiamo aprire dal nostro lato.",
    },
    destination: {
      location: "Ingresso della miniera sul lato di Caelid",
      note: "Possibile percorso per raggiungerlo e aprire il passaggio.",
    },
    steps: [
      {
        title: "Un vaso incastrato",
        text: "Incontriamo Alexander a nord di Sepolcride, bloccato nel terreno, e lo aiutiamo a liberarsi.",
      },
      {
        title: "Il festival di combattimento",
        text: "Alexander ci racconta che la sua destinazione è Castel Mantorosso, dove si terrà un festival di combattimento.",
      },
      {
        title: "Dietro una porta chiusa",
        text: "Ritroviamo Alexander bloccato dietro una porta in una miniera fra Sepolcride e Caelid; da questo lato il passaggio non si apre.",
      },
    ],
    nextStep: {
      text: "Cercare l’altro ingresso della miniera sul lato di Caelid e provare ad aprire il passaggio verso Alexander.",
      hypothetical: true,
    },
    portrait: {
      imageUrl: "./concepts/alexander.webp",
      imageAlt: "Alexander, il grande vaso guerriero incastrato nel terreno",
      imagePosition: "50% 45%",
    },
    linkedConceptIds: ["alexander-vaso-guerriero"],
  },
  {
    id: "sellen",
    title: "Maestra di stelle",
    npc: "Sellen",
    region: "Sepolcride",
    status: "in-corso",
    summary:
      "Abbiamo incontrato Sellen e un suo apparente duplicato. Non sappiamo ancora come spiegare il «manichino» o come intervenire.",
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
    ],
    nextStep: {
      text: "Trovare qualcuno che possa spiegarci il clone e che cosa possiamo fare per Sellen. Non abbiamo ancora un nome o un luogo da seguire.",
      hypothetical: true,
    },
    portrait: {
      imageUrl: "./concepts/sellen.png",
      imageAlt: "La strega Sellen con la sua maschera di pietra",
      imagePosition: "50% 20%",
    },
    linkedConceptIds: ["sellen"],
  },
  {
    id: "blaidd",
    title: "Berserk",
    npc: "Blaidd il Mezzolupo",
    region: "Sepolcride",
    status: "in-corso",
    summary:
      "Abbiamo aiutato Blaidd contro Darriwil. La prossima indicazione ci porta da un fabbro gigante a nord.",
    lastSeen: {
      location: "Galera eterna del limiere alacre",
    },
    destination: {
      location: "Un fabbro gigante a nord",
    },
    steps: [
      {
        title: "Darriwil",
        text: "Aiutiamo Blaidd ad affrontare Darriwil nella Galera eterna del limiere alacre.",
      },
      {
        title: "L’indicazione del fabbro",
        text: "Dopo Darriwil, Blaidd ci indirizza verso un fabbro gigante a nord.",
      },
    ],
    nextStep: {
      text: "Cercare il fabbro gigante a nord indicato da Blaidd.",
      hypothetical: false,
    },
    portrait: {
      imageUrl: "./concepts/mezzolupo.jpg",
      imageAlt: "Blaidd il Mezzolupo in armatura con una grande spada",
      imagePosition: "50% 20%",
    },
    linkedConceptIds: ["mezzolupo", "galere-eterne"],
  },
  {
    id: "rogier",
    title: "Beata ignoranza",
    npc: "Stregone Rogier",
    region: "Grantempesta",
    status: "in-corso",
    updateKind: "aggiornata",
    summary:
      "Rogier studia il morbo mortale e la Notte dei Neri Coltelli. Dopo il contatto con il cadavere sotto Grantempesta, lo ritroviamo infermo alla Tavola Rotonda.",
    lastSeen: {
      location: "Tavola Rotonda",
      note: "È seduto e mostra sul corpo tracce evidenti del morbo mortale.",
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
    ],
    nextStep: {
      text: "Cercare altre informazioni sul morbo mortale, sulla Runa della Morte e sul Marchio del Centipede.",
      hypothetical: false,
    },
    portrait: {
      imageUrl: "./concepts/rogier.png",
      imageAlt:
        "Rogier con il cappello da stregone nella chiesa di Grantempesta",
      imagePosition: "50% 20%",
    },
    linkedConceptIds: ["rogier", "margit", "principesse-cariane", "morbo-mortale", "marchio-centipede", "notte-neri-coltelli", "runa-della-morte", "d-cacciatore"],
  },
  {
    id: "roderika",
    title: "Crisalidi",
    npc: "Roderika",
    region: "Grantempesta",
    status: "conclusa",
    updateKind: "aggiornata",
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
    id: "renna",
    title: "La luna nera",
    npc: "Strega Renna",
    region: "Sepolcride",
    status: "in-corso",
    summary:
      "Abbiamo incontrato la strega Renna alla Chiesa di Elleh. Non conosciamo la sua prossima destinazione.",
    lastSeen: {
      location: "Chiesa di Elleh",
    },
    steps: [
      {
        title: "Incontro alla Chiesa di Elleh",
        text: "La strega Renna ci appare alla Chiesa di Elleh: è la sua ultima comparsa annotata.",
      },
    ],
    portrait: {
      imageUrl: "./concepts/strega-sconosciuta.webp",
      imageAlt: "La strega Renna con il suo grande cappello",
      imagePosition: "50% 20%",
    },
    linkedConceptIds: ["strega-sconosciuta"],
  },
  {
    id: "d",
    title: "La doppia faccia",
    npc: "D, cacciatore di non morti",
    region: "Tavola Rotonda",
    status: "in-corso",
    summary:
      "Abbiamo ucciso il marinaio non morto da cui D ci aveva messi in guardia e incontrato Gurranq seguendo la sua indicazione.",
    lastSeen: {
      location: "Tavola Rotonda",
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
      "Abbiamo incontrato Gurranq e ricevuto un occhio di pietra e il Sigillo artiglio. Ci chiede di cercare radici mortali.",
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
    linkedConceptIds: ["gurranq", "d-cacciatore"],
  },
  {
    id: "edgar-irina",
    title: "Insurrezione",
    npc: "Edgar e Irina",
    region: "Penisola del Pianto",
    status: "in-corso",
    summary:
      "La storia di Irina è conclusa con la sua morte. Quella di Edgar prosegue: al Ponte dei Sacrifici promette di vendicare sua figlia.",
    lastSeen: {
      location: "Ponte dei Sacrifici",
      note: "Edgar vuole vendicare sua figlia; la sua storia è ancora in corso. Solo quella di Irina è conclusa.",
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
    ],
    portrait: {
      imageUrl: "./concepts/edgar.png",
      imageAlt: "Edgar il castellano in armatura sulle mura di Castel Morne",
      imagePosition: "50% 10%",
    },
    gallery: [
      {
        imageUrl: "./concepts/irina.png",
        imageAlt: "Irina seduta presso il Ponte dei Sacrifici",
        caption: "Irina al nostro primo incontro",
      },
    ],
    linkedConceptIds: ["edgar-castellano", "irina", "castel-morne"],
  },
  {
    id: "nepheli",
    title: "Via col vento",
    npc: "Nepheli Loux",
    region: "Grantempesta",
    status: "in-corso",
    updateKind: "aggiornata",
    summary:
      "Dopo la vittoria su Godrick, ritroviamo Nepheli alla Tavola Rotonda e scopriamo che Gideon è suo padre adottivo. È pronta ad aiutarci ancora in battaglia.",
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
    ],
    nextStep: {
      text: "Ritrovare Nepheli dopo che avrà proseguito gli incarichi affidati da Gideon.",
      hypothetical: true,
    },
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
    updateKind: "nuova",
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
    updateKind: "nuova",
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
    portrait: {
      imageUrl: "./concepts/yura.jpg",
      imageAlt: "Yura con il grande cappello di ferro dopo lo scontro con Nerijus",
      imagePosition: "22% 50%",
    },
    linkedConceptIds: ["yura"],
  },
];
