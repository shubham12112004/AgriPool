import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services'

export default function ProfileDropdown() {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const name = user?.name || user?.email || 'User'

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch {
      /* Laravel logout may fail if no token */
    }
    logout()
    navigate('/login')
  }

  return (
    <motion.div layout className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-colors ${
          isDark ? 'hover:bg-dark-border' : 'hover:bg-neutral-100'
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-semibold">
          {name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">{name}</span>
        <ChevronDown size={16} className="hidden sm:block opacity-60" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className={`absolute right-0 mt-2 w-52 rounded-xl shadow-xl border py-1 z-50 ${
              isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-neutral-200'
            }`}
          >
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm ${
                isDark ? 'hover:bg-dark-border' : 'hover:bg-neutral-50'
              }`}
            >
              <Settings size={16} /> Settings
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 ${
                isDark ? 'hover:bg-dark-border' : 'hover:bg-neutral-50'
              }`}
            >
              <LogOut size={16} /> Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
