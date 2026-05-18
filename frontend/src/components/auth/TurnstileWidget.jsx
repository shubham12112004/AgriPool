import React, { useEffect, useRef, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

const SCRIPT_TIMEOUT = 8000

function isDevHost() {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1'
}

function loadTurnstileScript() {
  if (isDevHost()) return Promise.resolve(null)
  if (window.turnstile) return Promise.resolve(window.turnstile)

  const existing = document.querySelector('script[data-cf-turnstile]')
  if (existing) {
    return waitForTurnstile()
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.setAttribute('data-cf-turnstile', 'true')
    script.onload = () => waitForTurnstile().then(resolve).catch(reject)
    script.onerror = () => reject(new Error('Failed to load Turnstile'))
    document.head.appendChild(script)
  })
}

function waitForTurnstile() {
  return new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve(window.turnstile)
      return
    }
    let attempts = 0
    const maxAttempts = SCRIPT_TIMEOUT / 100
    const checkInterval = setInterval(() => {
      if (window.turnstile) {
        clearInterval(checkInterval)
        resolve(window.turnstile)
      } else if (attempts++ > maxAttempts) {
        clearInterval(checkInterval)
        reject(new Error('Turnstile API timeout'))
      }
    }, 100)
  })
}

export default function TurnstileWidget({ onVerify, onError }) {
  const { isDark } = useTheme()
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)
  const onVerifyRef = useRef(onVerify)
  const onErrorRef = useRef(onError)
  const [verified, setVerified] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'

  onVerifyRef.current = onVerify
  onErrorRef.current = onError

  const handleSuccess = (token) => {
    if (!token) return
    setVerified(true)
    setStatusMessage('Security check passed')
    onVerifyRef.current?.(token)
  }

  const handleExpired = () => {
    setVerified(false)
    setStatusMessage('')
    onVerifyRef.current?.(null)
  }

  const handleFailure = (message) => {
    setVerified(false)
    setStatusMessage('')
    onVerifyRef.current?.(null)
    onErrorRef.current?.(message)
  }

  useEffect(() => {
    if (isDevHost()) {
      const timer = setTimeout(() => {
        handleSuccess('dev-token-' + Date.now())
      }, 200)
      return () => clearTimeout(timer)
    }

    if (widgetIdRef.current != null) return

    let cancelled = false

    const init = async () => {
      try {
        await loadTurnstileScript()
        if (cancelled || !containerRef.current || !window.turnstile) return
        if (widgetIdRef.current != null) return

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: isDark ? 'dark' : 'light',
          retry: 'auto',
          callback: (token) => handleSuccess(token),
          'expired-callback': () => handleExpired(),
          'error-callback': () => handleFailure('Turnstile verification failed. Please try again.'),
        })
      } catch (err) {
        console.error('Turnstile render error:', err)
        if (!cancelled) {
          handleFailure('Could not load Cloudflare Turnstile')
        }
      }
    }

    init()

    return () => {
      cancelled = true
      if (widgetIdRef.current != null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null
      }
    }
    // Mount once — callbacks use refs so parent re-renders do not reset the widget
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey])

  if (isDevHost()) {
    return (
      <div className="min-h-[70px] flex flex-col justify-center">
        <div
          className="flex items-center justify-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-400"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />
          Dev mode — security check auto-verified
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70px] flex flex-col justify-center gap-2">
      <div
        ref={containerRef}
        className={`flex justify-center transition-opacity ${verified ? 'opacity-90' : ''}`}
        data-theme={isDark ? 'dark' : 'light'}
        aria-hidden={verified}
      />
      {verified && (
        <div
          className="flex items-center justify-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-700 dark:text-emerald-400"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
          {statusMessage || 'Verification successful'}
        </div>
      )}
      {!import.meta.env.VITE_TURNSTILE_SITE_KEY && !verified && (
        <p className="text-xs text-center text-neutral-500 dark:text-neutral-400">
          Using Cloudflare test key (always passes in development)
        </p>
      )}
    </div>
  )
}
