import { useEffect, useState } from 'react'
import { ImageOff } from 'lucide-react'
import type { LoreConcept } from '../types'
import { isSafeContentUrl } from '../lib/urls'

interface ConceptImageProps {
  concept: LoreConcept
  large?: boolean
}

export function ConceptImage({ concept, large = false }: ConceptImageProps) {
  const [failed, setFailed] = useState(false)
  const canRender = isSafeContentUrl(concept.imageUrl) && !failed

  useEffect(() => setFailed(false), [concept.imageUrl])

  if (canRender) {
    return (
      <img
        className={`concept-image${large ? ' concept-image--large' : ''}`}
        src={concept.imageUrl}
        alt={concept.imageAlt || `Immagine collegata a ${concept.name}`}
        width={large ? 960 : 360}
        height={large ? 540 : 220}
        loading={large ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <div
      className={`concept-image concept-image--placeholder${large ? ' concept-image--large' : ''}`}
      role="img"
      aria-label={`Nessuna immagine ancora collegata a ${concept.name}`}
    >
      <ImageOff aria-hidden="true" />
      <span>Immagine da collegare</span>
    </div>
  )
}
