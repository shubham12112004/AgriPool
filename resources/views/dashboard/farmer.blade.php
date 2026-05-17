<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Farmer Dashboard | {{ config('app.name', 'AgriPool') }}</title>
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800" rel="stylesheet" />
        <style>
            :root {
                --border: rgba(15, 23, 42, 0.08);
                --text: #153026;
                --muted: #547064;
                --primary: #1f8f5f;
                --primary-dark: #156343;
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
            }
            .container { width: min(1180px, calc(100% - 2rem)); margin: 0 auto; }
            .nav { position: sticky; top: 0; background: rgba(247, 250, 247, 0.86); border-bottom: 1px solid rgba(15, 23, 42, 0.06); backdrop-filter: blur(16px); }
            .nav-inner { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; gap: 1rem; }
            .brand { display: flex; gap: .75rem; align-items: center; font-weight: 800; text-decoration: none; color: inherit; }
            .brand-mark { width: 2.5rem; height: 2.5rem; border-radius: 1rem; background: linear-gradient(135deg, var(--primary), #48b27e); box-shadow: 0 12px 30px rgba(31, 143, 95, 0.24); }
            .btn { padding: .75rem 1.05rem; border-radius: 999px; border: 1px solid transparent; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; }
            .btn-primary { background: linear-gradient(135deg, var(--primary), #2d9d6d); color: #fff; box-shadow: 0 14px 28px rgba(31, 143, 95, 0.18); }
            .btn-secondary { background: #fff; border-color: rgba(31, 143, 95, 0.12); color: var(--primary-dark); }
            .hero { padding: 2rem 0 1rem; }
            h1 { margin: .5rem 0; font-size: clamp(2rem, 4.5vw, 3.2rem); line-height: .96; letter-spacing: -.04em; }
            .lead { color: var(--muted); line-height: 1.7; }
            .grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 1rem; padding-bottom: 3rem; }
            .card { background: rgba(255,255,255,.92); border: 1px solid var(--border); border-radius: 1.4rem; box-shadow: var(--shadow); padding: 1.1rem; }
            .card h2 { margin: 0 0 .7rem; font-size: 1.15rem; }
            .list { display: grid; gap: .6rem; }
            .row { border: 1px solid rgba(15,23,42,.08); border-radius: .9rem; padding: .75rem .85rem; display: flex; justify-content: space-between; gap: .7rem; }
            .row small { color: var(--muted); }
            @media (max-width: 960px) { .grid { grid-template-columns: 1fr; } }
            @media (max-width: 640px) { .container { width: min(100% - 1.1rem, 1180px); } .btn { width: 100%; } }
        </style>
    </head>
    <body>
        <header class="nav">
            <div class="container nav-inner">
                <a class="brand" href="/dashboard"><span class="brand-mark"></span><span>AgriPool Farmer</span></a>
                <div style="display:flex; gap:.7rem; flex-wrap:wrap;">
                    <a class="btn btn-secondary" href="/dashboard">All dashboards</a>
                    <a class="btn btn-primary" href="/">Home</a>
                </div>
            </div>
        </header>

        <main class="container">
            <section class="hero">
                <h1>Farmer panel with the same old AgriPool UX.</h1>
                <p class="lead">Track load requests, assigned vehicles, and completion states in the same familiar card layout.</p>
            </section>
            <section class="grid">
                <article class="card">
                    <h2>Open requests</h2>
                    <div class="list">
                        <div class="row"><span>Wheat pickup - Bhopal</span><small>Pending match</small></div>
                        <div class="row"><span>Rice transport - Sehore</span><small>Driver assigned</small></div>
                        <div class="row"><span>Equipment move - Vidisha</span><small>In transit</small></div>
                    </div>
                </article>
                <article class="card">
                    <h2>Quick actions</h2>
                    <div class="list">
                        <div class="row"><span>Create new booking</span><small>Start</small></div>
                        <div class="row"><span>Open tracking board</span><small>Live</small></div>
                        <div class="row"><span>Review payment status</span><small>Secure</small></div>
                    </div>
                </article>
            </section>
        </main>
    </body>
</html>
