import { NavLink } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import wordsImg from '@/assets/words.png'
import styles from './Home.module.css'

const SECTIONS = [
  {
    to: '/mundiales',
    icon: '📖',
    title: 'Mundiales',
    desc: 'Todas las ediciones desde Uruguay 1930 hasta Qatar 2022. Podios, participantes, campeones históricos y ranking acumulado.',
  },
  {
    to: '/campeones',
    icon: '🥇',
    title: 'Todos los Campeones',
    desc: 'Los 22 campeones del mundo. Planteles completos con dorsales, técnicos y fotos de cada edición.',
  },
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
    desc: 'Armá tu bracket completo, elegí tu campeón y compartilo con tus amigos. ¿Quién acierta más?',
    promo: true,
  },
]

export function Home() {
  return (
    <div className={styles.page}>
      <Helmet>
        <title>Mark World — Estadísticas e Historia de los Mundiales de Fútbol</title>
        <meta name="description" content="Estadísticas, historia y pronósticos de todos los Mundiales de Fútbol desde 1930. Fixture 2026, campeones históricos, brackets y más." />
        <meta property="og:title" content="mark World — Mundiales de Fútbol" />
        <meta property="og:description" content="Toda la Copa del Mundo en un solo lugar. 22 ediciones, 48 equipos 2026, pronósticos y estadísticas." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero */}
      <section className={styles.hero}>
        <img src={wordsImg} className={styles.heroGlobe} alt="mark World" />
        <h1 className={styles.heroTitle}>
          mark<span className={styles.heroAccent}>World</span>
        </h1>
        <p className={styles.heroSub}>
          Estadísticas, historia y pronósticos del fútbol mundial.
          Toda la Copa del Mundo en un solo lugar.
        </p>
      </section>

      {/* Cards de secciones */}
      <section className={styles.sections}>
        {SECTIONS.map(({ to, icon, title, desc, promo }) => (
          <NavLink key={to} to={to} className={`${styles.card} ${promo ? styles.cardPromo : ''}`}>
            <span className={styles.cardIcon}>{icon}</span>
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{title}</h2>
              <p className={styles.cardDesc}>{desc}</p>
            </div>
            <span className={styles.cardArrow}>→</span>
          </NavLink>
        ))}
      </section>

    </div>
  )
}
