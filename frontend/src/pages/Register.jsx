import React, { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock, User, Phone, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { Button, Input, Card, Alert } from '../components/ui'
import GoogleAuthButton from '../components/auth/GoogleAuthButton'
import TurnstileWidget from '../components/auth/TurnstileWidget'
import { authService } from '../services'
import { useAuthStore } from '../store/authStore'
import { motion } from 'framer-motion'

export default function Register() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState(null)
  const [turnstileVerified, setTurnstileVerified] = useState(false)
  const [turnstileUnavailable, setTurnstileUnavailable] = useState(false)
  const isDevHost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

  const handleTurnstileVerify = useCallback((token) => {
    setTurnstileToken(token)
    setTurnstileVerified(!!token)
    if (token === 'widget-unavailable') {
      setTurnstileUnavailable(true)
    }
  }, [])

  const handleTurnstileError = useCallback((msg) => {
    // Don't block the user — just clear the token
    setTurnstileVerified(false)
    setTurnstileToken(null)
    console.warn('Turnstile error:', msg)
  }, [])

  const handleTurnstileUnavailable = useCallback(() => {
    setTurnstileUnavailable(true)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Allow form submission if:
  // 1. Turnstile is verified (normal flow), OR
  // 2. Turnstile is unavailable (widget failed to load), OR
  // 3. Running on dev host
  const canSubmit = turnstileVerified || turnstileUnavailable || isDevHost

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    setError('')
    try {
      // Send whatever token we have — backend handles graceful degradation
      const tokenToSend = turnstileToken || (isDevHost ? 'dev-mode' : 'widget-unavailable')
      const res = await authService.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        turnstile_token: tokenToSend,
      })
      const token = res?.token
      const user = res?.user
      if (token) sessionStorage.setItem('auth_token', token)
      setAuth({ user, token, role: user?.role })
      toast.success('Account created! Choose your role.')
      navigate('/role-selection')
    } catch (err) {
      const msg =
        err?.errors?.turnstile?.[0] ||
        err?.errors?.email?.[0] ||
        err?.message ||
        'Registration failed. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tight">{t('auth.signup')}</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">Join the agricultural revolution</p>
        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          {['Farmer', 'Driver', 'Owner', 'Buyer'].map((role) => (
            <span key={role} className="inline-flex items-center gap-1 rounded-full border border-neutral-200 dark:border-dark-border px-2 py-0.5 text-[10px] font-semibold text-neutral-600 dark:text-neutral-300 bg-white/70 dark:bg-dark-card/70 backdrop-blur-sm">
              <ShieldCheck size={10} className="text-agri-green" />
              {role}
            </span>
          ))}
        </div>
      </div>

      <Card className="p-4 md:p-6 shadow-xl border-neutral-200/60 dark:border-white/5 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <Alert type="error" message={error} onClose={() => setError('')} />
            </motion.div>
          )}

          <div className="space-y-2">
            <Input label="Full Name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" icon={User} required className="bg-neutral-50 dark:bg-[#080c14]/50 focus:ring-agri-green" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" icon={Mail} required className="bg-neutral-50 dark:bg-[#080c14]/50 focus:ring-agri-green" />
              <Input label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" icon={Phone} required className="bg-neutral-50 dark:bg-[#080c14]/50 focus:ring-agri-green" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
              <div className="relative">
                <Input label="Password" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" icon={Lock} hint="Min 8 chars" required className="bg-neutral-50 dark:bg-[#080c14]/50 focus:ring-agri-green pr-10" />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-2 top-9 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 text-xs"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <Input label="Confirm Password" type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" icon={Lock} required className="bg-neutral-50 dark:bg-[#080c14]/50 focus:ring-agri-green" />
            </div>
          </div>

          <div className="pt-1">
            <TurnstileWidget 
              onVerify={handleTurnstileVerify} 
              onError={handleTurnstileError}
              onUnavailable={handleTurnstileUnavailable}
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            size="md" 
            fullWidth 
            className="mt-2 bg-linear-to-r from-agri-green to-agri-cyan border-0 shadow-[0_0_20px_rgba(16,200,166,0.3)] hover:shadow-[0_0_30px_rgba(16,200,166,0.5)] text-base h-10"
            loading={loading} 
            disabled={!canSubmit}
          >
            Create Account
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200 dark:border-dark-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-[10px] font-semibold uppercase text-neutral-500 bg-white dark:bg-dark-card tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleAuthButton />
        </form>

        <div className="mt-4 text-center space-y-1 text-xs">
          <p className="text-neutral-500">
            Forgot password?{' '}
            <Link to="/forgot-password" className="font-bold text-agri-green hover:text-agri-cyan transition-colors">
              Reset here
            </Link>
          </p>
          <p className="text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-agri-green hover:text-agri-cyan transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
