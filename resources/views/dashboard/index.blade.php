<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Dashboard | {{ config('app.name', 'AgriPool') }}</title>
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800" rel="stylesheet" />
        <style>
            :root { --text:#eef6ff; --muted:#95a6d8; --primary:#2b5fbf; --accent:#18c2ff; --border:rgba(60,110,200,0.12); }
            * { box-sizing: border-box; }
            body { margin:0; color:var(--text); font-family:'Instrument Sans',ui-sans-serif,system-ui,sans-serif; min-height:100vh; background:radial-gradient(circle at 10% -10%, rgba(58,124,255,.44), transparent 32%), radial-gradient(circle at 90% -15%, rgba(36,208,255,.22), transparent 30%), linear-gradient(160deg, #020711 0%, #07122a 45%, #020610 100%); }
            .container { width:min(1160px, calc(100% - 2rem)); margin:0 auto; }
            .nav { display:flex; justify-content:space-between; gap:1rem; padding:1rem 0; align-items:center; }
            .brand { display:inline-flex; align-items:center; gap:.7rem; font-weight:800; }
            .btn { border:1px solid rgba(60,110,200,.14); border-radius:.8rem; padding:.7rem .95rem; color:#dce7ff; background:rgba(4,10,24,.8); text-decoration:none; font-weight:700; transition:all .2s ease; cursor:pointer; }
            .btn:hover { border-color:rgba(60,110,200,.3); background:rgba(4,10,24,.95); }
            .logout-form { display:contents; }
            .hero { background:rgba(9,18,44,.8); border:1px solid var(--border); border-radius:1.4rem; padding:1.15rem; box-shadow:0 26px 52px rgba(3,8,24,.58); }
            .user-badge { display:inline-flex; align-items:center; gap:.5rem; background:rgba(43,95,191,0.15); border:1px solid rgba(43,95,191,0.3); padding:.5rem .75rem; border-radius:.7rem; font-weight:600; color:#6BA3FF; font-size:.9rem; }
            h1 { margin:.4rem 0 .6rem; font-size:clamp(2rem,4.6vw,3.4rem); line-height:.94; }
            .meta { color:var(--muted); }
            .stats { margin-top:1rem; display:grid; grid-template-columns:repeat(4,1fr); gap:.7rem; }
            .stat { border:1px solid rgba(124,174,255,.2); background:rgba(4,10,24,.72); border-radius:.9rem; padding:.75rem; transition:all .2s ease; }
            .stat:hover { border-color:rgba(124,174,255,.4); background:rgba(4,10,24,.85); }
            .stat strong { display:block; font-size:1.35rem; }
            .grid { margin-top:1rem; display:grid; grid-template-columns:1fr 1fr; gap:.8rem; }
            .card { border:1px solid rgba(124,174,255,.2); background:rgba(9,18,44,.8); border-radius:1.2rem; padding:1rem; transition:all .2s ease; }
            .card:hover { border-color:rgba(124,174,255,.4); }
            .go { margin-top:.8rem; display:inline-block; text-decoration:none; background:linear-gradient(140deg,var(--primary),rgba(40,110,200,0.9)); color:#eef6ff; padding:.62rem .9rem; border-radius:.7rem; font-weight:800; box-shadow:0 10px 22px rgba(10,20,48,0.46); transition:all .2s ease; cursor:pointer; border:none; }
            .go:hover { transform:translateY(-2px); }
            .disabled-msg { padding:.5rem 0; color:var(--muted); font-size:.9rem; }
            @media (max-width: 900px) { .stats, .grid { grid-template-columns:1fr; } }
        </style>
    </head>
    <body>
        <div class="container">
            <header class="nav">
                <a href="/" class="brand" style="text-decoration:none; color:inherit;"><span class="mark"></span><span>AgriPool</span></a>
                <div style="display:flex; align-items:center; gap:1rem;">
                    <div class="user-badge">👤 {{ $user->name }} ({{ strtoupper($user->role) }})</div>
                    <form method="post" action="{{ route('logout') }}" class="logout-form">
                        @csrf
                        <button class="btn" type="submit">Logout</button>
                    </form>
                </div>
            </header>

            <main>
                <section class="hero">
                    <h1>Welcome back, {{ explode(' ', $user->name)[0] }}! 👋</h1>
                    <p class="meta">Role-based dashboards with real data access.</p>
                    <div class="stats">
                        <article class="stat"><strong>{{ $stats['totalTrips'] }}</strong><span>Total trips</span></article>
                        <article class="stat"><strong>{{ $stats['activeTrips'] }}</strong><span>Active trips</span></article>
                        <article class="stat"><strong>{{ $stats['completedTrips'] }}</strong><span>Completed trips</span></article>
                        <article class="stat"><strong>{{ $stats['farmers'] }}</strong><span>Farmers using platform</span></article>
                    </div>
                </section>

                <section class="grid">
                    <article class="card">
                        <h3>🌾 Farmer workspace</h3>
                        <p class="meta">Create and delete your own delivery requests.</p>
                        @if($user->role === 'farmer')
                            <a class="go" href="{{ route('dashboard.farmer') }}">Open Farmer Dashboard</a>
                        @else
                            <p class="disabled-msg">Your account is set to <strong>{{ strtoupper($user->role) }}</strong>. Switch to farmer role to access this workspace.</p>
                        @endif
                    </article>
                    <article class="card">
                        <h3>🚗 Driver workspace</h3>
                        <p class="meta">Claim jobs and update status for your assigned trips.</p>
                        @if($user->role === 'driver')
                            <a class="go" href="{{ route('dashboard.driver') }}">Open Driver Dashboard</a>
                        @else
                            <p class="disabled-msg">Your account is set to <strong>{{ strtoupper($user->role) }}</strong>. Switch to driver role to access this workspace.</p>
                        @endif
                    </article>
                </section>
            </main>
        </div>
    </body>
</html>
