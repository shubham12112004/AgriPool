<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Register | {{ config('app.name', 'AgriPool') }}</title>
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
            .page { padding: 3rem 0 4rem; }
            .grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1.2rem;
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
            input, select {
                width: 100%;
                border: 1px solid rgba(15,23,42,.14);
                border-radius: .9rem;
                padding: .8rem .9rem;
                font: inherit;
                background: #fff;
            }
            input:focus, select:focus { outline: 2px solid rgba(31, 143, 95, 0.24); border-color: var(--primary); }
            .form-actions { display: flex; gap: .7rem; margin-top: .7rem; flex-wrap: wrap; }
            .meta { margin-top: .8rem; color: var(--muted); font-size: .95rem; }
            .list {
                margin: .6rem 0 0;
                padding-left: 1rem;
                color: var(--muted);
                line-height: 1.8;
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
                    <a class="btn btn-secondary" href="/login">Log in</a>
                    <a class="btn btn-primary" href="/dashboard">Dashboard</a>
                </div>
            </div>
        </header>

        <main class="page container">
            <div class="grid">
                <section class="card">
                    <div class="kicker">Create account</div>
                    <h1>Start with the same familiar AgriPool onboarding.</h1>
                    <p class="copy">This page stays true to the earlier product look, while Laravel handles routing and future auth logic.</p>
                    <ul class="list">
                        <li>Farmer and driver account setup</li>
                        <li>Language-friendly experience</li>
                        <li>Ready for Google OAuth and verification flow</li>
                    </ul>
                </section>

                <section class="card">
                    <form method="post" action="#">
                        @csrf
                        <div class="field">
                            <label for="name">Full name</label>
                            <input id="name" name="name" type="text" placeholder="Ravi Sharma" required>
                        </div>
                        <div class="field">
                            <label for="email">Email</label>
                            <input id="email" name="email" type="email" placeholder="farmer@example.com" required>
                        </div>
                        <div class="field">
                            <label for="role">Account type</label>
                            <select id="role" name="role">
                                <option value="farmer">Farmer</option>
                                <option value="driver">Driver</option>
                            </select>
                        </div>
                        <div class="field">
                            <label for="password">Password</label>
                            <input id="password" name="password" type="password" placeholder="Choose a password" required>
                        </div>
                        <div class="form-actions">
                            <button class="btn btn-primary" type="submit">Create account</button>
                            <a class="btn btn-secondary" href="/login">Already have an account</a>
                        </div>
                        <p class="meta">This is a Laravel Blade registration view; connect it to auth controllers anytime.</p>
                    </form>
                </section>
            </div>
        </main>
    </body>
</html>
