import clsx from 'clsx'

export function cn(...inputs) {
  return clsx(inputs)
}

export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

const API_ORIGIN = (() => {
  const envUrl = import.meta.env.VITE_API_URL
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return window.location.origin
  }
  if (envUrl) {
    try {
      return new URL(envUrl).origin
    } catch {
      return window.location.origin
    }
  }
  return window.location.origin
})()

export function getAvatarUrl(avatar) {
  if (!avatar) return null
  
  let path = avatar
  if (avatar.startsWith('http')) {
    try {
      const url = new URL(avatar)
      path = url.pathname
    } catch {
      // Fallback if URL parsing fails
    }
  }
  
  const cleanPath = path.replace(/^\//, '')
  if (cleanPath.startsWith('storage/')) {
    return `${API_ORIGIN}/${cleanPath}`
  }
  return `${API_ORIGIN}/storage/${cleanPath}`
}

