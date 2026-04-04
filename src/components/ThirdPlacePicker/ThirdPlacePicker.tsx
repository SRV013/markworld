import type { Team } from '../../types/worldCup'
import styles from './ThirdPlacePicker.module.css'

export interface ThirdEntry {
  groupId: string
  team: Team
}

interface Props {
  thirds: ThirdEntry[]
  ranking: string[]           // nombres ordenados del mejor al peor 3°
  onToggle: (teamName: string) => void
}

export function ThirdPlacePicker({ thirds, ranking, onToggle }: Props) {
  const rankedCount = ranking.length
  const canAdvanceCount = Math.min(rankedCount, 8)

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.groupLabel}>Mejores Terceros</span>
        <span className={styles.counter}>
          {canAdvanceCount}<span className={styles.counterSlash}>/</span>8 clasificados
        </span>
      </div>

      <p className={styles.hint}>
        Cliqueá los equipos en orden: del mejor al peor tercer clasificado.
        Los primeros <strong>8</strong> avanzan al cuadro eliminatorio.
      </p>

      <ul className={styles.list}>
        {thirds.map(({ groupId, team }) => {
          const rankIdx = ranking.indexOf(team.name)
          const isRanked = rankIdx !== -1
          const rank = rankIdx + 1
          const advances = isRanked && rank <= 8
          const doesntAdvance = isRanked && rank > 8

          return (
            <li key={team.name}>
              <button
                className={[
                  styles.teamBtn,
                  isRanked ? styles.ranked : '',
                  advances ? styles.advances : '',
                  doesntAdvance ? styles.out : '',
                ].join(' ')}
                onClick={() => onToggle(team.name)}
                aria-pressed={isRanked}
              >
                {/* Número de ranking */}
                <span className={styles.rankSlot}>
                  {isRanked ? (
                    <span className={`${styles.rankBadge} ${advances ? styles.rankAdv : styles.rankOut}`}>
                      {rank}
                    </span>
                  ) : (
                    <span className={styles.rankEmpty} />
                  )}
                </span>

                <span className={`fi fi-${team.flagIcon} ${styles.flag}`} />
                <span className={styles.name}>{team.name}</span>
                <span className={styles.groupTag}>Grupo {groupId}</span>

                {advances && <span className={styles.badgeAdv}>Clasifica</span>}
                {doesntAdvance && <span className={styles.badgeOut}>No clasifica</span>}
                {!isRanked && <span className={styles.badgePending}>—</span>}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
