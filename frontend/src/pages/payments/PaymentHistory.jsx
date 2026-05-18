import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import PageHeader from '../../components/shared/PageHeader'
import { Card, Badge, Button } from '../../components/ui'
import { formatCurrency } from '../../lib/utils'
import { paymentService } from '../../services'
import { downloadReceipt } from '../../lib/paymentReceipt'
import { useAuthStore } from '../../store/authStore'

export default function PaymentHistory() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    paymentService
      .getPaymentHistory()
      .then((res) => setPayments(res.data || []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Payment history" subtitle="Invoices and transaction records" />
      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : payments.length === 0 ? (
        <Card className="p-8 text-center text-neutral-500">
          No payments yet. Use demo checkout from a booking to create a receipt.
        </Card>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => (
            <Card key={p.id} className="p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{p.description}</p>
                <p className="text-sm text-neutral-500">
                  {p.date} · {p.receipt_number}
                  {p.is_demo && ' · Demo'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold">{formatCurrency(p.amount)}</span>
                <Badge variant={p.status === 'success' ? 'success' : 'error'}>{p.status}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => downloadReceipt(p, user?.name)}
                >
                  <Download size={14} /> Slip
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  )
}
