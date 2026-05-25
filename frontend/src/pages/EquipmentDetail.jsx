import React, { useState, useMemo } from 'react'
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
import { bookingService } from '../services'

export default function EquipmentDetail() {
  const { id } = useParams()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    quantity: 1,
  })

  // Mock equipment database matching BrowseEquipment
  const equipmentList = [
    {
      id: 1,
      name: 'Tractor - John Deere',
      category: 'Tractors',
      price: '₹500/day',
      rating: 4.8,
      reviewCount: 156,
      location: 'Ludhiana, Punjab',
      distance: '2.5 km',
      description: 'Well-maintained John Deere tractor in excellent condition. Perfect for plowing, tilling, and various agricultural operations. Equipped with modern features for efficient farming.',
      specs: [
        { label: 'Engine Power', value: '75 HP' },
        { label: 'Wheel Base', value: '2500 mm' },
        { label: 'Transmission', value: 'Manual' },
        { label: 'Year', value: '2018' },
      ],
      features: [
        'Power Steering',
        'Cabin with AC',
        'Good Traction Tires',
        'Water Cooled Engine',
        'Creeper Gearbox',
      ],
      owner: {
        name: 'Rajesh Kumar',
        rating: 4.9,
        reviews: 245,
        location: 'Ludhiana, Punjab',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      },
      images: [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1524486361537-8ad15938e1a3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=800&q=80'
      ],
      customerReviews: [
        {
          author: 'Harpreet Singh',
          rating: 5,
          text: 'Excellent tractor! Very well maintained and owner is very helpful.',
          date: '2 weeks ago',
        },
        {
          author: 'Priya Sharma',
          rating: 4,
          text: 'Good condition. Could have better fuel efficiency but overall satisfied.',
          date: '1 month ago',
        },
      ],
    },
    {
      id: 2,
      name: 'Combine Harvester',
      category: 'Harvesters',
      price: '₹1,200/day',
      rating: 4.6,
      reviewCount: 89,
      location: 'Amritsar, Punjab',
      distance: '5.2 km',
      description: 'High-performance Combine Harvester, ideal for harvesting wheat, paddy, and other crops efficiently. Minimizes grain loss and speeds up your harvesting operations.',
      specs: [
        { label: 'Cutter Bar Width', value: '14 Feet' },
        { label: 'Grain Tank Capacity', value: '3000 Litres' },
        { label: 'Engine Power', value: '110 HP' },
        { label: 'Year', value: '2020' },
      ],
      features: [
        'Adjustable Cutter Bar',
        'Comfort Operator Cabin',
        'GPS Guidance Ready',
        'High Grain Cleanliness',
        'Low Grain Loss Technology',
      ],
      owner: {
        name: 'Gurpreet Singh',
        rating: 4.8,
        reviews: 132,
        location: 'Amritsar, Punjab',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      },
      images: [
        'https://images.unsplash.com/photo-1554769945-af468c934022?auto=format&fit=crop&w=800&q=80',
        'https://upload.wikimedia.org/wikipedia/commons/3/3b/Combine_Harvester_in_Field_-_geograph.org.uk_-_385537.jpg',
        'https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      customerReviews: [
        {
          author: 'Jaspal Singh',
          rating: 5,
          text: 'The harvester worked flawlessly. Saved us a lot of time this season.',
          date: '3 weeks ago',
        },
      ],
    },
    {
      id: 3,
      name: 'Rotavator',
      category: 'Soil Preparation',
      price: '₹300/day',
      rating: 4.9,
      reviewCount: 234,
      location: 'Patiala, Punjab',
      distance: '1.8 km',
      description: 'Heavy-duty Rotavator (rotary tiller) for perfect seedbed preparation. It breaks up soil clods efficiently, mixes crop residues, and enhances soil aeration.',
      specs: [
        { label: 'Working Width', value: '6 Feet' },
        { label: 'Number of Blades', value: '42 L-Type' },
        { label: 'Gearbox', value: 'Multi-Speed' },
        { label: 'Year', value: '2021' },
      ],
      features: [
        'Heavy-Duty Frame',
        'Multi-Speed Gearbox',
        'L-Type Long Life Blades',
        'Trailing Board Adjustment',
        'Sturdy Side Drive',
      ],
      owner: {
        name: 'Amit Sharma',
        rating: 4.9,
        reviews: 412,
        location: 'Patiala, Punjab',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      },
      images: [
        'https://images.pexels.com/photos/2165688/pexels-photo-2165688.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://upload.wikimedia.org/wikipedia/commons/0/05/A_tractor_and_rotavator_tractor_mounted_tiller_at_Dalby_-_geograph.org.uk_-_554755.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/3/33/Kuhn_EL201_-_rotavator_at_Bernard_Saunders_WD_2008_-_IMG_4072.jpg'
      ],
      customerReviews: [
        {
          author: 'Raman Preet',
          rating: 5,
          text: 'Perfect blades, soil prepared in a single pass. Will rent again!',
          date: '1 week ago',
        },
      ],
    },
    {
      id: 4,
      name: 'Sprayer Equipment',
      category: 'Sprayers',
      price: '₹200/day',
      rating: 4.7,
      reviewCount: 145,
      location: 'Ludhiana, Punjab',
      distance: '3.1 km',
      description: 'Tractor-mounted boom sprayer for uniform distribution of crop protection products and fertilizers. High tank capacity ensures long operation cycles.',
      specs: [
        { label: 'Tank Capacity', value: '600 Litres' },
        { label: 'Boom Length', value: '12 Metres' },
        { label: 'Pump Type', value: 'Diaphragm' },
        { label: 'Year', value: '2019' },
      ],
      features: [
        'Height Adjustable Boom',
        'Triple Action Nozzles',
        'Chemical Induction Tank',
        'Anti-Drip System',
        'Clean Water Tank',
      ],
      owner: {
        name: 'Baldev Singh',
        rating: 4.6,
        reviews: 98,
        location: 'Ludhiana, Punjab',
        image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
      },
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/e/ee/Case_IH_tractor_with_Hardi_field_sprayer%2C_Lolland.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/f/f4/Tractor_and_Sprayer_-_geograph.org.uk_-_1913814.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/c/c2/Tractor_and_sprayer_working_near_Congham_-_geograph.org.uk_-_3419172.jpg'
      ],
      customerReviews: [
        {
          author: 'Sukhdev Singh',
          rating: 4,
          text: 'Satisfactory performance. The boom height is easy to adjust.',
          date: '2 months ago',
        },
      ],
    },
    {
      id: 5,
      name: 'Thresher Machine',
      category: 'Threshers',
      price: '₹400/day',
      rating: 4.5,
      reviewCount: 78,
      location: 'Bathinda, Punjab',
      distance: '8.5 km',
      description: 'Multi-crop thresher designed for separating grain from wheat, mustard, millet, and other crops. Ensures clean grain separation with minimal breakage.',
      specs: [
        { label: 'Capacity', value: '1.5 to 2 Tons/Hr' },
        { label: 'Required Power', value: '35 HP Tractor' },
        { label: 'Blower System', value: 'Double Blower' },
        { label: 'Year', value: '2020' },
      ],
      features: [
        'Multi-Crop Compatibility',
        'Adjustable Concave Clearance',
        'High Capacity Blowers',
        'Robust Steel Body',
        'Low Maintenance Design',
      ],
      owner: {
        name: 'Vijay Kumar',
        rating: 4.7,
        reviews: 124,
        location: 'Bathinda, Punjab',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      },
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/a/a7/Threshing_Machine_In_Action.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/8/86/A_rice_threshing_machine_01.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/b/be/Case_threshing_machine_VA2.jpg'
      ],
      customerReviews: [
        {
          author: 'Gurmukh Singh',
          rating: 5,
          text: 'Very clean grain separation. Hardly any grain breakage.',
          date: '1 month ago',
        },
      ],
    },
    {
      id: 6,
      name: 'Seeder Machine',
      category: 'Seeders',
      price: '₹350/day',
      rating: 4.8,
      reviewCount: 112,
      location: 'Sangrur, Punjab',
      distance: '6.2 km',
      description: 'Modern seed drill / seeder machine for precise planting. Ensures optimal seed depth and row spacing for maximum crop yield and seed conservation.',
      specs: [
        { label: 'Row Count', value: '9 Row' },
        { label: 'Seed Tank Capacity', value: '150 Kg' },
        { label: 'Fertilizer Tank', value: '150 Kg' },
        { label: 'Year', value: '2021' },
      ],
      features: [
        'Dual Box (Seed & Fertilizer)',
        'Adjustable Row Spacing',
        'Depth Control Wheels',
        'Fluted Roller Seed Feed',
        'Heavy duty frame',
      ],
      owner: {
        name: 'Jaspreet Singh',
        rating: 4.9,
        reviews: 180,
        location: 'Sangrur, Punjab',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      },
      images: [
        'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
        'https://upload.wikimedia.org/wikipedia/commons/6/65/John_Deere_tractor_with_seed_drill.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/b/b2/Tractor_planet_-_John_Deere_tractor_with_seed_drill_and_gulls.jpg'
      ],
      customerReviews: [
        {
          author: 'Karan Johal',
          rating: 5,
          text: 'Sowing depth was perfect, wheat germinated beautifully.',
          date: '2 weeks ago',
        },
      ],
    },
  ]

  // Find matching equipment by ID or fall back to ID 1
  const equipment = equipmentList.find((item) => item.id === parseInt(id)) || equipmentList[0]

  // Extract numeric daily price from e.g. "₹500/day" or "₹1,200/day"
  const dailyPrice = useMemo(() => {
    const raw = equipment.price.replace(/[^0-9,]/g, '').replace(/,/g, '')
    return parseInt(raw) || 500
  }, [equipment.price])

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
                  src={equipment.images[activeImageIdx] || equipment.images[0]}
                  alt={equipment.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                {equipment.images.map((img, idx) => (
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
                    onClick={() => setIsFavorite(!isFavorite)}
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
