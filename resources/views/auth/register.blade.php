<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Register | {{ config('app.name', 'AgriPool') }}</title>
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800" rel="stylesheet" />
        @if(config('services.turnstile.site_key'))
            <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
        @endif
        <style>
            :root { --text:#eef6ff; --muted:#95a6d8; --primary:#2b5fbf; --accent:#18c2ff; --border:rgba(60,110,200,0.12); }
            * { box-sizing: border-box; }
            body { margin:0; color:var(--text); font-family:'Instrument Sans',ui-sans-serif,system-ui,sans-serif; min-height:100vh; background:radial-gradient(circle at 10% -10%, rgba(58,124,255,.44), transparent 32%), radial-gradient(circle at 90% -15%, rgba(36,208,255,.22), transparent 30%), linear-gradient(160deg, #020711 0%, #07122a 45%, #020610 100%); }
            .container { width:min(1040px, calc(100% - 2rem)); margin:0 auto; }
            .nav { padding:1rem 0; }
            .brand { display:inline-flex; align-items:center; gap:.7rem; font-weight:800; color:inherit; text-decoration:none; }
            .mark { width:2.3rem; height:2.3rem; border-radius:.9rem; background:linear-gradient(140deg,var(--primary),var(--accent)); }
            .shell { padding:2rem 0 4rem; display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
            .card { background:rgba(9,18,44,.8); border:1px solid var(--border); border-radius:1.4rem; padding:1.1rem; box-shadow:0 26px 52px rgba(3,8,24,.58); }
            h1 { margin:.6rem 0 .5rem; font-size:clamp(2rem,4vw,3rem); line-height:.95; }
            p { color:var(--muted); line-height:1.72; }
            label { display:block; margin:.6rem 0 .35rem; font-weight:700; }
            input, select { width:100%; border:1px solid rgba(124,174,255,.35); border-radius:.8rem; padding:.78rem .85rem; background:rgba(4,10,24,.85); color:#e7efff; transition:all .2s ease; }
            input:hover, select:hover { border-color:rgba(124,174,255,.5); }
            input:focus, select:focus { border-color:rgba(124,174,255,.7); background:rgba(4,10,24,.95); outline:none; box-shadow:0 0 0 3px rgba(43,95,191,0.1); }
            input::placeholder { color:rgba(149,166,216,0.5); }
            .btn { width:100%; margin-top:.85rem; border:none; border-radius:.8rem; padding:.78rem .95rem; font-weight:700; cursor:pointer; transition:all .2s ease; }
            .btn-primary { background:linear-gradient(140deg,var(--primary),rgba(40,110,200,0.9)); color:#eef6ff; box-shadow:0 10px 24px rgba(10,20,48,0.6); }
            .btn-primary:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(10,20,48,0.8); }
            .btn-dark { margin-top:.55rem; display:block; text-align:center; text-decoration:none; border:1px solid rgba(60,110,200,.14); color:#dce7ff; background:rgba(6,10,18,.6); padding:.78rem .95rem; border-radius:.8rem; transition:all .2s ease; }
            .btn-dark:hover { border-color:rgba(60,110,200,.3); background:rgba(6,10,18,.8); }
            .role-wrap { display:grid; grid-template-columns:1fr 1fr; gap:.65rem; margin-top:.65rem; }
            .role-pill { border:1px solid rgba(124,174,255,.35); border-radius:.8rem; padding:.65rem; background:rgba(4,10,24,.72); }
            .errors { margin-top:.8rem; padding:.75rem .85rem; border-radius:.8rem; border:1px solid rgba(255,121,138,.35); background:rgba(126,19,35,.24); color:#ffd6dd; font-size:.92rem; }
            .turnstile { margin-top:.85rem; }
            @media (max-width: 900px) { .shell { grid-template-columns:1fr; } }
        </style>
    </head>
    <body>
        <div class="container">
            <header class="nav">
                <a class="brand" href="/"><span class="mark"></span><span>AgriPool</span></a>
            </header>

            <main class="shell">
                <section class="card">
                    <h1>Create your account.</h1>
                    <p>Choose Farmer or Driver first. Laravel stores that role and opens the correct dashboard with role-based data actions.</p>
                    <p>The dark UI and animations are kept consistent with your previous look.</p>
                </section>

                <section class="card">
                    <form method="post" action="{{ route('register.submit') }}">
                        @csrf
                        <label for="name">Full Name</label>
                        <input id="name" type="text" name="name" value="{{ old('name') }}" required>

                        <label for="email">Email</label>
                        <input id="email" type="email" name="email" value="{{ old('email') }}" required>

                        <label for="password">Password</label>
                        <input id="password" type="password" name="password" required>

                        <label for="password_confirmation">Confirm Password</label>
                        <input id="password_confirmation" type="password" name="password_confirmation" required>

                        <label for="role">Choose role</label>
                        <select id="role" name="role" required>
                            <option value="farmer" @selected(old('role') === 'farmer')>Farmer</option>
                            <option value="driver" @selected(old('role') === 'driver')>Driver</option>
                        </select>

                        @if(config('services.turnstile.site_key'))
                            <div class="cf-turnstile" data-sitekey="{{ config('services.turnstile.site_key') }}"></div>
                        @else
                            <input type="hidden" name="cf-turnstile-response" value="local-dev-bypass">
                        @endif

                        <button class="btn btn-primary" type="submit">Register</button>
                    </form>

                    <a id="google-oauth-link" class="btn-dark" href="{{ route('auth.google.redirect', ['role' => old('role', 'farmer')]) }}">Register with Google OAuth</a>
                    <a class="btn-dark" href="{{ route('login') }}">Already have an account? Login</a>

                    @if($errors->any())
                        <div class="errors">
                            @foreach($errors->all() as $error)
                                <div>{{ $error }}</div>
                            @endforeach
                        </div>
                    @endif
                </section>
            </main>
        </div>
        <script>
            const roleSelect = document.getElementById('role');
            const googleLink = document.getElementById('google-oauth-link');
            const updateGoogleRole = () => {
                if (!roleSelect || !googleLink) return;
                googleLink.href = `{{ route('auth.google.redirect') }}?role=${encodeURIComponent(roleSelect.value)}`;
            };
            roleSelect?.addEventListener('change', updateGoogleRole);
            updateGoogleRole();
        </script>
    </body>
</html>
