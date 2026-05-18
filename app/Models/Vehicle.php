<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    protected $fillable = [
        'user_id', 'vehicle_type', 'registration', 'capacity', 'available',
        'is_active', 'maintenance_status', 'supported_crops', 'capacity_kg', 'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'available' => 'boolean',
            'is_active' => 'boolean',
            'supported_crops' => 'array',
            'verified_at' => 'datetime',
            'capacity_kg' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function activeTrips(): HasMany
    {
        return $this->hasMany(ActiveTrip::class)->where('status', 'active');
    }
}
