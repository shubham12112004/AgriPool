<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Throwable;

class TurnstileService
{
    public function verify(?string $token, ?string $ip = null): bool
    {
        $secret = config('services.turnstile.secret');

        if (! is_string($token) || trim($token) === '') {
            return false;
        }

        if (app()->environment('local', 'testing')) {
            if (str_starts_with($token, 'dev-token-') || $token === 'dev-mode') {
                return true;
            }
        }

        if (! $secret) {
            return app()->environment('local', 'testing');
        }

        try {
            $response = Http::asForm()->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
                'secret' => $secret,
                'response' => $token,
                'remoteip' => $ip,
            ]);

            return (bool) data_get($response->json(), 'success', false);
        } catch (Throwable) {
            return false;
        }
    }

    public function verifyRequest(Request $request): bool
    {
        return $this->verify(
            $request->input('cf-turnstile-response') ?? $request->input('turnstile_token'),
            $request->ip()
        );
    }
}
