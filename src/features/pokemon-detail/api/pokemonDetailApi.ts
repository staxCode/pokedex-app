import { fetchPokemonById } from '../../../shared/api/pokemonApi'
import type { Pokemon } from '../../../shared/types'

export async function fetchDetail(
  id: number,
  signal?: AbortSignal
): Promise<Pokemon> {
  return fetchPokemonById(id, signal)
}
