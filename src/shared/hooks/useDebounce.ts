import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number = 400) {
  const [debouncedValue, setDebouncedValue] = useState<T | undefined>(undefined)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
