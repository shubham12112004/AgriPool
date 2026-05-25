import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { X, Settings, Moon, Sun, HelpCircle } from 'lucide-react'
import SupportModal from '../shared/SupportModal'
import { useTheme } from '../../hooks/useTheme'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuthStore } from '../../store/authStore'
import { getDashboardNav } from '../../config/navigation'
import { cn } from '../../lib/utils'
import { AgriPoolLogo } from '../ui'

export default function Sidebar({ open, onClose, collapsed = false, onCollapseChange }) {
  const { isDark, toggleTheme } = useTheme()
  const { t, language, changeLanguage } = useLanguage()
  const user = useAuthStore((s) => s.user)
  const role = useAuthStore((s) => s.role) || 'farmer'
  const navItems = getDashboardNav(role)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)

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
        <div className={cn('flex items-center gap-2.5', collapsed && 'lg:flex-col lg:gap-1')}>
          <AgriPoolLogo className="w-9 h-9" />
          {!collapsed && (
            <div className="min-w-0">
              <span className="font-bold text-lg block leading-none">AgriPool</span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                {user?.name || 'Connected workspace'}
              </span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-dark-border transition-colors"
        >
          <X size={20} />
        </button>
      </motion.div>

      {!collapsed && (
        <div className="mx-3 mt-3 rounded-2xl border border-primary-500/10 bg-primary-500/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400 font-semibold">{t('sidebar.workspace')}</p>
              <p className="text-sm font-semibold mt-1 capitalize">{t(`sidebar.role_${role}`)}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary-500/15 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
              {String(role).slice(0, 1).toUpperCase()}
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
            {t('sidebar.desc')}
          </p>
        </div>
      )}

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


        {/* Settings Link */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive ? 'bg-primary-500/15 text-primary-600' : isDark ? 'hover:bg-dark-border' : 'hover:bg-neutral-100'
            )
          }
          title={collapsed ? t('nav.settings') : ''}
        >
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span>{t('nav.settings')}</span>}
        </NavLink>

        {/* Help & Support Button */}
        <button
          type="button"
          onClick={() => setSupportOpen(true)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
            isDark ? 'text-neutral-400 hover:bg-dark-border hover:text-neutral-100' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
          )}
          title={collapsed ? 'Help & Support' : ''}
        >
          <HelpCircle size={18} className="shrink-0 text-primary-500" />
          {!collapsed && <span>Help & Support</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} aria-hidden />}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 inset-y-0 shrink-0 border-r transition-all duration-300',
          isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-neutral-200',
          collapsed ? 'w-20 lg:w-20' : 'w-64',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {content}
      </aside>
      <SupportModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
    </>
  )
}
