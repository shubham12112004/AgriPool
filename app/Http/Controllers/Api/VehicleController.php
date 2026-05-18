<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $vehicle = $request->user()->vehicle;

        return response()->json(['data' => $vehicle]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'vehicle_type' => ['required', 'string', 'max:50'],
            'registration' => ['required', 'string', 'max:30'],
            'capacity' => ['nullable', 'string', 'max:20'],
            'available' => ['boolean'],
        ]);

        $user = $request->user();

        if ($user->role && $user->role !== 'driver') {
            $user->role = 'driver';
            $user->save();
        } elseif (! $user->role) {
            $user->role = 'driver';
            $user->save();
        }

        $vehicle = Vehicle::updateOrCreate(
            ['user_id' => $user->id],
            [
                'vehicle_type' => $validated['vehicle_type'],
                'registration' => $validated['registration'],
                'capacity' => $validated['capacity'] ?? null,
                'available' => $validated['available'] ?? true,
            ]
        );

        return response()->json(['data' => $vehicle], 201);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'vehicle_type' => ['sometimes', 'string', 'max:50'],
            'registration' => ['sometimes', 'string', 'max:30'],
            'capacity' => ['nullable', 'string', 'max:20'],
            'available' => ['boolean'],
        ]);

        $vehicle = $request->user()->vehicle;

        if (! $vehicle) {
            return response()->json(['message' => 'No vehicle registered.'], 404);
        }

        $vehicle->update($validated);

        return response()->json(['data' => $vehicle->fresh()]);
    }
}
