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

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);
        
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            // Return success even if not found to prevent user enumeration, or return standard validation
            return response()->json(['message' => 'We have emailed your password reset link!']);
        }

        // Generate a random plain token
        $token = \Illuminate\Support\Str::random(60);
        
        // Store the plain token in the table so we can look it up without email parameter
        \Illuminate\Support\Facades\DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => $token,
                'created_at' => now()
            ]
        );

        $resetUrl = request()->getSchemeAndHttpHost() . "/reset-password?token={$token}&email=" . urlencode($user->email);

        // Send Custom Mailable HTML Email
        try {
            \Illuminate\Support\Facades\Mail::send([], [], function ($message) use ($user, $resetUrl) {
                $message->to($user->email)
                    ->subject('Reset Password Notification')
                    ->html("
                        <div style='font-family: sans-serif; padding: 20px; color: #333;'>
                            <h2>Hello!</h2>
                            <p>You are receiving this email because we received a password reset request for your account.</p>
                            <div style='margin: 30px 0;'>
                                <a href='{$resetUrl}' style='background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;'>Reset Password</a>
                            </div>
                            <p>This password reset link will expire in 60 minutes.</p>
                            <p>If you did not request a password reset, no further action is required.</p>
                            <hr style='border: none; border-top: 1px solid #eee; margin: 30px 0;' />
                            <p style='font-size: 12px; color: #777;'>If you're having trouble clicking the \"Reset Password\" button, copy and paste the URL below into your web browser:<br><a href='{$resetUrl}'>{$resetUrl}</a></p>
                        </div>
                    ");
            });
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Failed to send reset email to {$user->email}: " . $e->getMessage());
        }

        return response()->json([
            'message' => 'We have emailed your password reset link!',
            'dev_token' => $token // Include in API response for easy manual testing / validation
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string',
            'password' => 'required|string|min:8',
        ]);

        $record = \Illuminate\Support\Facades\DB::table('password_reset_tokens')
            ->where('token', $request->token)
            ->first();

        if (!$record) {
            return response()->json([
                'message' => 'This password reset token is invalid or expired.'
            ], 400);
        }

        if (now()->parse($record->created_at)->addMinutes(60)->isPast()) {
            \Illuminate\Support\Facades\DB::table('password_reset_tokens')
                ->where('email', $record->email)
                ->delete();
            return response()->json([
                'message' => 'This password reset token has expired.'
            ], 400);
        }

        $user = User::where('email', $record->email)->first();
        if (!$user) {
            return response()->json([
                'message' => "We can't find a user with that email address."
            ], 400);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        // Clean up the token record
        \Illuminate\Support\Facades\DB::table('password_reset_tokens')
            ->where('email', $record->email)
            ->delete();

        return response()->json([
            'message' => 'Your password has been reset!'
        ]);
    }

    public function updateProfile(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        if ($user->id != $id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        $user->update($validated);

        return response()->json(['user' => $this->userPayload($user)]);
    }

    public function uploadAvatar(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        if ($user->id != $id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'avatar' => ['required', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('avatar')) {
            if ($user->avatar && !str_starts_with($user->avatar, 'http')) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->avatar);
            }

            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
            $user->save();
        }

        return response()->json(['user' => $this->userPayload($user)]);
    }

    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role ?? 'farmer',
            'phone' => $user->phone,
            'avatar' => $user->avatar ? (str_starts_with($user->avatar, 'http') ? $user->avatar : asset('storage/' . $user->avatar)) : null,
        ];
    }
}
