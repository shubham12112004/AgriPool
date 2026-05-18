import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Button } from '../../components/ui'
import PaymentReceiptSlip from '../../components/payments/PaymentReceiptSlip'
import { loadLastPayment } from '../../lib/paymentReceipt'
import { useAuthStore } from '../../store/authStore'

export default function PaymentSuccess() {
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const payment = location.state?.payment || loadLastPayment()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto space-y-6"
    >
      <div className="text-center">
        <CheckCircle className="mx-auto text-emerald-500 mb-4" size={64} />
        <h1 className="text-2xl font-bold mb-2">Payment successful</h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Your transaction is complete. Download your receipt below.
        </p>
      </div>

      {payment ? (
        <PaymentReceiptSlip payment={payment} userName={user?.name || 'Customer'} />
      ) : (
        <p className="text-center text-sm text-neutral-500">Receipt details unavailable.</p>
      )}

      <div className="flex flex-col gap-2">
        <Link to="/payments/history">
          <Button variant="primary" fullWidth>Payment history</Button>
        </Link>
        <Link to="/bookings">
          <Button variant="outline" fullWidth>Back to bookings</Button>
        </Link>
      </div>
    </motion.div>
  )
}
