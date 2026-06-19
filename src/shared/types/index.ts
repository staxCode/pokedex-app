export interface Pokemon {
  id: number
  name: string
  image: string
  types: string[]
  weight: number
  height: number
  stats: {
    hp: number
    attack: number
    defense: number
    speed: number
  }
}

export type Page = 'list' | 'detail' | 'favorites'
