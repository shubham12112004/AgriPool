import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Shield, Sparkles } from 'lucide-react'
import PageHeader from '../../components/shared/PageHeader'
import { Button, Card, Spinner } from '../../components/ui'
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
  const [initializing, setInitializing] = useState(true)
  const [orderInfo, setOrderInfo] = useState(null)

  const amount = Number(searchParams.get('amount')) || 1200
  const bookingId = searchParams.get('booking') || null
  const description = searchParams.get('desc') || `Booking #${bookingId || 'new'}`

  useEffect(() => {
    const initOrder = async () => {
      try {
        const order = await paymentService.createOrder({ amount, booking_id: bookingId })
        setOrderInfo(order)
      } catch (err) {
        console.error('Failed to pre-create order details', err)
      } finally {
        setInitializing(false)
      }
    }
    initOrder()
  }, [amount, bookingId])

  const goSuccess = (payment) => {
    saveLastPayment(payment)
    navigate('/payments/success', { state: { payment } })
  }

  const handlePay = async () => {
    setLoading(true)
    try {
      let order = orderInfo
      if (!order) {
        order = await paymentService.createOrder({ amount, booking_id: bookingId })
      }
      
      if (order?.demo) {
        // If it's a demo order, call demo completion directly to bypass Razorpay script loading
        await handleDemoBypass()
        return
      }

      await loadRazorpayScript()
      
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

  const handleDemoBypass = async () => {
    setLoading(true)
    try {
      const res = await paymentService.demoComplete({
        amount,
        booking_id: bookingId,
        description,
      })
      if (res.success && res.payment) {
        toast.success('Demo payment successfully completed!')
        goSuccess(res.payment)
      } else {
        toast.error('Failed to register demo payment.')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error completing demo payment.')
    } finally {
      setLoading(false)
    }
  }

  if (initializing) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Spinner size="lg" />
        <p className="text-sm text-neutral-500">Preparing secure checkout...</p>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto space-y-4"
    >
      <PageHeader title="Checkout" subtitle={orderInfo?.demo ? 'Demo Checkout Mode' : 'Secure Payment via Razorpay'} />
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

        {orderInfo?.demo ? (
          <div className="space-y-3">
            <Button 
              variant="primary" 
              fullWidth 
              size="lg" 
              loading={loading} 
              onClick={handleDemoBypass}
              className="bg-linear-to-r from-emerald-500 to-teal-500 border-0 text-white font-bold h-12 shadow-[0_4px_20px_rgba(16,200,166,0.3)] hover:shadow-[0_6px_25px_rgba(16,200,166,0.45)] gap-2"
            >
              <Sparkles size={18} /> Complete Demo Payment
            </Button>
            <p className="text-[11px] text-center text-amber-600 dark:text-amber-400 font-medium">
              Demo mode detected. Payment is processed sandbox-only, no real transaction occurs.
            </p>
          </div>
        ) : (
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
        )}
        
        <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
          <Shield size={14} className="text-emerald-500" />
          <span>Secured by 256-bit SSL encryption</span>
        </div>
      </Card>
    </motion.div>
  )
}
