import { create } from 'zustand'
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, provider, db } from '@/lib/firebase'
import type { BracketMatch } from '@/types/bracket'

export interface SavedFixture {
  uid: string
  displayName: string | null
  photoURL: string | null
  champion: string
  picks: Record<string, string[]>
  thirdPlaceRanking: string[]
  matches: BracketMatch[]
}

interface AuthState {
  user: User | null
  loading: boolean
  savedFixture: SavedFixture | null
  fixtureLoading: boolean
  fixtureLoaded: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  refreshFixture: (uid: string) => Promise<void>
  markFixtureLoaded: () => void
  resetFixtureLoaded: () => void
}

export const useAuthStore = create<AuthState>((set) => {
  const fetchFixture = async (uid: string) => {
    set({ fixtureLoading: true })
    try {
      const snap = await getDoc(doc(db, 'pronosticos', uid))
      set({ savedFixture: snap.exists() ? (snap.data() as SavedFixture) : null })
    } catch {
      set({ savedFixture: null })
    } finally {
      set({ fixtureLoading: false })
    }
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      set({ user, loading: false })
      fetchFixture(user.uid)
    } else {
      set({ user: null, loading: false, savedFixture: null })
    }
  })

  return {
    user: null,
    loading: true,
    savedFixture: null,
    fixtureLoading: false,
    fixtureLoaded: false,

    signInWithGoogle: async () => {
      await signInWithPopup(auth, provider)
    },

    signOut: async () => {
      await firebaseSignOut(auth)
      set({ savedFixture: null, fixtureLoaded: false })
    },

    refreshFixture: async (uid: string) => {
      await fetchFixture(uid)
    },

    markFixtureLoaded: () => set({ fixtureLoaded: true }),
    resetFixtureLoaded: () => set({ fixtureLoaded: false }),
  }
})
