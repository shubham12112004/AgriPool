<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = $user->role ?? 'farmer';

        if ($role === 'driver') {
            $active = Delivery::where('driver_id', $user->id)
                ->whereIn('status', ['assigned', 'in_transit'])
                ->count();
            $pendingRequests = Delivery::where('status', 'pending')->whereNull('driver_id')->count();
            $completed = Delivery::where('driver_id', $user->id)->where('status', 'completed')->count();
            
            // Query driver's earnings from payments associated with deliveries driven by this driver
            $earnings = Payment::whereHas('delivery', function ($query) use ($user) {
                $query->where('driver_id', $user->id);
            })->where('status', 'success')->sum('amount');

            return response()->json([
                'role' => $role,
                'stats' => [
                    ['label' => 'Earnings (month)', 'value' => '₹'.number_format($earnings), 'trend' => '+18%'],
                    ['label' => 'Active trips', 'value' => (string) max($active, 0), 'trend' => 'Live'],
                    ['label' => 'Rating', 'value' => '4.9', 'trend' => '⭐'],
                    ['label' => 'Jobs done', 'value' => (string) ($completed ?: 0), 'trend' => '+3'],
                ],
                'pending_requests' => $pendingRequests,
                'vehicle_available' => (bool) $user->vehicle?->available,
            ]);
        }

        if ($role === 'buyer') {
            $spent = Payment::where('user_id', $user->id)->where('status', 'success')->sum('amount');
            $ordersCount = Delivery::where('farmer_id', $user->id)->count();

            return response()->json([
                'role' => $role,
                'stats' => [
                    ['label' => 'Orders', 'value' => (string) $ordersCount, 'trend' => '+2'],
                    ['label' => 'Saved items', 'value' => '8', 'trend' => '—'],
                    ['label' => 'Spent (month)', 'value' => '₹'.number_format($spent), 'trend' => '+5%'],
                    ['label' => 'Active carts', 'value' => '1', 'trend' => '—'],
                ],
            ]);
        }

        if ($role === 'equipment_owner' || $role === 'equipment-owner') {
            $earnings = Payment::whereHas('delivery', function ($query) use ($user) {
                $query->where('driver_id', $user->id);
            })->where('status', 'success')->sum('amount');
            
            $listedItems = 5; 
            
            $pendingRentals = Delivery::where('status', 'pending')
                ->where('type', 'equipment')
                ->count();

            return response()->json([
                'role' => $role,
                'stats' => [
                    ['label' => 'Monthly earnings', 'value' => '₹'.number_format($earnings), 'trend' => '+8%'],
                    ['label' => 'Listed items', 'value' => (string) $listedItems, 'trend' => '—'],
                    ['label' => 'Pending rentals', 'value' => (string) $pendingRentals, 'trend' => $pendingRentals . ' new'],
                ],
            ]);
        }

        // Default: farmer
        $active = Delivery::where('farmer_id', $user->id)
            ->whereIn('status', ['pending', 'assigned', 'in_transit'])
            ->count();
        $completed = Delivery::where('farmer_id', $user->id)->where('status', 'completed')->count();
        $spent = Payment::where('user_id', $user->id)->where('status', 'success')->sum('amount');

        return response()->json([
            'role' => $role,
            'stats' => [
                ['label' => 'Total spent', 'value' => '₹'.number_format($spent), 'trend' => '+12%'],
                ['label' => 'Active bookings', 'value' => (string) $active, 'trend' => $active > 0 ? "$active pending" : 'None'],
                ['label' => 'Rating', 'value' => '4.8', 'trend' => '⭐'],
                ['label' => 'Completed', 'value' => (string) ($completed ?: 0), 'trend' => '+5'],
            ],
        ]);
    }
}
