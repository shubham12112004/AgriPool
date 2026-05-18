import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { Button, Card, Badge, Input, Alert } from '../components/ui'
import { 
  Star, MapPin, Calendar, Clock, DollarSign, Heart, Share2, 
  ChevronLeft, ChevronRight, CheckCircle, AlertCircle 
} from 'lucide-react'

export default function EquipmentDetail() {
  const { isDark } = useTheme()
  const [isFavorite, setIsFavorite] = useState(false)
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    quantity: 1,
  })

  // Sample equipment detail
  const equipment = {
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
      image: '👨‍🌾',
    },
    images: ['🚜', '🚜', '🚜'],
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
        <motion.button
          variants={itemVariants}
          className={`flex items-center gap-2 mb-8 font-medium ${
            isDark ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'
          }`}
        >
          <ChevronLeft size={20} />
          Back to Equipment
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            {/* Image Gallery */}
            <Card className="p-6 mb-6">
              <div className="text-6xl text-center py-32 bg-gray-100 dark:bg-dark-border rounded-lg mb-4">
                {equipment.images[0]}
              </div>
              <div className="flex gap-2">
                {equipment.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`w-20 h-20 rounded-lg flex items-center justify-center cursor-pointer text-3xl ${
                      idx === 0
                        ? isDark
                          ? 'bg-dark-border border-2 border-primary-500'
                          : 'bg-primary-100 border-2 border-primary-600'
                        : isDark
                        ? 'bg-dark-border'
                        : 'bg-neutral-200'
                    }`}
                  >
                    {img}
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
                  <div className="text-5xl">{equipment.owner.image}</div>
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
                    <span className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>3 days × ₹500</span>
                    <span className={`font-semibold ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
                      ₹1,500
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>Service fee</span>
                    <span className={`font-semibold ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
                      ₹150
                    </span>
                  </div>
                  <div className={`border-t pt-2 flex justify-between ${isDark ? 'border-dark-border' : 'border-neutral-200'}`}>
                    <span className={`font-semibold ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
                      Total
                    </span>
                    <span className={`text-xl font-bold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                      ₹1,650
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <Button variant="primary" size="lg" fullWidth className="mb-3">
                Book Now
              </Button>
              <Button variant="secondary" size="lg" fullWidth>
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
