import { useState, useEffect, useRef } from 'react'
import { fetchPokemonByIds } from '../api/favoritesApi'
import type { Pokemon } from '../../../shared/types'

interface UseFavoritePokemonReturn {
  favoritePokemon: Pokemon[]
  isLoading: boolean
  error: string | null
}

export function useFavoritePokemon(favoriteIds: number[]): UseFavoritePokemonReturn {
  const [favoritePokemon, setFavoritePokemon] = useState<Pokemon[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setFavoritePokemon([])
      return
    }

    if (abortRef.current) {
      abortRef.current.abort()
    }
    abortRef.current = new AbortController()

    setIsLoading(true)
    setError(null)

    fetchPokemonByIds(favoriteIds, abortRef.current.signal)
      .then((pokemon) => {
        const sorted = favoriteIds
          .map((id) => pokemon.find((p) => p.id === id))
          .filter((p): p is Pokemon => p !== undefined)
        setFavoritePokemon(sorted)
      })
      .catch((err) => {
        const error = err as Error
        if (error.name !== 'AbortError') {
          setError(error.message)
        }
      })
      .finally(() => setIsLoading(false))

    return () => {
      abortRef.current?.abort()
    }
  }, [favoriteIds])

  return { favoritePokemon, isLoading, error }
}
