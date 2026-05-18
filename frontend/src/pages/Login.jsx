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
    <>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">{t('auth.signin')}</h1>
        <p className="text-neutral-500 dark:text-neutral-400">Welcome back to AgriPool</p>
      </div>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          <Input
            label={t('auth.email')}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            icon={Mail}
            required
          />
          <Input
            label={t('auth.password')}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            icon={Lock}
            required
          />
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-primary-600 dark:text-primary-400 font-medium">
              {t('auth.forgotPassword')}
            </Link>
          </div>
          <TurnstileWidget onVerify={handleTurnstileVerify} onError={handleTurnstileError} />
          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} disabled={!turnstileVerified && !isDevHost}>
            Sign In
          </Button>
          <div className="relative py-2">
            <span className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-neutral-200 dark:border-dark-border" />
            </span>
            <span className="relative flex justify-center text-xs uppercase text-neutral-500 bg-white dark:bg-dark-card px-2">
              Or
            </span>
          </div>
          <GoogleAuthButton />
        </form>
        <p className="text-center mt-6 text-sm text-neutral-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-primary-600 dark:text-primary-400">
            {t('auth.signup')}
          </Link>
        </p>
      </Card>
    </>
  )
}
