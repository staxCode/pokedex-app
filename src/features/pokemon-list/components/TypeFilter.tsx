import type { FC } from 'react'

interface TypeFilterProps {
  types: string[]
  value: string
  onChange: (value: string) => void
}

export const TypeFilter: FC<TypeFilterProps> = ({ types, value, onChange }) => {
  return (
    <div className="type-filter">
      <label htmlFor="type-select">Filtrar por tipo:</label>
      <select
        id="type-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Todos</option>
        {types.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  )
}
