import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Shield } from 'lucide-react'
import PageHeader from '../../components/shared/PageHeader'
import { Button, Card } from '../../components/ui'
import { formatCurrency } from '../../lib/utils'
import { paymentService } from '../../services'
import { saveLastPayment } from '../../lib/paymentReceipt'

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const existingScript = document.querySelector('script[data-razorpay-checkout]')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Razorpay script failed to load')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.defer = true
    script.dataset.razorpayCheckout = 'true'
    script.onload = () => resolve(true)
    script.onerror = () => reject(new Error('Razorpay script failed to load'))
    document.body.appendChild(script)
  })
}

export default function PaymentCheckout() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const amount = Number(searchParams.get('amount')) || 1200
  const bookingId = searchParams.get('booking') || null
  const description = searchParams.get('desc') || `Booking #${bookingId || 'new'}`

  const goSuccess = (payment) => {
    saveLastPayment(payment)
    navigate('/payments/success', { state: { payment } })
  }

  const handlePay = async () => {
    setLoading(true)
    try {
      await loadRazorpayScript()
      const order = await paymentService.createOrder({ amount, booking_id: bookingId })
      
      if (window.Razorpay && order?.key) {
        const options = {
          key: order.key,
          amount: order.amount,
          currency: order.currency || 'INR',
          name: 'AgriPool',
          description,
          handler: async (response) => {
            try {
              const res = await paymentService.verifyPayment({
                razorpay_order_id: response.razorpay_order_id || null,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature || null,
                amount,
                booking_id: bookingId,
                description,
              })
              goSuccess(res.payment)
            } catch (err) {
              console.error(err)
              navigate('/payments/failed')
            }
          },
          theme: {
            color: '#10c8a6', // AgriPool brand green
          }
        }

        if (order.order_id) {
          options.order_id = order.order_id
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        toast.error('Unable to initialize payment gateway: Site key is missing.')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to connect to the payment gateway. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto space-y-4"
    >
      <PageHeader title="Checkout" subtitle="Secure Payment via Razorpay" />
      <Card className="p-6 space-y-6 shadow-xl border-neutral-200/60 dark:border-white/5 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl">
        <div className="flex justify-between text-lg border-b pb-4 border-neutral-100 dark:border-neutral-800">
          <span className="text-neutral-600 dark:text-neutral-400">Total Amount</span>
          <span className="font-bold text-primary-600 dark:text-primary-400">{formatCurrency(amount)}</span>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-semibold">Description</p>
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            {bookingId ? `Booking #${bookingId}` : 'New Booking'} · {description}
          </p>
        </div>
        
        <Button 
          variant="primary" 
          fullWidth 
          size="lg" 
          loading={loading} 
          onClick={handlePay}
          className="bg-linear-to-r from-agri-green to-agri-cyan border-0 text-white font-bold h-12 shadow-[0_4px_20px_rgba(16,200,166,0.3)] hover:shadow-[0_6px_25px_rgba(16,200,166,0.45)]"
        >
          Pay with Razorpay
        </Button>
        
        <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
          <Shield size={14} className="text-emerald-500" />
          <span>Secured by 256-bit SSL encryption</span>
        </div>
      </Card>
    </motion.div>
  )
}
