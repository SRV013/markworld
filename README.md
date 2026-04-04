# mark World

Estadísticas, historia y pronósticos de los Mundiales de Fútbol. Construido con React + TypeScript.

## Secciones

| Ruta | Descripción |
|------|-------------|
| `/` | Landing con stats y accesos rápidos |
| `/fixture` | 12 grupos y 48 equipos del Mundial 2026 |
| `/pronostico` | Pronóstico interactivo: grupos → terceros → bracket eliminatorio |
| `/mundiales` | Historia completa 1930–2022 con podios y ranking acumulado |
| `/campeones` | Grid de campeones con modal de plantel completo y dorsales |

## Stack

- **React 18** + **TypeScript** + **Vite**
- **CSS Modules** — estilos encapsulados por componente
- **Zustand** — estado global con persistencia en localStorage
- **react-router-dom v7** — enrutado con code splitting (React.lazy)
- **react-helmet-async** — meta tags SEO por ruta
- **vite-plugin-pwa** — PWA instalable, funciona offline
- **flag-icons** — banderas de países vía CSS

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build de producción
npm run preview   # previsualizar build
```

## Características técnicas

- **Code splitting** — cada página es un chunk JS independiente
- **PWA** — service worker con cache de assets, instalable en móvil
- **SEO** — `<title>` y meta description únicos por ruta con Open Graph
- **Dark / Light mode** — toggle manual + respeta `prefers-color-scheme`
- **Imágenes optimizadas** — WebP para fotos ≥ 20 KB, JPEG para las pequeñas
- **Lazy loading** — imágenes con `loading="lazy"` en el grid de campeones

## Estructura

```
src/
├── assets/          # imágenes de campeones (WebP / AVIF / JPEG)
├── components/      # componentes reutilizables
│   ├── Bracket/     # cuadro eliminatorio
│   ├── Fallback/    # loading indicator (pelota SVG)
│   ├── GroupPicker/ # selector de clasificados por grupo
│   ├── Groups/      # display de grupos
│   ├── Header/      # nav + dark mode toggle
│   └── ThirdPlacePicker/
├── data/            # datos estáticos (TypeScript)
│   ├── championsPlayers.ts  # planteles completos 1930–2022
│   ├── countries.ts         # 48 selecciones con flagIcon
│   ├── historyCup.ts        # historial de mundiales
│   └── worldCup2026.ts      # grupos del Mundial 2026
├── hooks/           # useTheme
├── pages/           # una carpeta por ruta
├── store/           # zustand stores
├── styles/          # theme.css (design system con variables CSS)
├── types/           # TypeScript interfaces
└── utils/           # buildBracket
```
