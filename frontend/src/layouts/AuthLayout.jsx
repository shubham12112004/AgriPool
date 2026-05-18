import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useLanguage } from '../hooks/useLanguage'

export default function AuthLayout() {
  const { isDark, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  return (
    <div
      className={`min-h-screen grid lg:grid-cols-2 ${
        isDark ? 'bg-dark-bg' : 'bg-neutral-50'
      }`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-emerald-900 text-white"
      >
        <Link to="/" className="relative z-10 flex items-center gap-3 font-bold text-2xl">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            A
          </div>
          AgriPool
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 max-w-md"
        >
          <h2 className="text-4xl font-bold mb-4 leading-tight">{t('app.tagline')}</h2>
          <p className="text-primary-100 text-lg leading-relaxed">
            Connect farmers, drivers, equipment owners and buyers on India&apos;s smartest agriculture platform.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            {[
              { stat: '50K+', label: 'Farmers' },
              { stat: '10K+', label: 'Equipment' },
              { stat: '2M+', label: 'Transactions' },
            ].map(({ stat, label }) => (
              <div key={label} className="rounded-xl bg-white/10 backdrop-blur p-4">
                <p className="text-2xl font-bold">{stat}</p>
                <p className="text-xs text-primary-100 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="absolute inset-0 opacity-30 pointer-events-none">
          <span className="absolute top-20 right-10 text-8xl">🌾</span>
          <span className="absolute bottom-32 left-10 text-7xl">🚜</span>
          <span className="absolute top-1/2 right-1/4 text-6xl">🚛</span>
        </motion.div>
        <p className="relative z-10 text-sm text-primary-200">© 2026 AgriPool</p>
      </motion.div>

      <div className="flex flex-col min-h-screen">
        <div className="flex items-center justify-between p-4 lg:p-6">
          <Link
            to="/"
            className={`lg:hidden flex items-center gap-2 font-bold ${
              isDark ? 'text-primary-400' : 'text-primary-600'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            AgriPool
          </Link>
          <motion.div layout className="flex items-center gap-2 ml-auto">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`text-sm rounded-lg px-2 py-1.5 border ${
                isDark
                  ? 'bg-dark-card border-dark-border text-neutral-200'
                  : 'bg-white border-neutral-200'
              }`}
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="pa">PA</option>
            </select>
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${isDark ? 'bg-dark-card' : 'bg-neutral-100'}`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </motion.div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
