<?php

namespace App\Support;

use App\Models\Delivery;

class BookingPresenter
{
    public static function toArray(Delivery $delivery): array
    {
        $status = match ($delivery->status) {
            'assigned' => 'accepted',
            'in_transit' => 'in_progress',
            default => $delivery->status,
        };

        $scheduled = $delivery->scheduled_at?->format('M j, Y — g:i A') ?? 'TBD';

        return [
            'id' => $delivery->id,
            'title' => $delivery->title,
            'type' => $delivery->type ?? 'transport',
            'date' => $scheduled,
            'scheduled_at' => $delivery->scheduled_at?->toIso8601String(),
            'status' => $status,
            'amount' => (int) ($delivery->amount ?? 0),
            'location' => $delivery->pickup_location,
            'pickup_location' => $delivery->pickup_location,
            'dropoff_location' => $delivery->dropoff_location,
            'notes' => $delivery->notes,
            'farmer_id' => $delivery->farmer_id,
            'driver_id' => $delivery->driver_id,
            'farmer_name' => $delivery->farmer?->name,
            'driver_name' => $delivery->driver?->name,
            'markers' => self::markers($delivery),
        ];
    }

    public static function markers(Delivery $delivery): array
    {
        $markers = [];

        if ($delivery->pickup_lat && $delivery->pickup_lng) {
            $markers[] = [
                'position' => [(float) $delivery->pickup_lat, (float) $delivery->pickup_lng],
                'popup' => 'Pickup: '.$delivery->pickup_location,
            ];
        }

        if ($delivery->dropoff_lat && $delivery->dropoff_lng) {
            $markers[] = [
                'position' => [(float) $delivery->dropoff_lat, (float) $delivery->dropoff_lng],
                'popup' => 'Dropoff: '.$delivery->dropoff_location,
            ];
        }

        if ($markers === []) {
            $markers[] = [
                'position' => [30.9, 75.85],
                'popup' => $delivery->pickup_location,
            ];
        }

        return $markers;
    }
}
