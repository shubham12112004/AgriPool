import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { Card, Button, Badge } from '../../components/ui'

export default function ProductDetail() {
  const { id } = useParams()
  const product = { id, name: 'Organic Wheat', farm: 'Green Valley Farm', price: 2800, unit: 'quintal', desc: 'Premium quality wheat, harvested this season.' }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
      <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400">
        <ArrowLeft size={16} /> Back
      </Link>
      <Card className="p-6">
        <Badge variant="success">Verified farmer</Badge>
        <h1 className="text-2xl font-bold mt-3">{product.name}</h1>
        <p className="text-neutral-500">{product.farm}</p>
        <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-4">
          ₹{product.price}<span className="text-base font-normal text-neutral-500">/{product.unit}</span>
        </p>
        <p className="mt-4 text-neutral-600 dark:text-neutral-300">{product.desc}</p>
        <div className="flex gap-3 mt-6">
          <Link to={`/payments/checkout?product=${id}`} className="flex-1">
            <Button variant="primary" fullWidth>Order now</Button>
          </Link>
          <Button variant="outline" className="gap-2">
            <MessageCircle size={18} /> Contact
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
