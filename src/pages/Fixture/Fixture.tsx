import { Link } from 'react-router-dom'
import { Groups } from '../../components/Groups/Groups'
import { GROUPS } from '../../data/worldCup2026'
import styles from './Fixture.module.css'

export function Fixture() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Fixture</h1>
          <p className={styles.subtitle}>
            Copa del Mundo 2026 · 48 equipos · 12 grupos
          </p>
        </div>
        <Link to="/pronostico" className={styles.playBtn}>
          🏆 Jugar
        </Link>
      </div>

      <section>
        <h2 className={styles.sectionTitle}>Fase de grupos</h2>
        <Groups groups={GROUPS} />
      </section>
    </div>
  )
}
