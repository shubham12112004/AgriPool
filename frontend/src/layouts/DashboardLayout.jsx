import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { useLanguage } from '../hooks/useLanguage'
import Sidebar from '../components/layout/Sidebar'
import DashboardHeader from '../components/layout/DashboardHeader'

const PAGE_TITLES = {
  '/dashboard/farmer': { title: 'nav.dashboard', subtitle: '' },
  '/dashboard/driver': { title: 'nav.dashboard', subtitle: '' },
  '/dashboard/equipment-owner': { title: 'nav.dashboard', subtitle: '' },
  '/dashboard/buyer': { title: 'nav.dashboard', subtitle: '' },
  '/dashboard/admin': { title: 'nav.dashboard', subtitle: '' },
  '/bookings': { title: 'nav.bookings', subtitle: 'dashboard.bookings.subtitle' },
  '/messages': { title: 'nav.messages', subtitle: 'dashboard.messages.subtitle' },
  '/map': { title: 'nav.map', subtitle: 'dashboard.map.subtitle' },
  '/settings': { title: 'nav.settings', subtitle: 'dashboard.settings.subtitle' },
  '/payments/history': { title: 'nav.payments', subtitle: 'dashboard.payments.subtitle' },
  '/marketplace': { title: 'nav.marketplace', subtitle: 'dashboard.marketplace.subtitle' },
}

export default function DashboardLayout() {
  const { isDark } = useTheme()
  const { t } = useLanguage()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const meta = Object.entries(PAGE_TITLES).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] || { title: 'app.name', subtitle: '' }

  const translatedTitle = t(meta.title)
  const translatedSubtitle = meta.subtitle ? t(meta.subtitle) : ''

  return (
    <div className={`relative h-screen flex overflow-hidden ${isDark ? 'bg-dark-bg text-neutral-50' : 'bg-neutral-50 text-neutral-900'}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_35%),radial-gradient(circle_at_top_right,rgba(16,200,166,0.08),transparent_30%)]" />
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onCollapseChange={setSidebarCollapsed}
      />
      <div className={`relative flex-1 flex flex-col min-w-0 transition-all duration-300`}>
        <DashboardHeader
          title={translatedTitle}
          subtitle={translatedSubtitle}
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

