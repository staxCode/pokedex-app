# Pokédex — Scroll Infinito

Aplicación para explorar, buscar y guardar pokémon favoritos consumiendo la PokéAPI. Construida con React + TypeScript + Vite bajo una arquitectura **Feature-Based**.

## Características

- Scroll infinito con `IntersectionObserver`
- Búsqueda con debounce y cancelación de requests (`AbortController`)
- Filtrado local por tipo de pokémon
- Sistema de favoritos persistido en `localStorage`
- Vista de detalle con información completa
- Manejo de errores con mensaje de error

## Stack

- **React 18** + **TypeScript**
- **Vite 5**
- **Arquitectura Feature-Based** (`features/`, `shared/`)
- PokéAPI (`https://pokeapi.co`)

## Instalación

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
