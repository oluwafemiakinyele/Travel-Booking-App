import React from 'react';

export default function AdminAnalytics() {
  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* Sidebar Navigation */}
<aside className="h-full w-64 fixed left-0 top-0 bg-surface-container-low dark:bg-surface-container-highest shadow-md flex flex-col p-6 gap-4 z-40">
<div className="mb-8">
<h1 className="font-headline-md text-headline-md text-primary font-bold">VoyagePremium</h1>
</div>
<div className="flex items-center gap-3 mb-6 p-2">
<img alt="Traveler Profile" className="w-10 h-10 rounded-full object-cover" data-alt="A professional headshot of a sophisticated male executive in his 30s with a warm, confident expression. He is wearing a tailored navy blazer against a softly blurred urban office background. The lighting is clean and professional, matching a premium corporate dashboard aesthetic with cool blue and neutral gray tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU3T9IfQ5SZ2oNSyckKhPlA4I3H1rAv7nf5d2ns-7k97U3Aud2dDmFxdriDYHVXuHPb8c1IRGeUjsNdErHIwTBVBVwZUKFxlZsL6nm0zPEoQkFIP2xtzwuaNHzhpFzD7hQjOzTeqOSwXd2Qwaxl69YmMkKfsmE26U9dqYsBD_QISzyWZ-2TTyo_alE2M1uET-I1nvjZNKLj8xKZQcIUKNviI8euK0P08wt-4oCanC5ZriQ5RcNknuXRKVS-YQ1gfg63ek84C-3Xr8o" />
<div>
<p className="font-label-md text-label-md text-on-surface font-bold">Alex Rivers</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Gold Member</p>
</div>
</div>
<nav className="flex-1 flex flex-col gap-2">
{/* Dashboard (Active) */}
<a className="flex items-center gap-3 px-4 py-3 bg-primary-container dark:bg-primary-fixed-variant text-on-primary-container dark:text-on-primary-fixed-variant rounded-lg font-bold transition-all duration-200 ease-in-out" href="#">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span className="font-label-md text-label-md">Dashboard</span>
</a>
{/* Bookings */}
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-lavender-light dark:hover:bg-surface-variant rounded-lg transition-all duration-200 ease-in-out" href="#">
<span className="material-symbols-outlined" data-icon="event_available">event_available</span>
<span className="font-label-md text-label-md">Bookings</span>
</a>
{/* Rewards */}
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-lavender-light dark:hover:bg-surface-variant rounded-lg transition-all duration-200 ease-in-out" href="#">
<span className="material-symbols-outlined" data-icon="military_tech">military_tech</span>
<span className="font-label-md text-label-md">Rewards</span>
</a>
{/* Settings */}
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-lavender-light dark:hover:bg-surface-variant rounded-lg transition-all duration-200 ease-in-out" href="#">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
<span className="font-label-md text-label-md">Settings</span>
</a>
{/* Support */}
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-lavender-light dark:hover:bg-surface-variant rounded-lg transition-all duration-200 ease-in-out" href="#">
<span className="material-symbols-outlined" data-icon="help">help</span>
<span className="font-label-md text-label-md">Support</span>
</a>
</nav>
<button className="mt-4 bg-primary text-on-primary py-3 rounded-xl font-label-md text-label-md shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
            Book New Trip
        </button>
<div className="mt-auto border-t border-outline-variant pt-4">
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-error transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="logout">logout</span>
<span className="font-label-md text-label-md">Logout</span>
</a>
</div>
</aside>
{/* Main Content Canvas */}
<main className="ml-64 min-h-screen">
{/* Top Header */}
<header className="h-16 px-8 flex justify-between items-center bg-surface-glass backdrop-blur-md sticky top-0 z-30 border-b border-outline-variant/30">
<div className="flex items-center gap-4">
<h2 className="font-headline-md text-headline-md font-bold text-on-surface">Overview</h2>
</div>
<div className="flex items-center gap-6">
<div className="relative flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/50 w-80">
<span className="material-symbols-outlined text-outline" data-icon="search">search</span>
<input className="bg-transparent border-none focus:ring-0 text-body-sm w-full" placeholder="Search analytics..." type="text" />
</div>
<div className="flex items-center gap-4">
<button className="relative p-2 text-on-surface-variant hover:bg-lavender-light rounded-full transition-colors">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
</button>
<button className="p-2 text-on-surface-variant hover:bg-lavender-light rounded-full transition-colors">
<span className="material-symbols-outlined" data-icon="favorite">favorite</span>
</button>
<div className="h-8 w-px bg-outline-variant"></div>
<img alt="User profile avatar" className="w-8 h-8 rounded-full border-2 border-primary/20" data-alt="A professional headshot of a sophisticated male executive in his 30s with a warm, confident expression. He is wearing a tailored navy blazer against a softly blurred urban office background. The lighting is clean and professional, matching a premium corporate dashboard aesthetic with cool blue and neutral gray tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw6cMSixdsD_YvPzp7MOsNol1JlnszuHiA-ZyOQet6b2fxuRHl2bhiPlTiw40G7RM-CojnaWoNYUPev4ly3ihrLPrl7qRX8sAqtl4O7rKzxyXTeEedNo0fzjzF_7UqjaW23zxr6F2n9ylRPAe84hWzVmZ6OFEK_v-dAyZiUUv6O8I2I78KwZM0r3pVVolbYx13YoYqYxNXJiHJHAgNKSfVpgK3cOTWJMoJi7s17mx8meC1YG7HXOH9W6slOyeWbfOnWf5Bww5lI_zt" />
</div>
</div>
</header>
{/* Dashboard Body */}
<div className="p-8 max-w-[1400px] mx-auto">
{/* Stats Bento Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter">
{/* Revenue Card */}
<div className="glass-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-primary/10 rounded-lg text-primary">
<span className="material-symbols-outlined" data-icon="payments">payments</span>
</div>
<span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+12.5%</span>
</div>
<p className="font-label-md text-label-md text-on-surface-variant mb-1">Total Revenue</p>
<h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">₦128,430</h3>
<div className="mt-4 h-8 flex items-end gap-1">
<div className="flex-1 bg-primary/20 h-3 rounded-full group-hover:bg-primary/40 transition-colors"></div>
<div className="flex-1 bg-primary/20 h-5 rounded-full group-hover:bg-primary/40 transition-colors"></div>
<div className="flex-1 bg-primary/20 h-4 rounded-full group-hover:bg-primary/40 transition-colors"></div>
<div className="flex-1 bg-primary h-6 rounded-full"></div>
<div className="flex-1 bg-primary/20 h-2 rounded-full group-hover:bg-primary/40 transition-colors"></div>
</div>
</div>
{/* Bookings Card */}
<div className="glass-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-secondary-container rounded-lg text-deep-indigo">
<span className="material-symbols-outlined" data-icon="confirmation_number">confirmation_number</span>
</div>
<span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+8.2%</span>
</div>
<p className="font-label-md text-label-md text-on-surface-variant mb-1">Total Bookings</p>
<h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">1,240</h3>
<div className="mt-4 h-8 flex items-end gap-1">
<div className="flex-1 bg-secondary-container/50 h-4 rounded-full"></div>
<div className="flex-1 bg-secondary-container/50 h-3 rounded-full"></div>
<div className="flex-1 bg-secondary-container h-6 rounded-full"></div>
<div className="flex-1 bg-secondary-container/50 h-5 rounded-full"></div>
<div className="flex-1 bg-secondary-container/50 h-4 rounded-full"></div>
</div>
</div>
{/* Users Card */}
<div className="glass-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-tertiary-fixed rounded-lg text-tertiary">
<span className="material-symbols-outlined" data-icon="group">group</span>
</div>
<span className="text-xs font-bold text-primary bg-primary-fixed px-2 py-1 rounded">+5.1%</span>
</div>
<p className="font-label-md text-label-md text-on-surface-variant mb-1">Active Users</p>
<h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">8,642</h3>
<div className="mt-4 h-8 flex items-end gap-1">
<div className="flex-1 bg-tertiary-fixed h-5 rounded-full"></div>
<div className="flex-1 bg-tertiary-fixed h-4 rounded-full"></div>
<div className="flex-1 bg-tertiary-fixed h-6 rounded-full"></div>
<div className="flex-1 bg-tertiary-fixed h-3 rounded-full"></div>
<div className="flex-1 bg-tertiary-fixed h-5 rounded-full"></div>
</div>
</div>
{/* Hotels Card */}
<div className="glass-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-accent-yellow/10 rounded-lg text-accent-yellow">
<span className="material-symbols-outlined" data-icon="hotel" data-weight="fill">hotel</span>
</div>
<span className="text-xs font-bold text-on-surface-variant bg-surface-container px-2 py-1 rounded">Stable</span>
</div>
<p className="font-label-md text-label-md text-on-surface-variant mb-1">Partner Hotels</p>
<h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">458</h3>
<div className="mt-4 h-8 flex items-end gap-1">
<div className="flex-1 bg-accent-yellow/20 h-2 rounded-full"></div>
<div className="flex-1 bg-accent-yellow/20 h-3 rounded-full"></div>
<div className="flex-1 bg-accent-yellow/20 h-4 rounded-full"></div>
<div className="flex-1 bg-accent-yellow/20 h-5 rounded-full"></div>
<div className="flex-1 bg-accent-yellow h-6 rounded-full"></div>
</div>
</div>
</div>
{/* Revenue Analytics Main Chart */}
<div className="glass-card p-8 rounded-3xl shadow-sm mb-gutter">
<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
<div>
<h4 className="font-headline-md text-headline-md font-bold text-on-surface">Revenue Analytics</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Monthly performance vs target benchmarks</p>
</div>
<div className="flex bg-surface-container-low p-1 rounded-xl">
<button className="px-4 py-2 bg-white rounded-lg shadow-sm font-label-md text-label-md text-primary">Monthly</button>
<button className="px-4 py-2 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">Quarterly</button>
<button className="px-4 py-2 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">Yearly</button>
</div>
</div>
<div className="chart-container relative overflow-hidden rounded-xl border border-outline-variant/30 flex items-end justify-between px-10 pb-8">
{/* Background Grid lines */}
<div className="absolute inset-0 flex flex-col justify-between py-8 px-4 pointer-events-none opacity-20">
<div className="border-b border-outline"></div>
<div className="border-b border-outline"></div>
<div className="border-b border-outline"></div>
<div className="border-b border-outline"></div>
</div>
{/* Simplified SVG Line Chart */}
<svg className="absolute inset-0 w-full h-full p-8 overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 300">
<defs>
<linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stop-color="#4648d4" stop-opacity="0.3"></stop>
<stop offset="100%" stop-color="#4648d4" stop-opacity="0"></stop>
</linearGradient>
</defs>
<path d="M0,250 Q100,180 200,200 T400,100 T600,150 T800,50 T1000,80 L1000,300 L0,300 Z" fill="url(#chartGradient)"></path>
<path d="M0,250 Q100,180 200,200 T400,100 T600,150 T800,50 T1000,80" fill="none" stroke="#4648d4" strokeLinecap="round" strokeWidth="4"></path>
<circle className="animate-pulse" cx="200" cy="200" fill="#4648d4" r="6"></circle>
<circle className="animate-pulse" cx="400" cy="100" fill="#4648d4" r="6"></circle>
<circle className="animate-pulse" cx="800" cy="50" fill="#4648d4" r="6"></circle>
</svg>
{/* X-Axis Labels */}
<div className="absolute bottom-2 left-0 w-full flex justify-between px-10">
<span className="text-xs font-label-md text-outline">Jan</span>
<span className="text-xs font-label-md text-outline">Feb</span>
<span className="text-xs font-label-md text-outline">Mar</span>
<span className="text-xs font-label-md text-outline">Apr</span>
<span className="text-xs font-label-md text-outline">May</span>
<span className="text-xs font-label-md text-outline">Jun</span>
<span className="text-xs font-label-md text-outline">Jul</span>
<span className="text-xs font-label-md text-outline">Aug</span>
</div>
</div>
</div>
{/* Recent Transactions Table */}
<div className="glass-card rounded-3xl overflow-hidden shadow-sm">
<div className="p-8 border-b border-outline-variant/30 flex justify-between items-center">
<h4 className="font-headline-md text-headline-md font-bold text-on-surface">Recent Transactions</h4>
<button className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline">
                        View All <span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span>
</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead className="bg-surface-container-low">
<tr>
<th className="px-8 py-4 font-label-md text-label-md text-on-surface-variant">Customer</th>
<th className="px-8 py-4 font-label-md text-label-md text-on-surface-variant">Destination</th>
<th className="px-8 py-4 font-label-md text-label-md text-on-surface-variant">Date</th>
<th className="px-8 py-4 font-label-md text-label-md text-on-surface-variant">Amount</th>
<th className="px-8 py-4 font-label-md text-label-md text-on-surface-variant">Status</th>
<th className="px-8 py-4 font-label-md text-label-md text-on-surface-variant">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/20">
<tr className="hover:bg-lavender-light/30 transition-colors">
<td className="px-8 py-6">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">JD</div>
<div>
<p className="font-label-md text-label-md text-on-surface">Julianne Devis</p>
<p className="text-xs text-on-surface-variant">julianne.d@voyage.com</p>
</div>
</div>
</td>
<td className="px-8 py-6 font-body-sm text-body-sm">Santorini, Greece</td>
<td className="px-8 py-6 font-body-sm text-body-sm text-on-surface-variant">Oct 24, 2024</td>
<td className="px-8 py-6 font-bold text-on-surface">₦2,450.00</td>
<td className="px-8 py-6">
<span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Paid</span>
</td>
<td className="px-8 py-6">
<button className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
<tr className="hover:bg-lavender-light/30 transition-colors">
<td className="px-8 py-6">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary font-bold">MK</div>
<div>
<p className="font-label-md text-label-md text-on-surface">Marcus Knight</p>
<p className="text-xs text-on-surface-variant">m.knight@travel.org</p>
</div>
</div>
</td>
<td className="px-8 py-6 font-body-sm text-body-sm">Kyoto, Japan</td>
<td className="px-8 py-6 font-body-sm text-body-sm text-on-surface-variant">Oct 22, 2024</td>
<td className="px-8 py-6 font-bold text-on-surface">₦1,890.00</td>
<td className="px-8 py-6">
<span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Pending</span>
</td>
<td className="px-8 py-6">
<button className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
<tr className="hover:bg-lavender-light/30 transition-colors">
<td className="px-8 py-6">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-deep-indigo font-bold">SL</div>
<div>
<p className="font-label-md text-label-md text-on-surface">Sophia Liao</p>
<p className="text-xs text-on-surface-variant">sophia@agency.com</p>
</div>
</div>
</td>
<td className="px-8 py-6 font-body-sm text-body-sm">Amalfi Coast, Italy</td>
<td className="px-8 py-6 font-body-sm text-body-sm text-on-surface-variant">Oct 20, 2024</td>
<td className="px-8 py-6 font-bold text-on-surface">₦3,120.00</td>
<td className="px-8 py-6">
<span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Paid</span>
</td>
<td className="px-8 py-6">
<button className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
<tr className="hover:bg-lavender-light/30 transition-colors">
<td className="px-8 py-6">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-on-error-container font-bold">BW</div>
<div>
<p className="font-label-md text-label-md text-on-surface">Ben Wallace</p>
<p className="text-xs text-on-surface-variant">ben.w@wallace.net</p>
</div>
</div>
</td>
<td className="px-8 py-6 font-body-sm text-body-sm">Aspen, Colorado</td>
<td className="px-8 py-6 font-body-sm text-body-sm text-on-surface-variant">Oct 18, 2024</td>
<td className="px-8 py-6 font-bold text-on-surface">₦850.00</td>
<td className="px-8 py-6">
<span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">Refunded</span>
</td>
<td className="px-8 py-6">
<button className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
{/* Footer Section */}
<footer className="mt-section-gap py-base border-t border-outline-variant flex flex-col md:flex-row justify-between items-center text-on-surface-variant">
<p className="font-body-sm text-body-sm">© 2024 VoyagePremium Luxury Travel. All rights reserved.</p>
<div className="flex gap-gutter mt-4 md:mt-0">
<a className="font-body-sm text-body-sm hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a className="font-body-sm text-body-sm hover:text-primary transition-colors" href="#">Terms of Service</a>
<a className="font-body-sm text-body-sm hover:text-primary transition-colors" href="#">Sustainability</a>
</div>
</footer>
</div>
</main>
{/* Micro-interaction Scripts */}
    </div>
  );
}
