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
    <Card className="p-6 text-left border-2 border-dashed border-primary-200 dark:border-primary-800 relative overflow-hidden">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 select-none">
        {/* Central Sprout Leaf Emblem */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-72 h-72 text-primary-500/[0.09] dark:text-primary-400/[0.09] absolute">
          <path d="M12 22V12M12 12C12 7.58172 15.5817 4 20 4V7C15.5817 7 12 10.5817 12 12ZM12 12C12 7.58172 8.41828 4 4 4V7C8.41828 7 12 10.5817 12 12Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 15C12 13.3431 10.6569 12 9 12C7.34315 12 6 13.3431 6 15V16C6 17.6569 7.34315 19 9 19C10.6569 19 12 17.6569 12 15Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 14C12 12.3431 13.3431 11 15 11C16.6569 11 18 12.3431 18 14V15C18 16.6569 16.6569 18 15 18C13.3431 18 12 16.6569 12 14Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="transform -rotate-[30deg] select-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="whitespace-nowrap text-[3rem] font-black tracking-[0.3em] leading-[4rem] text-primary-500/[0.08] dark:text-primary-400/[0.09] select-none">
              AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10">
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
      </div>
    </Card>
  )
}
