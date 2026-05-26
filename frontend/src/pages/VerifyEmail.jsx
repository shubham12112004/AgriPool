import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, ShieldCheck, Send, ArrowRight } from 'lucide-react'
import { Card, Button, Spinner } from '../components/ui'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services'
import toast from 'react-hot-toast'

export default function VerifyEmail() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const { user, setAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const fromRegister = location.state?.fromRegister || false

  useEffect(() => {
    if (user?.email_verified) {
      toast.success('Your email is already verified!')
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleSendOtp = async () => {
    setSending(true)
    try {
      await authService.sendVerificationOtp()
      setSent(true)
      toast.success('Verification OTP code sent to your email!')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to send OTP email. Verify mail configurations.')
    } finally {
      setSending(false)
    }
  }

  const handleChange = (element, index) => {
    const val = element.value.replace(/[^0-9]/g, '')
    if (!val && element.value) return // Allow numerical values only

    const newOtp = [...otp]
    newOtp[index] = val
    setOtp(newOtp)

    // Focus next input if a value was entered
    if (val && element.nextSibling) {
      element.nextSibling.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    // Backspace logic to focus previous box
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus()
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    const otpCode = otp.join('')
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP code.')
      return
    }

    setLoading(true)
    try {
      const res = await authService.verifyEmailOtp(otpCode)
      if (res?.success && res?.user) {
        setAuth({ user: res.user, role: res.user.role })
        toast.success('Email address verified successfully!')
        navigate('/role-selection')
      } else {
        toast.error('Verification failed. Invalid OTP.')
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Verification failed. Incorrect OTP.')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    toast.success('Verification skipped. You can verify your email later in Settings.')
    if (fromRegister) {
      navigate('/role-selection')
    } else {
      if (window.history.length > 1) {
        navigate(-1)
      } else {
        navigate('/dashboard')
      }
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Card className="p-8 text-center shadow-xl border-neutral-200/60 dark:border-white/5 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl">
        <Mail className="mx-auto text-primary-500 mb-4" size={48} />
        <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-6 text-sm">
          {!sent 
            ? 'Verify your email address to unlock security, checkout capabilities, and full marketplace features.'
            : `We sent a 6-digit verification code to ${user?.email}. Enter it below.`
          }
        </p>

        {!sent ? (
          <div className="space-y-3">
            <Button 
              variant="primary" 
              fullWidth 
              className="gap-2 bg-linear-to-r from-agri-green to-agri-cyan text-white h-11"
              onClick={handleSendOtp}
              loading={sending}
            >
              <Send size={16} /> Send Verification Code
            </Button>
            
            <Button
              variant="outline"
              fullWidth
              className="h-11 border-neutral-300 dark:border-dark-border text-neutral-700 dark:text-neutral-300"
              onClick={handleSkip}
            >
              Skip Verification
            </Button>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex gap-2 justify-center">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-12 h-12 text-center rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-card text-xl font-bold font-mono focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-hidden"
                  required
                />
              ))}
            </div>
            
            <div className="space-y-3">
              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                loading={loading}
                className="bg-linear-to-r from-agri-green to-agri-cyan text-white font-bold h-11 shadow-[0_4px_20px_rgba(16,200,166,0.25)]"
              >
                Confirm & Verify
              </Button>

              <Button
                type="button"
                variant="outline"
                fullWidth
                className="h-11 border-neutral-300 dark:border-dark-border text-neutral-700 dark:text-neutral-300"
                onClick={handleSkip}
              >
                Skip Verification
              </Button>
              
              <button 
                type="button" 
                onClick={handleSendOtp} 
                disabled={sending} 
                className="text-xs font-semibold text-primary-600 hover:underline block mx-auto pt-2"
              >
                Resend verification email
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-dark-border">
          <Link to="/login" className="text-sm font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
            Back to sign in
          </Link>
        </div>
      </Card>
    </div>
  )
}
