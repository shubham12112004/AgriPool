<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class SpaTokenService
{
    public function issue(User $user): string
    {
        $token = Str::random(64);
        Cache::put($this->cacheKey($token), $user->id, now()->addDays(7));

        return $token;
    }

    public function userFromToken(?string $token): ?User
    {
        if (! is_string($token) || $token === '') {
            return null;
        }

        $userId = Cache::get($this->cacheKey($token));

        return $userId ? User::find($userId) : null;
    }

    public function revoke(?string $token): void
    {
        if ($token) {
            Cache::forget($this->cacheKey($token));
        }
    }

    public function issueOAuthCode(User $user): string
    {
        $code = Str::random(48);
        Cache::put('oauth_code:'.$code, $user->id, now()->addMinutes(10));

        return $code;
    }

    public function userFromOAuthCode(?string $code): ?User
    {
        if (! is_string($code) || $code === '') {
            return null;
        }

        $userId = Cache::pull('oauth_code:'.$code);

        return $userId ? User::find($userId) : null;
    }

    private function cacheKey(string $token): string
    {
        return 'spa_token:'.$token;
    }
}
