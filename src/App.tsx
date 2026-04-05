import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { useTheme } from '@/hooks/useTheme'
import { Header } from '@/components/Header/Header'
import { Fallback } from '@/components/Fallback/Fallback'
import styles from './App.module.css'

const Home       = lazy(() => import('@/pages/Home/Home').then(m => ({ default: m.Home })))
const Mundiales  = lazy(() => import('@/pages/Mundiales/Mundiales').then(m => ({ default: m.Mundiales })))
const Campeones  = lazy(() => import('@/pages/Campeones/Campeones').then(m => ({ default: m.Campeones })))
const Fixture    = lazy(() => import('@/pages/Fixture/Fixture').then(m => ({ default: m.Fixture })))
const Pronostico  = lazy(() => import('@/pages/Pronostico/Pronostico').then(m => ({ default: m.Pronostico })))
const VerFixture  = lazy(() => import('@/pages/VerFixture/VerFixture').then(m => ({ default: m.VerFixture })))

function App() {
  const { theme } = useTheme()

  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className={styles.wrapper} data-theme={theme}>
          <Header />
          <main className={styles.main}>
            <Suspense fallback={<Fallback />}>
              <Routes>
                <Route path="/"           element={<Home />} />
                <Route path="/fixture"    element={<Fixture />} />
                <Route path="/pronostico" element={<Pronostico />} />
                <Route path="/mundiales"  element={<Mundiales />} />
                <Route path="/campeones"  element={<Campeones />} />
                <Route path="/ver/:uid"   element={<VerFixture />} />
              </Routes>
            </Suspense>
          </main>
          <footer className={styles.footer}>
            <span>Todos los derechos reservados.</span>
            <span className={styles.footerDot}>·</span>
            <span>Diseñado por <a href="https://mark-devs.vercel.app/" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>markdevs</a></span>
          </footer>
        </div>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
