import React, { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  User,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Calendar,
  Activity,
  CreditCard,
  Star,
  LayoutDashboard,
  Receipt,
  Bookmark,
  Truck,
  Tractor,
  ShoppingBag,
  Package,
  TrendingUp,
  Heart,
  DollarSign,
  BookOpen,
} from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuthStore, getDashboardPathForRole } from '../../store/authStore'
import { authService, dashboardService } from '../../services'
import { getAvatarUrl } from '../../lib/utils'
import { translateStatLabel } from '../../pages/dashboard/FarmerDashboard'

/* ── helpers ─────────────────────────────────────────── */

function resolveAvatar(avatar) {
  return getAvatarUrl(avatar)
}

/* ── animation variants ──────────────────────────────── */

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.18 } },
}

const panelVariants = {
  hidden: { x: '100%', opacity: 0.5 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', damping: 28, stiffness: 300 },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { type: 'tween', duration: 0.22, ease: 'easeIn' },
  },
}

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
}

/* ── sub-components ──────────────────────────────────── */

function AvatarImage({ src, initials, size = 32, className = '', ring = false }) {
  const [failed, setFailed] = useState(false)
  const resolved = resolveAvatar(src)

  useEffect(() => {
    setFailed(false)
  }, [src])

  const base = `rounded-full flex items-center justify-center font-semibold text-white bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden ${className}`

  if (resolved && !failed) {
    return (
      <div
        className={`${base} ${ring ? 'p-[3px] bg-gradient-to-br from-emerald-400 via-primary-500 to-teal-500' : ''}`}
        style={{ width: size, height: size }}
      >
        <img
          src={resolved}
          alt="Avatar"
          onError={() => setFailed(true)}
          className={`rounded-full object-cover ${ring ? 'border-2 border-white dark:border-dark-card' : ''}`}
          style={{
            width: ring ? size - 6 : size,
            height: ring ? size - 6 : size,
          }}
        />
      </div>
    )
  }

  return (
    <div
      className={`${base} ${ring ? 'ring-[3px] ring-emerald-400/60' : ''}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  )
}

function StatCard({ icon: Icon, value, label, isDark }) {
  return (
    <motion.div
      variants={fadeUp}
      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors ${
        isDark
          ? 'bg-white/[0.04] hover:bg-white/[0.07]'
          : 'bg-neutral-50 hover:bg-neutral-100'
      }`}
    >
      <Icon size={18} className="text-primary-500" />
      <span className="text-base font-bold">{value}</span>
      <span className="text-[11px] opacity-60 leading-none">{label}</span>
    </motion.div>
  )
}

function ActionLink({ to, icon: Icon, label, isDark, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        isDark
          ? 'hover:bg-white/[0.06] text-neutral-200'
          : 'hover:bg-neutral-50 text-neutral-700'
      }`}
    >
      <span
        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
          isDark ? 'bg-white/[0.06]' : 'bg-neutral-100'
        }`}
      >
        <Icon size={16} className="text-primary-500" />
      </span>
      <span className="flex-1">{label}</span>
      <ChevronRight
        size={15}
        className="opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all"
      />
    </Link>
  )
}

/* ── Portal wrapper — renders outside all stacking contexts ── */
function ProfilePanel({ open, onClose, isDark, children }) {
  if (typeof document === 'undefined') return null
  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="profile-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          />

          {/* Slide-in Panel */}
          <motion.aside
            key="profile-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 9999, width: '100%', maxWidth: 340 }}
            className={`flex flex-col overflow-y-auto shadow-2xl border-l ${
              isDark
                ? 'bg-dark-card/95 backdrop-blur-xl border-dark-border text-neutral-100'
                : 'bg-white/98 backdrop-blur-xl border-neutral-200 text-neutral-900'
            }`}
          >
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

/* ── main component ──────────────────────────────────── */

export default function ProfileDropdown() {
  const { isDark } = useTheme()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const { user, role, logout } = useAuthStore()
  const [stats, setStats] = useState([])
  const [statsLoading, setStatsLoading] = useState(false)

  const name = user?.name || user?.email || 'User'
  const email = user?.email || ''
  const initials = name.charAt(0).toUpperCase()
  const dashboardPath = getDashboardPathForRole(role)

  const close = useCallback(() => setOpen(false), [])

  const getIconForLabel = (label) => {
    const lower = label.toLowerCase()
    if (lower.includes('spent') || lower.includes('payment')) return CreditCard
    if (lower.includes('earning')) return DollarSign
    if (lower.includes('active') || lower.includes('ongoing') || lower.includes('trip')) return Activity
    if (lower.includes('booking') || lower.includes('rental') || lower.includes('calendar')) return Calendar
    if (lower.includes('rating')) return Star
    if (lower.includes('order')) return Package
    if (lower.includes('saved')) return Heart
    if (lower.includes('cart')) return ShoppingBag
    if (lower.includes('listed') || lower.includes('item') || lower.includes('equipment')) return Tractor
    if (lower.includes('job') || lower.includes('done') || lower.includes('completed')) return Activity
    return Activity
  }

  const getFallbackStatsForRole = (r) => {
    if (r === 'driver') {
      return [
        { icon: DollarSign, value: '₹0', label: 'Earnings (month)' },
        { icon: Activity, value: '0', label: 'Active trips' },
        { icon: Star, value: '4.9', label: 'Rating' },
        { icon: Activity, value: '0', label: 'Jobs done' },
      ]
    }
    if (r === 'buyer') {
      return [
        { icon: Package, value: '0', label: 'Orders' },
        { icon: Heart, value: '8', label: 'Saved items' },
        { icon: CreditCard, value: '₹0', label: 'Spent (month)' },
        { icon: ShoppingBag, value: '1', label: 'Active carts' },
      ]
    }
    if (r === 'equipment_owner' || r === 'equipment-owner') {
      return [
        { icon: DollarSign, value: '₹0', label: 'Monthly earnings' },
        { icon: Tractor, value: '5', label: 'Listed items' },
        { icon: Calendar, value: '0', label: 'Pending rentals' },
      ]
    }
    // Default: farmer
    return [
      { icon: CreditCard, value: '₹0', label: 'Total spent' },
      { icon: Calendar, value: '0', label: 'Active bookings' },
      { icon: Star, value: '4.8', label: 'Rating' },
      { icon: Activity, value: '0', label: 'Completed' },
    ]
  }

  // Lock body scroll when panel is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') close() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, close])

  // Fetch stats when panel opens
  useEffect(() => {
    if (open) {
      setStatsLoading(true)
      dashboardService
        .getStats()
        .then((res) => {
          if (res.stats) {
            const mapped = res.stats.map((s) => ({
              label: s.label,
              value: s.value,
              icon: getIconForLabel(s.label),
            }))
            setStats(mapped)
          }
        })
        .catch(() => {})
        .finally(() => setStatsLoading(false))
    }
  }, [open])

  const handleLogout = async () => {
    close()
    try {
      await authService.logout()
    } catch {
      /* Laravel logout may fail if no token */
    }
    logout()
    navigate('/login')
  }

  /* ── quick stats (dynamic with fallbacks) ── */
  const displayStats = stats.length ? stats : getFallbackStatsForRole(role)

  /* ── quick actions ── */
  const actions = [
    { to: '/profile', icon: User, label: 'My Profile' },
    { to: dashboardPath, icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/bookings', icon: Calendar, label: 'My Bookings' },
    { to: '/payments/history', icon: Receipt, label: 'Payment History' },
    { to: '/settings', icon: Settings, label: 'Settings' },
    { to: '/saved', icon: Bookmark, label: 'Saved Items' },
  ]

  return (
    <>
      {/* ── Trigger Button ── */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen(true)}
        className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-colors ${
          isDark ? 'hover:bg-dark-border' : 'hover:bg-neutral-100'
        }`}
      >
        <AvatarImage src={user?.avatar} initials={initials} size={32} />
        <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
          {name}
        </span>
        <ChevronDown size={16} className="hidden sm:block opacity-60" />
      </motion.button>

      {/* ── Slide-out Panel (rendered in portal on document.body) ── */}
      <ProfilePanel open={open} onClose={close} isDark={isDark}>
        {/* ── Close ── */}
        <div className="flex justify-between items-center p-4 pb-0">
          <span className="text-xs font-semibold uppercase tracking-widest opacity-40">Account</span>
          <motion.button
            type="button"
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.85 }}
            onClick={close}
            className={`p-2 rounded-xl transition-colors ${
              isDark ? 'hover:bg-white/10' : 'hover:bg-neutral-100'
            }`}
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* ── Profile Header ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center px-6 pt-2 pb-5"
        >
          <motion.div variants={fadeUp} className="relative mb-3">
            <AvatarImage
              src={user?.avatar}
              initials={initials}
              size={80}
              ring
            />
            {/* Online dot */}
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-dark-card" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-lg font-bold tracking-tight"
          >
            {name}
          </motion.h2>

          {email && (
            <motion.p
              variants={fadeUp}
              className="text-xs opacity-50 mt-0.5"
            >
              {email}
            </motion.p>
          )}

          {role && (
            <motion.span
              variants={fadeUp}
              className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-primary-500/10 text-primary-500"
            >
              {role.replace(/[_-]/g, ' ')}
            </motion.span>
          )}
        </motion.div>

        {/* ── Quick Stats ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-2 px-5 pb-4"
        >
          {displayStats.map((s) => (
            <StatCard
              key={s.label}
              icon={s.icon}
              value={s.value}
              label={translateStatLabel(s.label, t)}
              isDark={isDark}
            />
          ))}
        </motion.div>

        {/* Divider */}
        <div
          className={`mx-5 border-t ${
            isDark ? 'border-dark-border' : 'border-neutral-100'
          }`}
        />

        {/* ── Quick Actions ── */}
        <motion.nav
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex-1 flex flex-col gap-0.5 px-3 py-3"
        >
          {actions.map((a) => (
            <motion.div key={a.to} variants={fadeUp}>
              <ActionLink {...a} isDark={isDark} onClick={close} />
            </motion.div>
          ))}
        </motion.nav>

        {/* Divider */}
        <div
          className={`mx-5 border-t ${
            isDark ? 'border-dark-border' : 'border-neutral-100'
          }`}
        />

        {/* ── Logout ── */}
        <div className="px-5 py-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors ${
              isDark
                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                : 'bg-red-50 text-red-600 hover:bg-red-100'
            }`}
          >
            <LogOut size={17} />
            Log out
          </motion.button>
        </div>

        {/* ── Footer ── */}
        <p className="text-center text-[11px] opacity-30 pb-5 select-none">
          AgriPool v1.0 · Member since 2024
        </p>
      </ProfilePanel>
    </>
  )
}
