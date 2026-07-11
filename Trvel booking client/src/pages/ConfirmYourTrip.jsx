import React from 'react';

export default function ConfirmYourTrip() {
  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* TopNavBar */}
<header className="fixed top-0 w-full z-50 bg-surface-glass dark:bg-surface-dim backdrop-blur-md border-b border-white/20 dark:border-outline-variant shadow-sm dark:shadow-none">
<div className="flex justify-between items-center h-16 px-margin-desktop max-w-container-max mx-auto w-full">
<div className="flex items-center gap-base">
<span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">VoyagePremium</span>
</div>
<nav className="hidden md:flex items-center gap-8 font-body-md text-body-md font-label-md text-label-md">
<a className="text-on-surface-variant dark:text-surface-variant hover:text-primary transition-colors" href="#">Discover</a>
<a className="text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed pb-1" href="#">Trips</a>
<a className="text-on-surface-variant dark:text-surface-variant hover:text-primary transition-colors" href="#">Stays</a>
<a className="text-on-surface-variant dark:text-surface-variant hover:text-primary transition-colors" href="#">Experiences</a>
</nav>
<div className="flex items-center gap-4">
<button className="material-symbols-outlined p-2 text-on-surface-variant hover:bg-lavender-light rounded-full transition-colors" data-icon="notifications">notifications</button>
<button className="material-symbols-outlined p-2 text-on-surface-variant hover:bg-lavender-light rounded-full transition-colors" data-icon="favorite">favorite</button>
<div className="w-8 h-8 rounded-full overflow-hidden bg-surface-variant border border-outline-variant">
<img alt="User profile avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAuTcxFqPgxfQcchkPYFFRyma8xL1o_zpsFhnnoU-DgHEeXwcy1xQatP4HFNTkFiqyHXqcdjX9Zfp2yEm3gpdX0OH_18n10tNlRQcrGiR0n7qkPd3l0nhazcKe0EDpWwN69Qdg65aJKFvNiagxSZXbdI8yG1lPK7hVG-rPfOsDd91g7O_3lHVrGzyFP-Z4mGI9tlHQgmoRIb9_caMMJSsyxiybG6NIMUyWjilVKSTvJlb6aW52n4o81eHeCpep9u9QtogoLF4UuHuX" />
</div>
</div>
</div>
</header>
<main className="pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
{/* Breadcrumbs / Checkout Progress */}
<div className="flex items-center gap-4 mb-12">
<div className="flex items-center gap-2 text-primary font-bold">
<span className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-sm">1</span>
<span className="text-label-md">Traveler Details</span>
</div>
<div className="h-px w-12 bg-outline-variant"></div>
<div className="flex items-center gap-2 text-on-surface-variant opacity-60">
<span className="w-8 h-8 rounded-full border-2 border-outline-variant flex items-center justify-center text-sm">2</span>
<span className="text-label-md">Payment</span>
</div>
<div className="h-px w-12 bg-outline-variant"></div>
<div className="flex items-center gap-2 text-on-surface-variant opacity-60">
<span className="w-8 h-8 rounded-full border-2 border-outline-variant flex items-center justify-center text-sm">3</span>
<span className="text-label-md">Confirmation</span>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
{/* Left Column: Forms */}
<div className="lg:col-span-8 space-y-gutter">
{/* Traveler Information */}
<section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/30">
<h2 className="font-headline-lg text-headline-lg text-deep-indigo mb-6">Traveler Information</h2>
<form className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="text-label-md text-on-surface-variant block">First Name</label>
<input className="w-full px-4 py-3 rounded-lg bg-surface-container border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="e.g. Alex" type="text" />
</div>
<div className="space-y-2">
<label className="text-label-md text-on-surface-variant block">Last Name</label>
<input className="w-full px-4 py-3 rounded-lg bg-surface-container border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="e.g. Rivers" type="text" />
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="text-label-md text-on-surface-variant block">Email Address</label>
<input className="w-full px-4 py-3 rounded-lg bg-surface-container border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="alex.rivers@premium.com" type="email" />
</div>
<div className="space-y-2">
<label className="text-label-md text-on-surface-variant block">Phone Number</label>
<input className="w-full px-4 py-3 rounded-lg bg-surface-container border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="+1 (555) 000-0000" type="tel" />
</div>
</div>
</form>
</section>
{/* Passport Details (Optional for high-end feel) */}
<section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/30">
<div className="flex items-center justify-between mb-6">
<h2 className="font-headline-lg text-headline-lg text-deep-indigo">Passport Information</h2>
<span className="text-body-sm text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">Required for International</span>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="space-y-2">
<label className="text-label-md text-on-surface-variant block">Passport Number</label>
<input className="w-full px-4 py-3 rounded-lg bg-surface-container border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all" type="text" />
</div>
<div className="space-y-2">
<label className="text-label-md text-on-surface-variant block">Nationality</label>
<select className="w-full px-4 py-3 rounded-lg bg-surface-container border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all">
<option>United States</option>
<option>United Kingdom</option>
<option>Canada</option>
<option>Australia</option>
</select>
</div>
<div className="space-y-2">
<label className="text-label-md text-on-surface-variant block">Expiry Date</label>
<input className="w-full px-4 py-3 rounded-lg bg-surface-container border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all" type="date" />
</div>
</div>
</section>
{/* Special Requests */}
<section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/30">
<h2 className="font-headline-lg text-headline-lg text-deep-indigo mb-6">Special Requests</h2>
<div className="space-y-4">
<div className="flex flex-wrap gap-3 mb-4">
<button className="px-4 py-2 rounded-full border border-primary text-primary bg-lavender-light font-label-md transition-all hover:bg-primary-container hover:text-white">High Floor</button>
<button className="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label-md hover:border-primary hover:text-primary transition-all">Quiet Room</button>
<button className="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label-md hover:border-primary hover:text-primary transition-all">Early Check-in</button>
<button className="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label-md hover:border-primary hover:text-primary transition-all">Allergy Sensitive</button>
</div>
<textarea className="w-full h-32 px-4 py-3 rounded-lg bg-surface-container border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all resize-none" placeholder="Tell us about any specific dietary requirements, accessibility needs, or celebrations..."></textarea>
</div>
</section>
</div>
{/* Right Column: Summary Sticky */}
<div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
{/* Trip Summary Card */}
<div className="bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 overflow-hidden">
<div className="relative h-48">
<img className="w-full h-full object-cover" data-alt="A luxurious boutique hotel exterior at dusk in Santorini, Greece, with glowing warm lights reflecting on a pristine white infinity pool overlooking the deep blue Aegean Sea. The atmosphere is quiet, sophisticated, and exclusive, utilizing a palette of cool blues and warm amber tones under a starry lavender sky." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAR_MXy3yDpY6xBTo71-HBu-I7zxsKP83GhfQh7YpusY2DYyJ0_ENfvIbkTHosRktxJN9Sb_6ddMDu_-mwHjML_80gIIzFJnoI6IgTrlIuYi7XPLANow1iAlwEjkanm4w5u4PVNpIysbh7BMMsQW7csGDbMLThV25-WvgQY7iFKzFQ8BOrBW4_UIoSU5GiC8OBss-JAj29SH9S5bzqldzXYLYHX3xdmU28fJl7uYrvOCkYCbSXLY3R6p_AN3InJdJTmnX5VXryVNveX" />
<div className="absolute top-4 right-4 bg-accent-yellow text-on-secondary-fixed font-bold px-3 py-1 rounded-full text-xs shadow-md">
                            PREMIUM SELECTION
                        </div>
</div>
<div className="p-6">
<div className="mb-6">
<h3 className="font-headline-md text-headline-md text-deep-indigo mb-1">Amalfi Coast Luxury Escape</h3>
<div className="flex items-center gap-2 text-on-surface-variant text-body-sm">
<span className="material-symbols-outlined text-[18px]" data-icon="location_on">location_on</span>
                                Positano, Italy
                            </div>
</div>
{/* Price Hold Countdown */}
<div className="bg-lavender-light p-4 rounded-lg flex items-center justify-between mb-8">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary" data-icon="schedule">schedule</span>
<span className="text-body-sm text-on-secondary-fixed-variant font-medium">Price held for</span>
</div>
<div className="font-bold text-primary font-mono text-lg" id="countdown">14:59</div>
</div>
{/* Breakdown */}
<div className="space-y-4 border-b border-outline-variant pb-6 mb-6">
<div className="flex justify-between items-center text-on-surface-variant">
<span className="text-body-md">Luxury Suite (5 nights)</span>
<span className="font-medium">₦3,450.00</span>
</div>
<div className="flex justify-between items-center text-on-surface-variant">
<span className="text-body-md">Resort Fees &amp; Taxes</span>
<span className="font-medium">₦420.50</span>
</div>
<div className="flex justify-between items-center text-on-surface-variant">
<span className="text-body-md">Concierge Insurance</span>
<span className="font-medium">₦125.00</span>
</div>
</div>
{/* Total */}
<div className="flex justify-between items-center mb-8">
<span className="font-headline-md text-headline-md text-on-surface">Total</span>
<span className="font-headline-md text-headline-md text-primary">₦3,995.50</span>
</div>
<button className="w-full bg-primary text-on-primary py-4 rounded-full font-label-md text-lg hover:bg-primary-container active:scale-95 transition-all shadow-md shadow-primary/20">
                            Continue to Payment
                        </button>
<p className="text-center text-xs text-on-surface-variant mt-4 px-6">
                            By proceeding, you agree to our <a className="underline" href="#">Booking Conditions</a> and <a className="underline" href="#">Privacy Policy</a>.
                        </p>
</div>
</div>
{/* Trust Badges */}
<div className="flex justify-center items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
<span className="material-symbols-outlined text-4xl" data-icon="verified_user">verified_user</span>
<span className="material-symbols-outlined text-4xl" data-icon="shield_with_heart">shield_with_heart</span>
<span className="material-symbols-outlined text-4xl" data-icon="lock">lock</span>
</div>
</div>
</div>
</main>
{/* Footer */}
<footer className="w-full relative bottom-0 bg-surface-container-highest dark:bg-surface-dim border-t border-outline-variant">
<div className="py-section-gap px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between gap-8">
<div className="space-y-4">
<span className="font-headline-md text-headline-md font-bold text-primary">VoyagePremium</span>
<p className="text-on-surface-variant max-w-xs text-body-sm">
                    Crafting extraordinary journeys for the discerning traveler. Professional, personalized, and perpetually premium.
                </p>
</div>
<div className="grid grid-cols-2 md:grid-cols-4 gap-gutter font-body-sm text-body-sm">
<div className="space-y-3">
<h4 className="font-bold text-on-surface">Company</h4>
<a className="block text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a className="block text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
</div>
<div className="space-y-3">
<h4 className="font-bold text-on-surface">Support</h4>
<a className="block text-on-surface-variant hover:text-primary transition-colors" href="#">Help Center</a>
<a className="block text-on-surface-variant hover:text-primary transition-colors" href="#">Cookie Policy</a>
</div>
<div className="space-y-3">
<h4 className="font-bold text-on-surface">Social</h4>
<a className="block text-on-surface-variant hover:text-primary transition-colors" href="#">Instagram</a>
<a className="block text-on-surface-variant hover:text-primary transition-colors" href="#">LinkedIn</a>
</div>
<div className="space-y-3">
<h4 className="font-bold text-on-surface">Ethics</h4>
<a className="block text-on-surface-variant hover:text-primary transition-colors" href="#">Sustainability</a>
</div>
</div>
</div>
<div className="px-margin-desktop max-w-container-max mx-auto py-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
<p className="text-on-surface-variant text-body-sm">© 2024 VoyagePremium Luxury Travel. All rights reserved.</p>
<div className="flex gap-6">
<span className="material-symbols-outlined text-on-surface-variant" data-icon="credit_card">credit_card</span>
<span className="material-symbols-outlined text-on-surface-variant" data-icon="account_balance">account_balance</span>
</div>
</div>
</footer>
    </div>
  );
}
