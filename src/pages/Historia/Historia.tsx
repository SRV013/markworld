import { historyCup } from '../../data/historyCup'
import styles from './Historia.module.css'

type TeamResult = { team: string; position: number; points: number }
type WorldCup = {
  year: number
  host: string
  teams_count: number
  champion: string
  runner_up: string
  teams: TeamResult[]
}

const cups: WorldCup[] = (historyCup as any[])
  .flatMap((item) => (Array.isArray(item) ? item : [item]))
  .sort((a: WorldCup, b: WorldCup) => a.year - b.year)

// Normaliza "Alemania Occidental" → "Alemania" para agrupar títulos
function normalizeTeam(name: string) {
  return name === 'Alemania Occidental' ? 'Alemania' : name
}

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

const FLAGS: Record<string, string> = {
  Uruguay: '🇺🇾', Argentina: '🇦🇷', 'Estados Unidos': '🇺🇸', Yugoslavia: '🇾🇺',
  Chile: '🇨🇱', Brasil: '🇧🇷', Francia: '🇫🇷', Rumania: '🇷🇴',
  Paraguay: '🇵🇾', Perú: '🇵🇪', Bélgica: '🇧🇪', Bolivia: '🇧🇴',
  México: '🇲🇽', Italia: '🇮🇹', Checoslovaquia: '🇨🇿', Alemania: '🇩🇪',
  Austria: '🇦🇹', España: '🇪🇸', Hungría: '🇭🇺', Suiza: '🇨🇭',
  Suecia: '🇸🇪', Holanda: '🇳🇱', Egipto: '🇪🇬', Cuba: '🇨🇺',
  Polonia: '🇵🇱', Noruega: '🇳🇴', 'Indias Orientales Holandesas': '🇮🇩',
  Inglaterra: '🏴󠁧󠁢󠁥󠁮󠁧', Escocia: '🏴󠁧󠁢󠁳󠁣󠁴', Gales: '🏴󠁧󠁢󠁷󠁬󠁳',
  'Alemania Occidental': '🇩🇪', 'Unión Soviética': '🇷🇺', 'Irlanda del Norte': '🇬🇧',
  Portugal: '🇵🇹', 'Corea del Norte': '🇰🇵', Israel: '🇮🇱',
  Marruecos: '🇲🇦', 'El Salvador': '🇸🇻', 'Alemania Oriental': '🇩🇪',
  Irán: '🇮🇷', Túnez: '🇹🇳', Argelia: '🇩🇿', Camerún: '🇨🇲',
  Honduras: '🇭🇳', 'Nueva Zelanda': '🇳🇿', Kuwait: '🇰🇼',
  Dinamarca: '🇩🇰', 'Corea del Sur': '🇰🇷', Irak: '🇮🇶', Canadá: '🇨🇦',
  Irlanda: '🇮🇪', 'Costa Rica': '🇨🇷', Colombia: '🇨🇴', 'Emiratos Árabes Unidos': '🇦🇪',
  Croacia: '🇭🇷', Nigeria: '🇳🇬', Sudáfrica: '🇿🇦',
  'Arabia Saudita': '🇸🇦', Jamaica: '🇯🇲', Bulgaria: '🇧🇬',
  Turquía: '🇹🇷', Senegal: '🇸🇳', Japón: '🇯🇵', Ecuador: '🇪🇨',
  Rusia: '🇷🇺', Ucrania: '🇺🇦', Ghana: '🇬🇭', Australia: '🇦🇺',
  'República Checa': '🇨🇿', Angola: '🇦🇴', Togo: '🇹🇬',
  'Trinidad y Tobago': '🇹🇹', 'Serbia y Montenegro': '🇷🇸',
  Eslovaquia: '🇸🇰', 'Costa de Marfil': '🇨🇮', Eslovenia: '🇸🇮',
  Serbia: '🇷🇸', Grecia: '🇬🇷', 'Bosnia y Herzegovina': '🇧🇦',
  Islandia: '🇮🇸', Panamá: '🇵🇦', Catar: '🇶🇦', Zaire: '🇨🇩',
  Haití: '🇭🇹', Corea: '🇰🇷', China: '🇨🇳',
  'Japón/Corea del Sur': '🇯🇵',
}

function flag(country: string) {
  return FLAGS[normalizeTeam(country)] ?? FLAGS[country] ?? '🏳️'
}

const TROPHIES = ['🥇', '🥈', '🥉']

export function Historia() {
  return (
    <div className={styles.page}>
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
                      {flag(cup.host)} {cup.host}
                    </span>
                    <span className={styles.teamsCount}>
                      {cup.teams_count} equipos
                    </span>
                  </div>
                </div>

                {/* Podio */}
                <div className={styles.podium}>
                  <div className={`${styles.podiumItem} ${styles.gold}`}>
                    <span className={styles.podiumRank}>🥇</span>
                    <span className={styles.podiumFlag}>{flag(cup.champion)}</span>
                    <span className={styles.podiumName}>{cup.champion}</span>
                    <span className={styles.podiumLabel}>Campeón</span>
                  </div>
                  <div className={`${styles.podiumItem} ${styles.silver}`}>
                    <span className={styles.podiumRank}>🥈</span>
                    <span className={styles.podiumFlag}>{flag(cup.runner_up)}</span>
                    <span className={styles.podiumName}>{cup.runner_up}</span>
                    <span className={styles.podiumLabel}>Subcampeón</span>
                  </div>
                  {third && (
                    <div className={`${styles.podiumItem} ${styles.bronze}`}>
                      <span className={styles.podiumRank}>🥉</span>
                      <span className={styles.podiumFlag}>{flag(third.team)}</span>
                      <span className={styles.podiumName}>{third.team}</span>
                      <span className={styles.podiumLabel}>Tercer lugar</span>
                    </div>
                  )}
                </div>

                {/* Lista de participantes */}
                <div className={styles.teamsSection}>
                  <p className={styles.teamsSectionTitle}>Equipos participantes</p>
                  <div className={styles.teamsList}>
                    {cup.teams
                      .slice()
                      .sort((a, b) => a.position - b.position)
                      .map((t) => (
                        <div key={`${cup.year}-${t.team}`} className={styles.teamRow}>
                          <span className={styles.teamPos}>{t.position}</span>
                          <span className={styles.teamFlag}>{flag(t.team)}</span>
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
                  <span className={styles.champFlag}>{flag(team)}</span>
                  <span className={styles.champName}>{team}</span>
                  <span className={styles.champTrophies}>
                    {'🏆'.repeat(count)}
                  </span>
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
                  <span className={styles.rankNum}>
                    {rank <= 3 ? TROPHIES[rank - 1] : rank}
                  </span>
                  <span className={styles.rankFlag}>{flag(team)}</span>
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
