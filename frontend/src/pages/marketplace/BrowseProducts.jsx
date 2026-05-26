import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, ArrowLeft, ChevronRight, Tag } from 'lucide-react'
import PageHeader from '../../components/shared/PageHeader'
import { Card, Input, Badge, Spinner, Button } from '../../components/ui'
import { productService } from '../../services'
import { useTheme } from '../../hooks/useTheme'
import toast from 'react-hot-toast'

export default function BrowseProducts() {
  const { isDark } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState([])

  // Load favorites from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('agripool_favorites') || '[]')
    const ids = saved.filter(f => f.type === 'Product').map(f => f.id)
    setFavorites(ids)
  }, [])

  // Load crops from backend
  const loadProducts = async () => {
    setLoading(true)
    try {
      const res = await productService.getProducts({
        search: searchTerm,
        tag: selectedTag || undefined
      })
      setProducts(Array.isArray(res) ? res : (res?.data || []))
    } catch (err) {
      console.error(err)
      toast.error('Failed to load crop products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadProducts()
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, selectedTag])

  const toggleFavorite = (item) => {
    setFavorites(prev => {
      const isFav = prev.includes(item.id)
      const next = isFav ? prev.filter(id => id !== item.id) : [...prev, item.id]
      
      const storedFavs = JSON.parse(localStorage.getItem('agripool_favorites') || '[]')
      let nextStored
      if (isFav) {
        nextStored = storedFavs.filter(f => !(f.id === item.id && f.type === 'Product'))
      } else {
        nextStored = [...storedFavs, {
          id: item.id,
          title: item.name,
          type: 'Product',
          price: `₹${item.price}/${item.unit}`,
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
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className={`min-h-screen py-12 px-4 ${isDark ? 'bg-dark-bg' : 'bg-neutral-50'}`}>
      <motion.div
        className="max-w-7xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 mb-4 text-sm font-semibold transition-all duration-200 text-agri-blue hover:text-agri-cyan hover:translate-x-[-4px]"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <PageHeader 
            title="Crop Marketplace" 
            subtitle="Buy fresh agricultural produce directly from verified farmers" 
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 items-center justify-between"
        >
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <Input 
              placeholder="Search crops, farms, or descriptions..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="pl-10" 
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {['', 'Organic', 'Fresh', 'Premium'].map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                {tag || 'All Crops'}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Spinner size="lg" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 text-neutral-500">
            No crops listed matching your filters.
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            <AnimatePresence>
              {products.map((p) => (
                <motion.div key={p.id} variants={itemVariants} exit={{ opacity: 0, scale: 0.95 }}>
                  <Link to={`/marketplace/${p.id}`} className="block h-full">
                    <Card hoverable className="h-full overflow-hidden flex flex-col p-0">
                      {/* Image Section */}
                      <div className={`relative h-48 w-full overflow-hidden ${
                        isDark ? 'bg-dark-border' : 'bg-neutral-100'
                      }`}>
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />

                        {/* Favorite Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleFavorite(p)
                          }}
                          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                            favorites.includes(p.id)
                              ? 'bg-red-500 text-white'
                              : isDark
                              ? 'bg-dark-card text-neutral-400'
                              : 'bg-white text-neutral-600'
                          }`}
                        >
                          <Heart
                            size={20}
                            className={favorites.includes(p.id) ? 'fill-current' : ''}
                          />
                        </motion.button>

                        {/* Tag Badge */}
                        {p.tag && (
                          <Badge variant="primary" className="absolute bottom-3 left-3">
                            {p.tag}
                          </Badge>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 p-6 flex flex-col">
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
                          <Tag size={12} />
                          <span>Direct from Farm</span>
                        </div>

                        <h3 className={`text-lg font-bold mb-1 ${
                          isDark ? 'text-neutral-50' : 'text-neutral-900'
                        }`}>
                          {p.name}
                        </h3>

                        <p className={`text-sm mb-4 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          Farm: {p.farm}
                        </p>

                        <p className={`text-sm line-clamp-2 mb-4 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          {p.desc}
                        </p>

                        {/* Price and Action */}
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-dark-border">
                          <div className={`text-xl font-bold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                            ₹{p.price}/{p.unit}
                          </div>
                          <Button variant="primary" size="sm" className="gap-1">
                            View details <ChevronRight size={16} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
