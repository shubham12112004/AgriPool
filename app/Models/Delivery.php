<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Delivery extends Model
{
    use HasFactory;

    protected $fillable = [
        'farmer_id', 'driver_id', 'vehicle_id', 'title', 'type', 'crop_type',
        'amount', 'negotiated_price', 'negotiation_status', 'lifecycle_status',
        'scheduled_at', 'notes', 'pickup_location', 'dropoff_location',
        'pickup_lat', 'pickup_lng', 'dropoff_lat', 'dropoff_lng',
        'status', 'pooled_booking_id', 'capacity_used_kg',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'amount' => 'integer',
            'negotiated_price' => 'integer',
            'capacity_used_kg' => 'integer',
        ];
    }

    public function farmer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function pooledBooking(): BelongsTo
    {
        return $this->belongsTo(PooledBooking::class, 'pooled_booking_id');
    }

    public function crops(): HasMany
    {
        return $this->hasMany(BookingCrop::class);
    }

    public function offers(): HasMany
    {
        return $this->hasMany(BookingOffer::class);
    }

    public function statusLogs(): HasMany
    {
        return $this->hasMany(BookingStatusLog::class)->latest();
    }

    public function conversation(): HasOne
    {
        return $this->hasOne(Conversation::class);
    }

    public function activeTrip(): HasOne
    {
        return $this->hasOne(ActiveTrip::class);
    }
}
