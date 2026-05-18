<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>AgriPool Receipt — {{ $payment->receipt_number }}</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 520px; margin: 2rem auto; padding: 1.5rem; color: #111; }
        h1 { color: #15803d; font-size: 1.5rem; margin-bottom: 0.25rem; }
        .badge { display: inline-block; background: #dcfce7; color: #166534; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; }
        table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
        td { padding: 0.5rem 0; border-bottom: 1px solid #e5e5e5; }
        td:last-child { text-align: right; font-weight: 600; }
        .total { font-size: 1.25rem; color: #15803d; }
        footer { margin-top: 2rem; font-size: 0.8rem; color: #737373; }
    </style>
</head>
<body>
    <h1>AgriPool</h1>
    <p>Payment receipt <span class="badge">{{ $payment->is_demo ? 'DEMO' : 'PAID' }}</span></p>
    <table>
        <tr><td>Receipt #</td><td>{{ $payment->receipt_number }}</td></tr>
        <tr><td>Date</td><td>{{ $payment->created_at->format('d M Y, h:i A') }}</td></tr>
        <tr><td>Customer</td><td>{{ $payment->user->name }}</td></tr>
        <tr><td>Description</td><td>{{ $payment->description }}</td></tr>
        @if($payment->delivery_id)
        <tr><td>Booking</td><td>#{{ $payment->delivery_id }}</td></tr>
        @endif
        <tr><td>Payment ID</td><td>{{ $payment->razorpay_payment_id }}</td></tr>
        <tr><td class="total">Amount</td><td class="total">₹{{ number_format($payment->amount) }}</td></tr>
    </table>
    <footer>Thank you for using AgriPool. This is a computer-generated receipt.</footer>
</body>
</html>
