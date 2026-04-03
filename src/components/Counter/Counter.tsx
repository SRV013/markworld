import { useCounterStore } from '../../store/counterStore'
import styles from './Counter.module.css'

export function Counter() {
  const { count, increment, decrement, reset } = useCounterStore()

  return (
    <div className={styles.card}>
      <h2 className={styles.label}>Contador</h2>
      <span className={styles.value}>{count}</span>
      <div className={styles.actions}>
        <button className={styles.btn} onClick={decrement}>−</button>
        <button className={styles.btn} onClick={reset}>Reset</button>
        <button className={`${styles.btn} ${styles.primary}`} onClick={increment}>+</button>
      </div>
    </div>
  )
}
