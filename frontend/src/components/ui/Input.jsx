import React from 'react'

const Input = React.forwardRef(({
  label,
  error,
  hint,
  icon: Icon = null,
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'w-full rounded-md border transition-all duration-200 placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 dark:disabled:bg-dark-border disabled:cursor-not-allowed'
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-4 py-3 text-lg',
  }
  
  const borderColor = error 
    ? 'border-red-500 dark:border-red-500' 
    : 'border-neutral-300 dark:border-dark-border'
  
  const bgColor = 'bg-white dark:bg-dark-card text-neutral-900 dark:text-neutral-50'
  
  const sizeClass = sizes[size] || sizes.md
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          className={`${baseStyles} ${sizeClass} ${bgColor} ${borderColor} ${Icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
      </div>
      
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{hint}</p>}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
