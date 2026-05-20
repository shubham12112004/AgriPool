import React, { useState, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLanguage } from '../hooks/useLanguage'
import { Button, Input, Card, Alert } from '../components/ui'
import GoogleAuthButton from '../components/auth/GoogleAuthButton'
import TurnstileWidget from '../components/auth/TurnstileWidget'
import { authService } from '../services'
import { useAuthStore } from '../store/authStore'
import { getDashboardPathForRole } from '../store/authStore'
import { ROLES } from '../config/roles'
import { motion } from 'framer-motion'

export default function Login() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState(null)
  const [turnstileVerified, setTurnstileVerified] = useState(false)
  const [turnstileUnavailable, setTurnstileUnavailable] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const isDevHost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

  const handleTurnstileVerify = useCallback((token) => {
    setTurnstileToken(token)
    // 'widget-unavailable' means the widget failed but user can still proceed
    setTurnstileVerified(!!token)
    if (token === 'widget-unavailable') {
      setTurnstileUnavailable(true)
    }
  }, [])

  const handleTurnstileError = useCallback((msg) => {
    // Don't block the user — just clear the token, the form will still be submittable
    setTurnstileVerified(false)
    setTurnstileToken(null)
    // Don't set form error for turnstile failures — show it in the widget itself
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
  // 2. Turnstile is unavailable (widget failed to load, but user can proceed), OR
  // 3. Running on dev host
  const canSubmit = turnstileVerified || turnstileUnavailable || isDevHost

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')
    try {
      // Send whatever token we have — backend handles graceful degradation
      const tokenToSend = turnstileToken || (isDevHost ? 'dev-mode' : 'widget-unavailable')
      const res = await authService.login(formData.email, formData.password, tokenToSend)
      const token = res?.token
      const user = res?.user
      if (token) {
        localStorage.setItem('auth_token', token)
        if (rememberMe) {
          localStorage.setItem('agripool_remembered_email', formData.email)
        } else {
          localStorage.removeItem('agripool_remembered_email')
        }
      }
      setAuth({ user, token, role: user?.role })
      toast.success('Welcome back!')
      const to = location.state?.from?.pathname || getDashboardPathForRole(user?.role || ROLES.FARMER)
      navigate(to, { replace: true })
    } catch (err) {
      const msg =
        err?.errors?.email?.[0] ||
        err?.errors?.turnstile?.[0] ||
        err?.message ||
        'Login failed. Please check your credentials and try again.'
      setError(msg)
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
        <h1 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tight">{t('auth.signin')}</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">Welcome back to AgriPool</p>
        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          {['Secure access', 'Realtime chat', 'Role dashboards'].map((item) => (
            <span key={item} className="inline-flex items-center gap-1 rounded-full border border-neutral-200 dark:border-dark-border px-2 py-0.5 text-[10px] font-semibold text-neutral-600 dark:text-neutral-300 bg-white/70 dark:bg-dark-card/70 backdrop-blur-sm">
              <ShieldCheck size={10} className="text-agri-green" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <Card className="p-4 md:p-6 shadow-xl border-neutral-200/60 dark:border-white/5 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <Alert type="error" message={error} onClose={() => setError('')} />
            </motion.div>
          )}
          
          <div className="space-y-3">
            <Input
              label={t('auth.email')}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              icon={Mail}
              required
              className="bg-neutral-50 dark:bg-[#080c14]/50 focus:ring-agri-blue"
            />
            <div className="space-y-1">
              <div className="relative">
                <Input
                  label={t('auth.password')}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  icon={Lock}
                  required
                  className="bg-neutral-50 dark:bg-[#080c14]/50 focus:ring-agri-blue pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-10 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 text-xs"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="text-right pt-0.5">
                <Link to="/forgot-password" className="text-xs text-agri-blue hover:text-agri-cyan transition-colors font-semibold">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="rounded border-neutral-300 text-agri-blue focus:ring-agri-blue"
              />
              Remember me
            </label>
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
            loading={loading} 
            disabled={!canSubmit}
            className="bg-linear-to-r from-agri-blue to-agri-cyan border-0 shadow-[0_0_20px_rgba(43,95,191,0.3)] hover:shadow-[0_0_30px_rgba(24,194,255,0.4)] text-base h-10"
          >
            Sign In
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
        
        <p className="text-center mt-6 text-xs text-neutral-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-bold text-agri-blue hover:text-agri-cyan transition-colors">
            {t('auth.signup')}
          </Link>
        </p>
      </Card>
    </motion.div>
  )
}
