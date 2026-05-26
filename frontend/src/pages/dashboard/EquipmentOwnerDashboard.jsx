import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DollarSign, Tractor, Calendar, Plus } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
import { translateStatLabel } from './FarmerDashboard'
import StatCard from '../../components/shared/StatCard'
import PageHeader from '../../components/shared/PageHeader'
import { Button, Card, Badge } from '../../components/ui'
import { dashboardService } from '../../services'

import { equipmentService } from '../../services'

export default function EquipmentOwnerDashboard() {
  const { t } = useLanguage()
  const [stats, setStats] = useState([])
  const [equipment, setEquipment] = useState([])

  useEffect(() => {
    dashboardService
      .getStats()
      .then((res) => setStats(res.stats || []))
      .catch(() => {})

    equipmentService
      .getEquipment({ owner: true })
      .then((res) => setEquipment(Array.isArray(res) ? res : (res?.data || [])))
      .catch(() => {})
  }, [])

  const displayStats = stats.length
    ? stats
    : [
        { label: 'Monthly earnings', value: '₹0', trend: '—' },
        { label: 'Listed items', value: '0', trend: '—' },
        { label: 'Pending rentals', value: '0', trend: '—' },
      ]

  const ICONS = [DollarSign, Tractor, Calendar]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <PageHeader
        title={t('dashboard.owner.title')}
        subtitle={t('dashboard.owner.subtitle')}
        actions={
          <Link to="/equipment/manage">
            <Button variant="primary" className="gap-2">
              <Plus size={18} /> {t('dashboard.owner.addEquipment')}
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {displayStats.map((s, i) => (
          <StatCard
            key={s.label}
            label={translateStatLabel(s.label, t)}
            value={s.value}
            icon={ICONS[i]}
            trend={s.trend !== '—' ? s.trend : undefined}
            trendVariant={i === 2 && s.value !== '0' ? 'warning' : undefined}
          />
        ))}
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-4">{t('dashboard.owner.yourEquipment')}</h3>
        {equipment.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-6">You have no listed items. Click add equipment to get started.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {equipment.map((eq) => (
              <div
                key={eq.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-dark-border flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{eq.name}</p>
                  <p className="text-sm text-primary-600 dark:text-primary-400">{eq.price}</p>
                </div>
                <Badge variant={eq.availability === 'Available' ? 'success' : 'warning'}>
                  {eq.availability === 'Available' ? t('dashboard.owner.statusAvailable') : t('dashboard.owner.statusRented')}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  )
}

