import type { BracketMatch } from '@/types/bracket'

type Picks = Record<string, string[]>

function pick(picks: Picks, group: string, pos: number): string | null {
  return picks[group]?.[pos] ?? null
}

/**
 * Construye el cuadro inicial de 32 partidos según el bracket oficial FIFA 2026.
 *
 * MITAD IZQUIERDA (M01–M08, de arriba hacia abajo):
 *   M01: 1E  vs 3ABCDF   → M17
 *   M02: 1I  vs 3CDFGH   → M17
 *   M03: 2A  vs 2B       → M18
 *   M04: 1F  vs 2C       → M18
 *   M05: 2K  vs 2L       → M19
 *   M06: 1H  vs 2J       → M19
 *   M07: 1D  vs 3BEFIJ   → M20
 *   M08: 1G  vs 3AEHIJ   → M20
 *
 * MITAD DERECHA (M09–M16, de arriba hacia abajo):
 *   M09: 1C  vs 2F       → M21
 *   M10: 2E  vs 2I       → M21
 *   M11: 1A  vs 3CEFHI   → M22
 *   M12: 1L  vs 3EHIJK   → M22
 *   M13: 1J  vs 2H       → M23
 *   M14: 2D  vs 2G       → M23
 *   M15: 1B  vs 3EFGIJ   → M24
 *   M16: 1K  vs 3DEIJL   → M24
 *
 * Asignación de terceros — prioridad alfabética:
 *   Para cada slot, se asigna el tercer lugar del primer grupo del código
 *   que clasificó y aún no fue asignado. Se procesan los slots en orden
 *   de aparición: M01, M02, M07, M08, M11, M12, M15, M16.
 *
 * @param picks       Clasificación de fase de grupos (1°, 2°, 3° por grupo)
 * @param top8thirds  Los 8 equipos terceros clasificados (en cualquier orden)
 */
export function buildInitialBracket(picks: Picks, top8thirds: string[]): BracketMatch[] {
  const p = (g: string, pos: number) => pick(picks, g, pos)

  // ── Lógica de terceros por prioridad alfabética ──────────────
  // Determinar a qué grupo pertenece cada tercero clasificado
  const teamByGroup = new Map<string, string>() // groupId → teamName
  for (const teamName of top8thirds.slice(0, 8)) {
    for (const [groupId, ranking] of Object.entries(picks)) {
      if (ranking[2] === teamName) {
        teamByGroup.set(groupId, teamName)
        break
      }
    }
  }

  const qualifyingGroups = [...teamByGroup.keys()]
  const assigned = new Set<string>()

  /**
   * Para el slot con código dado, retorna el equipo del primer grupo
   * del código que haya clasificado y no haya sido asignado aún.
   */
  const t3 = (code: string): string | null => {
    for (const letter of code) {
      if (qualifyingGroups.includes(letter) && !assigned.has(letter)) {
        assigned.add(letter)
        return teamByGroup.get(letter) ?? null
      }
    }
    return null
  }

  return [
    // ── R32 – MITAD IZQUIERDA ──────────────────────────────────
    { id: 'M01', round: 'R32', seedLabel: '1E vs 3ABCDF', teamA: p('E',0), teamB: t3('ABCDF'), winner: null, nextMatchId: 'M17', nextSlot: 'A' },
    { id: 'M02', round: 'R32', seedLabel: '1I vs 3CDFGH', teamA: p('I',0), teamB: t3('CDFGH'), winner: null, nextMatchId: 'M17', nextSlot: 'B' },
    { id: 'M03', round: 'R32', seedLabel: '2A vs 2B',     teamA: p('A',1), teamB: p('B',1),    winner: null, nextMatchId: 'M18', nextSlot: 'A' },
    { id: 'M04', round: 'R32', seedLabel: '1F vs 2C',     teamA: p('F',0), teamB: p('C',1),    winner: null, nextMatchId: 'M18', nextSlot: 'B' },
    { id: 'M05', round: 'R32', seedLabel: '2K vs 2L',     teamA: p('K',1), teamB: p('L',1),    winner: null, nextMatchId: 'M19', nextSlot: 'A' },
    { id: 'M06', round: 'R32', seedLabel: '1H vs 2J',     teamA: p('H',0), teamB: p('J',1),    winner: null, nextMatchId: 'M19', nextSlot: 'B' },
    { id: 'M07', round: 'R32', seedLabel: '1D vs 3BEFIJ', teamA: p('D',0), teamB: t3('BEFIJ'), winner: null, nextMatchId: 'M20', nextSlot: 'A' },
    { id: 'M08', round: 'R32', seedLabel: '1G vs 3AEHIJ', teamA: p('G',0), teamB: t3('AEHIJ'), winner: null, nextMatchId: 'M20', nextSlot: 'B' },

    // ── R32 – MITAD DERECHA ────────────────────────────────────
    { id: 'M09', round: 'R32', seedLabel: '1C vs 2F',     teamA: p('C',0), teamB: p('F',1),    winner: null, nextMatchId: 'M21', nextSlot: 'A' },
    { id: 'M10', round: 'R32', seedLabel: '2E vs 2I',     teamA: p('E',1), teamB: p('I',1),    winner: null, nextMatchId: 'M21', nextSlot: 'B' },
    { id: 'M11', round: 'R32', seedLabel: '1A vs 3CEFHI', teamA: p('A',0), teamB: t3('CEFHI'), winner: null, nextMatchId: 'M22', nextSlot: 'A' },
    { id: 'M12', round: 'R32', seedLabel: '1L vs 3EHIJK', teamA: p('L',0), teamB: t3('EHIJK'), winner: null, nextMatchId: 'M22', nextSlot: 'B' },
    { id: 'M13', round: 'R32', seedLabel: '1J vs 2H',     teamA: p('J',0), teamB: p('H',1),    winner: null, nextMatchId: 'M23', nextSlot: 'A' },
    { id: 'M14', round: 'R32', seedLabel: '2D vs 2G',     teamA: p('D',1), teamB: p('G',1),    winner: null, nextMatchId: 'M23', nextSlot: 'B' },
    { id: 'M15', round: 'R32', seedLabel: '1B vs 3EFGIJ', teamA: p('B',0), teamB: t3('EFGIJ'), winner: null, nextMatchId: 'M24', nextSlot: 'A' },
    { id: 'M16', round: 'R32', seedLabel: '1K vs 3DEIJL', teamA: p('K',0), teamB: t3('DEIJL'), winner: null, nextMatchId: 'M24', nextSlot: 'B' },

    // ── OCTAVOS DE FINAL (R16) ───────────────────────────────────
    { id: 'M17', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M25', nextSlot: 'A' },
    { id: 'M18', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M25', nextSlot: 'B' },
    { id: 'M19', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M26', nextSlot: 'A' },
    { id: 'M20', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M26', nextSlot: 'B' },
    { id: 'M21', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M27', nextSlot: 'A' },
    { id: 'M22', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M27', nextSlot: 'B' },
    { id: 'M23', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M28', nextSlot: 'A' },
    { id: 'M24', round: 'R16', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M28', nextSlot: 'B' },

    // ── CUARTOS DE FINAL (QF) ────────────────────────────────────
    { id: 'M25', round: 'QF', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M29', nextSlot: 'A' },
    { id: 'M26', round: 'QF', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M29', nextSlot: 'B' },
    { id: 'M27', round: 'QF', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M30', nextSlot: 'A' },
    { id: 'M28', round: 'QF', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M30', nextSlot: 'B' },

    // ── SEMIFINALES ──────────────────────────────────────────────
    { id: 'M29', round: 'SF', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M31', nextSlot: 'A' },
    { id: 'M30', round: 'SF', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: 'M31', nextSlot: 'B' },

    // ── FINAL ────────────────────────────────────────────────────
    { id: 'M31', round: 'F',  seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: null, nextSlot: 'A' },

    // ── 3er PUESTO ───────────────────────────────────────────────
    { id: 'M32', round: '3P', seedLabel: '', teamA: null, teamB: null, winner: null, nextMatchId: null, nextSlot: 'A' },
  ]
}
