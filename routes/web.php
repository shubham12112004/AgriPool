<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SpaController;
use Illuminate\Support\Facades\Route;

/*
| Google OAuth stays on Laravel (Socialite).
| All other UI routes are handled by the React SPA.
*/
Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle'])->name('auth.google.redirect');
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');

Route::get('/{any?}', [SpaController::class, 'index'])
    ->where('any', '.*')
    ->name('spa');
