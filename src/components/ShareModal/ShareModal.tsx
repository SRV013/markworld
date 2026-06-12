import { useState, useRef, useEffect } from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuthStore } from '@/store/authStore'
import { useShareStore } from '@/store/shareStore'
import { GROUPS } from '@/data/worldCup2026'
import type { BracketMatch } from '@/types/bracket'
import styles from './ShareModal.module.css'

type Picks = Record<string, string[]>

const flagIconMap = new Map<string, string>()
GROUPS.forEach(g => g.teams.forEach(t => flagIconMap.set(t.name, t.flagIcon)))

export interface ShareModalProps {
  champion: string
  matches: BracketMatch[]
  picks: Picks
  thirdPlaceRanking: string[]
  initialSavedId?: string
  onClose: () => void
}

type Phase = 'form' | 'saving' | 'done'

export function ShareModal({
  champion, matches, picks, thirdPlaceRanking, initialSavedId, onClose,
}: ShareModalProps) {
  const { user, signInWithGoogle, refreshFixture } = useAuthStore()
  const { shareId } = useShareStore()
  const [phase, setPhase] = useState<Phase>(initialSavedId ? 'done' : 'form')
  const [savedId, setSavedId] = useState<string | null>(initialSavedId ?? null)
  const [customName, setCustomName] = useState('')
  const [copied, setCopied] = useState(false)
  const [pendingLoginSave, setPendingLoginSave] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-guardar tras login con Google
  useEffect(() => {
    if (!pendingLoginSave || !user || phase !== 'form') return
    setPendingLoginSave(false)
    doSave(user.uid, user.displayName, user.uid)
  }, [pendingLoginSave, user, phase])

  const doSave = async (docId: string, displayName: string | null, uid: string | null) => {
    setPhase('saving')
    try {
      await setDoc(doc(db, 'pronosticos', docId), {
        ...(uid ? { uid } : { shareId: docId }),
        displayName,
        photoURL: uid ? (user?.photoURL ?? null) : null,
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
      if (uid) await refreshFixture(uid)
      setSavedId(docId)
      setPhase('done')
      window.history.replaceState(null, '', `/ver/${docId}`)
    } catch (e) {
      console.error('Error guardando:', e)
      setPhase('form')
    }
  }

  const handleSaveLoggedIn = () => {
    if (!user || phase !== 'form') return
    doSave(user.uid, user.displayName, user.uid)
  }

  const handleSaveAnonymous = () => {
    if (phase !== 'form') return
    const name = customName.trim()
    if (!name) { inputRef.current?.focus(); return }
    doSave(shareId, name, null)
  }

  const handleGoogleLogin = () => {
    setPendingLoginSave(true)
    signInWithGoogle()
  }

  const shareUrl = savedId ? `${window.location.origin}/ver/${savedId}` : ''

  const handleShare = async () => {
    if (!shareUrl) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pronóstico del Mundial 2026',
          text: `🏆 ${champion} campeón — mirá mi pronóstico`,
          url: shareUrl,
        })
      } catch { /* cancelado */ }
    }
    handleCopy()
  }

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(shareUrl) } catch { /* ignore */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const flagIcon = flagIconMap.get(champion)

  return (
    <div className={styles.overlay} onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.modal} role="dialog" aria-modal="true">

        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Campeón */}
        <div className={styles.championHeader}>
          {flagIcon && <span className={`fi fi-${flagIcon} ${styles.flag}`} />}
          <div>
            <p className={styles.championLabel}>
              {phase === 'done' ? '¡Pronóstico guardado!' : '¡Pronóstico completo!'}
            </p>
            <p className={styles.championName}>{champion} 🏆</p>
          </div>
        </div>

        {/* Guardando */}
        {phase === 'saving' && (
          <div className={styles.saving}>
            <div className={styles.spinner} />
            <p className={styles.savingText}>Guardando datos…</p>
          </div>
        )}

        {/* Listo — mostrar link */}
        {phase === 'done' && (
          <div className={styles.done}>
            <p className={styles.urlLabel}>Link de tu pronóstico:</p>
            <div className={styles.urlBox}>{shareUrl}</div>
            <div className={styles.shareRow}>
              <button className={styles.shareBtn} onClick={handleShare}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Compartir
              </button>
              <button className={`${styles.copyBtn}${copied ? ` ${styles.copiedBtn}` : ''}`} onClick={handleCopy}>
                {copied ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Copiar URL
                  </>
                )}
              </button>
            </div>
            <button className={styles.backBtn} onClick={onClose}>
              Volver al bracket
            </button>
          </div>
        )}

        {/* Formulario — logueado */}
        {phase === 'form' && user && (
          <div className={styles.form}>
            <p className={styles.formText}>
              Se guardará como <strong>{user.displayName}</strong>
            </p>
            <button className={styles.primaryBtn} onClick={handleSaveLoggedIn}>
              Guardar
            </button>
          </div>
        )}

        {/* Formulario — anónimo */}
        {phase === 'form' && !user && (
          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="share-name">Tu nombre</label>
              <input
                id="share-name"
                ref={inputRef}
                className={styles.input}
                type="text"
                placeholder="Ej: Juan"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveAnonymous()}
                maxLength={40}
                autoFocus
              />
            </div>
            <button
              className={styles.primaryBtn}
              onClick={handleSaveAnonymous}
              disabled={!customName.trim()}
            >
              Guardar
            </button>
            <div className={styles.divider}><span>o asocialo a tu cuenta</span></div>
            <button className={styles.googleBtn} onClick={handleGoogleLogin}>
              <svg className={styles.googleIcon} viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Iniciar sesión con Google
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
