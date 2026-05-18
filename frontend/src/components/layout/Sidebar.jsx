import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { X, Settings, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuthStore } from '../../store/authStore'
import { getDashboardNav } from '../../config/navigation'
import { cn } from '../../lib/utils'

export default function Sidebar({ open, onClose, collapsed = false, onCollapseChange }) {
  const { isDark, toggleTheme } = useTheme()
  const { t, language, changeLanguage } = useLanguage()
  const role = useAuthStore((s) => s.role) || 'farmer'
  const navItems = getDashboardNav(role)
  const [showLangMenu, setShowLangMenu] = useState(false)

  const linkClass = ({ isActive }) =>
    cn(
      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap overflow-hidden',
      isActive
        ? 'bg-primary-500/15 text-primary-600 dark:text-primary-400'
        : isDark
          ? 'text-neutral-400 hover:bg-dark-border hover:text-neutral-100'
          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
    )

  const content = (
    <div className="flex flex-col h-full">
      <motion.div
        layout
        className={cn(
          'flex items-center justify-between px-4 py-5 border-b border-neutral-200/80 dark:border-dark-border',
          collapsed && 'lg:justify-center'
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              A
            </div>
            <span className="font-bold text-lg">AgriPool</span>
          </div>
        )}
        {collapsed && <span className="font-bold text-lg">A</span>}
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-dark-border transition-colors"
        >
          <X size={20} />
        </button>
      </motion.div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink key={item.path} to={item.path} className={linkClass} onClick={onClose} title={collapsed ? t(item.label) : ''}>
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span>{t(item.label)}</span>}
            </NavLink>
          )
        })}
      </nav>

      <div className={cn('p-3 border-t border-neutral-200/80 dark:border-dark-border space-y-2', collapsed && 'lg:flex lg:flex-col lg:items-center')}>
        {/* Language Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLangMenu(!showLangMenu)}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isDark ? 'hover:bg-dark-border' : 'hover:bg-neutral-100'
            )}
            title={collapsed ? 'Language' : ''}
          >
            <span className="text-lg shrink-0">🌐</span>
            {!collapsed && <span>{language.toUpperCase()}</span>}
            {!collapsed && <span className="text-xs opacity-60 ml-auto">▼</span>}
          </button>
          {showLangMenu && !collapsed && (
            <div className={cn('absolute bottom-full left-3 mb-2 rounded-lg shadow-lg border py-1 z-50 w-40', isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-neutral-200')}>
              {['en', 'hi', 'pa'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    changeLanguage(lang)
                    setShowLangMenu(false)
                  }}
                  className={cn('w-full text-left px-4 py-2 text-sm', language === lang ? 'bg-primary-500/15 text-primary-600' : 'hover:bg-neutral-100 dark:hover:bg-dark-border')}
                >
                  {lang === 'en' && 'English'} {lang === 'hi' && 'हिन्दी'} {lang === 'pa' && 'ਪੰਜਾਬੀ'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            isDark ? 'hover:bg-dark-border' : 'hover:bg-neutral-100'
          )}
          title={collapsed ? (isDark ? 'Light mode' : 'Dark mode') : ''}
        >
          {isDark ? <Sun size={18} className="text-yellow-400 shrink-0" /> : <Moon size={18} className="text-slate-700 shrink-0" />}
          {!collapsed && <span>{isDark ? 'Light mode' : 'Dark mode'}</span>}
        </button>

        {/* Settings Link */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive ? 'bg-primary-500/15 text-primary-600' : isDark ? 'hover:bg-dark-border' : 'hover:bg-neutral-100'
            )
          }
          title={collapsed ? 'Settings' : ''}
        >
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </div>
    </div>
  )

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} aria-hidden />}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 h-screen shrink-0 border-r transition-all duration-300',
          isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-neutral-200',
          collapsed ? 'w-20 lg:w-20' : 'w-64',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {content}
      </aside>
    </>
  )
}
