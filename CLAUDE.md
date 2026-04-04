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
- **react-router-dom v7** — rutas declaradas en `App.tsx`, todas las páginas con `React.lazy` + `Suspense`
- **react-helmet-async** — meta tags SEO por ruta; la app está envuelta en `<HelmetProvider>`
- **vite-plugin-pwa** — service worker generado automáticamente, app instalable, datos cacheados offline
- **flag-icons** — banderas de países via clase CSS `fi fi-{flagIcon}` (p.ej. `fi fi-ar`)

> No hay cliente HTTP. Toda la data es estática en `src/data/`.

## Reglas de arquitectura

- **Componentes** = solo UI, sin lógica de negocio
- **Hooks** = lógica reutilizable
- **Zustand** solo para estado global
- **CSS Modules** obligatorio (sin estilos inline ni clases globales)
- **Imports** usan el alias `@/` → `src/` (configurado en `tsconfig.json` y `vite.config.ts`)

## Rutas

| Path | Página | Descripción |
|------|--------|-------------|
| `/` | `Home` | Landing con hero, cards de secciones y stats rápidas |
| `/fixture` | `Fixture` | Los 12 grupos del Mundial 2026 (solo lectura) |
| `/pronostico` | `Pronostico` | Flujo interactivo de pronóstico (ver abajo) |
| `/mundiales` | `Mundiales` | Historia 1930–2022 con sidebar de estadísticas |
| `/campeones` | `Campeones` | Grid de campeones por año con modal de plantel |

## Design system

Todas las variables CSS están en `src/styles/theme.css`. La raíz del DOM recibe `data-theme="light|dark"`, seteado por `useTheme` sobre `document.documentElement`. El toggle vive en `useThemeStore` → `useTheme`.

Variables semánticas: `--color-bg`, `--color-bg-subtle`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-hover`.
Escala de spacing: `--space-1` (4px) a `--space-16` (64px).
Escala tipográfica: `--font-size-xs` (12px) a `--font-size-4xl` (36px).
Paletas: `--color-primary-{50..900}` (azul) y `--color-secondary-{50..900}` (violeta).

## Tipos de datos centrales

- `src/types/worldCup.ts` — `Country` (código ISO, nombre en español, `flagIcon`, confederación), `Team = Country`, `Group`
- `src/types/bracket.ts` — `Round` ('16avos'|'R16'|'QF'|'SF'|'F'), `BracketMatch` (con `nextMatchId` y `nextSlot` para propagar ganadores)

## Datos estáticos

- `src/data/worldCup2026.ts` — exporta `GROUPS`: 12 grupos × 4 equipos del Mundial 2026
- `src/data/countries.ts` — catálogo de 48 países con código ISO, nombre, `flagIcon` y confederación
- `src/data/historyCup.ts` — historial de todas las copas del mundo (usado por `/mundiales` y `/campeones`)
- `src/data/championsPlayers.ts` — exporta `PLAYERS_BY_YEAR`: mapa año → `{ campeon, anio, dt, jugadores[] }` con plantel completo y dorsales; usado en el modal de `/campeones`

## Imágenes

Las fotos de los campeones están en `src/assets/{año}.{ext}`. Formato óptimo por tamaño:
- **WebP** — imágenes ≥ 20 KB (2006, 2010, 2014, 2018, 1974, 1978, 1982, 1986, 1990, 1994, 2002, 1954)
- **AVIF** — imágenes originales ya en ese formato (2022, 2014, 1998)
- **JPEG** — imágenes pequeñas < 20 KB (1930–1970); en ese rango WebP resulta más pesado

Para agregar una imagen nueva: colocarla en `src/assets/`, importarla en el mapa `IMAGES` de `Campeones.tsx`.

## Flujo del Pronóstico (`/pronostico`)

El estado se persiste en localStorage. Hay dos stores:

- `usePronosticoStore` (key: `pronostico-wc2026`) — fases + picks de grupos + ranking de terceros
- `useBracketStore` (key: `bracket-wc2026`) — 31 partidos del cuadro eliminatorio

**4 fases** controladas por `pronosticoStore.phase`:

1. **`intro`** — pantalla de bienvenida
2. **`picking`** — el usuario clasifica los 4 equipos de cada uno de los 12 grupos eligiendo 3 (1°, 2°, 3°)
3. **`thirdPlace`** — el usuario rankea los 12 terceros para elegir los 8 mejores que avanzan
4. **`bracket`** — cuadro eliminatorio; al entrar se llama `buildInitialBracket(picks, top8thirds)` para construir los 31 `BracketMatch`

**Propagación de ganadores** en `bracketStore.pickWinner`: cuando se elige un ganador se propaga recursivamente hacia los partidos downstream via `nextMatchId`/`nextSlot`. Si se deshace un pick, la cadena se limpia hacia adelante.

## Componente Bracket

`src/components/Bracket/Bracket.tsx` renderiza el cuadro con posicionamiento absoluto usando constantes de layout definidas al tope del archivo (`MH=92px`, `MW=224px`, `GAP=10px`, `CW=32px`). Los conectores SVG entre rondas se generan con `ConnectorSVG`. El flag de cada equipo se resuelve con un `Map<name, flagIcon>` construido desde `GROUPS`.

## PWA

Configurado en `vite.config.ts` con `vite-plugin-pwa`. En build de producción genera `sw.js` y `workbox-*.js`.
- **Precache**: JS, CSS, HTML, SVG de banderas
- **Runtime cache**: imágenes (CacheFirst, 30 días)
- Para que el SW se registre en desarrollo: usar `npm run preview` o build + serve.
