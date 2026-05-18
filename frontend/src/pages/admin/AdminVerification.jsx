import React from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../../components/shared/PageHeader'
import { Card, Button, Badge } from '../../components/ui'

const PENDING = [
  { id: 1, name: 'Amit Singh', type: 'Driver license', submitted: '2h ago' },
  { id: 2, name: 'Priya Devi', type: 'Vehicle RC', submitted: '1d ago' },
]

export default function AdminVerification() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Verification queue" subtitle="Review driver and owner documents" />
      <div className="space-y-3">
        {PENDING.map((item) => (
          <Card key={item.id} className="p-5 flex flex-wrap justify-between items-center gap-3">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-neutral-500">{item.type} · {item.submitted}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm">Approve</Button>
              <Button variant="outline" size="sm">Reject</Button>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}
