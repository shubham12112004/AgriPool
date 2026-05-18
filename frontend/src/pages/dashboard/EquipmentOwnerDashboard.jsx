import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DollarSign, Tractor, Calendar, Plus } from 'lucide-react'
import StatCard from '../../components/shared/StatCard'
import PageHeader from '../../components/shared/PageHeader'
import { Button, Card, Badge } from '../../components/ui'

const EQUIPMENT = [
  { id: 1, name: 'Mahindra Tractor 575', rate: '₹800/day', status: 'Available' },
  { id: 2, name: 'Combine Harvester', rate: '₹2,500/day', status: 'Rented' },
]

export default function EquipmentOwnerDashboard() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <PageHeader
        title="Equipment portfolio"
        subtitle="Manage listings, pricing, and rental requests"
        actions={
          <Link to="/equipment/manage">
            <Button variant="primary" className="gap-2">
              <Plus size={18} /> Add equipment
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Monthly earnings" value="₹42,000" icon={DollarSign} trend="+8%" />
        <StatCard label="Listed items" value="5" icon={Tractor} />
        <StatCard label="Pending rentals" value="3" icon={Calendar} trendVariant="warning" trend="3 new" />
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-4">Your equipment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EQUIPMENT.map((eq) => (
            <div
              key={eq.id}
              className="p-4 rounded-xl border border-neutral-200 dark:border-dark-border flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{eq.name}</p>
                <p className="text-sm text-primary-600 dark:text-primary-400">{eq.rate}</p>
              </div>
              <Badge variant={eq.status === 'Available' ? 'success' : 'warning'}>{eq.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
