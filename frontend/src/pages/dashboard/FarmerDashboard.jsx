import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DollarSign, Calendar, Star, TrendingUp, Plus, Truck, MapPin, ArrowRight } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import StatCard from '../../components/shared/StatCard'
import PageHeader from '../../components/shared/PageHeader'
import BookingCard from '../../components/booking/BookingCard'
import AgriMap from '../../components/map/AgriMap'
import { Button, Card } from '../../components/ui'
import { bookingService, dashboardService } from '../../services'

const ICONS = [DollarSign, Calendar, Star, TrendingUp]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function FarmerDashboard() {
  const { isDark } = useTheme()
  const [stats, setStats] = useState([])
  const [bookings, setBookings] = useState([])
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    dashboardService.getStats().then((res) => setStats(res.stats || [])).catch(() => {})
    bookingService.getBookings().then((res) => setBookings((res.data || []).slice(0, 3))).catch(() => {})
    bookingService.getMapMarkers().then((res) => setMarkers(res.data || [])).catch(() => {})
  }, [])

  const displayStats = stats.length
    ? stats
    : [
        { label: 'Total spent', value: '₹0', trend: '—' },
        { label: 'Active bookings', value: '0', trend: '—' },
        { label: 'Rating', value: '4.8', trend: '⭐' },
        { label: 'Completed', value: '0', trend: '—' },
      ]

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <PageHeader
        title="Welcome back"
        subtitle="Manage equipment, transport, and crop listings"
        actions={
          <Link to="/bookings/new">
            <Button variant="primary" className="gap-2">
              <Plus size={18} /> New booking
            </Button>
          </Link>
        }
      />

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {displayStats.map((s, i) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={ICONS[i]} trend={s.trend} />
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <Card className={cn('lg:col-span-1 p-6 hover:shadow-lg transition-shadow', isDark ? 'hover:border-primary-500/30' : 'hover:border-primary-400/50')}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-lg">Live map</h3>
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Nearby drivers & routes</p>
            </div>
            <Link to="/map" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
              <ArrowRight size={20} />
            </Link>
          </div>
          <AgriMap height="280px" markers={markers} zoom={11} />
        </Card>

        {/* Bookings and Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Bookings */}
          <motion.div variants={itemVariants}>
            <Card className={cn('p-6 hover:shadow-lg transition-shadow', isDark ? 'hover:border-primary-500/30' : 'hover:border-primary-400/50')}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-lg">Recent bookings</h3>
                  <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Your latest trips</p>
                </div>
                <Link to="/bookings" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm">
                  View all →
                </Link>
              </div>
              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <div className="py-8 text-center">
                    <Truck size={32} className={`mx-auto mb-3 ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`} />
                    <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>No bookings yet. Create your first trip.</p>
                  </div>
                ) : (
                  bookings.map((b, idx) => (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <BookingCard booking={b} />
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center hover:shadow-lg hover:border-primary-400/50 transition-all cursor-pointer group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform ${ isDark ? 'bg-primary-500/20' : 'bg-primary-100' }`}>
                <MapPin size={24} className="text-primary-600" />
              </div>
              <p className="font-medium text-sm">View Map</p>
            </Card>
            <Card className="p-4 text-center hover:shadow-lg hover:border-primary-400/50 transition-all cursor-pointer group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform ${ isDark ? 'bg-primary-500/20' : 'bg-primary-100' }`}>
                <Calendar size={24} className="text-primary-600" />
              </div>
              <p className="font-medium text-sm">Schedule Trip</p>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Utility function
function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
