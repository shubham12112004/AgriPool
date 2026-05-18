import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { XCircle } from 'lucide-react'
import { Button, Card } from '../../components/ui'

export default function PaymentFailed() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto text-center">
      <Card className="p-8">
        <XCircle className="mx-auto text-red-500 mb-4" size={64} />
        <h1 className="text-2xl font-bold mb-2">Payment failed</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-6">
          Something went wrong. No amount was charged. Please try again.
        </p>
        <Link to="/payments/checkout">
          <Button variant="primary" fullWidth>Try again</Button>
        </Link>
      </Card>
    </motion.div>
  )
}
