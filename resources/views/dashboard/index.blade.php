<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Dashboard | {{ config('app.name', 'AgriPool') }}</title>
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
            .container { width: min(1180px, calc(100% - 2rem)); margin: 0 auto; }
            .nav {
                position: sticky;
                top: 0;
                z-index: 10;
                background: rgba(247, 250, 247, 0.86);
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
                padding: .8rem 1.1rem;
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
            .hero {
                padding: 2.2rem 0 1rem;
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
                margin: .8rem 0;
                font-size: clamp(2rem, 4.4vw, 3.6rem);
                line-height: .96;
                letter-spacing: -.04em;
            }
            .lead { color: var(--muted); max-width: 52rem; line-height: 1.75; }
            .stats {
                margin-top: 1.1rem;
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: .9rem;
            }
            .stat {
                background: rgba(255,255,255,0.92);
                border: 1px solid var(--border);
                border-radius: 1.4rem;
                padding: 1rem;
                box-shadow: 0 10px 30px rgba(9, 34, 24, 0.06);
            }
            .stat strong { font-size: 1.7rem; line-height: 1; display: block; }
            .stat span { color: var(--muted); font-size: .95rem; display: block; margin-top: .35rem; }
            .grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                padding: 1rem 0 3.2rem;
            }
            .card {
                background: rgba(255,255,255,0.92);
                border: 1px solid var(--border);
                border-radius: 1.5rem;
                padding: 1.2rem;
                box-shadow: var(--shadow);
            }
            .card h2 { margin: 0 0 .6rem; font-size: 1.2rem; }
            .card p { margin: 0; color: var(--muted); line-height: 1.7; }
            .actions { margin-top: 1rem; display: flex; gap: .7rem; flex-wrap: wrap; }
            .list {
                margin-top: .9rem;
                display: grid;
                gap: .65rem;
            }
            .row {
                padding: .75rem .9rem;
                border: 1px solid rgba(15,23,42,.08);
                border-radius: .95rem;
                display: flex;
                justify-content: space-between;
                gap: .7rem;
                font-size: .96rem;
            }
            .row small { color: var(--muted); }
            @media (max-width: 960px) {
                .stats { grid-template-columns: repeat(2, 1fr); }
                .grid { grid-template-columns: 1fr; }
            }
            @media (max-width: 640px) {
                .container { width: min(100% - 1.1rem, 1180px); }
                .stats { grid-template-columns: 1fr; }
                .actions .btn { width: 100%; }
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
                    <a class="btn btn-primary" href="/">Home</a>
                </div>
            </div>
        </header>

        <main class="container">
            <section class="hero">
                <div class="kicker">Operations dashboard</div>
                <h1>Keep the old AgriPool experience, now in Laravel.</h1>
                <p class="lead">Choose the workspace you need. The visual style remains the same as before: clean cards, clear actions, and easy scanning for bookings, trips, and payments.</p>
                <div class="stats">
                    <article class="stat"><strong>24</strong><span>Trips today</span></article>
                    <article class="stat"><strong>8</strong><span>Active drivers</span></article>
                    <article class="stat"><strong>18m</strong><span>Average ETA</span></article>
                    <article class="stat"><strong>98%</strong><span>Booking success</span></article>
                </div>
            </section>

            <section class="grid">
                <article class="card">
                    <h2>Farmer dashboard</h2>
                    <p>Create requests, monitor assigned drivers, and confirm delivery milestones.</p>
                    <div class="actions">
                        <a class="btn btn-primary" href="/dashboard/farmer">Open farmer view</a>
                    </div>
                    <div class="list">
                        <div class="row"><span>Create booking</span><small>2-3 steps</small></div>
                        <div class="row"><span>Live tracking panel</span><small>Realtime friendly</small></div>
                        <div class="row"><span>Payment confirmation</span><small>Clear status labels</small></div>
                    </div>
                </article>

                <article class="card">
                    <h2>Driver dashboard</h2>
                    <p>Accept jobs, update trip progress, and finish deliveries with verification.</p>
                    <div class="actions">
                        <a class="btn btn-primary" href="/dashboard/driver">Open driver view</a>
                    </div>
                    <div class="list">
                        <div class="row"><span>Assigned loads</span><small>Queue overview</small></div>
                        <div class="row"><span>Trip checkpoints</span><small>Pickup to drop-off</small></div>
                        <div class="row"><span>Payout readiness</span><small>After completion</small></div>
                    </div>
                </article>
            </section>
        </main>
    </body>
</html>
