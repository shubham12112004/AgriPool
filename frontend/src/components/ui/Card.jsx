import React from 'react'
import { motion } from 'framer-motion'

const Card = React.forwardRef(({
  children,
  variant = 'default',
  className = '',
  hoverable = false,
  ...props
}, ref) => {
  const variants = {
    default: 'bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl shadow-md',
    glass: 'bg-white/70 dark:bg-dark-card/80 backdrop-blur-xl border border-neutral-200/60 dark:border-white/10 rounded-2xl shadow-lg',
    outline: 'bg-transparent border-2 border-neutral-200 dark:border-dark-border rounded-2xl',
    elevated: 'bg-white dark:bg-dark-card rounded-2xl shadow-xl',
  }
  
  const variantClass = variants[variant] || variants.default
  const hoverClass = hoverable ? 'hover:shadow-lg dark:hover:shadow-lg transition-all duration-200 hover:-translate-y-1' : ''
  
  return (
    <motion.div
      ref={ref}
      className={`${variantClass} ${hoverClass} ${className}`}
      whileHover={hoverable ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  )
})

Card.displayName = 'Card'

export default Card
