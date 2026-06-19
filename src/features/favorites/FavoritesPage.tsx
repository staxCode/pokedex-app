import type { FC } from 'react'
import { PokemonCard } from '../../shared/components/PokemonCard'
import { useFavoritePokemon } from './hooks/useFavoritePokemon'

interface FavoritesPageProps {
    favorites: number[]
    onToggleFavorite: (id: number) => void
    onSelectPokemon: (id: number) => void
}

export const FavoritesPage: FC<FavoritesPageProps> = ({
    favorites,
    onToggleFavorite,
    onSelectPokemon,
}) => {
    const { favoritePokemon, isLoading, error } = useFavoritePokemon(favorites)

    return (
        <div className="page">
            <h1>Pokémon Favoritos ({favorites.length})</h1>

            {error && (
                <div className="state-message error" role="alert">
                    <span>⚠</span> {error}
                </div>
            )}

            {isLoading && (
                <div className="loading-row" aria-label="Cargando favoritos">
                    <div className="pokeball-loader">
                        <div className="ball-top" />
                        <div className="ball-divider" />
                        <div className="ball-bottom" />
                        <div className="ball-center" />
                    </div>
                    <span>Cargando favoritos…</span>
                </div>
            )}

            {!isLoading && favoritePokemon.length === 0 && (
                <div className="empty-state">
                    <p>No tienes pokémon favoritos aún</p>
                    <p>Vuelve al listado y marca algunos como favoritos</p>
                </div>
            )}

            {!isLoading && favoritePokemon.length > 0 && (
                <div className="pokemon-grid">
                    {favoritePokemon.map((p) => (
                        <PokemonCard
                            key={p.id}
                            {...p}
                            isFavorite={true}
                            onToggleFavorite={onToggleFavorite}
                            onSelect={onSelectPokemon}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
