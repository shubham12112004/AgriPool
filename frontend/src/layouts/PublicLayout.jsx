import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useTheme } from '../hooks/useTheme'

export default function PublicLayout() {
  const { isDark } = useTheme()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-dark-bg text-neutral-50' : 'bg-white text-neutral-900'
      }`}
    >
      <Navbar />
      <main className={isHome ? '' : 'pt-16'}>
        <Outlet />
      </main>
    </div>
  )
}
