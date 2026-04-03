import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BracketMatch } from '../types/bracket'

interface BracketState {
  matches: BracketMatch[]
  initializeBracket: (matches: BracketMatch[]) => void
  pickWinner: (matchId: string, winner: string) => void
  reset: () => void
}

/**
 * Propaga el cambio de equipo en un slot hacia adelante en el cuadro.
 * Si el equipo anterior era el ganador del partido, limpia el ganador
 * y sigue propagando recursivamente.
 */
function propagate(
  matches: BracketMatch[],
  matchId: string | null,
  slot: 'A' | 'B',
  newTeam: string | null
): BracketMatch[] {
  if (!matchId) return matches

  const result = [...matches]
  const idx = result.findIndex((m) => m.id === matchId)
  if (idx === -1) return result

  const match = { ...result[idx] }
  const prevTeam = slot === 'A' ? match.teamA : match.teamB

  if (prevTeam === newTeam) return result // sin cambio

  if (slot === 'A') match.teamA = newTeam
  else match.teamB = newTeam

  // Si el equipo que cambia era el ganador → limpiar y propagar
  if (match.winner !== null && match.winner === prevTeam) {
    match.winner = null
    result[idx] = match
    return propagate(result, match.nextMatchId, match.nextSlot, null)
  }

  result[idx] = match
  return result
}

export const useBracketStore = create<BracketState>()(
  persist(
    (set) => ({
      matches: [],

      initializeBracket: (matches) => set({ matches }),

      pickWinner: (matchId, clickedTeam) =>
        set((state) => {
          let matches = [...state.matches]
          const idx = matches.findIndex((m) => m.id === matchId)
          if (idx === -1) return state

          const match = { ...matches[idx] }
          const isPlayable = !!match.teamA && !!match.teamB
          if (!isPlayable) return state

          // Toggle: si ya es ganador, lo deselecciona
          if (match.winner === clickedTeam) {
            match.winner = null
            matches[idx] = match
            matches = propagate(matches, match.nextMatchId, match.nextSlot, null)
            // Restaurar nuestro partido (propagate solo toca partidos downstream)
            matches[idx] = match
            return { matches }
          }

          match.winner = clickedTeam
          matches[idx] = match
          matches = propagate(matches, match.nextMatchId, match.nextSlot, clickedTeam)
          matches[idx] = match
          return { matches }
        }),

      reset: () => set({ matches: [] }),
    }),
    { name: 'bracket-wc2026' }
  )
)
