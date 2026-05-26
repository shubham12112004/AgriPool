import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { Button, Card, Input, Select, Badge, Spinner } from '../components/ui'
import { Search, MapPin, Star, Heart, Clock, ChevronRight, ArrowLeft } from 'lucide-react'
import { equipmentService } from '../services'
import toast from 'react-hot-toast'

export default function BrowseEquipment() {
  const { isDark } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [favorites, setFavorites] = useState([])
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)

  // Load favorites from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('agripool_favorites') || '[]')
    const ids = saved.filter(f => f.type === 'Equipment').map(f => f.id)
    setFavorites(ids)
  }, [])

  // Load equipment from backend
  const loadEquipment = async () => {
    setLoading(true)
    try {
      const res = await equipmentService.getEquipment({
        search: searchTerm,
        category: selectedCategory
      })
      
      let list = Array.isArray(res) ? res : (res?.data || [])
      
      // Client-side sorting
      if (sortBy === 'price-low') {
        list = [...list].sort((a, b) => (a.rental_price || 0) - (b.rental_price || 0))
      } else if (sortBy === 'price-high') {
        list = [...list].sort((a, b) => (b.rental_price || 0) - (a.rental_price || 0))
      } else if (sortBy === 'rating') {
        list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0))
      }
      
      setEquipment(list)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load equipment marketplace.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadEquipment()
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, selectedCategory, sortBy])

  const toggleFavorite = (item) => {
    setFavorites(prev => {
      const isFav = prev.includes(item.id)
      const next = isFav ? prev.filter(id => id !== item.id) : [...prev, item.id]
      
      const storedFavs = JSON.parse(localStorage.getItem('agripool_favorites') || '[]')
      let nextStored
      if (isFav) {
        nextStored = storedFavs.filter(f => !(f.id === item.id && f.type === 'Equipment'))
      } else {
        nextStored = [...storedFavs, {
          id: item.id,
          title: item.name,
          type: 'Equipment',
          price: item.price || `₹${item.rental_price}/day`,
        }]
      }
      localStorage.setItem('agripool_favorites', JSON.stringify(nextStored))
      
      toast.success(isFav ? 'Removed from favorites' : 'Saved to favorites')
      return next
    })
  }

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
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 mb-4 text-sm font-semibold transition-all duration-200 text-agri-blue hover:text-agri-cyan hover:translate-x-[-4px]"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
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
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Spinner size="lg" />
          </div>
        ) : equipment.length === 0 ? (
          <div className="text-center py-24 text-neutral-500">
            No equipment listed matching your filters.
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {equipment.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <Link to={`/equipment/${item.id}`} className="block h-full">
                  <Card hoverable className="h-full overflow-hidden flex flex-col">
                    {/* Image Section */}
                    <div className={`relative h-48 w-full overflow-hidden ${
                      isDark ? 'bg-dark-border' : 'bg-neutral-100'
                    }`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />

                      {/* Favorite Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleFavorite(item)
                        }}
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
                        By <span className="font-semibold">{item.owner?.name || item.owner}</span>
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
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

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
