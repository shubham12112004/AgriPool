<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'AgriPool') }}</title>
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800" rel="stylesheet" />
        <style>
            :root {
                --bg: #f7faf7;
                --bg-soft: #edf6ef;
                --surface: rgba(255, 255, 255, 0.9);
                --surface-strong: #ffffff;
                --border: rgba(15, 23, 42, 0.08);
                --text: #153026;
                --muted: #547064;
                --primary: #1f8f5f;
                --primary-dark: #156343;
                --accent: #f0b429;
                --shadow: 0 24px 60px rgba(9, 34, 24, 0.12);
            }

            * { box-sizing: border-box; }
            html { scroll-behavior: smooth; }
            body {
                margin: 0;
                font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
                color: var(--text);
                background:
                    radial-gradient(circle at top left, rgba(31, 143, 95, 0.14), transparent 32%),
                    radial-gradient(circle at top right, rgba(240, 180, 41, 0.10), transparent 28%),
                    linear-gradient(180deg, #fbfdfb 0%, #f3f8f4 100%);
            }

            a { color: inherit; text-decoration: none; }
            .shell { position: relative; overflow: hidden; }
            .container { width: min(1180px, calc(100% - 2rem)); margin: 0 auto; }
            .nav {
                position: sticky;
                top: 0;
                z-index: 20;
                backdrop-filter: blur(16px);
                background: rgba(247, 250, 247, 0.8);
                border-bottom: 1px solid rgba(15, 23, 42, 0.06);
            }
            .nav-inner {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                padding: 1rem 0;
            }
            .brand { display: flex; align-items: center; gap: .75rem; font-weight: 800; letter-spacing: .02em; }
            .brand-mark {
                width: 2.5rem;
                height: 2.5rem;
                border-radius: 1rem;
                background: linear-gradient(135deg, var(--primary), #48b27e);
                box-shadow: 0 12px 30px rgba(31, 143, 95, 0.24);
                position: relative;
            }
            .brand-mark::after {
                content: '';
                position: absolute;
                inset: .55rem;
                border-radius: .55rem;
                background: rgba(255, 255, 255, 0.9);
                clip-path: polygon(0 55%, 35% 55%, 35% 0, 65% 0, 65% 55%, 100% 55%, 100% 100%, 0 100%);
            }
            .nav-links { display: flex; align-items: center; gap: 1.25rem; color: var(--muted); font-weight: 500; }
            .nav-actions { display: flex; align-items: center; gap: .75rem; }
            .btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: .5rem;
                padding: .9rem 1.2rem;
                border-radius: 999px;
                font-weight: 700;
                border: 1px solid transparent;
                transition: transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease;
            }
            .btn:hover { transform: translateY(-1px); }
            .btn-primary {
                color: white;
                background: linear-gradient(135deg, var(--primary), #2d9d6d);
                box-shadow: 0 14px 28px rgba(31, 143, 95, 0.18);
            }
            .btn-secondary {
                background: white;
                border-color: rgba(31, 143, 95, 0.12);
                color: var(--primary-dark);
            }
            .hero { padding: 4.5rem 0 3.5rem; }
            .hero-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 2rem; align-items: center; }
            .eyebrow {
                display: inline-flex;
                align-items: center;
                gap: .55rem;
                padding: .55rem .85rem;
                border-radius: 999px;
                background: rgba(31, 143, 95, 0.08);
                color: var(--primary-dark);
                font-size: .95rem;
                font-weight: 700;
            }
            .eyebrow-dot { width: .6rem; height: .6rem; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 .35rem rgba(240, 180, 41, 0.18); }
            h1 { margin: 1rem 0 .9rem; font-size: clamp(3rem, 6vw, 5.4rem); line-height: .95; letter-spacing: -.05em; }
            .lead { max-width: 42rem; font-size: 1.15rem; line-height: 1.75; color: var(--muted); }
            .hero-cta { display: flex; flex-wrap: wrap; gap: .85rem; margin-top: 1.75rem; }
            .hero-panel {
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: 2rem;
                box-shadow: var(--shadow);
                padding: 1.15rem;
            }
            .panel-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
                padding-bottom: .9rem;
                border-bottom: 1px solid rgba(15, 23, 42, 0.06);
            }
            .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: .85rem; margin-top: 1rem; }
            .stat-card {
                background: linear-gradient(180deg, white, rgba(255,255,255,.72));
                border: 1px solid rgba(15, 23, 42, 0.06);
                border-radius: 1.4rem;
                padding: 1rem;
            }
            .stat-label { font-size: .82rem; color: var(--muted); }
            .stat-value { margin-top: .25rem; font-size: 1.5rem; font-weight: 800; }
            .map-art {
                margin-top: 1rem;
                height: 16rem;
                border-radius: 1.4rem;
                position: relative;
                overflow: hidden;
                background:
                    linear-gradient(rgba(31, 143, 95, 0.04) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(31, 143, 95, 0.04) 1px, transparent 1px),
                    linear-gradient(135deg, #eaf6ee, #ffffff 56%, #edf5ef);
                background-size: 28px 28px, 28px 28px, cover;
            }
            .map-line {
                position: absolute;
                left: 12%;
                top: 24%;
                width: 72%;
                height: 52%;
                border: 2px dashed rgba(31, 143, 95, 0.25);
                border-radius: 2rem;
                transform: rotate(-8deg);
            }
            .map-pin {
                position: absolute;
                width: 1rem;
                height: 1rem;
                border-radius: 50%;
                background: var(--primary);
                box-shadow: 0 0 0 .45rem rgba(31, 143, 95, 0.12);
            }
            .pin-a { left: 18%; top: 26%; }
            .pin-b { right: 23%; top: 58%; background: var(--accent); box-shadow: 0 0 0 .45rem rgba(240, 180, 41, 0.15); }
            .section { padding: 1.75rem 0 4rem; }
            .section-head { display: flex; justify-content: space-between; align-items: end; gap: 1rem; margin-bottom: 1.25rem; }
            .section-kicker { color: var(--primary-dark); font-weight: 800; letter-spacing: .18em; font-size: .78rem; text-transform: uppercase; }
            .section-title { margin: .35rem 0 0; font-size: clamp(1.8rem, 3vw, 3rem); line-height: 1.05; }
            .section-copy { margin: 0; max-width: 38rem; color: var(--muted); line-height: 1.7; }
            .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
            .card {
                background: var(--surface-strong);
                border: 1px solid var(--border);
                border-radius: 1.6rem;
                padding: 1.3rem;
                box-shadow: 0 10px 30px rgba(9, 34, 24, 0.05);
            }
            .card-icon {
                width: 3rem;
                height: 3rem;
                border-radius: 1rem;
                display: grid;
                place-items: center;
                background: rgba(31, 143, 95, 0.1);
                color: var(--primary-dark);
                font-size: 1.25rem;
                font-weight: 800;
            }
            .card h3 { margin: 1rem 0 .45rem; font-size: 1.15rem; }
            .card p { margin: 0; color: var(--muted); line-height: 1.7; }
            .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
            .metric {
                text-align: center;
                background: linear-gradient(180deg, rgba(255,255,255,.95), rgba(255,255,255,.72));
                border: 1px solid var(--border);
                border-radius: 1.5rem;
                padding: 1.2rem;
            }
            .metric strong { display: block; font-size: 2rem; line-height: 1; }
            .metric span { display: block; margin-top: .35rem; color: var(--muted); }
            .timeline { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }
            .step {
                background: rgba(255,255,255,0.9);
                border: 1px solid var(--border);
                border-radius: 1.4rem;
                padding: 1.2rem;
            }
            .step-num {
                width: 2.2rem;
                height: 2.2rem;
                border-radius: 50%;
                display: grid;
                place-items: center;
                color: white;
                font-weight: 800;
                background: linear-gradient(135deg, var(--primary), #2d9d6d);
            }
            .quote-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 1rem; }
            .quote {
                background: linear-gradient(180deg, rgba(255,255,255,.96), rgba(255,255,255,.8));
                border: 1px solid var(--border);
                border-radius: 1.6rem;
                padding: 1.35rem;
                box-shadow: 0 12px 30px rgba(9, 34, 24, 0.05);
            }
            .quote p { margin: 0; color: var(--muted); line-height: 1.8; }
            .quote strong { display: block; margin-top: 1rem; }
            .cta {
                margin: 1rem 0 4rem;
                padding: 1.5rem;
                border-radius: 2rem;
                background: linear-gradient(135deg, rgba(31, 143, 95, 0.96), rgba(35, 112, 78, 0.96));
                color: white;
                box-shadow: 0 22px 50px rgba(21, 99, 67, 0.22);
            }
            .cta-inner { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
            .footer { padding: 1.1rem 0 2rem; color: var(--muted); font-size: .95rem; }
            .footer-inner { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; padding-top: 1rem; border-top: 1px solid rgba(15,23,42,0.08); }
            .badge {
                display: inline-flex;
                align-items: center;
                gap: .45rem;
                padding: .5rem .8rem;
                border-radius: 999px;
                background: rgba(31, 143, 95, 0.09);
                color: var(--primary-dark);
                font-weight: 700;
            }
            .badge-dot { width: .5rem; height: .5rem; border-radius: 50%; background: var(--primary); }

            @media (max-width: 960px) {
                .hero-grid, .cards, .metrics, .timeline, .quote-grid, .cta-inner { grid-template-columns: 1fr; display: grid; }
                .nav-links { display: none; }
            }
            @media (max-width: 640px) {
                .hero { padding-top: 3rem; }
                h1 { font-size: clamp(2.4rem, 12vw, 3.6rem); }
                .container { width: min(100% - 1.1rem, 1180px); }
                .nav-actions { width: 100%; }
                .nav-inner { flex-wrap: wrap; }
                .btn { width: 100%; }
                .stat-grid { grid-template-columns: 1fr; }
                .hero-panel { padding: 1rem; }
            }
        </style>
    </head>
    <body>
        <div class="shell">
            <div class="nav">
                <div class="container nav-inner">
                    <a class="brand" href="#top">
                        <span class="brand-mark"></span>
                        <span>AgriPool</span>
                    </a>
                    <div class="nav-links">
                        <a href="#features">Features</a>
                        <a href="#how-it-works">How it works</a>
                        <a href="#stats">Stats</a>
                        <a href="#testimonials">Testimonials</a>
                    </div>
                    <div class="nav-actions">
                        <a class="btn btn-secondary" href="/login">Log in</a>
                        <a class="btn btn-primary" href="/dashboard">Dashboard</a>
                    </div>
                </div>
            </div>

            <main id="top">
                <section class="hero">
                    <div class="container hero-grid">
                        <div>
                            <div class="eyebrow"><span class="eyebrow-dot"></span> Farmer-first logistics platform</div>
                            <h1>Move crops, equipment, and labor with less friction.</h1>
                            <p class="lead">AgriPool connects farmers and transport providers in one calm, easy-to-use flow. The experience stays familiar and clean, with quick booking, live tracking, language-friendly navigation, and a visible Laravel backend underneath.</p>
                            <div class="hero-cta">
                                <a class="btn btn-primary" href="/register">Get started</a>
                                <a class="btn btn-secondary" href="/api/status">Check Laravel status</a>
                            </div>
                            <div style="margin-top:1.5rem; display:flex; flex-wrap:wrap; gap:.7rem;">
                                <span class="badge"><span class="badge-dot"></span> Booking</span>
                                <span class="badge"><span class="badge-dot"></span> Tracking</span>
                                <span class="badge"><span class="badge-dot"></span> Payments</span>
                                <span class="badge"><span class="badge-dot"></span> Google OAuth</span>
                            </div>
                        </div>

                        <div class="hero-panel">
                            <div class="panel-top">
                                <div>
                                    <div style="font-weight:800; font-size:1.05rem;">Live delivery overview</div>
                                    <div style="color:var(--muted); margin-top:.25rem;">Same simple AgriPool flow, now on Laravel</div>
                                </div>
                                <div class="badge"><span class="badge-dot"></span> Live</div>
                            </div>
                            <div class="stat-grid">
                                <div class="stat-card">
                                    <div class="stat-label">Trips today</div>
                                    <div class="stat-value">24</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-label">Active drivers</div>
                                    <div class="stat-value">8</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-label">Avg ETA</div>
                                    <div class="stat-value">18m</div>
                                </div>
                            </div>
                            <div class="map-art" aria-label="delivery overview illustration">
                                <div class="map-line"></div>
                                <div class="map-pin pin-a"></div>
                                <div class="map-pin pin-b"></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features" class="section">
                    <div class="container">
                        <div class="section-head">
                            <div>
                                <div class="section-kicker">Features</div>
                                <h2 class="section-title">Built to feel fast, readable, and familiar.</h2>
                            </div>
                            <p class="section-copy">The layout keeps the earlier product style: bold hero, compact cards, soft surfaces, and clear calls to action.</p>
                        </div>

                        <div class="cards">
                            <article class="card">
                                <div class="card-icon">01</div>
                                <h3>Fast booking flow</h3>
                                <p>Book pickup and drop-off in a few clear steps without overwhelming the user with dense screens.</p>
                            </article>
                            <article class="card">
                                <div class="card-icon">02</div>
                                <h3>Live location tracking</h3>
                                <p>Keep the tracking focus visible so farmers can see where the vehicle is and what is happening next.</p>
                            </article>
                            <article class="card">
                                <div class="card-icon">03</div>
                                <h3>Payments and verification</h3>
                                <p>Use the same clean dashboard surfaces for payments, OAuth, and verification without changing the core UX.</p>
                            </article>
                        </div>
                    </div>
                </section>

                <section id="stats" class="section">
                    <div class="container">
                        <div class="section-head">
                            <div>
                                <div class="section-kicker">Performance</div>
                                <h2 class="section-title">Small numbers, clear outcomes.</h2>
                            </div>
                        </div>
                        <div class="metrics">
                            <div class="metric"><strong>98%</strong><span>booking success rate</span></div>
                            <div class="metric"><strong>18m</strong><span>average delivery ETA</span></div>
                            <div class="metric"><strong>12</strong><span>districts covered</span></div>
                            <div class="metric"><strong>4.9</strong><span>user satisfaction</span></div>
                        </div>
                    </div>
                </section>

                <section id="how-it-works" class="section">
                    <div class="container">
                        <div class="section-head">
                            <div>
                                <div class="section-kicker">How it works</div>
                                <h2 class="section-title">Same product rhythm, cleaner presentation.</h2>
                            </div>
                        </div>
                        <div class="timeline">
                            <div class="step">
                                <div class="step-num">1</div>
                                <h3 style="margin:1rem 0 .5rem;">Create a request</h3>
                                <p style="margin:0; color:var(--muted); line-height:1.7;">Select the crop or load, enter pickup and drop details, and submit in one calm form.</p>
                            </div>
                            <div class="step">
                                <div class="step-num">2</div>
                                <h3 style="margin:1rem 0 .5rem;">Match a driver</h3>
                                <p style="margin:0; color:var(--muted); line-height:1.7;">The dashboard keeps the active delivery and driver information visible while the trip runs.</p>
                            </div>
                            <div class="step">
                                <div class="step-num">3</div>
                                <h3 style="margin:1rem 0 .5rem;">Track and complete</h3>
                                <p style="margin:0; color:var(--muted); line-height:1.7;">Finish with payments, status updates, and a clear completion state the user can trust.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="testimonials" class="section">
                    <div class="container">
                        <div class="section-head">
                            <div>
                                <div class="section-kicker">Testimonials</div>
                                <h2 class="section-title">Designed to stay understandable on first use.</h2>
                            </div>
                        </div>
                        <div class="quote-grid">
                            <div class="quote">
                                <p>“The screen still feels like the earlier AgriPool app: simple, direct, and focused on the booking path instead of heavy admin UI.”</p>
                                <strong>Farmer dashboard user</strong>
                            </div>
                            <div class="quote">
                                <p>“Laravel is visible now, but the product flow still feels like the same application people can learn quickly.”</p>
                                <strong>Operations team</strong>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="container">
                    <div class="cta">
                        <div class="cta-inner">
                            <div>
                                <div style="text-transform:uppercase; letter-spacing:.22em; font-size:.78rem; opacity:.82;">Laravel backend is live</div>
                                <h2 style="margin:.45rem 0 0; font-size:clamp(1.8rem, 3vw, 2.6rem); line-height:1.05;">Ready to keep the old UI feel and move the logic into Laravel?</h2>
                            </div>
                            <div class="nav-actions" style="justify-content:flex-end;">
                                <a class="btn" style="background:white; color:var(--primary-dark);" href="/dashboard">Open dashboard</a>
                                <a class="btn" style="background:rgba(255,255,255,.12); color:white; border-color:rgba(255,255,255,.18);" href="/login">Sign in</a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer class="footer">
                <div class="container footer-inner">
                    <div>AgriPool powered by Laravel.</div>
                    <div><a href="/api/status">API status</a> · <a href="/up">Health</a></div>
                </div>
            </footer>
        </div>
    </body>
</html>