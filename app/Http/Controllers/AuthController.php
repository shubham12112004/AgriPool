<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\SpaTokenService;
use App\Services\TurnstileService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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

    public function redirectToGoogle(): RedirectResponse
    {
        $returnTo = request()->query('return_to', config('app.frontend_url').'/auth/oauth/callback');
        if (is_string($returnTo) && filter_var($returnTo, FILTER_VALIDATE_URL)) {
            request()->session()->put('oauth_return_to', $returnTo);
        }

        $role = request()->query('role');
        if (in_array($role, ['farmer', 'driver', 'buyer', 'equipment_owner'], true)) {
            request()->session()->put('oauth_role', $role);
        }

        if (! config('services.google.client_id')) {
            return redirect($returnTo.'?error='.urlencode('Google OAuth is not configured. Add GOOGLE_CLIENT_ID to .env'));
        }

        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback(Request $request): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (Throwable) {
            $returnTo = $request->session()->pull('oauth_return_to', config('app.frontend_url').'/auth/oauth/callback');

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
                'role' => in_array($role, ['farmer', 'driver'], true) ? $role : 'farmer',
            ]);
        } else {
            $user->google_id = $googleUser->id;
            $user->save();
        }

        $returnTo = $request->session()->pull('oauth_return_to', config('app.frontend_url').'/auth/oauth/callback');
        $code = $this->spaTokens->issueOAuthCode($user);

        return redirect($returnTo.(str_contains($returnTo, '?') ? '&' : '?').'code='.urlencode($code));
    }
}
