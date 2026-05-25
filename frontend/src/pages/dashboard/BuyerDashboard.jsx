import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Package, Heart, TrendingUp } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
import { translateStatLabel } from './FarmerDashboard'
import StatCard from '../../components/shared/StatCard'
import PageHeader from '../../components/shared/PageHeader'
import { Button, Card } from '../../components/ui'
import { dashboardService } from '../../services'

const PRODUCTS = [
  { id: 1, name: 'Organic Wheat', farm: 'Green Valley', price: 2800, unit: 'quintal' },
  { id: 2, name: 'Fresh Tomatoes', farm: 'Sunrise Farm', price: 45, unit: 'kg' },
]

export default function BuyerDashboard() {
  const { t } = useLanguage()
  const [stats, setStats] = useState([])

  useEffect(() => {
    dashboardService
      .getStats()
      .then((res) => setStats(res.stats || []))
      .catch(() => {})
  }, [])

  const displayStats = stats.length
    ? stats
    : [
        { label: 'Orders', value: '0', trend: '—' },
        { label: 'Saved items', value: '8', trend: '—' },
        { label: 'Spent (month)', value: '₹0', trend: '—' },
        { label: 'Active carts', value: '1', trend: '—' },
      ]

  const ICONS = [Package, Heart, TrendingUp, ShoppingBag]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <PageHeader
        title={t('dashboard.buyer.title')}
        subtitle={t('dashboard.buyer.subtitle')}
        actions={
          <Link to="/marketplace">
            <Button variant="primary">{t('dashboard.buyer.browseMarketplace')}</Button>
          </Link>
        }
      />

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {displayStats.map((s, i) => (
          <StatCard
            key={s.label}
            label={translateStatLabel(s.label, t)}
            value={s.value}
            icon={ICONS[i]}
            trend={s.trend !== '—' ? s.trend : undefined}
          />
        ))}
      </motion.div>

      <Card className="p-5">
        <h3 className="font-semibold mb-4">{t('dashboard.buyer.recommended')}</h3>
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
                ₹{p.price}/{p.unit === 'quintal' ? t('dashboard.buyer.unit.quintal') : t('dashboard.buyer.unit.kg')}
              </p>
            </Link>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

