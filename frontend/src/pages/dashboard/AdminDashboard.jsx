import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Shield, Tractor, BarChart3, AlertTriangle } from 'lucide-react'
import StatCard from '../../components/shared/StatCard'
import PageHeader from '../../components/shared/PageHeader'
import { Card } from '../../components/ui'

const LINKS = [
  { path: '/admin/users', label: 'User management', icon: Users, desc: 'View and manage all users' },
  { path: '/admin/verification', label: 'Driver verification', icon: Shield, desc: 'Review pending documents' },
  { path: '/admin/moderation', label: 'Equipment moderation', icon: Tractor, desc: 'Approve listings' },
  { path: '/admin/analytics', label: 'Platform analytics', icon: BarChart3, desc: 'Revenue and growth metrics' },
]

export default function AdminDashboard() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <PageHeader title="Admin control center" subtitle="Platform oversight and moderation" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total users" value="52,400" icon={Users} trend="+240" />
        <StatCard label="Pending verification" value="18" icon={Shield} trendVariant="warning" trend="Action" />
        <StatCard label="GMV (month)" value="₹2.4M" icon={BarChart3} trend="+22%" />
        <StatCard label="Flagged items" value="4" icon={AlertTriangle} trendVariant="error" trend="Review" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LINKS.map(({ path, label, icon: Icon, desc }) => (
          <Link key={path} to={path}>
            <Card hoverable className="p-5 h-full">
              <Icon className="text-primary-600 dark:text-primary-400 mb-3" size={28} />
              <h3 className="font-semibold">{label}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}
