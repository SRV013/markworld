import { useEffect, useRef } from 'react'
import { ROUNDS, ROUND_LABELS, ROUND_MATCH_COUNT } from '@/types/bracket'
import type { BracketMatch, Round } from '@/types/bracket'
import { useBracketStore } from '@/store/bracketStore'
import { GROUPS } from '@/data/worldCup2026'
import styles from './Bracket.module.css'

// ─────────── Constantes de layout ───────────
const MH  = 92    // altura del match card (px)
const MW  = 224   // ancho del match card (px)
const GAP = 10    // espacio entre R32 consecutivos (px)
const UNIT = MH + GAP  // 102 — slot base
const CW  = 32    // ancho del conector SVG (px)
const COL = MW + CW   // stride entre columnas (px)
const TOTAL_H = 16 * UNIT + 24  // altura total del bracket

// ─────────── Helpers de posición ────────────
function getTop(roundIdx: number, matchIdx: number): number {
  const slotH = UNIT * Math.pow(2, roundIdx)
  return matchIdx * slotH + (slotH - MH) / 2
}

function centerY(roundIdx: number, matchIdx: number): number {
  return getTop(roundIdx, matchIdx) + MH / 2
}

// ─────────── flagIcon lookup (name → flagIcon) ──
const flagIconMap = new Map<string, string>()
GROUPS.forEach((g) => g.teams.forEach((t) => flagIconMap.set(t.name, t.flagIcon)))

// ─────────── TeamSlot ───────────────────────
interface TeamSlotProps {
  team: string | null
  isWinner: boolean
  isFinal: boolean
  disabled: boolean
  onClick: () => void
}

function TeamSlot({ team, isWinner, isFinal, disabled, onClick }: TeamSlotProps) {
  return (
    <button
      className={[
        styles.teamSlot,
        isWinner ? (isFinal ? styles.champion : styles.winner) : '',
        !team ? styles.tbd : '',
      ].join(' ')}
      onClick={onClick}
      disabled={disabled || !team}
      title={team ?? undefined}
    >
      {team && (
        <span
          className={`fi fi-${flagIconMap.get(team) ?? 'un'} ${styles.slotFlag}`}
        />
      )}
      <span className={styles.slotName}>{team ?? '—'}</span>
      {isWinner && !isFinal && <span className={styles.tick}>✓</span>}
      {isWinner && isFinal && <span className={styles.crown}>🏆</span>}
    </button>
  )
}

// ─────────── MatchCard ──────────────────────
interface MatchCardProps {
  match: BracketMatch
  roundIdx: number
  matchIdx: number
  onPick: (id: string, team: string) => void
}

function MatchCard({ match, roundIdx, matchIdx, onPick }: MatchCardProps) {
  const top  = getTop(roundIdx, matchIdx)
  const left = roundIdx * COL
  const isPlayable = !!match.teamA && !!match.teamB
  const isFinal = match.round === 'F'

  return (
    <div
      className={`${styles.matchCard} ${isFinal ? styles.finalCard : ''}`}
      style={{ top, left, width: MW, height: MH }}
    >
      {match.seedLabel && (
        <span className={styles.seedLabel}>{match.seedLabel}</span>
      )}
      <TeamSlot
        team={match.teamA}
        isWinner={match.winner === match.teamA && !!match.teamA}
        isFinal={isFinal}
        disabled={!isPlayable}
        onClick={() => match.teamA && onPick(match.id, match.teamA)}
      />
      <div className={styles.divider} />
      <TeamSlot
        team={match.teamB}
        isWinner={match.winner === match.teamB && !!match.teamB}
        isFinal={isFinal}
        disabled={!isPlayable}
        onClick={() => match.teamB && onPick(match.id, match.teamB)}
      />
    </div>
  )
}

// ─────────── Conector SVG ───────────────────
interface ConnectorProps {
  fromRoundIdx: number
  fromCount: number
  left: number
}

function ConnectorSVG({ fromRoundIdx, fromCount, left }: ConnectorProps) {
  const half = CW / 2

  const lines: React.ReactNode[] = []
  for (let i = 0; i < fromCount; i += 2) {
    const y1  = centerY(fromRoundIdx, i)
    const y2  = centerY(fromRoundIdx, i + 1)
    const k   = i / 2
    const yNext = centerY(fromRoundIdx + 1, k)

    lines.push(
      <g key={i} stroke="var(--color-border)" strokeWidth="1.5" fill="none">
        {/* línea horizontal desde partido superior */}
        <line x1={0} y1={y1} x2={half} y2={y1} />
        {/* vertical que une los dos partidos */}
        <line x1={half} y1={y1} x2={half} y2={y2} />
        {/* línea horizontal desde partido inferior */}
        <line x1={0} y1={y2} x2={half} y2={y2} />
        {/* horizontal de salida al siguiente round */}
        <line x1={half} y1={yNext} x2={CW} y2={yNext} />
      </g>
    )
  }

  return (
    <svg
      style={{ position: 'absolute', left, top: 0 }}
      width={CW}
      height={TOTAL_H}
      overflow="visible"
    >
      {lines}
    </svg>
  )
}

// ─────────── Bracket principal ──────────────
export function Bracket() {
  const { matches, pickWinner } = useBracketStore()
  const outerRef = useRef<HTMLDivElement>(null)

  const byRound = ROUNDS.reduce<Record<Round, BracketMatch[]>>(
    (acc, r) => { acc[r] = matches.filter((m) => m.round === r); return acc },
    { R32: [], R16: [], QF: [], SF: [], F: [] }
  )

  const r32Done = byRound.R32.length === 16 && byRound.R32.every((m) => m.winner !== null)

  // Cuando todos los 16avos tienen ganador → scroll suave al inicio de R16
  useEffect(() => {
    if (r32Done && outerRef.current) {
      outerRef.current.scrollTo({ left: COL, behavior: 'smooth' })
    }
  }, [r32Done])

  const totalWidth = ROUNDS.length * MW + (ROUNDS.length - 1) * CW

  return (
    <div ref={outerRef} className={styles.outer}>
      {/* Encabezados de ronda */}
      <div className={styles.headers} style={{ width: totalWidth }}>
        {ROUNDS.map((r, ri) => (
          <div
            key={r}
            className={`${styles.roundHeader} ${r === 'F' ? styles.finalHeader : ''}`}
            style={{ width: MW, marginLeft: ri === 0 ? 0 : CW }}
          >
            {ROUND_LABELS[r]}
          </div>
        ))}
      </div>

      {/* Cuadro */}
      <div
        className={styles.bracket}
        style={{ height: TOTAL_H, width: totalWidth }}
      >
        {/* Match cards */}
        {ROUNDS.map((r, ri) =>
          byRound[r].map((match, mi) => (
            <MatchCard
              key={match.id}
              match={match}
              roundIdx={ri}
              matchIdx={mi}
              onPick={pickWinner}
            />
          ))
        )}

        {/* Conectores entre rondas */}
        {[0, 1, 2, 3].map((ri) => (
          <ConnectorSVG
            key={ri}
            fromRoundIdx={ri}
            fromCount={ROUND_MATCH_COUNT[ROUNDS[ri]]}
            left={ri * COL + MW}
          />
        ))}
      </div>
    </div>
  )
}
