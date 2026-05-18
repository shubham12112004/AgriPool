<?php

namespace App\Http\Middleware;

use App\Services\SpaTokenService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SpaAuthenticate
{
    public function __construct(private readonly SpaTokenService $tokens) {}

    public function handle(Request $request, Closure $next): Response
    {
        $header = $request->bearerToken();
        $user = $this->tokens->userFromToken($header);

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $request->setUserResolver(fn () => $user);
        auth()->setUser($user);

        return $next($request);
    }
}
