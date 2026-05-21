import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ArrowRight,
  Bot,
  Camera,
  ImageIcon,
  MapPin,
  MessageCircle,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Truck,
  User,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react'
import PageHeader from '../components/shared/PageHeader'
import { Badge, Button, Card, Spinner, Textarea } from '../components/ui'
import { assistantService, bookingService, chatService } from '../services'
import { useAuthStore } from '../store/authStore'
import { getEcho, disconnectEcho } from '../lib/echo'
import { useLanguage } from '../hooks/useLanguage'

const SPEECH_LANGS = {
  en: 'en-IN',
  hi: 'hi-IN',
  pa: 'pa-IN',
  ta: 'ta-IN',
  te: 'te-IN',
}
const assistantStarterPrompts = [
  'How does AgriPool work?',
  'How do I create or accept a booking?',
  'Why is the map not loading fully?',
  'Explain the farmer and driver workflow',
]

function formatTime(value) {
  if (!value) return ''

  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function statusClass(status) {
  const map = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
    assigned: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200',
    in_transit: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200',
    completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
    cancelled: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200',
  }

  return map[status] || 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'
}

function MessageBubble({ message, isMine }) {
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
          isMine
            ? 'bg-primary-600 text-white rounded-br-md'
            : 'bg-white border border-neutral-200 text-neutral-900 dark:bg-dark-card dark:border-dark-border dark:text-neutral-50 rounded-bl-md'
        }`}
      >
        <div className="flex items-center justify-between gap-4 mb-1 text-xs opacity-80">
          <span className="font-medium">{message.user?.name || 'AgriPool'}</span>
          <span>{formatTime(message.created_at)}</span>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-6">{message.body}</p>
      </div>
    </div>
  )
}

function AssistantMessage({ message, currentLanguage }) {
  const isUser = message.role === 'user'
  const [isPlaying, setIsPlaying] = useState(false)

  const handleSpeak = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    window.speechSynthesis.cancel()

    const textToSpeak = `${message.body} ${message.hint ? `. ${message.hint}` : ''}`
    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    const voiceLang = SPEECH_LANGS[currentLanguage] || 'en-IN'
    utterance.lang = voiceLang

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const voices = window.speechSynthesis.getVoices()
      const matchingVoice = voices.find((v) => v.lang.startsWith(currentLanguage))
      if (matchingVoice) {
        utterance.voice = matchingVoice
      }
    }

    utterance.onend = () => {
      setIsPlaying(false)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
    }

    setIsPlaying(true)
    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    return () => {
      if (isPlaying) {
        window.speechSynthesis.cancel()
      }
    }
  }, [isPlaying])

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? 'bg-amber-500 text-white rounded-br-md'
            : 'bg-slate-950 text-white rounded-bl-md'
        }`}
      >
        <div className="flex items-center justify-between gap-4 mb-1">
          <div className="text-xs font-medium opacity-80">
            {isUser ? 'You' : 'AgriPool Assistant'}
          </div>
          {!isUser && (
            <button
              type="button"
              onClick={handleSpeak}
              title={isPlaying ? 'Stop voice' : 'Listen in your language'}
              className={`p-1 rounded-lg hover:bg-white/10 text-white transition-all ${
                isPlaying ? 'text-amber-400 bg-white/5 animate-pulse' : 'opacity-60 hover:opacity-100'
              }`}
            >
              {isPlaying ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          )}
        </div>
        <p className="whitespace-pre-wrap text-sm leading-6">{message.body}</p>
        {message.hint && <p className="mt-2 text-xs opacity-80">{message.hint}</p>}
      </div>
    </div>
  )
}

export default function Messages() {
  const { user, role } = useAuthStore()
  const [bookings, setBookings] = useState([])
  const [selectedBookingId, setSelectedBookingId] = useState(null)
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [loadingConversation, setLoadingConversation] = useState(false)
  const [sending, setSending] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [messageBody, setMessageBody] = useState('')
  const [error, setError] = useState('')

  const [assistantMessages, setAssistantMessages] = useState([
    {
      id: 'assistant-welcome',
      role: 'assistant',
      body: 'I am the AgriPool assistant. Ask me how bookings, chat, maps, and payments work for your role.',
      hint: 'This assistant is site-specific and focused on AgriPool workflows.',
    },
  ])
  const [assistantInput, setAssistantInput] = useState('')
  const [assistantLoading, setAssistantLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [attachedImage, setAttachedImage] = useState(null)
  const [attachedImageFile, setAttachedImageFile] = useState(null)

  const chatScrollRef = useRef(null)
  const assistantScrollRef = useRef(null)
  const recognitionRef = useRef(null)
  const cameraInputRef = useRef(null)

  const { language } = useLanguage()

  // ── Speech Recognition ────────────────────────────────────────────
  const toggleListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      toast.error('Speech recognition is not supported in this browser.')
      return
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = SPEECH_LANGS[language] || 'en-IN'
    recognition.interimResults = false
    recognition.continuous = false

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || ''
      if (transcript) {
        setAssistantInput((prev) => (prev ? `${prev} ${transcript}` : transcript))
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      if (event.error !== 'aborted') {
        toast.error(`Mic error: ${event.error}`)
      }
      setIsListening(false)
    }

    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [isListening, language])

  // ── Camera / Image Attachment ─────────────────────────────────────
  const handleImageSelected = useCallback((event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setAttachedImageFile(file)
    setAttachedImage(URL.createObjectURL(file))
    // reset input so same file can be re-selected
    event.target.value = ''
  }, [])

  const removeAttachedImage = useCallback(() => {
    if (attachedImage) URL.revokeObjectURL(attachedImage)
    setAttachedImage(null)
    setAttachedImageFile(null)
  }, [attachedImage])

  const currentBooking = useMemo(
    () => bookings.find((booking) => booking.id === selectedBookingId) || null,
    [bookings, selectedBookingId]
  )

  const assistantContext = useMemo(
    () => ({
      role,
      booking_id: currentBooking?.id || null,
    }),
    [currentBooking?.id, role]
  )

  useEffect(() => {
    let active = true

    async function loadBookings() {
      setLoadingBookings(true)

      try {
        const response = await bookingService.getBookings()
        const data = response?.data || []

        if (!active) return

        const rejected = JSON.parse(localStorage.getItem('agripool_rejected_bookings') || '[]')
        const filtered = data.filter((b) => !rejected.includes(b.id))

        setBookings(filtered)
        setSelectedBookingId((current) => current || filtered[0]?.id || null)
      } catch (requestError) {
        if (!active) return
        setError(requestError?.message || 'Unable to load booking threads.')
      } finally {
        if (active) setLoadingBookings(false)
      }
    }

    loadBookings()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!selectedBookingId) {
      setConversation(null)
      setMessages([])
      return undefined
    }

    let active = true

    async function loadConversation() {
      setLoadingConversation(true)
      setError('')

      try {
        const response = await chatService.getBookingConversation(selectedBookingId)
        const payload = response?.data || {}

        if (!active) return

        setConversation(payload.conversation || null)
        setMessages(payload.messages || [])
      } catch (requestError) {
        if (!active) return
        setConversation(null)
        setMessages([])
        setError(requestError?.message || 'Unable to open this booking thread.')
      } finally {
        if (active) setLoadingConversation(false)
      }
    }

    loadConversation()

    return () => {
      active = false
    }
  }, [selectedBookingId])

  // Background polling for booking list to capture status changes (e.g. driver accepts)
  useEffect(() => {
    let active = true

    const interval = setInterval(async () => {
      try {
        const response = await bookingService.getBookings()
        const data = response?.data || []

        if (!active) return

        const rejected = JSON.parse(localStorage.getItem('agripool_rejected_bookings') || '[]')
        const filtered = data.filter((b) => !rejected.includes(b.id))

        setBookings(filtered)
      } catch (e) {
        console.error('Bookings polling error:', e)
      }
    }, 4000)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  // Background polling for messages to support fallback live chat if Reverb/WebSockets are down
  useEffect(() => {
    if (!selectedBookingId) return undefined

    let active = true

    const interval = setInterval(async () => {
      try {
        const response = await chatService.getBookingConversation(selectedBookingId)
        const payload = response?.data || {}

        if (!active) return

        if (payload.messages) {
          setMessages((current) => {
            const currentIds = new Set(current.map(m => m.id))
            const newMessages = payload.messages.filter(m => !currentIds.has(m.id))
            if (newMessages.length > 0) {
              return [...current, ...newMessages]
            }
            return current
          })
        }
      } catch (e) {
        console.error('Messages polling error:', e)
      }
    }, 3000)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [selectedBookingId])

  useEffect(() => {
    if (!conversation?.id) return undefined

    const echo = getEcho()

    if (!echo) return undefined

    const channelName = `conversations.${conversation.id}`

    echo.private(channelName).listen('.message.sent', (event) => {
      const incoming = event?.message

      if (!incoming) return

      setMessages((current) => {
        if (current.some((item) => item.id === incoming.id)) {
          return current
        }

        return [...current, incoming]
      })
    })

    return () => {
      echo.leave(channelName)
    }
  }, [conversation?.id])

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, conversation?.id])

  useEffect(() => {
    assistantScrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [assistantMessages])

  useEffect(() => () => disconnectEcho(), [])

  async function handleSendMessage(event) {
    event.preventDefault()

    if (!conversation?.id || !messageBody.trim()) {
      return
    }

    const draft = messageBody.trim()
    setSending(true)
    setMessageBody('')
    setError('')

    try {
      const response = await chatService.sendConversationMessage(conversation.id, { body: draft })
      const payload = response?.data

      if (payload) {
        setMessages((current) => (current.some((item) => item.id === payload.id) ? current : [...current, payload]))
      }

      setConversation((current) =>
        current
          ? {
              ...current,
              last_message_at: payload?.created_at || current.last_message_at,
            }
          : current
      )
    } catch (requestError) {
      setMessageBody(draft)
      setError(requestError?.message || 'Message could not be sent.')
    } finally {
      setSending(false)
    }
  }

  async function handleAcceptBooking(bookingId) {
    setActionLoading(true)
    setError('')
    try {
      const response = await bookingService.acceptBooking(bookingId)
      const updatedBooking = response?.data
      if (updatedBooking) {
        setBookings((current) =>
          current.map((b) => (b.id === bookingId ? updatedBooking : b))
        )
        // Refresh conversation details
        const convResponse = await chatService.getBookingConversation(bookingId)
        const payload = convResponse?.data || {}
        setConversation(payload.conversation || null)
        setMessages(payload.messages || [])
        toast.success('Trip accepted successfully!')
      }
    } catch (requestError) {
      setError(requestError?.message || 'Failed to accept booking.')
      toast.error('Failed to accept trip.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleRejectBooking(bookingId) {
    setActionLoading(true)
    setError('')
    try {
      await bookingService.rejectBooking(bookingId)
      
      // Save to local storage so it persists across page reloads/polls
      const rejected = JSON.parse(localStorage.getItem('agripool_rejected_bookings') || '[]')
      if (!rejected.includes(bookingId)) {
        rejected.push(bookingId)
        localStorage.setItem('agripool_rejected_bookings', JSON.stringify(rejected))
      }

      setBookings((current) => {
        const remaining = current.filter((b) => b.id !== bookingId)
        if (selectedBookingId === bookingId) {
          setSelectedBookingId(remaining[0]?.id || null)
        }
        return remaining
      })

      toast.success('Trip rejected/released successfully!')
    } catch (requestError) {
      setError(requestError?.message || 'Failed to reject booking.')
      toast.error('Failed to reject trip.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleAssistantSend(value = assistantInput) {
    let prompt = (typeof value === 'string' ? value : assistantInput).trim()

    if (!prompt && !attachedImage) return

    // Prepend image tag when a photo is attached
    if (attachedImage) {
      prompt = `[Photo attached: crop/field image] ${prompt}`.trim()
    }

    setAssistantMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: 'user', body: prompt },
    ])
    setAssistantInput('')
    removeAttachedImage()
    setAssistantLoading(true)

    try {
      const response = await assistantService.chat(prompt, assistantContext)
      const payload = response?.data || {}

      setAssistantMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          body: payload.reply || 'I can help with AgriPool bookings, chat, map usage, and payments.',
          hint: payload.role_hint || 'AgriPool guidance',
        },
      ])
    } catch (requestError) {
      setAssistantMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: 'assistant',
          body: requestError?.message || 'I could not process that request right now.',
          hint: 'Try again or ask about bookings, chat, map, or payments.',
        },
      ])
    } finally {
      setAssistantLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        subtitle="Realtime farmer-driver chat plus a site-specific AgriPool assistant."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/bookings">
              <Button variant="outline" size="sm" icon={MessageCircle}>
                Bookings
              </Button>
            </Link>
            <Link to="/map">
              <Button variant="primary" size="sm" icon={MapPin}>
                Open map
              </Button>
            </Link>
          </div>
        }
      />

      {error && (
        <Card className="p-4 border-rose-200 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-900">
          <p className="text-sm text-rose-700 dark:text-rose-200">{error}</p>
        </Card>
      )}

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-neutral-200 dark:border-dark-border">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Truck size={16} />
              Booking threads
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Open a booking to continue the live conversation.
            </p>
          </div>

          <div className="max-h-[520px] overflow-auto p-2 space-y-2">
            {loadingBookings ? (
              <div className="flex items-center justify-center py-12 text-neutral-500 dark:text-neutral-400">
                <Spinner size="sm" />
              </div>
            ) : bookings.length ? (
              bookings.map((booking) => {
                const active = booking.id === selectedBookingId

                return (
                  <button
                    key={booking.id}
                    type="button"
                    onClick={() => setSelectedBookingId(booking.id)}
                    className={`w-full text-left rounded-2xl border p-3 transition-all duration-200 ${
                      active
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
                        : 'border-transparent hover:border-neutral-200 hover:bg-neutral-50 dark:hover:bg-dark-bg'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-sm line-clamp-1">{booking.title || 'Booking'}</div>
                        <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                          {booking.pickup_location} to {booking.dropoff_location}
                        </div>
                      </div>
                      <Badge className={statusClass(booking.status)}>{booking.status}</Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                      <span>{booking.type}</span>
                      <span>#{booking.id}</span>
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="px-4 py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
                No bookings are available yet. Create one to start a chat thread.
              </div>
            )}
          </div>
        </Card>

        <Card className="flex flex-col overflow-hidden min-h-[640px]">
          <div className="p-5 border-b border-neutral-200 dark:border-dark-border flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MessageCircle size={16} />
                Live conversation
              </div>
              <h3 className="text-xl font-bold mt-1">
                {currentBooking?.title || 'Select a booking to open chat'}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {currentBooking
                  ? `${currentBooking.pickup_location} to ${currentBooking.dropoff_location}`
                  : 'Chat follows the booking, so every update stays in context.'}
              </p>
            </div>

            {currentBooking ? (
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={statusClass(currentBooking.status)}>{currentBooking.status}</Badge>
                <Link to={`/bookings/${currentBooking.id}`}>
                  <Button variant="outline" size="sm" icon={ArrowRight}>
                    Open booking
                  </Button>
                </Link>
              </div>
            ) : null}
          </div>

          <div className="flex-1 overflow-auto p-5 space-y-4 bg-gradient-to-b from-neutral-50 to-white dark:from-dark-bg dark:to-dark-card">
            {loadingConversation ? (
              <div className="flex h-full items-center justify-center py-24 text-neutral-500 dark:text-neutral-400">
                <Spinner size="lg" />
              </div>
            ) : conversation ? (
              currentBooking?.status === 'pending' ? (
                role === 'driver' ? (
                  <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center p-6 bg-amber-50/50 dark:bg-amber-950/10 rounded-2xl border border-dashed border-amber-200 dark:border-amber-900/30">
                    <Truck size={48} className="text-amber-500 mb-4 animate-bounce" />
                    <h4 className="text-lg font-bold mb-2">New Booking Request</h4>
                    <p className="max-w-md text-sm text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
                      You have a pending booking request from <strong>{currentBooking.farmer_name || 'Farmer'}</strong>. Accept this request to claim the delivery and unlock live chat.
                    </p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="primary"
                        loading={actionLoading}
                        onClick={() => handleAcceptBooking(currentBooking.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all"
                      >
                        Accept Request
                      </Button>
                      <Button
                        variant="outline"
                        loading={actionLoading}
                        onClick={() => handleRejectBooking(currentBooking.id)}
                        className="border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 font-bold px-6 py-2.5 rounded-xl transition-all"
                      >
                        Reject Request
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-dark-bg/55 rounded-2xl border border-dashed border-neutral-200 dark:border-dark-border">
                    <Spinner size="lg" className="text-primary-500 mb-4" />
                    <h4 className="text-lg font-bold mb-2">Awaiting Driver Acceptance</h4>
                    <p className="max-w-md text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      Your booking request has been posted to drivers. Once a driver accepts your trip, the live chat channel will automatically open.
                    </p>
                  </div>
                )
              ) : (
                <>
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} isMine={message.user_id === user?.id} />
                  ))}
                  <div ref={chatScrollRef} />
                </>
              )
            ) : (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center text-neutral-500 dark:text-neutral-400">
                <Sparkles size={36} className="mb-3" />
                <p className="max-w-md text-sm leading-6">
                  Pick a booking to see the realtime farmer-driver thread. Messages are linked to the delivery so the
                  conversation stays with the work.
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="border-t border-neutral-200 dark:border-dark-border p-4">
            <div className="flex items-end gap-3">
              <Textarea
                value={messageBody}
                onChange={(event) => setMessageBody(event.target.value)}
                placeholder={
                  !conversation
                    ? 'Select a booking first'
                    : currentBooking?.status === 'pending'
                    ? role === 'driver'
                      ? 'Accept this request to unlock chat...'
                      : 'Waiting for driver to accept...'
                    : 'Write a message to the farmer or driver...'
                }
                rows={3}
                disabled={!conversation || sending || currentBooking?.status === 'pending'}
                className="resize-none"
              />
              <Button
                type="submit"
                loading={sending}
                disabled={!conversation || !messageBody.trim() || currentBooking?.status === 'pending'}
                icon={Send}
              >
                Send
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="inline-flex items-center gap-1">
                <User size={12} />
                Signed in as {user?.name || 'AgriPool user'}
              </span>
              {conversation?.last_message_at && <span>Last update {formatTime(conversation.last_message_at)}</span>}
            </div>
          </form>
        </Card>

        <Card className="flex flex-col overflow-hidden">
          <div className="p-5 border-b border-neutral-200 dark:border-dark-border">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Bot size={16} />
              AgriPool assistant
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Site-specific help for bookings, map usage, payments, and role-based guidance.
            </p>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3 bg-slate-50 dark:bg-dark-bg">
            {assistantMessages.map((message) => (
              <AssistantMessage key={message.id} message={message} currentLanguage={language} />
            ))}
            {assistantLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={assistantScrollRef} />
          </div>

          <div className="border-t border-neutral-200 dark:border-dark-border p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {assistantStarterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleAssistantSend(prompt)}
                  className="rounded-full border border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-card px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:border-primary-400 hover:text-primary-600 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Hidden camera file input */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleImageSelected}
            />

            <form
              onSubmit={(event) => {
                event.preventDefault()
                handleAssistantSend()
              }}
              className="space-y-2"
            >
              {/* Image preview */}
              {attachedImage && (
                <div className="relative inline-block">
                  <img
                    src={attachedImage}
                    alt="Attached preview"
                    className="h-20 w-20 rounded-xl object-cover border-2 border-primary-300 dark:border-primary-700 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={removeAttachedImage}
                    className="absolute -top-2 -right-2 rounded-full bg-rose-500 text-white p-0.5 shadow-md hover:bg-rose-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Textarea */}
              <Textarea
                rows={3}
                value={assistantInput}
                onChange={(event) => setAssistantInput(event.target.value)}
                placeholder="Ask about AgriPool..."
                className="resize-none"
              />

              {/* Bottom toolbar: Mic · Camera · Send */}
              <div className="flex items-center gap-2">
                {/* Mic button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  title={isListening ? 'Stop recording' : 'Start voice input'}
                  className={`relative rounded-xl p-2.5 transition-all duration-200 ${
                    isListening
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-dark-card dark:text-neutral-300 dark:hover:bg-dark-border'
                  }`}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                  {isListening && (
                    <span className="absolute inset-0 rounded-xl animate-ping bg-rose-400 opacity-40" />
                  )}
                </button>

                {/* Camera button */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  title="Attach a photo"
                  className={`rounded-xl p-2.5 transition-all duration-200 ${
                    attachedImage
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-dark-card dark:text-neutral-300 dark:hover:bg-dark-border'
                  }`}
                >
                  {attachedImage ? <ImageIcon size={18} /> : <Camera size={18} />}
                </button>

                <div className="flex-1" />

                {/* Send button */}
                <Button
                  type="submit"
                  loading={assistantLoading}
                  disabled={!assistantInput.trim() && !attachedImage}
                  icon={Send}
                >
                  Ask
                </Button>
              </div>
            </form>

            <div className="flex flex-wrap gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 text-amber-700 dark:text-amber-200">
                <Sparkles size={12} />
                Consultancy mode
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 dark:bg-sky-950/40 px-3 py-1.5 text-sky-700 dark:text-sky-200">
                <Bot size={12} />
                AgriPool only
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
