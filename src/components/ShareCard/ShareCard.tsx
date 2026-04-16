import { forwardRef } from 'react'
import type { BracketMatch } from '@/types/bracket'
import { GROUPS } from '@/data/worldCup2026'
import styles from './ShareCard.module.css'

const flagIconMap = new Map<string, string>()
GROUPS.forEach(g => g.teams.forEach(t => flagIconMap.set(t.name, t.flagIcon)))

const ROUND_LABEL: Record<string, string> = {
  R32: '16avos', R16: 'Octavos', QF: 'Cuartos', SF: 'Semis', F: 'Final',
}
const ROUND_ORDER = ['R32', 'R16', 'QF', 'SF', 'F']

function getChampionPath(matches: BracketMatch[], champion: string) {
  return matches
    .filter(m => m.winner === champion && m.round !== '3P')
    .sort((a, b) => ROUND_ORDER.indexOf(a.round) - ROUND_ORDER.indexOf(b.round))
    .map(m => ({
      label: ROUND_LABEL[m.round] ?? m.round,
      opponent: m.teamA === champion ? m.teamB : m.teamA,
    }))
}

interface ShareCardProps {
  champion: string | null
  matches: BracketMatch[]
  shareId: string
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard({ champion, matches, shareId }, ref) {
    const path = champion ? getChampionPath(matches, champion) : []
    const flagCode = champion ? (flagIconMap.get(champion) ?? 'un') : 'un'
    const shareUrl = `${window.location.origin}/ver/${shareId}`

    return (
      <div ref={ref} className={styles.card}>
        <div className={styles.header}>
          <span className={styles.headerLabel}>MUNDIAL</span>
          <span className={styles.headerYear}>2026</span>
        </div>

        <div className={styles.heroSection}>
          <div className={styles.trophy}>🏆</div>
          {champion ? (
            <>
              <span className={`fi fi-${flagCode} ${styles.championFlag}`} />
              <p className={styles.championName}>{champion.toUpperCase()}</p>
              <p className={styles.championSub}>Mi campeón</p>
            </>
          ) : (
            <p className={styles.championName}>—</p>
          )}
        </div>

        {path.length > 0 && (
          <div className={styles.path}>
            <p className={styles.pathTitle}>Mi camino al título</p>
            {path.map(({ label, opponent }) => (
              <div key={label} className={styles.pathRow}>
                <span className={styles.pathRound}>{label}</span>
                <span className={styles.pathVs}>vs</span>
                <span className={styles.pathOpponent}>
                  {opponent ? (
                    <>
                      <span className={`fi fi-${flagIconMap.get(opponent) ?? 'un'} ${styles.pathFlag}`} />
                      {opponent}
                    </>
                  ) : '—'}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <span className={styles.footerUrl}>{shareUrl}</span>
        </div>
      </div>
    )
  }
)
