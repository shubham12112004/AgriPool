import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
