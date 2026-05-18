import{t as a}from"./index-D3QrQ-u9.js";function n(t){t&&sessionStorage.setItem("agripool_last_payment",JSON.stringify(t))}function c(){try{const t=sessionStorage.getItem("agripool_last_payment");return t?JSON.parse(t):null}catch{return null}}function l(t,e="Customer"){const o=t.is_demo?"DEMO":"PAID";return`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>AgriPool Receipt ${t.receipt_number}</title>
<style>
body{font-family:system-ui,sans-serif;max-width:520px;margin:2rem auto;padding:1.5rem;color:#111}
h1{color:#15803d;font-size:1.5rem}.badge{background:#dcfce7;color:#166534;padding:.2rem .6rem;border-radius:999px;font-size:.75rem}
table{width:100%;border-collapse:collapse;margin-top:1.5rem}td{padding:.5rem 0;border-bottom:1px solid #e5e5e5}
td:last-child{text-align:right;font-weight:600}.total{font-size:1.25rem;color:#15803d}
</style></head><body>
<h1>AgriPool</h1><p>Payment receipt <span class="badge">${o}</span></p>
<table>
<tr><td>Receipt #</td><td>${t.receipt_number}</td></tr>
<tr><td>Date</td><td>${t.date||""}</td></tr>
<tr><td>Customer</td><td>${e}</td></tr>
<tr><td>Description</td><td>${t.description||"AgriPool payment"}</td></tr>
${t.booking_id?`<tr><td>Booking</td><td>#${t.booking_id}</td></tr>`:""}
<tr><td>Payment ID</td><td>${t.razorpay_payment_id||"—"}</td></tr>
<tr><td class="total">Amount</td><td class="total">${a(t.amount)}</td></tr>
</table>
<p style="margin-top:2rem;font-size:.8rem;color:#737373">Thank you for using AgriPool.</p>
</body></html>`}function m(t,e){const o=l(t,e),i=new Blob([o],{type:"text/html"}),d=URL.createObjectURL(i),r=document.createElement("a");r.href=d,r.download=`agripool-receipt-${t.receipt_number}.html`,r.click(),URL.revokeObjectURL(d)}export{m as d,c as l,n as s};
