import React from 'react'
import { Menu, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import NotificationDropdown from './NotificationDropdown'
import ProfileDropdown from './ProfileDropdown'

export default function DashboardHeader({ title, subtitle, onMenuClick, onSidebarToggle }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between gap-3 px-4 md:px-6 py-4 border-b backdrop-blur-xl transition-colors ${
        isDark ? 'bg-dark-bg/80 border-dark-border' : 'bg-white/80 border-neutral-200'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-dark-border transition-colors"
          aria-label="Open menu"
          title="Toggle sidebar"
        >
          <Menu size={22} />
        </button>
        <button
          type="button"
          onClick={onSidebarToggle}
          className="hidden lg:block p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-dark-border transition-colors"
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          {title && <h1 className="text-lg md:text-xl font-bold truncate">{title}</h1>}
          {subtitle && (
            <p className={`text-sm truncate ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={toggleTheme}
          className={`p-2 rounded-xl transition-colors ${
            isDark ? 'hover:bg-dark-border' : 'hover:bg-neutral-100'
          }`}
          aria-label="Toggle theme"
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-700" />}
        </button>
        <NotificationDropdown />
        <ProfileDropdown />
      </div>
    </header>
  )
}
