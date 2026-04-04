export type Confederation = 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC'

export interface Country {
  code: string           // ISO 3166-1 alpha-2  (ej: "MX", "GB-ENG")
  name: string           // Nombre del país en español
  flag: string           // Emoji de bandera
  flagIcon: string       // Código para la librería flag-icons (ej: "mx", "gb-eng")
  confederation: Confederation
}

// En el contexto del torneo, Team es un Country
export type Team = Country

export interface Group {
  id: string       // 'A' … 'L'
  teams: Team[]    // 4 equipos
}
