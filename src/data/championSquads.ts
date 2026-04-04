export interface Player {
  name: string
  position: 'GK' | 'DF' | 'MF' | 'FW'
  number: number
}

export interface ChampionSquad {
  year: number
  team: string
  tournament: string
  coach: string
  players: Player[]
}

export const CHAMPION_SQUADS: ChampionSquad[] = [
  {
    year: 2022,
    team: 'Argentina',
    tournament: 'FIFA World Cup Qatar 2022',
    coach: 'Lionel Scaloni',
    players: [
      { name: 'Franco Armani',      position: 'GK', number: 1  },
      { name: 'Geronimo Rulli',     position: 'GK', number: 12 },
      { name: 'Emiliano Martinez',  position: 'GK', number: 23 },

      { name: 'Juan Foyth',         position: 'DF', number: 2  },
      { name: 'Nicolas Tagliafico', position: 'DF', number: 3  },
      { name: 'Gonzalo Montiel',    position: 'DF', number: 4  },
      { name: 'German Pezzella',    position: 'DF', number: 6  },
      { name: 'Cristian Romero',    position: 'DF', number: 13 },
      { name: 'Nicolas Otamendi',   position: 'DF', number: 19 },
      { name: 'Lisandro Martinez',  position: 'DF', number: 25 },
      { name: 'Nahuel Molina',      position: 'DF', number: 26 },

      { name: 'Leandro Paredes',    position: 'MF', number: 5  },
      { name: 'Rodrigo De Paul',    position: 'MF', number: 7  },
      { name: 'Marcos Acuna',       position: 'MF', number: 8  },
      { name: 'Exequiel Palacios',  position: 'MF', number: 14 },
      { name: 'Thiago Almada',      position: 'MF', number: 16 },
      { name: 'Alejandro Gomez',    position: 'MF', number: 17 },
      { name: 'Guido Rodriguez',    position: 'MF', number: 18 },
      { name: 'Alexis Mac Allister', position: 'MF', number: 20 },
      { name: 'Enzo Fernandez',     position: 'MF', number: 24 },

      { name: 'Julian Alvarez',     position: 'FW', number: 9  },
      { name: 'Lionel Messi',       position: 'FW', number: 10 },
      { name: 'Angel Di Maria',     position: 'FW', number: 11 },
      { name: 'Angel Correa',       position: 'FW', number: 15 },
      { name: 'Paulo Dybala',       position: 'FW', number: 21 },
      { name: 'Lautaro Martinez',   position: 'FW', number: 22 },
    ],
  },
]

/** Lookup por año */
export const SQUADS_BY_YEAR: Record<number, ChampionSquad> = Object.fromEntries(
  CHAMPION_SQUADS.map((s) => [s.year, s])
)
