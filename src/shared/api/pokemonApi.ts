import type { Pokemon } from '../types'

export const BASE_URL = 'https://pokeapi.co/api/v2'

export interface ApiPokemonResponse {
  id: number
  name: string
  sprites: {
    front_default: string | null
    other?: {
      'official-artwork'?: {
        front_default: string | null
      }
    }
  }
  types: Array<{
    type: { name: string }
  }>
  weight: number
  height: number
  stats: Array<{
    base_stat: number
  }>
}

export function normalizePokemon(data: ApiPokemonResponse): Pokemon {
  return {
    id: data.id,
    name: data.name,
    image:
      data.sprites.other?.['official-artwork']?.front_default ||
      data.sprites.front_default ||
      '',
    types: data.types.map((t) => t.type.name),
    weight: data.weight,
    height: data.height,
    stats: {
      hp: data.stats[0].base_stat,
      attack: data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
      speed: data.stats[5].base_stat,
    },
  }
}

export async function fetchPokemonById(id: number, signal?: AbortSignal): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemon/${id}`, { signal })
  if (!res.ok) throw new Error(`Error al cargar pokémon ${id}`)
  const data: ApiPokemonResponse = await res.json()
  return normalizePokemon(data)
}

export async function fetchPokemonByIds(ids: number[], signal?: AbortSignal): Promise<Pokemon[]> {
  const promises = ids.map((id) =>
    fetchPokemonById(id, signal).catch(() => null)
  )
  const results = await Promise.all(promises)
  return results.filter((p): p is Pokemon => p !== null)
}
