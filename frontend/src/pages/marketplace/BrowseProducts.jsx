import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import PageHeader from '../../components/shared/PageHeader'
import { Card, Input, Badge } from '../../components/ui'

const PRODUCTS = [
  { id: 1, name: 'Organic Wheat', farm: 'Green Valley', price: 2800, unit: 'quintal', tag: 'Organic' },
  { id: 2, name: 'Fresh Tomatoes', farm: 'Sunrise Farm', price: 45, unit: 'kg', tag: 'Fresh' },
  { id: 3, name: 'Basmati Rice', farm: 'Punjab Gold', price: 3200, unit: 'quintal', tag: 'Premium' },
]

export default function BrowseProducts() {
  const [q, setQ] = useState('')
  const list = PRODUCTS.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Marketplace" subtitle="Buy fresh produce directly from farmers" />
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
        <Input placeholder="Search crops..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((p) => (
          <Link key={p.id} to={`/marketplace/${p.id}`}>
            <Card hoverable className="p-5 h-full">
              <Badge variant="primary" size="sm">{p.tag}</Badge>
              <h3 className="font-semibold mt-3">{p.name}</h3>
              <p className="text-sm text-neutral-500">{p.farm}</p>
              <p className="text-primary-600 dark:text-primary-400 font-bold mt-3">
                ₹{p.price}/{p.unit}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}
