import React from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../../components/shared/PageHeader'
import { Card, Button, Textarea } from '../../components/ui'

export default function AdminNotifications() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl space-y-6">
      <PageHeader title="Broadcast notifications" subtitle="Send system alerts to users" />
      <Card className="p-6 space-y-4">
        <Textarea label="Message" placeholder="Platform maintenance tonight 10 PM–12 AM IST..." rows={4} />
        <Button variant="primary">Send to all users</Button>
      </Card>
    </motion.div>
  )
}
