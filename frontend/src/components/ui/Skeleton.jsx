import React from 'react'

const Skeleton = ({ height = 4, width = 'full', count = 1, className = '' }) => {
  const heightClass = `h-${height}`
  const widthClass = `w-${width}`
  
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${heightClass} w-full bg-neutral-200 dark:bg-dark-border rounded-md animate-pulse`}
        />
      ))}
    </div>
  )
}

export default Skeleton
