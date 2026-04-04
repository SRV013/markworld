import { useEffect, useRef } from 'react'
import { usePronosticoStore } from '@/store/pronosticoStore'
import { useBracketStore } from '@/store/bracketStore'
import { GroupPicker } from '@/components/GroupPicker/GroupPicker'
import { ThirdPlacePicker } from '@/components/ThirdPlacePicker/ThirdPlacePicker'
import type { ThirdEntry } from '@/components/ThirdPlacePicker/ThirdPlacePicker'
import { Bracket } from '@/components/Bracket/Bracket'
import { GROUPS } from '@/data/worldCup2026'
import { buildInitialBracket } from '@/utils/buildBracket'
import styles from './Pronostico.module.css'

export function Pronostico() {
  const {
    phase, currentGroupIndex, picks, thirdPlaceRanking,
    start, toggleTeam, next, prev,
    toggleThirdRank, startThirdPhase, backToGroups, startBracket, reset,
  } = usePronosticoStore()
  const { initializeBracket, reset: resetBracket } = useBracketStore()
  const pickerRef = useRef<HTMLDivElement>(null)

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
          <button className={styles.startBtn} onClick={start}>
            Comenzar pronóstico →
          </button>
        </div>
      </div>
    )
  }

  // ── Fase eliminatoria (bracket) ──────────────────────────────
  if (phase === 'bracket') {
    const champion = useBracketStore.getState().matches.find((m) => m.round === 'F')?.winner

    const handleReset = () => {
      reset()
      resetBracket()
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

        <Bracket />

        <button className={styles.resetBtn} onClick={handleReset}>
          Reiniciar pronóstico completo
        </button>
      </div>
    )
  }

  // ── Fase de clasificación de terceros ────────────────────────
  if (phase === 'thirdPlace') {
    // Armar la lista de 12 terceros (uno por grupo, en el orden A-L)
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
  const group = GROUPS[currentGroupIndex]
  const selected = picks[group.id] ?? []
  const isFirst = currentGroupIndex === 0
  const isLast = currentGroupIndex === GROUPS.length - 1
  const canAdvance = selected.length === 3
  const allGroupsDone = GROUPS.every((g) => (picks[g.id] ?? []).length === 3)
  const completedCount = GROUPS.filter((g) => (picks[g.id] ?? []).length === 3).length

  // Al llegar al último grupo, centrar verticalmente el picker
  useEffect(() => {
    if (isLast && pickerRef.current) {
      pickerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [isLast])

  return (
    <div className={styles.page}>

      {/* Stepper */}
      <div className={styles.stepper}>
        {GROUPS.map((g, i) => {
          const done   = (picks[g.id] ?? []).length === 3
          const active = i === currentGroupIndex
          return (
            <div
              key={g.id}
              className={`${styles.step} ${done ? styles.stepDone : ''} ${active ? styles.stepActive : ''}`}
            >
              {g.id}
            </div>
          )
        })}
      </div>

      <p className={styles.progress}>
        Grupo {currentGroupIndex + 1} de {GROUPS.length} · {completedCount} completados
      </p>

      {/* Picker */}
      <div className={styles.pickerWrap} ref={pickerRef}>
        <GroupPicker
          group={group}
          selected={selected}
          onToggle={(teamName) => toggleTeam(group.id, teamName)}
        />
      </div>

      {/* Navegación */}
      <div className={styles.nav}>
        <button className={styles.navBtn} onClick={prev} disabled={isFirst}>
          ← Anterior
        </button>

        {isLast ? (
          canAdvance && allGroupsDone ? (
            <button className={styles.finishBtn} onClick={startThirdPhase}>
              Rankear terceros →
            </button>
          ) : (
            <button className={styles.navBtnPrimary} disabled>
              Siguiente →
            </button>
          )
        ) : (
          <button
            className={styles.navBtnPrimary}
            onClick={() => next(GROUPS.length)}
            disabled={!canAdvance}
          >
            Siguiente grupo →
          </button>
        )}
      </div>

      <button className={styles.resetBtn} onClick={reset}>
        Reiniciar pronóstico
      </button>
    </div>
  )
}
