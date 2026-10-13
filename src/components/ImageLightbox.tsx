import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import { isSafeContentUrl } from '../lib/urls'
import type { QuestImage } from '../types'

interface ImageLightboxProps {
  image: QuestImage
  onClose: () => void
  className?: string
}

export function ImageLightbox({ image, onClose, className = '' }: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const captionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !isSafeContentUrl(image.imageUrl)) return

    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
      if (dialog.open) dialog.close()
    }
  }, [image.imageUrl])

  if (!isSafeContentUrl(image.imageUrl)) return null

  const caption = image.caption || image.imageAlt

  return (
    <dialog
      ref={dialogRef}
      className={`image-lightbox${className ? ` ${className}` : ''}`}
      aria-labelledby={captionId}
      onClose={(event) => {
        // React StrictMode can queue the cleanup close while the dialog is reopening.
        if (!event.currentTarget.open) onClose()
      }}
      onClick={(event) => event.currentTarget.close()}
    >
      <button
        type="button"
        className="image-lightbox__close"
        aria-label="Chiudi immagine"
        onClick={() => dialogRef.current?.close()}
        autoFocus
      >
        <X aria-hidden="true" />
      </button>
      <img
        className="image-lightbox__image"
        src={image.imageUrl}
        alt={image.imageAlt}
        style={image.imagePosition ? { objectPosition: image.imagePosition } : undefined}
        loading="eager"
        decoding="async"
        referrerPolicy="no-referrer"
      />
      <p id={captionId}>{caption}</p>
    </dialog>
  )
}
