import React from 'react'
import { Download } from 'lucide-react'
import { Button, Badge, Card } from '../ui'
import { formatCurrency } from '../../lib/utils'
import { downloadReceipt } from '../../lib/paymentReceipt'

export default function PaymentReceiptSlip({ payment, userName, onDownload }) {
  if (!payment) return null

  const handleDownload = () => {
    downloadReceipt(payment, userName)
    onDownload?.()
  }

  return (
    <Card className="p-6 text-left border-2 border-dashed border-primary-200 dark:border-primary-800">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-neutral-500">AgriPool</p>
          <h2 className="text-lg font-bold">Payment receipt</h2>
        </div>
        <Badge variant={payment.is_demo ? 'warning' : 'success'}>
          {payment.is_demo ? 'Demo' : 'Paid'}
        </Badge>
      </div>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-neutral-500">Receipt #</dt>
          <dd className="font-mono font-medium">{payment.receipt_number}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-neutral-500">Date</dt>
          <dd>{payment.date}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-neutral-500">Description</dt>
          <dd className="text-right">{payment.description}</dd>
        </div>
        {payment.booking_id && (
          <div className="flex justify-between gap-4">
            <dt className="text-neutral-500">Booking</dt>
            <dd>#{payment.booking_id}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4 pt-2 border-t border-neutral-200 dark:border-dark-border">
          <dt className="font-semibold">Amount paid</dt>
          <dd className="text-lg font-bold text-primary-600 dark:text-primary-400">
            {formatCurrency(payment.amount)}
          </dd>
        </div>
      </dl>

      <Button variant="primary" fullWidth className="mt-6 gap-2" onClick={handleDownload}>
        <Download size={18} /> Download receipt
      </Button>
    </Card>
  )
}
