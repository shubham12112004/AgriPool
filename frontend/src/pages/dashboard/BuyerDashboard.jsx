import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Package, Heart, TrendingUp, Sparkles } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
import { translateStatLabel } from './FarmerDashboard'
import StatCard from '../../components/shared/StatCard'
import PageHeader from '../../components/shared/PageHeader'
import { Button, Card, Spinner } from '../../components/ui'
import { dashboardService, productService } from '../../services'

export default function BuyerDashboard() {
  const { t } = useLanguage()
  const [stats, setStats] = useState([])
  const [savedCount, setSavedCount] = useState(0)
  const [recommended, setRecommended] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Get stats from API
    dashboardService
      .getStats()
      .then((res) => setStats(res.stats || []))
      .catch((err) => console.error(err))

    // 2. Fetch saved count from localStorage
    const saved = JSON.parse(localStorage.getItem('agripool_favorites') || '[]')
    setSavedCount(saved.length)

    // 3. Fetch recommended products
    productService.getProducts()
      .then(res => {
        const list = Array.isArray(res) ? res : (res?.data || [])
        setRecommended(list.slice(0, 4))
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  // Override Saved items value dynamically
  const displayStats = stats.map(s => {
    if (s.label && s.label.toLowerCase() === 'saved items') {
      return { ...s, value: String(savedCount) }
    }
    return s
  })

  const finalStats = displayStats.length
    ? displayStats
    : [
        { label: 'Orders', value: '0', trend: '—' },
        { label: 'Saved items', value: String(savedCount), trend: '—' },
        { label: 'Spent (month)', value: '₹0', trend: '—' },
        { label: 'Active carts', value: '0', trend: '—' },
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
        {finalStats.map((s, i) => (
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
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="text-amber-500" size={18} />
          {t('dashboard.buyer.recommended')}
        </h3>
        
        {loading ? (
          <div className="flex justify-center py-6">
            <Spinner size="md" />
          </div>
        ) : recommended.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-6">No crop recommendations available at this time.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommended.map((p) => (
              <Link
                key={p.id}
                to={`/marketplace/${p.id}`}
                className="p-4 rounded-xl border border-neutral-200 dark:border-dark-border hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <p className="font-medium text-lg">{p.name}</p>
                  <p className="text-sm text-neutral-500">Farm: {p.farm}</p>
                </div>
                <p className="text-primary-600 dark:text-primary-400 font-bold mt-3 text-lg">
                  ₹{p.price}/{p.unit === 'quintal' ? t('dashboard.buyer.unit.quintal') : t('dashboard.buyer.unit.kg')}
                </p>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  )
}

