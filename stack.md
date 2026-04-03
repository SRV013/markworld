Objetivo: iniciar un proyecto frontend completo siguiendo la arquitectura definida.

Stack obligatorio:

* React + TypeScript
* CSS Modules
* Zustand para estado global
* Axios para requests
* Design system con variables CSS
* Soporte light/dark

Proceso que debes ejecutar automáticamente:

1. Crear proyecto base con Vite (React + TypeScript)

2. Instalar dependencias necesarias

* axios
* zustand

3. Crear estructura de carpetas:

src/
app
pages
components
hooks
services
store
styles
types

4. Crear design system inicial:

src/styles/theme.css

Debe incluir:

* 10 tonos de color primary
* 10 tonos secondary
* background
* text
* border
* hover

También definir:

* tamaños de fuente
* padding
* spacing scale

Incluir soporte dark/light mode.

5. Crear archivo base App.tsx que cargue el theme.

6. Crear ejemplo mínimo de:

* hook
* componente
* store zustand
* servicio axios

7. Explicar SOLO los pasos de instalación y estructura final.

Reglas de arquitectura:

* Componentes = UI
* Hooks = lógica
* Axios solo en servicios o hooks
* Zustand solo para estado global
* CSS Modules obligatorio

Pensar como arquitecto frontend.
