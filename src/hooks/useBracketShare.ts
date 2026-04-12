import { useRef, useState } from 'react'
import type { RefObject } from 'react'

interface UseBracketShareReturn {
  shareRef: RefObject<HTMLDivElement>
  sharing: boolean
  share: (uid: string) => Promise<void>
}

export function useBracketShare(): UseBracketShareReturn {
  const shareRef = useRef<HTMLDivElement>(null)
  const [sharing, setSharing] = useState(false)

  const share = async (uid: string) => {
    if (!shareRef.current || sharing) return
    setSharing(true)

    try {
      const { toPng } = await import('html-to-image')
      const el = shareRef.current
      el.setAttribute('data-capturing', '')
      let dataUrl: string
      try {
        dataUrl = await toPng(el, {
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          style: { overflow: 'visible' },
          filter: (node: Element) => !(node as HTMLElement).hasAttribute?.('data-no-capture'),
        })
      } finally {
        el.removeAttribute('data-capturing')
      }

      // dataUrl → Blob
      const res = await fetch(dataUrl)
      const blob = await res.blob()

      const fileName = 'mi-fixture-wc2026.png'
      const file = new File([blob], fileName, { type: 'image/png' })
      const verifyUrl = `${window.location.origin}/ver/${uid}`
      const text = `🏆 Mi pronóstico del Mundial 2026\n¡Mirá el cuadro completo acá! ${verifyUrl}`

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text })
      } else {
        // Fallback: descarga directa en desktop
        const objectUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = objectUrl
        a.download = fileName
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
