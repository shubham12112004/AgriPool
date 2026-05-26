<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function createOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1'],
            'booking_id' => ['nullable'],
        ]);

        $amountPaise = (int) round($validated['amount'] * 100);
        $key = config('services.razorpay.key');
        $secret = config('services.razorpay.secret');

        $hasKey = $key && ! str_starts_with($key, 'rzp_test_demo');
        $hasSecret = $secret && $secret !== '••••••••••••••••••••••••';

        if (! $hasKey) {
            return response()->json([
                'key' => 'rzp_test_demo',
                'amount' => $amountPaise,
                'currency' => 'INR',
                'order_id' => 'order_demo_'.Str::random(10),
                'demo' => true,
            ]);
        }

        if (! $hasSecret) {
            // Direct/standard checkout: we have a real key but no secret.
            // We cannot generate a Razorpay order_id, but we can open the real modal on frontend.
            return response()->json([
                'key' => $key,
                'amount' => $amountPaise,
                'currency' => 'INR',
                'order_id' => null,
                'demo' => false,
                'direct' => true,
            ]);
        }

        try {
            $response = Http::withBasicAuth($key, $secret)->post('https://api.razorpay.com/v1/orders', [
                'amount' => $amountPaise,
                'currency' => 'INR',
                'receipt' => 'booking_'.($validated['booking_id'] ?? Str::random(8)),
            ]);

            if (! $response->successful()) {
                // If the order creation fails (e.g. invalid secret), fallback to direct checkout using the key
                return response()->json([
                    'key' => $key,
                    'amount' => $amountPaise,
                    'currency' => 'INR',
                    'order_id' => null,
                    'demo' => false,
                    'direct' => true,
                    'razorpay_error' => true,
                ]);
            }

            $data = $response->json();

            return response()->json([
                'key' => $key,
                'amount' => $data['amount'],
                'currency' => $data['currency'],
                'order_id' => $data['id'],
                'demo' => false,
            ]);
        } catch (\Throwable) {
            return response()->json([
                'key' => $key,
                'amount' => $amountPaise,
                'currency' => 'INR',
                'order_id' => null,
                'demo' => false,
                'direct' => true,
            ]);
        }
    }

    public function demoComplete(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1'],
            'booking_id' => ['nullable'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $payment = $this->recordPayment(
            user: $request->user(),
            amount: (int) round($validated['amount']),
            deliveryId: $validated['booking_id'] ?? null,
            description: $validated['description'] ?? 'AgriPool demo payment',
            isDemo: true,
            razorpayOrderId: 'demo_order_'.Str::random(8),
            razorpayPaymentId: 'demo_pay_'.Str::random(10),
        );

        return response()->json(['success' => true, 'payment' => $this->paymentPayload($payment)]);
    }

    public function verify(Request $request): JsonResponse
    {
        $request->validate([
            'razorpay_order_id' => ['nullable', 'string'],
            'razorpay_payment_id' => ['required', 'string'],
            'razorpay_signature' => ['nullable', 'string'],
            'amount' => ['nullable', 'numeric'],
            'booking_id' => ['nullable'],
            'description' => ['nullable', 'string'],
        ]);

        $secret = config('services.razorpay.secret');
        $hasSecret = $secret && $secret !== '••••••••••••••••••••••••';

        $orderId = $request->input('razorpay_order_id');
        $paymentId = $request->input('razorpay_payment_id');
        $signature = $request->input('razorpay_signature');

        $isDemo = str_starts_with($orderId ?? '', 'order_demo_')
            || str_starts_with($paymentId, 'demo_');

        $isDirect = ! $orderId || ! $signature;

        if (! $hasSecret || $isDemo || $isDirect) {
            $payment = $this->recordPayment(
                user: $request->user(),
                amount: (int) round($request->input('amount', 1200)),
                deliveryId: $request->input('booking_id'),
                description: $request->input('description', 'AgriPool payment'),
                isDemo: $isDemo,
                razorpayOrderId: $orderId ?? 'direct_order_'.Str::random(10),
                razorpayPaymentId: $paymentId,
            );

            return response()->json(['success' => true, 'demo' => $isDemo, 'payment' => $this->paymentPayload($payment)]);
        }

        $payload = $orderId.'|'.$paymentId;
        $expected = hash_hmac('sha256', $payload, $secret);
        $valid = hash_equals($expected, $signature);

        if (! $valid) {
            return response()->json(['success' => false], 400);
        }

        $payment = $this->recordPayment(
            user: $request->user(),
            amount: (int) round($request->input('amount', 1200)),
            deliveryId: $request->input('booking_id'),
            description: $request->input('description', 'AgriPool payment'),
            isDemo: false,
            razorpayOrderId: $orderId,
            razorpayPaymentId: $paymentId,
        );

        return response()->json(['success' => true, 'payment' => $this->paymentPayload($payment)]);
    }

    public function history(Request $request): JsonResponse
    {
        $user = $request->user();

        if (in_array($user->role, ['driver', 'equipment_owner', 'equipment-owner'])) {
            $payments = Payment::whereHas('delivery', function ($query) use ($user) {
                $query->where('driver_id', $user->id);
            })
            ->latest()
            ->limit(50)
            ->get()
            ->map(fn (Payment $p) => $this->paymentPayload($p));
        } else {
            $payments = Payment::where('user_id', $user->id)
                ->latest()
                ->limit(50)
                ->get()
                ->map(fn (Payment $p) => $this->paymentPayload($p));
        }

        return response()->json(['data' => $payments]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $payment = Payment::where('user_id', $request->user()->id)->findOrFail($id);

        return response()->json(['payment' => $this->paymentPayload($payment)]);
    }

    public function receipt(Request $request, int $id)
    {
        $payment = Payment::with(['user', 'delivery'])->where('user_id', $request->user()->id)->findOrFail($id);
        $html = view('receipts.payment', ['payment' => $payment])->render();

        if ($request->query('download')) {
            return response($html, 200, [
                'Content-Type' => 'text/html',
                'Content-Disposition' => 'attachment; filename="agripool-receipt-'.$payment->receipt_number.'.html"',
            ]);
        }

        return response($html)->header('Content-Type', 'text/html');
    }

    private function recordPayment(
        $user,
        int $amount,
        $deliveryId,
        string $description,
        bool $isDemo,
        string $razorpayOrderId,
        string $razorpayPaymentId,
    ): Payment {
        return Payment::create([
            'user_id' => $user->id,
            'delivery_id' => $deliveryId,
            'amount' => $amount,
            'currency' => 'INR',
            'status' => 'success',
            'receipt_number' => 'AGR-'.strtoupper(Str::random(8)),
            'description' => $description,
            'razorpay_order_id' => $razorpayOrderId,
            'razorpay_payment_id' => $razorpayPaymentId,
            'is_demo' => $isDemo,
        ]);
    }

    private function paymentPayload(Payment $payment): array
    {
        return [
            'id' => $payment->id,
            'receipt_number' => $payment->receipt_number,
            'amount' => $payment->amount,
            'currency' => $payment->currency,
            'status' => $payment->status,
            'description' => $payment->description,
            'booking_id' => $payment->delivery_id,
            'is_demo' => $payment->is_demo,
            'date' => $payment->created_at->format('M j, Y — g:i A'),
            'created_at' => $payment->created_at->toIso8601String(),
            'razorpay_payment_id' => $payment->razorpay_payment_id,
        ];
    }
}
