import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, HelpCircle, Mail, User, CheckCircle2, MessageSquare, ShieldAlert } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { supportService } from '../../services'
import { Button, Input } from '../ui'
import toast from 'react-hot-toast'

export default function SupportModal({ isOpen, onClose }) {
  const user = useAuthStore((s) => s.user)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    category: 'Technical Support',
    subject: '',
    message: ''
  })

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }))
    }
  }, [user, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      const res = await supportService.submitRequest(form)
      if (res?.success) {
        setSuccess(true)
        toast.success('Your message has been sent to the Admin!')
        // Reset message and subject
        setForm((prev) => ({
          ...prev,
          subject: '',
          message: ''
        }))
      }
    } catch (err) {
      console.error(err)
      toast.error(err?.message || 'Failed to submit support request')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm z-0"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 dark:border-dark-border flex justify-between items-center bg-neutral-50/50 dark:bg-dark-bg/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary-500/10 text-primary-500">
                <HelpCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Help & Support Desk</h3>
                <p className="text-xs text-neutral-500">Ask a question or report an issue directly to Admin</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-dark-border text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6">
            {success ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-10 text-center space-y-4"
              >
                <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-lg text-neutral-900 dark:text-white">Request Sent Successfully!</h4>
                  <p className="text-sm text-neutral-500 max-w-xs mx-auto">
                    The platform administrator has been notified. You will receive email updates regarding your inquiry shortly.
                  </p>
                </div>
                <div className="pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSuccess(false)
                      onClose()
                    }}
                    className="px-6 rounded-xl"
                  >
                    Close Window
                  </Button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name & Email (Readonly or Editable) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <Input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your Name"
                        className="pl-9 h-10 text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Email Address</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="yourname@gmail.com"
                        className="pl-9 h-10 text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 dark:border-dark-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-neutral-800 dark:text-neutral-200 dark:bg-dark-card"
                  >
                    <option value="Technical Support">Technical Support</option>
                    <option value="Billing & Payments">Billing & Payments</option>
                    <option value="Crop Logistics">Crop Logistics / Transport</option>
                    <option value="Account Settings">Account Settings</option>
                    <option value="General Feedback">General Feedback / Advice</option>
                  </select>
                </div>

                {/* Subject */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Subject</label>
                  <Input
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Brief summary of your request"
                    className="h-10 text-sm"
                    required
                  />
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Detailed Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe how we can help you today..."
                    rows={4}
                    className="w-full p-3 rounded-xl border border-neutral-200 dark:border-dark-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-neutral-800 dark:text-neutral-200 resize-none"
                    required
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2 flex justify-end gap-3">
                  <Button variant="outline" type="button" onClick={onClose} disabled={submitting}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={submitting} className="flex items-center gap-2 px-5">
                    {submitting ? 'Sending...' : 'Send Message'}
                    <Send size={14} className={submitting ? 'animate-pulse' : ''} />
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
