import React from 'react'
import { Mic } from 'lucide-react'
import { useSpeechToText } from '../../hooks/useSpeechToText'

const Textarea = React.forwardRef(({
  label,
  error,
  hint,
  size = 'md',
  rows = 4,
  className = '',
  showMic,
  ...props
}, ref) => {
  const baseStyles = 'w-full rounded-md border transition-all duration-200 placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 dark:disabled:bg-dark-border disabled:cursor-not-allowed resize-none'
  
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

  const hasMic = showMic !== false && typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)

  const handleTranscript = (transcript) => {
    if (props.onChange) {
      const currentVal = props.value || ''
      const newVal = currentVal ? `${currentVal} ${transcript}` : transcript
      const event = {
        target: {
          name: props.name || '',
          value: newVal,
        },
      }
      props.onChange(event)
    }
  }

  const { isListening, toggleListening } = useSpeechToText(handleTranscript)
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          ref={ref}
          rows={rows}
          className={`${baseStyles} ${sizeClass} ${bgColor} ${borderColor} ${hasMic ? 'pr-10 pb-8' : ''} ${className}`}
          {...props}
        />
        {hasMic && (
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? 'Listening...' : 'Speak to input'}
            className={`absolute bottom-3 right-3 p-1.5 rounded-full transition-all ${
              isListening
                ? 'bg-rose-500 text-white shadow-md animate-pulse z-10'
                : 'text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-dark-border z-10'
            }`}
          >
            <Mic size={16} />
          </button>
        )}
      </div>
      
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{hint}</p>}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea

