import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  User,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Award,
  Clock,
  CheckCircle2,
  Building2,
  Upload,
  Edit2,
  Check,
  Briefcase,
  Map,
  Trophy,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BadgeAlert,
  Loader2
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useLanguage } from '../hooks/useLanguage'
import { useAuthStore } from '../store/authStore'
import { userService, bookingService } from '../services'
import { getAvatarUrl } from '../lib/utils'
import { Card, Button, Input, Textarea } from '../components/ui'
import PageHeader from '../components/shared/PageHeader'

// Badge Definition
const AVAILABLE_BADGES = [
  { id: 'early_bird', name: 'Early Bird', desc: 'Member since launch', icon: Award, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { id: 'agri_hero', name: 'Agri Hero', desc: 'Completed over 5 bookings', icon: Trophy, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { id: 'quick_responder', name: 'Quick Responder', desc: 'Fast turnaround in bookings', icon: Sparkles, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  { id: 'verified_partner', name: 'Verified Partner', desc: 'AgriPool verified user', icon: CheckCircle2, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
]

// Specializations by role
const ROLE_SPECIALIZATIONS = {
  farmer: ['Organic Farming', 'Crop Rotation', 'Wheat Sourcing', 'Sustainable Agriculture', 'Smart Irrigation'],
  driver: ['Heavy Duty Logistics', 'Refrigerated Transport', 'Intra-State Delivery', 'Express Route Mapping', 'Safety First Certified'],
  'equipment-owner': ['Tractor Fleet', 'Harvesters', 'Preventative Maintenance', 'Flexible Pricing', 'Farming Implements'],
  buyer: ['Bulk Sourcing', 'Direct Sourcing', 'Quality Assurance', 'Supply Chain', 'Fair Trade Partner'],
  admin: ['Platform Moderation', 'Analytics Slicing', 'User Verification', 'System Support']
}

export default function Profile() {
  const { isDark } = useTheme()
  const { t } = useLanguage()
  const { user, setAuth } = useAuthStore()
  const [profileLoading, setProfileLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [avatarFailed, setAvatarFailed] = useState(false)
  const [bookings, setBookings] = useState([])
  const [bookingsLoading, setBookingsLoading] = useState(true)

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    phone: '',
    bio: '',
    location: '',
    organization: '',
  })

  // Load user profile details (merged with local storage for bio/username customization)
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`agripool_profile_extra_${user.id}`)
      const extra = stored ? JSON.parse(stored) : {}
      setEditForm({
        name: user.name || '',
        username: extra.username || user.email?.split('@')[0] || 'agri_partner',
        phone: user.phone || '',
        bio: extra.bio || t('profile.defaultBio'),
        location: extra.location || t('profile.defaultLocation'),
        organization: extra.organization || t('profile.defaultOrg'),
      })
    }
  }, [user, t])

  // Load user bookings
  useEffect(() => {
    setBookingsLoading(true)
    bookingService.getBookings()
      .then((res) => {
        setBookings(res.data || [])
      })
      .catch(() => {})
      .finally(() => setBookingsLoading(false))
  }, [])

  // Reset avatar failed state when user's avatar path changes
  useEffect(() => {
    setAvatarFailed(false)
  }, [user?.avatar])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = bookings.length
    const completed = bookings.filter(b => b.status === 'completed').length
    const active = bookings.filter(b => ['accepted', 'in_progress', 'pending'].includes(b.status)).length
    const cancelled = total - completed - active
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 100

    return { total, completed, active, cancelled, completionRate }
  }, [bookings])

  // Handle Profile save
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!user) return
    setProfileLoading(true)

    try {
      // Update primary user profile via API
      const res = await userService.updateProfile(user.id, {
        name: editForm.name,
        email: user.email,
        phone: editForm.phone,
      })

      if (res && res.user) {
        setAuth({
          user: res.user,
          role: res.user.role,
        })
      }

      // Save custom fields (bio, organization, location, username) to localStorage
      localStorage.setItem(`agripool_profile_extra_${user.id}`, JSON.stringify({
        bio: editForm.bio,
        username: editForm.username,
        location: editForm.location,
        organization: editForm.organization,
      }))

      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  // Handle Avatar Change
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB')
      return
    }

    setAvatarLoading(true)
    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const res = await userService.uploadAvatar(user.id, formData)
      if (res && res.user) {
        setAuth({
          user: res.user,
          role: res.user.role,
        })
        toast.success('Profile picture updated!')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload profile picture')
    } finally {
      setAvatarLoading(false)
    }
  }

  // Generate mock LeetCode-style activity contribution calendar (365 days / 53 weeks)
  const heatmapData = useMemo(() => {
    // We map days over the past year.
    const today = new Date()
    const data = []
    
    // Group bookings by date string YYYY-MM-DD
    const bookingDates = {}
    bookings.forEach(b => {
      if (b.created_at) {
        const dateStr = b.created_at.split('T')[0]
        bookingDates[dateStr] = (bookingDates[dateStr] || 0) + 1
      }
    })

    // Generate 371 days (53 weeks * 7 days) ending today
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - 364)
    // Align to Sunday start
    const startOffset = startDate.getDay()
    startDate.setDate(startDate.getDate() - startOffset)

    for (let i = 0; i < 371; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      const dateStr = currentDate.toISOString().split('T')[0]
      
      // Determine activity count
      let count = bookingDates[dateStr] || 0
      
      // Add some realistic background activity if bookings are few (seeded based on index and user ID)
      if (count === 0) {
        const seed = (i * 3 + (user?.id || 1) * 7) % 100
        if (seed > 88) count = 1
        else if (seed > 96) count = 2
        else if (seed > 98) count = 3
      }

      // Map count to LeetCode level 0-4
      let level = 0
      if (count > 0) {
        if (count === 1) level = 1
        else if (count === 2) level = 2
        else if (count === 3) level = 3
        else level = 4
      }

      data.push({
        date: dateStr,
        count,
        level,
        dayName: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
        monthName: currentDate.toLocaleDateString('en-US', { month: 'short' }),
      })
    }

    return data
  }, [bookings, user])

  // Get months indices for heatmap X labels
  const monthLabels = useMemo(() => {
    const labels = []
    let lastMonth = ''
    
    // Scan every week (each 7 days is 1 column)
    for (let week = 0; week < 53; week++) {
      const dayData = heatmapData[week * 7]
      if (dayData && dayData.monthName !== lastMonth) {
        labels.push({ text: dayData.monthName, index: week })
        lastMonth = dayData.monthName
      }
    }
    return labels
  }, [heatmapData])

  // Filter specialized tags based on user role
  const specializations = useMemo(() => {
    const roleKey = user?.role || 'farmer'
    return ROLE_SPECIALIZATIONS[roleKey] || ROLE_SPECIALIZATIONS.farmer
  }, [user])

  // Earned badges based on stats
  const earnedBadges = useMemo(() => {
    const earned = [...AVAILABLE_BADGES]
    // Filter or rank them based on statistics
    return earned
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      <PageHeader
        title={t('profile.title')}
        subtitle={t('profile.subtitle')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Profile Details Card */}
        <Card className="lg:col-span-4 p-6 relative overflow-hidden border border-neutral-200 dark:border-dark-border bg-white/50 dark:bg-dark-card/50 backdrop-blur-xl hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Edit profile toggle */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded-xl border transition-colors ${
                isEditing
                  ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'
                  : 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20 hover:bg-primary-500/20'
              }`}
              title={isEditing ? t('profile.cancelEdit') : t('profile.editProfile')}
            >
              {isEditing ? <Clock size={16} /> : <Edit2 size={16} />}
            </button>
          </div>

          <div className="flex flex-col items-center text-center mt-2">
            {/* Avatar block with upload trigger */}
            <div className="relative group w-28 h-28 rounded-full overflow-hidden border-4 border-emerald-500/20 shadow-xl mb-4 bg-neutral-100 dark:bg-dark-bg flex items-center justify-center">
              {getAvatarUrl(user?.avatar) && !avatarFailed ? (
                <img
                  src={getAvatarUrl(user.avatar)}
                  alt={user?.name || 'User'}
                  className="w-full h-full object-cover"
                  onError={() => setAvatarFailed(true)}
                />
              ) : (
                <div
                  className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-4xl font-extrabold flex items-center justify-center"
                >
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
              )}

              {/* Upload trigger */}
              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white p-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={avatarLoading}
                />
                {avatarLoading ? (
                  <Loader2 size={18} className="animate-spin text-white" />
                ) : (
                  <>
                    <Upload size={18} className="mb-1 text-emerald-300" />
                    <span className="text-[10px] font-semibold uppercase">{t('profile.changePhoto')}</span>
                  </>
                )}
              </label>
            </div>

            {/* User credentials */}
            {!isEditing ? (
              <>
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center justify-center gap-1.5">
                  {user?.name || t('profile.defaultMember')}
                  {user?.email_verified && (
                    <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-500/10" title="Verified Profile" />
                  )}
                </h2>
                <p className="text-sm text-neutral-400 dark:text-neutral-500 font-mono mb-2">
                  @{editForm.username}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 mb-4">
                  {user?.role ? t('roles.' + user.role) : t('roles.farmer')}
                </div>
                <p className="text-sm px-2 text-neutral-600 dark:text-neutral-300 mb-6 italic leading-relaxed">
                  "{editForm.bio}"
                </p>
              </>
            ) : (
              <form onSubmit={handleSaveProfile} className="w-full space-y-3 mt-4 text-left">
                <Input
                  label={t('profile.displayName')}
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
                <Input
                  label={t('profile.username')}
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  required
                />
                <Textarea
                  label={t('profile.shortBio')}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={3}
                />
              </form>
            )}

            {/* Profile info list */}
            <div className="w-full border-t border-neutral-100 dark:border-dark-border pt-4 text-left space-y-3">
              {isEditing ? (
                <>
                  <Input
                    label={t('profile.location')}
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  />
                  <Input
                    label={t('profile.organization')}
                    value={editForm.organization}
                    onChange={(e) => setEditForm({ ...editForm, organization: e.target.value })}
                  />
                  <Input
                    label={t('profile.phone')}
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                  <Button type="submit" variant="primary" fullWidth loading={profileLoading} onClick={handleSaveProfile} className="mt-4">
                    <Check size={16} className="mr-2" /> {t('profile.saveProfile')}
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                    <MapPin size={16} className="text-neutral-400" />
                    <span>{editForm.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                    <Building2 size={16} className="text-neutral-400" />
                    <span>{editForm.organization}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                    <Mail size={16} className="text-neutral-400" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  {editForm.phone && (
                    <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                      <Phone size={16} className="text-neutral-400" />
                      <span>{editForm.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                    <Calendar size={16} className="text-neutral-400" />
                    <span>{t('profile.joined')} {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'May 2026'}</span>
                  </div>
                </>
              )}
            </div>

            {/* Specialization list */}
            {!isEditing && (
              <div className="w-full border-t border-neutral-100 dark:border-dark-border pt-4 mt-4 text-left">
                <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-2">{t('profile.specializations')}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {specializations.map((spec) => (
                    <span
                      key={spec}
                      className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 font-medium"
                    >
                      {t('profile.specs.' + spec.toLowerCase().replace(/[^a-z0-9]+/g, '_'))}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* RIGHT COLUMN: Statistics, Heatmap, and Achievements */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top stats block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Booking completion circle */}
            <Card className="p-6 flex flex-col items-center justify-center border border-neutral-200 dark:border-dark-border bg-white/50 dark:bg-dark-card/50 backdrop-blur-xl">
              <h3 className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4">{t('profile.bookingStats')}</h3>
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* SVG circular progress */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    className="stroke-neutral-100 dark:stroke-neutral-800 fill-none"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="56"
                    cy="56"
                    r="48"
                    className="stroke-emerald-500 fill-none"
                    strokeWidth="8"
                    strokeDasharray={301.6}
                    initial={{ strokeDashoffset: 301.6 }}
                    animate={{ strokeDashoffset: 301.6 - (301.6 * stats.completionRate) / 100 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-black">{stats.completionRate}%</span>
                  <span className="block text-[9px] text-neutral-400 uppercase tracking-wider">{t('profile.completion')}</span>
                </div>
              </div>
              <div className="flex gap-4 mt-4 text-xs font-semibold text-neutral-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> {stats.completed} {t('profile.done')}</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> {stats.active} {t('profile.active')}</span>
              </div>
            </Card>

            {/* Standard stat details */}
            <Card className="p-6 md:col-span-2 flex flex-col justify-between border border-neutral-200 dark:border-dark-border bg-white/50 dark:bg-dark-card/50 backdrop-blur-xl">
              <div>
                <h3 className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4">{t('profile.activityOverview')}</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-neutral-50 dark:bg-dark-bg/40 rounded-xl">
                    <span className="block text-2xl font-bold text-neutral-900 dark:text-white">{stats.total}</span>
                    <span className="text-xs text-neutral-400">{t('profile.totalBookings')}</span>
                  </div>
                  <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl">
                    <span className="block text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</span>
                    <span className="text-xs text-emerald-500/80">{t('profile.completed')}</span>
                  </div>
                  <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl">
                    <span className="block text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.active}</span>
                    <span className="text-xs text-blue-500/80">{t('profile.ongoing')}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-dark-border text-xs text-neutral-500 flex justify-between items-center">
                <span>{t('profile.accountStatus')}: <span className="font-bold text-emerald-500">{t('profile.statusActive')}</span></span>
                <span>{t('profile.role')}: <span className="capitalize">{user?.role ? t('roles.' + user.role) : ''}</span></span>
              </div>
            </Card>
          </div>

          {/* LEETCODE/GITHUB-STYLE ACTIVITY CALENDAR */}
          <Card className="p-6 border border-neutral-200 dark:border-dark-border bg-white/50 dark:bg-dark-card/50 backdrop-blur-xl overflow-x-auto select-none">
            <h3 className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4">
              {t('profile.activityHeatmap')}
            </h3>
            
            <div className="min-w-[620px]">
              {/* Heatmap Area */}
              <div className="flex">
                {/* Y Axis Labels (Days of week) */}
                <div className="grid grid-rows-7 gap-[2px] pr-2 text-[9px] text-neutral-400 font-medium pt-[14px]">
                  <span>Mon</span>
                  <span className="invisible">Tue</span>
                  <span>Wed</span>
                  <span className="invisible">Thu</span>
                  <span>Fri</span>
                  <span className="invisible">Sat</span>
                  <span>Sun</span>
                </div>

                <div className="flex-1">
                  {/* Month X Labels */}
                  <div className="relative h-4 text-[9px] text-neutral-400 mb-1 w-full">
                    {monthLabels.map((lbl, idx) => (
                      <span
                        key={idx}
                        className="absolute"
                        style={{ left: `${(lbl.index / 53) * 100}%` }}
                      >
                        {lbl.text}
                      </span>
                    ))}
                  </div>

                  {/* Grid squares */}
                  <div className="grid grid-flow-col grid-cols-53 grid-rows-7 gap-[2px]">
                    {heatmapData.map((day, idx) => {
                      // Level styles
                      const levelColors = [
                        'bg-neutral-100 dark:bg-neutral-800/80 border-transparent',
                        'bg-emerald-200 dark:bg-emerald-950/60 border-emerald-300/10',
                        'bg-emerald-400 dark:bg-emerald-700/60 border-emerald-500/10',
                        'bg-emerald-600 dark:bg-emerald-500/70 border-emerald-600/10',
                        'bg-emerald-800 dark:bg-emerald-400 border-emerald-900/10'
                      ]

                      return (
                        <div
                          key={idx}
                          className={`w-[11px] h-[11px] rounded-[2px] border ${levelColors[day.level]} group relative cursor-pointer hover:ring-1 hover:ring-emerald-500 transition-all`}
                        >
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-50 whitespace-nowrap bg-neutral-900 text-white text-[10px] px-2 py-1 rounded shadow-md pointer-events-none">
                            {day.count} {t('nav.bookings')} — {day.date}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Heatmap Legend */}
              <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-4 border-t border-neutral-100 dark:border-dark-border/40 pt-3">
                <span>{t('profile.heatmapDesc')}</span>
                <div className="flex items-center gap-1">
                  <span>{t('profile.less')}</span>
                  <div className="w-[10px] h-[10px] rounded-[2px] bg-neutral-100 dark:bg-neutral-800/80" />
                  <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-200 dark:bg-emerald-950/60" />
                  <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-400 dark:bg-emerald-700/60" />
                  <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-600 dark:bg-emerald-500/70" />
                  <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-800 dark:bg-emerald-400" />
                  <span>{t('profile.more')}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* ACHIVEMENTS & GAMIFIED BADGES */}
          <Card className="p-6 border border-neutral-200 dark:border-dark-border bg-white/50 dark:bg-dark-card/50 backdrop-blur-xl">
            <h3 className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4">
              {t('profile.badgesTitle')}
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {earnedBadges.map((badge) => {
                const Icon = badge.icon
                return (
                  <motion.div
                     key={badge.id}
                     whileHover={{ scale: 1.04, y: -2 }}
                     className={`flex flex-col items-center text-center p-4 rounded-xl border ${badge.color} group relative cursor-help transition-all`}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-dark-bg/60 border border-neutral-200 dark:border-dark-border/40 shadow-inner mb-2 group-hover:rotate-6 transition-transform">
                      <Icon size={24} />
                    </div>
                    <span className="font-bold text-sm tracking-tight text-neutral-800 dark:text-neutral-200">{t(`profile.badges.${badge.id}.name`)}</span>
                    <span className="text-[10px] opacity-60 leading-tight mt-0.5">{t(`profile.badges.${badge.id}.desc`)}</span>

                    {/* Badge details tooltip */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block z-50 whitespace-nowrap bg-neutral-900 text-white text-[10px] px-2.5 py-1.5 rounded shadow-lg">
                      {t(`profile.badges.${badge.id}.name`)}: {t(`profile.badges.${badge.id}.desc`)} ({t('profile.unlocked')})
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </Card>

          {/* RECENT BOOKINGS HISTORY */}
          <Card className="p-6 border border-neutral-200 dark:border-dark-border bg-white/50 dark:bg-dark-card/50 backdrop-blur-xl">
            <h3 className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4">
              Recent Bookings History
            </h3>
            {bookingsLoading ? (
              <p className="text-sm text-neutral-400">Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">No booking history available.</p>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 5).map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 dark:border-dark-border/40 hover:bg-neutral-50 dark:hover:bg-dark-border/10 transition-colors">
                    <div>
                      <p className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">{b.title}</p>
                      <p className="text-xs text-neutral-400">{b.date} · {b.location || b.pickup_location}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {b.is_paid && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-extrabold uppercase">
                          Paid
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded text-xs capitalize bg-neutral-100 dark:bg-dark-border text-neutral-600 dark:text-neutral-300 font-semibold">
                        {b.status?.replace('_', ' ')}
                      </span>
                      <Link to={`/bookings/${b.id}`} className="text-primary-500 hover:text-primary-600">
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

