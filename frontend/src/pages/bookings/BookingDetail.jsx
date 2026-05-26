import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Calendar, CreditCard, Truck, CheckCircle2, ShieldAlert } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card, Badge, Button } from '../../components/ui'
import AgriMap from '../../components/map/AgriMap'
import { BOOKING_STATUS, BOOKING_STATUS_CONFIG } from '../../config/bookingStatus'
import { formatCurrency } from '../../lib/utils'
import { bookingService, vehicleService } from '../../services'
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

  const [vehicleType, setVehicleType] = useState('Tractor')
  const [registration, setRegistration] = useState('')
  const [estimatedDays, setEstimatedDays] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('Pay on Delivery')
  const [showStartTripModal, setShowStartTripModal] = useState(false)

  useEffect(() => {
    bookingService
      .getBooking(id)
      .then((res) => setBooking(res.data))
      .catch(() => setBooking(null))
      .finally(() => setLoading(false))

    if (isDriver) {
      vehicleService.getVehicle()
        .then((res) => {
          if (res.data?.data) {
            setVehicleType(res.data.data.vehicle_type || 'Tractor')
            setRegistration(res.data.data.registration || '')
          }
        })
        .catch((e) => console.log('No registered vehicle found:', e))
    }
  }, [id, isDriver])

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

  const handleStartTripSubmit = async (e) => {
    e.preventDefault()
    if (!registration.trim()) {
      toast.error('Vehicle registration is required.')
      return
    }
    setActionLoading(true)
    try {
      const response = await bookingService.updateStatus(id, 'in_progress', {
        vehicle_type: vehicleType,
        registration: registration.trim(),
        estimated_days: estimatedDays,
        payment_method: paymentMethod,
      })
      setBooking(response.data)
      setShowStartTripModal(false)
      toast.success('Trip started successfully! Farmer has been notified.')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to start trip.')
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
          <div className="flex gap-2">
            <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
            {booking.is_paid ? (
              <Badge variant="success">Paid Online</Badge>
            ) : (
              <Badge variant="warning">Unpaid</Badge>
            )}
          </div>
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
              onClick={() => setShowStartTripModal(true)}
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
          {!isDriver && booking.status !== BOOKING_STATUS.COMPLETED && !booking.is_paid && (
            <Link to={`/payments/checkout?booking=${id}&amount=${booking.amount}&desc=${encodeURIComponent(booking.title)}`}>
              <Button variant="secondary">Pay now</Button>
            </Link>
          )}
          <Link to="/map">
            <Button variant="outline">Open map</Button>
          </Link>
        </div>
      </Card>

      <AnimatePresence>
        {showStartTripModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStartTripModal(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-2xl dark:bg-dark-card border border-neutral-100 dark:border-dark-border"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-xl">
                  <Truck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Start Trip Confirmation</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Please confirm vehicle & delivery details before departure</p>
                </div>
              </div>

              <form onSubmit={handleStartTripSubmit} className="space-y-4">
                {/* Route Info */}
                <div className="p-3.5 bg-neutral-50 dark:bg-dark-bg rounded-xl border border-neutral-100 dark:border-dark-border/40">
                  <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Scheduled Route</span>
                  <div className="mt-1 flex items-center gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    <MapPin size={14} className="text-emerald-500 shrink-0" />
                    <span>{booking.pickup_location}</span>
                    <span className="text-neutral-400">→</span>
                    <span>{booking.dropoff_location}</span>
                  </div>
                </div>

                {/* Vehicle Type */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-bg px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  >
                    <option value="Tractor">Tractor</option>
                    <option value="Tractor with Trolley">Tractor with Trolley</option>
                    <option value="Mini Truck (Tata Ace/etc)">Mini Truck (Tata Ace/etc)</option>
                    <option value="Truck (6-Wheeler/etc)">Truck (6-Wheeler/etc)</option>
                    <option value="Harvester">Harvester</option>
                  </select>
                </div>

                {/* Vehicle Registration */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Vehicle Registration Number</label>
                  <input
                    type="text"
                    value={registration}
                    onChange={(e) => setRegistration(e.target.value)}
                    placeholder="e.g. PB-10-CD-1234"
                    className="w-full rounded-xl border border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-bg px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Estimated Days */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Estimated Duration</label>
                    <select
                      value={estimatedDays}
                      onChange={(e) => setEstimatedDays(Number(e.target.value))}
                      className="w-full rounded-xl border border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-bg px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    >
                      <option value={1}>1 Day</option>
                      <option value={2}>2 Days</option>
                      <option value={3}>3 Days</option>
                      <option value={4}>4 Days</option>
                      <option value={5}>5 Days</option>
                      <option value={7}>7 Days</option>
                    </select>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Payment Terms</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-bg px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    >
                      <option value="Pay on Delivery">Pay on Delivery</option>
                      <option value="Already Paid Online">Already Paid Online</option>
                      <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/40 rounded-xl text-amber-800 dark:text-amber-300 text-xs">
                  <ShieldAlert size={16} className="shrink-0" />
                  <span>Starting the trip will send an instant notification to the farmer with these details.</span>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-100 dark:border-dark-border/60">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowStartTripModal(false)}
                    disabled={actionLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={actionLoading}
                  >
                    Confirm & Start Trip
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
