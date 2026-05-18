import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DollarSign, Truck, Star, MapPin, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import StatCard from '../../components/shared/StatCard'
import PageHeader from '../../components/shared/PageHeader'
import BookingCard from '../../components/booking/BookingCard'
import AgriMap from '../../components/map/AgriMap'
import { Button, Card, Badge } from '../../components/ui'
import { bookingService, dashboardService, vehicleService } from '../../services'

const ICONS = [DollarSign, Truck, Star, MapPin]

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

export default function DriverDashboard() {
  const { isDark } = useTheme()
  const [stats, setStats] = useState([])
  const [requests, setRequests] = useState([])
  const [markers, setMarkers] = useState([])
  const [available, setAvailable] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dashboardService
      .getStats()
      .then((res) => {
        setStats(res.stats || [])
        if (typeof res.vehicle_available === 'boolean') setAvailable(res.vehicle_available)
      })
      .catch(() => {})
    bookingService
      .getBookings({ tab: 'requests' })
      .then((res) => setRequests((res.data || []).slice(0, 3)))
      .catch(() => {})
    bookingService.getMapMarkers().then((res) => setMarkers(res.data || [])).catch(() => {})
    vehicleService
      .getVehicle()
      .then((res) => {
        if (res.data) setAvailable(res.data.available)
      })
      .catch(() => {})
  }, [])

  const toggleAvailability = async () => {
    setLoading(true)
    try {
      await vehicleService.updateVehicle({ available: !available })
      setAvailable(!available)
    } catch {
      setAvailable((v) => !v)
    }
    setLoading(false)
  }

  const displayStats = stats.length
    ? stats
    : [
        { label: 'Earnings (month)', value: '₹0', trend: '—' },
        { label: 'Active trips', value: '0', trend: 'Live' },
        { label: 'Rating', value: '4.9', trend: '⭐' },
        { label: 'Jobs done', value: '0', trend: '—' },
      ]

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <PageHeader title="Driver hub" subtitle="Accept requests and track your route" />

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {displayStats.map((s, i) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={ICONS[i]} trend={s.trend} />
        ))}
      </motion.div>

      {/* Availability Status */}
      <motion.div variants={itemVariants}>
        <Card className={cn(
          'p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-lg transition-shadow',
          isDark ? 'hover:border-primary-500/30' : 'hover:border-primary-400/50',
          available ? 'border-green-500/30 bg-green-500/5' : 'border-yellow-500/30 bg-yellow-500/5'
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center',
              available ? 'bg-green-500/20' : 'bg-yellow-500/20'
            )}>
              {available ? <CheckCircle size={24} className="text-green-600" /> : <AlertCircle size={24} className="text-yellow-600" />}
            </div>
            <div>
              <p className="font-bold text-lg">Availability Status</p>
              <p className={cn(`text-sm`, isDark ? 'text-neutral-400' : 'text-neutral-600')}>
                {available ? '✓ You are visible to farmers and can accept bookings' : '⚠ You are hidden from search'}
              </p>
            </div>
          </div>
          <Button
            variant={available ? 'secondary' : 'primary'}
            onClick={toggleAvailability}
            disabled={loading}
            className="shrink-0"
          >
            <Badge variant={available ? 'success' : 'warning'} className="cursor-pointer">
              {available ? 'Online' : 'Offline'}
            </Badge>
          </Button>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <Card className={cn('lg:col-span-1 p-6 hover:shadow-lg transition-shadow', isDark ? 'hover:border-primary-500/30' : 'hover:border-primary-400/50')}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-lg">Route map</h3>
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Real-time location</p>
            </div>
            <Link to="/map" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
              <ArrowRight size={20} />
            </Link>
          </div>
          <AgriMap
            height="280px"
            markers={markers.length ? markers : [{ position: [30.9, 75.8], popup: 'Your area' }]}
            zoom={12}
          />
        </Card>

        {/* Booking Requests and Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Requests */}
          <motion.div variants={itemVariants}>
            <Card className={cn('p-6 hover:shadow-lg transition-shadow', isDark ? 'hover:border-primary-500/30' : 'hover:border-primary-400/50')}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-lg">Booking requests</h3>
                  <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Pending assignments</p>
                </div>
                <Link to="/bookings" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm">
                  View all →
                </Link>
              </div>
              <div className="space-y-3">
                {requests.length === 0 ? (
                  <div className="py-8 text-center">
                    <Truck size={32} className={`mx-auto mb-3 ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`} />
                    <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>No open requests. Check back soon.</p>
                  </div>
                ) : (
                  requests.map((b, idx) => (
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
                <DollarSign size={24} className="text-primary-600" />
              </div>
              <p className="font-medium text-sm">Earnings</p>
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
