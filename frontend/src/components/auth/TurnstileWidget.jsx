import React, { useEffect, useRef, useState, useCallback } from 'react'
import { CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

const SCRIPT_TIMEOUT = 5000
const VERIFY_TIMEOUT = 3000
const TURNSTILE_INITIALIZED_ATTR = 'data-turnstile-initialized'

function isDevHost() {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1'
}

function MockTurnstile({ onVerify, isDark }) {
  const [status, setStatus] = useState('idle') // 'idle' | 'spinning' | 'verified'

  const handleVerify = () => {
    if (status !== 'idle') return
    setStatus('spinning')
    setTimeout(() => {
      setStatus('verified')
      onVerify('dev-token-mock-' + Date.now())
    }, 1200)
  }

  return (
    <div className={`mx-auto w-full max-w-[300px] h-[65px] rounded border flex items-center justify-between px-3 shadow-xs transition-all duration-300 ${
      isDark 
        ? 'bg-[#1c1c1c] border-[#333333] text-white' 
        : 'bg-[#fcfcfc] border-[#e0e0e0] text-neutral-800'
    }`}>
      <div className="flex items-center">
        {status === 'idle' && (
          <button
            type="button"
            onClick={handleVerify}
            className={`w-[26px] h-[26px] rounded-[4px] border transition-all duration-200 flex items-center justify-center hover:scale-[1.03] active:scale-[0.97] hover:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] ${
              isDark 
                ? 'border-[#444444] bg-[#121212] hover:border-[#666666]' 
                : 'border-neutral-300 bg-white hover:border-neutral-400'
            }`}
            aria-label="Verify you are human"
          />
        )}
        
        {status === 'spinning' && (
          <div className="w-[26px] h-[26px] flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 text-neutral-400 dark:text-neutral-500" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="3" r="2.2" className="opacity-100" />
              <circle cx="18.36" cy="5.64" r="2.2" className="opacity-[0.875]" />
              <circle cx="21" cy="12" r="2.2" className="opacity-[0.75]" />
              <circle cx="18.36" cy="18.36" r="2.2" className="opacity-[0.625]" />
              <circle cx="12" cy="21" r="2.2" className="opacity-[0.5]" />
              <circle cx="5.64" cy="18.36" r="2.2" className="opacity-[0.375]" />
              <circle cx="3" cy="12" r="2.2" className="opacity-[0.25]" />
              <circle cx="5.64" cy="5.64" r="2.2" className="opacity-[0.125]" />
            </svg>
          </div>
        )}

        {status === 'verified' && (
          <div className="w-[26px] h-[26px] flex items-center justify-center text-emerald-500 animate-scale-up">
            <div className="w-[26px] h-[26px] rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xs">
              <svg className="h-4.5 w-4.5 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" strokeWidth="3" />
              </svg>
            </div>
          </div>
        )}

        <span className={`ml-3.5 text-[13px] font-normal transition-colors select-none ${
          status === 'verified'
            ? 'text-neutral-800 dark:text-neutral-200 font-medium'
            : isDark ? 'text-neutral-300' : 'text-[#444444]'
        }`}>
          {status === 'idle' && 'Verify you are human'}
          {status === 'spinning' && 'Verifying...'}
          {status === 'verified' && 'Success!'}
        </span>
      </div>

      <div className="flex flex-col items-end justify-center select-none text-right shrink-0">
        <div className="flex items-center gap-1.5">
          <svg className="h-4 w-4 text-[#f38020]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.35 10.04A7.49 7.49 0 0012 4c-3.48 0-6.4 2.38-7.18 5.6A5.485 5.485 0 000 15c0 3.04 2.46 5.5 5.5 5.5h13c2.48 0 4.5-2.02 4.5-4.5 0-2.33-1.78-4.24-4.05-4.46z" />
          </svg>
          <span className="text-[9px] font-bold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
            cloudflare
          </span>
        </div>
        <div className="text-[8px] text-neutral-400 dark:text-neutral-500 mt-0.5">
          <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="hover:underline">Privacy</a>
          <span className="mx-1">•</span>
          <a href="https://www.cloudflare.com/website-terms/" target="_blank" rel="noopener noreferrer" className="hover:underline">Help</a>
        </div>
      </div>
    </div>
  )
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
    if (!token.startsWith('dev-token-mock-')) {
      setUnavailable(false)
    }
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
    setFailed(false)
    setUnavailable(true)
    setStatusMessage('')
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
        'retry-interval': 1500,
        appearance: 'interaction-only',
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
      return
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
        <MockTurnstile onVerify={handleSuccess} isDark={isDark} />
      </div>
    )
  }

  // Turnstile unavailable — allow user to proceed
  if (unavailable) {
    return (
      <div className="min-h-[70px] flex flex-col justify-center">
        <MockTurnstile onVerify={handleSuccess} isDark={isDark} />
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
            onClick={() => setUnavailable(true)}
            className="text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          >
            Use Mock Checkbox
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
