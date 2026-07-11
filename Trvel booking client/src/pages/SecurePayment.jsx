import React from 'react';

export default function SecurePayment() {
  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* TopAppBar */}
<header className="fixed top-0 w-full z-50 bg-surface-glass backdrop-blur-md border-b border-white/20 shadow-sm">
<div className="flex justify-between items-center h-16 px-margin-desktop max-w-container-max mx-auto w-full">
<div className="flex items-center gap-base">
<span className="font-headline-md text-headline-md font-bold text-primary">VoyagePremium</span>
</div>
<nav className="hidden md:flex gap-8 items-center h-full">
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Discover</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Trips</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Stays</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Experiences</a>
</nav>
<div className="flex items-center gap-6">
<button className="material-symbols-outlined text-on-surface-variant hover:bg-lavender-light p-2 rounded-full transition-all">notifications</button>
<button className="material-symbols-outlined text-on-surface-variant hover:bg-lavender-light p-2 rounded-full transition-all">favorite</button>
<div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
<img alt="User Profile" data-alt="A professional headshot of a refined traveler in their late 30s with a warm, confident expression. The background is a soft-focus interior of a premium airport lounge with warm golden lighting and hints of architectural glass. The aesthetic is modern corporate, clean and sophisticated." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx2DM4UTuMSLO5lBgJUjJRyK-ZtCgjF8pg4QqiDeO_VYqvcdASt6ALsGnqn_lkjAiBhamRqxoTZZMfciSJve4k-OszDSmVh3KJ_NuylJriuUTZoIzMPqoLgRTkRXiWoSxNYrTRFomiw5Hlsz9UDWQpYVzuSLY92hYvbBoZ9_2daBS3UyPt0PlVs9lXyC_EO-K17OxwDu4IddtVvp79xg3GYwBgp41Hq0yyuY3Doy0B0tdeJG11Bi9hL1h7NNwUf1D8OuY2yYs8UPae"/>
</div>
</div>
</div>
</header>
<main className="pt-24 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
{/* Left Column: Order Summary (Bento Style) */}
<div className="lg:col-span-5 space-y-gutter">
<h1 className="font-headline-lg text-headline-lg text-deep-indigo">Checkout</h1>
<div className="glass-panel rounded-xl p-6 shadow-sm">
<h2 className="font-label-md text-label-md text-primary mb-4 flex items-center gap-2">
<span className="material-symbols-outlined" style={{"fontVariationSettings": "'FILL' 1"}}>flight_takeoff</span>
                        FLIGHT SUMMARY
                    </h2>
<div className="flex justify-between items-start mb-4">
<div>
<p className="font-headline-md text-headline-md text-on-surface">LHR → JFK</p>
<p className="text-body-sm text-on-surface-variant">British Airways • Premium Economy</p>
</div>
<p className="font-label-md text-label-md">₦1,240.00</p>
</div>
<div className="flex items-center gap-4 py-3 border-y border-outline-variant/30 my-4">
<div className="flex-1">
<p className="text-xs font-bold text-outline uppercase tracking-wider">DEPARTURE</p>
<p className="text-body-md font-medium">Oct 14, 08:30</p>
</div>
<div className="w-px h-8 bg-outline-variant/30"></div>
<div className="flex-1">
<p className="text-xs font-bold text-outline uppercase tracking-wider">DURATION</p>
<p className="text-body-md font-medium">7h 55m</p>
</div>
</div>
</div>
<div className="glass-panel rounded-xl p-6 shadow-sm">
<h2 className="font-label-md text-label-md text-primary mb-4 flex items-center gap-2">
<span className="material-symbols-outlined" style={{"fontVariationSettings": "'FILL' 1"}}>hotel</span>
                        STAY SUMMARY
                    </h2>
<div className="flex gap-4">
<img className="w-20 h-20 rounded-lg object-cover" data-alt="The exterior of a luxury Manhattan hotel at twilight with glowing warm lights from the floor-to-ceiling windows. The building features sleek modern architecture and is surrounded by the iconic New York City skyline. The lighting is moody and cinematic with a high-end editorial feel." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZDQa9OJtTDrg5b26zXUQ0GLhSP7ougwL0sPDUOqe_fvUUWzFAWQcOndujEOYyEGqEAIDdrDZHq3lL4ofu9yTCkl0I0IymTyHD1uVocZArF36AOGkvlmCg6kUyiohqu1ynZAw6jY85aRcLWY-TsvCdMpfYucCsNRjGIb6ZdYJTSh_DF2TMW9fNX8wrrqS6Qi8QVth3ijSRdc8e_T1uQh0nERjGFHuUmZSeqav1JMadMJzhc7zrkIOvy5FiEVxVOprVosFVspOWEL65"/>
<div className="flex-1">
<p className="font-headline-md text-headline-md text-on-surface">The Ritz-Carlton</p>
<p className="text-body-sm text-on-surface-variant">Manhattan Central Park • 4 Nights</p>
<p className="text-label-md text-primary mt-2">₦2,150.00</p>
</div>
</div>
</div>
<div className="bg-surface-container-high rounded-xl p-6">
<div className="space-y-3 mb-4">
<div className="flex justify-between text-body-md text-on-surface-variant">
<span>Subtotal</span>
<span>₦3,390.00</span>
</div>
<div className="flex justify-between text-body-md text-on-surface-variant">
<span>Service &amp; Processing Fees</span>
<span>₦45.50</span>
</div>
<div className="flex justify-between text-body-md text-on-surface-variant">
<span>Taxes</span>
<span>₦122.40</span>
</div>
</div>
<div className="border-t border-outline-variant pt-4 flex justify-between items-center">
<span className="font-headline-md text-headline-md text-deep-indigo">Total</span>
<span className="font-headline-md text-headline-md text-primary">₦3,557.90</span>
</div>
</div>
</div>
{/* Right Column: Payment Form */}
<div className="lg:col-span-7">
<div className="bg-white rounded-xl p-8 shadow-md border border-outline-variant/20">
<div className="flex justify-between items-center mb-8">
<h2 className="font-headline-lg text-headline-lg text-on-surface">Payment Details</h2>
<div className="flex gap-2">
<img alt="PayPal" className="h-6 opacity-60" data-alt="A clean, flat vector logo of PayPal in its corporate blue and light blue colors. The image is presented on a transparent background with a professional, minimal tech aesthetic for a checkout interface." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQ-KKxqayWj49FPzMYPdtNAlF7Qgwd6sMeby6c-vKlrbyKIdtwrRHHeo6c5iMGFdxIMNSQbCC9VnpznXcoMRn6TCzw5C8Dlxl2g4QZJItJxrzdxO4l1VBH2qrhanjz1XTYhVnE9JvOnWskWRC9_CSZGVt9B5OemALEQh4MxsjlspBWgsXm2PnDexkG-jVUDsVkC9LToWd7qTV5l7pUFQbVIBXqs6B-7VL6eoyZxDnRS8AfoKQ6QUKpSArzvWhvPb1X7m5DS4TavWEp"/>
<img alt="Visa" className="h-6 opacity-60" data-alt="The official Visa logo with its classic dark blue and golden yellow font. The design is crisp and clean, suitable for a high-end financial transaction display on a modern travel website." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCx49iPdd-5dePKbYs3PymO0alAlDb_sWwRdQZplw6tVIJhO0L1Fyo32B_X4-R4fV-TXOHMr5qStrUni6QwgsiS5aQeoJYfLIxT2tDcqGwnNQWI_I4rEV8HOYXqYpEvHf4iEj_DM9grZozjWZBQ2BV-pNRAaZ3sOXhQpIRAhFzogHgc52cI--bfPHdGZyv4GzkuGKpeCIwDcM3H3XJv_fEJGG0Vu1w-xJ_XGY0ESazw7Ne_djGi2GYjBPYKRG_w2tIzAk8WiMOGggNh"/>
<img alt="Mastercard" className="h-6 opacity-60" data-alt="The Mastercard interlocking red and yellow circles logo, rendered as a high-quality vector. The colors are vibrant and the design is minimalist, perfect for representing secure payment processing on a premium UI." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGMP_P5kAFVi5g7EEWPxGAYAOpDvSZWpyjwtYAkYujOPlb3Y8-Zok7OXIF8GXLzsHWSTdSSSy9V3bUcR9yJ_8fHib5iCp5PaAMjYeWFX5e0KY5GIfOBp-hiHNUpnmsWD--UX3RRe30yXEMfhFE5_vEU2-Oal8YBHcLSg2i4ytTIQ6xojb_5G6ykXR05ILxsaqlwTioAF2kt1sSwAeYyslQS6dJeXZ3bCSaf-UpWMj5I3adIiX8aaWq_FVDsFvL1VnP0XIRaiyB8yyi"/>
</div>
</div>
<form className="space-y-6" id="payment-form">
<div className="space-y-2">
<label className="font-label-md text-label-md text-on-surface-variant uppercase">Cardholder Name</label>
<input className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest payment-input transition-all outline-none text-body-md font-medium" placeholder="ALEX RIVERS" required="" type="text"/>
</div>
<div className="space-y-2">
<label className="font-label-md text-label-md text-on-surface-variant uppercase">Card Number</label>
<div className="relative">
<input className="w-full pl-4 pr-12 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest payment-input transition-all outline-none text-body-md font-medium tracking-widest" id="card-number" placeholder="0000 0000 0000 0000" required="" type="text"/>
<span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant">credit_card</span>
</div>
</div>
<div className="grid grid-cols-2 gap-gutter">
<div className="space-y-2">
<label className="font-label-md text-label-md text-on-surface-variant uppercase">Expiry Date</label>
<input className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest payment-input transition-all outline-none text-body-md font-medium" placeholder="MM / YY" required="" type="text"/>
</div>
<div className="space-y-2 relative">
<label className="font-label-md text-label-md text-on-surface-variant uppercase">CVV</label>
<div className="relative">
<input className="w-full pl-4 pr-12 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest payment-input transition-all outline-none text-body-md font-medium" maxlength="3" placeholder="***" required="" type="password"/>
<span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant cursor-help" title="3-digit code on the back of your card">info</span>
</div>
</div>
</div>
<div className="pt-4">
<button className="w-full bg-primary hover:bg-primary-container text-white py-4 rounded-xl font-headline-md text-headline-md shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3" type="submit">
<span className="material-symbols-outlined" style={{"fontVariationSettings": "'FILL' 1"}}>lock</span>
                                Pay Securely ₦3,557.90
                            </button>
</div>
</form>
<div className="mt-8 pt-8 border-t border-outline-variant/30 flex flex-wrap justify-center gap-8 items-center grayscale opacity-50">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-body-lg">verified_user</span>
<span className="font-label-md text-xs">PCI DSS COMPLIANT</span>
</div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-body-lg">encrypted</span>
<span className="font-label-md text-xs">256-BIT ENCRYPTION</span>
</div>
<div className="flex items-center gap-2">
<img alt="Powered by Paystack" className="h-4" data-alt="The Paystack corporate logo with its distinctive blue typography. It is presented on a clean background to signify a trusted financial partnership for transaction processing. The image reflects modern African fintech excellence and security." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMKCuOxz8rak9bMqgohztEjPgD2ismUeP0t41hn2n4fb33E5w1YkvrpSnUrVbdT66s16IGKxm4MW499EG4WbD6C7XcpJG4aRdev6NHiYuSDPc7OCdb1zHEaf4yChBJjqwUPsml4HL6YiRKHlCSA0idowiIezp0-2ZY3UW6IvrVWxqn4pCk4_xz2bquB6FcRxLRzsxH00oHPBvj1s2CduGLog4qOlnOu0Az1EmTc62_ZKZ8FmvothB6ycgQJsKoc7j6TCpCs3xjeFX5"/>
</div>
</div>
</div>
<p className="mt-6 text-center text-body-sm text-on-surface-variant max-w-lg mx-auto">
                    By clicking "Pay Securely", you agree to VoyagePremium's Terms of Service and Privacy Policy. Your booking will be confirmed immediately after successful payment.
                </p>
</div>
</div>
</main>
{/* Footer */}
<footer className="w-full relative bottom-0 bg-surface-container-highest border-t border-outline-variant">
<div className="py-section-gap px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
<div>
<span className="font-headline-md text-headline-md font-bold text-primary">VoyagePremium</span>
<p className="text-body-sm text-on-surface-variant mt-2 max-w-xs">Elevating your travel experience through sophisticated luxury and seamless logistics.</p>
</div>
<div className="flex flex-wrap justify-center gap-8">
<a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
<a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Cookie Policy</a>
<a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Sustainability</a>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant opacity-80">© 2024 VoyagePremium Luxury Travel. All rights reserved.</p>
</div>
</footer>
{/* Payment Overlay / Interaction Script */}
    </div>
  );
}
