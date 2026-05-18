import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Package, Heart, TrendingUp } from 'lucide-react'
import StatCard from '../../components/shared/StatCard'
import PageHeader from '../../components/shared/PageHeader'
import { Button, Card } from '../../components/ui'

const PRODUCTS = [
  { id: 1, name: 'Organic Wheat', farm: 'Green Valley', price: 2800, unit: 'quintal' },
  { id: 2, name: 'Fresh Tomatoes', farm: 'Sunrise Farm', price: 45, unit: 'kg' },
]

export default function BuyerDashboard() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <PageHeader
        title="Buyer marketplace"
        subtitle="Discover fresh produce from verified farmers"
        actions={
          <Link to="/marketplace">
            <Button variant="primary">Browse marketplace</Button>
          </Link>
        }
      />

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Orders" value="12" icon={Package} trend="+2" />
        <StatCard label="Saved items" value="8" icon={Heart} />
        <StatCard label="Spent (month)" value="₹15,400" icon={TrendingUp} />
        <StatCard label="Active carts" value="1" icon={ShoppingBag} />
      </motion.div>

      <Card className="p-5">
        <h3 className="font-semibold mb-4">Recommended for you</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PRODUCTS.map((p) => (
            <Link
              key={p.id}
              to={`/marketplace/${p.id}`}
              className="p-4 rounded-xl border border-neutral-200 dark:border-dark-border hover:shadow-md transition-shadow"
            >
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-neutral-500">{p.farm}</p>
              <p className="text-primary-600 dark:text-primary-400 font-semibold mt-2">
                ₹{p.price}/{p.unit}
              </p>
            </Link>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
