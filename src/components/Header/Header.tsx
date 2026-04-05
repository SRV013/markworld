import { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useTheme } from '@/hooks/useTheme'
import { useAuthStore } from '@/store/authStore'
import styles from './Header.module.css'

const NAV_LINKS = [
  { to: '/',          label: 'Home'        },
  { to: '/mundiales', label: 'Mundiales'   },
  { to: '/campeones', label: 'Campeones'   },
  { to: '/fixture',   label: 'Fixture 2026'},
]

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const { user, signInWithGoogle, signOut } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const submenuRef = useRef<HTMLDivElement>(null)

  // Cerrar submenu al clickear fuera
  useEffect(() => {
    if (!submenuOpen) return
    const handler = (e: MouseEvent) => {
      if (!submenuRef.current?.contains(e.target as Node)) {
        setSubmenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [submenuOpen])

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
          <span className={styles.logoMark}>{'</> '}mark</span>
          <span className={styles.logoWord}>world</span>
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

          <div className={styles.avatarWrap} ref={submenuRef}>
            <button
              className={user ? styles.avatarBtn : styles.iconBtn}
              onClick={() => setSubmenuOpen((v) => !v)}
              aria-label={user ? (user.displayName ?? 'Menú usuario') : 'Iniciar sesión'}
              title={user?.displayName ?? ''}
            >
              {user
                ? user.photoURL
                  ? <img src={user.photoURL} className={styles.avatar} alt={user.displayName ?? ''} referrerPolicy="no-referrer" />
                  : <span className={styles.avatarInitial}>{(user.displayName ?? '?')[0]}</span>
                : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )
              }
            </button>

            {submenuOpen && (
              <div className={styles.submenu}>
                {user ? (
                  <>
                    <div className={styles.submenuUser}>
                      <span className={styles.submenuName}>{user.displayName}</span>
                    </div>
                    <NavLink
                      to="/pronostico"
                      className={styles.submenuItem}
                      onClick={() => setSubmenuOpen(false)}
                    >
                      🏆 Ver mi pronóstico
                    </NavLink>
                    <button
                      className={styles.submenuItem}
                      onClick={() => { signOut(); setSubmenuOpen(false) }}
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <div className={styles.loginPanel}>
                    <p className={styles.loginHint}>Iniciá sesión para guardar tu pronóstico</p>
                    <button
                      className={styles.googleBtn}
                      onClick={() => { signInWithGoogle(); setSubmenuOpen(false) }}
                    >
                      <svg className={styles.googleIcon} viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                      </svg>
                      Iniciar sesión con Google
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
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
