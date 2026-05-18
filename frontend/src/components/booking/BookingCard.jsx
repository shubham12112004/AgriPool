import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, MapPin, ChevronRight } from 'lucide-react'
import { Card, Badge } from '../ui'
import { BOOKING_STATUS_CONFIG } from '../../config/bookingStatus'
import { useTheme } from '../../hooks/useTheme'
import { formatCurrency } from '../../lib/utils'

export default function BookingCard({ booking }) {
  const { isDark } = useTheme()
  const statusCfg = BOOKING_STATUS_CONFIG[booking.status] || { label: booking.status, variant: 'primary' }

  return (
    <motion.div whileHover={{ y: -2 }}>
      <Card hoverable className="p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <motion.div layout className="flex-1 min-w-0">
            <motion.div layout className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold truncate">{booking.title || booking.type}</h3>
              <Badge variant={statusCfg.variant} size="sm">{statusCfg.label}</Badge>
            </motion.div>
            <div className={`flex flex-wrap gap-4 text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {booking.date}
              </span>
              {booking.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {booking.location}
                </span>
              )}
            </div>
          </motion.div>
          <div className="flex items-center gap-4">
            <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(booking.amount || 0)}
            </p>
            <Link
              to={`/bookings/${booking.id}`}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-dark-border' : 'hover:bg-neutral-100'
              }`}
            >
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
