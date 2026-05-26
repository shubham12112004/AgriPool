<?php

use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\AssistantController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EquipmentController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\SupportController;
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
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/assistant/chat', [AssistantController::class, 'chat']);

Route::middleware(['spa.auth'])->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::apiResource('equipment', EquipmentController::class);
    Route::apiResource('products', \App\Http\Controllers\Api\ProductController::class);
    Route::get('/bookings/map-markers', [BookingController::class, 'mapMarkers']);
    Route::get('/bookings/{id}/conversation', [ConversationController::class, 'show']);
    Route::post('/bookings/{id}/accept', [BookingController::class, 'accept']);
    Route::post('/bookings/{id}/reject', [BookingController::class, 'reject']);
    Route::put('/bookings/{id}/status', [BookingController::class, 'updateStatus']);
    Route::apiResource('bookings', BookingController::class);
    Route::post('/conversations/{id}/messages', [ConversationController::class, 'store']);

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
    Route::put('/users/{id}', [AuthController::class, 'updateProfile']);
    Route::post('/users/{id}/avatar', [AuthController::class, 'uploadAvatar']);
    Route::post('/auth/send-verification-otp', [AuthController::class, 'sendVerificationOtp']);
    Route::post('/auth/verify-email-otp', [AuthController::class, 'verifyEmailOtp']);

    // Analytics routes (admin only)
    Route::get('/analytics/revenue-chart', [AnalyticsController::class, 'revenueChart']);
    Route::get('/analytics/stats', [AnalyticsController::class, 'stats']);
    Route::get('/admin/dashboard-data', [AnalyticsController::class, 'adminDashboardData']);
    Route::get('/admin/ai-advice', [AnalyticsController::class, 'adminAiAdvice']);

    // Support routes
    Route::post('/support/submit', [SupportController::class, 'store']);
    Route::get('/admin/support-requests', [SupportController::class, 'index']);
    Route::put('/admin/support-requests/{id}/resolve', [SupportController::class, 'resolve']);

    // Notification routes
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'read']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    Route::post('/admin/broadcast-notification', [NotificationController::class, 'broadcast']);
});

Broadcast::routes(['middleware' => ['spa.auth']]);
