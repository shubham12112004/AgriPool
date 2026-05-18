<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'AgriPool') }} | Modern Platform</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800|outfit:300,400,500,600,700,800" rel="stylesheet" />
    
    <!-- Vite Assets -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-[#02060f] text-[#eef6ff] font-['Instrument_Sans'] antialiased min-h-screen overflow-x-hidden selection:bg-[#18c2ff]/30">
    
    <!-- Aurora Background -->
    <div class="fixed inset-[-30%] z-[-1] animate-[var(--animate-aurora)] opacity-50 blur-[90px] pointer-events-none" 
         style="background: conic-gradient(from 30deg at 40% 30%, rgba(58,124,255,0), rgba(58,124,255,0.25), rgba(36,208,255,0), rgba(16,200,166,0.25), rgba(58,124,255,0));">
    </div>

    <!-- Additional Ambient Glows -->
    <div class="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
    <div class="absolute top-1/3 right-1/4 w-[30rem] h-[30rem] bg-emerald-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

    <!-- Navbar -->
    <nav class="sticky top-0 z-50 backdrop-blur-xl bg-[#040a18]/70 border-b border-[#3c6ec8]/10 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-20">
                <!-- Brand -->
                <div class="flex-shrink-0 flex items-center gap-3 group cursor-pointer">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2b5fbf] to-[#18c2ff] shadow-[0_0_20px_rgba(43,95,191,0.4)] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <span class="font-['Outfit'] font-bold text-2xl tracking-tight text-white group-hover:text-glow transition-all">AgriPool</span>
                </div>

                <!-- Auth Buttons -->
                <div class="hidden md:flex items-center gap-4">
                    @auth
                        <a href="{{ route('dashboard.index') }}" class="px-5 py-2.5 rounded-xl font-semibold text-[#94a6d6] hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300">Dashboard</a>
                        <form method="post" action="{{ route('logout') }}" class="inline">
                            @csrf
                            <button type="submit" class="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-[#2b5fbf] to-[#18c2ff] text-white shadow-[0_0_20px_rgba(24,194,255,0.3)] hover:shadow-[0_0_30px_rgba(24,194,255,0.5)] hover:-translate-y-0.5 transition-all duration-300">Logout</button>
                        </form>
                    @else
                        <a href="{{ route('login') }}" class="px-5 py-2.5 rounded-xl font-semibold text-[#94a6d6] hover:text-white hover:bg-white/5 transition-all duration-300">Log in</a>
                        <a href="{{ route('register') }}" class="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-[#2b5fbf] to-[#10c8a6] text-white shadow-[0_0_20px_rgba(16,200,166,0.3)] hover:shadow-[0_0_30px_rgba(16,200,166,0.5)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
                            <span class="relative z-10">Get started free</span>
                            <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                        </a>
                    @endauth
                </div>

                <!-- Mobile Menu Button -->
                <div class="md:hidden flex items-center">
                    <button class="text-[#94a6d6] hover:text-white focus:outline-none">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <main>
        <!-- Hero Section -->
        <section class="relative pt-24 pb-32 overflow-hidden">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid lg:grid-cols-2 gap-16 items-center">
                    <!-- Left: Text -->
                    <div class="fade-up-element z-10">
                        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#18c2ff]/30 bg-[#18c2ff]/10 mb-8 backdrop-blur-sm">
                            <span class="w-2 h-2 rounded-full bg-[#10c8a6] animate-pulse shadow-[0_0_10px_#10c8a6]"></span>
                            <span class="text-sm font-medium text-[#18c2ff]">Now powered by Laravel & Realtime Tech</span>
                        </div>
                        <h1 class="text-5xl lg:text-7xl font-['Outfit'] font-extrabold tracking-tight leading-[1.1] mb-6">
                            Next-gen <br/>
                            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#10c8a6] via-[#18c2ff] to-[#2b5fbf] animate-gradient-x">Agriculture</span> <br/>
                            Logistics.
                        </h1>
                        <p class="text-lg text-[#94a6d6] mb-10 max-w-xl leading-relaxed">
                            Connect farmers, drivers, and heavy machinery instantly. Built for scale with enterprise-grade Laravel auth, role-based dashboards, and seamless delivery tracking.
                        </p>
                        <div class="flex flex-wrap gap-4">
                            <a href="{{ route('register') }}" class="px-8 py-4 rounded-xl font-bold bg-white text-[#02060f] hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:-translate-y-1 transition-all duration-300">Start Platform</a>
                            <a href="#how-it-works" class="px-8 py-4 rounded-xl font-bold border border-[#3c6ec8]/30 bg-[#0c121e]/50 backdrop-blur-md text-white hover:bg-[#3c6ec8]/20 transition-all duration-300 flex items-center gap-2 group">
                                See how it works 
                                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </a>
                        </div>
                    </div>

                    <!-- Right: Visual Container (Infinite Scroll) -->
                    <div class="relative h-[500px] w-full rounded-3xl border border-[#3c6ec8]/20 bg-[#080c14]/40 backdrop-blur-xl overflow-hidden shadow-[0_28px_60px_rgba(2,6,18,0.8)] fade-up-element group">
                        <!-- Glass shine effect -->
                        <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-20"></div>
                        
                        <!-- Floating Icons in bg -->
                        <div class="absolute top-10 right-10 z-10 animate-[var(--animate-float)] opacity-60">
                            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-[#10c8a6]/20 to-transparent border border-[#10c8a6]/40 flex items-center justify-center backdrop-blur-md">
                                <svg class="w-8 h-8 text-[#10c8a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                        </div>

                        <!-- Infinite Carousel -->
                        <div class="absolute top-0 bottom-0 flex gap-4 items-center px-4 w-[200%] animate-[var(--animate-scroll)] group-hover:[animation-play-state:paused]">
                            <!-- Mock agriculture images -->
                            <div class="w-[280px] h-[360px] flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                                <img src="https://images.unsplash.com/photo-1592982537447-6f2334208f34?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover" alt="Tractor">
                                <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                                    <div class="text-[#10c8a6] text-xs font-bold mb-1">AVAILABLE NOW</div>
                                    <div class="text-white font-semibold">John Deere 8R</div>
                                </div>
                            </div>
                            <div class="w-[280px] h-[360px] flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                                <img src="https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover" alt="Harvester">
                                <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                                    <div class="text-[#18c2ff] text-xs font-bold mb-1">EN ROUTE</div>
                                    <div class="text-white font-semibold">Wheat Harvester</div>
                                </div>
                            </div>
                            <div class="w-[280px] h-[360px] flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                                <img src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover" alt="Farm">
                                <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                                    <div class="text-[#10c8a6] text-xs font-bold mb-1">COMPLETED</div>
                                    <div class="text-white font-semibold">Crop Delivery</div>
                                </div>
                            </div>
                            <!-- Duplicates for seamless loop -->
                            <div class="w-[280px] h-[360px] flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                                <img src="https://images.unsplash.com/photo-1592982537447-6f2334208f34?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover" alt="Tractor">
                                <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                                    <div class="text-[#10c8a6] text-xs font-bold mb-1">AVAILABLE NOW</div>
                                    <div class="text-white font-semibold">John Deere 8R</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Live Stats Section -->
        <section class="py-12 border-y border-[#3c6ec8]/10 bg-[#040a18]/40 relative z-10">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center fade-up-element">
                    <div class="p-6">
                        <div class="text-4xl md:text-5xl font-bold text-white mb-2 count-up-element text-glow" data-target="15200" data-suffix="+">0</div>
                        <div class="text-[#94a6d6] font-medium uppercase tracking-wider text-sm">Active Farmers</div>
                    </div>
                    <div class="p-6">
                        <div class="text-4xl md:text-5xl font-bold text-white mb-2 count-up-element text-glow" data-target="8400" data-suffix="+">0</div>
                        <div class="text-[#94a6d6] font-medium uppercase tracking-wider text-sm">Verified Drivers</div>
                    </div>
                    <div class="p-6">
                        <div class="text-4xl md:text-5xl font-bold text-white mb-2 count-up-element text-glow" data-target="45" data-suffix="k">0</div>
                        <div class="text-[#94a6d6] font-medium uppercase tracking-wider text-sm">Deliveries Done</div>
                    </div>
                    <div class="p-6">
                        <div class="text-4xl md:text-5xl font-bold text-white mb-2 count-up-element text-glow" data-target="99" data-suffix="%">0</div>
                        <div class="text-[#94a6d6] font-medium uppercase tracking-wider text-sm">Success Rate</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- How It Works Section -->
        <section id="how-it-works" class="py-24 relative z-10">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16 fade-up-element">
                    <h2 class="text-3xl md:text-5xl font-bold mb-4">Seamless Workflow</h2>
                    <p class="text-[#94a6d6] max-w-2xl mx-auto text-lg">Role-based architecture ensures the right people see the right data.</p>
                </div>

                <div class="grid md:grid-cols-3 gap-8 relative">
                    <!-- Connecting Line -->
                    <div class="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#3c6ec8]/30 to-transparent -translate-y-1/2 z-0"></div>

                    <!-- Step 1 -->
                    <div class="glass-panel p-8 rounded-3xl relative z-10 hover:-translate-y-2 transition-transform duration-300 fade-up-element">
                        <div class="w-14 h-14 rounded-full bg-[#2b5fbf]/20 border border-[#2b5fbf]/50 flex items-center justify-center text-2xl font-bold text-[#18c2ff] mb-6 shadow-[0_0_15px_rgba(43,95,191,0.5)]">1</div>
                        <h3 class="text-xl font-bold mb-3 text-white">Register & Authenticate</h3>
                        <p class="text-[#94a6d6] leading-relaxed">Secure login using email or Google OAuth. Protected by Cloudflare Turnstile to prevent bots.</p>
                    </div>

                    <!-- Step 2 -->
                    <div class="glass-panel p-8 rounded-3xl relative z-10 hover:-translate-y-2 transition-transform duration-300 fade-up-element" style="transition-delay: 100ms">
                        <div class="w-14 h-14 rounded-full bg-[#10c8a6]/20 border border-[#10c8a6]/50 flex items-center justify-center text-2xl font-bold text-[#10c8a6] mb-6 shadow-[0_0_15px_rgba(16,200,166,0.5)]">2</div>
                        <h3 class="text-xl font-bold mb-3 text-white">Choose Your Role</h3>
                        <p class="text-[#94a6d6] leading-relaxed">Select Farmer or Driver. Your role strictly defines your dashboard views and database permissions.</p>
                    </div>

                    <!-- Step 3 -->
                    <div class="glass-panel p-8 rounded-3xl relative z-10 hover:-translate-y-2 transition-transform duration-300 fade-up-element" style="transition-delay: 200ms">
                        <div class="w-14 h-14 rounded-full bg-[#18c2ff]/20 border border-[#18c2ff]/50 flex items-center justify-center text-2xl font-bold text-[#18c2ff] mb-6 shadow-[0_0_15px_rgba(24,194,255,0.5)]">3</div>
                        <h3 class="text-xl font-bold mb-3 text-white">Manage Deliveries</h3>
                        <p class="text-[#94a6d6] leading-relaxed">Farmers create load requests. Drivers claim and transport them. All tracked persistently via SQLite.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features (Existing mapped to new UI) -->
        <section class="py-24 bg-gradient-to-b from-transparent to-[#040a18] relative z-10">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="mb-16 fade-up-element">
                    <h2 class="text-3xl md:text-5xl font-bold mb-4">Enterprise Core</h2>
                    <p class="text-[#94a6d6] max-w-2xl text-lg">Under the hood, AgriPool relies on a robust Laravel foundation.</p>
                </div>

                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="p-8 rounded-3xl bg-[#080c14] border border-[#3c6ec8]/20 hover:border-[#10c8a6]/50 transition-colors duration-300 group fade-up-element">
                        <div class="w-12 h-12 rounded-lg bg-[#10c8a6]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg class="w-6 h-6 text-[#10c8a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </div>
                        <h3 class="text-xl font-bold mb-3">Secure Auth System</h3>
                        <p class="text-[#94a6d6]">Robust session management and Google OAuth integration out-of-the-box.</p>
                    </div>

                    <div class="p-8 rounded-3xl bg-[#080c14] border border-[#3c6ec8]/20 hover:border-[#18c2ff]/50 transition-colors duration-300 group fade-up-element">
                        <div class="w-12 h-12 rounded-lg bg-[#18c2ff]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg class="w-6 h-6 text-[#18c2ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        </div>
                        <h3 class="text-xl font-bold mb-3">Turnstile Validation</h3>
                        <p class="text-[#94a6d6]">Invisible, privacy-first bot protection integrated directly into form requests.</p>
                    </div>

                    <div class="p-8 rounded-3xl bg-[#080c14] border border-[#3c6ec8]/20 hover:border-[#2b5fbf]/50 transition-colors duration-300 group fade-up-element">
                        <div class="w-12 h-12 rounded-lg bg-[#2b5fbf]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg class="w-6 h-6 text-[#2b5fbf]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                        </div>
                        <h3 class="text-xl font-bold mb-3">Persistent Storage</h3>
                        <p class="text-[#94a6d6]">Fast, reliable SQLite database handling user profiles and delivery state tracking.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Mock Map / App Preview -->
        <section class="py-24 relative z-10 overflow-hidden">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="glass-panel rounded-[2.5rem] p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12 fade-up-element relative">
                    <div class="lg:w-1/2 relative z-10">
                        <h2 class="text-3xl md:text-5xl font-bold mb-6">Realtime Fleet Tracking</h2>
                        <p class="text-[#94a6d6] text-lg mb-8 leading-relaxed">
                            Watch your crops move from farm to facility in real-time. Our interactive mapping ensures you always know exactly where your assets are and when they'll arrive.
                        </p>
                        <a href="{{ route('register') }}" class="inline-flex items-center gap-2 text-[#10c8a6] font-bold hover:text-white transition-colors group">
                            Explore Dashboard
                            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </a>
                    </div>
                    
                    <div class="lg:w-1/2 w-full h-[400px] rounded-3xl overflow-hidden relative border border-white/10 shadow-[0_0_40px_rgba(16,200,166,0.15)] group">
                        <!-- Abstract Map Visual -->
                        <div class="absolute inset-0 bg-[#080c14] flex items-center justify-center">
                            <!-- Grid lines -->
                            <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                            
                            <!-- Mock Pins -->
                            <div class="absolute top-1/3 left-1/4 animate-bounce">
                                <div class="w-4 h-4 bg-[#10c8a6] rounded-full shadow-[0_0_15px_#10c8a6]"></div>
                            </div>
                            <div class="absolute bottom-1/3 right-1/3 animate-bounce" style="animation-delay: 200ms">
                                <div class="w-4 h-4 bg-[#18c2ff] rounded-full shadow-[0_0_15px_#18c2ff]"></div>
                            </div>
                            
                            <!-- Connecting Line (SVG) -->
                            <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                <path d="M 25% 33% Q 50% 10% 66% 66%" fill="none" stroke="rgba(24,194,255,0.4)" stroke-width="2" stroke-dasharray="5,5" class="animate-[dash_20s_linear_infinite]" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-32 relative z-10 text-center">
            <div class="max-w-3xl mx-auto px-4 fade-up-element">
                <h2 class="text-4xl md:text-6xl font-bold mb-6 text-white">Ready to modernize your agriculture logistics?</h2>
                <p class="text-xl text-[#94a6d6] mb-10">Join thousands of farmers and drivers already using AgriPool.</p>
                <a href="{{ route('register') }}" class="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-[#10c8a6] to-[#18c2ff] text-white text-lg shadow-[0_0_30px_rgba(16,200,166,0.4)] hover:shadow-[0_0_50px_rgba(16,200,166,0.6)] hover:-translate-y-1 transition-all duration-300">
                    Create free account
                </a>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-[#3c6ec8]/10 bg-[#02060f] pt-16 pb-8 relative z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2b5fbf] to-[#18c2ff] flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <span class="font-['Outfit'] font-bold text-xl text-white">AgriPool</span>
            </div>
            <div class="text-[#94a6d6] text-sm">
                &copy; {{ date('Y') }} AgriPool Platform. All rights reserved. Built with Laravel.
            </div>
        </div>
    </footer>
</body>
</html>

