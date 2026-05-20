<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class SpaTokenService
{
    public function issue(User $user): string
    {
        $issuedAt = now()->timestamp;
        $expiresAt = now()->addDays(7)->timestamp;

        $payload = json_encode([
            'uid' => $user->id,
            'iat' => $issuedAt,
            'exp' => $expiresAt,
            'nonce' => Str::random(24),
        ], JSON_UNESCAPED_SLASHES);

        if ($payload === false) {
            throw new \RuntimeException('Failed to build SPA auth token payload.');
        }

        $signature = hash_hmac('sha256', $payload, $this->signingKey(), true);

        return 'spa1.'.rtrim(strtr(base64_encode($payload), '+/', '-_'), '=').'.'.rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');
    }

    public function userFromToken(?string $token): ?User
    {
        if (! is_string($token) || $token === '') {
            return null;
        }

        if (str_starts_with($token, 'spa1.')) {
            return $this->userFromSignedToken($token);
        }

        // Legacy cache-backed tokens are still supported for existing sessions.
        $userId = Cache::get($this->cacheKey($token));

        return $userId ? User::find($userId) : null;
    }

    public function revoke(?string $token): void
    {
        if ($token) {
            if (! str_starts_with($token, 'spa1.')) {
                Cache::forget($this->cacheKey($token));
            }
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

    private function userFromSignedToken(string $token): ?User
    {
        $parts = explode('.', $token, 3);

        if (count($parts) !== 3) {
            return null;
        }

        [, $encodedPayload, $encodedSignature] = $parts;

        $payload = $this->base64UrlDecode($encodedPayload);
        $signature = $this->base64UrlDecode($encodedSignature);

        if ($payload === null || $signature === null) {
            return null;
        }

        $expectedSignature = hash_hmac('sha256', $payload, $this->signingKey(), true);

        if (! hash_equals($expectedSignature, $signature)) {
            return null;
        }

        $data = json_decode($payload, true);

        if (! is_array($data)) {
            return null;
        }

        if (($data['exp'] ?? 0) < now()->timestamp) {
            return null;
        }

        $userId = $data['uid'] ?? null;

        return is_int($userId) || ctype_digit((string) $userId) ? User::find((int) $userId) : null;
    }

    private function signingKey(): string
    {
        $appKey = (string) config('app.key');

        if (str_starts_with($appKey, 'base64:')) {
            $decoded = base64_decode(substr($appKey, 7), true);

            if (is_string($decoded) && $decoded !== '') {
                return $decoded;
            }
        }

        return $appKey !== '' ? $appKey : config('app.name', 'agripool');
    }

    private function base64UrlDecode(string $value): ?string
    {
        $decoded = base64_decode(strtr($value, '-_', '+/'), true);

        return $decoded === false ? null : $decoded;
    }
}
