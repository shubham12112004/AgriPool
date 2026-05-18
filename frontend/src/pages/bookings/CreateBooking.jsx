import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import PageHeader from '../../components/shared/PageHeader'
import { Button, Card, Input, Select } from '../../components/ui'
import { bookingService } from '../../services'

export default function CreateBooking() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    type: 'transport',
    title: '',
    pickup_location: 'Ludhiana, Punjab',
    dropoff_location: 'Amritsar, Punjab',
    date: '',
    time: '',
    notes: '',
    amount: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await bookingService.createBooking({
        ...form,
        amount: form.amount ? Number(form.amount) : undefined,
      })
      const booking = res.data
      toast.success('Booking created')
      navigate(`/payments/checkout?booking=${booking.id}&amount=${booking.amount}&desc=${encodeURIComponent(booking.title)}`)
    } catch (err) {
      toast.error(err?.message || 'Could not create booking — please log in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto">
      <PageHeader title="New booking" subtitle="Book equipment or a driver for transport" />
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Service type"
            name="type"
            value={form.type}
            onChange={handleChange}
            options={[
              { label: 'Equipment rental', value: 'equipment' },
              { label: 'Transport / driver', value: 'transport' },
            ]}
          />
          <Input
            label="Title (optional)"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Wheat transport to mandi"
          />
          <Input
            label="Pickup location"
            name="pickup_location"
            value={form.pickup_location}
            onChange={handleChange}
            required
          />
          <Input
            label="Drop-off location"
            name="dropoff_location"
            value={form.dropoff_location}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} required />
            <Input label="Time" name="time" type="time" value={form.time} onChange={handleChange} required />
          </div>
          <Input
            label="Estimated amount (₹)"
            name="amount"
            type="number"
            min="1"
            value={form.amount}
            onChange={handleChange}
            placeholder="1200"
          />
          <Input label="Notes" name="notes" value={form.notes} onChange={handleChange} placeholder="Optional details" />
          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Continue to payment
          </Button>
        </form>
      </Card>
    </motion.div>
  )
}
