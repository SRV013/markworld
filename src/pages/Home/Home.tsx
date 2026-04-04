import { NavLink } from 'react-router-dom'
import styles from './Home.module.css'

const SECTIONS = [
  {
    to: '/fixture',
    icon: '📋',
    title: 'Fixture 2026',
    desc: 'Los 12 grupos con los 48 equipos del Mundial 2026. Conocé todos los participantes y sus confederaciones.',
  },
  {
    to: '/pronostico',
    icon: '🏆',
    title: 'Tu Pronóstico',
    desc: 'Elegí quién clasifica en cada grupo, rankea los mejores terceros y completá el cuadro eliminatorio hasta el campeón.',
  },
  {
    to: '/mundiales',
    icon: '📖',
    title: 'Historia',
    desc: 'Todas las ediciones desde Uruguay 1930 hasta Qatar 2022. Podios, participantes, campeones históricos y ranking acumulado.',
  },
  {
    to: '/campeones',
    icon: '🥇',
    title: 'Campeones',
    desc: 'Estadísticas detalladas de todos los campeones mundiales. Próximamente.',
    soon: true,
  },
]

export function Home() {
  return (
    <div className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlobe}>🌍</div>
        <h1 className={styles.heroTitle}>
          mark<span className={styles.heroAccent}>World</span>
        </h1>
        <p className={styles.heroSub}>
          Estadísticas, historia y pronósticos del fútbol mundial.
          Toda la Copa del Mundo en un solo lugar.
        </p>
        <NavLink to="/pronostico" className={styles.heroCta}>
          Hacer mi pronóstico →
        </NavLink>
      </section>

      {/* Cards de secciones */}
      <section className={styles.sections}>
        {SECTIONS.map(({ to, icon, title, desc, soon }) => (
          <NavLink
            key={to}
            to={to}
            className={`${styles.card} ${soon ? styles.cardSoon : ''}`}
          >
            <span className={styles.cardIcon}>{icon}</span>
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>
                {title}
                {soon && <span className={styles.soonBadge}>Próximamente</span>}
              </h2>
              <p className={styles.cardDesc}>{desc}</p>
            </div>
            {!soon && <span className={styles.cardArrow}>→</span>}
          </NavLink>
        ))}
      </section>

      {/* Stats rápidas */}
      <section className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statNum}>48</span>
          <span className={styles.statLabel}>Equipos 2026</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>12</span>
          <span className={styles.statLabel}>Grupos</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>104</span>
          <span className={styles.statLabel}>Partidos</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>22</span>
          <span className={styles.statLabel}>Ediciones históricas</span>
        </div>
      </section>

    </div>
  )
}
