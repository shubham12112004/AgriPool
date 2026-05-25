import React, { useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../../components/shared/PageHeader'
import { Card, Button, Textarea, Input } from '../../components/ui'
import { adminService } from '../../services'
import toast from 'react-hot-toast'
import { Send, AlertCircle, BellRing } from 'lucide-react'

export default function AdminNotifications() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)

  const handleBroadcast = async (e) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) {
      toast.error('Please enter a title and a message body')
      return
    }

    try {
      setLoading(true)
      const res = await adminService.broadcastNotification({
        title: title.trim(),
        body: body.trim()
      })

      if (res?.success) {
        toast.success(res.message || 'Notification broadcasted successfully!')
        setTitle('')
        setBody('')
      } else {
        toast.error('Failed to send broadcast.')
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Error sending broadcast.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-2xl mx-auto space-y-8"
    >
      <PageHeader 
        title="Broadcast Notifications" 
        subtitle="Send platform-wide real-time announcements, maintenance notices or alerts to all users" 
      />

      <Card variant="glass" className="p-8 border-primary-500/10 shadow-premium relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-primary-500 pointer-events-none">
          <BellRing size={160} />
        </div>

        <form onSubmit={handleBroadcast} className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-neutral-100 dark:border-dark-border">
            <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-500">
              <BellRing size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base text-neutral-800 dark:text-neutral-100">
                Compose System-wide Alert
              </h3>
              <p className="text-xs text-neutral-500">
                This message will be instantly delivered to every registered user's dashboard notifications tab.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block">
              Announcement Title
            </label>
            <Input
              placeholder="e.g. Scheduled System Upgrade"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block">
              Message Content
            </label>
            <Textarea
              placeholder="Provide clear instructions or information for users. Formatting options: you can write in plain text..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              required
              fullWidth
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-400/90 bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20">
            <AlertCircle size={16} className="shrink-0" />
            <span>
              <strong>Caution:</strong> Once dispatched, this action cannot be undone. All active user sessions will receive the notification instantly.
            </span>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex items-center gap-2 px-6"
            >
              {loading ? (
                <>Sending...</>
              ) : (
                <>
                  <Send size={16} />
                  Dispatch Broadcast
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  )
}
