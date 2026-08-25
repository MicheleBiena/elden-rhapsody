export function isSafeContentUrl(value?: string) {
  if (!value) return false

  if (value.startsWith('/') || value.startsWith('./') || value.startsWith('../')) {
    return true
  }

  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}
