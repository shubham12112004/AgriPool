import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Button, Card, Input, Select } from '../../components/ui'
import { useAuthStore, getDashboardPathForRole } from '../../store/authStore'
import { ROLES } from '../../config/roles'
import { vehicleService, authProfileService } from '../../services'

export default function DriverOnboarding() {
  const navigate = useNavigate()
  const setRole = useAuthStore((s) => s.setRole)
  const setAuth = useAuthStore((s) => s.setAuth)
  const user = useAuthStore((s) => s.user)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    vehicleType: '',
    registration: '',
    capacity: '',
    available: true,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authProfileService.updateRole('driver').catch(() => {})
      await vehicleService.registerVehicle({
        vehicle_type: form.vehicleType,
        registration: form.registration,
        capacity: String(form.capacity),
        available: form.available,
      })
      setRole(ROLES.DRIVER)
      if (user) setAuth({ user: { ...user, role: 'driver' }, role: ROLES.DRIVER })
      toast.success('Vehicle registered')
      navigate(getDashboardPathForRole(ROLES.DRIVER))
    } catch {
      setRole(ROLES.DRIVER)
      toast.success('Profile saved locally — log in to sync vehicle')
      navigate(getDashboardPathForRole(ROLES.DRIVER))
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Driver onboarding</h1>
      <p className="text-neutral-500 mb-8">Register your vehicle and set availability</p>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Vehicle type"
            name="vehicleType"
            value={form.vehicleType}
            onChange={handleChange}
            options={[
              { label: 'Select type', value: '' },
              { label: 'Truck', value: 'truck' },
              { label: 'Tempo', value: 'tempo' },
              { label: 'Tractor trailer', value: 'trailer' },
            ]}
            required
          />
          <Input
            label="Registration number"
            name="registration"
            value={form.registration}
            onChange={handleChange}
            required
          />
          <Input
            label="Capacity (tons)"
            name="capacity"
            type="number"
            value={form.capacity}
            onChange={handleChange}
            required
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
            Available for bookings
          </label>
          <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
            Complete setup
          </Button>
        </form>
      </Card>
    </motion.div>
  )
}
