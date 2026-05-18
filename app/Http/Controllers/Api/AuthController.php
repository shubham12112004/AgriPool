<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\SpaTokenService;
use App\Services\TurnstileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        private readonly TurnstileService $turnstile,
        private readonly SpaTokenService $tokens,
    ) {}

    public function register(Request $request): JsonResponse
    {
        if (! $this->turnstile->verifyRequest($request)) {
            throw ValidationException::withMessages([
                'turnstile' => ['Cloudflare verification failed. Please complete the security check.'],
            ]);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'farmer',
        ]);

        $token = $this->tokens->issue($user);

        return response()->json([
            'token' => $token,
            'user' => $this->userPayload($user),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        if (! $this->turnstile->verifyRequest($request)) {
            throw ValidationException::withMessages([
                'turnstile' => ['Cloudflare verification failed. Please complete the security check.'],
            ]);
        }

        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $this->tokens->issue($user);

        return response()->json([
            'token' => $token,
            'user' => $this->userPayload($user),
        ]);
    }

    public function verifyTurnstile(Request $request): JsonResponse
    {
        $request->validate([
            'turnstile_token' => ['required', 'string'],
        ]);

        $ok = $this->turnstile->verify($request->input('turnstile_token'), $request->ip());

        return response()->json(['success' => $ok]);
    }

    public function exchangeOAuthCode(Request $request): JsonResponse
    {
        $request->validate(['code' => ['required', 'string']]);

        $user = $this->tokens->userFromOAuthCode($request->input('code'));

        if (! $user) {
            return response()->json(['message' => 'Invalid or expired OAuth code.'], 400);
        }

        $token = $this->tokens->issue($user);

        return response()->json([
            'token' => $token,
            'user' => $this->userPayload($user),
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json(['user' => $this->userPayload($request->user())]);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->tokens->revoke($request->bearerToken());

        return response()->json(['success' => true]);
    }

    public function updateRole(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['farmer', 'driver', 'equipment_owner', 'buyer', 'admin'])],
        ]);

        $user = $request->user();
        $user->role = $validated['role'];
        $user->save();

        return response()->json(['user' => $this->userPayload($user)]);
    }

    public function handleGoogleCallback(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Use Laravel web OAuth at /auth/google/redirect',
        ], 400);
    }

    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role ?? 'farmer',
        ];
    }
}
