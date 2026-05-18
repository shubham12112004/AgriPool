<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingCrop extends Model
{
    protected $fillable = ['delivery_id', 'crop_name', 'quantity', 'unit', 'weight_kg'];

    public function delivery(): BelongsTo
    {
        return $this->belongsTo(Delivery::class);
    }
}
