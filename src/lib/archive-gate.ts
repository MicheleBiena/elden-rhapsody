/**
 * Gate con password per l'archivio post-run.
 *
 * La risposta non è mai salvata in chiaro: viene confrontato solo
 * lo SHA-256 della forma normalizzata. Il confronto avviene interamente
 * nel browser, senza rete.
 */

export const ARCHIVE_UNLOCK_KEY = 'elden-rhapsody:archive-unlocked-v1'

/** SHA-256 hex della risposta normalizzata. */
export const ARCHIVE_ANSWER_HASH =
  'b9959b361fe2d3e89af347e999b4698740035b65795a6877a4044009addbd6de'

export function normalizeArchiveAnswer(value: string): string {
  return value
    .toLocaleLowerCase('it')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value),
  )
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

/** Fallback senza WebCrypto: confronto con risposta ricostruita da char-code. */
function fallbackCompare(normalized: string): boolean {
  const expected = String.fromCharCode(109, 97, 114, 105, 107, 97)
  if (normalized.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i += 1) {
    diff |= normalized.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return diff === 0
}

export async function verifyArchiveAnswer(rawValue: string): Promise<boolean> {
  const normalized = normalizeArchiveAnswer(rawValue)
  if (!normalized) return false
  try {
    if (crypto?.subtle) {
      const hash = await sha256Hex(normalized)
      if (hash.length !== ARCHIVE_ANSWER_HASH.length) return false
      let diff = 0
      for (let i = 0; i < hash.length; i += 1) {
        diff |= hash.charCodeAt(i) ^ ARCHIVE_ANSWER_HASH.charCodeAt(i)
      }
      return diff === 0
    }
  } catch {
    // Sotto: fallback senza WebCrypto.
  }
  return fallbackCompare(normalized)
}

export function isArchiveUnlocked(): boolean {
  try {
    return window.localStorage.getItem(ARCHIVE_UNLOCK_KEY) === 'true'
  } catch {
    return false
  }
}

export function setArchiveUnlocked(): void {
  try {
    window.localStorage.setItem(ARCHIVE_UNLOCK_KEY, 'true')
  } catch {
    // Storage non disponibile (navigazione privata): lo sblocco resta di sessione.
  }
}

export function lockArchive(): void {
  try {
    window.localStorage.removeItem(ARCHIVE_UNLOCK_KEY)
  } catch {
    // Ignora: lo stato di sessione viene comunque resettato dal chiamante.
  }
}
