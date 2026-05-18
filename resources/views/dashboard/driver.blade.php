<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Driver Dashboard | {{ config('app.name', 'AgriPool') }}</title>
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800" rel="stylesheet" />
        <style>
            :root { --text:#eef6ff; --muted:#95a6d8; --primary:#2b5fbf; --accent:#18c2ff; --border:rgba(60,110,200,0.12); }
            * { box-sizing: border-box; }
            body { margin:0; color:var(--text); font-family:'Instrument Sans',ui-sans-serif,system-ui,sans-serif; min-height:100vh; background: radial-gradient(circle at 10% -10%, rgba(43,95,191,0.12), transparent 32%), radial-gradient(circle at 90% -15%, rgba(24,194,255,0.06), transparent 30%), linear-gradient(160deg, #000000 0%, #07080c 45%, #000000 100%); }
            .container { width:min(1160px, calc(100% - 2rem)); margin:0 auto; }
            .top { display:flex; justify-content:space-between; gap:1rem; padding:1rem 0; align-items:center; }
            .brand { display:inline-flex; align-items:center; gap:.7rem; font-weight:800; }
            .mark { width:2.3rem; height:2.3rem; border-radius:.9rem; background:linear-gradient(140deg,var(--primary),var(--accent)); }
            .btn { border:1px solid rgba(60,110,200,.14); border-radius:.8rem; padding:.68rem .95rem; color:#dce7ff; background:rgba(4,10,24,.8); text-decoration:none; font-weight:700; transition:all .2s ease; cursor:pointer; }
            .btn:hover { border-color:rgba(60,110,200,.3); background:rgba(4,10,24,.95); }
            .grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
            .card { background:rgba(8,12,20,.86); border:1px solid var(--border); border-radius:1.2rem; padding:1rem; box-shadow:0 22px 46px rgba(2,6,18,.62); }
            .item { border:1px solid rgba(60,110,200,.08); border-radius:.9rem; padding:.75rem; margin-bottom:.65rem; background:rgba(6,10,18,.5); transition:all .2s ease; }
            .item:hover { border-color:rgba(60,110,200,.2); background:rgba(6,10,18,.7); }
            .muted { color:var(--muted); font-size:.9rem; }
            .row { display:flex; justify-content:space-between; gap:.7rem; align-items:center; flex-wrap:wrap; }
            .status-badge { display:inline-block; padding:.35rem .6rem; border-radius:.5rem; font-size:.8rem; font-weight:700; text-transform:uppercase; letter-spacing:.02em; }
            .status-pending { background:rgba(255,149,0,0.2); color:#FFB84D; }
            .status-assigned { background:rgba(43,95,191,0.2); color:#6BA3FF; }
            .status-in_transit { background:rgba(255,107,107,0.2); color:#FF9999; }
            .status-completed { background:rgba(16,200,166,0.2); color:#58FFD1; }
            .action { border:none; border-radius:.7rem; padding:.45rem .66rem; font-weight:700; cursor:pointer; background:linear-gradient(140deg,var(--primary),rgba(40,110,200,0.9)); color:#eef6ff; box-shadow:0 8px 18px rgba(10,20,48,0.42); transition:all .2s ease; }
            .action:hover { transform:translateY(-2px); }
            .danger { border:1px solid rgba(255,116,150,.4); color:#ffc8d9; background:rgba(81,16,35,.34); border-radius:.7rem; padding:.45rem .66rem; font-weight:700; cursor:pointer; transition:all .2s ease; }
            .danger:hover { background:rgba(81,16,35,.5); }
            .success-msg { margin-bottom:.8rem; padding:.75rem .85rem; border-radius:.8rem; background:rgba(16,200,166,0.15); border:1px solid rgba(16,200,166,0.3); color:#58FFD1; font-size:.95rem; }
            .error-msg { margin-bottom:.8rem; padding:.75rem .85rem; border-radius:.8rem; background:rgba(255,107,107,0.15); border:1px solid rgba(255,107,107,0.3); color:#FF9999; font-size:.95rem; }
            select { border:1px solid rgba(60,110,200,.12); border-radius:.66rem; padding:.42rem .6rem; background:rgba(6,10,18,.6); color:#e7efff; transition:all .2s ease; }
            select:hover, select:focus { border-color:rgba(60,110,200,.3); background:rgba(6,10,18,.8); outline:none; }
            @media (max-width: 900px) { .grid { grid-template-columns:1fr; } }
        </style>
    </head>
    <body>
        <div class="container">
            <header class="top">
                <a href="{{ route('dashboard.index') }}" class="brand" style="text-decoration:none; color:inherit;"><span class="mark"></span><span>AgriPool</span></a>
                <div style="display:flex; gap:.6rem;">
                    <a class="btn" href="{{ route('dashboard.index') }}">← Back</a>
                    <form method="post" action="{{ route('logout') }}" style="display:contents;">@csrf <button class="btn" type="submit">Logout</button></form>
                </div>
            </header>

            @if(session('status')) <div class="success-msg">✓ {{ session('status') }}</div> @endif
            @if($errors->any()) <div class="error-msg">@foreach($errors->all() as $e)<div>• {{ $e }}</div>@endforeach</div> @endif

            <main class="grid">
                <section class="card">
                    <h2>Available Jobs</h2>
                    <p class="muted">Claim pending deliveries from farmers.</p>
                    @forelse($available as $delivery)
                        <article class="item">
                            <div class="row">
                                <strong>{{ $delivery->title }}</strong>
                                <span class="status-badge status-{{ str_replace('_', '_', $delivery->status) }}">{{ str_replace('_', ' ', strtoupper($delivery->status)) }}</span>
                            </div>
                            <div class="muted" style="margin-top:.4rem;">{{ $delivery->pickup_location }} → {{ $delivery->dropoff_location }}</div>
                            <div class="muted">From: {{ $delivery->farmer?->name }}</div>
                            <div class="muted">Posted: {{ $delivery->created_at->format('M d, H:i') }}</div>
                            <form method="post" action="{{ route('deliveries.claim', $delivery) }}" style="margin-top:.55rem;">
                                @csrf
                                <button class="action" type="submit">📍 Claim Delivery</button>
                            </form>
                        </article>
                    @empty
                        <div class="item muted">No pending deliveries available.</div>
                    @endforelse
                </section>

                <section class="card">
                    <h2>Your Assigned Trips</h2>
                    <p class="muted">Update status or delete only your assigned records.</p>
                    @forelse($assigned as $delivery)
                        <article class="item">
                            <div class="row">
                                <strong>{{ $delivery->title }}</strong>
                                <span class="status-badge status-{{ str_replace('_', '_', $delivery->status) }}">{{ str_replace('_', ' ', strtoupper($delivery->status)) }}</span>
                            </div>
                            <div class="muted" style="margin-top:.4rem;">{{ $delivery->pickup_location }} → {{ $delivery->dropoff_location }}</div>
                            <div class="muted">From: {{ $delivery->farmer?->name }}</div>
                            <div class="muted">Claimed: {{ $delivery->updated_at->format('M d, H:i') }}</div>
                            <div style="display:flex; gap:.55rem; margin-top:.55rem; flex-wrap:wrap;">
                                <form method="post" action="{{ route('deliveries.status', $delivery) }}" style="display:flex; gap:.45rem;">
                                    @csrf
                                    <select name="status">
                                        <option value="assigned" @selected($delivery->status === 'assigned')>Assigned</option>
                                        <option value="in_transit" @selected($delivery->status === 'in_transit')>In Transit</option>
                                        <option value="completed" @selected($delivery->status === 'completed')>Completed</option>
                                    </select>
                                    <button class="action" type="submit">Save</button>
                                </form>
                                <form method="post" action="{{ route('deliveries.destroy', $delivery) }}">
                                    @csrf
                                    @method('delete')
                                    <button class="danger" type="submit" onclick="return confirm('Are you sure?')">Delete</button>
                                </form>
                            </div>
                        </article>
                    @empty
                        <div class="item muted">No assigned trips yet.</div>
                    @endforelse
                </section>
            </main>
        </div>
    </body>
</html>
