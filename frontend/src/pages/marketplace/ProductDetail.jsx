import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageCircle, Shield, ShoppingCart, Tag, MapPin, User } from 'lucide-react'
import { Card, Button, Badge, Spinner } from '../../components/ui'
import { productService } from '../../services'
import { useTheme } from '../../hooks/useTheme'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true)
      try {
        const data = await productService.getProductById(id)
        setProduct(data)
      } catch (err) {
        console.error(err)
        toast.error('Failed to load crop product details.')
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
        <p className="text-neutral-500 mb-6 font-medium">The crop listing you are looking for does not exist or has been removed.</p>
        <Link to="/marketplace">
          <Button variant="primary">Back to Marketplace</Button>
        </Link>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto py-8 px-4 space-y-6"
    >
      <Link 
        to="/marketplace" 
        className="inline-flex items-center gap-2 text-sm font-semibold text-agri-blue hover:text-agri-cyan transition-colors"
      >
        <ArrowLeft size={16} /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Image */}
        <div className={`rounded-2xl overflow-hidden aspect-video md:aspect-square relative shadow-lg ${
          isDark ? 'bg-dark-border' : 'bg-neutral-100'
        }`}>
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          {product.tag && (
            <Badge variant="primary" className="absolute top-4 left-4 text-xs font-semibold py-1 px-3">
              {product.tag}
            </Badge>
          )}
        </div>

        {/* Right Side: Info Card */}
        <Card className="p-6 flex flex-col justify-between shadow-xl border-neutral-200/60 dark:border-white/5 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="success" className="gap-1">
                <Shield size={12} /> Verified Listing
              </Badge>
              <span className="text-xs text-neutral-400 font-medium">Listing #{product.id}</span>
            </div>

            <div className="space-y-1">
              <h1 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
                {product.name}
              </h1>
              <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1">
                <MapPin size={14} /> Farm: {product.farm}
              </p>
            </div>

            <div className="py-3 border-y border-neutral-100 dark:border-dark-border flex items-baseline gap-2">
              <span className={`text-4xl font-extrabold ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
                ₹{product.price}
              </span>
              <span className="text-lg font-medium text-neutral-500">
                / {product.unit}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Description</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                {product.desc}
              </p>
            </div>

            {product.farmer && (
              <div className="pt-4 border-t border-neutral-100 dark:border-dark-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-dark-border overflow-hidden shrink-0">
                  {product.farmer.avatar ? (
                    <img src={product.farmer.avatar} alt={product.farmer.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-500 bg-neutral-100 dark:bg-neutral-800">
                      <User size={20} />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-medium">Farmer Profile</p>
                  <p className="text-sm font-semibold">{product.farmer.name}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link 
              to={`/payments/checkout?amount=${product.price}&desc=${encodeURIComponent(`${product.name} (${product.unit}) from ${product.farm}`)}`}
              className="flex-1"
            >
              <Button variant="primary" fullWidth size="lg" className="gap-2 bg-linear-to-r from-agri-green to-agri-cyan text-white font-bold h-12">
                <ShoppingCart size={18} /> Order Now
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2" onClick={() => toast.success('Connecting with farmer...')}>
              <MessageCircle size={18} /> Contact Farmer
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}
