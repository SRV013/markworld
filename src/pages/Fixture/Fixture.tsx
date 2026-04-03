import styles from './Fixture.module.css'

export function Fixture() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Fixture</h1>
        <p className={styles.subtitle}>Próximos partidos y resultados</p>
      </div>

      <div className={styles.content}>
        {/* Aquí va el contenido del fixture */}
      </div>
    </div>
  )
}
