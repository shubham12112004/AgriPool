<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use App\Support\BookingPresenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BookingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = $user->role ?? 'farmer';
        $tab = $request->query('tab');

        $query = Delivery::query()->with(['farmer', 'driver']);

        if ($role === 'driver') {
            if ($tab === 'requests') {
                $query->where('status', 'pending')
                    ->whereNull('driver_id')
                    ->where('type', 'transport');
            } else {
                $query->where('driver_id', $user->id);
            }
        } elseif ($role === 'equipment_owner' || $role === 'equipment-owner') {
            if ($tab === 'requests') {
                $query->where('status', 'pending')
                    ->whereNull('driver_id')
                    ->where('type', 'equipment');
            } else {
                $query->where('driver_id', $user->id);
            }
        } elseif ($role === 'admin') {
            // Admins see all bookings
        } else {
            $query->where('farmer_id', $user->id);
        }

        $bookings = $query->latest()->get()->map(fn (Delivery $d) => BookingPresenter::toArray($d));

        return response()->json(['data' => $bookings]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'type' => ['required', 'string', Rule::in(['equipment', 'transport'])],
            'title' => ['nullable', 'string', 'max:160'],
            'pickup_location' => ['required', 'string', 'max:255'],
            'dropoff_location' => ['required', 'string', 'max:255'],
            'date' => ['nullable', 'date'],
            'time' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'amount' => ['nullable', 'numeric', 'min:0'],
            'pickup_lat' => ['nullable', 'numeric'],
            'pickup_lng' => ['nullable', 'numeric'],
            'dropoff_lat' => ['nullable', 'numeric'],
            'dropoff_lng' => ['nullable', 'numeric'],
        ]);

        $scheduledAt = null;
        if (! empty($validated['date'])) {
            $scheduledAt = $validated['date'].(isset($validated['time']) ? ' '.$validated['time'] : ' 09:00:00');
        }

        $title = $validated['title'] ?? match ($validated['type']) {
            'equipment' => 'Equipment rental',
            default => 'Transport / driver',
        };

        $amount = (int) ($validated['amount'] ?? ($validated['type'] === 'equipment' ? 1200 : 850));

        $delivery = Delivery::create([
            'farmer_id' => $user->id,
            'title' => $title,
            'type' => $validated['type'],
            'amount' => $amount,
            'scheduled_at' => $scheduledAt,
            'notes' => $validated['notes'] ?? null,
            'pickup_location' => $validated['pickup_location'],
            'dropoff_location' => $validated['dropoff_location'],
            'pickup_lat' => $validated['pickup_lat'] ?? 30.91,
            'pickup_lng' => $validated['pickup_lng'] ?? 75.85,
            'dropoff_lat' => $validated['dropoff_lat'] ?? 30.88,
            'dropoff_lng' => $validated['dropoff_lng'] ?? 75.82,
            'status' => 'pending',
        ]);

        return response()->json([
            'data' => BookingPresenter::toArray($delivery->load(['farmer', 'driver'])),
        ], 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $delivery = $this->findAuthorized($request, $id);

        return response()->json(['data' => BookingPresenter::toArray($delivery)]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $delivery = $this->findAuthorized($request, $id);
        $user = $request->user();

        $validated = $request->validate([
            'status' => ['sometimes', Rule::in(['pending', 'assigned', 'in_transit', 'completed', 'cancelled', 'accepted', 'in_progress'])],
        ]);

        if (isset($validated['status'])) {
            $status = match ($validated['status']) {
                'accepted' => 'assigned',
                'in_progress' => 'in_transit',
                default => $validated['status'],
            };

            if ($user->role === 'driver' && $delivery->driver_id !== $user->id) {
                abort(403);
            }

            $delivery->status = $status;
            $delivery->save();
        }

        return response()->json(['data' => BookingPresenter::toArray($delivery->fresh(['farmer', 'driver']))]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $delivery = $this->findAuthorized($request, $id);
        $user = $request->user();

        if ($user->role === 'farmer' && $delivery->farmer_id !== $user->id) {
            abort(403);
        }

        $delivery->delete();

        return response()->json(['deleted' => true]);
    }

    public function accept(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        abort_if(!in_array($user->role, ['driver', 'equipment_owner', 'equipment-owner']), 403);

        $delivery = Delivery::findOrFail($id);

        if ($delivery->driver_id && $delivery->driver_id !== $user->id) {
            return response()->json(['message' => 'Already claimed by another partner.'], 409);
        }

        $delivery->driver_id = $user->id;
        $delivery->status = 'assigned';
        $delivery->save();

        return response()->json(['data' => BookingPresenter::toArray($delivery->load(['farmer', 'driver']))]);
    }

    public function reject(Request $request, int $id): JsonResponse
    {
        $delivery = Delivery::findOrFail($id);
        $user = $request->user();

        if (in_array($user->role, ['driver', 'equipment_owner', 'equipment-owner'])) {
            if ($delivery->driver_id === $user->id) {
                $delivery->driver_id = null;
                $delivery->status = 'pending';
                $delivery->save();
            } elseif ($delivery->status === 'pending' && is_null($delivery->driver_id)) {
                // decline logic
            } else {
                abort(403);
            }
        } elseif ($user->role === 'farmer' && $delivery->farmer_id === $user->id) {
            $delivery->status = 'cancelled';
            $delivery->save();
        } else {
            abort(403);
        }

        return response()->json(['data' => BookingPresenter::toArray($delivery->fresh(['farmer', 'driver']))]);
    }

    public function mapMarkers(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = $user->role ?? 'farmer';

        $deliveries = Delivery::query()
            ->whereIn('status', ['pending', 'assigned', 'in_transit'])
            ->when($role === 'farmer', fn ($q) => $q->where('farmer_id', $user->id))
            ->when($role === 'driver', fn ($q) => $q->where(function ($q2) use ($user) {
                $q2->whereNull('driver_id')->orWhere('driver_id', $user->id);
            }))
            ->latest()
            ->limit(20)
            ->get();

        $markers = [];
        foreach ($deliveries as $delivery) {
            foreach (BookingPresenter::markers($delivery) as $m) {
                $markers[] = array_merge($m, ['booking_id' => $delivery->id]);
            }
        }

        $vehicle = $user->vehicle;
        if ($vehicle && $vehicle->available) {
            $markers[] = [
                'position' => [30.9, 75.8],
                'popup' => '<b>Your vehicle</b><br/>'.$vehicle->registration.' · Available',
            ];
        }

        if ($markers === []) {
            $markers = [
                ['position' => [30.91, 75.85], 'popup' => '<b>Demo driver</b><br/>Available nearby'],
                ['position' => [30.88, 75.82], 'popup' => '<b>Demo equipment</b><br/>Tractor · ₹800/day'],
            ];
        }

        return response()->json(['data' => $markers]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $delivery = Delivery::findOrFail($id);
        $user = $request->user();

        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'assigned', 'in_transit', 'completed', 'cancelled', 'accepted', 'in_progress'])],
            'vehicle_type' => ['sometimes', 'nullable', 'string', 'max:50'],
            'registration' => ['sometimes', 'nullable', 'string', 'max:50'],
            'estimated_days' => ['sometimes', 'nullable', 'integer'],
            'payment_method' => ['sometimes', 'nullable', 'string', 'max:50'],
        ]);

        $status = match ($validated['status']) {
            'accepted' => 'assigned',
            'in_progress' => 'in_transit',
            default => $validated['status'],
        };

        if (in_array($user->role, ['driver', 'equipment_owner', 'equipment-owner']) && $delivery->driver_id !== $user->id) {
            abort(403);
        }

        $delivery->status = $status;

        if ($status === 'in_transit') {
            $vehicleType = $request->input('vehicle_type', 'Tractor');
            $registration = $request->input('registration', 'PB-10-TEMP');
            $estimatedDays = (int) $request->input('estimated_days', 1);
            $paymentMethod = $request->input('payment_method', 'Pay on Delivery');

            // Find or create driver's vehicle
            $vehicle = \App\Models\Vehicle::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'vehicle_type' => $vehicleType,
                    'registration' => $registration,
                    'available' => true,
                ]
            );

            $delivery->vehicle_id = $vehicle->id;

            // Save details to notes
            $delivery->notes = "Est. Delivery: {$estimatedDays} days | Payment: {$paymentMethod} | Vehicle: {$registration} ({$vehicleType})";

            // Create active trip
            \App\Models\ActiveTrip::updateOrCreate(
                ['delivery_id' => $delivery->id],
                [
                    'vehicle_id' => $vehicle->id,
                    'driver_id' => $user->id,
                    'started_at' => now(),
                    'status' => 'active',
                ]
            );

            // Create AppNotification for farmer
            try {
                \App\Models\AppNotification::create([
                    'user_id' => $delivery->farmer_id,
                    'type' => 'trip_started',
                    'title' => 'Your Trip Has Started!',
                    'body' => "Your driver has started the trip for " . $delivery->title . ". Estimated delivery: " . $estimatedDays . " days. Vehicle: " . $registration . ".",
                    'data' => [
                        'delivery_id' => $delivery->id,
                        'estimated_days' => $estimatedDays,
                        'payment_method' => $paymentMethod,
                    ],
                ]);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::warning("Notification creation failed: " . $e->getMessage());
            }

            // Create system message in chat
            try {
                $conversation = $delivery->conversation()->firstOrCreate([
                    'type' => 'booking',
                    'subject' => trim(($delivery->title ?: 'Delivery').' chat'),
                ]);

                $systemMessage = "🚚 Trip started!\n- From: {$delivery->pickup_location}\n- To: {$delivery->dropoff_location}\n- Est. Delivery: {$estimatedDays} days\n- Payment Method: {$paymentMethod}\n- Vehicle Details: {$registration} ({$vehicleType})";

                $conversation->messages()->create([
                    'user_id' => $user->id,
                    'body' => $systemMessage,
                    'type' => 'system',
                ]);

                $conversation->forceFill(['last_message_at' => now()])->save();
                
                // Broadcast message sent
                try {
                    event(new \App\Events\ConversationMessageSent($conversation->messages()->latest()->first()));
                } catch (\Exception $e) {}
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::warning("System chat message creation failed: " . $e->getMessage());
            }
        }

        $delivery->save();

        return response()->json(['data' => BookingPresenter::toArray($delivery->fresh(['farmer', 'driver']))]);
    }

    private function findAuthorized(Request $request, int $id): Delivery
    {
        $delivery = Delivery::with(['farmer', 'driver'])->findOrFail($id);
        $user = $request->user();
        $role = $user->role ?? 'farmer';

        $allowed = $delivery->farmer_id === $user->id
            || $delivery->driver_id === $user->id
            || ($role === 'driver' && $delivery->status === 'pending' && !$delivery->driver_id && $delivery->type === 'transport')
            || (in_array($role, ['equipment_owner', 'equipment-owner']) && $delivery->status === 'pending' && !$delivery->driver_id && $delivery->type === 'equipment')
            || ($role === 'admin');

        abort_if(! $allowed, 403);

        return $delivery;
    }
}
