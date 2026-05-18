<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PooledBooking extends Model
{
    protected $fillable = [
        'vehicle_id', 'driver_id', 'status',
        'total_capacity_kg', 'used_capacity_kg', 'shared_price', 'route_key',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function deliveries(): HasMany
    {
        return $this->hasMany(Delivery::class, 'pooled_booking_id');
    }
}
