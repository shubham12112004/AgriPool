<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): View
    {
        return view('dashboard.index', [
            'user' => $request->user(),
            'stats' => [
                'totalTrips' => Delivery::count(),
                'activeTrips' => Delivery::whereIn('status', ['pending', 'assigned', 'in_transit'])->count(),
                'completedTrips' => Delivery::where('status', 'completed')->count(),
                'farmers' => Delivery::distinct('farmer_id')->count('farmer_id'),
            ],
        ]);
    }

    public function farmer(Request $request): View
    {
        $user = $request->user();

        abort_if($user->role !== 'farmer', 403);

        $deliveries = Delivery::with('driver')
            ->where('farmer_id', $user->id)
            ->latest()
            ->get();

        return view('dashboard.farmer', [
            'user' => $user,
            'deliveries' => $deliveries,
        ]);
    }

    public function driver(Request $request): View
    {
        $user = $request->user();

        abort_if($user->role !== 'driver', 403);

        $assigned = Delivery::with('farmer')
            ->where('driver_id', $user->id)
            ->latest()
            ->get();

        $available = Delivery::with('farmer')
            ->whereNull('driver_id')
            ->whereIn('status', ['pending'])
            ->latest()
            ->limit(10)
            ->get();

        return view('dashboard.driver', [
            'user' => $user,
            'assigned' => $assigned,
            'available' => $available,
        ]);
    }
}
