import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  const links = [
    { path: '/',         label: 'Home'                 },
    { path: '/predict',  label: 'Match Predictor'      },
    { path: '/groups',   label: 'Group Stage'          },
    { path: '/simulate', label: 'Tournament Simulator' },
  ]

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-surface/80 glass-bg shadow-md' : 'bg-surface/60 glass-bg'
      }`}
    >
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
  <Link to="/">
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img src="/logo.png" alt="Cup'26" className="h-10 w-auto" />
    </motion.div>
  </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(link => {
            const active = location.pathname === link.path
            return (
              <Link key={link.path} to={link.path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                    active
                      ? 'bg-primary-fixed text-on-primary-fixed-variant border-b-4 border-primary'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {link.label}
                </motion.div>
              </Link>
            )
          })}
        </div>

        {/* Mobile hamburger */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-on-surface-variant p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="material-symbols-outlined">
            {menuOpen ? 'close' : 'menu'}
          </span>
        </motion.button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-surface/95 glass-bg border-t border-outline-variant"
          >
            <div className="flex flex-col px-6 py-4 gap-2">
              {links.map(link => {
                const active = location.pathname === link.path
                return (
                  <Link key={link.path} to={link.path}>
                    <motion.div
                      whileTap={{ scale: 0.97 }}
                      className={`px-4 py-3 rounded-full font-semibold transition-all ${
                        active
                          ? 'bg-primary-fixed text-on-primary-fixed-variant'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      {link.label}
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar