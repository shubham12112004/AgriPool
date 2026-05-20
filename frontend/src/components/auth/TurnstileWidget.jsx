import React, { useEffect, useRef, useState, useCallback } from 'react'
import { CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

const SCRIPT_TIMEOUT = 10000
const VERIFY_TIMEOUT = 20000
const TURNSTILE_INITIALIZED_ATTR = 'data-turnstile-initialized'

function isDevHost() {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1'
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

export default function TurnstileWidget({ onVerify, onError, onUnavailable }) {
  const { isDark } = useTheme()
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)
  const themeRef = useRef(isDark)
  const onVerifyRef = useRef(onVerify)
  const onErrorRef = useRef(onError)
  const onUnavailableRef = useRef(onUnavailable)
  const [verified, setVerified] = useState(false)
  const [failed, setFailed] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const verifyTimeoutRef = useRef(null)

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'

  onVerifyRef.current = onVerify
  onErrorRef.current = onError
  onUnavailableRef.current = onUnavailable

  useEffect(() => {
    themeRef.current = isDark
  }, [isDark])

  const handleSuccess = useCallback((token) => {
    if (!token) return
    if (verifyTimeoutRef.current) {
      clearTimeout(verifyTimeoutRef.current)
      verifyTimeoutRef.current = null
    }
    setVerified(true)
    setFailed(false)
    setUnavailable(false)
    setStatusMessage('Security check passed')
    onVerifyRef.current?.(token)
  }, [])

  const handleExpired = useCallback(() => {
    setVerified(false)
    setStatusMessage('')
    onVerifyRef.current?.(null)
  }, [])

  const handleFailure = useCallback((message) => {
    if (verifyTimeoutRef.current) {
      clearTimeout(verifyTimeoutRef.current)
      verifyTimeoutRef.current = null
    }
    setVerified(false)
    setFailed(true)
    setStatusMessage(message || 'Verification failed')
    onVerifyRef.current?.(null)
    onErrorRef.current?.(message)
  }, [])

  const markUnavailable = useCallback(() => {
    setUnavailable(true)
    setFailed(false)
    setVerified(false)
    setStatusMessage('Security check unavailable — you can still proceed')
    onUnavailableRef.current?.()
    // Signal parent that turnstile is unavailable so forms can still submit
    onVerifyRef.current?.('widget-unavailable')
  }, [])

  const resetWidget = useCallback(() => {
    setFailed(false)
    setVerified(false)
    setUnavailable(false)
    setStatusMessage('')

    if (widgetIdRef.current != null && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current)
      } catch {
        // If reset fails, remove and re-render
        if (containerRef.current) {
          try {
            window.turnstile.remove(widgetIdRef.current)
          } catch { /* ignore */ }
          widgetIdRef.current = null
          containerRef.current.removeAttribute(TURNSTILE_INITIALIZED_ATTR)
          renderWidget()
        }
      }
    } else {
      // Re-attempt initialization
      if (containerRef.current) {
        containerRef.current.removeAttribute(TURNSTILE_INITIALIZED_ATTR)
        widgetIdRef.current = null
      }
      renderWidget()
    }
  }, [])

  const renderWidget = useCallback(async () => {
    try {
      await waitForTurnstile()
      if (!containerRef.current || !window.turnstile) {
        markUnavailable()
        return
      }
      if (widgetIdRef.current != null || containerRef.current.getAttribute(TURNSTILE_INITIALIZED_ATTR) === 'true') {
        return
      }

      containerRef.current.setAttribute(TURNSTILE_INITIALIZED_ATTR, 'true')

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: themeRef.current ? 'dark' : 'light',
        retry: 'auto',
        'retry-interval': 3000,
        callback: (token) => handleSuccess(token),
        'expired-callback': () => handleExpired(),
        'error-callback': (errorCode) => {
          console.warn('Turnstile error code:', errorCode)
          // Error codes 110xxx are typically domain/sitekey configuration issues
          if (typeof errorCode === 'string' && errorCode.startsWith('110')) {
            handleFailure('Security check failed — site key may not be configured for this domain.')
          } else {
            handleFailure('Security verification failed. Click retry or proceed without it.')
          }
        },
      })

      // Set a timeout — if not verified within VERIFY_TIMEOUT, offer bypass
      verifyTimeoutRef.current = setTimeout(() => {
        if (!verified) {
          markUnavailable()
        }
      }, VERIFY_TIMEOUT)
    } catch (err) {
      console.error('Turnstile render error:', err)
      markUnavailable()
    }
  }, [siteKey, handleSuccess, handleExpired, handleFailure, markUnavailable, verified])

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
      if (cancelled) return
      await renderWidget()
    }

    init()

    return () => {
      cancelled = true
      if (verifyTimeoutRef.current) {
        clearTimeout(verifyTimeoutRef.current)
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

  // Turnstile unavailable — allow user to proceed
  if (unavailable) {
    return (
      <div className="min-h-[70px] flex flex-col justify-center gap-2">
        <div
          className="flex items-center justify-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-700 dark:text-amber-400"
          role="status"
          aria-live="polite"
        >
          <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />
          {statusMessage || 'Security check unavailable'}
        </div>
        <button
          type="button"
          onClick={resetWidget}
          className="flex items-center justify-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      </div>
    )
  }

  // Turnstile failed — show retry button
  if (failed) {
    return (
      <div className="min-h-[70px] flex flex-col justify-center gap-2">
        <div
          className="flex items-center justify-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-700 dark:text-red-400"
          role="alert"
        >
          <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />
          {statusMessage || 'Verification failed'}
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={resetWidget}
            className="flex items-center justify-center gap-1.5 text-xs font-semibold text-agri-blue hover:text-agri-cyan transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry verification
          </button>
          <span className="text-neutral-300 dark:text-neutral-600">|</span>
          <button
            type="button"
            onClick={markUnavailable}
            className="text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          >
            Skip & proceed
          </button>
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
