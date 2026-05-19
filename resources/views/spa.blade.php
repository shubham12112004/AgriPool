<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="AgriPool — Connect farmers, drivers, equipment owners and buyers">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
    <title>{{ config('app.name', 'AgriPool') }}</title>
    @if ($assets && !empty($assets['css']))
        <link rel="stylesheet" href="{{ $assets['css'] }}">
    @endif
    @if ($viteDev)
        <script type="module" src="{{ $viteUrl }}/@vite/client"></script>
        <script type="module" src="{{ $viteUrl }}/src/main.jsx"></script>
    @elseif ($assets && !empty($assets['js']))
        <script type="module" src="{{ $assets['js'] }}"></script>
    @else
        {{-- Production build missing: run `cd frontend && npm run build` --}}
        <style>
            body { font-family: Inter, system-ui, sans-serif; display: grid; place-items: center; min-height: 100vh; margin: 0; background: #f0fdf4; color: #145231; padding: 2rem; text-align: center; }
            code { background: #dcfce7; padding: 0.2rem 0.5rem; border-radius: 6px; }
        </style>
        <script>document.addEventListener('DOMContentLoaded', function () {
            document.body.innerHTML = '<div><h1>AgriPool frontend not built</h1><p>Run <code>cd frontend && npm install && npm run build</code></p><p>Or for development: <code>cd frontend && npm run dev</code> then refresh this page.</p></div>';
        });</script>
    @endif
    <script src="https://checkout.razorpay.com/v1/checkout.js" defer></script>
</head>
<body class="antialiased">
    <div id="root"></div>
</body>
</html>
