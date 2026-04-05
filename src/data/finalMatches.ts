export interface FinalGoal {
  player: string
  minute: number
  pen?: boolean
  og?: boolean
}

export interface FinalMatch {
  year: number
  scoreChampion: number
  scoreRunnerUp: number
  extraTime?: boolean
  penChampion?: number
  penRunnerUp?: number
  goalsChampion: FinalGoal[]
  goalsRunnerUp: FinalGoal[]
}

export const FINAL_MATCHES: Record<number, FinalMatch> = {
  1930: {
    year: 1930,
    scoreChampion: 4, scoreRunnerUp: 2,
    goalsChampion: [
      { player: 'Dorado',   minute: 12 },
      { player: 'Cea',      minute: 57 },
      { player: 'Iriarte',  minute: 68 },
      { player: 'Castro',   minute: 89 },
    ],
    goalsRunnerUp: [
      { player: 'Peucelle', minute: 20 },
      { player: 'Stábile',  minute: 37 },
    ],
  },
  1934: {
    year: 1934,
    scoreChampion: 2, scoreRunnerUp: 1, extraTime: true,
    goalsChampion: [
      { player: 'Orsi',     minute: 81 },
      { player: 'Schiavio', minute: 95 },
    ],
    goalsRunnerUp: [
      { player: 'Puč',      minute: 76 },
    ],
  },
  1938: {
    year: 1938,
    scoreChampion: 4, scoreRunnerUp: 2,
    goalsChampion: [
      { player: 'Colaussi', minute: 6  },
      { player: 'Piola',    minute: 16 },
      { player: 'Colaussi', minute: 35 },
      { player: 'Piola',    minute: 82 },
    ],
    goalsRunnerUp: [
      { player: 'Titkos',   minute: 7  },
      { player: 'Sárosi',   minute: 70 },
    ],
  },
  1950: {
    year: 1950,
    scoreChampion: 2, scoreRunnerUp: 1,
    goalsChampion: [
      { player: 'Schiaffino', minute: 66 },
      { player: 'Ghiggia',    minute: 79 },
    ],
    goalsRunnerUp: [
      { player: 'Friaça',     minute: 47 },
    ],
  },
  1954: {
    year: 1954,
    scoreChampion: 3, scoreRunnerUp: 2,
    goalsChampion: [
      { player: 'Morlock',  minute: 10 },
      { player: 'Rahn',     minute: 18 },
      { player: 'Rahn',     minute: 84 },
    ],
    goalsRunnerUp: [
      { player: 'Puskás',   minute: 6  },
      { player: 'Czibor',   minute: 8  },
    ],
  },
  1958: {
    year: 1958,
    scoreChampion: 5, scoreRunnerUp: 2,
    goalsChampion: [
      { player: 'Vavá',    minute: 9  },
      { player: 'Vavá',    minute: 32 },
      { player: 'Pelé',    minute: 55 },
      { player: 'Zagallo', minute: 68 },
      { player: 'Pelé',    minute: 90 },
    ],
    goalsRunnerUp: [
      { player: 'Liedholm',   minute: 4  },
      { player: 'Simonsson',  minute: 80 },
    ],
  },
  1962: {
    year: 1962,
    scoreChampion: 3, scoreRunnerUp: 1,
    goalsChampion: [
      { player: 'Amarildo', minute: 17 },
      { player: 'Zito',     minute: 69 },
      { player: 'Vavá',     minute: 78 },
    ],
    goalsRunnerUp: [
      { player: 'Masopust', minute: 15 },
    ],
  },
  1966: {
    year: 1966,
    scoreChampion: 4, scoreRunnerUp: 2, extraTime: true,
    goalsChampion: [
      { player: 'Hurst',  minute: 18  },
      { player: 'Peters', minute: 78  },
      { player: 'Hurst',  minute: 101 },
      { player: 'Hurst',  minute: 120 },
    ],
    goalsRunnerUp: [
      { player: 'Haller', minute: 12 },
      { player: 'Weber',  minute: 89 },
    ],
  },
  1970: {
    year: 1970,
    scoreChampion: 4, scoreRunnerUp: 1,
    goalsChampion: [
      { player: 'Pelé',          minute: 18 },
      { player: 'Gerson',        minute: 66 },
      { player: 'Jairzinho',     minute: 71 },
      { player: 'Carlos Alberto', minute: 86 },
    ],
    goalsRunnerUp: [
      { player: 'Boninsegna', minute: 37 },
    ],
  },
  1974: {
    year: 1974,
    scoreChampion: 2, scoreRunnerUp: 1,
    goalsChampion: [
      { player: 'Breitner', minute: 25, pen: true },
      { player: 'Müller',   minute: 43 },
    ],
    goalsRunnerUp: [
      { player: 'Neeskens', minute: 2, pen: true },
    ],
  },
  1978: {
    year: 1978,
    scoreChampion: 3, scoreRunnerUp: 1, extraTime: true,
    goalsChampion: [
      { player: 'Kempes',  minute: 38  },
      { player: 'Kempes',  minute: 104 },
      { player: 'Bertoni', minute: 114 },
    ],
    goalsRunnerUp: [
      { player: 'Nanninga', minute: 82 },
    ],
  },
  1982: {
    year: 1982,
    scoreChampion: 3, scoreRunnerUp: 1,
    goalsChampion: [
      { player: 'Rossi',     minute: 57 },
      { player: 'Tardelli',  minute: 69 },
      { player: 'Altobelli', minute: 81 },
    ],
    goalsRunnerUp: [
      { player: 'Breitner', minute: 83 },
    ],
  },
  1986: {
    year: 1986,
    scoreChampion: 3, scoreRunnerUp: 2,
    goalsChampion: [
      { player: 'Brown',       minute: 23 },
      { player: 'Valdano',     minute: 56 },
      { player: 'Burruchaga',  minute: 84 },
    ],
    goalsRunnerUp: [
      { player: 'Rummenigge', minute: 74 },
      { player: 'Völler',     minute: 80 },
    ],
  },
  1990: {
    year: 1990,
    scoreChampion: 1, scoreRunnerUp: 0,
    goalsChampion: [
      { player: 'Brehme', minute: 85, pen: true },
    ],
    goalsRunnerUp: [],
  },
  1994: {
    year: 1994,
    scoreChampion: 0, scoreRunnerUp: 0, extraTime: true,
    penChampion: 3, penRunnerUp: 2,
    goalsChampion: [],
    goalsRunnerUp: [],
  },
  1998: {
    year: 1998,
    scoreChampion: 3, scoreRunnerUp: 0,
    goalsChampion: [
      { player: 'Zidane', minute: 27 },
      { player: 'Zidane', minute: 45 },
      { player: 'Petit',  minute: 90 },
    ],
    goalsRunnerUp: [],
  },
  2002: {
    year: 2002,
    scoreChampion: 2, scoreRunnerUp: 0,
    goalsChampion: [
      { player: 'Ronaldo', minute: 67 },
      { player: 'Ronaldo', minute: 79 },
    ],
    goalsRunnerUp: [],
  },
  2006: {
    year: 2006,
    scoreChampion: 1, scoreRunnerUp: 1, extraTime: true,
    penChampion: 5, penRunnerUp: 3,
    goalsChampion: [
      { player: 'Materazzi', minute: 19 },
    ],
    goalsRunnerUp: [
      { player: 'Zidane', minute: 7, pen: true },
    ],
  },
  2010: {
    year: 2010,
    scoreChampion: 1, scoreRunnerUp: 0, extraTime: true,
    goalsChampion: [
      { player: 'Iniesta', minute: 116 },
    ],
    goalsRunnerUp: [],
  },
  2014: {
    year: 2014,
    scoreChampion: 1, scoreRunnerUp: 0, extraTime: true,
    goalsChampion: [
      { player: 'Götze', minute: 113 },
    ],
    goalsRunnerUp: [],
  },
  2018: {
    year: 2018,
    scoreChampion: 4, scoreRunnerUp: 2,
    goalsChampion: [
      { player: 'Mandžukić', minute: 18, og: true },
      { player: 'Griezmann', minute: 38, pen: true },
      { player: 'Pogba',     minute: 59 },
      { player: 'Mbappé',    minute: 65 },
    ],
    goalsRunnerUp: [
      { player: 'Perisić',   minute: 28 },
      { player: 'Mandžukić', minute: 69 },
    ],
  },
  2022: {
    year: 2022,
    scoreChampion: 3, scoreRunnerUp: 3, extraTime: true,
    penChampion: 4, penRunnerUp: 2,
    goalsChampion: [
      { player: 'Messi',    minute: 23,  pen: true },
      { player: 'Di María', minute: 36  },
      { player: 'Messi',    minute: 108, pen: true },
    ],
    goalsRunnerUp: [
      { player: 'Mbappé', minute: 80,  pen: true },
      { player: 'Mbappé', minute: 81  },
      { player: 'Mbappé', minute: 118, pen: true },
    ],
  },
}

export function getFinalSummary(match: FinalMatch, runnerUp: string): string {
  const { scoreChampion: sc, scoreRunnerUp: sr, extraTime, penChampion, penRunnerUp } = match

  let score = `${sc}-${sr}`
  if (penChampion !== undefined) score += ` (${penChampion}-${penRunnerUp} pen.)`
  else if (extraTime) score += ' a.e.t.'

  const allGoals = [
    ...match.goalsChampion.map(g => `${g.player} ${g.minute}'${g.pen ? ' (P)' : g.og ? ' (pg)' : ''}`),
  ]

  const goals = allGoals.join(', ')
  return `Final ${score} vs ${runnerUp}${goals ? ' · ' + goals : ''}`
}
