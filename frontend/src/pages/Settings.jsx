import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, Globe, Bell, Lock, User, Palette, LogOut, ShieldCheck, ShieldAlert } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useLanguage } from '../hooks/useLanguage'
import { useAuthStore } from '../store/authStore'
import PageHeader from '../components/shared/PageHeader'
import { Card, Button, Badge } from '../components/ui'
import { authService } from '../services'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Settings() {
  const { isDark, toggleTheme } = useTheme()
  const { language, changeLanguage, t } = useLanguage()
  const { user, setAuth, logout } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('general')

  // Verification state variables
  const [verifying, setVerifying] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpCode, setOtpCode] = useState('')

  const handleSendOtp = async () => {
    setOtpLoading(true)
    try {
      await authService.sendVerificationOtp()
      setOtpSent(true)
      toast.success('Verification OTP sent to your email!')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to send verification OTP.')
    } finally {
      setOtpLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault()
    if (!otpCode || otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP code.')
      return
    }
    setOtpLoading(true)
    try {
      const res = await authService.verifyEmailOtp(otpCode)
      if (res?.success && res?.user) {
        setAuth({ user: res.user, role: res.user.role })
        toast.success('Email address verified successfully!')
        setVerifying(false)
        setOtpSent(false)
        setOtpCode('')
      } else {
        toast.error('Verification failed. Invalid OTP.')
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Verification failed. Incorrect OTP.')
    } finally {
      setOtpLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch {
      /* Laravel logout may fail if no token */
    }
    logout()
    navigate('/login')
  }

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'theme', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ]

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <PageHeader
        title="Settings"
        subtitle="Manage your account and preferences"
      />

      {/* Tabs Navigation */}
      <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shrink-0',
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : isDark
                    ? 'bg-dark-border hover:bg-dark-border/80 text-neutral-400'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
              )}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          )
        })}
      </motion.div>

      {/* Content Sections */}
      <motion.div variants={itemVariants} className="space-y-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-6">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    disabled
                    className={cn(
                      'w-full px-4 py-2.5 rounded-lg border transition-colors',
                      isDark
                        ? 'bg-dark-border border-dark-border text-neutral-400'
                        : 'bg-neutral-100 border-neutral-200 text-neutral-600'
                    )}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Email Address
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className={cn(
                        'flex-1 px-4 py-2.5 rounded-lg border transition-colors',
                        isDark
                          ? 'bg-dark-border border-dark-border text-neutral-400'
                          : 'bg-neutral-100 border-neutral-200 text-neutral-600'
                      )}
                    />
                    {user?.email_verified ? (
                      <Badge variant="success" className="h-fit py-2.5 px-3 flex items-center gap-1">
                        <ShieldCheck size={14} /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="h-fit py-2.5 px-3 flex items-center gap-1">
                        <ShieldAlert size={14} /> Unverified
                      </Badge>
                    )}
                  </div>
                </div>

                {!user?.email_verified && (
                  <div className="p-4 rounded-xl border border-dashed border-neutral-200 dark:border-dark-border bg-neutral-50/50 dark:bg-dark-card/30">
                    {!verifying ? (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold">Verify Your Email Address</p>
                          <p className="text-xs text-neutral-500 mt-0.5">Please verify your email to unlock all marketplace and checkout actions.</p>
                        </div>
                        <Button variant="primary" size="sm" onClick={() => { setVerifying(true); handleSendOtp(); }}>
                          Verify Now
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-bold">Email OTP Verification</p>
                          <p className="text-xs text-neutral-500 mt-0.5">We have sent a 6-digit OTP code to your registered email: <strong>{user?.email}</strong></p>
                        </div>

                        {otpSent && (
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row gap-3">
                              <input
                                type="text"
                                maxLength={6}
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="Enter 6-digit OTP"
                                className={cn(
                                  'flex-1 px-4 py-2 rounded-lg border transition-colors text-center tracking-widest font-mono text-lg font-bold',
                                  isDark
                                    ? 'bg-[#080c14] border-dark-border text-neutral-200 focus:border-primary-500'
                                    : 'bg-white border-neutral-300 text-neutral-800 focus:border-primary-500'
                                )}
                                required
                              />
                              <Button type="button" variant="primary" size="md" loading={otpLoading} onClick={handleVerifyOtp}>
                                Confirm Code
                              </Button>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <button type="button" onClick={handleSendOtp} disabled={otpLoading} className="text-primary-600 hover:underline">
                                Resend OTP Code
                              </button>
                              <button type="button" onClick={() => { setVerifying(false); setOtpSent(false); setOtpCode(''); }} className="text-rose-600 hover:underline">
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Role
                  </label>
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" className="capitalize">
                      {user?.role || 'User'}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Language Selection in General Tab */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Globe size={20} /> Language
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { code: 'en', name: 'English', flag: '🇬🇧' },
                  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
                  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2',
                      language === lang.code
                        ? 'border-primary-600 bg-primary-500/10'
                        : isDark
                          ? 'border-dark-border hover:border-primary-500/50'
                          : 'border-neutral-200 hover:border-primary-500/50'
                    )}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                    {language === lang.code && <Badge variant="success">Selected</Badge>}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Theme Settings */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Palette size={20} /> Theme
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
                      {isSelected && <Badge variant="success">Active</Badge>}
                    </button>
                  )
                })}
              </div>
            </Card>

            <Card className={cn('p-6', isDark ? 'bg-dark-border/50' : 'bg-neutral-50')}>
              <h4 className="font-bold mb-3">Color Accent</h4>
              <div className="flex gap-3 flex-wrap">
                {[
                  { name: 'Blue', value: '#3B82F6' },
                  { name: 'Green', value: '#10B981' },
                  { name: 'Purple', value: '#A855F7' },
                  { name: 'Orange', value: '#F97316' },
                ].map((color) => (
                  <button
                    key={color.name}
                    className="w-12 h-12 rounded-lg border-2 border-neutral-300 hover:border-neutral-400 transition-all"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
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
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Lock size={20} /> Security
              </h3>
              <div className="space-y-4">
                <button className="w-full p-4 rounded-lg border-2 border-neutral-200 dark:border-dark-border hover:border-primary-500 transition-all text-left hover:bg-primary-500/5 group">
                  <p className="font-medium group-hover:text-primary-600">Change Password</p>
                  <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Update your login password</p>
                </button>
                <button className="w-full p-4 rounded-lg border-2 border-neutral-200 dark:border-dark-border hover:border-primary-500 transition-all text-left hover:bg-primary-500/5 group">
                  <p className="font-medium group-hover:text-primary-600">Two-Factor Authentication</p>
                  <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Enable 2FA for added security</p>
                </button>
                <button className="w-full p-4 rounded-lg border-2 border-neutral-200 dark:border-dark-border hover:border-primary-500 transition-all text-left hover:bg-primary-500/5 group">
                  <p className="font-medium group-hover:text-primary-600">Active Sessions</p>
                  <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Manage your logged-in devices</p>
                </button>
              </div>
            </Card>

            <Card className="p-6 border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10">
              <h3 className="text-lg font-bold mb-4 text-red-700 dark:text-red-400 flex items-center gap-2">
                <LogOut size={20} /> Danger Zone
              </h3>
              <p className={`mb-4 text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                These actions cannot be undone. Please be careful.
              </p>
              <Button variant="danger" onClick={handleLogout} className="w-full">
                <LogOut size={18} /> Log Out from All Devices
              </Button>
            </Card>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// Utility function
function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
