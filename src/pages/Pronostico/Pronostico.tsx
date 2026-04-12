import { useEffect, useRef, useState } from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { usePronosticoStore } from '@/store/pronosticoStore'
import { useBracketStore } from '@/store/bracketStore'
import { useAuthStore } from '@/store/authStore'
import { db } from '@/lib/firebase'
import { GroupPicker } from '@/components/GroupPicker/GroupPicker'
import { ThirdPlacePicker } from '@/components/ThirdPlacePicker/ThirdPlacePicker'
import type { ThirdEntry } from '@/components/ThirdPlacePicker/ThirdPlacePicker'
import { Bracket } from '@/components/Bracket/Bracket'
import { useBracketShare } from '@/hooks/useBracketShare'
import { GROUPS } from '@/data/worldCup2026'
import { buildInitialBracket } from '@/utils/buildBracket'
import styles from './Pronostico.module.css'

// Lookup bandera por nombre de equipo
const flagIconMap = new Map<string, string>()
GROUPS.forEach((g) => g.teams.forEach((t) => flagIconMap.set(t.name, t.flagIcon)))

function ShareFixtureBtn({ uid }: { uid: string }) {
  const [copied, setCopied] = useState(false)
  const handleShare = () => {
    const url = `${window.location.origin}/ver/${uid}`
    if (navigator.share) {
      navigator.share({ title: 'Mi pronóstico Mundial 2026', url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url).catch(() => {})
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }
  return (
    <button className={`${styles.saveBtn} ${copied ? styles.saveBtnDone : ''}`} onClick={handleShare}>
      {copied ? '✓ Link copiado' : '🔗 Compartir fixture'}
    </button>
  )
}

export function Pronostico() {
  const {
    phase, picks, thirdPlaceRanking,
    start, toggleTeam,
    toggleThirdRank, startThirdPhase, backToGroups, startBracket, reset, loadSaved,
  } = usePronosticoStore()
  const { initializeBracket, reset: resetBracket, matches } = useBracketStore()
  const { user, loading: authLoading, savedFixture, fixtureLoading, fixtureLoaded, signInWithGoogle, signOut, refreshFixture, markFixtureLoaded, resetFixtureLoaded } = useAuthStore()
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const { shareRef, sharing, share } = useBracketShare()

  // Cargar fixture desde Firestore al loguear (solo una vez por sesión)
  useEffect(() => {
    if (!user || !savedFixture || fixtureLoaded) return
    markFixtureLoaded()
    initializeBracket(savedFixture.matches)
    loadSaved(savedFixture.picks, savedFixture.thirdPlaceRanking)
  }, [user, savedFixture, fixtureLoaded])

  // Detectar cuándo se elige el campeón para abrir el modal
  const champion = matches.find((m) => m.round === 'F')?.winner ?? null
  const prevChampionRef = useRef<string | null>(null)
  useEffect(() => {
    if (champion && champion !== prevChampionRef.current) {
      if (user) refreshFixture(user.uid)
      setShowSaveModal(true)
      setSaved(false)
    }
    prevChampionRef.current = champion
  }, [champion])

  // ── Intro ────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className={styles.page}>
        <div className={styles.intro}>
          <div className={styles.trophy}>🏆</div>
          <h1 className={styles.introTitle}>Tu pronóstico</h1>
          <p className={styles.introText}>
            Elegí el orden de clasificación de los <strong>12 grupos</strong> del
            Mundial 2026. Luego rankeá los mejores terceros y completá las{' '}
            <strong>fases eliminatorias</strong> hasta elegir tu campeón.
          </p>
          <ul className={styles.rulesList}>
            <li>📋 12 grupos · 4 equipos cada uno</li>
            <li>🥇 Cliqueá los equipos en el orden que creés que clasifican</li>
            <li>🔢 Elegís cuáles son los 8 mejores terceros de los 12 grupos</li>
            <li>⚔️ Luego completás el cuadro eliminatorio hasta la Final</li>
            <li>💾 Tu progreso se guarda automáticamente</li>
          </ul>
          <button className={styles.startBtn} onClick={savedFixture ? startBracket : start}>
            {savedFixture ? 'Ver mi pronóstico →' : 'Comenzar pronóstico →'}
          </button>
        </div>
      </div>
    )
  }

  // ── Fase eliminatoria (bracket) ──────────────────────────────
  if (phase === 'bracket') {
    const handleReset = () => {
      reset()
      resetBracket()
      resetFixtureLoaded()
    }

    const handleSave = async () => {
      if (!user || !champion) return
      setSaving(true)
      try {
        await setDoc(doc(db, 'pronosticos', user.uid), {
          uid: user.uid,
          displayName: user.displayName ?? null,
          photoURL: user.photoURL ?? null,
          champion,
          picks,
          thirdPlaceRanking,
          matches: matches.map((m) => ({
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
        await refreshFixture(user.uid)
        setSaved(true)
        setTimeout(() => {
          setSaved(false)
          setShowSaveModal(false)
        }, 2000)
      } catch (e) {
        console.error('Error guardando fixture:', e)
      } finally {
        setSaving(false)
      }
    }

    return (
      <div className={styles.bracketPage}>
        <div className={styles.bracketPageHeader}>
          <div>
            <h1 className={styles.title}>Fase Eliminatoria</h1>
            <p className={styles.subtitle}>Copa del Mundo 2026 · Seleccioná el ganador de cada partido</p>
          </div>
          {champion && (
            <button
              className={styles.championBadge}
              onClick={() => {
                if (user) refreshFixture(user.uid)
                setShowSaveModal(true)
              }}
              title="Ver fixture guardado"
            >
              🏆 {champion}
            </button>
          )}
        </div>

        <Bracket
          ref={shareRef}
          locked={!!savedFixture}
          onShare={() => share(user?.uid ?? '')}
          onReset={handleReset}
          sharing={sharing}
        />

        {/* Modal guardar fixture */}
        {showSaveModal && champion && (
          <div className={styles.modalBackdrop} onClick={() => setShowSaveModal(false)}>
            <div className={styles.saveModal} onClick={(e) => e.stopPropagation()}>
              <button className={styles.modalClose} onClick={() => setShowSaveModal(false)}>✕</button>
              <div className={styles.saveModalTrophy}>🏆</div>
              <h2 className={styles.saveModalTitle}>¡Pronóstico completo!</h2>
              <div className={styles.saveModalChampion}>
                <span className={`fi fi-${flagIconMap.get(champion) ?? 'un'} ${styles.saveModalFlag}`} />
                {champion}
              </div>

              {authLoading || fixtureLoading ? (
                <p className={styles.saveModalHint}>Cargando…</p>
              ) : savedFixture ? (
                <>
                  <p className={styles.saveModalHint}>✓ Fixture guardado en la nube</p>
                  <ShareFixtureBtn uid={user!.uid} />
                </>
              ) : !user ? (
                <>
                  <p className={styles.saveModalHint}>
                    Iniciá sesión para guardar tu pronóstico en la nube
                  </p>
                  <button className={styles.googleBtn} onClick={signInWithGoogle}>
                    <svg className={styles.googleIcon} viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                    Iniciar sesión con Google
                  </button>
                </>
              ) : (
                <>
                  <div className={styles.userInfo}>
                    {user.photoURL && (
                      <img src={user.photoURL} className={styles.userAvatar} alt={user.displayName ?? ''} referrerPolicy="no-referrer" />
                    )}
                    <span className={styles.userName}>{user.displayName}</span>
                    <button className={styles.signOutBtn} onClick={signOut}>Salir</button>
                  </div>
                  <button
                    className={`${styles.saveBtn} ${saved ? styles.saveBtnDone : ''}`}
                    onClick={handleSave}
                    disabled={saving || saved}
                  >
                    {saved ? '✓ Guardado en la nube' : saving ? 'Guardando…' : '💾 Guardar fixture'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Fase de clasificación de terceros ────────────────────────
  if (phase === 'thirdPlace') {
    const thirds: ThirdEntry[] = GROUPS.flatMap((g) => {
      const thirdName = picks[g.id]?.[2]
      if (!thirdName) return []
      const team = g.teams.find((t) => t.name === thirdName)
      if (!team) return []
      return [{ groupId: g.id, team }]
    })

    const top8 = thirdPlaceRanking.slice(0, 8)
    const canGoToBracket = top8.length === 8

    const handleStartBracket = () => {
      initializeBracket(buildInitialBracket(picks, top8))
      startBracket()
    }

    return (
      <div className={styles.page}>
        <div className={styles.thirdHeader}>
          <h2 className={styles.thirdTitle}>Mejores Terceros</h2>
          <p className={styles.thirdSubtitle}>
            Hay <strong>12 terceros</strong> — los <strong>8 mejores</strong> clasifican a 16vos.
            Cliqueá en orden del mejor al peor.
          </p>
        </div>

        <div className={styles.pickerWrap}>
          <ThirdPlacePicker
            thirds={thirds}
            ranking={thirdPlaceRanking}
            onToggle={toggleThirdRank}
          />
        </div>

        <div className={styles.nav}>
          <button className={styles.navBtn} onClick={backToGroups}>
            ← Volver a grupos
          </button>

          <button
            className={styles.finishBtn}
            onClick={handleStartBracket}
            disabled={!canGoToBracket}
          >
            Ir al cuadro eliminatorio ⚔️
          </button>
        </div>

        <button className={styles.resetBtn} onClick={reset}>
          Reiniciar pronóstico
        </button>
      </div>
    )
  }

  // ── Fase de grupos (picking) ─────────────────────────────────
  const allGroupsDone = GROUPS.every((g) => (picks[g.id] ?? []).length === 3)
  const completedCount = GROUPS.filter((g) => (picks[g.id] ?? []).length === 3).length

  return (
    <div className={styles.pickingPage}>
      <div className={styles.pickingHeader}>
        <h2 className={styles.title}>Fase de Grupos</h2>
        <p className={styles.subtitle}>
          Elegí 1°, 2° y 3° clasificado de cada grupo · {completedCount} de {GROUPS.length} completados
        </p>

        {/* Indicador de progreso por grupo */}
        <div className={styles.groupIndicator}>
          {GROUPS.map((g) => {
            const done = (picks[g.id] ?? []).length === 3
            return (
              <div key={g.id} className={styles.groupIndicatorItem}>
                <span className={`${styles.groupIndicatorLetter} ${done ? styles.groupIndicatorDone : ''}`}>
                  {g.id}
                </span>
                <span className={`${styles.groupIndicatorBar} ${done ? styles.groupIndicatorBarDone : ''}`} />
              </div>
            )
          })}
        </div>
      </div>

      <div className={styles.groupsGrid}>
        {GROUPS.map((g) => (
          <GroupPicker
            key={g.id}
            group={g}
            selected={picks[g.id] ?? []}
            onToggle={(teamName) => toggleTeam(g.id, teamName)}
          />
        ))}
      </div>

      <div className={styles.pickingFooter}>
        {allGroupsDone && (
          <button className={styles.finishBtn} onClick={startThirdPhase}>
            Rankear terceros →
          </button>
        )}
        <button className={styles.resetBtn} onClick={reset}>
          Reiniciar pronóstico
        </button>
      </div>
    </div>
  )
}
