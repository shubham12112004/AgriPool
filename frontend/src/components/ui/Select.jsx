import React from 'react'
import { ChevronDown } from 'lucide-react'

const Select = React.forwardRef(({
  label,
  error,
  hint,
  options = [],
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'w-full appearance-none rounded-md border transition-all duration-200 placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 dark:disabled:bg-dark-border disabled:cursor-not-allowed pr-10'
  
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
        <select
          ref={ref}
          className={`${baseStyles} ${sizeClass} ${bgColor} ${borderColor} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <ChevronDown 
          size={18} 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none"
        />
      </div>
      
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{hint}</p>}
    </div>
  )
})

Select.displayName = 'Select'

export default Select
