import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function ProtectedRoute({ children }) {
  const { token, user } = useAuthStore()
  const location = useLocation()
  const hasAuth = Boolean(token || user || sessionStorage.getItem('auth_token'))

  if (!hasAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
