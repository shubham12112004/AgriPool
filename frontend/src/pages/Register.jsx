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

  const handleTurnstileVerify = useCallback((token) => {
    setTurnstileToken(token)
    setTurnstileVerified(!!token)
  }, [])

  const handleTurnstileError = useCallback((msg) => {
    setTurnstileVerified(false)
    setTurnstileToken(null)
    setError(msg)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

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

    if (!turnstileToken) {
      setError('Please complete the security check')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await authService.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        turnstile_token: turnstileToken,
      })
      const token = res?.token
      const user = res?.user
      if (token) localStorage.setItem('auth_token', token)
      setAuth({ user, token, role: user?.role })
      toast.success('Account created! Choose your role.')
      navigate('/role-selection')
    } catch (err) {
      const msg =
        err?.errors?.turnstile?.[0] ||
        err?.errors?.email?.[0] ||
        err?.message ||
        'Registration failed. Is Laravel running on port 8000?'
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
      <div className="text-center mb-8">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          className="w-16 h-16 bg-linear-to-br from-agri-green to-agri-cyan rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,200,166,0.3)]"
        >
          <User className="text-white w-8 h-8" />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">{t('auth.signup')}</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">Join the agricultural revolution</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {['Farmer', 'Driver', 'Owner', 'Buyer'].map((role) => (
            <span key={role} className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-dark-border px-3 py-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300 bg-white/70 dark:bg-dark-card/70 backdrop-blur-sm">
              <ShieldCheck size={12} className="text-agri-green" />
              {role}
            </span>
          ))}
        </div>
      </div>

      <Card className="p-6 md:p-8 shadow-xl border-neutral-200/60 dark:border-white/5 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <Alert type="error" message={error} onClose={() => setError('')} />
            </motion.div>
          )}

          <div className="space-y-3">
            <Input label="Full Name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" icon={User} required className="bg-neutral-50 dark:bg-[#080c14]/50 focus:ring-agri-green" />
            <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" icon={Mail} required className="bg-neutral-50 dark:bg-[#080c14]/50 focus:ring-agri-green" />
            <Input label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" icon={Phone} required className="bg-neutral-50 dark:bg-[#080c14]/50 focus:ring-agri-green" />
            <div className="relative">
              <Input label="Password" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" icon={Lock} hint="Minimum 8 characters" required className="bg-neutral-50 dark:bg-[#080c14]/50 focus:ring-agri-green pr-12" />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-10.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <Input label="Confirm Password" type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" icon={Lock} required className="bg-neutral-50 dark:bg-[#080c14]/50 focus:ring-agri-green" />
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-sm text-agri-green hover:text-agri-cyan font-semibold transition-colors">
              {showPassword ? 'Hide' : 'Show'} password
            </button>
          </div>

          <div className="pt-2">
            <TurnstileWidget onVerify={handleTurnstileVerify} onError={handleTurnstileError} />
          </div>

          <label className="flex items-start gap-3 cursor-pointer group mt-2">
            <input type="checkbox" required className="mt-1 rounded border-neutral-300 text-agri-green focus:ring-agri-green transition-colors" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors">
              I agree to the Terms of Service and Privacy Policy
            </span>
          </label>

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            fullWidth 
            className="mt-4 bg-linear-to-r from-agri-green to-agri-cyan border-0 shadow-[0_0_20px_rgba(16,200,166,0.3)] hover:shadow-[0_0_30px_rgba(16,200,166,0.5)] text-lg h-12"
            loading={loading} 
            disabled={!turnstileVerified}
          >
            Create Account
          </Button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200 dark:border-dark-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-xs font-semibold uppercase text-neutral-500 bg-white dark:bg-dark-card tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleAuthButton />
        </form>

        <div className="mt-6 rounded-2xl border border-neutral-200 dark:border-dark-border bg-linear-to-r from-agri-green/10 via-agri-cyan/10 to-agri-blue/10 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold mb-2">
            <Sparkles size={14} className="text-agri-green" />
            What you get
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-xs text-neutral-600 dark:text-neutral-300">
            <div>Private booking threads for farmers and drivers</div>
            <div>Route map, payments, and AI guidance in one place</div>
          </div>
        </div>

        <p className="text-center mt-8 text-neutral-600 dark:text-neutral-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-agri-green hover:text-agri-cyan transition-colors">
            Sign in
          </Link>
        </p>
      </Card>
    </motion.div>
  )
}
