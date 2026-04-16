import { useRef, useState } from 'react'
import type { RefObject } from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { BracketMatch } from '@/types/bracket'

// NOTA: las reglas de Firestore deben permitir escritura anónima en "pronosticos":
//   allow create: if request.auth == null;
//   allow update: if request.auth == null && resource.data.shareId == docId;

type Picks = Record<string, string[]>

export interface ShareData {
  shareId: string
  champion: string
  matches: BracketMatch[]
  picks: Picks
  thirdPlaceRanking: string[]
}

interface UseBracketShareReturn {
  shareRef: RefObject<HTMLDivElement>
  sharing: boolean
  share: (data: ShareData) => Promise<void>
}

/** Cropea una dataUrl a 9:16 centrado horizontalmente */
async function cropTo916(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const cropH = img.height
      const cropW = Math.round(cropH * 9 / 16)
      const cropX = Math.round((img.width - cropW) / 2)

      const canvas = document.createElement('canvas')
      canvas.width  = cropW
      canvas.height = cropH

      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, cropX, 0, cropW, cropH, 0, 0, cropW, cropH)
      resolve(canvas.toDataURL('image/png'))
    }
    img.src = dataUrl
  })
}

export function useBracketShare(): UseBracketShareReturn {
  const shareRef = useRef<HTMLDivElement>(null)
  const [sharing, setSharing] = useState(false)

  const share = async (data: ShareData) => {
    if (!shareRef.current || sharing) return
    setSharing(true)

    try {
      const { shareId, champion, matches, picks, thirdPlaceRanking } = data

      // 1. Guardar en Firestore (anónimo o con cuenta)
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

      // 2. Capturar el bracket completo respetando el tema actual
      const { toPng } = await import('html-to-image')
      const bgColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-bg').trim() || '#ffffff'

      const fullDataUrl = await toPng(shareRef.current, {
        pixelRatio: 2,
        backgroundColor: bgColor,
        style: { overflow: 'visible' },
        filter: (node: Element) => !(node as HTMLElement).hasAttribute?.('data-no-capture'),
      })

      // 3. Cropear a 9:16 centrado en el Final (que está en el centro horizontal)
      const croppedDataUrl = await cropTo916(fullDataUrl)

      // 4. Convertir a File y compartir
      const res  = await fetch(croppedDataUrl)
      const blob = await res.blob()
      const file = new File([blob], 'mi-pronostico-wc2026.png', { type: 'image/png' })

      const shareUrl = `${window.location.origin}/ver/${shareId}`
      const text = `🏆 Mi pronóstico del Mundial 2026 — ${champion} campeón\n${shareUrl}`

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text })
      } else {
        const objectUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = objectUrl
        a.download = 'mi-pronostico-wc2026.png'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(objectUrl)
      }
    } finally {
      setSharing(false)
    }
  }

  return { shareRef, sharing, share }
}
