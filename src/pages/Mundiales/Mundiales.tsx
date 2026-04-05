import { Helmet } from 'react-helmet-async'
import { historyCup } from '@/data/historyCup'
import mascot2006 from '@/assets/mascotas/2006.png'
import mascot2010 from '@/assets/mascotas/2010.png'
import mascot2014 from '@/assets/mascotas/2014.png'
import mascot2018 from '@/assets/mascotas/2018.png'
import mascot2022 from '@/assets/mascotas/2022.png'
import styles from './Mundiales.module.css'

const MASCOTS: Record<number, string> = {
  2006: mascot2006,
  2010: mascot2010,
  2014: mascot2014,
  2018: mascot2018,
  2022: mascot2022,
}

type TeamResult = { team: string; position: number; points: number }
type WorldCup = {
  year: number
  host: string
  teams_count: number
  champion: string
  runner_up: string
  teams: TeamResult[]
}

// ── Orden: más reciente primero ──────────────────────────────
const cups: WorldCup[] = (historyCup as any[])
  .flatMap((item) => (Array.isArray(item) ? item : [item]))
  .sort((a: WorldCup, b: WorldCup) => b.year - a.year)

// ── Normalización de nombres históricos ──────────────────────
function normalizeTeam(name: string) {
  if (name === 'Alemania Occidental') return 'Alemania'
  return name
}

// ── Mapa nombre → flagIcon (código para flag-icons) ──────────
const FLAG_ICON: Record<string, string> = {
  // Participantes del Mundial 2026
  México: 'mx', Sudáfrica: 'za', 'Corea del Sur': 'kr', 'República Checa': 'cz',
  Canadá: 'ca', 'Bosnia y Herzegovina': 'ba', Qatar: 'qa', Suiza: 'ch',
  Brasil: 'br', Marruecos: 'ma', Haití: 'ht',
  'Estados Unidos': 'us', Paraguay: 'py', Australia: 'au', Turquía: 'tr',
  Alemania: 'de', Curazao: 'cw', 'Costa de Marfil': 'ci', Ecuador: 'ec',
  'Países Bajos': 'nl', Holanda: 'nl', Japón: 'jp', Suecia: 'se', Túnez: 'tn',
  Bélgica: 'be', Egipto: 'eg', Irán: 'ir', 'Nueva Zelanda': 'nz',
  España: 'es', 'Cabo Verde': 'cv', 'Arabia Saudita': 'sa', Uruguay: 'uy',
  Francia: 'fr', Senegal: 'sn', Irak: 'iq', Noruega: 'no',
  Argentina: 'ar', Argelia: 'dz', Austria: 'at', Jordania: 'jo',
  Portugal: 'pt', 'RD Congo': 'cd', Uzbekistán: 'uz', Colombia: 'co',
  Croacia: 'hr', Ghana: 'gh', Panamá: 'pa',
  // UK
  Inglaterra: 'gb-eng', Escocia: 'gb-sct', Gales: 'gb-wls', 'Irlanda del Norte': 'gb-nir',
  // Países sin 2026 pero con historia
  Italia: 'it', Hungría: 'hu', Checoslovaquia: 'cz', Rumania: 'ro',
  Chile: 'cl', Bolivia: 'bo', Perú: 'pe', Cuba: 'cu', Polonia: 'pl',
  Yugoslavia: 'rs', 'Indias Orientales Holandesas': 'id',
  'Alemania Occidental': 'de', 'Alemania Oriental': 'de',
  'Unión Soviética': 'ru', Rusia: 'ru', Ucrania: 'ua',
  Israel: 'il', 'El Salvador': 'sv', Camerún: 'cm', Honduras: 'hn',
  Kuwait: 'kw', Dinamarca: 'dk', Irlanda: 'ie', 'Costa Rica': 'cr',
  'Emiratos Árabes Unidos': 'ae', Nigeria: 'ng', Jamaica: 'jm',
  Bulgaria: 'bg', Eslovaquia: 'sk', Eslovenia: 'si', Serbia: 'rs',
  'Serbia y Montenegro': 'rs', Grecia: 'gr', Islandia: 'is',
  Angola: 'ao', Togo: 'tg', 'Trinidad y Tobago': 'tt',
  Catar: 'qa', Zaire: 'cd', Corea: 'kr', 'Corea del Norte': 'kp',
  China: 'cn', 'Japón/Corea del Sur': 'jp',
}

function flagIcon(country: string): string {
  return FLAG_ICON[normalizeTeam(country)] ?? FLAG_ICON[country] ?? 'un'
}

// ── Stats sidebar ─────────────────────────────────────────────
const championsWins = (() => {
  const wins: Record<string, number> = {}
  for (const cup of cups) {
    const name = normalizeTeam(cup.champion)
    wins[name] = (wins[name] || 0) + 1
  }
  return Object.entries(wins)
    .sort((a, b) => b[1] - a[1])
    .map(([team, count]) => ({ team, count }))
})()

const allTimeRanking = (() => {
  const totals: Record<string, number> = {}
  for (const cup of cups) {
    for (const t of cup.teams) {
      totals[t.team] = (totals[t.team] || 0) + t.points
    }
  }
  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([team, points], i) => ({ rank: i + 1, team, points }))
})()

export function Mundiales() {
  return (
    <div className={styles.page}>
      <Helmet>
        <title>Historia de Mundiales — mark World</title>
        <meta name="description" content="Todas las ediciones de la Copa del Mundo desde Uruguay 1930 hasta Qatar 2022. Podios, participantes y ranking histórico de campeones." />
        <meta property="og:title" content="Historia de Mundiales de Fútbol — mark World" />
        <meta property="og:description" content="22 ediciones, podios completos y ranking acumulado de todos los mundiales." />
      </Helmet>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Historia de Mundiales</h1>
        <p className={styles.subtitle}>{cups.length} ediciones · 1930 – 2022</p>
      </div>

      <div className={styles.layout}>

        {/* ── Columna de copas ── */}
        <div className={styles.cups}>
          {cups.map((cup) => {
            const third = cup.teams.find((t) => t.position === 3)

            return (
              <article key={cup.year} className={styles.cupCard}>

                {/* Header: año + sede */}
                <div className={styles.cupHeader}>
                  <span className={styles.year}>{cup.year}</span>
                  <div className={styles.cupInfo}>
                    <span className={styles.host}>
                      <span className={`fi fi-${flagIcon(cup.host)} ${styles.hostFlag}`} />
                      {cup.host}
                    </span>
                    <span className={styles.teamsCount}>{cup.teams_count} equipos</span>
                  </div>
                  {MASCOTS[cup.year] && (
                    <img
                      src={MASCOTS[cup.year]}
                      alt={`Mascota ${cup.year}`}
                      className={styles.mascot}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>

                {/* Podio */}
                <div className={styles.podium}>
                  <div className={`${styles.podiumItem} ${styles.gold}`}>
                    <span className={styles.podiumRank}>🥇</span>
                    <span className={`fi fi-${flagIcon(cup.champion)} ${styles.podiumFlag}`} />
                    <span className={styles.podiumName}>{normalizeTeam(cup.champion)}</span>
                    <span className={styles.podiumLabel}>Campeón</span>
                  </div>
                  <div className={`${styles.podiumItem} ${styles.silver}`}>
                    <span className={styles.podiumRank}>🥈</span>
                    <span className={`fi fi-${flagIcon(cup.runner_up)} ${styles.podiumFlag}`} />
                    <span className={styles.podiumName}>{cup.runner_up}</span>
                    <span className={styles.podiumLabel}>Subcampeón</span>
                  </div>
                  {third && (
                    <div className={`${styles.podiumItem} ${styles.bronze}`}>
                      <span className={styles.podiumRank}>🥉</span>
                      <span className={`fi fi-${flagIcon(third.team)} ${styles.podiumFlag}`} />
                      <span className={styles.podiumName}>{third.team}</span>
                      <span className={styles.podiumLabel}>Tercer lugar</span>
                    </div>
                  )}
                </div>

                {/* Lista de participantes — sin los 3 primeros (ya están en podio) */}
                <div className={styles.teamsSection}>
                  <p className={styles.teamsSectionTitle}>Equipos participantes</p>
                  <div className={styles.teamsList}>
                    {cup.teams
                      .filter((t) => t.position > 3)
                      .sort((a, b) => a.position - b.position)
                      .map((t) => (
                        <div key={`${cup.year}-${t.team}`} className={styles.teamRow}>
                          <span className={styles.teamPos}>{t.position}</span>
                          <span className={`fi fi-${flagIcon(t.team)} ${styles.teamFlag}`} />
                          <span className={styles.teamName}>{t.team}</span>
                        </div>
                      ))}
                  </div>
                </div>

              </article>
            )
          })}
        </div>

        {/* ── Sidebar ── */}
        <aside className={styles.sidebar}>

          {/* Campeones */}
          <div className={styles.sideSection}>
            <h2 className={styles.sideTitle}>🏆 Copas ganadas</h2>
            <div className={styles.championsList}>
              {championsWins.map(({ team, count }) => (
                <div key={team} className={styles.championRow}>
                  <span className={`fi fi-${flagIcon(team)} ${styles.champFlag}`} />
                  <span className={styles.champName}>{team}</span>
                  <span className={styles.champTrophies}>{'🏆'.repeat(count)}</span>
                  <span className={styles.champCount}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ranking histórico */}
          <div className={styles.sideSection}>
            <h2 className={styles.sideTitle}>📊 Ranking histórico</h2>
            <p className={styles.rankNote}>
              Puntos acumulados según la posición obtenida en cada Mundial.
              A mayor posición final, más puntos.
            </p>
            <div className={styles.rankingList}>
              {allTimeRanking.map(({ rank, team, points }) => (
                <div
                  key={team}
                  className={`${styles.rankRow} ${rank <= 3 ? styles.rankTop : ''}`}
                >
                  <span className={`fi fi-${flagIcon(team)} ${styles.rankFlag}`} />
                  <span className={styles.rankName}>{team}</span>
                  <span className={styles.rankPts}>{points}</span>
                </div>
              ))}
            </div>
          </div>

        </aside>
      </div>
    </div>
  )
}
