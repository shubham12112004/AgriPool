<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class AuthController extends Controller
{
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

        if (! $this->verifyTurnstile($request)) {
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

        return redirect()->route('dashboard.index');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'cf-turnstile-response' => ['nullable', 'string'],
        ]);

        if (! $this->verifyTurnstile($request)) {
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

        return redirect()->route('dashboard.index');
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
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback(Request $request): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (Throwable) {
            return redirect()->route('login')->withErrors([
                'oauth' => 'Google login failed. Please try again.',
            ]);
        }

        $user = User::where('google_id', $googleUser->id)
            ->orWhere('email', $googleUser->email)
            ->first();

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

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('dashboard.index');
    }

    private function verifyTurnstile(Request $request): bool
    {
        $secret = config('services.turnstile.secret');
        $token = $request->input('cf-turnstile-response');

        // Allow local development to proceed when Turnstile keys are not configured.
        if (! $secret) {
            return app()->environment('local', 'testing');
        }

        if (! is_string($token) || trim($token) === '') {
            return false;
        }

        try {
            $response = Http::asForm()->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
                'secret' => $secret,
                'response' => $token,
                'remoteip' => $request->ip(),
            ]);

            return (bool) data_get($response->json(), 'success', false);
        } catch (Throwable) {
            return false;
        }
    }
}
