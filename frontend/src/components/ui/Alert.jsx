import React from 'react'
import { AlertCircle, CheckCircle, XCircle, Info, X } from 'lucide-react'

const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  onClose, 
  actions = [],
  className = '' 
}) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }
  
  const variants = {
    success: 'bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100',
    error: 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
    warning: 'bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100',
    info: 'bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
  }
  
  const Icon = icons[type]
  const variantClass = variants[type]
  
  return (
    <div className={`rounded-lg p-4 ${variantClass} ${className}`}>
      <div className="flex gap-3">
        <Icon size={20} className="flex-shrink-0 mt-0.5" />
        
        <div className="flex-1">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          {message && <p className="text-sm opacity-90">{message}</p>}
          
          {actions.length > 0 && (
            <div className="flex gap-2 mt-3">
              {actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.onClick}
                  className="text-sm font-medium underline hover:no-underline"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  )
}

export default Alert
