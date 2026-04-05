import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Groups } from '@/components/Groups/Groups'
import { GROUPS } from '@/data/worldCup2026'
import { useAuthStore } from '@/store/authStore'
import styles from './Fixture.module.css'

export function Fixture() {
  const { user, savedFixture } = useAuthStore()
  const hasSaved = !!user && !!savedFixture

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Fixture Copa del Mundo 2026 — mark World</title>
        <meta name="description" content="Fixture completo de la Copa del Mundo 2026. 48 equipos, 12 grupos, sedes en USA, México y Canadá." />
        <meta property="og:title" content="Fixture Mundial 2026 — mark World" />
        <meta property="og:description" content="Todos los grupos y equipos del Mundial de Fútbol 2026 con 48 selecciones." />
      </Helmet>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Fixture</h1>
          <p className={styles.subtitle}>
            Copa del Mundo 2026 · 48 equipos · 12 grupos
          </p>
        </div>
        <Link to="/pronostico" className={styles.playBtn}>
          🏆 {hasSaved ? 'Mi pronóstico' : 'Jugar'}
        </Link>
      </div>

      <section>
        <h2 className={styles.sectionTitle}>Fase de grupos</h2>
        <Groups groups={GROUPS} />
      </section>
    </div>
  )
}
