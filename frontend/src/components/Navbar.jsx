import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, Globe } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { useTheme } from '../hooks/useTheme'
import { useAuthStore } from '../store/authStore'
import { getDashboardPathForRole } from '../store/authStore'
import Button from './ui/Button'
import { publicNavLinks } from '../config/navigation'

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage()
  const { isDark, toggleTheme } = useTheme()
  const { user, role } = useAuthStore()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  ]

  const dashboardPath = user && role ? getDashboardPathForRole(role) : '/dashboard/farmer'

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? 'bg-dark-bg/90 backdrop-blur-xl border-b border-dark-border shadow-premium'
            : 'bg-white/90 backdrop-blur-xl border-b border-neutral-200/80 shadow-md'
          : isDark
            ? 'bg-transparent'
            : 'bg-transparent'
      }`}
    >
      <motion.div
        initial={false}
        animate={scrolled ? { y: 0 } : { y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          layout
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? 'h-14' : 'h-16'
          }`}
        >
          <Link
            to="/"
            className={`flex items-center gap-2.5 font-bold text-xl transition-transform hover:scale-[1.02] ${
              isDark ? 'text-neutral-50' : 'text-neutral-900'
            }`}
          >
            <motion.div
              whileHover={{ rotate: 5 }}
              className="w-9 h-9 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold shadow-glow"
            >
              A
            </motion.div>
            <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-300">
              AgriPool
            </span>
          </Link>

          <motion.div layout className="hidden md:flex items-center gap-8">
            {publicNavLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isDark
                    ? 'text-neutral-300 hover:text-primary-400'
                    : 'text-neutral-600 hover:text-primary-600'
                }`}
              >
                {t(link.label)}
              </a>
            ))}
          </motion.div>

          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-colors ${
                isDark
                  ? 'bg-dark-card/80 hover:bg-dark-card border border-dark-border'
                  : 'bg-neutral-100 hover:bg-neutral-200'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            <motion.div layout className="relative hidden sm:block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setLangOpen(!langOpen)}
                className={`p-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors ${
                  isDark
                    ? 'bg-dark-card/80 hover:bg-dark-card border border-dark-border'
                    : 'bg-neutral-100 hover:bg-neutral-200'
                }`}
              >
                <Globe size={18} />
                {language.toUpperCase()}
              </motion.button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl overflow-hidden ${
                      isDark
                        ? 'bg-dark-card border border-dark-border'
                        : 'bg-white border border-neutral-200'
                    }`}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code)
                          setLangOpen(false)
                        }}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 text-sm transition-colors ${
                          language === lang.code
                            ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                            : isDark
                              ? 'hover:bg-dark-border text-neutral-200'
                              : 'hover:bg-neutral-50 text-neutral-700'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        {lang.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="hidden sm:flex items-center gap-2">
              {user ? (
                <Link to={dashboardPath}>
                  <Button variant="primary" size="md">
                    {t('nav.dashboard')}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="md">
                      {t('auth.signin')}
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="md">
                      {t('auth.signup')}
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden border-t py-4 ${
                isDark ? 'border-dark-border' : 'border-neutral-200'
              }`}
            >
              <motion.div layout className="space-y-1">
                {publicNavLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl font-medium ${
                      isDark ? 'hover:bg-dark-card' : 'hover:bg-neutral-100'
                    }`}
                  >
                    {t(link.label)}
                  </a>
                ))}
                <motion.div layout className="pt-4 mt-2 border-t border-neutral-200 dark:border-dark-border space-y-2 px-1">
                  {user ? (
                    <Link to={dashboardPath} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="primary" fullWidth>
                        {t('nav.dashboard')}
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" fullWidth>
                          {t('auth.signin')}
                        </Button>
                      </Link>
                      <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="primary" fullWidth>
                          {t('auth.signup')}
                        </Button>
                      </Link>
                    </>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  )
}
