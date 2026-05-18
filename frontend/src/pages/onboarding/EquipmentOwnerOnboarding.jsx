import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Button, Card, Input, Textarea } from '../../components/ui'
import { useAuthStore } from '../../store/authStore'
import { ROLES } from '../../config/roles'
import { getDashboardPathForRole } from '../../store/authStore'

export default function EquipmentOwnerOnboarding() {
  const navigate = useNavigate()
  const setRole = useAuthStore((s) => s.setRole)
  const [form, setForm] = useState({ equipmentName: '', category: '', dailyRate: '', description: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setRole(ROLES.EQUIPMENT_OWNER)
    toast.success('Equipment profile saved')
    navigate(getDashboardPathForRole(ROLES.EQUIPMENT_OWNER))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Equipment owner setup</h1>
      <p className="text-neutral-500 mb-8">List your first equipment item</p>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Equipment name" name="equipmentName" value={form.equipmentName} onChange={handleChange} required />
          <Input label="Category" name="category" value={form.category} onChange={handleChange} placeholder="Tractor, Harvester..." required />
          <Input label="Daily rate (₹)" name="dailyRate" type="number" value={form.dailyRate} onChange={handleChange} required />
          <Textarea label="Description" name="description" value={form.description} onChange={handleChange} rows={3} />
          <div className="rounded-xl border border-dashed p-4 text-center text-sm text-neutral-500">
            Upload equipment photos
          </div>
          <Button type="submit" variant="primary" fullWidth size="lg">
            Finish onboarding
          </Button>
        </form>
      </Card>
    </motion.div>
  )
}
