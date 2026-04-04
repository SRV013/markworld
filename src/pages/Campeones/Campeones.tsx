import { historyCup } from '../../data/historyCup'
import styles from './Campeones.module.css'

const FLAG_ICON: Record<string, string> = {
  Uruguay: 'uy', Argentina: 'ar', Italia: 'it', Alemania: 'de',
  Brasil: 'br', Inglaterra: 'gb-eng', Francia: 'fr', España: 'es',
  'Alemania Occidental': 'de',
}
function flagIcon(name: string) { return FLAG_ICON[name] ?? 'un' }
function normalize(name: string) {
  return name === 'Alemania Occidental' ? 'Alemania' : name
}

const champions = (historyCup as any[])
  .flatMap((item) => (Array.isArray(item) ? item : [item]))
  .sort((a, b) => b.year - a.year)
  .map(({ year, champion }) => ({ year, champion: normalize(champion) }))

const uniqueChampions = new Set(champions.map((c) => c.champion)).size

export function Campeones() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Campeones Mundiales</h1>
        <p className={styles.subtitle}>
          {champions.length} ediciones · {uniqueChampions} países campeones
        </p>
      </div>

      <div className={styles.grid}>
        {champions.map(({ year, champion }) => (
          <div key={year} className={styles.card}>
            {/* Imagen */}
            <div className={styles.imgBox}>
              <span className={styles.imgNA}>Sin imagen</span>
            </div>

            {/* Info */}
            <div className={styles.cardInfo}>
              <span className={`fi fi-${flagIcon(champion)} ${styles.cardFlag}`} />
              <div className={styles.cardText}>
                <span className={styles.cardName}>{champion}</span>
                <span className={styles.cardYear}>{year}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
