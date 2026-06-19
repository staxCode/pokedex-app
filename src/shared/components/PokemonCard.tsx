import type { FC } from 'react'
import type { Pokemon } from '../types'
import { TYPE_COLORS } from '../constants/typeColors'

interface PokemonCardProps extends Pokemon {
    isFavorite?: boolean
    onToggleFavorite?: (id: number) => void
    onSelect?: (id: number) => void
}

export const PokemonCard: FC<PokemonCardProps> = ({
    id,
    name,
    image,
    types,
    isFavorite = false,
    onToggleFavorite,
    onSelect,
}) => {
    const primaryType = types[0]
    const accentColor = TYPE_COLORS[primaryType] || '#888'

    return (
        <article
            className="pokemon-card compact"
            style={{ '--accent': accentColor } as React.CSSProperties}
            aria-label={`${name}, número ${id}`}
            onClick={() => onSelect?.(id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter') onSelect?.(id)
            }}
        >
            <div className="card-header">
                <span className="pokemon-number">#{String(id).padStart(3, '0')}</span>
                <div className="types">
                    {types.map((type) => (
                        <span
                            key={type}
                            className="type-badge"
                            style={{ background: TYPE_COLORS[type] || '#888' }}
                        >
                            {type}
                        </span>
                    ))}
                </div>
            </div>

            <div className="card-image">
                {image ? (
                    <img src={image} alt={name} loading="lazy" />
                ) : (
                    <div className="no-image">?</div>
                )}
            </div>

            <div className="card-footer">
                <h2 className="pokemon-name">{name}</h2>
                <button
                    className={`fav-btn ${isFavorite ? 'fav' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation()
                        onToggleFavorite?.(id)
                    }}
                    aria-pressed={!!isFavorite}
                    title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                >
                    {isFavorite ? '★' : '☆'}
                </button>
            </div>
        </article>
    )
}
