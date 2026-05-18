<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function revenueChart(Request $request): JsonResponse
    {
        $period = (int) $request->query('period', 30);
        
        // Get revenue data grouped by date
        $data = Payment::where('status', 'success')
            ->where('created_at', '>=', now()->subDays($period))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(amount) as revenue'),
                DB::raw('COUNT(*) as bookings')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($item) => [
                'date' => $item->date,
                'revenue' => (int) $item->revenue,
                'bookings' => (int) $item->bookings,
            ]);

        return response()->json([
            'success' => true,
            'data' => $data,
            'period' => $period,
        ]);
    }

    public function stats(): JsonResponse
    {
        $totalUsers = User::count();
        $totalRevenue = Payment::where('status', 'success')->sum('amount');
        $totalBookings = Delivery::count();
        $monthlyRevenue = Payment::where('status', 'success')
            ->where('created_at', '>=', now()->startOfMonth())
            ->sum('amount');

        return response()->json([
            'success' => true,
            'stats' => [
                'total_users' => $totalUsers,
                'total_revenue' => (int) $totalRevenue,
                'total_bookings' => $totalBookings,
                'monthly_revenue' => (int) $monthlyRevenue,
                'pending_verification' => User::where('status', 'pending')->count(),
                'mau' => $this->getMonthlyActiveUsers(),
                'retention' => $this->getRetention(),
            ],
        ]);
    }

    private function getMonthlyActiveUsers(): int
    {
        return User::where('last_login_at', '>=', now()->subMonth())->count();
    }

    private function getRetention(): float
    {
        $thisMonth = User::where('created_at', '>=', now()->startOfMonth())->count();
        $lastMonth = User::where('created_at', '>=', now()->subMonth()->startOfMonth())
            ->where('created_at', '<', now()->startOfMonth())
            ->count();

        if ($lastMonth === 0) {
            return 0;
        }

        return round(($thisMonth / $lastMonth) * 100, 2);
    }
}
