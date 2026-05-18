import React, { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock, User, Phone } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { Button, Input, Card, Alert } from '../components/ui'
import GoogleAuthButton from '../components/auth/GoogleAuthButton'
import TurnstileWidget from '../components/auth/TurnstileWidget'
import { authService } from '../services'
import { useAuthStore } from '../store/authStore'

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
    <>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">{t('auth.signup')}</h1>
        <p className="text-neutral-500 dark:text-neutral-400">Join the agricultural revolution</p>
      </div>

      <Card className="p-8 shadow-premium">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          <Input label="Full Name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" icon={User} required />
          <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" icon={Mail} required />
          <Input label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" icon={Phone} required />
          <Input label="Password" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" icon={Lock} hint="Minimum 8 characters" required />
          <Input label="Confirm Password" type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" icon={Lock} required />

          <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-sm text-primary-600 dark:text-primary-400 font-medium">
            {showPassword ? 'Hide' : 'Show'} password
          </button>

          <TurnstileWidget onVerify={handleTurnstileVerify} onError={handleTurnstileError} />

          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" required className="mt-1 rounded border-neutral-300" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              I agree to the Terms of Service and Privacy Policy
            </span>
          </label>

          <Button type="submit" variant="primary" size="lg" fullWidth className="mt-2" loading={loading} disabled={!turnstileVerified}>
            Create Account
          </Button>

          <p className="text-center text-sm text-neutral-500">Or continue with</p>
          <GoogleAuthButton />
        </form>

        <p className="text-center mt-6 text-neutral-600 dark:text-neutral-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600 dark:text-primary-400">
            Sign in
          </Link>
        </p>
      </Card>
    </>
  )
}
