/**
 * App.tsx — Componente raíz
 *
 * Ensambla los tres sistemas principales:
 *   1. usePokemon   → datos + búsqueda debounced
 *   2. useInfiniteScroll → observa el sentinel al final del grid
 *   3. 3 páginas: ListPage, DetailPage, FavoritesPage
 */

import { usePokemon } from './features/pokemon-list/hooks/usePokemon'
import { ListPage } from './features/pokemon-list/ListPage'
import { DetailPage } from './features/pokemon-detail/DetailPage'
import { FavoritesPage } from './features/favorites/FavoritesPage'
import { useEffect, useMemo, useState } from 'react'
import type { Page } from './shared/types'

export default function App() {
  const {
    pokemon,
    isLoading,
    error,
    hasMore,
    search,
    setSearch,
    loadMore,
    debouncedSearch,
  } = usePokemon()

  // Favoritos persistidos en localStorage (guardamos ids)
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem('pokedex:favorites')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('pokedex:favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  // Tipo seleccionado para filtrar
  const [typeFilter, setTypeFilter] = useState<string>('')

  // Lista de tipos disponibles (derivada de los pokémon cargados)
  const availableTypes = useMemo(() => {
    const s = new Set<string>()
    pokemon.forEach((p) => p.types.forEach((t) => s.add(t)))
    return Array.from(s).sort()
  }, [pokemon])

  // Routing: 'list' | 'detail' | 'favorites'
  const [currentPage, setCurrentPage] = useState<Page>('list')
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null)

  const selectedPokemon = selectedPokemonId
    ? pokemon.find((p) => p.id === selectedPokemonId) || null
    : null

  const goToDetail = (id: number) => {
    setSelectedPokemonId(id)
    setCurrentPage('detail')
  }

  const goToList = () => {
    setCurrentPage('list')
  }

  const goToFavorites = () => {
    setCurrentPage('favorites')
  }

  return (
    <div className="app">
      {/* ── HEADER ────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-ball" aria-hidden="true">
              ◉
            </span>
            <span className="logo-text">Pokédex</span>
          </div>
        </div>

        {/* ── NAV ───────────────────────────────────────── */}
        <nav className="app-nav">
          <button
            className={`nav-btn ${currentPage === 'list' ? 'active' : ''}`}
            onClick={goToList}
          >
            Listado
          </button>
          <button
            className={`nav-btn ${currentPage === 'favorites' ? 'active' : ''}`}
            onClick={goToFavorites}
          >
            Favoritos ({favorites.length})
          </button>
        </nav>
      </header>

      {/* ── CONTENT ────────────────────────────────────────── */}
      <div className="app-content">
        {currentPage === 'list' && (
          <ListPage
            pokemon={pokemon}
            isLoading={isLoading}
            error={error}
            hasMore={hasMore}
            search={search}
            setSearch={setSearch}
            debouncedSearch={debouncedSearch}
            loadMore={loadMore}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            availableTypes={availableTypes}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onSelectPokemon={goToDetail}
          />
        )}

        {currentPage === 'detail' && (
          <DetailPage
            pokemon={selectedPokemon}
            pokemonId={selectedPokemonId || undefined}
            isFavorite={selectedPokemonId ? favorites.includes(selectedPokemonId) : false}
            onToggleFavorite={toggleFavorite}
            onBack={goToList}
          />
        )}

        {currentPage === 'favorites' && (
          <FavoritesPage
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onSelectPokemon={goToDetail}
          />
        )}
      </div>
    </div>
  )
}
