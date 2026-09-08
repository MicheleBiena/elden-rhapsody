import { useEffect, useState } from 'react'

export function usePersistentState<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = window.localStorage.getItem(key)
      if (saved !== null) return JSON.parse(saved) as T
    } catch {
      // Fall back to the initial value if storage is unavailable or malformed.
    }
    return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Private browsing and strict storage policies may reject localStorage.
    }
  }, [key, value])

  return [value, setValue] as const
}
