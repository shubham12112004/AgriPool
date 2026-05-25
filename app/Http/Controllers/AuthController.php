<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\SpaTokenService;
use App\Services\TurnstileService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class AuthController extends Controller
{
    public function __construct(
        private readonly TurnstileService $turnstile,
        private readonly SpaTokenService $spaTokens,
    ) {}

    public function showLogin()
    {
        return view('auth.login');
    }

    public function showRegister()
    {
        return view('auth.register');
    }

    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', 'min:8'],
            'role' => ['required', Rule::in(['farmer', 'driver'])],
            'cf-turnstile-response' => ['nullable', 'string'],
        ]);

        if (! $this->turnstile->verifyRequest($request)) {
            return back()->withInput()->withErrors([
                'captcha' => 'Cloudflare verification failed. Please try again.',
            ]);
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect('/dashboard/farmer');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'cf-turnstile-response' => ['nullable', 'string'],
        ]);

        if (! $this->turnstile->verifyRequest($request)) {
            return back()->withInput()->withErrors([
                'captcha' => 'Cloudflare verification failed. Please try again.',
            ]);
        }

        if (! Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']])) {
            return back()->withInput()->withErrors([
                'email' => 'The provided credentials are incorrect.',
            ]);
        }

        $request->session()->regenerate();

        return redirect('/dashboard/farmer');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Get the OAuth return URL, using APP_URL as fallback for production.
     * In production, the SPA is served from the same origin as Laravel.
     */
    private function getOAuthReturnUrl(): string
    {
        $appUrl = rtrim(config('app.url', url('/')), '/');
        return $appUrl . '/auth/oauth/callback';
    }

    public function redirectToGoogle(): RedirectResponse
    {
        $defaultReturn = $this->getOAuthReturnUrl();
        $returnTo = request()->query('return_to', $defaultReturn);

        if (is_string($returnTo) && filter_var($returnTo, FILTER_VALIDATE_URL)) {
            request()->session()->put('oauth_return_to', $returnTo);
        } else {
            request()->session()->put('oauth_return_to', $defaultReturn);
        }

        $role = request()->query('role');
        if (in_array($role, ['farmer', 'driver', 'buyer', 'equipment_owner'], true)) {
            request()->session()->put('oauth_role', $role);
        }

        if (! config('services.google.client_id')) {
            Log::error('Google OAuth not configured: GOOGLE_CLIENT_ID is missing from .env');
            $errorReturn = request()->session()->pull('oauth_return_to', $defaultReturn);
            return redirect($errorReturn.'?error='.urlencode('Google OAuth is not configured. Please contact the administrator.'));
        }

        try {
            // Dynamically set the redirect URL based on the current request's host
            // This ensures it works on any domain without env changes
            $redirectUrl = url('/auth/google/callback');
            return Socialite::driver('google')
                ->redirectUrl($redirectUrl)
                ->with(['prompt' => 'select_account'])
                ->redirect();
        } catch (Throwable $e) {
            Log::error('Google OAuth redirect failed: ' . $e->getMessage());
            $errorReturn = request()->session()->pull('oauth_return_to', $defaultReturn);
            return redirect($errorReturn.'?error='.urlencode('Failed to connect to Google. Please try again.'));
        }
    }

    public function handleGoogleCallback(Request $request): RedirectResponse
    {
        $defaultReturn = $this->getOAuthReturnUrl();

        try {
            // Use the same dynamic redirect URL for the callback
            $redirectUrl = url('/auth/google/callback');
            $googleUser = Socialite::driver('google')
                ->redirectUrl($redirectUrl)
                ->user();
        } catch (Throwable $e) {
            Log::error('Google OAuth callback failed: ' . $e->getMessage());
            $returnTo = $request->session()->pull('oauth_return_to', $defaultReturn);

            return redirect($returnTo.'?error='.urlencode('Google login failed. Please try again.'));
        }

        $user = User::where('google_id', $googleUser->id)->first()
            ?? User::where('email', $googleUser->email)->first();

        if (! $user) {
            $role = $request->session()->get('oauth_role', 'farmer');

            $user = User::create([
                'name' => $googleUser->name ?: 'AgriPool User',
                'email' => $googleUser->email,
                'password' => Hash::make(bin2hex(random_bytes(20))),
                'google_id' => $googleUser->id,
                // Allow all four supported roles for new OAuth users
                'role' => in_array($role, ['farmer', 'driver', 'buyer', 'equipment_owner'], true) ? $role : 'farmer',
            ]);
        } else {
            $user->google_id = $googleUser->id;
            $user->save();
        }

        $returnTo = $request->session()->pull('oauth_return_to', $defaultReturn);
        $code = $this->spaTokens->issueOAuthCode($user);

        return redirect($returnTo.(str_contains($returnTo, '?') ? '&' : '?').'code='.urlencode($code));
    }
}
