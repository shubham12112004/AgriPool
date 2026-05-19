import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bot,
  MapPin,
  MessageCircle,
  Send,
  Sparkles,
  Truck,
  User,
} from 'lucide-react'
import PageHeader from '../components/shared/PageHeader'
import { Badge, Button, Card, Spinner, Textarea } from '../components/ui'
import { assistantService, bookingService, chatService } from '../services'
import { useAuthStore } from '../store/authStore'
import { getEcho, disconnectEcho } from '../lib/echo'
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

function AssistantMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? 'bg-amber-500 text-white rounded-br-md'
            : 'bg-slate-950 text-white rounded-bl-md'
        }`}
      >
        <div className="text-xs font-medium mb-1 opacity-80">
          {isUser ? 'You' : 'AgriPool Assistant'}
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

  const chatScrollRef = useRef(null)
  const assistantScrollRef = useRef(null)

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

        setBookings(data)
        setSelectedBookingId((current) => current || data[0]?.id || null)
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

  async function handleAssistantSend(value = assistantInput) {
    const prompt = value.trim()

    if (!prompt) return

    setAssistantMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: 'user', body: prompt },
    ])
    setAssistantInput('')
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
              <>
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} isMine={message.user_id === user?.id} />
                ))}
                <div ref={chatScrollRef} />
              </>
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
                placeholder={conversation ? 'Write a message to the farmer or driver...' : 'Select a booking first'}
                rows={3}
                disabled={!conversation || sending}
                className="resize-none"
              />
              <Button type="submit" loading={sending} disabled={!conversation || !messageBody.trim()} icon={Send}>
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
              <AssistantMessage key={message.id} message={message} />
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

            <form
              onSubmit={(event) => {
                event.preventDefault()
                handleAssistantSend()
              }}
              className="flex items-end gap-3"
            >
              <Textarea
                rows={3}
                value={assistantInput}
                onChange={(event) => setAssistantInput(event.target.value)}
                placeholder="Ask about AgriPool..."
                className="resize-none"
              />
              <Button type="submit" loading={assistantLoading} disabled={!assistantInput.trim()} icon={Send}>
                Ask
              </Button>
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
