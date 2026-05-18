import React from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../../components/shared/PageHeader'
import { Card, Button, Badge } from '../../components/ui'

const LISTINGS = [
  { id: 1, title: 'John Deere Tractor', owner: 'Singh Rentals', flagged: false },
  { id: 2, title: 'Unknown Harvester', owner: 'Quick Agro', flagged: true },
]

export default function AdminModeration() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Equipment moderation" subtitle="Approve or remove listings" />
      {LISTINGS.map((l) => (
        <Card key={l.id} className="p-5 flex justify-between items-center">
          <div>
            <p className="font-semibold">{l.title}</p>
            <p className="text-sm text-neutral-500">{l.owner}</p>
            {l.flagged && <Badge variant="error" className="mt-2">Flagged</Badge>}
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm">Approve</Button>
            <Button variant="danger" size="sm">Remove</Button>
          </div>
        </Card>
      ))}
    </motion.div>
  )
}
