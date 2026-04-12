import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { ROUNDS } from '@/types/bracket'
import type { BracketMatch, Round } from '@/types/bracket'
import { useBracketStore } from '@/store/bracketStore'
import { GROUPS } from '@/data/worldCup2026'
import styles from './Bracket.module.css'

// ─────────── Constantes de layout ───────────
const MH   = 92    // altura del match card (px)
const MW   = 165   // ancho del match card (px)
const GAP  = 24    // espacio entre R32 consecutivos (px)
const UNIT = MH + GAP   // 116 — slot base
const CW   = 18    // ancho del conector SVG (px)
const COL  = MW + CW    // stride entre columnas (px)

// Tamaño especial para la card Final
const FINAL_MW = 210
const FINAL_MH = 86

// Cuántos px se acerca la mitad derecha (la Final está desconectada)
const CENTER_SHRINK = 60

// Dos mitades simétricas de 8 partidos R32 cada una
const HALF_H   = 8 * UNIT + 24
const TOTAL_W  = 8 * COL + MW - CENTER_SHRINK

// Columnas por ronda
//  Izquierda:  R32=0  R16=1  QF=2  SF=3
//  Final:                           4  (centrado entre las dos mitades)
//  Derecha:                    SF=5  QF=6  R16=7  R32=8  (todos - CENTER_SHRINK)
const COL_LEFT: Record<string, number>  = { R32: 0, R16: 1, QF: 2, SF: 3, F: 4 }
const COL_RIGHT: Record<string, number> = { SF: 5, QF: 6, R16: 7, R32: 8 }

// ─────────── Helpers de posición ────────────
function getTop(roundIdx: number, matchIdx: number): number {
  const slotH = UNIT * Math.pow(2, roundIdx)
  return matchIdx * slotH + (slotH - MH) / 2
}

function centerY(roundIdx: number, matchIdx: number): number {
  return getTop(roundIdx, matchIdx) + MH / 2
}

// La Final se posiciona arriba del cuadro (sin conectores a SF)
const FINAL_TOP        = 258
const CENTER_PANEL_TOP = FINAL_TOP - 40

// ─────────── flagIcon lookup ─────────────────
const flagIconMap = new Map<string, string>()
GROUPS.forEach((g) => g.teams.forEach((t) => flagIconMap.set(t.name, t.flagIcon)))

// ─────────── TeamSlot ───────────────────────
interface TeamSlotProps {
  team: string | null
  isWinner: boolean
  isFinal: boolean
  warm?: boolean     // estilo dorado (para panel central)
  disabled: boolean
  onClick: () => void
}

function TeamSlot({ team, isWinner, isFinal, warm = false, disabled, onClick }: TeamSlotProps) {
  const winnerClass = isWinner
    ? isFinal
      ? styles.champion
      : warm ? styles.winnerWarm : styles.winner
    : ''

  return (
    <button
      className={[styles.teamSlot, winnerClass, !team ? styles.tbd : ''].join(' ')}
      onClick={onClick}
      disabled={disabled || !team}
      title={team ?? undefined}
    >
      {team && (
        <span className={`fi fi-${flagIconMap.get(team) ?? 'un'} ${styles.slotFlag}`} />
      )}
      <span className={styles.slotName}>{team ?? '—'}</span>
      {isWinner && !isFinal && <span className={styles.tick}>✓</span>}
      {isWinner && isFinal && <span className={styles.crown}>🏆</span>}
    </button>
  )
}

// ─────────── MatchCard desktop (absoluta) ───
interface MatchCardProps {
  match: BracketMatch
  top: number
  left: number
  locked: boolean
  onPick: (id: string, team: string) => void
}

function MatchCard({ match, top, left, locked, onPick }: MatchCardProps) {
  const isPlayable = !!match.teamA && !!match.teamB

  return (
    <div
      className={styles.matchCard}
      style={{ top, left, width: MW, height: MH }}
    >
      {match.seedLabel && (
        <span className={styles.seedLabel}>{match.seedLabel}</span>
      )}
      <TeamSlot
        team={match.teamA}
        isWinner={match.winner === match.teamA && !!match.teamA}
        isFinal={false}
        disabled={!isPlayable || locked}
        onClick={() => match.teamA && onPick(match.id, match.teamA)}
      />
      <div className={styles.divider} />
      <TeamSlot
        team={match.teamB}
        isWinner={match.winner === match.teamB && !!match.teamB}
        isFinal={false}
        disabled={!isPlayable || locked}
        onClick={() => match.teamB && onPick(match.id, match.teamB)}
      />
    </div>
  )
}

// ─────────── Card del panel central (flujo) ─
interface CenterCardProps {
  match: BracketMatch
  locked: boolean
  height?: number
  onPick: (id: string, team: string) => void
}

function CenterCard({ match, locked, height, onPick }: CenterCardProps) {
  const isPlayable = !!match.teamA && !!match.teamB
  const isFinal = match.round === 'F'

  return (
    <div
      className={`${styles.centerCard} ${isFinal ? styles.centerCardFinal : ''}`}
      style={height ? { height } : undefined}
    >
      <TeamSlot
        team={match.teamA}
        isWinner={match.winner === match.teamA && !!match.teamA}
        isFinal={isFinal}
        warm
        disabled={!isPlayable || locked}
        onClick={() => match.teamA && onPick(match.id, match.teamA)}
      />
      <div className={styles.divider} />
      <TeamSlot
        team={match.teamB}
        isWinner={match.winner === match.teamB && !!match.teamB}
        isFinal={isFinal}
        warm
        disabled={!isPlayable || locked}
        onClick={() => match.teamB && onPick(match.id, match.teamB)}
      />
    </div>
  )
}

// ─────────── Panel central (Final + Campeón) ─
interface CenterPanelProps {
  final: BracketMatch | undefined
  champion: string | null
  locked: boolean
  onPick: (id: string, team: string) => void
}

function CenterPanel({ final, champion, locked, onPick }: CenterPanelProps) {
  // Centrar la Final en el espacio entre las dos mitades
  const leftEdge  = 3 * COL + MW                    // borde derecho de SF izq
  const rightEdge = 5 * COL - CENTER_SHRINK          // borde izquierdo de SF der
  const finalLeft = (leftEdge + rightEdge) / 2 - FINAL_MW / 2
  return (
    <div
      className={styles.centerPanel}
      style={{
        position: 'absolute',
        top: CENTER_PANEL_TOP,
        left: finalLeft,
        width: FINAL_MW,
      }}
    >
      {/* ── Campeón flota sobre la card ── */}
      {champion && (
        <div className={styles.centerChampionBlock}>
          <span className={styles.centerChampionTrophy}>🏆</span>
          <div className={styles.centerChampionTeam}>
            <span className={`fi fi-${flagIconMap.get(champion) ?? 'un'} ${styles.centerChampionFlag}`} />
            <span className={styles.centerChampionName}>{champion}</span>
          </div>
        </div>
      )}
      {/* ── Final ── */}
      <p className={styles.centerLabel}>{champion ? 'Campeón' : 'Final'}</p>
      {final && <CenterCard match={final} locked={locked} height={FINAL_MH} onPick={onPick} />}
    </div>
  )
}

// ─────────── Conector SVG izquierda (→) ─────
interface ConnectorProps {
  fromRoundIdx: number
  fromCount: number
  left: number
}

function ConnectorSVGLeft({ fromRoundIdx, fromCount, left }: ConnectorProps) {
  const half = CW / 2
  const lines: React.ReactNode[] = []

  for (let i = 0; i < fromCount; i += 2) {
    const y1    = centerY(fromRoundIdx, i)
    const y2    = centerY(fromRoundIdx, i + 1)
    const k     = i / 2
    const yNext = centerY(fromRoundIdx + 1, k)
    const vTop  = Math.min(y1, yNext)
    const vBot  = Math.max(y2, yNext)

    lines.push(
      <g key={i} stroke="var(--color-border)" strokeWidth="1.5" fill="none">
        <line x1={0}    y1={y1}    x2={half}  y2={y1} />
        <line x1={half} y1={vTop}  x2={half}  y2={vBot} />
        <line x1={0}    y1={y2}    x2={half}  y2={y2} />
        <line x1={half} y1={yNext} x2={CW}    y2={yNext} />
      </g>
    )
  }

  return (
    <svg style={{ position: 'absolute', left, top: 0 }}
      width={CW} height={HALF_H} overflow="visible">
      {lines}
    </svg>
  )
}

// ─────────── Conector SVG derecha (←) ───────
function ConnectorSVGRight({ fromRoundIdx, fromCount, left }: ConnectorProps) {
  const half = CW / 2
  const lines: React.ReactNode[] = []

  for (let i = 0; i < fromCount; i += 2) {
    const y1    = centerY(fromRoundIdx, i)
    const y2    = centerY(fromRoundIdx, i + 1)
    const k     = i / 2
    const yNext = centerY(fromRoundIdx + 1, k)
    const vTop  = Math.min(y1, yNext)
    const vBot  = Math.max(y2, yNext)

    lines.push(
      <g key={i} stroke="var(--color-border)" strokeWidth="1.5" fill="none">
        <line x1={CW}   y1={y1}    x2={half}  y2={y1} />
        <line x1={half} y1={vTop}  x2={half}  y2={vBot} />
        <line x1={CW}   y1={y2}    x2={half}  y2={y2} />
        <line x1={half} y1={yNext} x2={0}     y2={yNext} />
      </g>
    )
  }

  return (
    <svg style={{ position: 'absolute', left, top: 0 }}
      width={CW} height={HALF_H} overflow="visible">
      {lines}
    </svg>
  )
}

// ─────────── Bracket principal ──────────────
interface BracketProps {
  locked?: boolean
  matches?: BracketMatch[]
  onShare?: () => void
  onReset?: () => void
  sharing?: boolean
}

export const Bracket = forwardRef<HTMLDivElement, BracketProps>(function Bracket({
  locked = false,
  matches: propMatches,
  onShare,
  onReset,
  sharing = false,
}, ref) {
  const { matches: storeMatches, pickWinner } = useBracketStore()
  const matches = propMatches ?? storeMatches
  const outerRef   = useRef<HTMLDivElement>(null) // scroll container
  const bracketRef = useRef<HTMLDivElement>(null) // captura

  const byRound = ROUNDS.reduce<Record<Round, BracketMatch[]>>(
    (acc, r) => { acc[r] = matches.filter((m) => m.round === r); return acc },
    { R32: [], R16: [], QF: [], SF: [], F: [], '3P': [] }
  )

  // Divide cada ronda en mitad izquierda y mitad derecha
  type HalfRounds = Record<Round, BracketMatch[]>
  const leftHalf: HalfRounds  = { R32: [], R16: [], QF: [], SF: [], F: [], '3P': [] }
  const rightHalf: HalfRounds = { R32: [], R16: [], QF: [], SF: [], F: [], '3P': [] }

  ROUNDS.forEach((r) => {
    const ms = byRound[r]
    if (r === 'F' || r === '3P') {
      leftHalf[r] = ms  // Final va al panel central
      return
    }
    const half = Math.ceil(ms.length / 2)
    leftHalf[r]  = ms.slice(0, half)
    rightHalf[r] = ms.slice(half)
  })

  const champion = byRound['F'][0]?.winner ?? null
  const sfDone   = byRound['SF'].length === 2 && byRound['SF'].every((m) => m.winner !== null)

  // ── Contadores de partidos terminados por mitad y ronda ──
  const lR32Done = leftHalf['R32'].filter(m => m.winner !== null).length
  const lR16Done = leftHalf['R16'].filter(m => m.winner !== null).length
  const lQFDone  = leftHalf['QF'].filter(m => m.winner !== null).length
  const rR32Done = rightHalf['R32'].filter(m => m.winner !== null).length
  const rR16Done = rightHalf['R16'].filter(m => m.winner !== null).length
  const rQFDone  = rightHalf['QF'].filter(m => m.winner !== null).length

  useImperativeHandle(ref, () => bracketRef.current as HTMLDivElement)

  // ── Auto-scroll al completar cada ronda en cada mitad ──
  const prevDone = useRef({ lR32: -1, lR16: -1, lQF: -1, rR32: -1, rR16: -1, rQF: -1, sf: false })

  useEffect(() => {
    if (!outerRef.current) return
    const el = outerRef.current
    const w  = el.clientWidth
    const prev = prevDone.current

    // Centra la columna indicada en el viewport
    const scrollToCol = (colLeft: number) => {
      el.scrollTo({ left: Math.max(0, colLeft + MW / 2 - w / 2), behavior: 'smooth' })
    }

    if (prev.lR32 === -1) {
      // Primer render: guardar estado actual sin scrollear
      prevDone.current = { lR32: lR32Done, lR16: lR16Done, lQF: lQFDone, rR32: rR32Done, rR16: rR16Done, rQF: rQFDone, sf: sfDone }
      return
    }

    if (sfDone && !prev.sf) {
      // Ambas semis listas → centrar en la Final
      scrollToCol((3 * COL + MW + 5 * COL - CENTER_SHRINK) / 2 - FINAL_MW / 2)
    } else if (lR32Done === 8 && prev.lR32 < 8) {
      scrollToCol(COL_LEFT['R16'] * COL)           // izq: R32 → R16
    } else if (lR16Done === 4 && prev.lR16 < 4) {
      scrollToCol(COL_LEFT['QF'] * COL)            // izq: R16 → QF
    } else if (lQFDone === 2 && prev.lQF < 2) {
      scrollToCol(COL_LEFT['SF'] * COL)            // izq: QF → SF
    } else if (rR32Done === 8 && prev.rR32 < 8) {
      scrollToCol(COL_RIGHT['R16'] * COL - CENTER_SHRINK)  // der: R32 → R16
    } else if (rR16Done === 4 && prev.rR16 < 4) {
      scrollToCol(COL_RIGHT['QF'] * COL - CENTER_SHRINK)   // der: R16 → QF
    } else if (rQFDone === 2 && prev.rQF < 2) {
      scrollToCol(COL_RIGHT['SF'] * COL - CENTER_SHRINK)   // der: QF → SF
    }

    prevDone.current = { lR32: lR32Done, lR16: lR16Done, lQF: lQFDone, rR32: rR32Done, rR16: rR16Done, rQF: rQFDone, sf: sfDone }
  }, [lR32Done, lR16Done, lQFDone, rR32Done, rR16Done, rQFDone, sfDone])

  const leftRounds  = ['R32', 'R16', 'QF', 'SF'] as Round[]
  const rightRounds = ['SF', 'QF', 'R16', 'R32'] as Round[]

  return (
    <div ref={outerRef} className={styles.outer}>
      {/* ── Cuadro ── */}
      <div ref={bracketRef} className={styles.bracket} style={{ height: HALF_H, width: TOTAL_W }}>

        {/* Match cards izquierda */}
        {leftRounds.map((r, ri) =>
          leftHalf[r].map((match, mi) => (
            <MatchCard
              key={match.id}
              match={match}
              top={getTop(ri, mi)}
              left={COL_LEFT[r] * COL}
              locked={locked}
              onPick={pickWinner}
            />
          ))
        )}

        {/* Panel central: Final + Campeón */}
        <CenterPanel
          final={leftHalf['F'][0]}
          champion={champion}
          locked={locked}
          onPick={pickWinner}
        />

        {/* Match cards derecha (espejo) — desplazadas CENTER_SHRINK px a la izq */}
        {rightRounds.map((r, ri) =>
          rightHalf[r].map((match, mi) => (
            <MatchCard
              key={match.id}
              match={match}
              top={getTop(3 - ri, mi)}
              left={COL_RIGHT[r] * COL - CENTER_SHRINK}
              locked={locked}
              onPick={pickWinner}
            />
          ))
        )}

        {/* Conectores izquierda: R32→R16, R16→QF, QF→SF */}
        {([0, 1, 2] as const).map((ri) => (
          <ConnectorSVGLeft
            key={`CL-${ri}`}
            fromRoundIdx={ri}
            fromCount={leftHalf[ROUNDS[ri]].length}
            left={ri * COL + MW}
          />
        ))}

        {/* Botones flotantes: debajo de las SF, centrados en el hueco */}
        {(onShare || onReset) && (() => {
          const sfBottom = getTop(3, 0) + MH + 70
          const centerX  = (3 * COL + MW + 5 * COL - CENTER_SHRINK) / 2
          return (
            <div
              data-no-capture=""
              className={styles.bracketActions}
              style={{ top: sfBottom, left: centerX, transform: 'translateX(-50%)' }}
            >
              {onShare && (
                <button
                  className={styles.bracketActionBtn}
                  onClick={onShare}
                  disabled={sharing || !champion}
                  title="Compartir fixture como imagen"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  {sharing ? 'Generando…' : 'Screenshot'}
                </button>
              )}
              {onReset && (
                <button
                  className={`${styles.bracketActionBtn} ${styles.bracketActionBtnReset}`}
                  onClick={onReset}
                  title="Reiniciar pronóstico"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10"/>
                    <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
                  </svg>
                  Reiniciar
                </button>
              )}
            </div>
          )
        })()}

        {/* Conectores derecha: SF→QF, QF→R16, R16→R32 */}
        {([0, 1, 2] as const).map((mi) => {
          const fromRoundIdx = 2 - mi
          const fromRound = ROUNDS[fromRoundIdx]
          return (
            <ConnectorSVGRight
              key={`CR-${mi}`}
              fromRoundIdx={fromRoundIdx}
              fromCount={rightHalf[fromRound].length}
              left={(5 + mi) * COL + MW - CENTER_SHRINK}
            />
          )
        })}
      </div>
    </div>
  )
})
