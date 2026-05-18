import { formatCurrency } from './utils'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
const APP_BASE = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000'

export function saveLastPayment(payment) {
  if (payment) {
    sessionStorage.setItem('agripool_last_payment', JSON.stringify(payment))
  }
}

export function loadLastPayment() {
  try {
    const raw = sessionStorage.getItem('agripool_last_payment')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function receiptDownloadUrl(paymentId) {
  const token = localStorage.getItem('auth_token')
  return `${API_BASE}/payments/${paymentId}/receipt?download=1&token=${encodeURIComponent(token || '')}`
}

export function buildReceiptHtml(payment, userName = 'Customer') {
  const demo = payment.is_demo ? 'DEMO' : 'PAID'
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>AgriPool Receipt ${payment.receipt_number}</title>
<style>
body{font-family:system-ui,sans-serif;max-width:520px;margin:2rem auto;padding:1.5rem;color:#111}
h1{color:#15803d;font-size:1.5rem}.badge{background:#dcfce7;color:#166534;padding:.2rem .6rem;border-radius:999px;font-size:.75rem}
table{width:100%;border-collapse:collapse;margin-top:1.5rem}td{padding:.5rem 0;border-bottom:1px solid #e5e5e5}
td:last-child{text-align:right;font-weight:600}.total{font-size:1.25rem;color:#15803d}
</style></head><body>
<h1>AgriPool</h1><p>Payment receipt <span class="badge">${demo}</span></p>
<table>
<tr><td>Receipt #</td><td>${payment.receipt_number}</td></tr>
<tr><td>Date</td><td>${payment.date || ''}</td></tr>
<tr><td>Customer</td><td>${userName}</td></tr>
<tr><td>Description</td><td>${payment.description || 'AgriPool payment'}</td></tr>
${payment.booking_id ? `<tr><td>Booking</td><td>#${payment.booking_id}</td></tr>` : ''}
<tr><td>Payment ID</td><td>${payment.razorpay_payment_id || '—'}</td></tr>
<tr><td class="total">Amount</td><td class="total">${formatCurrency(payment.amount)}</td></tr>
</table>
<p style="margin-top:2rem;font-size:.8rem;color:#737373">Thank you for using AgriPool.</p>
</body></html>`
}

export function downloadReceipt(payment, userName) {
  const html = buildReceiptHtml(payment, userName)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `agripool-receipt-${payment.receipt_number}.html`
  a.click()
  URL.revokeObjectURL(url)
}

export async function downloadReceiptFromApi(paymentId) {
  const token = localStorage.getItem('auth_token')
  const res = await fetch(`${API_BASE}/payments/${paymentId}/receipt?download=1`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  const html = await res.text()
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `agripool-receipt-${paymentId}.html`
  a.click()
  URL.revokeObjectURL(url)
}

export { APP_BASE }
