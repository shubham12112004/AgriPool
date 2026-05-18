import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { Button, Card, Input, Select, Badge } from '../components/ui'
import { Search, MapPin, Star, Heart, MapPinIcon, Clock, DollarSign, ChevronRight } from 'lucide-react'

export default function BrowseEquipment() {
  const { isDark } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [favorites, setFavorites] = useState([])

  // Sample equipment data
  const equipment = [
    {
      id: 1,
      name: 'Tractor - John Deere',
      category: 'Tractors',
      location: 'Ludhiana, Punjab',
      price: '₹500/day',
      rating: 4.8,
      reviews: 156,
      image: '🚜',
      distance: '2.5 km',
      owner: 'Rajesh Kumar',
      availability: 'Available',
    },
    {
      id: 2,
      name: 'Combine Harvester',
      category: 'Harvesters',
      location: 'Amritsar, Punjab',
      price: '₹1,200/day',
      rating: 4.6,
      reviews: 89,
      image: '🌾',
      distance: '5.2 km',
      owner: 'Singh Equipment',
      availability: 'Available',
    },
    {
      id: 3,
      name: 'Rotavator',
      category: 'Soil Preparation',
      location: 'Patiala, Punjab',
      price: '₹300/day',
      rating: 4.9,
      reviews: 234,
      image: '⚙️',
      distance: '1.8 km',
      owner: 'Farm Solutions',
      availability: 'Available',
    },
    {
      id: 4,
      name: 'Sprayer Equipment',
      category: 'Sprayers',
      location: 'Ludhiana, Punjab',
      price: '₹200/day',
      rating: 4.7,
      reviews: 145,
      image: '💧',
      distance: '3.1 km',
      owner: 'Agri-Tech',
      availability: 'Available',
    },
    {
      id: 5,
      name: 'Thresher Machine',
      category: 'Threshers',
      location: 'Bathinda, Punjab',
      price: '₹400/day',
      rating: 4.5,
      reviews: 78,
      image: '🎌',
      distance: '8.5 km',
      owner: 'Modern Farms',
      availability: 'Coming Soon',
    },
    {
      id: 6,
      name: 'Seeder Machine',
      category: 'Seeders',
      location: 'Sangrur, Punjab',
      price: '₹350/day',
      rating: 4.8,
      reviews: 112,
      image: '🌱',
      distance: '6.2 km',
      owner: 'Quick Harvest',
      availability: 'Available',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  return (
    <div className={`min-h-screen py-12 px-4 ${isDark ? 'bg-dark-bg' : 'bg-neutral-50'}`}>
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
            Equipment Marketplace
          </h1>
          <p className={`text-lg ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Find and rent farming equipment in your area
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Input
            placeholder="Search equipment..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            options={[
              { label: 'All Categories', value: '' },
              { label: 'Tractors', value: 'tractors' },
              { label: 'Harvesters', value: 'harvesters' },
              { label: 'Sprayers', value: 'sprayers' },
              { label: 'Seeders', value: 'seeders' },
            ]}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          />

          <Select
            options={[
              { label: 'Most Popular', value: 'popular' },
              { label: 'Price: Low to High', value: 'price-low' },
              { label: 'Price: High to Low', value: 'price-high' },
              { label: 'Nearest', value: 'distance' },
              { label: 'Highest Rated', value: 'rating' },
            ]}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          />

          <Button variant="primary" size="lg" fullWidth>
            Apply Filters
          </Button>
        </motion.div>

        {/* Equipment Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {equipment.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <Card hoverable className="h-full overflow-hidden flex flex-col">
                {/* Image Section */}
                <div className={`relative h-48 flex items-center justify-center text-6xl ${
                  isDark ? 'bg-dark-border' : 'bg-neutral-100'
                }`}>
                  {item.image}

                  {/* Favorite Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleFavorite(item.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                      favorites.includes(item.id)
                        ? 'bg-red-500 text-white'
                        : isDark
                        ? 'bg-dark-card text-neutral-400'
                        : 'bg-white text-neutral-600'
                    }`}
                  >
                    <Heart
                      size={20}
                      className={favorites.includes(item.id) ? 'fill-current' : ''}
                    />
                  </motion.button>

                  {/* Status Badge */}
                  <Badge
                    variant={item.availability === 'Available' ? 'success' : 'warning'}
                    className="absolute bottom-3 left-3"
                  >
                    {item.availability}
                  </Badge>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 flex flex-col">
                  <h3 className={`text-lg font-bold mb-1 ${
                    isDark ? 'text-neutral-50' : 'text-neutral-900'
                  }`}>
                    {item.name}
                  </h3>

                  <p className={`text-sm mb-4 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {item.category}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(item.rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-dark-border'}
                      />
                    ))}
                    <span className={`text-sm ml-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {item.rating} ({item.reviews})
                    </span>
                  </div>

                  {/* Location and Distance */}
                  <div className={`space-y-2 mb-4 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={16} />
                      {item.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={16} />
                      {item.distance} away
                    </div>
                  </div>

                  {/* Owner */}
                  <p className={`text-sm mb-4 pb-4 border-b ${
                    isDark
                      ? 'text-neutral-400 border-dark-border'
                      : 'text-neutral-600 border-neutral-200'
                  }`}>
                    By <span className="font-semibold">{item.owner}</span>
                  </p>

                  {/* Price and Action */}
                  <div className="mt-auto flex items-center justify-between">
                    <div className={`text-2xl font-bold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                      {item.price}
                    </div>
                    <Button variant="primary" size="sm" className="gap-1">
                      Book <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <motion.div variants={itemVariants} className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Equipment
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
