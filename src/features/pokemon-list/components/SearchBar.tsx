import type { FC } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  debouncedValue: string
  isLoading: boolean
}

export const SearchBar: FC<SearchBarProps> = ({
  value,
  onChange,
  debouncedValue,
  isLoading,
}) => {
  const isDebouncing = value !== debouncedValue

  return (
    <div className="search-wrapper">
      <div className="search-icon">
        {isLoading ? (
          <span className="spinner" aria-hidden="true" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="22" y2="22" />
          </svg>
        )}
      </div>

      <input
        type="text"
        className="search-input"
        placeholder="Buscar pokémon…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Buscar pokémon por nombre"
        autoComplete="off"
        spellCheck="false"
      />

      {isDebouncing && (
        <span className="debounce-indicator" title="Esperando que termines de escribir…">
          ●●●
        </span>
      )}

      {value && (
        <button
          className="clear-btn"
          onClick={() => onChange('')}
          aria-label="Limpiar búsqueda"
        >
          ✕
        </button>
      )}
    </div>
  )
}
