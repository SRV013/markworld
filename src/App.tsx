import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { Header } from './components/Header/Header'
import { Home } from './pages/Home/Home'
import { Fixture } from './pages/Fixture/Fixture'
import { Pronostico } from './pages/Pronostico/Pronostico'
import { Mundiales } from './pages/Mundiales/Mundiales'
import { Campeones } from './pages/Campeones/Campeones'
import styles from './App.module.css'

function App() {
  const { theme } = useTheme()

  return (
    <BrowserRouter>
      <div className={styles.wrapper} data-theme={theme}>
        <Header />
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fixture" element={<Fixture />} />
            <Route path="/pronostico" element={<Pronostico />} />
            <Route path="/mundiales" element={<Mundiales />} />
            <Route path="/campeones" element={<Campeones />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
