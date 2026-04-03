import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import styles from './Header.module.css'

const NAV_LINKS = [
  { to: '/',        label: 'Home'     },
  { to: '/fixture', label: 'Fixture'  },
  { to: '/historia',label: 'Historia' },
]

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className={styles.header}>
        {/* Burger — solo mobile */}
        <button
          className={styles.burger}
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
        >
          <span /><span /><span />
        </button>

        <NavLink to="/" className={styles.logo} onClick={closeMenu}>
          <span className={styles.logoMark}>mark</span>
          <span className={styles.logoWord}>World</span>
        </NavLink>

        {/* Nav desktop */}
        <nav className={styles.nav}>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            className={styles.iconBtn}
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
          >
            {theme === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          <button className={styles.iconBtn} aria-label="Perfil de usuario">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`${styles.overlay} ${menuOpen ? styles.overlayVisible : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Drawer mobile */}
      <aside className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        <button
          className={styles.drawerClose}
          onClick={closeMenu}
          aria-label="Cerrar menú"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <NavLink to="/" className={styles.logo} onClick={closeMenu}>
          <span className={styles.logoMark}>mark</span>
          <span className={styles.logoWord}>World</span>
        </NavLink>

        <nav className={styles.drawerNav}>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `${styles.drawerLink} ${isActive ? styles.drawerLinkActive : ''}`
              }
              onClick={closeMenu}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
