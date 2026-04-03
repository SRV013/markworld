import type { BracketMatch } from '../types/bracket'

type Picks = Record<string, string[]>

/** Devuelve el equipo en una posición de un grupo (0=1°, 1=2°, 2=3°) */
function pick(picks: Picks, group: string, pos: number): string | null {
  return picks[group]?.[pos] ?? null
}

/**
 * Construye el cuadro inicial de 31 partidos a partir de los picks de grupos.
 * Seeding:
 *   R32 M01-M08 → mitad superior del cuadro
 *   R32 M09-M16 → mitad inferior (terceros A-H)
 */
export function buildInitialBracket(picks: Picks): BracketMatch[] {
  const p = (g: string, pos: number) => pick(picks, g, pos)

  return [
    // ── RONDA DE 32 (top half) ──────────────────────────────────
    { id: 'M01', round: 'R32', seedLabel: '1A vs 2B', teamA: p('A',0), teamB: p('B',1), winner: null, nextMatchId: 'M17', nextSlot: 'A' },
    { id: 'M02', round: 'R32', seedLabel: '1C vs 2D', teamA: p('C',0), teamB: p('D',1), winner: null, nextMatchId: 'M17', nextSlot: 'B' },
    { id: 'M03', round: 'R32', seedLabel: '1B vs 2A', teamA: p('B',0), teamB: p('A',1), winner: null, nextMatchId: 'M18', nextSlot: 'A' },
    { id: 'M04', round: 'R32', seedLabel: '1D vs 2C', teamA: p('D',0), teamB: p('C',1), winner: null, nextMatchId: 'M18', nextSlot: 'B' },
    { id: 'M05', round: 'R32', seedLabel: '1E vs 2F', teamA: p('E',0), teamB: p('F',1), winner: null, nextMatchId: 'M19', nextSlot: 'A' },
    { id: 'M06', round: 'R32', seedLabel: '1G vs 2H', teamA: p('G',0), teamB: p('H',1), winner: null, nextMatchId: 'M19', nextSlot: 'B' },
    { id: 'M07', round: 'R32', seedLabel: '1F vs 2E', teamA: p('F',0), teamB: p('E',1), winner: null, nextMatchId: 'M20', nextSlot: 'A' },
    { id: 'M08', round: 'R32', seedLabel: '1H vs 2G', teamA: p('H',0), teamB: p('G',1), winner: null, nextMatchId: 'M20', nextSlot: 'B' },
    // ── RONDA DE 32 (bottom half) ───────────────────────────────
    { id: 'M09', round: 'R32', seedLabel: '1I vs 2J', teamA: p('I',0), teamB: p('J',1), winner: null, nextMatchId: 'M21', nextSlot: 'A' },
    { id: 'M10', round: 'R32', seedLabel: '1K vs 2L', teamA: p('K',0), teamB: p('L',1), winner: null, nextMatchId: 'M21', nextSlot: 'B' },
    { id: 'M11', round: 'R32', seedLabel: '1J vs 2I', teamA: p('J',0), teamB: p('I',1), winner: null, nextMatchId: 'M22', nextSlot: 'A' },
    { id: 'M12', round: 'R32', seedLabel: '1L vs 2K', teamA: p('L',0), teamB: p('K',1), winner: null, nextMatchId: 'M22', nextSlot: 'B' },
    { id: 'M13', round: 'R32', seedLabel: '3A vs 3B', teamA: p('A',2), teamB: p('B',2), winner: null, nextMatchId: 'M23', nextSlot: 'A' },
    { id: 'M14', round: 'R32', seedLabel: '3C vs 3D', teamA: p('C',2), teamB: p('D',2), winner: null, nextMatchId: 'M23', nextSlot: 'B' },
    { id: 'M15', round: 'R32', seedLabel: '3E vs 3F', teamA: p('E',2), teamB: p('F',2), winner: null, nextMatchId: 'M24', nextSlot: 'A' },
    { id: 'M16', round: 'R32', seedLabel: '3G vs 3H', teamA: p('G',2), teamB: p('H',2), winner: null, nextMatchId: 'M24', nextSlot: 'B' },

    // ── OCTAVOS ─────────────────────────────────────────────────
    { id: 'M17', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M25', nextSlot: 'A' },
    { id: 'M18', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M25', nextSlot: 'B' },
    { id: 'M19', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M26', nextSlot: 'A' },
    { id: 'M20', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M26', nextSlot: 'B' },
    { id: 'M21', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M27', nextSlot: 'A' },
    { id: 'M22', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M27', nextSlot: 'B' },
    { id: 'M23', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M28', nextSlot: 'A' },
    { id: 'M24', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M28', nextSlot: 'B' },

    // ── CUARTOS ──────────────────────────────────────────────────
    { id: 'M25', round: 'QF', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M29', nextSlot: 'A' },
    { id: 'M26', round: 'QF', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M29', nextSlot: 'B' },
    { id: 'M27', round: 'QF', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M30', nextSlot: 'A' },
    { id: 'M28', round: 'QF', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M30', nextSlot: 'B' },

    // ── SEMIS ────────────────────────────────────────────────────
    { id: 'M29', round: 'SF', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M31', nextSlot: 'A' },
    { id: 'M30', round: 'SF', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M31', nextSlot: 'B' },

    // ── FINAL ────────────────────────────────────────────────────
    { id: 'M31', round: 'F', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: null, nextSlot: 'A' },
  ]
}
