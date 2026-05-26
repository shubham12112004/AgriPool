import React, { useState, useMemo, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useTheme } from '../hooks/useTheme'
import { Button, Card, Badge, Input, Alert } from '../components/ui'
import { 
  Star, MapPin, Calendar, Clock, DollarSign, Heart, Share2, 
  ChevronLeft, ChevronRight, CheckCircle, AlertCircle 
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { bookingService, equipmentService } from '../services'
import { Spinner } from '../components/ui'

export default function EquipmentDetail() {
  const { id } = useParams()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [equipment, setEquipment] = useState(null)
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    quantity: 1,
  })

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true)
      try {
        const data = await equipmentService.getEquipmentById(id)
        setEquipment(data)

        // Check favorites state
        const saved = JSON.parse(localStorage.getItem('agripool_favorites') || '[]')
        const isFav = saved.some(f => f.id === data.id && f.type === 'Equipment')
        setIsFavorite(isFav)
      } catch (err) {
        console.error(err)
        toast.error('Failed to load equipment details.')
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  const handleToggleFavorite = () => {
    if (!equipment) return
    setIsFavorite(prev => {
      const nextFav = !prev
      const stored = JSON.parse(localStorage.getItem('agripool_favorites') || '[]')
      let nextStored
      if (prev) {
        nextStored = stored.filter(f => !(f.id === equipment.id && f.type === 'Equipment'))
      } else {
        nextStored = [...stored, {
          id: equipment.id,
          title: equipment.name,
          type: 'Equipment',
          price: equipment.price,
        }]
      }
      localStorage.setItem('agripool_favorites', JSON.stringify(nextStored))
      toast.success(prev ? 'Removed from favorites' : 'Saved to favorites')
      return nextFav
    })
  }

  // Extract numeric daily price from e.g. "₹500/day" or "₹1,200/day"
  const dailyPrice = useMemo(() => {
    if (!equipment?.price) return 500
    const raw = equipment.price.replace(/[^0-9,]/g, '').replace(/,/g, '')
    return parseInt(raw) || 500
  }, [equipment?.price])

  // Calculate number of days between start and end date
  const numDays = useMemo(() => {
    if (!bookingData.startDate || !bookingData.endDate) return 1
    const diff = new Date(bookingData.endDate) - new Date(bookingData.startDate)
    const days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
    return days
  }, [bookingData.startDate, bookingData.endDate])

  const rentalCost = dailyPrice * numDays * bookingData.quantity
  const serviceFee = Math.round(rentalCost * 0.1) // 10% service fee
  const totalAmount = rentalCost + serviceFee

  // Handle Book Now
  const handleBookNow = async () => {
    if (!user) {
      toast.error('Please sign in to book equipment')
      navigate('/login')
      return
    }
    if (!bookingData.startDate || !bookingData.endDate) {
      toast.error('Please select start and end dates')
      return
    }
    if (new Date(bookingData.endDate) <= new Date(bookingData.startDate)) {
      toast.error('End date must be after start date')
      return
    }

    setBookingLoading(true)
    try {
      const res = await bookingService.createBooking({
        type: 'equipment',
        title: `${equipment.name} Rental`,
        pickup_location: equipment.location,
        dropoff_location: equipment.location,
        date: bookingData.startDate,
        time: '08:00',
        notes: `Rental from ${bookingData.startDate} to ${bookingData.endDate}. Quantity: ${bookingData.quantity}`,
        amount: totalAmount,
        equipment_id: equipment.id,
        start_date: bookingData.startDate,
        end_date: bookingData.endDate,
        quantity: bookingData.quantity,
      })
      const booking = res?.data || res
      toast.success('Booking created! Proceeding to payment...')
      navigate(
        `/payments/checkout?booking=${booking?.id || 'new'}&amount=${totalAmount}&desc=${encodeURIComponent(equipment.name + ' Rental')}`
      )
    } catch (err) {
      // If API fails (e.g. not authenticated properly), still allow checkout with params
      const msg = err?.message || ''
      if (msg.toLowerCase().includes('unauthenticated') || msg.toLowerCase().includes('401')) {
        toast.error('Session expired. Please log in again.')
        navigate('/login')
      } else {
        // Fallback: go directly to checkout without a booking ID
        toast('Proceeding to checkout...', { icon: '💳' })
        navigate(
          `/payments/checkout?amount=${totalAmount}&desc=${encodeURIComponent(equipment.name + ' Rental (' + numDays + ' days)')}`
        )
      }
    } finally {
      setBookingLoading(false)
    }
  }

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Spinner size="lg" />
        <p className="text-neutral-500 animate-pulse text-sm">Loading details...</p>
      </div>
    )
  }

  if (!equipment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-neutral-500 text-sm">Equipment details not found.</p>
        <Link to="/equipment">
          <Button variant="primary">Back to Marketplace</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className={`min-h-screen py-8 px-4 ${isDark ? 'bg-dark-bg' : 'bg-neutral-50'}`}>
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back Button */}
        <Link to="/equipment">
          <motion.button
            variants={itemVariants}
            className={`flex items-center gap-2 mb-8 font-medium ${
              isDark ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'
            }`}
          >
            <ChevronLeft size={20} />
            Back to Equipment
          </motion.button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            {/* Image Gallery */}
            <Card className="p-6 mb-6">
              <div className="h-96 w-full bg-gray-100 dark:bg-dark-border rounded-lg mb-4 overflow-hidden">
                <img
                  src={(equipment.images || [equipment.image])[activeImageIdx] || equipment.image}
                  alt={equipment.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                {(equipment.images || [equipment.image]).map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer ${
                      idx === activeImageIdx
                        ? isDark
                          ? 'border-2 border-primary-500'
                          : 'border-2 border-primary-600'
                        : isDark
                        ? 'bg-dark-border'
                        : 'bg-neutral-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${equipment.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Equipment Info */}
            <Card className="p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className={`text-4xl font-bold mb-2 ${
                    isDark ? 'text-neutral-50' : 'text-neutral-900'
                  }`}>
                    {equipment.name}
                  </h1>
                  <p className={`${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {equipment.category}
                  </p>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleToggleFavorite}
                    className={`p-3 rounded-lg transition-colors ${
                      isFavorite
                        ? 'bg-red-500 text-white'
                        : isDark
                        ? 'bg-dark-border text-neutral-400'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                  </motion.button>
                  <button className={`p-3 rounded-lg ${
                    isDark
                      ? 'bg-dark-border text-neutral-400 hover:bg-dark-border/80'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}>
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.floor(equipment.rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-dark-border'}
                  />
                ))}
                <span className={`ml-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {equipment.rating} • {equipment.reviewCount} reviews
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 mb-4 text-lg">
                <MapPin size={20} className={isDark ? 'text-primary-400' : 'text-primary-600'} />
                <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>
                  {equipment.location} • {equipment.distance} away
                </span>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6 mb-6">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
                About This Equipment
              </h2>
              <p className={`leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-700'}`}>
                {equipment.description}
              </p>
            </Card>

            {/* Specifications */}
            <Card className="p-6 mb-6">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
                Specifications
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {equipment.specs.map((spec, idx) => (
                  <div key={idx} className={`p-4 rounded-lg ${
                    isDark ? 'bg-dark-border' : 'bg-neutral-100'
                  }`}>
                    <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {spec.label}
                    </p>
                    <p className={`text-lg font-semibold ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Features */}
            <Card className="p-6 mb-6">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
                Features
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {equipment.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle size={20} className={isDark ? 'text-primary-400' : 'text-primary-600'} />
                    <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Owner Info */}
            <Card className="p-6 mb-6">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
                Owner
              </h2>
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-primary-200 dark:border-primary-800">
                    <img
                      src={equipment.owner.image}
                      alt={equipment.owner.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
                      {equipment.owner.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(equipment.owner.rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-dark-border'}
                        />
                      ))}
                      <span className={`text-sm ml-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {equipment.owner.rating} ({equipment.owner.reviews})
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="md">
                  Contact Owner
                </Button>
              </div>
            </Card>

            {/* Reviews */}
            <Card className="p-6">
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
                Reviews
              </h2>
              <div className="space-y-4">
                {equipment.customerReviews.map((review, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      isDark
                        ? 'bg-dark-border border-dark-border'
                        : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-semibold ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
                        {review.author}
                      </h4>
                      <span className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {review.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-dark-border'}
                        />
                      ))}
                    </div>
                    <p className={isDark ? 'text-neutral-400' : 'text-neutral-700'}>
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Booking Sidebar */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              {/* Price */}
              <div className="mb-6 pb-6 border-b border-neutral-200 dark:border-dark-border">
                <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Price per day
                </p>
                <p className={`text-4xl font-bold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                  {equipment.price}
                </p>
              </div>

              {/* Booking Form */}
              <div className="space-y-4 mb-6">
                <h3 className={`text-lg font-bold ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
                  Book This Equipment
                </h3>

                <Input
                  label="Start Date"
                  type="date"
                  value={bookingData.startDate}
                  onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                  required
                />

                <Input
                  label="End Date"
                  type="date"
                  value={bookingData.endDate}
                  onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                  required
                />

                <Input
                  label="Quantity"
                  type="number"
                  min="1"
                  value={bookingData.quantity}
                  onChange={(e) => setBookingData({ ...bookingData, quantity: parseInt(e.target.value) })}
                  required
                />
              </div>

              {/* Price Breakdown */}
              <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-dark-border' : 'bg-neutral-100'}`}>
                <div className="space-y-2 text-sm mb-3">
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>
                      {numDays} day{numDays !== 1 ? 's' : ''} × {equipment.price.split('/')[0]} × qty {bookingData.quantity}
                    </span>
                    <span className={`font-semibold ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
                      ₹{rentalCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>Service fee (10%)</span>
                    <span className={`font-semibold ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
                      ₹{serviceFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className={`border-t pt-2 flex justify-between ${isDark ? 'border-dark-border' : 'border-neutral-200'}`}>
                    <span className={`font-semibold ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
                      Total
                    </span>
                    <span className={`text-xl font-bold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="mb-3"
                loading={bookingLoading}
                onClick={handleBookNow}
                disabled={!bookingData.startDate || !bookingData.endDate}
              >
                {!bookingData.startDate || !bookingData.endDate ? 'Select dates to book' : `Book Now — ₹${totalAmount.toLocaleString('en-IN')}`}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={() => window.open(`mailto:?subject=Inquiry about ${equipment.name}&body=Hi ${equipment.owner.name}, I am interested in renting your ${equipment.name} listed on AgriPool.`)}
              >
                Contact Owner
              </Button>

              {/* Info */}
              <div className={`mt-6 p-4 rounded-lg ${
                isDark
                  ? 'bg-blue-900/20 border border-blue-800'
                  : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex gap-2">
                  <AlertCircle size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                  <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                    Equipment is available. Complete your booking within 24 hours.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
