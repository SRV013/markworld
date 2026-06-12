import { useEffect, useRef, useState } from 'react'
import { usePronosticoStore } from '@/store/pronosticoStore'
import { useBracketStore } from '@/store/bracketStore'
import { useAuthStore } from '@/store/authStore'
import { GroupPicker } from '@/components/GroupPicker/GroupPicker'
import { ThirdPlacePicker } from '@/components/ThirdPlacePicker/ThirdPlacePicker'
import type { ThirdEntry } from '@/components/ThirdPlacePicker/ThirdPlacePicker'
import { Bracket } from '@/components/Bracket/Bracket'
import { ShareModal } from '@/components/ShareModal/ShareModal'
import { useShareStore } from '@/store/shareStore'
import { GROUPS } from '@/data/worldCup2026'
import { buildInitialBracket } from '@/utils/buildBracket'
import styles from './Pronostico.module.css'


export function Pronostico() {
  const {
    phase, picks, thirdPlaceRanking,
    start, toggleTeam,
    toggleThirdRank, startThirdPhase, backToGroups, startBracket, reset, loadSaved,
  } = usePronosticoStore()
  const { initializeBracket, reset: resetBracket, matches } = useBracketStore()
  const { user, savedFixture, fixtureLoaded, refreshFixture, markFixtureLoaded, resetFixtureLoaded } = useAuthStore()
  const { shareId, anonymouslySaved, setAnonymouslySaved } = useShareStore()
  const [showModal, setShowModal] = useState(false)

  // Cargar fixture desde Firestore al loguear (solo una vez por sesión)
  useEffect(() => {
    if (!user || !savedFixture || fixtureLoaded) return
    markFixtureLoaded()
    initializeBracket(savedFixture.matches)
    loadSaved(savedFixture.picks, savedFixture.thirdPlaceRanking)
  }, [user, savedFixture, fixtureLoaded])

  const champion = matches.find((m) => m.round === 'F')?.winner ?? null
  const isInitialRender = useRef(true)
  const prevChampionRef = useRef<string | null>(null)
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      prevChampionRef.current = champion
      return
    }
    if (champion && champion !== prevChampionRef.current) {
      if (user) refreshFixture(user.uid)
      if (anonymouslySaved) setAnonymouslySaved(false)
      if (!savedFixture) setShowModal(true)
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
    // Si el bracket fue construido con datos incompletos (slots R32 vacíos), resetear
    const r32Matches = matches.filter(m => m.round === 'R32')
    const bracketIsValid = r32Matches.length === 16 && r32Matches.every(m => m.teamA !== null && m.teamB !== null)
    if (!bracketIsValid && !savedFixture) {
      reset()
      resetBracket()
      return null
    }

    const handleReset = () => {
      if (!window.confirm('¿Seguro que querés reiniciar el pronóstico? Se borrarán todos tus picks.')) return
      reset()
      resetBracket()
      resetFixtureLoaded()
      setAnonymouslySaved(false)
    }

    return (
      <div className={styles.bracketPage}>
        <div className={styles.bracketPageHeader}>
          <div>
            <h1 className={styles.title}>Fase Eliminatoria</h1>
            <p className={styles.subtitle}>Copa del Mundo 2026 · Seleccioná el ganador de cada partido</p>
          </div>
          {champion && (
            <div className={styles.championBadge}>
              🏆 {champion}
            </div>
          )}
        </div>

        <Bracket
          locked={!!savedFixture}
          onOpenShare={() => setShowModal(true)}
          onReset={!savedFixture && !anonymouslySaved ? handleReset : undefined}
        />

        {showModal && champion && (
          <ShareModal
            champion={champion}
            matches={matches}
            picks={picks}
            thirdPlaceRanking={thirdPlaceRanking}
            initialSavedId={savedFixture && user ? user.uid : (anonymouslySaved ? shareId : undefined)}
            onClose={() => setShowModal(false)}
          />
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

    const validThirdNames = new Set(thirds.map(t => t.team.name))
    const validRanking = thirdPlaceRanking.filter(name => validThirdNames.has(name))
    const top8 = validRanking.slice(0, 8)
    const canGoToBracket = thirds.length === 12 && top8.length === 8

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
