import { usePersistentState } from '../hooks/usePersistentState'
import { ClassicBoard } from './ClassicBoard'
import { DossierBoard } from './DossierBoard'
import '../dossier-board.css'

export interface ConceptBoardProps {
  activeConceptId?: string
  onOpenConcept: (conceptId: string) => void
  onCloseConcept: () => void
}

export function ConceptBoard(props: ConceptBoardProps) {
  const [mode, setMode] = usePersistentState<'dossiers' | 'classic'>('elden-rhapsody:board-view', 'dossiers')
  return (
    <>
      <div className="board-view-switch" role="group" aria-label="Vista della lavagna">
        <button type="button" aria-pressed={mode !== 'classic'} onClick={() => setMode('dossiers')}>Fascicoli</button>
        <button type="button" aria-pressed={mode === 'classic'} onClick={() => setMode('classic')}>Lavagna completa</button>
      </div>
      {mode === 'classic' ? <ClassicBoard {...props} /> : <DossierBoard {...props} />}
    </>
  )
}
