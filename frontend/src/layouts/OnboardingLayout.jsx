import React from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { useTheme } from '../hooks/useTheme'

export default function OnboardingLayout() {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-neutral-50'}`}>
      <Navbar />
      <main className="pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-container max-w-3xl"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
