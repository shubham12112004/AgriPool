import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTheme } from '../hooks/useTheme'
import { Button, Input, Card, Alert, AgriPoolLogo } from '../components/ui'
import { authService } from '../services'

export default function ResetPassword() {
  const { isDark } = useTheme()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!password) {
      setError('Please enter a new password')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (!token) {
      setError('Invalid or expired reset token')
      return
    }

    setLoading(true)
    setError('')
    try {
      await authService.resetPassword(token, password)
      toast.success('Password reset successful!')
      setIsSubmitted(true)
    } catch (err) {
      const msg = err?.message || 'Failed to reset password. Please try again.'
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
        className="w-full max-w-md mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 font-bold text-2xl mb-4 transition-transform hover:scale-105 ${
              isDark ? 'text-primary-400' : 'text-primary-600'
            }`}
          >
            <AgriPoolLogo className="w-8 h-8" iconSizeMultiplier={0.8} />
            AgriPool
          </Link>

          <h1 className={`text-2xl md:text-3xl font-extrabold mb-1 tracking-tight ${
            isDark ? 'text-neutral-50' : 'text-neutral-900'
          }`}>
            Set New Password
          </h1>
          <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Please enter your new secure password
          </p>
        </div>

        <Card className="p-4 md:p-6 shadow-xl border-neutral-200/60 dark:border-white/5 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert type="error" message={error} onClose={() => setError('')} />
              )}

              <div className="relative">
                <Input
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={Lock}
                  required
                  hint="Min 8 chars"
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

              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                icon={Lock}
                required
              />

              <Button type="submit" variant="primary" size="md" fullWidth loading={loading} disabled={loading || !password}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>

              <Link to="/login" className="flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium pt-2">
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 py-4"
            >
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <CheckCircle size={24} />
                </div>
              </div>

              <div>
                <h2 className={`text-xl font-bold mb-1 ${
                  isDark ? 'text-neutral-50' : 'text-neutral-900'
                }`}>
                  Success!
                </h2>
                <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Your password has been successfully reset. You can now log in with your new password.
                </p>
              </div>

              <Link to="/login" className="block pt-2">
                <Button variant="primary" size="md" fullWidth>
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
