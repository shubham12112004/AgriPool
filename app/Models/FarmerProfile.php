<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FarmerProfile extends Model
{
    protected $fillable = [
        'user_id', 'farm_name', 'state', 'district', 'area',
        'preferred_crops', 'farm_lat', 'farm_lng',
        'verification_status', 'rating_avg', 'reviews_count', 'completed_bookings',
    ];

    protected function casts(): array
    {
        return [
            'preferred_crops' => 'array',
            'rating_avg' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
