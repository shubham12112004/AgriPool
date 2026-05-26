<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EquipmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Vehicle::query()->with('user');

        // Filter by owner
        if ($request->query('owner') || $request->query('my_listings')) {
            $query->where('user_id', $request->user()->id);
        } else {
            // By default show available rentals
            $query->where('available', true);
        }

        // Search term
        if ($q = $request->query('search')) {
            $query->where(function($sub) use ($q) {
                $sub->where('registration', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%")
                    ->orWhere('vehicle_type', 'like', "%{$q}%");
            });
        }

        // Category filter
        if ($category = $request->query('category')) {
            $query->where('vehicle_type', '=', $category);
        }

        $equipment = $query->latest()->get()->map(fn(Vehicle $v) => $this->presentEquipment($v));

        return response()->json($equipment);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'category' => ['required', 'string', 'max:50'],
            'daily_rate' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:150'],
            'image_url' => ['nullable', 'string', 'url'],
            'available' => ['boolean'],
        ]);

        $vehicle = Vehicle::create([
            'user_id' => $user->id,
            'vehicle_type' => strtolower($validated['category']),
            'registration' => $validated['name'],
            'rental_price' => (int) $validated['daily_rate'],
            'description' => $validated['description'] ?? null,
            'location' => $validated['location'] ?? 'Ludhiana, Punjab',
            'image_url' => $validated['image_url'] ?? 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
            'available' => $validated['available'] ?? true,
        ]);

        return response()->json([
            'success' => true,
            'data' => $this->presentEquipment($vehicle)
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $vehicle = Vehicle::with('user')->findOrFail($id);

        return response()->json($this->presentEquipment($vehicle));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $vehicle = Vehicle::findOrFail($id);
        
        // Ensure owner is updating
        if ($vehicle->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:100'],
            'category' => ['sometimes', 'string', 'max:50'],
            'daily_rate' => ['sometimes', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:150'],
            'image_url' => ['nullable', 'string', 'url'],
            'available' => ['boolean'],
        ]);

        $updateData = [];
        if (isset($validated['name'])) $updateData['registration'] = $validated['name'];
        if (isset($validated['category'])) $updateData['vehicle_type'] = strtolower($validated['category']);
        if (isset($validated['daily_rate'])) $updateData['rental_price'] = (int) $validated['daily_rate'];
        if (isset($validated['description'])) $updateData['description'] = $validated['description'];
        if (isset($validated['location'])) $updateData['location'] = $validated['location'];
        if (isset($validated['image_url'])) $updateData['image_url'] = $validated['image_url'];
        if (isset($validated['available'])) $updateData['available'] = $validated['available'];

        $vehicle->update($updateData);

        return response()->json([
            'success' => true,
            'data' => $this->presentEquipment($vehicle->fresh('user'))
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $vehicle = Vehicle::findOrFail($id);
        
        if ($vehicle->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            abort(403);
        }

        $vehicle->delete();

        return response()->json(['success' => true, 'deleted' => true]);
    }

    private function presentEquipment(Vehicle $v): array
    {
        return [
            'id' => $v->id,
            'name' => $v->registration,
            'category' => ucfirst($v->vehicle_type),
            'location' => $v->location ?? 'Ludhiana, Punjab',
            'price' => '₹' . number_format($v->rental_price) . '/day',
            'rental_price' => $v->rental_price,
            'rating' => 4.8,
            'reviews' => 120,
            'image' => $v->image_url ?? 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
            'distance' => '2.5 km',
            'description' => $v->description ?? 'No description provided.',
            'owner' => [
                'name' => $v->user?->name ?? 'AgriPool Partner',
                'rating' => 4.9,
                'reviews' => 245,
                'location' => $v->location ?? 'Ludhiana, Punjab',
                'image' => $v->user?->avatar ? (str_starts_with($v->user->avatar, 'http') ? $v->user->avatar : asset('storage/' . $v->user->avatar)) : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
            ],
            'availability' => $v->available ? 'Available' : 'Rented',
            'specs' => [
                ['label' => 'Year', 'value' => '2020'],
                ['label' => 'Condition', 'value' => 'Excellent'],
            ],
            'features' => [
                'Power Steering',
                'AC Cabin',
                'Verified Listing'
            ]
        ];
    }
}
