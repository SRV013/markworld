import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// picks[groupId] = ['1°TeamName', '2°TeamName', '3°TeamName']
type Picks = Record<string, string[]>

interface PronosticoState {
  phase: 'intro' | 'picking' | 'thirdPlace' | 'bracket'
  currentGroupIndex: number
  picks: Picks
  thirdPlaceRanking: string[]   // nombres ordenados de mejor a peor 3°

  start: () => void
  toggleTeam: (groupId: string, teamName: string) => void
  next: (totalGroups: number) => void
  prev: () => void
  toggleThirdRank: (teamName: string) => void
  startThirdPhase: () => void
  backToGroups: () => void
  startBracket: () => void
  loadSaved: (picks: Picks, thirdPlaceRanking: string[]) => void
  reset: () => void
}

export const usePronosticoStore = create<PronosticoState>()(
  persist(
    (set) => ({
      phase: 'intro',
      currentGroupIndex: 0,
      picks: {},
      thirdPlaceRanking: [],

      start: () => set({ phase: 'picking', currentGroupIndex: 0 }),

      toggleTeam: (groupId, teamName) =>
        set((state) => {
          const current = state.picks[groupId] ?? []
          const idx = current.indexOf(teamName)

          if (idx !== -1) {
            return { picks: { ...state.picks, [groupId]: current.filter((_, i) => i !== idx) } }
          }

          if (current.length >= 3) return state

          return { picks: { ...state.picks, [groupId]: [...current, teamName] } }
        }),

      next: (totalGroups) =>
        set((state) => ({
          currentGroupIndex: Math.min(state.currentGroupIndex + 1, totalGroups - 1),
        })),

      prev: () =>
        set((state) => ({
          currentGroupIndex: Math.max(state.currentGroupIndex - 1, 0),
        })),

      toggleThirdRank: (teamName) =>
        set((state) => {
          const idx = state.thirdPlaceRanking.indexOf(teamName)
          if (idx !== -1) {
            // ya estaba → lo saca y los siguientes suben un puesto
            return { thirdPlaceRanking: state.thirdPlaceRanking.filter((_, i) => i !== idx) }
          }
          return { thirdPlaceRanking: [...state.thirdPlaceRanking, teamName] }
        }),

      startThirdPhase: () => set({ phase: 'thirdPlace', thirdPlaceRanking: [] }),

      backToGroups: () => set({ phase: 'picking', currentGroupIndex: 11 }),

      startBracket: () => set({ phase: 'bracket' }),

      loadSaved: (picks: Picks, thirdPlaceRanking: string[]) =>
        set({ phase: 'bracket', picks, thirdPlaceRanking }),

      reset: () => set({ phase: 'intro', currentGroupIndex: 0, picks: {}, thirdPlaceRanking: [] }),
    }),
    { name: 'pronostico-wc2026' }
  )
)
