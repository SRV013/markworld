import { usePronosticoStore } from '../../store/pronosticoStore'
import { GroupPicker } from '../../components/GroupPicker/GroupPicker'
import { GROUPS } from '../../data/worldCup2026'
import styles from './Pronostico.module.css'

export function Pronostico() {
  const { phase, currentGroupIndex, picks, start, toggleTeam, next, prev, reset } =
    usePronosticoStore()

  if (phase === 'intro') {
    return (
      <div className={styles.page}>
        <div className={styles.intro}>
          <div className={styles.trophy}>🏆</div>
          <h1 className={styles.introTitle}>Tu pronóstico</h1>
          <p className={styles.introText}>
            Elegí el orden de clasificación de los <strong>12 grupos</strong> del
            Mundial 2026. Para cada grupo vas a seleccionar el equipo que termina
            <strong> primero</strong>, <strong>segundo</strong> y{' '}
            <strong>tercero</strong>. Al final podés comparar tu pronóstico con
            los resultados reales.
          </p>
          <ul className={styles.rulesList}>
            <li>📋 12 grupos · 4 equipos cada uno</li>
            <li>🥇 Hacé clic en los equipos en el orden que creés que van a clasificar</li>
            <li>💾 Tu progreso se guarda automáticamente</li>
          </ul>
          <button className={styles.startBtn} onClick={start}>
            Comenzar pronóstico →
          </button>
        </div>
      </div>
    )
  }

  const group = GROUPS[currentGroupIndex]
  const selected = picks[group.id] ?? []
  const isFirst = currentGroupIndex === 0
  const isLast = currentGroupIndex === GROUPS.length - 1
  const canAdvance = selected.length === 3
  const completedCount = GROUPS.filter((g) => (picks[g.id] ?? []).length === 3).length

  return (
    <div className={styles.page}>

      {/* Stepper */}
      <div className={styles.stepper}>
        {GROUPS.map((g, i) => {
          const done = (picks[g.id] ?? []).length === 3
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
      <div className={styles.pickerWrap}>
        <GroupPicker
          group={group}
          selected={selected}
          onToggle={(teamName) => toggleTeam(group.id, teamName)}
        />
      </div>

      {/* Navegación */}
      <div className={styles.nav}>
        <button
          className={styles.navBtn}
          onClick={prev}
          disabled={isFirst}
        >
          ← Anterior
        </button>

        {isLast ? (
          canAdvance ? (
            <button className={styles.finishBtn} onClick={() => alert('¡Pronóstico completado! 🎉')}>
              Finalizar pronóstico 🏆
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
