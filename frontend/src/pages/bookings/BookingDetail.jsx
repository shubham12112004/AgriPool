import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Calendar, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card, Badge, Button } from '../../components/ui'
import AgriMap from '../../components/map/AgriMap'
import { BOOKING_STATUS, BOOKING_STATUS_CONFIG } from '../../config/bookingStatus'
import { formatCurrency } from '../../lib/utils'
import { bookingService } from '../../services'
import { useAuthStore } from '../../store/authStore'
import { ROLES } from '../../config/roles'

export default function BookingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const role = useAuthStore((s) => s.role)
  const isDriver = role === ROLES.DRIVER
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    bookingService
      .getBooking(id)
      .then((res) => setBooking(res.data))
      .catch(() => setBooking(null))
      .finally(() => setLoading(false))
  }, [id])

  const statusCfg = BOOKING_STATUS_CONFIG[booking?.status] || { label: booking?.status, variant: 'primary' }

  const runAction = async (fn, message) => {
    setActionLoading(true)
    try {
      const res = await fn()
      setBooking(res.data)
      toast.success(message)
    } catch {
      toast.error('Action failed')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <p className="text-neutral-500 p-6">Loading...</p>
  if (!booking) return <p className="text-neutral-500 p-6">Booking not found.</p>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-6">
      <Link to="/bookings" className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400">
        <ArrowLeft size={16} /> Back to bookings
      </Link>

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">{booking.title}</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">Booking #{booking.id}</p>
          </div>
          <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-primary-500" />
            {booking.date}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} className="text-primary-500" />
            {booking.pickup_location} → {booking.dropoff_location}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CreditCard size={16} className="text-primary-500" />
            {formatCurrency(booking.amount)}
          </div>
        </div>

        {booking.driver_name && (
          <p className="text-sm mb-4">
            <span className="text-neutral-500">Driver: </span>
            {booking.driver_name}
          </p>
        )}

        <AgriMap height="220px" markers={booking.markers || []} />

        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-neutral-200 dark:border-dark-border">
          {isDriver && booking.status === BOOKING_STATUS.PENDING && (
            <>
              <Button
                variant="primary"
                loading={actionLoading}
                onClick={() => runAction(() => bookingService.acceptBooking(id), 'Trip accepted')}
              >
                Accept trip
              </Button>
              <Button variant="outline" onClick={() => navigate('/bookings?tab=requests')}>
                Back
              </Button>
            </>
          )}
          {isDriver && booking.status === BOOKING_STATUS.ACCEPTED && (
            <Button
              variant="primary"
              loading={actionLoading}
              onClick={() =>
                runAction(
                  () => bookingService.updateStatus(id, 'in_progress'),
                  'Trip started'
                )
              }
            >
              Start trip
            </Button>
          )}
          {isDriver && booking.status === BOOKING_STATUS.IN_PROGRESS && (
            <Button
              variant="primary"
              loading={actionLoading}
              onClick={() =>
                runAction(
                  () => bookingService.updateStatus(id, 'completed'),
                  'Trip completed'
                )
              }
            >
              Mark completed
            </Button>
          )}
          {!isDriver && booking.status !== BOOKING_STATUS.COMPLETED && (
            <Link to={`/payments/checkout?booking=${id}&amount=${booking.amount}&desc=${encodeURIComponent(booking.title)}`}>
              <Button variant="secondary">Pay now</Button>
            </Link>
          )}
          <Link to="/map">
            <Button variant="outline">Open map</Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  )
}
