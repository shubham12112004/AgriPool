import { formatCurrency } from './utils'

const getAppBase = () => {
  const envUrl = import.meta.env.VITE_APP_URL;
  const isProd =
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  if (isProd) {
    return window.location.origin;
  }

  return envUrl || APP_ORIGIN;
}

const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  const isProd =
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  if (isProd) {
    return `${window.location.origin}/api`;
  }

  return envUrl || `${APP_ORIGIN}/api`;
}

const APP_BASE = getAppBase();
const API_BASE = getApiBase();

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
.watermark{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-size:5rem;font-weight:900;color:rgba(21,128,61,0.08);white-space:nowrap;pointer-events:none;z-index:0;letter-spacing:0.3em}
.watermark-grid{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:0;overflow:hidden}
.watermark-inner{transform:rotate(-30deg)}
.watermark-line{white-space:nowrap;font-size:3rem;font-weight:900;color:rgba(21,128,61,0.08);letter-spacing:0.3em;line-height:4rem}
.watermark-emblem{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:320px;height:320px;color:rgba(21,128,61,0.09);pointer-events:none;z-index:0}
body{position:relative}
table,h1,p{position:relative;z-index:1}
</style></head><body>
<svg class="watermark-emblem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
  <path d="M12 22V12M12 12C12 7.58172 15.5817 4 20 4V7C15.5817 7 12 10.5817 12 12ZM12 12C12 7.58172 8.41828 4 4 4V7C8.41828 7 12 10.5817 12 12Z" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M12 15C12 13.3431 10.6569 12 9 12C7.34315 12 6 13.3431 6 15V16C6 17.6569 7.34315 19 9 19C10.6569 19 12 17.6569 12 15Z" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M12 14C12 12.3431 13.3431 11 15 11C16.6569 11 18 12.3431 18 14V15C18 16.6569 16.6569 18 15 18C13.3431 18 12 16.6569 12 14Z" stroke-linecap="round" stroke-linejoin="round" />
</svg>
<div class="watermark-grid"><div class="watermark-inner">
<div class="watermark-line">AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL</div>
<div class="watermark-line">AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL</div>
<div class="watermark-line">AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL</div>
<div class="watermark-line">AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL</div>
<div class="watermark-line">AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL</div>
</div></div>
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
