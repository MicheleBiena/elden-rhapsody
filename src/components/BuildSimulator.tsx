import {
  Check,
  CircleGauge,
  FileUp,
  Gem,
  LockKeyhole,
  RefreshCcw,
  Search,
  Shield,
  Sparkles,
  Swords,
} from 'lucide-react'
import { useMemo, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from 'react'
import {
  parseBuildSave,
  type BuildCharacter,
  type BuildItem,
  type ParsedBuildSave,
} from '../lib/elden-save-reader'
import './build-simulator.css'

const MAX_FILE_SIZE = 50 * 1024 * 1024

const statLabels = [
  ['VIG', 'Tempra', 'vigor'],
  ['MND', 'Mente', 'mind'],
  ['END', 'Vigore', 'endurance'],
  ['STR', 'Forza', 'strength'],
  ['DEX', 'Destrezza', 'dexterity'],
  ['INT', 'Intelligenza', 'intelligence'],
  ['FAI', 'Fede', 'faith'],
  ['ARC', 'Arcano', 'arcane'],
] as const

const armorSlots = ['Testa', 'Torso', 'Braccia', 'Gambe']

function displayItem(item: BuildItem | null): string {
  if (!item) return '—'
  return item.category === 'weapon' && item.upgradeLevel
    ? `${item.name} +${item.upgradeLevel}`
    : item.name
}

function EquippedList({
  title,
  items,
  labels,
}: {
  title: string
  items: Array<BuildItem | null>
  labels: string[]
}) {
  return (
    <div className="build-equipped-group">
      <h3>{title}</h3>
      <dl>
        {items.map((item, index) => (
          <div key={`${title}-${labels[index]}`}>
            <dt>{labels[index]}</dt>
            <dd className={item ? undefined : 'is-empty'}>{displayItem(item)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function InventorySection({
  title,
  items,
  icon,
  emptyLabel,
}: {
  title: string
  items: BuildItem[]
  icon: ReactNode
  emptyLabel: string
}) {
  return (
    <details className="build-inventory-section">
      <summary>
        <span className="build-inventory-section__icon" aria-hidden="true">{icon}</span>
        <strong>{title}</strong>
        <span>{items.length}</span>
      </summary>
      {items.length ? (
        <ul>
          {items.map((item) => (
            <li key={`${item.category}-${item.id}-${item.upgradeLevel ?? 0}`}>
              <span>
                {displayItem(item)}
                {item.spellType && <small>{item.spellType === 'sorcery' ? 'Stregoneria' : 'Incantesimo'}</small>}
              </span>
              <span className="build-item-meta">
                {item.equipped && <em><Check aria-hidden="true" /> Equipaggiato</em>}
                {item.quantity > 1 && <small>×{item.quantity}</small>}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="build-empty-list">{emptyLabel}</p>
      )}
    </details>
  )
}

function CharacterDashboard({ character }: { character: BuildCharacter }) {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLocaleLowerCase('it')
  const filterItems = (items: BuildItem[]) => normalizedQuery
    ? items.filter((item) => item.name.toLocaleLowerCase('it').includes(normalizedQuery))
    : items

  const filtered = {
    weapons: filterItems(character.inventory.weapons),
    armor: filterItems(character.inventory.armor),
    talismans: filterItems(character.inventory.talismans),
    spells: filterItems(character.inventory.spells),
  }

  return (
    <div className="build-dashboard">
      <header className="build-character-header">
        <div>
          <p className="overline">Slot {character.slotIndex + 1} · Livello {character.level}</p>
          <h2>{character.name}</h2>
        </div>
        <div className="build-rune-count">
          <span>Rune possedute</span>
          <strong>{character.runes.toLocaleString('it-IT')}</strong>
        </div>
      </header>

      <section className="build-panel" aria-labelledby="stats-title">
        <div className="build-panel-heading">
          <CircleGauge aria-hidden="true" />
          <div><p className="overline">Profilo</p><h2 id="stats-title">Statistiche</h2></div>
        </div>
        <div className="build-resource-strip">
          <span><small>PV</small><strong>{character.hp} / {character.maxHp}</strong></span>
          <span><small>PA</small><strong>{character.fp} / {character.maxFp}</strong></span>
          <span><small>Stamina</small><strong>{character.stamina} / {character.maxStamina}</strong></span>
        </div>
        <dl className="build-stats-grid">
          {statLabels.map(([abbr, label, key]) => (
            <div key={key}>
              <dt><abbr title={label}>{abbr}</abbr><span>{label}</span></dt>
              <dd>{character.stats[key]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="build-two-column">
        <section className="build-panel" aria-labelledby="equipment-title">
          <div className="build-panel-heading">
            <Shield aria-hidden="true" />
            <div><p className="overline">Loadout attuale</p><h2 id="equipment-title">Equipaggiamento</h2></div>
          </div>
          <div className="build-equipped-grid">
            <EquippedList title="Mano destra" items={character.equipped.rightHand} labels={['Slot 1', 'Slot 2', 'Slot 3']} />
            <EquippedList title="Mano sinistra" items={character.equipped.leftHand} labels={['Slot 1', 'Slot 2', 'Slot 3']} />
            <EquippedList title="Armatura" items={character.equipped.armor} labels={armorSlots} />
            <EquippedList title="Talismani" items={character.equipped.talismans.slice(0, character.talismanSlots)} labels={['Slot 1', 'Slot 2', 'Slot 3', 'Slot 4']} />
          </div>
        </section>

        <div className="build-side-panels">
          <section className="build-panel build-memory" aria-labelledby="memory-title">
            <div className="build-panel-heading">
              <Sparkles aria-hidden="true" />
              <div><p className="overline">Armonizzazione</p><h2 id="memory-title">Slot memoria</h2></div>
            </div>
            <div className="build-memory-count"><strong>{character.memorySlots}</strong><span>slot attuali</span></div>
            <p>{character.memoryStones} Pietre della Memoria rilevate · {character.potentialMemorySlots} slot disponibili con i talismani posseduti.</p>
            {character.moonOfNokstellaEquipped && <span className="build-equipped-pill"><Check aria-hidden="true" /> Luna di Nokstella equipaggiata (+2)</span>}
            <div className="build-spell-slots" aria-label={`${character.equipped.spells.length} magie armonizzate`}>
              {character.equipped.spells.length
                ? character.equipped.spells.map((spell) => <span key={spell.id}>{spell.name}</span>)
                : <span className="is-empty">Nessuna magia rilevata negli slot.</span>}
            </div>
          </section>

          <section className="build-panel build-great-rune" aria-labelledby="great-rune-title">
            <div className="build-panel-heading">
              <Gem aria-hidden="true" />
              <div><p className="overline">Potere maggiore</p><h2 id="great-rune-title">Runa Maggiore</h2></div>
            </div>
            <strong>{character.equipped.greatRune ?? 'Nessuna Runa Maggiore equipaggiata'}</strong>
            {character.equipped.greatRune && <span>Runa equipaggiata nel salvataggio</span>}
          </section>
        </div>
      </div>

      <section className="build-panel build-inventory" aria-labelledby="inventory-title">
        <div className="build-inventory-header">
          <div className="build-panel-heading">
            <Swords aria-hidden="true" />
            <div><p className="overline">Disponibile per la build</p><h2 id="inventory-title">Inventario leggibile</h2></div>
          </div>
          <label className="build-search">
            <Search aria-hidden="true" />
            <span className="sr-only">Cerca nell'inventario</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cerca un oggetto…" />
          </label>
        </div>
        <div className="build-inventory-grid">
          <InventorySection title="Armi" items={filtered.weapons} icon={<Swords />} emptyLabel="Nessuna arma corrispondente." />
          <InventorySection title="Armature" items={filtered.armor} icon={<Shield />} emptyLabel="Nessuna armatura corrispondente." />
          <InventorySection title="Talismani" items={filtered.talismans} icon={<Gem />} emptyLabel="Nessun talismano corrispondente." />
          <InventorySection title="Magie equipaggiabili" items={filtered.spells} icon={<Sparkles />} emptyLabel="Nessuna magia corrispondente." />
        </div>
        {character.unresolvedItems > 0 && <p className="build-parser-note">{character.unresolvedItems} oggetti non sono ancora riconosciuti dal dizionario di questa versione.</p>}
      </section>
    </div>
  )
}

export function BuildSimulator() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [save, setSave] = useState<ParsedBuildSave | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [fileName, setFileName] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const selectedCharacter = useMemo(
    () => save?.characters.find((character) => character.slotIndex === selectedSlot) ?? null,
    [save, selectedSlot],
  )

  const readFile = async (file?: File) => {
    if (!file) return
    setError('')
    setStatus('Lettura del salvataggio in corso…')
    setSave(null)
    setSelectedSlot(null)

    try {
      if (!file.name.toLocaleLowerCase().endsWith('.sl2')) throw new Error('Seleziona un file con estensione .sl2.')
      if (file.size > MAX_FILE_SIZE) throw new Error('Il file supera il limite di sicurezza di 50 MB.')
      const parsed = parseBuildSave(await file.arrayBuffer())
      setFileName(file.name)
      setSave(parsed)
      setSelectedSlot(parsed.characters[0].slotIndex)
      setStatus(`${parsed.characters.length} personaggi leggibili trovati in ${file.name}.`)
    } catch (reason) {
      setFileName('')
      setStatus('')
      setError(reason instanceof Error ? reason.message : 'Non è stato possibile leggere il salvataggio.')
    } finally {
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => void readFile(event.target.files?.[0])
  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDragging(false)
    void readFile(event.dataTransfer.files[0])
  }

  return (
    <section className="page build-lab" aria-labelledby="build-title">
      <header className="page-heading build-heading">
        <div>
          <p className="overline">Officina del Senzaluce · versione di lettura</p>
          <h1 id="build-title">Build Lab</h1>
          <p>Carica il salvataggio, scegli un personaggio e consulta ciò che può usare. Il file non viene modificato né inviato altrove.</p>
        </div>
        <div className="build-readonly-badge"><LockKeyhole aria-hidden="true" /><span><strong>Sola lettura</strong><small>Nessuna modifica al save</small></span></div>
      </header>

      <section className="build-loader" aria-labelledby="save-loader-title">
        <div className="build-loader-copy">
          <p className="overline">Passo 1</p>
          <h2 id="save-loader-title">Apri ER0000.sl2</h2>
          <p>Di solito si trova in <code>AppData\Roaming\EldenRing\&lt;Steam ID&gt;</code>.</p>
          <p className="build-privacy"><LockKeyhole aria-hidden="true" /> Elaborazione locale: i dati restano in questo browser e spariscono ricaricando la pagina.</p>
        </div>
        <label
          className={`build-dropzone${isDragging ? ' is-dragging' : ''}`}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <FileUp aria-hidden="true" />
          <strong>{fileName || 'Scegli o trascina il file .sl2'}</strong>
          <span>{fileName ? 'Carica un salvataggio diverso' : 'Massimo 50 MB · versione PC'}</span>
          <input ref={inputRef} type="file" accept=".sl2,application/octet-stream" onChange={handleInput} />
        </label>
      </section>

      <div className={`build-status${error ? ' is-error' : ''}`} role={error ? 'alert' : 'status'} aria-live="polite">
        {error || status}
      </div>

      {save && (
        <section className="build-character-picker" aria-labelledby="character-picker-title">
          <div>
            <p className="overline">Passo 2</p>
            <h2 id="character-picker-title">Scegli il personaggio</h2>
          </div>
          <div className="build-character-list">
            {save.characters.map((character) => (
              <button
                type="button"
                key={character.slotIndex}
                className={selectedSlot === character.slotIndex ? 'is-selected' : undefined}
                aria-pressed={selectedSlot === character.slotIndex}
                onClick={() => setSelectedSlot(character.slotIndex)}
              >
                <span>Slot {character.slotIndex + 1}</span>
                <strong>{character.name}</strong>
                <small>Livello {character.level}</small>
                {selectedSlot === character.slotIndex && <Check aria-hidden="true" />}
              </button>
            ))}
          </div>
          <button className="build-reload" type="button" onClick={() => inputRef.current?.click()}><RefreshCcw aria-hidden="true" /> Cambia file</button>
        </section>
      )}

      {selectedCharacter && <CharacterDashboard key={selectedCharacter.slotIndex} character={selectedCharacter} />}
    </section>
  )
}
