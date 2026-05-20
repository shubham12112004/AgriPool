<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'auth/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter(
        explode(',', env(
            'CORS_ALLOWED_ORIGINS',
            implode(',', array_filter([
                'http://localhost:5173',
                'http://127.0.0.1:5173',
                'http://localhost:8000',
                'http://127.0.0.1:8000',
                env('APP_URL', ''),
                env('FRONTEND_URL', ''),
            ]))
        ))
    ),

    'allowed_origins_patterns' => [
        // Allow any subdomain of common deployment platforms
        '#https://.*\.fly\.dev#',
        '#https://.*\.onrender\.com#',
        '#https://.*\.vercel\.app#',
        '#https://.*\.netlify\.app#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
