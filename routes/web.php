<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeliveryController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware('guest')->group(function (): void {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.submit');

    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.submit');

    Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle'])->name('auth.google.redirect');
    Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');
});

Route::middleware('auth')->group(function (): void {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
    Route::get('/dashboard/farmer', [DashboardController::class, 'farmer'])->name('dashboard.farmer');
    Route::get('/dashboard/driver', [DashboardController::class, 'driver'])->name('dashboard.driver');

    Route::post('/deliveries', [DeliveryController::class, 'store'])->name('deliveries.store');
    Route::post('/deliveries/{delivery}/claim', [DeliveryController::class, 'claim'])->name('deliveries.claim');
    Route::post('/deliveries/{delivery}/status', [DeliveryController::class, 'updateStatus'])->name('deliveries.status');
    Route::delete('/deliveries/{delivery}', [DeliveryController::class, 'destroy'])->name('deliveries.destroy');
});
