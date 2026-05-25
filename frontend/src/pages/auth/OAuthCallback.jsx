import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Spinner } from '../../components/ui'
import apiClient from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import { getDashboardPathForRole } from '../../store/authStore'

const ERROR_MESSAGES = {
  access_denied: 'Google sign-in was cancelled or access was denied. Please try again.',
  invalid_scope: 'Google sign-in failed due to invalid permissions. Please contact support.',
  server_error: 'Google encountered a server error. Please try again later.',
  temporarily_unavailable: 'Google sign-in is temporarily unavailable. Please try again later.',
}

function getReadableError(errorParam) {
  if (!errorParam) return null
  const decoded = decodeURIComponent(errorParam)
  // Check for known error codes
  const lowerError = decoded.toLowerCase()
  for (const [key, message] of Object.entries(ERROR_MESSAGES)) {
    if (lowerError.includes(key)) return message
  }
  return decoded
}

export default function OAuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [message, setMessage] = useState('Completing Google sign-in…')

  useEffect(() => {
    const error = searchParams.get('error')
    const code = searchParams.get('code')

    if (error) {
      const readableError = getReadableError(error)
      setMessage(readableError)
      toast.error(readableError)
      const t = setTimeout(() => navigate('/login', { replace: true }), 3000)
      return () => clearTimeout(t)
    }

    if (!code) {
      setMessage('Missing authorization code. Redirecting to login…')
      const t = setTimeout(() => navigate('/login', { replace: true }), 2500)
      return () => clearTimeout(t)
    }

    const exchange = async () => {
      try {
        const res = await apiClient.post('/auth/oauth/exchange', { code })
        const token = res?.token
        const user = res?.user
        if (token) sessionStorage.setItem('auth_token', token)
        setAuth({ user, token, role: user?.role })
        toast.success('Signed in with Google')
        navigate(getDashboardPathForRole(user?.role || 'farmer'), { replace: true })
      } catch (err) {
        const msg =
          (typeof err?.message === 'string' && err.message) ||
          err?.errors?.code?.[0] ||
          'Google sign-in failed. Please try again.'
        setMessage(msg)
        toast.error(msg)
        setTimeout(() => navigate('/login', { replace: true }), 4000)
      }
    }

    exchange()
  }, [searchParams, navigate, setAuth])

  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 px-4">
      <Spinner size="lg" />
      <p className="text-center text-neutral-600 dark:text-neutral-300 max-w-sm">{message}</p>
    </div>
  )
}
