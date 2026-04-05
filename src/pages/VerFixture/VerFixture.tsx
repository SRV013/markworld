import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { Helmet } from 'react-helmet-async'
import { db } from '@/lib/firebase'
import { Bracket } from '@/components/Bracket/Bracket'
import { GROUPS } from '@/data/worldCup2026'
import type { SavedFixture } from '@/store/authStore'
import styles from './VerFixture.module.css'

const flagIconMap = new Map<string, string>()
GROUPS.forEach((g) => g.teams.forEach((t) => flagIconMap.set(t.name, t.flagIcon)))

export function VerFixture() {
  const { uid } = useParams<{ uid: string }>()
  const [fixture, setFixture] = useState<SavedFixture | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    if (!uid) return
    getDoc(doc(db, 'pronosticos', uid))
      .then((snap) => {
        if (snap.exists()) setFixture(snap.data() as SavedFixture)
        else setError('no-encontrado')
      })
      .catch((e) => {
        console.error('VerFixture error:', e)
        setError(e?.code === 'permission-denied' ? 'sin-permiso' : 'no-encontrado')
      })
      .finally(() => setLoading(false))
  }, [uid])

  if (loading) return <div className={styles.center}>Cargando pronóstico…</div>

  if (error === 'sin-permiso') {
    return (
      <div className={styles.center}>
        Sin permisos para leer este fixture.<br />
        Actualizá las reglas de Firestore.
      </div>
    )
  }

  if (error || !fixture) {
    return <div className={styles.center}>Fixture no encontrado</div>
  }

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Pronóstico de {fixture.displayName} — mark World</title>
      </Helmet>

      <div className={styles.header}>
        <div className={styles.owner}>
          {fixture.photoURL && (
            <img
              src={fixture.photoURL}
              className={styles.ownerAvatar}
              alt={fixture.displayName ?? ''}
              referrerPolicy="no-referrer"
            />
          )}
          <div>
            <p className={styles.ownerLabel}>Pronóstico de</p>
            <h1 className={styles.ownerName}>{fixture.displayName}</h1>
          </div>
        </div>

        {fixture.champion && (
          <div className={styles.champion}>
            <span className={`fi fi-${flagIconMap.get(fixture.champion) ?? 'un'} ${styles.championFlag}`} />
            🏆 {fixture.champion}
          </div>
        )}
      </div>

      <Bracket locked matches={fixture.matches} />
    </div>
  )
}
