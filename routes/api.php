<?php

use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AssistantController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EquipmentController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\VehicleController;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/status', function (Request $request) {
    return response()->json([
        'success' => true,
        'app' => config('app.name'),
        'framework' => 'Laravel',
        'laravel_version' => app()->version(),
        'php_version' => PHP_VERSION,
        'environment' => app()->environment(),
        'database' => config('database.default'),
        'turnstile_configured' => (bool) config('services.turnstile.secret'),
        'google_configured' => (bool) config('services.google.client_id'),
        'razorpay_configured' => (bool) config('services.razorpay.key'),
    ]);
});

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/turnstile-verify', [AuthController::class, 'verifyTurnstile']);
Route::post('/auth/oauth/exchange', [AuthController::class, 'exchangeOAuthCode']);

Route::middleware(['spa.auth'])->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::apiResource('equipment', EquipmentController::class);
    Route::get('/bookings/map-markers', [BookingController::class, 'mapMarkers']);
    Route::get('/bookings/{id}/conversation', [ConversationController::class, 'show']);
    Route::post('/bookings/{id}/accept', [BookingController::class, 'accept']);
    Route::post('/bookings/{id}/reject', [BookingController::class, 'reject']);
    Route::apiResource('bookings', BookingController::class);
    Route::post('/conversations/{id}/messages', [ConversationController::class, 'store']);
    Route::post('/assistant/chat', [AssistantController::class, 'chat']);

    Route::get('/vehicle', [VehicleController::class, 'show']);
    Route::post('/vehicle', [VehicleController::class, 'store']);
    Route::put('/vehicle', [VehicleController::class, 'update']);

    Route::post('/payments/create-order', [PaymentController::class, 'createOrder']);
    Route::post('/payments/demo-complete', [PaymentController::class, 'demoComplete']);
    Route::post('/payments/verify', [PaymentController::class, 'verify']);
    Route::get('/payments/history', [PaymentController::class, 'history']);
    Route::get('/payments/{id}', [PaymentController::class, 'show']);
    Route::get('/payments/{id}/receipt', [PaymentController::class, 'receipt']);

    Route::patch('/user/role', [AuthController::class, 'updateRole']);

    // Analytics routes (admin only)
    Route::get('/analytics/revenue-chart', [AnalyticsController::class, 'revenueChart']);
    Route::get('/analytics/stats', [AnalyticsController::class, 'stats']);
});

Broadcast::routes(['middleware' => ['spa.auth']]);
