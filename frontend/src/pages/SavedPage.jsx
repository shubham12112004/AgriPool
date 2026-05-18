import React from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import PageHeader from '../components/shared/PageHeader'
import EmptyState from '../components/shared/EmptyState'
import { Card } from '../components/ui'

const SAVED = [
  { id: 1, title: 'Mahindra Tractor 575', type: 'Equipment', price: '₹800/day' },
  { id: 2, title: 'Organic Wheat — Green Valley', type: 'Product', price: '₹2,800/quintal' },
]

export default function SavedPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Saved" subtitle="Equipment and products you saved" />
      {SAVED.length === 0 ? (
        <EmptyState icon={Heart} title="Nothing saved yet" description="Save items from marketplace or equipment listings." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAVED.map((item) => (
            <Card key={item.id} hoverable className="p-5">
              <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">{item.type}</p>
              <p className="font-semibold mt-1">{item.title}</p>
              <p className="text-sm mt-2">{item.price}</p>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  )
}
