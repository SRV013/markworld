import { useState } from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { BracketMatch } from '@/types/bracket'

type Picks = Record<string, string[]>

export interface ShareOptions {
  shareId: string
  champion: string
  saveData?: {
    matches: BracketMatch[]
    picks: Picks
    thirdPlaceRanking: string[]
  }
}

interface UseBracketShareReturn {
  sharing: boolean
  copied: boolean
  share: (opts: ShareOptions) => Promise<void>
}

export function useBracketShare(): UseBracketShareReturn {
  const [sharing, setSharing] = useState(false)
  const [copied, setCopied] = useState(false)

  const share = async ({ shareId, champion, saveData }: ShareOptions) => {
    if (sharing) return
    setSharing(true)
    try {
      // Solo guarda si los datos aún no están en Firestore (usuario anónimo)
      if (saveData) {
        const { matches, picks, thirdPlaceRanking } = saveData
        await setDoc(doc(db, 'pronosticos', shareId), {
          shareId,
          displayName: null,
          photoURL: null,
          champion,
          picks,
          thirdPlaceRanking,
          matches: matches.map(m => ({
            id: m.id,
            round: m.round,
            seedLabel: m.seedLabel ?? '',
            teamA: m.teamA ?? null,
            teamB: m.teamB ?? null,
            winner: m.winner ?? null,
            nextMatchId: m.nextMatchId ?? null,
            nextSlot: m.nextSlot ?? null,
          })),
          savedAt: serverTimestamp(),
        })
      }

      const shareUrl = `${window.location.origin}/ver/${shareId}`
      const title = 'Pronóstico del Mundial 2026'
      const text = `🏆 ${champion} campeón — mirá mi pronóstico`

      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)
      }
    } finally {
      setSharing(false)
    }
  }

  return { sharing, share, copied }
}
