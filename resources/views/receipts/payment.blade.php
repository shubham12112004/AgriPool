<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>AgriPool Receipt — {{ $payment->receipt_number }}</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 520px; margin: 2rem auto; padding: 1.5rem; color: #111; position: relative; }
        h1 { color: #15803d; font-size: 1.5rem; margin-bottom: 0.25rem; position: relative; z-index: 1; }
        p { position: relative; z-index: 1; }
        .badge { display: inline-block; background: #dcfce7; color: #166534; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; }
        table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; position: relative; z-index: 1; }
        td { padding: 0.5rem 0; border-bottom: 1px solid #e5e5e5; }
        td:last-child { text-align: right; font-weight: 600; }
        .total { font-size: 1.25rem; color: #15803d; }
        footer { margin-top: 2rem; font-size: 0.8rem; color: #737373; position: relative; z-index: 1; }
        
        .watermark-grid {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        }
        .watermark-inner {
            transform: rotate(-30deg);
        }
        .watermark-line {
            white-space: nowrap;
            font-size: 3rem;
            font-weight: 900;
            color: rgba(21, 128, 61, 0.08);
            letter-spacing: 0.3em;
            line-height: 4rem;
            user-select: none;
        }
        .watermark-emblem {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 320px;
            height: 320px;
            color: rgba(21, 128, 61, 0.09);
            pointer-events: none;
            z-index: 0;
        }
    </style>
</head>
<body>
    <svg class="watermark-emblem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
        <path d="M12 22V12M12 12C12 7.58172 15.5817 4 20 4V7C15.5817 7 12 10.5817 12 12ZM12 12C12 7.58172 8.41828 4 4 4V7C8.41828 7 12 10.5817 12 12Z" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M12 15C12 13.3431 10.6569 12 9 12C7.34315 12 6 13.3431 6 15V16C6 17.6569 7.34315 19 9 19C10.6569 19 12 17.6569 12 15Z" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M12 14C12 12.3431 13.3431 11 15 11C16.6569 11 18 12.3431 18 14V15C18 16.6569 16.6569 18 15 18C13.3431 18 12 16.6569 12 14Z" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <div class="watermark-grid">
        <div class="watermark-inner">
            <div class="watermark-line">AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL</div>
            <div class="watermark-line">AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL</div>
            <div class="watermark-line">AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL</div>
            <div class="watermark-line">AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL</div>
            <div class="watermark-line">AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL &nbsp; AGRIPOOL</div>
        </div>
    </div>
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
