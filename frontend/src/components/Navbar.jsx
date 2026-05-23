import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, Globe } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { useTheme } from '../hooks/useTheme'
import { useAuthStore } from '../store/authStore'
import { getDashboardPathForRole } from '../store/authStore'
import Button from './ui/Button'
import AgriPoolLogo from './ui/AgriPoolLogo'
import { publicNavLinks } from '../config/navigation'

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage()
  const { isDark, toggleTheme } = useTheme()
  const { user, role, logout } = useAuthStore()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const location = useLocation()
  const isLandingPage = location.pathname === '/'
  const isTransparentDark = isLandingPage && !scrolled

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  ]

  const getAvatarUrl = (avatar) => {
    if (!avatar) return null
    if (avatar.startsWith('http')) return avatar
    if (avatar.startsWith('/')) return avatar
    return `/storage/${avatar}`
  }

  const dashboardPath = user ? getDashboardPathForRole(role) : '/register'

  // Only show the buttons container after hydration is complete
  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
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
              isTransparentDark || isDark ? 'text-neutral-50' : 'text-neutral-900'
            }`}
          >
            <motion.div
              whileHover={{ rotate: 5 }}
            >
              <AgriPoolLogo className="w-9 h-9" />
            </motion.div>
            <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
              isTransparentDark || isDark
                ? 'from-primary-400 to-primary-300'
                : 'from-primary-600 to-primary-500'
            }`}>
              AgriPool
            </span>
          </Link>

          <motion.div layout className="hidden md:flex items-center gap-8">
            {publicNavLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isTransparentDark
                    ? 'text-neutral-200 hover:text-white'
                    : isDark
                      ? 'text-neutral-300 hover:text-primary-400'
                      : 'text-neutral-700 hover:text-primary-600'
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
                isTransparentDark
                  ? 'border border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm'
                  : isDark
                    ? 'bg-dark-card/80 hover:bg-dark-card border border-dark-border text-neutral-300'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
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
                  isTransparentDark
                    ? 'border border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm'
                    : isDark
                      ? 'bg-dark-card/80 hover:bg-dark-card border border-dark-border text-neutral-300'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
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

            {isHydrated && user && !isLandingPage ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  {getAvatarUrl(user.avatar) ? (
                    <img
                      src={getAvatarUrl(user.avatar)}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-primary-500 shadow-sm"
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                  ) : null}
                  <div
                    style={{ display: getAvatarUrl(user.avatar) ? 'none' : 'flex' }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white font-bold flex items-center justify-center border-2 border-primary-500 shadow-sm"
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl overflow-hidden z-50 border ${
                          isDark
                            ? 'bg-dark-card border-dark-border text-neutral-200'
                            : 'bg-white border-neutral-200 text-neutral-700'
                        }`}
                      >
                        <div className={`px-4 py-3 border-b ${isDark ? 'border-dark-border' : 'border-neutral-100'}`}>
                          <p className="text-sm font-semibold truncate">{user.name}</p>
                          <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-primary-500/10 text-primary-500">
                            {user.role}
                          </span>
                        </div>
                        <div className="py-1">
                          <Link
                            to={getDashboardPathForRole(user.role)}
                            onClick={() => setUserMenuOpen(false)}
                            className={`flex w-full px-4 py-2 text-sm text-left transition-colors ${
                              isDark ? 'hover:bg-dark-border' : 'hover:bg-neutral-50'
                            }`}
                          >
                            Dashboard
                          </Link>
                          <Link
                            to="/settings"
                            onClick={() => setUserMenuOpen(false)}
                            className={`flex w-full px-4 py-2 text-sm text-left transition-colors ${
                              isDark ? 'hover:bg-dark-border' : 'hover:bg-neutral-50'
                            }`}
                          >
                            Settings
                          </Link>
                        </div>
                        <div className={`border-t py-1 ${isDark ? 'border-dark-border' : 'border-neutral-100'}`}>
                          <button
                            onClick={() => {
                              setUserMenuOpen(false)
                              logout()
                            }}
                            className="flex w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-red-500/10 transition-colors font-medium"
                          >
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    size="md"
                    className={isTransparentDark ? '!text-neutral-100 hover:!text-white hover:bg-white/10' : ''}
                  >
                    {t('auth.signin')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="md">
                    {t('auth.signup')}
                  </Button>
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2.5 rounded-xl transition-colors ${
                isTransparentDark
                  ? 'text-white hover:bg-white/10'
                  : isDark
                    ? 'text-neutral-300 hover:text-white hover:bg-dark-card'
                    : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
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
                  {user && !isLandingPage ? (
                    <>
                      <div className="px-3 py-2 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-500 text-white font-bold flex items-center justify-center">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold truncate">{user.name}</p>
                          <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                        </div>
                      </div>
                      <Link to={getDashboardPathForRole(user.role)} onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" fullWidth className="mt-2">
                          Dashboard
                        </Button>
                      </Link>
                      <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" fullWidth>
                          Settings
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        fullWidth
                        className="text-red-500 hover:bg-red-500/10"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          logout()
                        }}
                      >
                        Logout
                      </Button>
                    </>
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
