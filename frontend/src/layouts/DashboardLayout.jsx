import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import Sidebar from '../components/layout/Sidebar'
import DashboardHeader from '../components/layout/DashboardHeader'

const PAGE_TITLES = {
  '/dashboard/farmer': { title: 'Farmer Dashboard', subtitle: 'Overview of your farm operations' },
  '/dashboard/driver': { title: 'Driver Dashboard', subtitle: 'Manage trips and earnings' },
  '/dashboard/equipment-owner': { title: 'Equipment Dashboard', subtitle: 'Manage rentals and inventory' },
  '/dashboard/buyer': { title: 'Buyer Dashboard', subtitle: 'Browse and order fresh produce' },
  '/dashboard/admin': { title: 'Admin Panel', subtitle: 'Platform management' },
  '/bookings': { title: 'Bookings', subtitle: 'Track all your bookings' },
  '/map': { title: 'Map', subtitle: 'Nearby services and routes' },
  '/settings': { title: 'Settings', subtitle: 'Account and preferences' },
  '/payments/history': { title: 'Payments', subtitle: 'Transaction history' },
  '/marketplace': { title: 'Marketplace', subtitle: 'Fresh produce from local farms' },
}

export default function DashboardLayout() {
  const { isDark } = useTheme()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const meta = Object.entries(PAGE_TITLES).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] || { title: 'AgriPool', subtitle: '' }

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-dark-bg text-neutral-50' : 'bg-neutral-50 text-neutral-900'}`}>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onCollapseChange={setSidebarCollapsed}
      />
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300`}>
        <DashboardHeader
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
