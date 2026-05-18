import React, { useState, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
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
  const isDevHost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

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
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }
    if (!turnstileToken && !isDevHost) {
      setError('Please complete the security check')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await authService.login(formData.email, formData.password, turnstileToken || 'dev-mode')
      const token = res?.token
      const user = res?.user
      if (token) localStorage.setItem('auth_token', token)
      setAuth({ user, token, role: user?.role })
      toast.success('Welcome back!')
      const to = location.state?.from?.pathname || getDashboardPathForRole(user?.role || ROLES.FARMER)
      navigate(to, { replace: true })
    } catch (err) {
      const msg =
        err?.errors?.email?.[0] ||
        err?.errors?.turnstile?.[0] ||
        err?.message ||
        'Login failed. Start Laravel: php artisan serve'
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
      <div className="text-center mb-8">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          className="w-16 h-16 bg-gradient-to-br from-agri-blue to-agri-cyan rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(43,95,191,0.3)]"
        >
          <Lock className="text-white w-8 h-8" />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">{t('auth.signin')}</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">Welcome back to AgriPool</p>
      </div>

      <Card className="p-6 md:p-8 shadow-xl border-neutral-200/60 dark:border-white/5 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <Alert type="error" message={error} onClose={() => setError('')} />
            </motion.div>
          )}
          
          <div className="space-y-5">
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
              <Input
                label={t('auth.password')}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                icon={Lock}
                required
                className="bg-neutral-50 dark:bg-[#080c14]/50 focus:ring-agri-blue"
              />
              <div className="text-right pt-1">
                <Link to="/forgot-password" className="text-sm text-agri-blue hover:text-agri-cyan transition-colors font-semibold">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <TurnstileWidget onVerify={handleTurnstileVerify} onError={handleTurnstileError} />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            fullWidth 
            loading={loading} 
            disabled={!turnstileVerified && !isDevHost}
            className="bg-gradient-to-r from-agri-blue to-agri-cyan border-0 shadow-[0_0_20px_rgba(43,95,191,0.3)] hover:shadow-[0_0_30px_rgba(24,194,255,0.4)] text-lg h-12"
          >
            Sign In
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
        
        <p className="text-center mt-8 text-neutral-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-bold text-agri-blue hover:text-agri-cyan transition-colors">
            {t('auth.signup')}
          </Link>
        </p>
      </Card>
    </motion.div>
  )
}
