import React from 'react';

export default function MyVoyageUserDashboard() {
  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* SideNavBar Shell */}
<aside className="h-full w-64 fixed left-0 top-0 bg-surface-container-low flex flex-col p-6 gap-4 shadow-md z-40 hidden md:flex" id="sidebar">
{/* Brand Header */}
<div className="mb-8 flex items-center gap-3">
<span className="material-symbols-outlined text-primary text-3xl" data-icon="travel_explore">travel_explore</span>
<span className="font-headline-md text-headline-md text-primary font-bold">Voyage</span>
</div>
{/* User Profile Anchor */}
<div className="flex items-center gap-3 p-3 mb-6 bg-surface-container rounded-xl">
<div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
<img alt="Alex Rivers" className="w-full h-full object-cover" data-alt="A professional and friendly portrait of a young man with a slight smile, set against a blurred urban architectural background. The lighting is soft and natural, emphasizing a high-end corporate lifestyle aesthetic with clean lines and a premium feel. The color palette is composed of soft blues, whites, and subtle indigo tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqjAeG3LYVKWmtlxe9kgJlnDNPHcdqLCer1NA9Pv7TvWhPy5jZQgKcCt_EdDh4ccEoDSu-HKrv0b8X_vpt7hsb5iydhBgORAA-iSZIFIQfyF5JJAPIMynzo_c5vD9GmK_laTihwCgv0-RC_CIut3W91ZljmrmZKwUrT-ya4xIQdX0Mj2AONWGUBJ7dJWnWa0X6fL-j026MezXpZ4OEegmrWrwqLyyU_1Wm6fALY1HkwcHJyA2QXZxaxkpnR6wo2dd-Y6h0KUOwvSlu"/>
</div>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-bold text-on-surface">Alex Rivers</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Gold Member</span>
</div>
</div>
{/* Navigation Tabs */}
<nav className="flex flex-col gap-2 flex-grow">
<a className="bg-primary-container text-on-primary-container rounded-lg font-bold flex items-center gap-3 p-3 active-nav-glow transition-all duration-200" href="#">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span className="font-label-md text-label-md">Dashboard</span>
</a>
<a className="text-on-surface-variant hover:bg-lavender-light rounded-lg flex items-center gap-3 p-3 transition-all duration-200" href="#">
<span className="material-symbols-outlined" data-icon="event_available">event_available</span>
<span className="font-label-md text-label-md">Bookings</span>
</a>
<a className="text-on-surface-variant hover:bg-lavender-light rounded-lg flex items-center gap-3 p-3 transition-all duration-200" href="#">
<span className="material-symbols-outlined" data-icon="military_tech">military_tech</span>
<span className="font-label-md text-label-md">Rewards</span>
</a>
<a className="text-on-surface-variant hover:bg-lavender-light rounded-lg flex items-center gap-3 p-3 transition-all duration-200" href="#">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
<span className="font-label-md text-label-md">Settings</span>
</a>
<a className="text-on-surface-variant hover:bg-lavender-light rounded-lg flex items-center gap-3 p-3 transition-all duration-200" href="#">
<span className="material-symbols-outlined" data-icon="help">help</span>
<span className="font-label-md text-label-md">Support</span>
</a>
</nav>
{/* CTA and Footer */}
<div className="mt-auto flex flex-col gap-4">
<button className="bg-primary text-on-primary font-label-md text-label-md py-3 px-4 rounded-lg shadow-sm hover:brightness-110 active:scale-95 transition-all">
                Book New Trip
            </button>
<a className="text-on-surface-variant hover:text-error flex items-center gap-3 p-3 transition-all" href="#">
<span className="material-symbols-outlined" data-icon="logout">logout</span>
<span className="font-label-md text-label-md">Logout</span>
</a>
</div>
</aside>
{/* Main Content Canvas */}
<main className="md:ml-64 p-margin-mobile md:p-margin-desktop min-h-screen">
{/* Top Navigation (Mobile/Tablet Only) */}
<header className="flex md:hidden items-center justify-between h-16 mb-6">
<span className="font-headline-md text-headline-md font-bold text-primary">Voyage</span>
<button className="p-2 text-on-surface-variant">
<span className="material-symbols-outlined" data-icon="menu">menu</span>
</button>
</header>
<div className="max-w-container-max mx-auto">
{/* Welcome Section */}
<section className="mb-section-gap">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-gutter">
<div>
<h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Welcome back, Alex</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Ready for your next luxury escape?</p>
</div>
<div className="flex gap-3">
<span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-md text-label-md flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]" data-icon="stars" style={{"fontVariationSettings": "'FILL' 1"}}>stars</span>
                            Premier Status
                        </span>
</div>
</div>
{/* Featured Card: Upcoming Trip */}
<div className="relative group overflow-hidden rounded-2xl aspect-[16/9] md:aspect-[21/9] shadow-xl">
<div className="absolute inset-0 bg-gradient-to-t from-deep-indigo/80 via-deep-indigo/20 to-transparent z-10"></div>
<img alt="Luxury Maldives Resort" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" data-alt="A breathtaking view of a luxury overwater villa resort in the Maldives at dusk. The sky is painted with vibrant hues of indigo and lavender, reflecting on the crystal clear turquoise water. Minimalist architectural lines of the villas contrast with the organic shapes of palm trees, creating a serene and aspirational travel atmosphere. The scene is illuminated by soft, warm interior lights from the villas." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPH9n9Iyu1_E629pYa5fjLBR_1lcQYyO_hdCCLxlMylkZJ2dcOkPqWUoaO2G4Pzf-GC1Q5kHMyHs5h7urp1gbPUSHpWs9Rncng1cA0n6Vx_bbH8BKGf3Cjv5WUenWCuDc0I8dm7KwPS-_G1IhEayeKjnRlHBxKVqNrfAkqWxChjhZj96T6RCfujs1kAE_uOUR4Fx_qi4juj_x2odqCppaajPCBcZQPJ8uTzS3gXG4RsxTLQy1Ukrh09uNNQrq3P35kV3PXRKlssfjW"/>
<div className="absolute inset-0 z-20 p-gutter flex flex-col justify-end text-white">
<div className="flex flex-wrap items-center gap-4 mb-4">
<span className="bg-accent-yellow text-on-surface px-3 py-1 rounded-full font-label-md text-label-md">Upcoming Trip</span>
<span className="font-label-md text-label-md flex items-center gap-1">
<span className="material-symbols-outlined text-[18px]" data-icon="calendar_month">calendar_month</span>
                                Oct 12 - Oct 19, 2024
                            </span>
</div>
<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
<div>
<h2 className="font-display-lg text-display-lg mb-2">The Muraka Residence</h2>
<p className="font-body-lg text-body-lg opacity-90">Rangali Island, Maldives</p>
</div>
<button className="bg-white text-primary font-label-md text-label-md py-4 px-8 rounded-xl shadow-lg hover:bg-lavender-light transition-colors active:scale-95">
                                View Full Itinerary
                            </button>
</div>
</div>
</div>
</section>
{/* Grid Layout for Dashboard Sections */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
{/* Left Column: Recent Bookings & Profile Summary */}
<div className="lg:col-span-2 flex flex-col gap-gutter">
{/* Profile Summary Bento Card */}
<div className="bg-surface-container-lowest p-gutter rounded-2xl border border-outline-variant shadow-sm flex flex-col md:flex-row items-center gap-8">
<div className="relative">
<div className="w-24 h-24 rounded-full border-4 border-primary/20 p-1">
<img alt="Alex Rivers" className="w-full h-full object-cover rounded-full" data-alt="Detailed close-up portrait of a professional man with a friendly expression. The lighting is bright and airy, conforming to a modern light-mode design language. Background shows a blurred luxury office or high-end lounge environment with clean, sophisticated textures. Colors are predominantly neutral with pops of indigo and violet in the lighting accents." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKf59LDwuoilNhi7aUaNn3knaKtmYbrIp-2a6KIdnpXVttE09_xU61iMnHRf2TfAeTp2tOg5RBw1ljZ3bUytCg5UQLqiRCt0S1E-nZ72QXfFQjJiRpc7BfF-OorlUAZEZtFYnGuyDiLNtG9uYJuBi8ttoPcJPNXPT1M489IdwfbHCryP__dXEumUN3DYhtLgiJLCTlpqSrcQR9Xvaphvjjqp7WPSmz1kChHOXIFV-Q8Aw4drndk3cFiubY2pArAhqeuJ-mo45NsS7B"/>
</div>
<div className="absolute bottom-0 right-0 bg-primary w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
<span className="material-symbols-outlined text-white text-[16px]" data-icon="edit" style={{"fontVariationSettings": "'FILL' 1"}}>edit</span>
</div>
</div>
<div className="flex-grow text-center md:text-left">
<h3 className="font-headline-md text-headline-md text-on-surface">Alex Rivers</h3>
<p className="text-on-surface-variant mb-4">alex.rivers@premium.travel</p>
<div className="flex flex-wrap justify-center md:justify-start gap-4">
<div className="bg-surface-container-low px-4 py-2 rounded-xl">
<p className="font-body-sm text-body-sm text-on-surface-variant">Lifetime Trips</p>
<p className="font-label-md text-label-md text-primary">24 Destinations</p>
</div>
<div className="bg-surface-container-low px-4 py-2 rounded-xl">
<p className="font-body-sm text-body-sm text-on-surface-variant">Member Since</p>
<p className="font-label-md text-label-md text-primary">April 2021</p>
</div>
</div>
</div>
<div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
<span className="font-display-lg text-primary" style={{"fontSize": "32px"}}>4,280</span>
<span className="font-label-md text-label-md text-primary opacity-80">Points Available</span>
</div>
</div>
{/* Recent Bookings Section */}
<div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
<div className="p-gutter border-b border-outline-variant flex justify-between items-center">
<h3 className="font-headline-md text-headline-md text-on-surface">Recent Bookings</h3>
<a className="text-primary font-label-md text-label-md hover:underline" href="#">View All</a>
</div>
<div className="divide-y divide-outline-variant">
{/* Booking Item 1 */}
<div className="p-6 flex items-center gap-4 hover:bg-lavender-light transition-colors group cursor-pointer">
<div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
<img alt="Ritz Paris" className="w-full h-full object-cover" data-alt="A luxurious facade of a grand historic Parisian hotel with golden wrought-iron balconies and elegant stone architecture. The morning light is soft and warm, reflecting off the clean windows. The style is classic European luxury, using a palette of creams, golds, and subtle blues. A high-end, editorial feel for a travel booking app." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_nWLIEZZKGnALQqS4ZkWr4MEmlQ6AL4CHs0fkdTOn0EDm2piEtXKA4vi54wNxiPxGLga1v2SFABbyAs_CLM8MceZwr6lVHH1XccgA0_b9SwbvGBVXHl4uNlwSpJYUm6ljrb3sarQilWyrqSPv_CpSA2ILQ62U6gvidOTO0aX6mdoWnHvi02vFmQ7P4VSTOSnsU34-9G2B6KKdYsK-X03R-iGES2mqUgLl_PviLa6PgtO9gnkh0gshS6ixsASkHemlznmaw1FWESx4"/>
</div>
<div className="flex-grow">
<div className="flex justify-between items-start">
<h4 className="font-label-md text-label-md text-on-surface">Ritz Paris - Superior Suite</h4>
<span className="text-on-surface font-label-md text-label-md">₦1,240.00</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Paris, France • Sep 04 - Sep 07</p>
<span className="text-[12px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Completed</span>
</div>
<span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform" data-icon="chevron_right">chevron_right</span>
</div>
{/* Booking Item 2 */}
<div className="p-6 flex items-center gap-4 hover:bg-lavender-light transition-colors group cursor-pointer">
<div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
<img alt="Aman Kyoto" className="w-full h-full object-cover" data-alt="Modern Japanese minimalist resort architecture surrounded by a serene moss garden and autumn trees with vibrant orange leaves. The lighting is diffused and calm, typical of a forest retreat. Clean lines, dark wood textures, and a sophisticated atmosphere that evokes tranquility and luxury. High-end modern corporate travel aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpHB1VszaTH_VIhrcz_Hmc_TCv_FV7kDvN8sJlreHM1Eq5sQRLFd_7MjzNqWtg9Sgj5tsO8EAsC3CpjRU9K5jBmw1RYOCjqqgUfQUw3_vLVFXtkVHeLizWMqavLfvoR0eqS_xvHKs7DdSoLRW9RQmF_WdpJPFJZX7Q14HSUg-np9JhaPz6KYA7_DQKNGYsoxL0Ctf3_rt3uORe0AdQevppHgnH75KDlh9Zw4URNrpbEGxD4DGkiMQJtGrqn9C9jCrj4lELwjY8Sby0"/>
</div>
<div className="flex-grow">
<div className="flex justify-between items-start">
<h4 className="font-label-md text-label-md text-on-surface">Aman Kyoto - Forest View</h4>
<span className="text-on-surface font-label-md text-label-md">₦2,850.00</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Kyoto, Japan • Aug 18 - Aug 22</p>
<span className="text-[12px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Completed</span>
</div>
<span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform" data-icon="chevron_right">chevron_right</span>
</div>
</div>
</div>
</div>
{/* Right Column: Quick Actions & Help */}
<div className="flex flex-col gap-gutter">
{/* Quick Actions Card */}
<div className="bg-deep-indigo text-white p-gutter rounded-2xl shadow-lg">
<h3 className="font-headline-md text-headline-md mb-6">Quick Actions</h3>
<div className="flex flex-col gap-3">
<button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-xl flex items-center gap-4 transition-all text-left">
<div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
<span className="material-symbols-outlined" data-icon="download">download</span>
</div>
<div>
<p className="font-label-md text-label-md">Download Invoice</p>
<p className="text-[12px] opacity-70">Last trip: Paris</p>
</div>
</button>
<button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-xl flex items-center gap-4 transition-all text-left">
<div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
<span className="material-symbols-outlined" data-icon="support_agent">support_agent</span>
</div>
<div>
<p className="font-label-md text-label-md">Support</p>
<p className="text-[12px] opacity-70">24/7 Concierge</p>
</div>
</button>
<button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-xl flex items-center gap-4 transition-all text-left">
<div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
<span className="material-symbols-outlined" data-icon="person_edit">person_edit</span>
</div>
<div>
<p className="font-label-md text-label-md">Edit Profile</p>
<p className="text-[12px] opacity-70">Preferences &amp; Security</p>
</div>
</button>
</div>
</div>
{/* Travel Tips / Insights */}
<div className="bg-lavender-light p-gutter rounded-2xl border border-primary/10">
<div className="flex items-center gap-2 mb-4 text-primary">
<span className="material-symbols-outlined" data-icon="lightbulb" style={{"fontVariationSettings": "'FILL' 1"}}>lightbulb</span>
<span className="font-label-md text-label-md uppercase tracking-wider">Travel Insight</span>
</div>
<h4 className="font-label-md text-label-md text-on-surface mb-2">Exclusive Offer for Gold Members</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                            You're eligible for a complimentary spa treatment at any Aman property during your next stay.
                        </p>
<a className="text-primary font-bold text-[14px] flex items-center gap-1 group" href="#">
                            Claim Perk
                            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
</a>
</div>
{/* Referral Program */}
<div className="bg-surface-container-high p-gutter rounded-2xl border border-outline-variant">
<div className="flex flex-col items-center text-center">
<div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
<span className="material-symbols-outlined text-primary" data-icon="card_giftcard">card_giftcard</span>
</div>
<h4 className="font-label-md text-label-md text-on-surface mb-1">Refer a Friend</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Get 500 bonus points for every friend who joins VoyagePremium.</p>
<button className="w-full bg-outline-variant/30 hover:bg-outline-variant/50 text-on-surface font-label-md text-label-md py-2 rounded-lg transition-colors">
                                Invite Friends
                            </button>
</div>
</div>
</div>
</div>
</div>
{/* Footer Shell */}
<footer className="mt-section-gap w-full py-section-gap border-t border-outline-variant">
<div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-8 px-margin-mobile">
<div className="flex flex-col items-center md:items-start">
<span className="font-headline-md text-headline-md font-bold text-primary mb-2">VoyagePremium</span>
<p className="font-body-sm text-body-sm text-on-surface-variant">© 2024 VoyagePremium Luxury Travel. All rights reserved.</p>
</div>
<div className="flex flex-wrap justify-center gap-8">
<a className="text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm" href="#">Privacy Policy</a>
<a className="text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm" href="#">Terms of Service</a>
<a className="text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm" href="#">Cookie Policy</a>
<a className="text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm" href="#">Sustainability</a>
</div>
</div>
</footer>
</main>
{/* Mobile Bottom Navigation (Hidden on Desktop) */}
<nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-glass backdrop-blur-md border-t border-outline-variant flex justify-around p-4 z-50">
<a className="flex flex-col items-center gap-1 text-primary" href="#">
<span className="material-symbols-outlined" data-icon="dashboard" style={{"fontVariationSettings": "'FILL' 1"}}>dashboard</span>
<span className="text-[10px] font-bold">Home</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined" data-icon="event_available">event_available</span>
<span className="text-[10px]">Trips</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined" data-icon="military_tech">military_tech</span>
<span className="text-[10px]">Rewards</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined" data-icon="person">person</span>
<span className="text-[10px]">Profile</span>
</a>
</nav>
{/* Script for Micro-interactions */}
    </div>
  );
}
