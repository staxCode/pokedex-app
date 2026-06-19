import { useEffect, useState } from 'react'
import type { FC } from 'react'
import type { Pokemon } from '../../shared/types'
import { TYPE_COLORS } from '../../shared/constants/typeColors'
import { fetchPokemonById } from '../../shared/api/pokemonApi'

interface DetailPageProps {
    pokemon: Pokemon | null
    pokemonId?: number
    isFavorite: boolean
    onToggleFavorite: (id: number) => void
    onBack: () => void
}

export const DetailPage: FC<DetailPageProps> = ({
    pokemon: initialPokemon,
    pokemonId,
    isFavorite,
    onToggleFavorite,
    onBack,
}) => {
    const [pokemon, setPokemon] = useState<Pokemon | null>(initialPokemon || null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (initialPokemon) {
            setPokemon(initialPokemon)
            return
        }

        if (pokemonId) {
            setIsLoading(true)
            setError(null)

            fetchPokemonById(pokemonId)
                .then(setPokemon)
                .catch((err) => setError((err as Error).message))
                .finally(() => setIsLoading(false))
        }
    }, [initialPokemon, pokemonId])

    if (isLoading) {
        return (
            <div className="page detail-page">
                <button className="back-btn" onClick={onBack} aria-label="Volver atrás">
                    ← Volver
                </button>
                <div className="loading-row" aria-label="Cargando pokémon">
                    <div className="pokeball-loader">
                        <div className="ball-top" />
                        <div className="ball-divider" />
                        <div className="ball-bottom" />
                        <div className="ball-center" />
                    </div>
                    <span>Cargando…</span>
                </div>
            </div>
        )
    }

    if (error || !pokemon) {
        return (
            <div className="page detail-page">
                <button className="back-btn" onClick={onBack} aria-label="Volver atrás">
                    ← Volver
                </button>
                {error && (
                    <div className="state-message error" role="alert">
                        <span>⚠</span> {error}
                    </div>
                )}
            </div>
        )
    }

    const { id, name, image, types, weight, height } = pokemon

    return (
        <div className="page detail-page">
            <button className="back-btn" onClick={onBack} aria-label="Volver atrás">
                ← Volver
            </button>

            <div className="detail-grid">
                <div className="detail-image">
                    {image ? (
                        <img src={image} alt={name} />
                    ) : (
                        <div className="no-image-large">?</div>
                    )}
                </div>

                <div className="detail-info">
                    <div className="detail-header">
                        <h1>{name}</h1>
                        <span className="number">#{String(id).padStart(3, '0')}</span>
                    </div>

                    <div className="types-section">
                        <h2>Tipos</h2>
                        <div className="types">
                            {types.map((t) => (
                                <span
                                    key={t}
                                    className="type-badge"
                                    style={{ background: TYPE_COLORS[t] || '#888' }}
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="measures-section">
                        <h2>Medidas</h2>
                        <div className="measures">
                            <div className="measure-item">
                                <strong>Peso:</strong> <span>{weight} hg</span>
                            </div>
                            <div className="measure-item">
                                <strong>Altura:</strong> <span>{height} dm</span>
                            </div>
                        </div>
                    </div>

                    <button
                        className={`fav-btn large ${isFavorite ? 'fav' : ''}`}
                        onClick={() => onToggleFavorite(id)}
                        aria-pressed={!!isFavorite}
                    >
                        {isFavorite ? 'Favorito' : 'Añadir a favoritos'}
                    </button>
                </div>
            </div>
        </div>
    )
}
