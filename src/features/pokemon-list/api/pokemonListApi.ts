import { normalizePokemon, BASE_URL, type ApiPokemonResponse } from '../../../shared/api/pokemonApi'
import type { Pokemon } from '../../../shared/types'

const PAGE_SIZE = 20

interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Array<{
    name: string
    url: string
  }>
}

export async function fetchPage(
  currentOffset: number,
  signal?: AbortSignal
): Promise<{ pokemon: Pokemon[]; hasMore: boolean }> {
  const listRes = await fetch(
    `${BASE_URL}/pokemon?limit=${PAGE_SIZE}&offset=${currentOffset}`,
    { signal }
  )
  if (!listRes.ok) throw new Error(`Error ${listRes.status}: ${listRes.statusText}`)
  const listData: PokemonListResponse = await listRes.json()

  const detailPromises = listData.results.map((p) =>
    fetch(p.url, { signal }).then((r) => {
      if (!r.ok) throw new Error(`Error al cargar ${p.name}`)
      return r.json() as Promise<ApiPokemonResponse>
    })
  )

  const details = await Promise.all(detailPromises)
  return { pokemon: details.map(normalizePokemon), hasMore: listData.next !== null }
}

export async function searchPokemon(
  query: string,
  signal?: AbortSignal
): Promise<Pokemon[]> {
  const listRes = await fetch(`${BASE_URL}/pokemon?limit=1000&offset=0`, { signal })
  if (!listRes.ok) throw new Error(`Error ${listRes.status}`)
  const listData: PokemonListResponse = await listRes.json()

  const filtered = listData.results.filter((p) =>
    p.name.includes(query.toLowerCase().trim())
  )

  if (filtered.length === 0) return []

  const toLoad = filtered.slice(0, PAGE_SIZE)
  const detailPromises = toLoad.map((p) =>
    fetch(p.url, { signal }).then((r) => r.json() as Promise<ApiPokemonResponse>)
  )
  const details = await Promise.all(detailPromises)

  return details.map(normalizePokemon)
}
