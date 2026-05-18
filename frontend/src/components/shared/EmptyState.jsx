import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui'
import { useTheme } from '../../hooks/useTheme'

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  const { isDark } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl border border-dashed ${
        isDark ? 'border-dark-border bg-dark-card/50' : 'border-neutral-200 bg-white'
      }`}
    >
      {Icon && (
        <motion.div
          className={`p-4 rounded-2xl mb-4 ${
            isDark ? 'bg-primary-500/10 text-primary-400' : 'bg-primary-50 text-primary-600'
          }`}
        >
          <Icon size={40} />
        </motion.div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className={`text-sm max-w-sm mb-6 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}
