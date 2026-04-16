import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ShareState {
  shareId: string
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
    () => ({ shareId: generateId() }),
    { name: 'share-wc2026' }
  )
)
