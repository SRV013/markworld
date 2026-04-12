export type Round = 'R32' | 'R16' | 'QF' | 'SF' | 'F' | '3P'

export const ROUNDS: Round[] = ['R32', 'R16', 'QF', 'SF', 'F', '3P']

export const ROUND_LABELS: Record<Round, string> = {
  R32: '16avos',
  R16: 'Octavos',
  QF:  'Cuartos',
  SF:  'Semis',
  F:   'Final',
  '3P': '3er Puesto',
}

export const ROUND_MATCH_COUNT: Record<Round, number> = {
  R32: 16,
  R16: 8,
  QF:  4,
  SF:  2,
  F:   1,
  '3P': 1,
}

export interface BracketMatch {
  id: string
  round: Round
  seedLabel: string
  teamA: string | null
  teamB: string | null
  winner: string | null
  nextMatchId: string | null
  nextSlot: 'A' | 'B'
}
