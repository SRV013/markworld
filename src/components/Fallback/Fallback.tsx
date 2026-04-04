import styles from './Fallback.module.css'

export function Fallback() {
  return (
    <div className={styles.wrapper} role="status" aria-label="Cargando página">
      <div className={styles.ball}>
        <svg viewBox="0 0 36 36" fill="none" className={styles.svg}>
          <circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="2" />
          <path
            d="M18 1c0 0-5 6-5 17s5 17 5 17M18 1c0 0 5 6 5 17s-5 17-5 17M1 18h34"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          />
          <path
            d="M3.5 9.5C7 11 12 12 18 12s11-1 14.5-2.5M3.5 26.5C7 25 12 24 18 24s11 1 14.5 2.5"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          />
        </svg>
      </div>
      <p className={styles.text}>Cargando…</p>
    </div>
  )
}
