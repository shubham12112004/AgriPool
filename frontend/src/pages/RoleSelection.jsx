import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ONBOARDING_PATHS } from '../config/roles'
import { useAuthStore } from '../store/authStore'
import { motion } from 'framer-motion'
import { useLanguage } from '../hooks/useLanguage'
import { useTheme } from '../hooks/useTheme'
import { Button, Card } from '../components/ui'
import { Tractor, Truck, ShoppingBag, Users, ArrowRight, Check } from 'lucide-react'

export default function RoleSelection() {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const setRole = useAuthStore((s) => s.setRole)
  const [selectedRole, setSelectedRole] = useState(null)

  const roles = [
    {
      id: 'farmer',
      title: 'Farmer',
      description: 'Rent equipment, get transportation, and sell directly',
      icon: Tractor,
      color: 'from-emerald-500 to-emerald-600',
      benefits: [
        'Access affordable equipment rental',
        'Connect with reliable drivers',
        'Sell crops directly to buyers',
        'Track earnings and bookings',
      ],
    },
    {
      id: 'driver',
      title: 'Driver',
      description: 'Find consistent work and build reputation',
      icon: Truck,
      color: 'from-blue-500 to-blue-600',
      benefits: [
        'Get consistent booking requests',
        'Build your reputation',
        'Easy payment system',
        'Track your earnings',
      ],
    },
    {
      id: 'equipment_owner',
      title: 'Equipment Owner',
      description: 'Monetize your equipment and reach farmers',
      icon: Users,
      color: 'from-amber-500 to-amber-600',
      benefits: [
        'Monetize your equipment',
        'Reach more farmers',
        'Manage availability easily',
        'Track equipment usage',
      ],
    },
    {
      id: 'buyer',
      title: 'Buyer',
      description: 'Buy fresh products directly from farmers',
      icon: ShoppingBag,
      color: 'from-purple-500 to-purple-600',
      benefits: [
        'Get fresh agricultural products',
        'Direct from farm prices',
        'Quality assurance',
        'Easy ordering',
      ],
    },
  ]

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

  return (
    <div className="py-8 md:py-12">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className={`text-5xl font-bold mb-4 ${
            isDark ? 'text-neutral-50' : 'text-neutral-900'
          }`}>
            Choose Your Role
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            Select the role that best describes you to get started
          </p>
        </motion.div>

        {/* Role Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          variants={containerVariants}
        >
          {roles.map((role) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.id

            return (
              <motion.div
                key={role.id}
                variants={itemVariants}
                onClick={() => setSelectedRole(role.id)}
                className="cursor-pointer"
              >
                <Card
                  hoverable
                  className={`p-6 h-full transition-all ${
                    isSelected
                      ? isDark
                        ? 'ring-2 ring-primary-500 bg-dark-card'
                        : 'ring-2 ring-primary-500 bg-white'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${role.color} bg-gradient-to-br`}>
                      <Icon size={28} />
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white"
                      >
                        <Check size={18} />
                      </motion.div>
                    )}
                  </div>

                  <h2 className={`text-2xl font-bold mb-2 ${
                    isDark ? 'text-neutral-50' : 'text-neutral-900'
                  }`}>
                    {role.title}
                  </h2>

                  <p className={`mb-4 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {role.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {role.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check size={18} className={`${role.color} text-transparent bg-gradient-to-br bg-clip-text flex-shrink-0 mt-0.5`} />
                        <span className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-700'}`}>
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className={`pt-4 border-t ${isDark ? 'border-dark-border' : 'border-neutral-200'}`}>
                    <p className={`text-sm font-medium ${
                      isSelected
                        ? 'text-primary-600 dark:text-primary-400'
                        : isDark
                        ? 'text-neutral-400'
                        : 'text-neutral-600'
                    }`}>
                      {isSelected ? 'Selected' : 'Select this role'}
                    </p>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between gap-4 flex-col sm:flex-row"
        >
          <Link to="/register" className="w-full sm:w-auto">
            <Button variant="ghost" size="lg" fullWidth>
              Back to Registration
            </Button>
          </Link>

          <Button
            variant="primary"
            size="lg"
            disabled={!selectedRole}
            className="gap-2 w-full sm:w-auto"
            onClick={() => {
              setRole(selectedRole)
              const path = ONBOARDING_PATHS[selectedRole]
              if (path) navigate(path)
            }}
          >
            Continue to Onboarding <ArrowRight size={20} />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
