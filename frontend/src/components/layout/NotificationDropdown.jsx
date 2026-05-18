import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { Badge } from '../ui'

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Booking accepted', body: 'Your tractor rental was confirmed.', time: '2m ago', unread: true },
  { id: 2, title: 'Payment received', body: '₹1,200 credited to your wallet.', time: '1h ago', unread: true },
  { id: 3, title: 'New request', body: 'Driver available near your farm.', time: '3h ago', unread: false },
]

export default function NotificationDropdown() {
  const { isDark } = useTheme()
  const [open, setOpen] = useState(false)
  const unread = MOCK_NOTIFICATIONS.filter((n) => n.unread).length

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`relative p-2.5 rounded-xl transition-colors ${
          isDark ? 'hover:bg-dark-border' : 'hover:bg-neutral-100'
        }`}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full ring-2 ring-white dark:ring-dark-card" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className={`absolute right-0 mt-2 w-80 rounded-xl shadow-xl border overflow-hidden z-50 ${
              isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-neutral-200'
            }`}
          >
            <div className="px-4 py-3 border-b border-neutral-200 dark:border-dark-border flex items-center justify-between">
              <span className="font-semibold text-sm">Notifications</span>
              {unread > 0 && <Badge variant="primary" size="sm">{unread} new</Badge>}
            </div>
            <ul className="max-h-72 overflow-y-auto">
              {MOCK_NOTIFICATIONS.map((n) => (
                <li
                  key={n.id}
                  className={`px-4 py-3 border-b last:border-0 cursor-pointer transition-colors ${
                    n.unread ? (isDark ? 'bg-primary-500/5' : 'bg-primary-50/50') : ''
                  } ${isDark ? 'hover:bg-dark-border' : 'hover:bg-neutral-50'}`}
                >
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{n.body}</p>
                  <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">{n.time}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
