import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLanguage } from '../hooks/useLanguage'
import { useTheme } from '../hooks/useTheme'
import { Button, Input, Card, Alert, AgriPoolLogo } from '../components/ui'
import { authService } from '../services'

export default function ForgotPassword() {
  const { isDark } = useTheme()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setError('Please enter your email address')
      return
    }
    setLoading(true)
    setError('')
    try {
      await authService.forgotPassword(email)
      toast.success('Reset link sent to your email!')
      setIsSubmitted(true)
    } catch (err) {
      const msg = err?.message || 'Failed to send reset link. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${
      isDark ? 'bg-dark-bg' : 'bg-neutral-50'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 font-bold text-2xl mb-6 transition-transform hover:scale-105 ${
              isDark ? 'text-primary-400' : 'text-primary-600'
            }`}
          >
            <AgriPoolLogo className="w-8 h-8" iconSizeMultiplier={0.8} />
            AgriPool
          </Link>

          <h1 className={`text-3xl font-bold mb-2 ${
            isDark ? 'text-neutral-50' : 'text-neutral-900'
          }`}>
            Reset Password
          </h1>
          <p className={`${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            We'll help you get back into your account
          </p>
        </div>

        <Card className="p-8">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert type="error" message={error} onClose={() => setError('')} />
              )}

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                icon={Mail}
                required
              />

              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Enter the email address associated with your AgriPool account, and we'll send you a link to reset your password.
              </p>

              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} disabled={loading || !email}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <Link to="/login" className="flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium">
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <CheckCircle size={32} />
                </div>
              </div>

              <div>
                <h2 className={`text-2xl font-bold mb-2 ${
                  isDark ? 'text-neutral-50' : 'text-neutral-900'
                }`}>
                  Check Your Email
                </h2>
                <p className={`${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  We've sent a password reset link to <span className="font-semibold">{email}</span>
                </p>
              </div>

              <div className={`p-4 rounded-lg ${
                isDark
                  ? 'bg-blue-900/20 border border-blue-800'
                  : 'bg-blue-50 border border-blue-200'
              }`}>
                <p className={`text-sm ${
                  isDark ? 'text-blue-400' : 'text-blue-700'
                }`}>
                  Don't see the email? Check your spam folder or wait a few minutes.
                </p>
              </div>

              <Link to="/login" className="block">
                <Button variant="primary" size="lg" fullWidth>
                  Back to Login
                </Button>
              </Link>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
