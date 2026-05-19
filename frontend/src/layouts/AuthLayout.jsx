import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sun, Moon, ShieldCheck, MessageCircle, MapPin, Truck } from 'lucide-react'
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
        className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-[#02060f] text-white"
      >
        {/* Aurora Background */}
        <div 
          className="absolute inset-[-30%] -z-10 animate-aurora opacity-40 blur-[90px] pointer-events-none" 
          style={{ background: 'conic-gradient(from 30deg at 40% 30%, rgba(58,124,255,0), rgba(58,124,255,0.25), rgba(36,208,255,0), rgba(16,200,166,0.25), rgba(58,124,255,0))' }}
        />
        <div className="absolute top-0 left-0 w-120 h-120 bg-agri-blue/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-120 h-120 bg-agri-green/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <Link to="/" className="relative z-10 flex items-center gap-3 font-bold text-2xl group">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-agri-blue to-agri-cyan flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(43,95,191,0.4)]">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <span className="font-['Outfit'] tracking-tight group-hover:text-glow transition-all">AgriPool</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 max-w-md"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-transparent bg-clip-text bg-linear-to-r from-agri-green via-agri-cyan to-white animate-pulse-soft">
            {t('app.tagline')}
          </h2>
          <p className="text-neutral-300 text-lg leading-relaxed mb-10">
            Connect farmers, drivers, equipment owners and buyers on India&apos;s smartest agriculture platform.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-10">
            {[
              { icon: Truck, label: 'Realtime dispatch' },
              { icon: MapPin, label: 'Live route map' },
              { icon: MessageCircle, label: 'Private chat' },
              { icon: ShieldCheck, label: 'Secure access' },
            ].map(({ icon: Icon, label }, idx) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + idx * 0.08 }}
                className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-4 hover:bg-white/10 transition-colors"
              >
                <Icon size={18} className="text-agri-cyan mb-2" />
                <p className="text-sm font-semibold text-white">{label}</p>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { stat: '50K+', label: 'Farmers' },
              { stat: '10K+', label: 'Equipment' },
              { stat: '2M+', label: 'Transactions' },
            ].map(({ stat, label }, idx) => (
              <motion.div 
                key={label} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-4 hover:bg-white/10 transition-colors"
              >
                <p className="text-2xl font-bold text-white text-glow">{stat}</p>
                <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center z-0">
           {/* Decorative Grid */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </motion.div>

        {/* Tractor Animation */}
        <motion.div 
          className="absolute bottom-24 -left-32 z-0 opacity-30 pointer-events-none"
          animate={{ x: ['0vw', '100vw'] }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        >
          <Tractor size={160} className="text-agri-green" />
        </motion.div>
        
        <p className="relative z-10 text-sm text-neutral-400">© 2026 AgriPool Enterprise Platform</p>
      </motion.div>

      <div className="flex flex-col min-h-screen">
        <div className="flex items-center justify-between p-4 lg:p-6">
          <Link
            to="/"
            className={`lg:hidden flex items-center gap-2 font-bold ${
              isDark ? 'text-primary-400' : 'text-primary-600'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-bold">
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
