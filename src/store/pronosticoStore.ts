import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// picks[groupId] = ['1°TeamName', '2°TeamName', '3°TeamName']
type Picks = Record<string, string[]>

interface PronosticoState {
  phase: 'intro' | 'picking'
  currentGroupIndex: number
  picks: Picks
  start: () => void
  toggleTeam: (groupId: string, teamName: string) => void
  next: (totalGroups: number) => void
  prev: () => void
  reset: () => void
}

export const usePronosticoStore = create<PronosticoState>()(
  persist(
    (set) => ({
      phase: 'intro',
      currentGroupIndex: 0,
      picks: {},

      start: () => set({ phase: 'picking', currentGroupIndex: 0 }),

      toggleTeam: (groupId, teamName) =>
        set((state) => {
          const current = state.picks[groupId] ?? []
          const idx = current.indexOf(teamName)

          if (idx !== -1) {
            // ya estaba → lo saca y reorganiza
            return { picks: { ...state.picks, [groupId]: current.filter((_, i) => i !== idx) } }
          }

          if (current.length >= 3) return state // ya hay 3, no hace nada

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

      reset: () => set({ phase: 'intro', currentGroupIndex: 0, picks: {} }),
    }),
    { name: 'pronostico-wc2026' }
  )
)
