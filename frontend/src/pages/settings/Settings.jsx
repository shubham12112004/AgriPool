import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useTheme } from '../../hooks/useTheme'
import { useLanguage } from '../../hooks/useLanguage'
import PageHeader from '../../components/shared/PageHeader'
import { Card, Input, Button, Tabs, Select } from '../../components/ui'
import { vehicleService, authService, userService } from '../../services'
import { Moon, Sun, Globe, Bell, Lock, LogOut, Check } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
]

export default function Settings() {
  const { isDark, toggleTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'vehicle' ? 4 : 0
  const user = useAuthStore((s) => s.user)
  const setAuth = useAuthStore((s) => s.setAuth)
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' })
  const [profileLoading, setProfileLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [vehicle, setVehicle] = useState({
    vehicle_type: '',
    registration: '',
    capacity: '',
    available: true,
  })
  const [vehicleLoading, setVehicleLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  useEffect(() => {
    vehicleService
      .getVehicle()
      .then((res) => {
        if (res.data) setVehicle(res.data)
      })
      .catch(() => {})
  }, [])

  const getAvatarUrl = (avatar) => {
    if (!avatar) return null
    if (avatar.startsWith('http')) return avatar
    if (avatar.startsWith('/')) return avatar
    return `/storage/${avatar}`
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    if (!user) return
    setProfileLoading(true)
    try {
      const res = await userService.updateProfile(user.id, {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      })
      if (res && res.user) {
        setAuth({
          user: res.user,
          role: res.user.role,
        })
        toast.success('Profile updated successfully')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

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

  const saveVehicle = async (e) => {
    e.preventDefault()
    setVehicleLoading(true)
    try {
      const hasVehicle = Boolean(vehicle.id)
      const res = hasVehicle
        ? await vehicleService.updateVehicle(vehicle)
        : await vehicleService.registerVehicle(vehicle)
      setVehicle(res.data)
      toast.success('Vehicle saved')
    } catch {
      toast.error('Save failed — log in as driver')
    } finally {
      setVehicleLoading(false)
    }
  }

  const tabs = [
      {
        label: 'General',
        content: (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-6">Account Information</h3>
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-primary-500/30 bg-neutral-100 dark:bg-dark-bg flex items-center justify-center flex-shrink-0 shadow-lg">
                  {getAvatarUrl(user?.avatar) ? (
                    <img
                      src={getAvatarUrl(user.avatar)}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div
                    style={{ display: getAvatarUrl(user?.avatar) ? 'none' : 'flex' }}
                    className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-3xl font-bold flex items-center justify-center"
                  >
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-[10px] font-semibold text-center p-1 rounded-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      disabled={avatarLoading}
                    />
                    {avatarLoading ? 'Uploading...' : 'Change Photo'}
                  </label>
                </div>

                <form onSubmit={saveProfile} className="space-y-4 flex-1 max-w-lg w-full">
                  <Input
                    label="Name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                  <Button type="submit" variant="primary" loading={profileLoading}>
                    Save profile
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        ),
      },
      {
        label: 'Language',
        content: (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Globe size={20} className="text-primary-500" /> Language Preference
              </h3>
              <p className={`text-sm mb-6 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Choose your preferred language. The entire app will switch to the selected language.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {LANGUAGES.map((lang) => {
                  const isActive = language === lang.code
                  return (
                    <motion.button
                      key={lang.code}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setLanguage(lang.code)
                        toast.success(`Language changed to ${lang.name}`)
                      }}
                      className={cn(
                        'relative p-5 rounded-xl border-2 transition-all flex flex-col items-center gap-3 group',
                        isActive
                          ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/10'
                          : isDark
                            ? 'border-dark-border hover:border-primary-500/40 hover:bg-dark-border/50'
                            : 'border-neutral-200 hover:border-primary-500/40 hover:bg-primary-50/50'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center"
                        >
                          <Check size={14} strokeWidth={3} />
                        </motion.div>
                      )}
                      <span className="text-3xl">{lang.flag}</span>
                      <div className="text-center">
                        <div className="font-bold text-lg">{lang.native}</div>
                        <div className={`text-xs mt-0.5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                          {lang.name}
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </Card>
          </div>
        ),
      },
      {
        label: 'Appearance',
        content: (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Sun size={20} /> Theme
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Light', isDark: false, icon: Sun, color: 'text-yellow-500' },
                  { name: 'Dark', isDark: true, icon: Moon, color: 'text-blue-400' },
                ].map((theme) => {
                  const Icon = theme.icon
                  const isSelected = isDark === theme.isDark
                  return (
                    <button
                      key={theme.name}
                      onClick={toggleTheme}
                      disabled={isSelected}
                      className={cn(
                        'p-6 rounded-lg border-2 transition-all flex flex-col items-center gap-3',
                        isSelected
                          ? 'border-primary-600 bg-primary-500/10'
                          : isDark
                            ? 'border-dark-border hover:border-primary-500/50 cursor-pointer'
                            : 'border-neutral-200 hover:border-primary-500/50 cursor-pointer'
                      )}
                    >
                      <Icon size={32} className={theme.color} />
                      <span className="font-medium text-lg">{theme.name} mode</span>
                    </button>
                  )
                })}
              </div>
            </Card>
          </div>
        ),
      },
      {
        label: 'Notifications',
        content: (
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Bell size={20} /> Notification Preferences
            </h3>
            <div className="space-y-4">
              {[
                { title: 'Email Notifications', desc: 'Get updates via email' },
                { title: 'Push Notifications', desc: 'Receive browser push notifications' },
                { title: 'Booking Updates', desc: 'Alerts about booking status changes' },
                { title: 'Payment Alerts', desc: 'Notifications for payment transactions' },
              ].map((notif, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg hover:bg-neutral-100 dark:hover:bg-dark-border/50 transition-colors">
                  <div>
                    <p className="font-medium">{notif.title}</p>
                    <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>{notif.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded cursor-pointer" />
                </div>
              ))}
            </div>
          </Card>
        ),
      },
      {
        label: 'Vehicle',
        content: (
          <Card className="p-6 max-w-lg">
            <form onSubmit={saveVehicle} className="space-y-4">
              <p className="text-sm text-neutral-500 mb-2">Register your vehicle for driver bookings.</p>
              <Select
                label="Vehicle type"
                name="vehicle_type"
                value={vehicle.vehicle_type}
                onChange={(e) => setVehicle({ ...vehicle, vehicle_type: e.target.value })}
                options={[
                  { label: 'Select type', value: '' },
                  { label: 'Truck', value: 'truck' },
                  { label: 'Tempo', value: 'tempo' },
                  { label: 'Tractor trailer', value: 'trailer' },
                ]}
              />
              <Input
                label="Registration number"
                value={vehicle.registration}
                onChange={(e) => setVehicle({ ...vehicle, registration: e.target.value })}
                required
              />
              <Input
                label="Capacity (tons)"
                value={vehicle.capacity || ''}
                onChange={(e) => setVehicle({ ...vehicle, capacity: e.target.value })}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={vehicle.available}
                  onChange={(e) => setVehicle({ ...vehicle, available: e.target.checked })}
                />
                Available for bookings
              </label>
              <Button type="submit" variant="primary" loading={vehicleLoading}>
                Save vehicle
              </Button>
            </form>
          </Card>
        ),
      },
    ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Settings" subtitle="Profile, vehicle, preferences, and security" />
      <Tabs tabs={tabs} defaultTab={initialTab} />
    </motion.div>
  )
}
