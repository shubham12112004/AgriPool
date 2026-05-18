import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Button, Card, Input, Select } from '../../components/ui'
import { useAuthStore } from '../../store/authStore'
import { ROLES } from '../../config/roles'
import { getDashboardPathForRole } from '../../store/authStore'

export default function BuyerOnboarding() {
  const navigate = useNavigate()
  const setRole = useAuthStore((s) => s.setRole)
  const [form, setForm] = useState({ businessName: '', businessType: '', city: '', gst: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setRole(ROLES.BUYER)
    toast.success('Buyer profile ready')
    navigate(getDashboardPathForRole(ROLES.BUYER))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Buyer profile</h1>
      <p className="text-neutral-500 mb-8">Business details for ordering produce</p>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Business / profile name" name="businessName" value={form.businessName} onChange={handleChange} required />
          <Select
            label="Business type"
            name="businessType"
            value={form.businessType}
            onChange={handleChange}
            options={[
              { label: 'Select', value: '' },
              { label: 'Retailer', value: 'retailer' },
              { label: 'Wholesaler', value: 'wholesaler' },
              { label: 'Restaurant', value: 'restaurant' },
            ]}
            required
          />
          <Input label="City" name="city" value={form.city} onChange={handleChange} required />
          <Input label="GST (optional)" name="gst" value={form.gst} onChange={handleChange} />
          <Button type="submit" variant="primary" fullWidth size="lg">
            Start browsing
          </Button>
        </form>
      </Card>
    </motion.div>
  )
}
