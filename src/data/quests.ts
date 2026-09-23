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
    summary: "Accompagnare Melina ai piedi dell’Albero Madre.",

    destination: {
      location: "Ai piedi dell’Albero Madre",
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
    ],

    nextStep: {
      text: "Raggiungere l’Albero Madre.",
      hypothetical: false,
    },

    portrait: {
      imageUrl: "./concepts/melina.png",
      imageAlt: "Melina con un occhio chiuso e un simbolo scuro sul volto",
      imagePosition: "50% 25%",
    },
    gallery: [
      { imageUrl: "./concepts/margit.png", imageAlt: "Margit a guardia di Grantempesta", caption: "Margit il Presagio" },
      { imageUrl: "./concepts/godrick.png", imageAlt: "Godrick con le sue membra innestate", caption: "Godrick l’Innestato" },
      { imageUrl: "./concepts/progenie-innestata.webp", imageAlt: "La creatura con numerosi arti innestati", caption: "La creatura innestata di Grantempesta" },
    ],
    linkedConceptIds: ["melina", "albero-madre", "margit", "godrick-innestato", "progenie-innestata"],
  },
  {
    id: "varre",
    title: "La Maschera Bianca",
    npc: "Varré",
    region: "Sepolcride",
    status: "in-corso",
    summary:
      "Abbiamo seguito l’indicazione di Varré: Godrick è sconfitto e abbiamo ottenuto udienza dalle Due Dita. Nessun seguito ancora annotato.",

    lastSeen: {
      location: "Primo Passo",
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
    summary:
      "Dopo l’incontro con Boc, la prossima tappa è una grotta sulla spiaggia a ovest di Sepolcride.",

    lastSeen: {
      location: "Sepolcride centrale",
    },
    destination: {
      location: "Grotta sulla spiaggia a ovest di Sepolcride",
    },
    steps: [
      {
        title: "Incontro con Boc",
        text: "Incontriamo Boc, un semiumano, nella Sepolcride centrale.",
      },
    ],
    nextStep: {
      text: "Raggiungere la grotta sulla spiaggia a ovest di Sepolcride.",
      hypothetical: false,
    },
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
    summary: "Abbiamo liberato Alexander, rimasto incastrato nel terreno. È diretto a Castel Mantorosso per un festival di combattimento.",
    lastSeen: {
      location: "Sepolcride nord",
      note: "Nel punto in cui lo abbiamo aiutato a uscire dal terreno.",
    },
    destination: {
      location: "Castel Mantorosso",
      note: "Alexander vuole raggiungerlo per un festival di combattimento.",
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
    ],
    nextStep: {
      text: "Raggiungere Castel Mantorosso, la destinazione indicata da Alexander.",
      hypothetical: false,
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
    summary: "Abbiamo incontrato Sellen e un suo apparente duplicato. Non sappiamo ancora come spiegare il «manichino» o come intervenire.",
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
    summary: "Abbiamo aiutato Blaidd contro Darriwil. La prossima indicazione ci porta da un fabbro gigante a nord.",
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
    summary: "Rogier ci ha aiutato contro Margit. Lo abbiamo poi incontrato nella chiesa di Grantempesta, dove offre i suoi insegnamenti. Nessuna nuova destinazione nota.",
    lastSeen: {
      location: "Chiesa di Grantempesta",
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
    ],
    portrait: {
      imageUrl: "./concepts/rogier.png",
      imageAlt: "Rogier con il cappello da stregone nella chiesa di Grantempesta",
      imagePosition: "50% 20%",
    },
    linkedConceptIds: ["rogier", "margit", "principesse-cariane"],
  },
  {
    id: "roderika",
    title: "Crisalidi",
    npc: "Roderika",
    region: "Grantempesta",
    status: "in-corso",
    summary: "Roderika ci ha affidato un messaggio per i suoi uomini. Li abbiamo trovati nel cumulo di cadaveri destinati agli innesti a Grantempesta.",
    lastSeen: {
      location: "Capanna a Grantempesta",
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
    ],
    portrait: {
      imageUrl: "./concepts/roderika.jpg",
      imageAlt: "Roderika con il mantello rosso all’interno della capanna",
      imagePosition: "50% 25%",
    },
    linkedConceptIds: ["roderika", "godrick-innestato"],
  },
  {
    id: "renna",
    title: "La luna nera",
    npc: "Strega Renna",
    region: "Sepolcride",
    status: "in-corso",
    summary: "Abbiamo incontrato la strega Renna alla Chiesa di Elleh. Non conosciamo la sua prossima destinazione.",
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
    summary: "Abbiamo ucciso il marinaio non morto da cui D ci aveva messi in guardia e incontrato Gurranq seguendo la sua indicazione.",
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
    linkedConceptIds: ["d-cacciatore", "coloro-che-vivono-nella-morte", "gurranq"],
  },
  {
    id: "kenneth",
    title: "Successione",
    npc: "Kenneth Haight",
    region: "Sepolcride",
    status: "in-corso",
    summary: "Abbiamo liberato il forte di Kenneth. Ora attende un degno erede al trono di Sepolcride.",
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
      imageAlt: "Kenneth Haight, nobile dai capelli chiari e dagli occhi dorati",
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
    summary: "Abbiamo incontrato Gurranq e ricevuto un occhio di pietra e il Sigillo artiglio. Ci chiede di cercare radici mortali.",
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
    summary: "La storia di Irina è conclusa con la sua morte. Quella di Edgar prosegue: al Ponte dei Sacrifici promette di vendicare sua figlia.",
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
    summary: "Nepheli, Senzaluce e guerriera, voleva liberare Grantempesta dalla sozzura di Godrick. L’abbiamo evocata contro di lui; dopo la vittoria non abbiamo incontrato altri sviluppi.",
    lastSeen: {
      location: "Grantempesta",
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
        text: "Uccidiamo Godrick, portando a termine l’obiettivo indicato da Nepheli. Non abbiamo ancora rivisto la guerriera dopo lo scontro.",
      },
    ],
    portrait: {
      imageUrl: "./concepts/nepheli.png",
      imageAlt: "Nepheli Loux con abiti da guerriera e una grande ascia",
      imagePosition: "50% 22%",
    },
    linkedConceptIds: ["nepheli-loux", "godrick-innestato", "senzaluce", "hoarah-loux"],
  },
  {
    id: "diallos",
    title: "Vocazione",
    npc: "Diallos Hoslow",
    region: "Tavola Rotonda",
    status: "in-corso",
    summary: "Diallos cerca la sua serva Lanya. Non sappiamo ancora dove si trovi.",
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
];
