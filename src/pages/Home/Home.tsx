import { NavLink } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuthStore } from '@/store/authStore'
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
    desc: 'Los 22 campeones del mundo. Planteles completos con dorsales, técnicos y fotos de cada edición.',
  },
]

export function Home() {
  const { user, savedFixture } = useAuthStore()
  const hasSaved = !!user && !!savedFixture

  return (
    <div className={styles.page}>
      <Helmet>
        <title>mark World — Estadísticas e Historia de los Mundiales de Fútbol</title>
        <meta name="description" content="Estadísticas, historia y pronósticos de todos los Mundiales de Fútbol desde 1930. Fixture 2026, campeones históricos, brackets y más." />
        <meta property="og:title" content="mark World — Mundiales de Fútbol" />
        <meta property="og:description" content="Toda la Copa del Mundo en un solo lugar. 22 ediciones, 48 equipos 2026, pronósticos y estadísticas." />
        <meta property="og:type" content="website" />
      </Helmet>

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
          {hasSaved ? 'Ver mi pronóstico →' : 'Hacer mi pronóstico →'}
        </NavLink>
      </section>

      {/* Cards de secciones */}
      <section className={styles.sections}>
        {SECTIONS.map(({ to, icon, title, desc }) => (
          <NavLink key={to} to={to} className={styles.card}>
            <span className={styles.cardIcon}>{icon}</span>
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{title}</h2>
              <p className={styles.cardDesc}>{desc}</p>
            </div>
            <span className={styles.cardArrow}>→</span>
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
