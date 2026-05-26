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
            $pendingRequests = Delivery::where('status', 'pending')
                ->whereNull('driver_id')
                ->where('type', 'transport')
                ->count();
            $completed = Delivery::where('driver_id', $user->id)->where('status', 'completed')->count();
            
            $earnings = Payment::whereHas('delivery', function ($query) use ($user) {
                $query->where('driver_id', $user->id);
            })->where('status', 'success')->sum('amount');

            $rating = number_format(min(4.5 + ($completed * 0.1), 5.0), 1);

            return response()->json([
                'role' => $role,
                'stats' => [
                    ['label' => 'Earnings (month)', 'value' => '₹'.number_format($earnings), 'trend' => 'Gross'],
                    ['label' => 'Active trips', 'value' => (string) max($active, 0), 'trend' => 'Live'],
                    ['label' => 'Rating', 'value' => $rating, 'trend' => '⭐'],
                    ['label' => 'Jobs done', 'value' => (string) ($completed ?: 0), 'trend' => 'Total'],
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
                    ['label' => 'Orders', 'value' => (string) $ordersCount, 'trend' => 'Total'],
                    ['label' => 'Saved items', 'value' => '2', 'trend' => 'Saved list'],
                    ['label' => 'Spent (month)', 'value' => '₹'.number_format($spent), 'trend' => 'Gross'],
                    ['label' => 'Active carts', 'value' => '0', 'trend' => 'Carts'],
                ],
            ]);
        }

        if ($role === 'equipment_owner' || $role === 'equipment-owner') {
            $earnings = Payment::whereHas('delivery', function ($query) use ($user) {
                $query->where('driver_id', $user->id);
            })->where('status', 'success')->sum('amount');
            
            $listedItems = \App\Models\Vehicle::where('user_id', $user->id)->count(); 
            
            $pendingRentals = Delivery::where('status', 'pending')
                ->where('type', 'equipment')
                ->count();

            return response()->json([
                'role' => $role,
                'stats' => [
                    ['label' => 'Monthly earnings', 'value' => '₹'.number_format($earnings), 'trend' => 'Gross'],
                    ['label' => 'Listed items', 'value' => (string) $listedItems, 'trend' => 'Live'],
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

        $rating = number_format(min(4.6 + ($completed * 0.1), 5.0), 1);

        return response()->json([
            'role' => $role,
            'stats' => [
                ['label' => 'Total spent', 'value' => '₹'.number_format($spent), 'trend' => 'Gross'],
                ['label' => 'Active bookings', 'value' => (string) $active, 'trend' => $active > 0 ? "$active pending" : 'None'],
                ['label' => 'Rating', 'value' => $rating, 'trend' => '⭐'],
                ['label' => 'Completed', 'value' => (string) ($completed ?: 0), 'trend' => 'Total'],
            ],
        ]);
    }
}
