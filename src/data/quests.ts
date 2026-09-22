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
        title: "Incontro con Melina",
        text: "Incontriamo Melina e accettiamo di accompagnarla ai piedi dell’Albero Madre.",
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
    linkedConceptIds: ["melina", "albero-madre"],
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
    summary: "Rogier ci offre i suoi insegnamenti e ci aiuta contro Margit. Non conosciamo ancora la sua prossima destinazione.",
    lastSeen: {
      location: "Chiesa di Grantempesta",
    },
    steps: [
      {
        title: "Gli incontri con Rogier",
        text: "Incontriamo Rogier nella chiesa di Grantempesta, dove ci offre i suoi insegnamenti. Ci ha anche aiutato a combattere Margit.",
      },
    ],
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
];
