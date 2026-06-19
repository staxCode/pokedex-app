import type { FC } from 'react'
import { PokemonCard } from '../../shared/components/PokemonCard'
import { SearchBar } from './components/SearchBar'
import { TypeFilter } from './components/TypeFilter'
import { useInfiniteScroll } from './hooks/useInfiniteScroll'
import type { Pokemon } from '../../shared/types'

interface ListPageProps {
  pokemon: Pokemon[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  search: string
  setSearch: (search: string) => void
  debouncedSearch: string
  loadMore: () => void
  typeFilter: string
  setTypeFilter: (filter: string) => void
  availableTypes: string[]
  favorites: number[]
  onToggleFavorite: (id: number) => void
  onSelectPokemon: (id: number) => void
}

export const ListPage: FC<ListPageProps> = ({
  pokemon,
  isLoading,
  error,
  hasMore,
  search,
  setSearch,
  debouncedSearch,
  loadMore,
  typeFilter,
  setTypeFilter,
  availableTypes,
  favorites,
  onToggleFavorite,
  onSelectPokemon,
}) => {
  const sentinelRef = useInfiniteScroll(loadMore, hasMore, isLoading)

  const displayed = typeFilter
    ? pokemon.filter((p) => p.types.includes(typeFilter))
    : pokemon

  return (
    <div className="page">
      <div className="list-header">
        <div className="header-info">
          {debouncedSearch
            ? `Resultados para "${debouncedSearch}"`
            : `${pokemon.length} pokémon cargados`}
        </div>
        <div className="header-controls">
          <SearchBar
            value={search}
            onChange={setSearch}
            debouncedValue={debouncedSearch}
            isLoading={isLoading}
          />
          <TypeFilter
            types={availableTypes}
            value={typeFilter}
            onChange={setTypeFilter}
          />
        </div>
      </div>

      <main className="pokemon-grid" aria-live="polite" aria-label="Lista de pokémon">
        {displayed.map((p) => (
          <PokemonCard
            key={p.id}
            {...p}
            isFavorite={favorites.includes(p.id)}
            onToggleFavorite={onToggleFavorite}
            onSelect={onSelectPokemon}
          />
        ))}
      </main>

      {error && (
        <div className="state-message error" role="alert">
          <span>⚠</span> {error}
        </div>
      )}

      {!isLoading && !error && displayed.length === 0 && pokemon.length > 0 && (
        <div className="state-message empty">
          <span>◎</span>
          <p>No se encontraron pokémon para el filtro seleccionado</p>
        </div>
      )}

      {!isLoading && !error && pokemon.length === 0 && (
        <div className="state-message empty">
          <span>◎</span>
          <p>No se encontraron pokémon para "{debouncedSearch}"</p>
          <small>Recuerda: la búsqueda es por nombre parcial (ej: "char")</small>
        </div>
      )}

      <div ref={sentinelRef} className="scroll-sentinel" aria-hidden="true" />

      {isLoading && (
        <div className="loading-row" aria-label="Cargando más pokémon">
          <div className="pokeball-loader">
            <div className="ball-top" />
            <div className="ball-divider" />
            <div className="ball-bottom" />
            <div className="ball-center" />
          </div>
          <span>Cargando…</span>
        </div>
      )}

      {!hasMore && !isLoading && pokemon.length > 0 && (
        <div className="end-message">
          ✓ {debouncedSearch ? 'Búsqueda completada' : 'Todos los pokémon cargados'}
        </div>
      )}
    </div>
  )
}
