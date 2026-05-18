import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { useLanguage } from '../hooks/useLanguage'
import { Card, Button, Tabs, Badge } from '../components/ui'
import { 
  BarChart3, TrendingUp, DollarSign, BookOpen, 
  MapPin, Clock, Star, Settings, LogOut, Bell, User 
} from 'lucide-react'

export default function Dashboard() {
  const { isDark } = useTheme()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState(0)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  // Sample dashboard data
  const stats = [
    { label: 'Total Earnings', value: '₹24,500', icon: DollarSign, trend: '+12%' },
    { label: 'Active Bookings', value: '8', icon: BookOpen, trend: '+2' },
    { label: 'Rating', value: '4.8', icon: Star, trend: '⭐' },
    { label: 'Completed Jobs', value: '145', icon: TrendingUp, trend: '+5' },
  ]

  const recentBookings = [
    { id: 1, type: 'Equipment Rental', date: 'Today, 2:30 PM', status: 'Completed', amount: '₹1,200' },
    { id: 2, type: 'Transportation', date: 'Yesterday, 10:00 AM', status: 'Completed', amount: '₹850' },
    { id: 3, type: 'Equipment Rental', date: '2 days ago', status: 'Cancelled', amount: '₹500' },
  ]

  const tabs = [
    {
      label: 'Overview',
      content: (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <motion.div key={idx} variants={itemVariants}>
                  <Card className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`p-2 rounded-lg ${
                        isDark
                          ? 'bg-primary-900/30 text-primary-400'
                          : 'bg-primary-100 text-primary-600'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <Badge variant="success" size="sm">{stat.trend}</Badge>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {stat.label}
                    </p>
                    <p className={`text-2xl font-bold mt-1 ${
                      isDark ? 'text-neutral-50' : 'text-neutral-900'
                    }`}>
                      {stat.value}
                    </p>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Chart Placeholder */}
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isDark ? 'text-neutral-50' : 'text-neutral-900'
              }`}>
                <BarChart3 size={20} />
                Earnings Over Time
              </h3>
              <div className={`h-64 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-dark-border' : 'bg-neutral-100'
              }`}>
                <span className={isDark ? 'text-neutral-500' : 'text-neutral-400'}>
                  Chart will be displayed here
                </span>
              </div>
            </Card>
          </motion.div>

          {/* Recent Bookings */}
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-neutral-50' : 'text-neutral-900'
              }`}>
                Recent Bookings
              </h3>
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={`p-4 rounded-lg flex items-center justify-between ${
                      isDark ? 'bg-dark-border' : 'bg-neutral-50'
                    }`}
                  >
                    <div>
                      <p className={`font-semibold ${
                        isDark ? 'text-neutral-50' : 'text-neutral-900'
                      }`}>
                        {booking.type}
                      </p>
                      <p className={`text-sm ${
                        isDark ? 'text-neutral-400' : 'text-neutral-600'
                      }`}>
                        {booking.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={booking.status === 'Completed' ? 'success' : booking.status === 'Cancelled' ? 'error' : 'primary'}
                        size="sm"
                      >
                        {booking.status}
                      </Badge>
                      <p className={`text-sm font-semibold mt-1 ${
                        isDark ? 'text-neutral-50' : 'text-neutral-900'
                      }`}>
                        {booking.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      ),
    },
    {
      label: 'My Services',
      content: (
        <Card className="p-6">
          <p className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>
            Your services will appear here. Start by adding your first service!
          </p>
          <Button variant="primary" className="mt-4">Add Service</Button>
        </Card>
      ),
    },
    {
      label: 'Messages',
      content: (
        <Card className="p-6">
          <p className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>
            No messages yet. Check back soon!
          </p>
        </Card>
      ),
    },
  ]

  return (
    <div className={`min-h-screen py-8 px-4 ${isDark ? 'bg-dark-bg' : 'bg-neutral-50'}`}>
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${
              isDark ? 'text-neutral-50' : 'text-neutral-900'
            }`}>
              Dashboard
            </h1>
            <p className={`mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Welcome back! Here's your activity overview.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-lg ${
                isDark
                  ? 'bg-dark-card hover:bg-dark-card/80'
                  : 'bg-white hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              <Bell size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-lg ${
                isDark
                  ? 'bg-dark-card hover:bg-dark-card/80'
                  : 'bg-white hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              <User size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs
            tabs={tabs}
            defaultTab={0}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
