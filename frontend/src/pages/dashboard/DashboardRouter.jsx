import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore, getDashboardPathForRole } from '../../store/authStore'
import { ROLES } from '../../config/roles'

export default function DashboardRouter() {
  const role = useAuthStore((s) => s.role) || ROLES.FARMER
  return <Navigate to={getDashboardPathForRole(role)} replace />
}
