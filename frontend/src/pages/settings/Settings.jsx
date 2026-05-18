import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useTheme } from '../../hooks/useTheme'
import { useLanguage } from '../../hooks/useLanguage'
import PageHeader from '../../components/shared/PageHeader'
import { Card, Input, Button, Tabs, Select } from '../../components/ui'
import { vehicleService } from '../../services'
import { Moon, Sun, Globe, Bell, Lock, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Settings() {
  const { isDark, toggleTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'vehicle' ? 3 : 0
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' })
  const [vehicle, setVehicle] = useState({
    vehicle_type: '',
    registration: '',
    capacity: '',
    available: true,
  })
  const [vehicleLoading, setVehicleLoading] = useState(false)

  useEffect(() => {
    vehicleService
      .getVehicle()
      .then((res) => {
        if (res.data) setVehicle(res.data)
      })
      .catch(() => {})
  }, [])

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
              <div className="space-y-4 max-w-lg">
                <Input label="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                <Input label="Email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                <Input label="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                <Button variant="primary">Save profile</Button>
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
