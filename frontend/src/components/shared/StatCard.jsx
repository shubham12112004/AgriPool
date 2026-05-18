import React from 'react'
import { motion } from 'framer-motion'
import { Card, Badge } from '../ui'
import { useTheme } from '../../hooks/useTheme'

export default function StatCard({ label, value, icon: Icon, trend, trendVariant = 'success' }) {
  const { isDark } = useTheme()

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card variant="glass" className="p-5 h-full">
        <div className="flex items-start justify-between mb-3">
          <div
            className={`p-2.5 rounded-xl ${
              isDark ? 'bg-primary-500/15 text-primary-400' : 'bg-primary-50 text-primary-600'
            }`}
          >
            {Icon && <Icon size={22} />}
          </div>
          {trend && (
            <Badge variant={trendVariant} size="sm">
              {trend}
            </Badge>
          )}
        </div>
        <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{label}</p>
        <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
          {value}
        </p>
      </Card>
    </motion.div>
  )
}
