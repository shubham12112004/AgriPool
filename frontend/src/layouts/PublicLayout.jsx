import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useTheme } from '../hooks/useTheme'

export default function PublicLayout() {
  const { isDark } = useTheme()

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-dark-bg text-neutral-50' : 'bg-white text-neutral-900'
      }`}
    >
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}
