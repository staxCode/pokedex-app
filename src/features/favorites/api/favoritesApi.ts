import { fetchPokemonById } from '../../../shared/api/pokemonApi'
import type { Pokemon } from '../../../shared/types'

export async function fetchPokemonByIds(ids: number[], signal?: AbortSignal): Promise<Pokemon[]> {
  const promises = ids.map((id) =>
    fetchPokemonById(id, signal).catch(() => null)
  )

  const results = await Promise.all(promises)
  return results.filter((p): p is Pokemon => p !== null)
}
