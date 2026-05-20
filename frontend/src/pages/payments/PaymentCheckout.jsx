import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import PageHeader from '../../components/shared/PageHeader'
import { Button, Card } from '../../components/ui'
import { formatCurrency } from '../../lib/utils'
import { paymentService } from '../../services'
import { saveLastPayment } from '../../lib/paymentReceipt'

export default function PaymentCheckout() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const amount = Number(searchParams.get('amount')) || 1200
  const bookingId = searchParams.get('booking') || null
  const description = searchParams.get('desc') || `Booking #${bookingId || 'new'}`

  const goSuccess = (payment) => {
    saveLastPayment(payment)
    navigate('/payments/success', { state: { payment } })
  }

  const handleDemoPay = async () => {
    setDemoLoading(true)
    // Artificially delay for 2.5s to show the beautiful coin animation
    await new Promise((r) => setTimeout(r, 2500))
    try {
      const res = await paymentService.demoComplete({
        amount,
        booking_id: bookingId,
        description,
      })
      toast.success('Demo payment completed')
      goSuccess(res.payment)
    } catch {
      toast.error('Demo payment failed — log in and try again')
    } finally {
      setDemoLoading(false)
    }
  }

  const handlePay = async () => {
    setLoading(true)
    try {
      const order = await paymentService.createOrder({ amount, booking_id: bookingId })
      if (window.Razorpay && order?.key && !order.demo) {
        const rzp = new window.Razorpay({
          key: order.key,
          amount: order.amount,
          currency: order.currency || 'INR',
          order_id: order.order_id,
          name: 'AgriPool',
          description,
          handler: async (response) => {
            try {
              const res = await paymentService.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount,
                booking_id: bookingId,
                description,
              })
              goSuccess(res.payment)
            } catch {
              navigate('/payments/failed')
            }
          },
        })
        rzp.open()
      } else {
        await handleDemoPay()
      }
    } catch {
      toast('Using demo payment', { icon: '💳' })
      await handleDemoPay()
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-4">
      {/* Spinning Coin Loader Overlay */}
      <AnimatePresence>
        {(loading || demoLoading) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white"
          >
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Glowing backdrop */}
              <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-2xl animate-pulse" />
              
              {/* 3D Spinning Coin */}
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                style={{ transformStyle: 'preserve-3d' }}
                className="w-24 h-24 bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 rounded-full flex items-center justify-center border-4 border-amber-200 shadow-2xl relative"
              >
                {/* Coin Inner Border */}
                <div className="absolute inset-2 border-2 border-dashed border-amber-300/60 rounded-full" />
                {/* Rupee Symbol */}
                <span className="text-4xl font-extrabold text-amber-950 font-serif drop-shadow-md">₹</span>
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-6 space-y-2 px-4"
            >
              <h3 className="text-xl font-bold tracking-tight">Processing Secure Payment</h3>
              <p className="text-sm text-neutral-300 max-w-xs mx-auto">
                {loading ? 'Initializing Razorpay secure portal...' : 'Validating demo credentials...'}
              </p>
              
              {/* Progress simulator */}
              <div className="w-48 h-1 bg-neutral-800 rounded-full overflow-hidden mx-auto mt-4 relative">
                <motion.div
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PageHeader title="Checkout" subtitle="Pay with Razorpay or try demo mode" />
      <Card className="p-6 space-y-4">
        <div className="flex justify-between text-lg">
          <span>Total</span>
          <span className="font-bold text-primary-600 dark:text-primary-400">{formatCurrency(amount)}</span>
        </div>
        <p className="text-sm text-neutral-500">
          {bookingId ? `Booking #${bookingId}` : 'New booking'} · {description}
        </p>
        <Button variant="primary" fullWidth size="lg" loading={loading} onClick={handlePay}>
          Pay with Razorpay
        </Button>
        <Button variant="outline" fullWidth size="lg" loading={demoLoading} onClick={handleDemoPay}>
          Demo payment (no Razorpay)
        </Button>
        <p className="text-xs text-neutral-500 text-center">
          Demo mode creates a real receipt you can download — ideal while Razorpay keys are being fixed.
        </p>
      </Card>
    </motion.div>
  )
}
