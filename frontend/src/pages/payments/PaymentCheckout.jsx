import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Shield, Lock, CheckCircle, CreditCard, Smartphone, Building2, ChevronRight, ArrowLeft, Loader2, Play, Pause, X, Landmark, Wallet } from 'lucide-react'
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

/* ─── Confetti Particle ─── */
function ConfettiParticle({ index }) {
  const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']
  const color = colors[index % colors.length]
  const size = 6 + Math.random() * 6
  const xEnd = (Math.random() - 0.5) * 500
  const yEnd = Math.random() * 400 + 100
  const rotation = Math.random() * 720 - 360

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
      animate={{ x: xEnd, y: -yEnd, opacity: 0, scale: 0.3, rotate: rotation }}
      transition={{ duration: 1.2 + Math.random() * 0.8, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        backgroundColor: color,
        zIndex: 60,
      }}
    />
  )
}

/* ─── Step 1: Razorpay Checkout Modal (Split View, Authentic Styling) ─── */
function StepCheckoutModal({
  amount,
  description,
  isAutoPlay,
  setIsAutoPlay,
  selectedMethod,
  setSelectedMethod,
  cardNo,
  setCardNo,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCardCvv,
  cardName,
  setCardName,
  upiId,
  setUpiId,
  selectedBank,
  setSelectedBank,
  onProceed,
  onClose
}) {
  const tabs = [
    { id: 'card', icon: <CreditCard size={16} />, label: 'Card' },
    { id: 'upi', icon: <Smartphone size={16} />, label: 'UPI / QR' },
    { id: 'netbanking', icon: <Building2 size={16} />, label: 'Netbanking' },
  ]

  const formatCardNumber = (val) => {
    return val.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()
  }

  const handleCardNoChange = (e) => {
    setIsAutoPlay(false)
    const val = e.target.value.replace(/\D/g, '').slice(0, 16)
    setCardNo(val)
  }

  const handleExpiryChange = (e) => {
    setIsAutoPlay(false)
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 2) {
      val = val.slice(0, 2) + '/' + val.slice(2, 4)
    }
    setCardExpiry(val.slice(0, 5))
  }

  const handleCvvChange = (e) => {
    setIsAutoPlay(false)
    const val = e.target.value.replace(/\D/g, '').slice(0, 3)
    setCardCvv(val)
  }

  const handleNameChange = (e) => {
    setIsAutoPlay(false)
    setCardName(e.target.value.slice(0, 30))
  }

  const handleUpiChange = (e) => {
    setIsAutoPlay(false)
    setUpiId(e.target.value.slice(0, 40))
  }

  const handleBankSelect = (bankId) => {
    setIsAutoPlay(false)
    setSelectedBank(bankId)
  }

  const handleMethodChange = (methodId) => {
    setIsAutoPlay(false)
    setSelectedMethod(methodId)
  }

  const popularBanks = [
    { id: 'sbi', name: 'SBI', fullName: 'State Bank of India', code: 'sbin' },
    { id: 'hdfc', name: 'HDFC', fullName: 'HDFC Bank', code: 'hdfc' },
    { id: 'icici', name: 'ICICI', fullName: 'ICICI Bank', code: 'icic' },
    { id: 'axis', name: 'AXIS', fullName: 'Axis Bank', code: 'utib' },
  ]

  const isFormValid = useMemo(() => {
    if (selectedMethod === 'card') {
      return cardNo.replace(/\s/g, '').length === 16 && cardExpiry.length === 5 && cardCvv.length === 3 && cardName.trim().length > 0
    }
    if (selectedMethod === 'upi') {
      return upiId.includes('@') && upiId.split('@')[0].length > 1
    }
    if (selectedMethod === 'netbanking') {
      return selectedBank !== null
    }
    return false
  }, [selectedMethod, cardNo, cardExpiry, cardCvv, cardName, upiId, selectedBank])

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: -20 }}
      transition={{ type: 'spring', damping: 20, stiffness: 220 }}
      className="w-full max-w-[680px] h-auto md:h-[460px] rounded-2xl overflow-hidden shadow-2xl bg-white flex flex-col md:flex-row border border-neutral-200 dark:border-neutral-800"
    >
      {/* ── Left Sidebar (Razorpay Blue / Dark Theme) ── */}
      <div className="w-full md:w-[250px] bg-[#0c1a30] text-white p-6 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-neutral-800">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-full hover:bg-white/10 text-white/70 transition-colors md:hidden"
        >
          <X size={18} />
        </button>

        <div>
          <div className="flex items-center gap-2 mb-8 mt-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-emerald-400">
                <path d="M12 22V12M12 12C12 7.58172 15.5817 4 20 4V7C15.5817 7 12 10.5817 12 12ZM12 12C12 7.58172 8.41828 4 4 4V7C8.41828 7 12 10.5817 12 12Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide block">AgriPool</span>
              <span className="text-[10px] text-white/50 block leading-tight">Agri-equipment & Deliveries</span>
            </div>
          </div>

          <div className="space-y-1 mb-6">
            <span className="text-[10px] text-white/40 uppercase tracking-wider block font-semibold">Payment For</span>
            <p className="text-white/90 text-sm font-medium truncate max-w-[200px]">{description}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-white/40 uppercase tracking-wider block font-semibold">Amount</span>
            <p className="text-3xl font-extrabold text-white flex items-baseline">
              <span className="text-lg font-bold mr-0.5">₹</span>
              {amount.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="mt-8 md:mt-0 space-y-4">
          {/* Autoplay status card */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAutoPlay ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isAutoPlay ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </span>
              <span className="text-[11px] text-white/80 font-medium">
                {isAutoPlay ? 'Demo Autoplay' : 'Paused / Manual'}
              </span>
            </div>
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="p-1 rounded bg-white/10 hover:bg-white/20 text-white/80 transition-all"
              title={isAutoPlay ? 'Pause demo' : 'Resume demo'}
            >
              {isAutoPlay ? <Pause size={12} /> : <Play size={12} />}
            </button>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-white/40">
            <Shield size={12} className="text-emerald-400" />
            <span>Razorpay Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* ── Right Content Panel ── */}
      <div className="flex-1 bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 transition-colors hidden md:block"
        >
          <X size={18} />
        </button>

        {/* Header Tabs */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-4">Choose Payment Method</h3>
          <div className="flex border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleMethodChange(tab.id)}
                className={`flex-1 py-3 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                  selectedMethod === tab.id
                    ? 'text-blue-600 bg-blue-50/50 dark:bg-blue-950/20 dark:text-blue-400'
                    : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                } border-r last:border-r-0 border-neutral-200 dark:border-neutral-800`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form details based on active tab */}
          <div className="space-y-4 min-h-[160px]">
            {selectedMethod === 'card' && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <div className="relative">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Card Number</label>
                  <div className="mt-1 relative flex items-center">
                    <input
                      type="text"
                      value={formatCardNumber(cardNo)}
                      onChange={handleCardNoChange}
                      onFocus={() => setIsAutoPlay(false)}
                      placeholder="4111 2222 3333 4444"
                      className="w-full border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white rounded-xl pl-10 pr-4 py-2.5 font-mono text-sm tracking-wider outline-none focus:border-blue-500"
                    />
                    <CreditCard size={16} className="absolute left-3.5 text-neutral-400 dark:text-neutral-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      onFocus={() => setIsAutoPlay(false)}
                      placeholder="12/28"
                      className="w-full mt-1 border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={handleCvvChange}
                      onFocus={() => setIsAutoPlay(false)}
                      placeholder="123"
                      maxLength={3}
                      className="w-full mt-1 border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={handleNameChange}
                    onFocus={() => setIsAutoPlay(false)}
                    placeholder="Rao Shubham"
                    className="w-full mt-1 border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </motion.div>
            )}

            {selectedMethod === 'upi' && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Popular apps */}
                <div className="grid grid-cols-3 gap-2">
                  {['gpay', 'phonepe', 'paytm'].map((app) => (
                    <button
                      key={app}
                      onClick={() => {
                        setIsAutoPlay(false)
                        setUpiId(`farmer@ok${app === 'gpay' ? 'axis' : app === 'phonepe' ? 'ybl' : 'paytm'}`)
                      }}
                      className="py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all"
                    >
                      <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 capitalize">{app}</span>
                      <span className="text-[9px] text-neutral-400">Instant</span>
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">UPI ID / VPA</label>
                  <div className="mt-1 relative flex items-center">
                    <input
                      type="text"
                      value={upiId}
                      onChange={handleUpiChange}
                      onFocus={() => setIsAutoPlay(false)}
                      placeholder="username@upi"
                      className="w-full border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                    <Smartphone size={16} className="absolute left-3.5 text-neutral-400 dark:text-neutral-500" />
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-1.5 block">Press Pay to simulate transaction authorization.</span>
                </div>
              </motion.div>
            )}

            {selectedMethod === 'netbanking' && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Select Popular Banks</label>
                <div className="grid grid-cols-2 gap-2">
                  {popularBanks.map((bank) => (
                    <button
                      key={bank.id}
                      onClick={() => handleBankSelect(bank.id)}
                      className={`p-3 border rounded-xl flex items-center gap-2.5 transition-all text-left ${
                        selectedBank === bank.id
                          ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-semibold'
                          : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <Landmark size={16} className={selectedBank === bank.id ? 'text-blue-500' : 'text-neutral-400'} />
                      <div className="leading-tight">
                        <span className="text-xs block">{bank.name}</span>
                        <span className="text-[9px] text-neutral-400 block">{bank.fullName}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer pay button */}
        <div className="mt-6">
          <motion.button
            disabled={!isFormValid}
            onClick={onProceed}
            whileHover={isFormValid ? { scale: 1.01 } : {}}
            whileTap={isFormValid ? { scale: 0.99 } : {}}
            className={`w-full text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
              isFormValid
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200/50 dark:shadow-none'
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed shadow-none'
            }`}
          >
            <Lock size={14} />
            Pay ₹{amount.toLocaleString('en-IN')}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Step 2: Realistic Bank OTP Verification Page ─── */
function StepOTPVerification({ amount, otpVal, setOtpVal, isAutoPlay, setIsAutoPlay, onProceed, onCancel }) {
  const [timer, setTimer] = useState(120)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTimer = (t) => {
    const m = Math.floor(t / 60)
    const s = t % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const handleOtpChange = (index, value) => {
    setIsAutoPlay(false)
    const cleanVal = value.replace(/\D/g, '')
    if (!cleanVal) {
      const next = [...otpVal]
      next[index] = ''
      setOtpVal(next)
      return
    }
    const next = [...otpVal]
    next[index] = cleanVal.slice(-1)
    setOtpVal(next)

    if (index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpVal[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const isOtpComplete = useMemo(() => {
    return otpVal.every((digit) => digit !== '')
  }, [otpVal])

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: -20 }}
      transition={{ type: 'spring', damping: 20, stiffness: 220 }}
      className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
    >
      {/* Simulation OTP Prompt Banner */}
      <div className="bg-[#1e293b] text-neutral-200 px-4 py-3 text-[11px] font-mono border-b border-neutral-700/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span>💬 Simulated SMS Code:</span>
        </div>
        <span className="font-bold text-yellow-400 text-xs">489 201</span>
      </div>

      {/* 3D Bank Secure Header */}
      <div className="bg-[#121c2e] px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Shield className="text-blue-500" size={20} />
          <div>
            <h3 className="text-xs uppercase tracking-widest text-blue-400 font-extrabold leading-none">Secure Banking Gateway</h3>
            <span className="text-[10px] text-white/50 block mt-0.5">Verified by VISA / Mastercard ID Check</span>
          </div>
        </div>
        <span className="text-xs text-white/40 font-semibold font-mono">AgriPool Pay</span>
      </div>

      <div className="p-6 space-y-5 bg-white dark:bg-neutral-900">
        <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
          <p>An OTP (One Time Password) has been generated and sent to the mobile number registered with your bank.</p>
          <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-800/60 mt-3 grid grid-cols-2 gap-2 text-[11px] text-neutral-600 dark:text-neutral-400 font-mono">
            <div>Merchant: <span className="font-semibold text-neutral-800 dark:text-neutral-200">AgriPool</span></div>
            <div>Amount: <span className="font-semibold text-neutral-800 dark:text-neutral-200">₹{amount}</span></div>
            <div>Ref No: <span className="font-semibold text-neutral-800 dark:text-neutral-200">AP-{Math.floor(Math.random() * 900000 + 100000)}</span></div>
            <div>Card: <span className="font-semibold text-neutral-800 dark:text-neutral-200">XXXX XXXX XXXX 4444</span></div>
          </div>
        </div>

        {/* Six Single Digit OTP Fields */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block text-center">Enter 6-Digit OTP</label>
          <div className="flex justify-center gap-2">
            {otpVal.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-11 h-13 border-2 rounded-xl text-center text-lg font-bold outline-none border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:scale-105 transition-all font-mono"
              />
            ))}
          </div>
        </div>

        {/* Timer resend info */}
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-neutral-400">OTP expires in: <span className="font-mono text-neutral-700 dark:text-neutral-300 font-semibold">{formatTimer(timer)}</span></span>
          <button
            disabled={timer > 0}
            onClick={() => {
              setTimer(120)
              toast.success('New OTP sent!')
            }}
            className={`transition-colors ${timer > 0 ? 'text-neutral-300 cursor-not-allowed dark:text-neutral-700' : 'text-blue-500 hover:text-blue-600'}`}
          >
            Resend OTP
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onCancel}
            className="py-3 px-4 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold rounded-xl text-xs transition-all"
          >
            Cancel
          </button>
          <button
            disabled={!isOtpComplete}
            onClick={onProceed}
            className={`py-3 px-4 text-white font-bold rounded-xl text-xs transition-all shadow-md ${
              isOtpComplete
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200/50 dark:shadow-none'
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed shadow-none'
            }`}
          >
            Submit OTP
          </button>
        </div>

        {/* Footer badges */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 mt-2">
          <Lock size={10} />
          <span>256-Bit SSL Encrypted Connection</span>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Step 3: Processing Transaction ─── */
function StepProcessing() {
  const [text, setText] = useState('Initiating secure transaction...')

  useEffect(() => {
    const t1 = setTimeout(() => setText('Authorizing details with your bank...'), 800)
    const t2 = setTimeout(() => setText('Finishing booking authorization...'), 1600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 260 }}
      className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-8 flex flex-col items-center text-center"
    >
      <div className="relative w-24 h-24 mb-6">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#f3f4f6" strokeWidth="4" className="dark:stroke-neutral-800" />
          <motion.circle
            cx="50" cy="50" r="44" fill="none" stroke="#2563eb" strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray={276}
            animate={{ strokeDashoffset: [276, 30] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          />
        </svg>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Shield size={32} className="text-blue-600" />
        </motion.div>
      </div>

      <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100 mb-2">Processing Payment</h3>
      <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-6 px-4">Please do not refresh this page or press back as we authorize your payment details.</p>

      <div className="w-full bg-neutral-100 dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200/50 dark:border-neutral-800 flex items-center justify-center gap-2">
        <Loader2 size={14} className="text-blue-500 animate-spin" />
        <span className="text-[11px] font-mono text-neutral-600 dark:text-neutral-400 font-semibold">{text}</span>
      </div>
    </motion.div>
  )
}

/* ─── Step 4: Success Burst ─── */
function StepSuccess({ amount }) {
  const confettiCount = 36

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 18, stiffness: 200 }}
      className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-8 flex flex-col items-center text-center relative"
    >
      {/* Confetti Burst */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2">
        {Array.from({ length: confettiCount }).map((_, i) => (
          <ConfettiParticle key={i} index={i} />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center mb-5 border border-emerald-200 dark:border-emerald-900/60"
      >
        <CheckCircle size={44} className="text-emerald-500" strokeWidth={2.5} />
      </motion.div>

      <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white">Payment Successful</h3>
      <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mt-1">₹{amount.toLocaleString('en-IN')} Paid Securely</p>

      <div className="w-full border-t border-neutral-100 dark:border-neutral-800/80 my-5 pt-4 text-[10px] text-neutral-400 dark:text-neutral-500 font-mono space-y-1">
        <div>TXN REF: AP-{Math.floor(Math.random() * 89999 + 10000)}</div>
        <div>PAY ID: pay_demo_{Math.random().toString(36).substring(2, 10).toUpperCase()}</div>
      </div>

      <div className="flex items-center gap-2 text-xs text-blue-500 font-medium">
        <Loader2 size={12} className="animate-spin" />
        <span>Generating receipt & redirecting...</span>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   Main PaymentCheckout Component
   ═══════════════════════════════════════════════════════════ */
export default function PaymentCheckout() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [demoStep, setDemoStep] = useState(0)

  // Simulation Form states
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [cardNo, setCardNo] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [upiId, setUpiId] = useState('')
  const [selectedBank, setSelectedBank] = useState(null)
  const [otpVal, setOtpVal] = useState(['', '', '', '', '', ''])

  const amount = Number(searchParams.get('amount')) || 1200
  const bookingId = searchParams.get('booking') || null
  const description = searchParams.get('desc') || `Booking #${bookingId || 'new'}`

  // Coordinated Autoplay Sequence
  useEffect(() => {
    if (!demoLoading || !isAutoPlay) return

    let active = true
    let timeouts = []

    const delay = (ms) => new Promise((resolve) => {
      if (!active) return
      const t = setTimeout(resolve, ms)
      timeouts.push(t)
    })

    const runSimulation = async () => {
      if (demoStep === 1) {
        setSelectedMethod('card')
        setCardNo('')
        setCardExpiry('')
        setCardCvv('')
        setCardName('')

        const targetCard = '4111222233334444'
        const targetExpiry = '1228'
        const targetCvv = '123'
        const targetName = 'Rao Shubham'

        // Type Card Number
        for (let i = 0; i < targetCard.length; i++) {
          if (!active || !isAutoPlay) return
          await delay(80)
          setCardNo((prev) => prev + targetCard[i])
        }

        // Type Expiry
        for (let i = 0; i < targetExpiry.length; i++) {
          if (!active || !isAutoPlay) return
          await delay(100)
          setCardExpiry((prev) => {
            const next = prev + targetExpiry[i]
            if (next.length === 2) return next + '/'
            return next
          })
        }

        // Type CVV
        for (let i = 0; i < targetCvv.length; i++) {
          if (!active || !isAutoPlay) return
          await delay(120)
          setCardCvv((prev) => prev + targetCvv[i])
        }

        // Type Name
        for (let i = 0; i < targetName.length; i++) {
          if (!active || !isAutoPlay) return
          await delay(60)
          setCardName((prev) => prev + targetName[i])
        }

        await delay(800)
        if (!active || !isAutoPlay) return
        setDemoStep(2)
      } else if (demoStep === 2) {
        setOtpVal(['', '', '', '', '', ''])
        await delay(1000)
        if (!active || !isAutoPlay) return

        const targetOtp = '489201'
        for (let i = 0; i < targetOtp.length; i++) {
          if (!active || !isAutoPlay) return
          await delay(180)
          setOtpVal((prev) => {
            const next = [...prev]
            next[i] = targetOtp[i]
            return next
          })
        }

        await delay(800)
        if (!active || !isAutoPlay) return
        setDemoStep(3)
      } else if (demoStep === 3) {
        await delay(2400)
        if (!active || !isAutoPlay) return
        setDemoStep(4)
      }
    }

    runSimulation()

    return () => {
      active = false
      timeouts.forEach(clearTimeout)
    }
  }, [demoLoading, isAutoPlay, demoStep])

  // Triggers completing backend call when StepSuccess is finished
  useEffect(() => {
    if (demoStep === 4) {
      const t = setTimeout(async () => {
        try {
          const res = await paymentService.demoComplete({
            amount,
            booking_id: bookingId,
            description,
          })
          toast.success('Demo payment completed successfully!')
          saveLastPayment(res.payment)
          navigate('/payments/success', { state: { payment: res.payment } })
        } catch {
          toast.error('Demo checkout backend connection failed')
        } finally {
          setDemoLoading(false)
          setDemoStep(0)
        }
      }, 2600)
      return () => clearTimeout(t)
    }
  }, [demoStep, amount, bookingId, description, navigate])

  const goSuccess = (payment) => {
    saveLastPayment(payment)
    navigate('/payments/success', { state: { payment } })
  }

  const handleDemoPay = () => {
    // Reset simulation details
    setCardNo('')
    setCardExpiry('')
    setCardCvv('')
    setCardName('')
    setUpiId('')
    setSelectedBank(null)
    setOtpVal(['', '', '', '', '', ''])

    setIsAutoPlay(true)
    setDemoLoading(true)
    setDemoStep(1)
  }

  const handlePay = async () => {
    setLoading(true)
    try {
      await loadRazorpayScript()
      const order = await paymentService.createOrder({ amount, booking_id: bookingId })
      if (window.Razorpay && order?.key && !order.demo) {
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
            } catch {
              navigate('/payments/failed')
            }
          },
        }

        if (order.order_id) {
          options.order_id = order.order_id
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        handleDemoPay()
      }
    } catch {
      toast('Opening simulated premium gateway', { icon: '💳' })
      handleDemoPay()
    } finally {
      setLoading(false)
    }
  }

  const handleManualProceed = () => {
    setIsAutoPlay(false)
    if (demoStep === 1) {
      setDemoStep(2)
    } else if (demoStep === 2) {
      setDemoStep(3)
      // Wait and advance to success
      setTimeout(() => {
        setDemoStep(4)
      }, 2000)
    }
  }

  const handleManualCancel = () => {
    setDemoLoading(false)
    setDemoStep(0)
    setIsAutoPlay(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-4">
      {/* ── Multi-step Razorpay Simulation Overlay ── */}
      <AnimatePresence>
        {(loading || demoLoading) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4"
          >
            <AnimatePresence mode="wait">
              {demoStep === 1 && (
                <StepCheckoutModal
                  key="step-checkout"
                  amount={amount}
                  description={description}
                  isAutoPlay={isAutoPlay}
                  setIsAutoPlay={setIsAutoPlay}
                  selectedMethod={selectedMethod}
                  setSelectedMethod={setSelectedMethod}
                  cardNo={cardNo}
                  setCardNo={setCardNo}
                  cardExpiry={cardExpiry}
                  setCardExpiry={setCardExpiry}
                  cardCvv={cardCvv}
                  setCardCvv={setCardCvv}
                  cardName={cardName}
                  setCardName={setCardName}
                  upiId={upiId}
                  setUpiId={setUpiId}
                  selectedBank={selectedBank}
                  setSelectedBank={setSelectedBank}
                  onProceed={handleManualProceed}
                  onClose={handleManualCancel}
                />
              )}
              {demoStep === 2 && (
                <StepOTPVerification
                  key="step-otp"
                  amount={amount}
                  otpVal={otpVal}
                  setOtpVal={setOtpVal}
                  isAutoPlay={isAutoPlay}
                  setIsAutoPlay={setIsAutoPlay}
                  onProceed={handleManualProceed}
                  onCancel={handleManualCancel}
                />
              )}
              {demoStep === 3 && (
                <StepProcessing key="step-processing" />
              )}
              {demoStep === 4 && (
                <StepSuccess key="step-success" amount={amount} />
              )}
            </AnimatePresence>
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
