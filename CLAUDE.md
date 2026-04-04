# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
npm run dev       # servidor de desarrollo (Vite, http://localhost:5173)
npm run build     # chequeo TypeScript + build de producción
npm run preview   # previsualizar el build de producción
```

No hay linter ni tests configurados.

## Stack

React 18 + TypeScript + Vite, con:
- **CSS Modules** — obligatorio para todos los estilos de componentes/páginas
- **Zustand** — solo para estado global (`src/store/`); todos los stores usan `persist` de zustand/middleware
- **Axios** — solo en `src/services/` o hooks; el cliente base está en `src/services/apiClient.ts`
- **react-router-dom v7** — rutas declaradas en `App.tsx`
- **flag-icons** — banderas de países via clase CSS `fi fi-{flagIcon}` (p.ej. `fi fi-ar`)

## Reglas de arquitectura

Del `stack.md`:
- **Componentes** = solo UI, sin lógica de negocio
- **Hooks** = lógica reutilizable
- **Axios** solo en `src/services/` o hooks
- **Zustand** solo para estado global
- **CSS Modules** obligatorio (sin estilos inline ni clases globales)

## Rutas

| Path | Página | Descripción |
|------|--------|-------------|
| `/` | `Home` | Landing con cards de secciones y stats rápidas |
| `/fixture` | `Fixture` | Los 12 grupos del Mundial 2026 (solo lectura) |
| `/pronostico` | `Pronostico` | Flujo interactivo de pronóstico (ver abajo) |
| `/mundiales` | `Mundiales` | Historia 1930–2022 con sidebar de estadísticas |
| `/campeones` | `Campeones` | Grid de campeones por año con modal de plantilla |

## Design system

Todas las variables CSS están en `src/styles/theme.css`. La raíz del DOM recibe `data-theme="light|dark"`, seteado por `useTheme` sobre `document.documentElement`. El toggle vive en `useThemeStore` → `useTheme`.

Variables semánticas: `--color-bg`, `--color-bg-subtle`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-hover`.  
Escala de spacing: `--space-1` (4px) a `--space-16` (64px).  
Escala tipográfica: `--font-size-xs` (12px) a `--font-size-4xl` (36px).  
Paletas: `--color-primary-{50..900}` (azul) y `--color-secondary-{50..900}` (violeta).

## Tipos de datos centrales

- `src/types/worldCup.ts` — `Country` (código ISO, nombre en español, emoji, `flagIcon`, confederación), `Team = Country`, `Group`
- `src/types/bracket.ts` — `Round` ('R32'|'R16'|'QF'|'SF'|'F'), `BracketMatch` (con `nextMatchId` y `nextSlot` para propagar ganadores)

## Datos estáticos

- `src/data/worldCup2026.ts` — exporta `GROUPS`: 12 grupos × 4 equipos del Mundial 2026
- `src/data/countries.ts` — catálogo de países con código ISO, nombre, emoji y `flagIcon`
- `src/data/historyCup.ts` — historial de todas las copas del mundo (usado por `/mundiales` y `/campeones`)
- `src/data/championsPlayers.ts` — exporta `PLAYERS_BY_YEAR`: mapa año → `{ campeon, anio, dt, jugadores[] }`, usado en el modal de `/campeones`

## Flujo del Pronóstico (`/pronostico`)

El estado se persiste en localStorage. Hay dos stores que trabajan juntos:

- `usePronosticoStore` (key: `pronostico-wc2026`) — fases + picks de grupos + ranking de terceros
- `useBracketStore` (key: `bracket-wc2026`) — 31 partidos del cuadro eliminatorio

**4 fases** controladas por `pronosticoStore.phase`:

1. **`intro`** — pantalla de bienvenida
2. **`picking`** — el usuario clasifica los 4 equipos de cada uno de los 12 grupos eligiendo 3 (1°, 2°, 3°)
3. **`thirdPlace`** — el usuario rankea los 12 terceros para elegir los 8 mejores que avanzan
4. **`bracket`** — cuadro eliminatorio; al entrar se llama `buildInitialBracket(picks, top8thirds)` para construir los 31 `BracketMatch`

**Propagación de ganadores** en `bracketStore.pickWinner`: cuando se elige un ganador, este se propaga recursivamente hacia los partidos downstream via `nextMatchId`/`nextSlot`. Si se deshace un pick, la cadena se limpia hacia adelante.

## Componente Bracket

`src/components/Bracket/Bracket.tsx` renderiza el cuadro con posicionamiento absoluto usando constantes de layout definidas al tope del archivo (`MH=92px`, `MW=224px`, `GAP=10px`, `CW=32px`). Los conectores SVG entre rondas se generan con `ConnectorSVG`. El flag de cada equipo se resuelve con un `Map<name, flagIcon>` construido desde `GROUPS`.

## Servicios HTTP

`apiClient` en `src/services/apiClient.ts` es la instancia Axios base. La `baseURL` se toma de `VITE_API_URL` (variable de entorno). Actualmente el proyecto no usa datos remotos en producción; los datos son todos estáticos.
