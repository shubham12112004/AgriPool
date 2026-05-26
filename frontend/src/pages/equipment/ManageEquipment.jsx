import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, AlertCircle, Edit, Trash2 } from 'lucide-react'
import PageHeader from '../../components/shared/PageHeader'
import { Button, Card, Badge, Input, Select, Textarea, Spinner } from '../../components/ui'
import { equipmentService } from '../../services'
import toast from 'react-hot-toast'

export default function ManageEquipment() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: '',
    category: 'tractors',
    daily_rate: '',
    description: '',
    location: 'Ludhiana, Punjab',
    image_url: '',
    available: true
  })

  const loadListings = async () => {
    setLoading(true)
    try {
      const res = await equipmentService.getEquipment({ owner: true })
      setItems(Array.isArray(res) ? res : (res?.data || []))
    } catch (err) {
      console.error(err)
      toast.error('Failed to load your equipment listings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadListings()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await equipmentService.createEquipment({
        name: form.name,
        category: form.category,
        daily_rate: Number(form.daily_rate),
        description: form.description,
        location: form.location,
        image_url: form.image_url || undefined,
        available: form.available
      })
      toast.success('Equipment listed successfully!')
      setShowAddModal(false)
      // Reset form
      setForm({
        name: '',
        category: 'tractors',
        daily_rate: '',
        description: '',
        location: 'Ludhiana, Punjab',
        image_url: '',
        available: true
      })
      loadListings()
    } catch (err) {
      console.error(err)
      toast.error('Failed to list equipment.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return
    try {
      await equipmentService.deleteEquipment(id)
      toast.success('Listing deleted.')
      setItems(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete listing.')
    }
  }

  const handleToggleAvailability = async (item) => {
    try {
      await equipmentService.updateEquipment(item.id, {
        available: !item.available
      })
      toast.success('Availability status updated.')
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, availability: !item.available ? 'Available' : 'Rented', available: !item.available } : i))
    } catch (err) {
      console.error(err)
      toast.error('Failed to update status.')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Manage equipment"
        subtitle="Add, edit pricing, and machinery availability"
        actions={
          <Button variant="primary" className="gap-2" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Add Equipment
          </Button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : items.length === 0 ? (
        <Card className="p-8 text-center text-neutral-500 dark:text-neutral-400">
          <AlertCircle size={40} className="mx-auto mb-3 text-neutral-400" />
          <p className="font-semibold text-lg">No equipment listed yet</p>
          <p className="text-sm mt-1 mb-4">List your tractors, seeders, or harvesters to start earning.</p>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>List First Item</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((eq) => (
            <Card key={eq.id} className="p-5 flex flex-wrap justify-between items-center gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                {eq.image && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-neutral-100">
                    <img src={eq.image} alt={eq.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-lg">{eq.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="primary" size="sm">{eq.category}</Badge>
                    <span className="text-sm text-primary-600 dark:text-primary-400 font-semibold">{eq.price}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant={eq.availability === 'Available' ? 'success' : 'warning'} 
                  size="sm"
                  onClick={() => handleToggleAvailability(eq)}
                >
                  {eq.availability === 'Available' ? 'Available' : 'Rented'}
                </Button>
                <Link to={`/equipment/${eq.id}`}>
                  <Button variant="outline" size="sm" className="p-2"><Edit size={16} /></Button>
                </Link>
                <Button variant="outline" size="sm" className="p-2 border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(eq.id)}><Trash2 size={16} /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-2xl dark:bg-dark-card border border-neutral-100 dark:border-dark-border"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">List Farming Equipment</h3>
                <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-dark-border"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Equipment Model Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. John Deere 5050 D"
                  required
                />

                <Select
                  label="Category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  options={[
                    { label: 'Tractors', value: 'tractors' },
                    { label: 'Harvesters', value: 'harvesters' },
                    { label: 'Sprayers', value: 'sprayers' },
                    { label: 'Seeders', value: 'seeders' },
                    { label: 'Soil Preparation', value: 'soil preparation' }
                  ]}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Daily Rental Rate (₹)"
                    name="daily_rate"
                    type="number"
                    value={form.daily_rate}
                    onChange={handleChange}
                    placeholder="e.g. 500"
                    required
                  />

                  <Input
                    label="Location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Ludhiana, Punjab"
                    required
                  />
                </div>

                <Input
                  label="Photo Image URL (Optional)"
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="e.g. https://images.unsplash.com/..."
                />

                <Textarea
                  label="Description / Condition"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe the condition, horsepower, implements included..."
                />

                <Button type="submit" variant="primary" fullWidth size="lg" loading={submitting}>
                  Publish Listing
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
