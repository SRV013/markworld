import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ShareState {
  shareId: string
  anonymouslySaved: boolean
  savedName: string | null
  savedAt: string | null
  setAnonymouslySaved: (v: boolean) => void
  setSavedMeta: (name: string | null, date: string) => void
}

function generateId(): string {
  try {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 10)
  } catch {
    return Math.random().toString(36).slice(2, 12)
  }
}

export const useShareStore = create<ShareState>()(
  persist(
    (set) => ({
      shareId: generateId(),
      anonymouslySaved: false,
      savedName: null,
      savedAt: null,
      setAnonymouslySaved: (v: boolean) => set({ anonymouslySaved: v }),
      setSavedMeta: (name: string | null, date: string) => set({ savedName: name, savedAt: date }),
    }),
    {
      name: 'share-wc2026',
      partialize: (state) => ({
        shareId: state.shareId,
        anonymouslySaved: state.anonymouslySaved,
        savedName: state.savedName,
        savedAt: state.savedAt,
      }),
    }
  )
)
