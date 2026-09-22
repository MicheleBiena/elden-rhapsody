import type { QuestEntry } from "../types";

// Il Questbook viene compilato esclusivamente con le quest e le tappe fornite
// dall’utente. Non ricostruire missioni dalle schede lore o da guide esterne.
export const quests: QuestEntry[] = [
  {
    id: "melina",
    title: "La quest principale",
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
    summary: "Abbiamo seguito l’indicazione di Varré: Godrick è sconfitto e abbiamo ottenuto udienza dalle Due Dita. Nessun seguito ancora annotato.",

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
    summary: "Dopo l’incontro con Boc, la prossima tappa è una grotta sulla spiaggia a ovest di Sepolcride.",

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
];
