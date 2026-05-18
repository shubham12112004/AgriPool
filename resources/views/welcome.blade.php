<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'AgriPool') }} | Laravel Platform</title>
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800" rel="stylesheet" />
        <style>
            :root {
                /* darker black-first base with a restrained blue accent */
                --bg: #000000;
                --bg-soft: #07080c;
                --surface: rgba(8, 12, 20, 0.78);
                --surface-strong: rgba(12, 18, 30, 0.94);
                --border: rgba(60, 110, 200, 0.12);
                --text: #eef6ff;
                --muted: #94a6d6;
                --primary: #2b5fbf; /* cooler, not overpowering */
                --accent: #18c2ff; /* small cyan accent */
                --success: #10c8a6;
                --shadow: 0 28px 60px rgba(2, 6, 18, 0.6);
            }
            * { box-sizing: border-box; }
            body {
                margin: 0;
                color: var(--text);
                font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
                background: radial-gradient(circle at 12% -8%, rgba(58,124,255,.45), transparent 32%), radial-gradient(circle at 88% -18%, rgba(36,208,255,.28), transparent 34%), linear-gradient(160deg, #030711 0%, #050d20 45%, #02060f 100%);
                min-height: 100vh;
                overflow-x: hidden;
            }
            .aurora {
                position: fixed;
                inset: -20% -10%;
                background: conic-gradient(from 30deg at 40% 30%, rgba(58,124,255,.0), rgba(58,124,255,.22), rgba(36,208,255,.0), rgba(16,200,166,.2), rgba(58,124,255,.0));
                filter: blur(42px);
                pointer-events: none;
                animation: auroraShift 16s linear infinite;
                z-index: -1;
            }
            @keyframes auroraShift {
                0% { transform: rotate(0deg) scale(1); }
                50% { transform: rotate(180deg) scale(1.08); }
                100% { transform: rotate(360deg) scale(1); }
            }
            .container { width: min(1180px, calc(100% - 2rem)); margin: 0 auto; }
            .nav {
                position: sticky;
                top: 0;
                z-index: 20;
                border-bottom: 1px solid rgba(124, 174, 255, 0.16);
                background: rgba(4, 10, 24, 0.78);
                backdrop-filter: blur(16px);
            }
            .nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .95rem 0; }
            .brand { display: flex; align-items: center; gap: .72rem; font-weight: 800; letter-spacing: .02em; }
            .mark { width: 2.5rem; height: 2.5rem; border-radius: .95rem; background: linear-gradient(140deg, var(--primary), rgba(40,120,190,0.85)); box-shadow: 0 10px 24px rgba(43,95,191,0.28); }
            /* unified button system: compact, balanced, and consistent */
            .btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: .5rem;
                padding: .7rem 1.05rem;
                border-radius: .7rem;
                font-weight: 700;
                border: 1px solid transparent;
                color: var(--text);
                text-decoration: none;
                line-height: 1;
                transition: transform .14s ease, box-shadow .14s ease, background .14s ease, border-color .14s ease;
                cursor: pointer;
            }
            .btn:hover { transform: translateY(-2px); }
            .btn-primary {
                background: linear-gradient(140deg, var(--primary), rgba(40,110,200,0.9));
                color: #eef6ff;
                box-shadow: 0 12px 28px rgba(20,40,80,0.42);
                border-color: rgba(43,95,191,0.12);
            }
            .btn-primary:hover { box-shadow: 0 14px 36px rgba(20,40,80,0.62); }
            .btn-secondary {
                background: transparent;
                border-color: rgba(90,110,150,0.12);
                color: var(--muted);
                transition: all .14s ease;
            }
            .btn-secondary:hover { border-color: rgba(90,110,150,0.3); background: rgba(90,110,150,0.05); }
            .hero { padding: 5rem 0 3rem; }
            .hero-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 1.3rem; align-items: center; }
            .badge { display: inline-flex; align-items: center; gap: .45rem; border: 1px solid rgba(124,174,255,.34); border-radius: 999px; padding: .45rem .75rem; color: #b8cbff; font-size: .9rem; }
            .dot { width: .5rem; height: .5rem; border-radius: 50%; background: var(--success); box-shadow: 0 0 0 .35rem rgba(16, 200, 166, 0.2); }
            h1 { margin: 1rem 0 .9rem; font-size: clamp(2.4rem, 6vw, 5rem); line-height: .94; letter-spacing: -.05em; }
            .lead { color: var(--muted); line-height: 1.75; max-width: 45rem; }
            .hero-actions { margin-top: 1.5rem; display: flex; flex-wrap: wrap; gap: .7rem; }
            .panel { border: 1px solid var(--border); background: var(--surface); border-radius: 1.6rem; box-shadow: var(--shadow); padding: 1.1rem; animation: floatCard 6s ease-in-out infinite; }
            @keyframes floatCard {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: .7rem; margin-top: .9rem; }
            .metric { border: 1px solid rgba(124,174,255,.18); border-radius: 1rem; padding: .75rem; background: var(--surface-strong); }
            .metric strong { font-size: 1.3rem; display: block; }
            .metric span { color: var(--muted); font-size: .86rem; }
            .section { padding: 1rem 0 3.4rem; }
            .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: .85rem; }
            .card { border: 1px solid rgba(124,174,255,.2); border-radius: 1.2rem; padding: 1rem; background: rgba(7, 14, 33, .7); }
            .card h3 { margin: .6rem 0 .45rem; }
            .card p { margin: 0; color: var(--muted); line-height: 1.68; }
            @media (max-width: 960px) { .hero-grid, .cards, .metrics { grid-template-columns: 1fr; } }
        </style>
    </head>
    <body>
        <div class="aurora"></div>
        <header class="nav">
            <div class="container nav-inner">
                <div class="brand"><span class="mark"></span><span>AgriPool</span></div>
                <div style="display:flex; gap:.65rem;">
                    @auth
                        <a class="btn btn-secondary" href="{{ route('dashboard.index') }}">Dashboard</a>
                        <form method="post" action="{{ route('logout') }}">@csrf<button class="btn btn-primary" type="submit">Logout</button></form>
                    @else
                        <a class="btn btn-secondary" href="{{ route('login') }}">Log in</a>
                        <a class="btn btn-primary" href="{{ route('register') }}">Get started</a>
                    @endauth
                </div>
            </div>
        </header>

        <main class="container">
            <section class="hero">
                <div class="hero-grid">
                    <div>
                        <span class="badge"><span class="dot"></span> Laravel backend + real user data</span>
                        <h1>Dark blue and black AgriPool experience is back.</h1>
                        <p class="lead">The UI is now the same dark animated style, while Laravel handles authentication, role-based access, Google OAuth callback flow, Cloudflare Turnstile validation, and real delivery records.</p>
                        <div class="hero-actions">
                            <a class="btn btn-primary" href="{{ route('register') }}">Register</a>
                            <a class="btn btn-secondary" href="{{ route('login') }}">Login</a>
                        </div>
                    </div>
                    <div class="panel">
                        <strong style="font-size:1.1rem;">Realtime platform status</strong>
                        <div style="margin-top:.35rem; color:var(--muted);">Role-aware dashboards with controlled add/delete access.</div>
                        <div class="metrics">
                            <div class="metric"><strong>OAuth</strong><span>Google ready</span></div>
                            <div class="metric"><strong>Captcha</strong><span>Turnstile check</span></div>
                            <div class="metric"><strong>Data</strong><span>SQLite persisted</span></div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="section">
                <div class="cards">
                    <article class="card"><h3>1. Register or login</h3><p>Use email/password or Google OAuth, with Cloudflare verification support in Laravel controllers.</p></article>
                    <article class="card"><h3>2. Choose your role</h3><p>Role selection happens at registration and controls what dashboard and data operations are allowed.</p></article>
                    <article class="card"><h3>3. Work with real data</h3><p>Farmers create/delete own deliveries. Drivers claim/update/delete only deliveries they are assigned to.</p></article>
                </div>
            </section>
        </main>
    </body>
</html>
