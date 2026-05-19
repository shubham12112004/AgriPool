<?php

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('conversations.{conversation}', function (User $user, Conversation $conversation): bool {
    $delivery = $conversation->delivery;
    $role = $user->role ?? 'farmer';

    if (! $delivery) {
        return false;
    }

    if ($delivery->farmer_id === $user->id || $delivery->driver_id === $user->id) {
        return true;
    }

    if ($role === 'driver' && $delivery->status === 'pending' && ! $delivery->driver_id) {
        return true;
    }

    return $conversation->participants()->where('user_id', $user->id)->exists();
});