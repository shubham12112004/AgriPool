<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;

class SpaController extends Controller
{
    public function index()
    {
        $manifestPath = public_path('spa/.vite/manifest.json');
        if (! File::exists($manifestPath)) {
            $manifestPath = public_path('spa/manifest.json');
        }
        $assets = null;

        if (File::exists($manifestPath)) {
            $manifest = json_decode(File::get($manifestPath), true);
            $entry = $manifest['index.html'] ?? $manifest['src/main.jsx'] ?? null;
            if ($entry) {
                $assets = [
                    'js' => asset('spa/'.($entry['file'] ?? '')),
                    'css' => isset($entry['css'][0]) ? asset('spa/'.$entry['css'][0]) : null,
                ];
            }
        }

        $viteDev = app()->environment('local')
            && ! File::exists($manifestPath);

        return view('spa', [
            'viteDev' => $viteDev,
            'viteUrl' => rtrim(env('VITE_DEV_SERVER', 'http://127.0.0.1:5173'), '/'),
            'assets' => $assets,
        ]);
    }
}
