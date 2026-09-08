import { concepts } from './project'

export const boardGroups = [
  { id: 'ordine-spezzato', label: 'Ordine spezzato', conceptIds: ['elden-ring', 'regina-marika', 'notte-neri-coltelli', 'runa-della-morte', 'albero-madre', 'godfrey', 'guerra-shattering', 'semidei', 'miquella', 'malenia-la-recisa', 'radahn', 'godrick-innestato'] },
  { id: 'senzaluce', label: 'Senzaluce', conceptIds: ['senzaluce', 'grazia', 'vergini-delle-dita', 'melina', 'hoarah-loux', 'goldmask', 'mangiasterco', 'varre', 'strega-sconosciuta'] },
  { id: 'primi-incontri', label: 'Primi incontri', conceptIds: ['mercante-kale', 'boc', 'roderika', 'galere-eterne'] },
  { id: 'stregoneria', label: 'Stregoneria', conceptIds: ['accademia-raya-lucaria', 'scintipietra', 'sellen'] },
  { id: 'castel-morne', label: 'Castel Morne', conceptIds: ['irina', 'castel-morne', 'edgar-castellano', 'progenie', 'progenie-leonina'] },
  { id: 'caelid', label: 'Caelid', conceptIds: ['caelid', 'palude-aeonia', 'marcescenza', 'sellia'] },
  { id: 'tavola-rotonda', label: 'Tavola Rotonda', conceptIds: ['tavola-rotonda', 'diallos', 'corhyn', 'd-cacciatore', 'fia', 'gideon-ofnir', 'hewg'] },
  { id: 'fede-morte-sonno', label: 'Fede, morte e sonno', conceptIds: ['due-dita', 'ordine-aureo', 'spiriti', 'fiamma-della-rovina', 'coloro-che-vivono-nella-morte', 'santa-trina'] },
]

// Newly added concepts remain reachable even before receiving a curated group.
const assignedIds = new Set(boardGroups.flatMap(group => group.conceptIds))
const unassignedIds = concepts.filter(concept => !assignedIds.has(concept.id)).map(concept => concept.id)
if (unassignedIds.length) boardGroups.push({ id: 'altri-appunti', label: 'Altri appunti', conceptIds: unassignedIds })

export function groupForConcept(id: string) {
  return boardGroups.find(group => group.conceptIds.includes(id))
}

export const defaultBoardGroup = [...boardGroups].sort((a, b) =>
  concepts.filter(item => b.conceptIds.includes(item.id) && item.liveReadStatus === 'da-leggere').length -
  concepts.filter(item => a.conceptIds.includes(item.id) && item.liveReadStatus === 'da-leggere').length,
)[0]
