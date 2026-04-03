import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { Header } from './components/Header/Header'
import { Fixture } from './pages/Fixture/Fixture'
import { Pronostico } from './pages/Pronostico/Pronostico'
import styles from './App.module.css'

function App() {
  const { theme } = useTheme()

  return (
    <BrowserRouter>
      <div className={styles.wrapper} data-theme={theme}>
        <Header />
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/fixture" element={<Fixture />} />
            <Route path="/pronostico" element={<Pronostico />} />
            <Route path="/historia" element={<div>Historia</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
