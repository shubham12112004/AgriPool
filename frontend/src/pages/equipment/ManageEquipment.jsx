import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import PageHeader from '../../components/shared/PageHeader'
import { Button, Card, Badge } from '../../components/ui'

const ITEMS = [
  { id: 1, name: 'Mahindra Tractor 575', rate: 800, available: true },
  { id: 2, name: 'Combine Harvester', rate: 2500, available: false },
]

export default function ManageEquipment() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Manage equipment"
        subtitle="Add, edit pricing, and availability"
        actions={<Button variant="primary" className="gap-2"><Plus size={18} /> Add</Button>}
      />
      <div className="space-y-3">
        {ITEMS.map((eq) => (
          <Card key={eq.id} className="p-5 flex flex-wrap justify-between items-center gap-3">
            <div>
              <p className="font-semibold">{eq.name}</p>
              <p className="text-sm text-primary-600 dark:text-primary-400">₹{eq.rate}/day</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={eq.available ? 'success' : 'warning'}>{eq.available ? 'Available' : 'Rented'}</Badge>
              <Link to={`/equipment/${eq.id}`}>
                <Button variant="outline" size="sm">Edit</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}
