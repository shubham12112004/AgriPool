<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Log in | {{ config('app.name', 'AgriPool') }}</title>
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800" rel="stylesheet" />
        <style>
            :root {
                --bg: #f7faf7;
                --surface: #ffffff;
                --border: rgba(15, 23, 42, 0.08);
                --text: #153026;
                --muted: #547064;
                --primary: #1f8f5f;
                --primary-dark: #156343;
                --accent: #f0b429;
                --shadow: 0 24px 60px rgba(9, 34, 24, 0.12);
            }
            * { box-sizing: border-box; }
            body {
                margin: 0;
                font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
                color: var(--text);
                background:
                    radial-gradient(circle at top left, rgba(31, 143, 95, 0.14), transparent 32%),
                    radial-gradient(circle at top right, rgba(240, 180, 41, 0.10), transparent 28%),
                    linear-gradient(180deg, #fbfdfb 0%, #f3f8f4 100%);
                min-height: 100vh;
            }
            a { color: inherit; text-decoration: none; }
            .container { width: min(1120px, calc(100% - 2rem)); margin: 0 auto; }
            .nav {
                position: sticky;
                top: 0;
                background: rgba(247, 250, 247, 0.85);
                backdrop-filter: blur(16px);
                border-bottom: 1px solid rgba(15, 23, 42, 0.06);
            }
            .nav-inner {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                padding: 1rem 0;
            }
            .brand { display: flex; align-items: center; gap: .75rem; font-weight: 800; }
            .brand-mark {
                width: 2.5rem;
                height: 2.5rem;
                border-radius: 1rem;
                background: linear-gradient(135deg, var(--primary), #48b27e);
                box-shadow: 0 12px 30px rgba(31, 143, 95, 0.24);
            }
            .btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: .8rem 1.15rem;
                border-radius: 999px;
                border: 1px solid transparent;
                font-weight: 700;
            }
            .btn-primary {
                color: #fff;
                background: linear-gradient(135deg, var(--primary), #2d9d6d);
                box-shadow: 0 14px 28px rgba(31, 143, 95, 0.18);
            }
            .btn-secondary {
                background: #fff;
                border-color: rgba(31, 143, 95, 0.12);
                color: var(--primary-dark);
            }
            .page {
                padding: 3rem 0 4rem;
            }
            .grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1.2rem;
                align-items: stretch;
            }
            .card {
                background: rgba(255,255,255,0.92);
                border: 1px solid var(--border);
                border-radius: 1.7rem;
                box-shadow: var(--shadow);
                padding: 1.3rem;
            }
            .kicker {
                display: inline-flex;
                align-items: center;
                gap: .45rem;
                padding: .45rem .75rem;
                border-radius: 999px;
                background: rgba(31, 143, 95, 0.08);
                color: var(--primary-dark);
                font-weight: 700;
                font-size: .9rem;
            }
            h1 {
                margin: .9rem 0;
                font-size: clamp(2rem, 4.4vw, 3.3rem);
                line-height: .97;
                letter-spacing: -.04em;
            }
            .copy { color: var(--muted); line-height: 1.7; }
            form { margin-top: .8rem; }
            .field { margin-bottom: .9rem; }
            label { display: block; margin-bottom: .35rem; font-weight: 700; }
            input {
                width: 100%;
                border: 1px solid rgba(15,23,42,.14);
                border-radius: .9rem;
                padding: .8rem .9rem;
                font: inherit;
                background: #fff;
            }
            input:focus { outline: 2px solid rgba(31, 143, 95, 0.24); border-color: var(--primary); }
            .form-actions { display: flex; gap: .7rem; margin-top: .7rem; flex-wrap: wrap; }
            .meta { margin-top: .8rem; color: var(--muted); font-size: .95rem; }
            .note {
                margin-top: 1rem;
                padding: .7rem .85rem;
                border-radius: .9rem;
                background: rgba(240, 180, 41, 0.14);
                color: #5d4b0e;
                font-size: .92rem;
                border: 1px solid rgba(240, 180, 41, 0.28);
            }
            @media (max-width: 900px) {
                .grid { grid-template-columns: 1fr; }
            }
            @media (max-width: 640px) {
                .container { width: min(100% - 1.1rem, 1120px); }
                .form-actions .btn { width: 100%; }
            }
        </style>
    </head>
    <body>
        <header class="nav">
            <div class="container nav-inner">
                <a class="brand" href="/">
                    <span class="brand-mark"></span>
                    <span>AgriPool</span>
                </a>
                <div style="display:flex; gap:.7rem;">
                    <a class="btn btn-secondary" href="/register">Create account</a>
                    <a class="btn btn-primary" href="/dashboard">Dashboard</a>
                </div>
            </div>
        </header>

        <main class="page container">
            <div class="grid">
                <section class="card">
                    <div class="kicker">Welcome back</div>
                    <h1>Log in with the same clean AgriPool flow.</h1>
                    <p class="copy">Your Laravel backend is active, while the interface keeps the earlier card-based and easy-reading product style.</p>
                    <div class="note">You can wire this form to Laravel auth controllers next without changing the UI design.</div>
                </section>

                <section class="card">
                    <form method="post" action="#">
                        @csrf
                        <div class="field">
                            <label for="email">Email</label>
                            <input id="email" name="email" type="email" placeholder="farmer@example.com" required>
                        </div>
                        <div class="field">
                            <label for="password">Password</label>
                            <input id="password" name="password" type="password" placeholder="Your password" required>
                        </div>
                        <div class="form-actions">
                            <button class="btn btn-primary" type="submit">Log in</button>
                            <a class="btn btn-secondary" href="/register">Register</a>
                        </div>
                        <p class="meta">Need help? Use Google OAuth and Turnstile verification in your Laravel auth flow.</p>
                    </form>
                </section>
            </div>
        </main>
    </body>
</html>
