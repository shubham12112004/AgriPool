import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import PageHeader from '../../components/shared/PageHeader'
import BookingCard from '../../components/booking/BookingCard'
import EmptyState from '../../components/shared/EmptyState'
import { Button, Input } from '../../components/ui'
import { bookingService } from '../../services'
import { useAuthStore } from '../../store/authStore'
import { ROLES } from '../../config/roles'
import { Calendar } from 'lucide-react'

export default function BookingsList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'all'
  const role = useAuthStore((s) => s.role)
  const isDriver = role === ROLES.DRIVER
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = () => {
    setLoading(true)
    const params = tab === 'requests' ? { tab: 'requests' } : {}
    bookingService
      .getBookings(params)
      .then((res) => setBookings(res.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [tab])

  const filtered = bookings.filter((b) =>
    (b.title || '').toLowerCase().includes(search.toLowerCase())
  )

  const tabs = isDriver
    ? [
        { id: 'all', label: 'My trips' },
        { id: 'requests', label: 'Open requests' },
      ]
    : [{ id: 'all', label: 'All bookings' }]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title={isDriver && tab === 'requests' ? 'Booking requests' : 'Bookings'}
        subtitle={isDriver ? 'Accept jobs and manage trips' : 'Manage and track all your bookings'}
        actions={
          !isDriver ? (
            <Link to="/bookings/new">
              <Button variant="primary" className="gap-2">
                <Plus size={18} /> New booking
              </Button>
            </Link>
          ) : null
        }
      />

      {isDriver && (
        <div className="flex gap-2">
          {tabs.map((t) => (
            <Button
              key={t.id}
              variant={tab === t.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSearchParams(t.id === 'all' ? {} : { tab: t.id })}
            >
              {t.label}
            </Button>
          ))}
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
        <Input
          placeholder="Search bookings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <p className="text-neutral-500">Loading bookings...</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No bookings found"
          description={isDriver ? 'No open requests right now.' : 'Create a new booking to get started.'}
          actionLabel={isDriver ? undefined : 'New booking'}
          onAction={isDriver ? undefined : () => (window.location.href = '/bookings/new')}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      )}
    </motion.div>
  )
}
