import type { BracketMatch } from '../types/bracket'

type Picks = Record<string, string[]>

/** Devuelve el equipo en una posición de un grupo (0=1°, 1=2°, 2=3°) */
function pick(picks: Picks, group: string, pos: number): string | null {
  return picks[group]?.[pos] ?? null
}

/**
 * Construye el cuadro inicial de 31 partidos.
 *
 * @param picks       Clasificación de fase de grupos (1°, 2°, 3° por grupo)
 * @param top8thirds  Los 8 mejores terceros ordenados de mejor a peor (rankeados por el usuario)
 *
 * Seeding:
 *   R32 M01–M08  → mitad superior  (primeros y segundos de A–H)
 *   R32 M09–M12  → mitad inferior  (primeros y segundos de I–L)
 *   R32 M13–M16  → mejores terceros (top8thirds[0..7])
 */
export function buildInitialBracket(picks: Picks, top8thirds: string[]): BracketMatch[] {
  const p = (g: string, pos: number) => pick(picks, g, pos)
  const t3 = (i: number): string | null => top8thirds[i] ?? null

  return [
    // ── RONDA DE 32 (mitad superior) ────────────────────────────
    { id: 'M01', round: 'R32', seedLabel: '1A vs 2B',   teamA: p('A',0), teamB: p('B',1), winner: null, nextMatchId: 'M17', nextSlot: 'A' },
    { id: 'M02', round: 'R32', seedLabel: '1C vs 2D',   teamA: p('C',0), teamB: p('D',1), winner: null, nextMatchId: 'M17', nextSlot: 'B' },
    { id: 'M03', round: 'R32', seedLabel: '1B vs 2A',   teamA: p('B',0), teamB: p('A',1), winner: null, nextMatchId: 'M18', nextSlot: 'A' },
    { id: 'M04', round: 'R32', seedLabel: '1D vs 2C',   teamA: p('D',0), teamB: p('C',1), winner: null, nextMatchId: 'M18', nextSlot: 'B' },
    { id: 'M05', round: 'R32', seedLabel: '1E vs 2F',   teamA: p('E',0), teamB: p('F',1), winner: null, nextMatchId: 'M19', nextSlot: 'A' },
    { id: 'M06', round: 'R32', seedLabel: '1G vs 2H',   teamA: p('G',0), teamB: p('H',1), winner: null, nextMatchId: 'M19', nextSlot: 'B' },
    { id: 'M07', round: 'R32', seedLabel: '1F vs 2E',   teamA: p('F',0), teamB: p('E',1), winner: null, nextMatchId: 'M20', nextSlot: 'A' },
    { id: 'M08', round: 'R32', seedLabel: '1H vs 2G',   teamA: p('H',0), teamB: p('G',1), winner: null, nextMatchId: 'M20', nextSlot: 'B' },
    // ── RONDA DE 32 (mitad inferior – grupos I a L) ─────────────
    { id: 'M09', round: 'R32', seedLabel: '1I vs 2J',   teamA: p('I',0), teamB: p('J',1), winner: null, nextMatchId: 'M21', nextSlot: 'A' },
    { id: 'M10', round: 'R32', seedLabel: '1K vs 2L',   teamA: p('K',0), teamB: p('L',1), winner: null, nextMatchId: 'M21', nextSlot: 'B' },
    { id: 'M11', round: 'R32', seedLabel: '1J vs 2I',   teamA: p('J',0), teamB: p('I',1), winner: null, nextMatchId: 'M22', nextSlot: 'A' },
    { id: 'M12', round: 'R32', seedLabel: '1L vs 2K',   teamA: p('L',0), teamB: p('K',1), winner: null, nextMatchId: 'M22', nextSlot: 'B' },
    // ── RONDA DE 32 (mejores 8 terceros) ────────────────────────
    { id: 'M13', round: 'R32', seedLabel: '3°1 vs 3°2', teamA: t3(0),    teamB: t3(1),    winner: null, nextMatchId: 'M23', nextSlot: 'A' },
    { id: 'M14', round: 'R32', seedLabel: '3°3 vs 3°4', teamA: t3(2),    teamB: t3(3),    winner: null, nextMatchId: 'M23', nextSlot: 'B' },
    { id: 'M15', round: 'R32', seedLabel: '3°5 vs 3°6', teamA: t3(4),    teamB: t3(5),    winner: null, nextMatchId: 'M24', nextSlot: 'A' },
    { id: 'M16', round: 'R32', seedLabel: '3°7 vs 3°8', teamA: t3(6),    teamB: t3(7),    winner: null, nextMatchId: 'M24', nextSlot: 'B' },

    // ── OCTAVOS ──────────────────────────────────────────────────
    { id: 'M17', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M25', nextSlot: 'A' },
    { id: 'M18', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M25', nextSlot: 'B' },
    { id: 'M19', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M26', nextSlot: 'A' },
    { id: 'M20', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M26', nextSlot: 'B' },
    { id: 'M21', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M27', nextSlot: 'A' },
    { id: 'M22', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M27', nextSlot: 'B' },
    { id: 'M23', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M28', nextSlot: 'A' },
    { id: 'M24', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M28', nextSlot: 'B' },

    // ── CUARTOS ───────────────────────────────────────────────────
    { id: 'M25', round: 'QF', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M29', nextSlot: 'A' },
    { id: 'M26', round: 'QF', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M29', nextSlot: 'B' },
    { id: 'M27', round: 'QF', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M30', nextSlot: 'A' },
    { id: 'M28', round: 'QF', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M30', nextSlot: 'B' },

    // ── SEMIS ─────────────────────────────────────────────────────
    { id: 'M29', round: 'SF', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M31', nextSlot: 'A' },
    { id: 'M30', round: 'SF', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M31', nextSlot: 'B' },

    // ── FINAL ─────────────────────────────────────────────────────
    { id: 'M31', round: 'F',  seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: null,  nextSlot: 'A' },
  ]
}
