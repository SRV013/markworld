import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { historyCup } from '@/data/historyCup'
import { PLAYERS_BY_YEAR } from '@/data/championsPlayers'
import img1930 from '@/assets/1930.jpeg'
import img1934 from '@/assets/1934.jpeg'
import img1938 from '@/assets/1938.jpeg'
import img1950 from '@/assets/1950.jpeg'
import img1954 from '@/assets/1954.webp'
import img1958 from '@/assets/1958.jpeg'
import img1962 from '@/assets/1962.jpeg'
import img1966 from '@/assets/1966.jpeg'
import img1970 from '@/assets/1970.jpeg'
import img1974 from '@/assets/1974.webp'
import img1978 from '@/assets/1978.webp'
import img1982 from '@/assets/1982.webp'
import img1986 from '@/assets/1986.webp'
import img1990 from '@/assets/1990.jpeg'
import img1994 from '@/assets/1994.webp'
import img1998 from '@/assets/1998.avif'
import img2002 from '@/assets/2002.webp'
import img2006 from '@/assets/2006.webp'
import img2010 from '@/assets/2010.webp'
import img2014 from '@/assets/2014.avif'
import img2018 from '@/assets/2018.webp'
import img2022 from '@/assets/2022.avif'
import styles from './Campeones.module.css'

const IMAGES: Record<number, string> = {
  1930: img1930,
  1934: img1934,
  1938: img1938,
  1950: img1950,
  1954: img1954,
  1958: img1958,
  1962: img1962,
  1966: img1966,
  1970: img1970,
  1974: img1974,
  1978: img1978,
  1982: img1982,
  1986: img1986,
  1990: img1990,
  1994: img1994,
  1998: img1998,
  2002: img2002,
  2006: img2006,
  2010: img2010,
  2014: img2014,
  2018: img2018,
  2022: img2022,
}

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
  const [modalYear, setModalYear] = useState<number | null>(null)
  const modalData = modalYear !== null ? PLAYERS_BY_YEAR[modalYear] : null

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Campeones Mundiales de Fútbol — mark World</title>
        <meta name="description" content="Todos los campeones de la Copa del Mundo desde Uruguay 1930 hasta Argentina 2022. Planteles, jugadores y técnicos de cada selección campeona." />
        <meta property="og:title" content="Campeones Mundiales — mark World" />
        <meta property="og:description" content="22 selecciones campeonas, sus planteles completos y dorsales. Fútbol mundial desde 1930." />
      </Helmet>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Campeones Mundiales</h1>
        <p className={styles.subtitle}>
          {champions.length} ediciones · {uniqueChampions} países campeones
        </p>
      </div>

      <div className={styles.grid}>
        {champions.map(({ year, champion }) => (
          <div
            key={year}
            className={styles.card}
            onClick={() => setModalYear(year)}
          >
            {/* Imagen */}
            <div className={styles.imgBox}>
              {IMAGES[year]
                ? <img src={IMAGES[year]} alt={`${champion} ${year}`} className={styles.img} loading="lazy" decoding="async" />
                : <span className={styles.imgNA}>Sin imagen</span>
              }
              <div className={styles.eyeOverlay}>
                <svg className={styles.eyeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
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

      {/* Modal */}
      {modalData && (
        <div className={styles.modalBackdrop} onClick={() => setModalYear(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setModalYear(null)} aria-label="Cerrar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className={styles.modalHeader}>
              <span className={`fi fi-${flagIcon(modalData.campeon)} ${styles.modalFlag}`} />
              <div>
                <h2 className={styles.modalTitle}>{modalData.campeon}</h2>
                <p className={styles.modalSub}>Campeón {modalData.anio}</p>
              </div>
            </div>
            <p className={styles.modalDt}>DT: {modalData.dt}</p>
            <ul className={styles.playerList}>
              {modalData.jugadores.map((jugador) => (
                <li key={jugador.nombre} className={styles.playerItem}>
                  <span className={styles.playerNum}>{jugador.numero}</span>
                  <span>{jugador.nombre}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
