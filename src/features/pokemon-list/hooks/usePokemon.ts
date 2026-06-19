import { useState, useEffect, useCallback, useRef } from 'react'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import { fetchPage, searchPokemon } from '../api/pokemonListApi'
import type { Pokemon } from '../../../shared/types'

const PAGE_SIZE = 20

interface UsePokemonReturn {
  pokemon: Pokemon[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  search: string
  setSearch: (search: string) => void
  loadMore: () => void
  debouncedSearch: string
}

function isReady(v: string | undefined): v is string {
  return v !== undefined
}

export function usePokemon(): UsePokemonReturn {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('')

  const debouncedSearch = useDebounce(search, 400)

  const abortControllerRef = useRef<AbortController | null>(null)

  const loadPage = useCallback(async (currentOffset: number) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchPage(currentOffset, signal)
      setPokemon((prev) => [...prev, ...result.pokemon])
      setHasMore(result.hasMore)
    } catch (err) {
      const error = err as Error
      if (error.name !== 'AbortError') {
        setError(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadSearch = useCallback(async (query: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current

    setIsLoading(true)
    setError(null)

    try {
      const results = await searchPokemon(query, signal)
      setPokemon(results)
      setHasMore(false)
    } catch (err) {
      const error = err as Error
      if (error.name !== 'AbortError') {
        setError(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isReady(debouncedSearch)) return

    if (debouncedSearch.trim() === '') {
      setPokemon([])
      setOffset(0)
      setHasMore(true)
      loadPage(0)
    } else {
      setPokemon([])
      setHasMore(false)
      loadSearch(debouncedSearch)
    }
  }, [debouncedSearch, loadPage, loadSearch])

  useEffect(() => {
    if (!isReady(debouncedSearch)) return
    if (offset === 0) return
    if (debouncedSearch.trim() !== '') return
    loadPage(offset)
  }, [offset, loadPage, debouncedSearch])

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setOffset((prev) => prev + PAGE_SIZE)
    }
  }, [isLoading, hasMore])

  return {
    pokemon,
    isLoading,
    error,
    hasMore,
    search,
    setSearch,
    loadMore,
    debouncedSearch: debouncedSearch ?? '',
  }
}
