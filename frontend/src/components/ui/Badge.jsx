import React from 'react'

const Badge = ({ children, variant = 'primary', size = 'md', className = '' }) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    neutral: 'bg-neutral-100 text-neutral-800 dark:bg-dark-card dark:text-neutral-300',
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-0.5 text-sm font-medium',
    lg: 'px-3 py-1 text-base font-medium',
  }
  
  const variantClass = variants[variant] || variants.primary
  const sizeClass = sizes[size] || sizes.md
  
  return (
    <span className={`inline-flex items-center rounded-full ${variantClass} ${sizeClass} ${className}`}>
      {children}
    </span>
  )
}

export default Badge
