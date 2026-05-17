<?php

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
        'routes' => [
            'home' => url('/'),
            'dashboard' => url('/dashboard'),
            'health' => url('/up'),
        ],
    ]);
});