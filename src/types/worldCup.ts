export type Confederation = 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC'

export interface Team {
  name: string
  flag: string
  confederation: Confederation
}

export interface Group {
  id: string
  teams: Team[]
}
