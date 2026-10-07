import {
  AlertTriangle,
  Check,
  CircleCheckBig,
  CircleGauge,
  FileUp,
  Gem,
  Info,
  LockKeyhole,
  Move,
  PersonStanding,
  RefreshCcw,
  Search,
  Scale,
  Shield,
  Sparkles,
  Swords,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from 'react'
import {
  parseBuildSave,
  type ArmorSlot,
  type BuildCharacter,
  type BuildItem,
  type CharacterStats,
  type ParsedBuildSave,
} from '../lib/elden-save-reader'
import {
  getEquipLoad,
  getRequirementGaps,
  getScalingFit,
  offensiveStatLabels,
  type EquipLoadClass,
} from '../lib/build-analysis'
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

const armorSlots: Array<{ label: string; type: ArmorSlot }> = [
  { label: 'Testa', type: 'head' },
  { label: 'Torso', type: 'chest' },
  { label: 'Braccia', type: 'arms' },
  { label: 'Gambe', type: 'legs' },
]

const runeIconBaseUrl = 'https://raw.githubusercontent.com/oisis/EldenRing-SaveForge/ee1042d7a5bd933f91e6f8a0162e0e0237a1c4c5/frontend/public/items/key_items/'

interface GreatRuneInfo {
  name: string
  iconUrl: string
  effect: string
  description: string
}

const greatRuneCatalog: GreatRuneInfo[] = [
  {
    name: 'Runa maggiore di Godrick',
    iconUrl: `${runeIconBaseUrl}godricks_great_rune.png`,
    effect: 'Aumenta tutti gli attributi.',
    description: 'È l’anello di ancoraggio che occupa il centro dell’Anello ancestrale. La sua storia riconduce a Godfrey, primo Lord ancestrale, e alla stirpe aurea nata dalla sua discendenza.',
  },
  {
    name: 'Runa maggiore di Radahn',
    iconUrl: `${runeIconBaseUrl}radahns_great_rune.png`,
    effect: 'Aumenta PV, PA e stamina massimi.',
    description: 'Radahn nacque da Rennala e Radagon e divenne semidio dopo l’unione di Radagon con la regina Marika. La runa arde ancora, opponendosi all’avanzata della marcescenza scarlatta.',
  },
  {
    name: 'Runa maggiore di Morgott',
    iconUrl: `${runeIconBaseUrl}morgotts_great_rune.png`,
    effect: 'Aumenta notevolmente i PV massimi.',
    description: 'L’anello che ne costituisce la base testimonia insieme la nascita del Re Presagio nella stirpe aurea e il suo ruolo di autentico signore di Leyndell.',
  },
  {
    name: 'Runa maggiore di Rykard',
    iconUrl: `${runeIconBaseUrl}rykards_great_rune.png`,
    effect: 'Ripristina PV quando si sconfiggono i nemici.',
    description: 'Rykard era uno dei figli di Rennala e Radagon. Scelse però di offrirsi al serpente blasfemo, consegnandogli insieme il proprio corpo e questa Runa Maggiore.',
  },
  {
    name: 'Runa maggiore di Mohg',
    iconUrl: `${runeIconBaseUrl}mohgs_great_rune.png`,
    effect: 'Conferisce ai fantasmi evocati la benedizione del sangue.',
    description: 'Mohg e Morgott sono gemelli, e le loro rune si somigliano per natura. Quella di Mohg è però intrisa di sangue maledetto e del legame con l’abisso in cui nacque.',
  },
  {
    name: 'Runa maggiore di Malenia',
    iconUrl: `${runeIconBaseUrl}malenias_great_rune.png`,
    effect: 'Permette di recuperare parte dei PV attaccando subito dopo aver subito danni, ma riduce la cura delle ampolle cremisi.',
    description: 'La runa è ormai segnata dalla marcescenza, ma conserva lo spirito di resistenza di Malenia, figlia di Marika e Radagon. Avrebbe dovuto essere la più sacra di tutte.',
  },
]

function getGreatRuneInfo(name: string): GreatRuneInfo | null {
  return greatRuneCatalog.find((rune) => rune.name === name) ?? null
}

type DraftSlotKind = 'rightHand' | 'leftHand' | 'armor' | 'talisman' | 'spell'

interface DraftTarget {
  kind: DraftSlotKind
  index: number
  label: string
  armorSlot?: ArmorSlot
}

interface DraftLoadout {
  rightHand: Array<BuildItem | null>
  leftHand: Array<BuildItem | null>
  armor: Array<BuildItem | null>
  talismans: Array<BuildItem | null>
  spells: Array<BuildItem | null>
  greatRune: string | null
}

const buildSessionCache: {
  save: ParsedBuildSave | null
  selectedSlot: number | null
  fileName: string
  status: string
  drafts: Map<number, DraftLoadout>
} = {
  save: null,
  selectedSlot: null,
  fileName: '',
  status: '',
  drafts: new Map(),
}

function itemKey(item: BuildItem): string {
  return `${item.category}-${item.id}-${item.upgradeLevel ?? 0}`
}

function canEquip(item: BuildItem, target: DraftTarget): boolean {
  if ((target.kind === 'rightHand' || target.kind === 'leftHand')) return item.category === 'weapon'
  if (target.kind === 'talisman') return item.category === 'talisman'
  if (target.kind === 'spell') return item.category === 'spell'
  return item.category === 'armor' && item.armorSlot === target.armorSlot
}

function getDraftMemorySlots(character: BuildCharacter, talismans: Array<BuildItem | null>): number {
  const permanentSlots = Math.min(10, 2 + Math.min(8, character.memoryStones))
  return permanentSlots + (talismans.some((item) => item?.id === 1140) ? 2 : 0)
}

function createSpellSlots(spells: BuildItem[], total: number): Array<BuildItem | null> {
  return Array.from({ length: total }, (_, index) => spells[index] ?? null)
}

function createDraftLoadout(character: BuildCharacter): DraftLoadout {
  return {
    rightHand: [...character.equipped.rightHand],
    leftHand: [...character.equipped.leftHand],
    armor: [...character.equipped.armor],
    talismans: character.equipped.talismans.slice(0, character.talismanSlots),
    spells: createSpellSlots(character.equipped.spells, character.memorySlots),
    greatRune: character.equipped.greatRune,
  }
}

function cloneDraftLoadout(draft: DraftLoadout): DraftLoadout {
  return {
    rightHand: [...draft.rightHand],
    leftHand: [...draft.leftHand],
    armor: [...draft.armor],
    talismans: [...draft.talismans],
    spells: [...draft.spells],
    greatRune: draft.greatRune,
  }
}

function isSameTarget(first: DraftTarget | null, second: DraftTarget): boolean {
  return Boolean(first && first.kind === second.kind && first.index === second.index)
}

function getDraftItem(draft: DraftLoadout, target: DraftTarget): BuildItem | null {
  if (target.kind === 'rightHand') return draft.rightHand[target.index]
  if (target.kind === 'leftHand') return draft.leftHand[target.index]
  if (target.kind === 'armor') return draft.armor[target.index]
  if (target.kind === 'talisman') return draft.talismans[target.index]
  return draft.spells[target.index]
}

function setDraftItem(draft: DraftLoadout, target: DraftTarget, item: BuildItem | null) {
  if (target.kind === 'rightHand') draft.rightHand[target.index] = item
  else if (target.kind === 'leftHand') draft.leftHand[target.index] = item
  else if (target.kind === 'armor') draft.armor[target.index] = item
  else if (target.kind === 'talisman') draft.talismans[target.index] = item
  else draft.spells[target.index] = item
}

function syncDraftMemorySlots(character: BuildCharacter, draft: DraftLoadout): number {
  const total = getDraftMemorySlots(character, draft.talismans)
  const removed = draft.spells.slice(total).filter(Boolean).length
  draft.spells = Array.from({ length: total }, (_, index) => draft.spells[index] ?? null)
  return removed
}

function displayItem(item: BuildItem | null): string {
  if (!item) return '—'
  return item.category === 'weapon' && item.upgradeLevel
    ? `${item.name} +${item.upgradeLevel}`
    : item.name
}

function ItemIcon({ item }: { item: BuildItem }) {
  const [failed, setFailed] = useState(false)
  const FallbackIcon = item.category === 'weapon'
    ? Swords
    : item.category === 'armor'
      ? Shield
      : item.category === 'talisman'
        ? Gem
        : Sparkles

  return (
    <span className="build-item-icon" aria-hidden="true">
      {item.iconUrl && !failed
        ? <img src={item.iconUrl} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} />
        : <FallbackIcon />}
    </span>
  )
}

function ItemInfoButton({ item, onInspect }: { item: BuildItem; onInspect: (item: BuildItem) => void }) {
  return (
    <button
      type="button"
      className="build-item-info"
      aria-label={`Apri la descrizione di ${displayItem(item)}`}
      title="Apri descrizione"
      onClick={() => onInspect(item)}
    >
      <Info aria-hidden="true" />
    </button>
  )
}

function itemCategoryLabel(item: BuildItem): string {
  if (item.category === 'weapon') return 'Arma'
  if (item.category === 'armor') return 'Armatura'
  if (item.category === 'talisman') return 'Talismano'
  return item.spellType === 'sorcery' ? 'Stregoneria' : 'Incantesimo'
}

function ItemLoreDialog({
  item,
  description,
  loading,
  onClose,
}: {
  item: BuildItem | null
  description: string | null
  loading: boolean
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const [imageFailed, setImageFailed] = useState(false)
  const FallbackIcon = item?.category === 'weapon'
    ? Swords
    : item?.category === 'armor'
      ? Shield
      : item?.category === 'talisman'
        ? Gem
        : Sparkles

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (item && !dialog.open) dialog.showModal()
    if (!item && dialog.open) dialog.close()
  }, [item])

  useEffect(() => setImageFailed(false), [item?.category, item?.id])

  return (
    <dialog
      ref={dialogRef}
      className="build-item-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClose={onClose}
    >
      {item && (
        <div className="build-item-dialog__content">
          <button type="button" className="build-item-dialog__close" aria-label="Chiudi descrizione" onClick={onClose} autoFocus>
            <X aria-hidden="true" />
          </button>
          <div className="build-item-dialog__art">
            {item.iconUrl && !imageFailed
              ? <img src={item.iconUrl} alt={`Icona di ${item.name}`} decoding="async" onError={() => setImageFailed(true)} />
              : <FallbackIcon aria-hidden="true" />}
          </div>
          <article className="build-item-dialog__copy">
            <p className="overline">{itemCategoryLabel(item)} · Descrizione oggetto</p>
            <h2 id={titleId}>{displayItem(item)}</h2>
            <div id={descriptionId} className="build-item-dialog__description">
              {loading
                ? <p role="status">Caricamento descrizione…</p>
                : <p>{description ?? 'Descrizione non disponibile nei testi di gioco per questo oggetto.'}</p>}
            </div>
          </article>
        </div>
      )}
    </dialog>
  )
}

function GreatRuneDialog({ rune, onClose }: { rune: GreatRuneInfo | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (rune && !dialog.open) dialog.showModal()
    if (!rune && dialog.open) dialog.close()
  }, [rune])

  useEffect(() => setImageFailed(false), [rune?.name])

  return (
    <dialog
      ref={dialogRef}
      className="build-item-dialog build-rune-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClose={onClose}
    >
      {rune && (
        <div className="build-item-dialog__content">
          <button type="button" className="build-item-dialog__close" aria-label="Chiudi descrizione" onClick={onClose} autoFocus>
            <X aria-hidden="true" />
          </button>
          <div className="build-item-dialog__art build-rune-dialog__art">
            {!imageFailed
              ? <img src={rune.iconUrl} alt={`Simbolo di ${rune.name}`} decoding="async" onError={() => setImageFailed(true)} />
              : <Gem aria-hidden="true" />}
          </div>
          <article className="build-item-dialog__copy">
            <p className="overline">Runa Maggiore · Effetto e storia</p>
            <h2 id={titleId}>{rune.name}</h2>
            <div id={descriptionId} className="build-item-dialog__description build-rune-dialog__description">
              <strong>{rune.effect}</strong>
              <p>{rune.description}</p>
            </div>
          </article>
        </div>
      )}
    </dialog>
  )
}

function GreatRuneIcon({ rune }: { rune: GreatRuneInfo }) {
  const [failed, setFailed] = useState(false)
  return failed
    ? <Gem aria-hidden="true" />
    : <img src={rune.iconUrl} alt="" decoding="async" onError={() => setFailed(true)} />
}

interface VisualSlotProps {
  item: BuildItem | null
  target: DraftTarget
  mark: string
  placeholder: ReactNode
  className?: string
  activeItem: BuildItem | null
  selectedTarget: DraftTarget | null
  onEquip: (item: BuildItem, target: DraftTarget) => void
  onSelectItem: (item: BuildItem, target: DraftTarget) => void
  onDragStart: (item: BuildItem, source: DraftTarget) => void
  onDragEnd: () => void
  getDropEffect: (target: DraftTarget) => 'copy' | 'move' | 'none'
  onDropItem: (target: DraftTarget) => void
  onInspect: (item: BuildItem) => void
}

function VisualSlot({
  item,
  target,
  mark,
  placeholder,
  className = '',
  activeItem,
  selectedTarget,
  onEquip,
  onSelectItem,
  onDragStart,
  onDragEnd,
  getDropEffect,
  onDropItem,
  onInspect,
}: VisualSlotProps) {
  const compatibilityClass = activeItem ? (canEquip(activeItem, target) ? ' is-compatible' : ' is-incompatible') : ''
  const isSelected = isSameTarget(selectedTarget, target)
  return (
    <div className={`build-visual-slot-wrap ${className}`.trim()}>
      <button
        type="button"
        className={`build-visual-slot${item ? ' has-item' : ' is-empty'}${compatibilityClass}${isSelected ? ' is-selected' : ''}`}
        data-equip-target={`${target.kind}-${target.index}`}
        draggable={Boolean(item)}
        aria-pressed={item ? isSelected : undefined}
        aria-label={`${target.label}: ${item ? displayItem(item) : 'vuoto'}${activeItem && !isSelected ? `. Inserisci ${displayItem(activeItem)}` : item ? '. Seleziona per spostare o rimuovere' : ''}`}
        title={item ? displayItem(item) : `${target.label}: vuoto`}
        onClick={() => {
          if (item && isSelected) onSelectItem(item, target)
          else if (activeItem) onEquip(activeItem, target)
          else if (item) onSelectItem(item, target)
        }}
        onDragStart={(event) => {
          if (!item) return
          event.dataTransfer.effectAllowed = 'move'
          event.dataTransfer.setData('text/plain', itemKey(item))
          onDragStart(item, target)
        }}
        onDragEnd={onDragEnd}
        onDragOver={(event) => {
          event.preventDefault()
          event.dataTransfer.dropEffect = getDropEffect(target)
        }}
        onDrop={(event) => {
          event.preventDefault()
          onDropItem(target)
        }}
      >
        <span className="build-visual-slot__mark" aria-hidden="true">{mark}</span>
        {item ? <ItemIcon item={item} /> : <span className="build-visual-slot__placeholder" aria-hidden="true">{placeholder}</span>}
        <span className="sr-only">{item ? displayItem(item) : 'Slot vuoto'}</span>
      </button>
      {item && <ItemInfoButton item={item} onInspect={onInspect} />}
    </div>
  )
}

type InteractiveSlotProps = Pick<VisualSlotProps, 'activeItem' | 'selectedTarget' | 'onEquip' | 'onSelectItem' | 'onDragStart' | 'onDragEnd' | 'getDropEffect' | 'onDropItem' | 'onInspect'>

function EquipmentPaperDoll({ draft, ...slotProps }: { draft: DraftLoadout } & InteractiveSlotProps) {
  return (
    <div className="build-paper-doll" role="group" aria-label="Schema dell’equipaggiamento di prova">
      <div className="build-paper-doll__stage">
        <div className="build-paper-doll__silhouette" aria-hidden="true">
          <PersonStanding />
        </div>
        {draft.leftHand.map((item, index) => (
          <VisualSlot
            key={`left-hand-${index}`}
            item={item}
            target={{ kind: 'leftHand', index, label: `Mano sinistra, slot ${index + 1}` }}
            mark={`SX${index + 1}`}
            placeholder={<Swords />}
            className={`build-paper-slot--left-${index + 1}`}
            {...slotProps}
          />
        ))}
        {draft.rightHand.map((item, index) => (
          <VisualSlot
            key={`right-hand-${index}`}
            item={item}
            target={{ kind: 'rightHand', index, label: `Mano destra, slot ${index + 1}` }}
            mark={`DX${index + 1}`}
            placeholder={<Swords />}
            className={`build-paper-slot--right-${index + 1}`}
            {...slotProps}
          />
        ))}
        {armorSlots.map((slot, index) => (
          <VisualSlot
            key={slot.type}
            item={draft.armor[index]}
            target={{ kind: 'armor', index, label: `Armatura, ${slot.label}`, armorSlot: slot.type }}
            mark={slot.label}
            placeholder={<Shield />}
            className={`build-paper-slot--${slot.type}`}
            {...slotProps}
          />
        ))}
      </div>
      <div className="build-paper-doll__talismans">
        <span>Talismani</span>
        <div>
          {draft.talismans.map((item, index) => (
            <VisualSlot
              key={`talisman-${index}`}
              item={item}
              target={{ kind: 'talisman', index, label: `Talismano, slot ${index + 1}` }}
              mark={`T${index + 1}`}
              placeholder={<Gem />}
              {...slotProps}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function SpellSlotGrid({ items, ...slotProps }: { items: Array<BuildItem | null> } & InteractiveSlotProps) {
  return (
    <div className="build-memory-slots" role="group" aria-label={`${items.filter(Boolean).length} magie armonizzate su ${items.length} slot`}>
      {items.map((item, index) => (
        <VisualSlot
          key={`memory-slot-${index + 1}`}
          item={item}
          target={{ kind: 'spell', index, label: `Slot memoria ${index + 1}` }}
          mark={String(index + 1).padStart(2, '0')}
          placeholder={<Sparkles />}
          {...slotProps}
        />
      ))}
    </div>
  )
}

const equipLoadLabels: Record<EquipLoadClass, string> = {
  light: 'Carico leggero',
  medium: 'Carico medio',
  heavy: 'Carico pesante',
  overloaded: 'Sovraccarico',
}

function ItemAnalysisBadges({ item, stats }: { item: BuildItem; stats: CharacterStats }) {
  const gaps = getRequirementGaps(item, stats)
  const fit = getScalingFit(item, stats)
  if (!gaps.length && !fit) return null

  return (
    <span className="build-item-analysis">
      {gaps.length > 0 && (
        <span className="build-analysis-badge" data-tone="invalid" title={gaps.map((gap) => `${offensiveStatLabels[gap.stat]} ${gap.current}/${gap.required}`).join(' · ')}>
          <AlertTriangle aria-hidden="true" /> Requisiti
        </span>
      )}
      {fit && (
        <span className="build-analysis-badge" data-tone={fit.tone} title="Stima basata sugli attributi attuali e sui coefficienti di scaling">
          <TrendingUp aria-hidden="true" /> {fit.label}
        </span>
      )}
    </span>
  )
}

function BuildAnalysisPanel({ character, draft }: { character: BuildCharacter; draft: DraftLoadout }) {
  const equipment = [...draft.rightHand, ...draft.leftHand, ...draft.armor, ...draft.talismans]
  const checkedItems = [...draft.rightHand, ...draft.leftHand, ...draft.spells]
    .filter((item): item is BuildItem => Boolean(item?.requirements && Object.keys(item.requirements).length))
  const requirementIssues = checkedItems.flatMap((item) => {
    const gaps = getRequirementGaps(item, character.stats)
    return gaps.length ? [{ item, gaps }] : []
  })
  const load = getEquipLoad(equipment, character.stats.endurance)
  const weaponFits = [...draft.rightHand, ...draft.leftHand]
    .filter((item): item is BuildItem => Boolean(item))
    .map((item) => ({ item, fit: getScalingFit(item, character.stats) }))
    .filter((entry): entry is { item: BuildItem; fit: NonNullable<ReturnType<typeof getScalingFit>> } => Boolean(entry.fit))

  return (
    <section className="build-panel build-analysis" aria-labelledby="build-analysis-title">
      <div className="build-panel-heading">
        <CircleGauge aria-hidden="true" />
        <div><p className="overline">Controllo in tempo reale</p><h2 id="build-analysis-title">Analisi della bozza</h2></div>
      </div>
      <div className="build-analysis-grid">
        <article className="build-analysis-card" data-state={requirementIssues.length ? 'warning' : 'success'}>
          <div className="build-analysis-card__heading">
            {requirementIssues.length ? <AlertTriangle aria-hidden="true" /> : <CircleCheckBig aria-hidden="true" />}
            <div><span>Requisiti base</span><strong>{requirementIssues.length ? `${requirementIssues.length} incompatibilità` : 'Tutto compatibile'}</strong></div>
          </div>
          {requirementIssues.length ? (
            <ul>
              {requirementIssues.slice(0, 4).map(({ item, gaps }, index) => (
                <li key={`${itemKey(item)}-${index}`}><strong>{displayItem(item)}</strong><span>{gaps.map((gap) => `${offensiveStatLabels[gap.stat]} ${gap.current}/${gap.required}`).join(' · ')}</span></li>
              ))}
            </ul>
          ) : <p>{checkedItems.length ? `${checkedItems.length} ${checkedItems.length === 1 ? 'elemento controllato' : 'elementi controllati'}.` : 'Inserisci un’arma o una magia per avviare il controllo.'}</p>}
          <small>La Forza è verificata a una mano; l’eventuale bonus a due mani non è applicato.</small>
        </article>

        <article className="build-analysis-card" data-state={load.loadClass === 'overloaded' ? 'warning' : 'neutral'}>
          <div className="build-analysis-card__heading">
            <Scale aria-hidden="true" />
            <div><span>Peso equipaggiato</span><strong>{load.current.toFixed(1)} / {load.maximum.toFixed(1)}</strong></div>
          </div>
          <div className="build-load-meter" role="meter" aria-label="Percentuale del carico equipaggiamento" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100, Math.round(load.percentage))}>
            <span data-load={load.loadClass} style={{ width: `${Math.min(100, load.percentage)}%` }} />
          </div>
          <p><strong>{equipLoadLabels[load.loadClass]}</strong> · {load.percentage.toFixed(1)}%</p>
          <small>{load.enduranceBonus || load.equipLoadRate
            ? `Bonus equipaggiati inclusi${load.enduranceBonus ? `: Vigore +${load.enduranceBonus}` : ''}${load.equipLoadRate ? ` · carico +${Math.round(load.equipLoadRate * 100)}%` : ''}.`
            : 'Capacità calcolata dal Vigore attuale.'}</small>
        </article>

        <article className="build-analysis-card" data-state="neutral">
          <div className="build-analysis-card__heading">
            <TrendingUp aria-hidden="true" />
            <div><span>Affinità statistiche</span><strong>{weaponFits.length ? `${weaponFits.length} armi valutate` : 'In attesa'}</strong></div>
          </div>
          {weaponFits.length ? (
            <ul className="build-fit-list">
              {weaponFits.map(({ item, fit }, index) => (
                <li key={`${itemKey(item)}-${index}`}><strong>{displayItem(item)}</strong><span className="build-analysis-badge" data-tone={fit.tone}>{fit.label}</span></li>
              ))}
            </ul>
          ) : <p>Inserisci un’arma nella bozza per confrontarne lo scaling.</p>}
          <small>È una stima di consonanza, non il calcolo del danno finale.</small>
        </article>
      </div>
    </section>
  )
}

function InventorySection({
  title,
  items,
  icon,
  emptyLabel,
  selectedItem,
  equippedKeys,
  onSelect,
  onDragStart,
  onDragEnd,
  onInspect,
  characterStats,
}: {
  title: string
  items: BuildItem[]
  icon: ReactNode
  emptyLabel: string
  selectedItem: BuildItem | null
  equippedKeys: Set<string>
  onSelect: (item: BuildItem) => void
  onDragStart: (item: BuildItem) => void
  onDragEnd: () => void
  onInspect: (item: BuildItem) => void
  characterStats: CharacterStats
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
              <button
                type="button"
                className={`build-item-pick${selectedItem && itemKey(selectedItem) === itemKey(item) ? ' is-selected' : ''}`}
                draggable
                aria-pressed={Boolean(selectedItem && itemKey(selectedItem) === itemKey(item))}
                aria-label={`Seleziona ${displayItem(item)} per equipaggiarlo`}
                onClick={() => onSelect(item)}
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = 'copy'
                  event.dataTransfer.setData('text/plain', itemKey(item))
                  onDragStart(item)
                }}
                onDragEnd={onDragEnd}
              >
                <ItemIcon item={item} />
                <span>
                  {displayItem(item)}
                  {item.spellType && <small>{item.spellType === 'sorcery' ? 'Stregoneria' : 'Incantesimo'}</small>}
                </span>
              </button>
              <span className="build-item-meta">
                {equippedKeys.has(itemKey(item)) && <em><Check aria-hidden="true" /> Equipaggiato</em>}
                {item.quantity > 1 && <small>×{item.quantity}</small>}
                <ItemAnalysisBadges item={item} stats={characterStats} />
                <ItemInfoButton item={item} onInspect={onInspect} />
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
  const draggedItemRef = useRef<BuildItem | null>(null)
  const draggedSourceRef = useRef<DraftTarget | null>(null)
  const [query, setQuery] = useState('')
  const [inspectedItem, setInspectedItem] = useState<BuildItem | null>(null)
  const [inspectedRune, setInspectedRune] = useState<GreatRuneInfo | null>(null)
  const [description, setDescription] = useState<string | null>(null)
  const [descriptionLoading, setDescriptionLoading] = useState(false)
  const [draft, setDraft] = useState<DraftLoadout>(() => buildSessionCache.drafts.get(character.slotIndex) ?? createDraftLoadout(character))
  const [selectedItem, setSelectedItem] = useState<BuildItem | null>(null)
  const [selectedTarget, setSelectedTarget] = useState<DraftTarget | null>(null)
  const [draggedItem, setDraggedItem] = useState<BuildItem | null>(null)
  const [draftStatus, setDraftStatus] = useState('')
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
  const activeItem = draggedItem ?? selectedItem
  const draftMemorySlots = getDraftMemorySlots(character, draft.talismans)
  const draftMoonOfNokstellaEquipped = draft.talismans.some((item) => item?.id === 1140)
  const selectedDraftItem = selectedTarget ? getDraftItem(draft, selectedTarget) : null
  const greatRuneOptions = [...new Set([
    ...character.equipped.availableGreatRunes,
    ...(character.equipped.greatRune ? [character.equipped.greatRune] : []),
  ])]
  const equippedKeys = useMemo(() => new Set(
    [...draft.rightHand, ...draft.leftHand, ...draft.armor, ...draft.talismans, ...draft.spells]
      .filter((item): item is BuildItem => item !== null)
      .map(itemKey),
  ), [draft])

  const clearInteraction = () => {
    setSelectedItem(null)
    setSelectedTarget(null)
    setDraggedItem(null)
    draggedItemRef.current = null
    draggedSourceRef.current = null
  }

  const placeItem = (item: BuildItem, target: DraftTarget, source: DraftTarget | null) => {
    if (!canEquip(item, target)) {
      setDraftStatus(`${displayItem(item)} non può essere inserito in ${target.label}.`)
      return
    }

    if (source && isSameTarget(source, target)) {
      clearInteraction()
      setDraftStatus('Selezione annullata.')
      return
    }

    const equippedItem = { ...item, quantity: 1, equipped: true }
    const next = cloneDraftLoadout(draft)
    if (source) setDraftItem(next, source, null)
    setDraftItem(next, target, equippedItem)
    const removedSpellCount = syncDraftMemorySlots(character, next)
    setDraft(next)
    clearInteraction()
    setDraftStatus(`${displayItem(item)} ${source ? 'spostato' : 'inserito'} in ${target.label}.${removedSpellCount ? ` ${removedSpellCount} ${removedSpellCount === 1 ? 'magia rimossa' : 'magie rimosse'} perché gli slot memoria sono diminuiti.` : ''}`)
  }

  const equipItem = (item: BuildItem, target: DraftTarget) => {
    const source = selectedTarget && selectedItem && itemKey(selectedItem) === itemKey(item) ? selectedTarget : null
    placeItem(item, target, source)
  }

  const beginDragging = (item: BuildItem, source: DraftTarget | null = null) => {
    draggedItemRef.current = item
    draggedSourceRef.current = source
    setDraggedItem(item)
  }

  const endDragging = () => {
    draggedItemRef.current = null
    draggedSourceRef.current = null
    setDraggedItem(null)
  }

  const dropItem = (target: DraftTarget) => {
    const item = draggedItemRef.current
    if (item) placeItem(item, target, draggedSourceRef.current)
  }

  const canDropItem = (target: DraftTarget) => {
    const item = draggedItemRef.current
    return Boolean(item && canEquip(item, target))
  }

  const getDropEffect = (target: DraftTarget): 'copy' | 'move' | 'none' => {
    if (!canDropItem(target)) return 'none'
    return draggedSourceRef.current ? 'move' : 'copy'
  }

  const selectItem = (item: BuildItem) => {
    const isAlreadySelected = !selectedTarget && selectedItem && itemKey(selectedItem) === itemKey(item)
    setSelectedItem(isAlreadySelected ? null : item)
    setSelectedTarget(null)
    setDraftStatus(isAlreadySelected ? 'Selezione annullata.' : `${displayItem(item)} selezionato: scegli uno slot compatibile.`)
  }

  const selectDraftItem = (item: BuildItem, target: DraftTarget) => {
    const isAlreadySelected = isSameTarget(selectedTarget, target)
    setSelectedItem(isAlreadySelected ? null : item)
    setSelectedTarget(isAlreadySelected ? null : target)
    setDraftStatus(isAlreadySelected ? 'Selezione annullata.' : `${displayItem(item)} selezionato: scegli uno slot compatibile oppure rimuovilo.`)
  }

  const removeSelectedItem = () => {
    if (!selectedTarget) return
    const item = getDraftItem(draft, selectedTarget)
    if (!item) return
    const next = cloneDraftLoadout(draft)
    setDraftItem(next, selectedTarget, null)
    const removedSpellCount = syncDraftMemorySlots(character, next)
    setDraft(next)
    clearInteraction()
    setDraftStatus(`${displayItem(item)} rimosso dalla build.${removedSpellCount ? ` ${removedSpellCount} ${removedSpellCount === 1 ? 'magia rimossa' : 'magie rimosse'} perché gli slot memoria sono diminuiti.` : ''}`)
  }

  const equipGreatRune = (greatRune: string | null) => {
    setDraft((current) => ({ ...current, greatRune }))
    setDraftStatus(greatRune ? `${greatRune} equipaggiata nella bozza.` : 'Runa Maggiore rimossa dalla bozza.')
  }

  const resetDraft = () => {
    setDraft(createDraftLoadout(character))
    clearInteraction()
    setDraftStatus('Equipaggiamento ripristinato dai dati del salvataggio.')
  }

  useEffect(() => {
    buildSessionCache.drafts.set(character.slotIndex, draft)
  }, [character.slotIndex, draft])

  useEffect(() => {
    if (!inspectedItem) {
      setDescription(null)
      setDescriptionLoading(false)
      return
    }
    let cancelled = false
    setDescription(null)
    setDescriptionLoading(true)
    void import('../lib/elden-item-descriptions').then(({ getItemDescription }) => {
      if (!cancelled) {
        setDescription(getItemDescription(inspectedItem))
        setDescriptionLoading(false)
      }
    }).catch(() => {
      if (!cancelled) {
        setDescription(null)
        setDescriptionLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [inspectedItem])

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

      <BuildAnalysisPanel character={character} draft={draft} />

      <div className="build-two-column">
        <section className="build-panel" aria-labelledby="equipment-title">
          <div className="build-equipment-header">
            <div className="build-panel-heading">
              <Shield aria-hidden="true" />
              <div><p className="overline">Bozza locale</p><h2 id="equipment-title">Equipaggiamento di prova</h2></div>
            </div>
            <button type="button" className="build-draft-reset" onClick={resetDraft}><RefreshCcw aria-hidden="true" /> Ripristina save</button>
          </div>
          <p className="build-draft-help">Trascina o seleziona gli oggetti per inserirli e spostarli. Seleziona uno slot occupato per poterlo svuotare. La bozza non modifica il salvataggio.</p>
          <p className={`build-draft-status${draftStatus.includes('non può') ? ' is-error' : ''}`} role="status" aria-live="polite">{draftStatus}</p>
          {selectedTarget && selectedDraftItem && (
            <div className="build-selection-actions">
              <span><Move aria-hidden="true" /> {displayItem(selectedDraftItem)}</span>
              <button type="button" onClick={removeSelectedItem}><Trash2 aria-hidden="true" /> Rimuovi dalla build</button>
            </div>
          )}
          <EquipmentPaperDoll draft={draft} activeItem={activeItem} selectedTarget={selectedTarget} onEquip={equipItem} onSelectItem={selectDraftItem} onDragStart={beginDragging} onDragEnd={endDragging} getDropEffect={getDropEffect} onDropItem={dropItem} onInspect={setInspectedItem} />
        </section>

        <div className="build-side-panels">
          <section className="build-panel build-memory" aria-labelledby="memory-title">
            <div className="build-panel-heading">
              <Sparkles aria-hidden="true" />
              <div><p className="overline">Armonizzazione</p><h2 id="memory-title">Slot memoria</h2></div>
            </div>
            <div className="build-memory-count"><strong>{draftMemorySlots}</strong><span>slot nella bozza</span></div>
            <p>{character.memoryStones} Pietre della Memoria rilevate · trascina qui stregonerie e incantesimi, oppure selezionali dall’inventario.</p>
            {draftMoonOfNokstellaEquipped && <span className="build-equipped-pill"><Check aria-hidden="true" /> Luna di Nokstella equipaggiata (+2)</span>}
            <SpellSlotGrid items={draft.spells} activeItem={activeItem} selectedTarget={selectedTarget} onEquip={equipItem} onSelectItem={selectDraftItem} onDragStart={beginDragging} onDragEnd={endDragging} getDropEffect={getDropEffect} onDropItem={dropItem} onInspect={setInspectedItem} />
          </section>

          <section className="build-panel build-great-rune" aria-labelledby="great-rune-title">
            <div className="build-panel-heading">
              <Gem aria-hidden="true" />
              <div><p className="overline">Potere maggiore</p><h2 id="great-rune-title">Runa Maggiore</h2></div>
            </div>
            <strong>{draft.greatRune ?? 'Nessuna Runa Maggiore equipaggiata'}</strong>
            {draft.greatRune && (
              <span>{draft.greatRune === character.equipped.greatRune
                ? (character.equipped.greatRuneActive ? 'Potere attivo tramite Arco runico' : 'Equipaggiata, ma il potere non è attivo')
                : 'Equipaggiata nella bozza, potere non attivo'}</span>
            )}
            <p className="build-great-rune__available">
              {character.equipped.availableGreatRunes.length
                ? `Rune attivate disponibili: ${character.equipped.availableGreatRunes.join(', ')}.`
                : 'Nessuna Runa Maggiore attivata rilevata nell’inventario.'}
            </p>
            <div className="build-great-rune__options" role="group" aria-label="Scegli la Runa Maggiore della build">
              <div className="build-rune-choice-wrap">
                <button type="button" className={`build-rune-choice${!draft.greatRune ? ' is-selected' : ''}`} aria-pressed={!draft.greatRune} aria-label="Nessuna Runa Maggiore" title="Nessuna" onClick={() => equipGreatRune(null)}>
                  <X aria-hidden="true" />
                  <span>Nessuna</span>
                </button>
              </div>
              {greatRuneOptions.map((greatRune) => {
                const rune = getGreatRuneInfo(greatRune)
                return (
                  <div className="build-rune-choice-wrap" key={greatRune}>
                    <button
                      type="button"
                      className={`build-rune-choice${draft.greatRune === greatRune ? ' is-selected' : ''}`}
                      aria-pressed={draft.greatRune === greatRune}
                      aria-label={`Equipaggia ${greatRune}`}
                      title={greatRune}
                      onClick={() => equipGreatRune(greatRune)}
                    >
                      {rune ? <GreatRuneIcon rune={rune} /> : <Gem aria-hidden="true" />}
                      <span>{greatRune.replace('Runa maggiore di ', '')}</span>
                    </button>
                    {rune && (
                      <button type="button" className="build-item-info build-rune-info" aria-label={`Apri la descrizione di ${greatRune}`} title="Apri descrizione" onClick={() => setInspectedRune(rune)}>
                        <Info aria-hidden="true" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
            <small className="build-great-rune__note">Scelta valida solo per questa bozza.</small>
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
          <InventorySection title="Armi" items={filtered.weapons} icon={<Swords />} emptyLabel="Nessuna arma corrispondente." selectedItem={selectedItem} equippedKeys={equippedKeys} onSelect={selectItem} onDragStart={beginDragging} onDragEnd={endDragging} onInspect={setInspectedItem} characterStats={character.stats} />
          <InventorySection title="Armature" items={filtered.armor} icon={<Shield />} emptyLabel="Nessuna armatura corrispondente." selectedItem={selectedItem} equippedKeys={equippedKeys} onSelect={selectItem} onDragStart={beginDragging} onDragEnd={endDragging} onInspect={setInspectedItem} characterStats={character.stats} />
          <InventorySection title="Talismani" items={filtered.talismans} icon={<Gem />} emptyLabel="Nessun talismano corrispondente." selectedItem={selectedItem} equippedKeys={equippedKeys} onSelect={selectItem} onDragStart={beginDragging} onDragEnd={endDragging} onInspect={setInspectedItem} characterStats={character.stats} />
          <InventorySection title="Magie equipaggiabili" items={filtered.spells} icon={<Sparkles />} emptyLabel="Nessuna magia corrispondente." selectedItem={selectedItem} equippedKeys={equippedKeys} onSelect={selectItem} onDragStart={beginDragging} onDragEnd={endDragging} onInspect={setInspectedItem} characterStats={character.stats} />
        </div>
        {character.unresolvedItems > 0 && <p className="build-parser-note">{character.unresolvedItems} oggetti non sono ancora riconosciuti dal dizionario di questa versione.</p>}
      </section>
      <ItemLoreDialog
        item={inspectedItem}
        description={description}
        loading={descriptionLoading}
        onClose={() => setInspectedItem(null)}
      />
      <GreatRuneDialog rune={inspectedRune} onClose={() => setInspectedRune(null)} />
    </div>
  )
}

export function BuildSimulator() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [save, setSave] = useState<ParsedBuildSave | null>(buildSessionCache.save)
  const [selectedSlot, setSelectedSlot] = useState<number | null>(buildSessionCache.selectedSlot)
  const [fileName, setFileName] = useState(buildSessionCache.fileName)
  const [status, setStatus] = useState(buildSessionCache.status)
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
    buildSessionCache.save = null
    buildSessionCache.selectedSlot = null
    buildSessionCache.fileName = ''
    buildSessionCache.status = ''
    buildSessionCache.drafts.clear()

    try {
      if (!file.name.toLocaleLowerCase().endsWith('.sl2')) throw new Error('Seleziona un file con estensione .sl2.')
      if (file.size > MAX_FILE_SIZE) throw new Error('Il file supera il limite di sicurezza di 50 MB.')
      const parsed = parseBuildSave(await file.arrayBuffer())
      setFileName(file.name)
      setSave(parsed)
      setSelectedSlot(parsed.characters[0].slotIndex)
      const nextStatus = `${parsed.characters.length} personaggi leggibili trovati in ${file.name}.`
      setStatus(nextStatus)
      buildSessionCache.save = parsed
      buildSessionCache.selectedSlot = parsed.characters[0].slotIndex
      buildSessionCache.fileName = file.name
      buildSessionCache.status = nextStatus
    } catch (reason) {
      setFileName('')
      setStatus('')
      buildSessionCache.save = null
      buildSessionCache.selectedSlot = null
      buildSessionCache.fileName = ''
      buildSessionCache.status = ''
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
                onClick={() => {
                  setSelectedSlot(character.slotIndex)
                  buildSessionCache.selectedSlot = character.slotIndex
                }}
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
