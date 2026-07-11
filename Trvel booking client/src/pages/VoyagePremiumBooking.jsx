import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VoyagePremiumBooking() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('flights');
  const [destination, setDestination] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (activeTab === 'flights') {
      navigate(`/flights?departureCity=${encodeURIComponent(destination)}`);
    } else {
      navigate(`/hotels?city=${encodeURIComponent(destination)}`);
    }
  };

  const destinations = [
    {
      name: 'Amalfi Coast, Italy',
      tag: 'TRENDING',
      image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&auto=format&fit=crop&q=80',
      span: 'md:col-span-2 md:row-span-2',
    },
    {
      name: 'Kyoto, Japan',
      tag: 'CULTURE',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80',
      span: 'md:col-span-2 md:row-span-1',
    },
    {
      name: 'Maldives',
      tag: 'BEACH',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&auto=format&fit=crop&q=80',
      span: 'md:col-span-1 md:row-span-1',
    },
    {
      name: 'Swiss Alps',
      tag: 'ADVENTURE',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
      span: 'md:col-span-1 md:row-span-1',
    },
  ];

  return (
    <div className="flex-1 bg-background text-on-background">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover" 
            alt="Maldives resort pool"
            src="https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=1200&auto=format&fit=crop&q=80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-container-max px-margin-desktop text-center">
          <h1 className="font-['Montserrat'] text-4xl md:text-6xl font-bold text-white mb-8 drop-shadow-lg leading-tight">
            Elevate Your Journey
          </h1>
          
          {/* Glassmorphic Search Widget */}
          <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 p-4 md:p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto text-left">
            <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
              <button 
                type="button"
                onClick={() => setActiveTab('flights')}
                className={`flex items-center gap-2 font-semibold text-sm px-2 pb-2 transition-all border-b-2 cursor-pointer ${
                  activeTab === 'flights' ? 'text-primary border-primary font-bold' : 'text-slate-300 border-transparent hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-lg">flight</span> Flights
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('hotels')}
                className={`flex items-center gap-2 font-semibold text-sm px-2 pb-2 transition-all border-b-2 cursor-pointer ${
                  activeTab === 'hotels' ? 'text-primary border-primary font-bold' : 'text-slate-300 border-transparent hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-lg">hotel</span> Hotels
              </button>
            </div>
            
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-2 space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Destination</label>
                <div className="flex items-center bg-white/10 p-3 rounded-xl border border-white/10 focus-within:ring-1 focus-within:ring-primary transition-all">
                  <span className="material-symbols-outlined text-primary mr-2">location_on</span>
                  <input 
                    className="bg-transparent border-none p-0 w-full focus:ring-0 text-sm text-white placeholder-slate-400 outline-none" 
                    placeholder="Where to? (e.g. Lagos, Abuja, Paris)" 
                    type="text"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Departure / Check-in</label>
                <div className="flex items-center bg-white/10 p-3 rounded-xl border border-white/10 focus-within:ring-1 focus-within:ring-primary transition-all">
                  <span className="material-symbols-outlined text-primary mr-2">calendar_today</span>
                  <input 
                    className="bg-transparent border-none p-0 w-full focus:ring-0 text-xs text-white outline-none cursor-pointer" 
                    type="date"
                  />
                </div>
              </div>
              
              <div>
                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-container text-white font-semibold text-sm py-4 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  Search Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Popular Destinations Bento Grid */}
      <section className="py-section-gap px-margin-desktop max-w-container-max mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-['Montserrat'] font-bold text-2xl md:text-3xl text-slate-800 dark:text-white mb-2">
              Popular Destinations
            </h2>
            <p className="text-slate-500 text-sm">Hand-picked escapes for the discerning traveler.</p>
          </div>
          <button 
            onClick={() => navigate('/hotels')}
            className="text-primary font-semibold text-xs flex items-center hover:underline cursor-pointer"
          >
            View all <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[550px]">
          {destinations.map((dest, i) => (
            <div 
              key={i} 
              onClick={() => {
                setDestination(dest.name.split(',')[0]);
                navigate(`/hotels?city=${encodeURIComponent(dest.name.split(',')[0])}`);
              }}
              className={`${dest.span} relative group overflow-hidden rounded-2xl cursor-pointer shadow-md min-h-[220px]`}
            >
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt={dest.name} 
                src={dest.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <span className="bg-accent-yellow text-slate-900 text-[9px] font-bold px-2 py-0.5 rounded-full mb-3 inline-block tracking-wider">
                  {dest.tag}
                </span>
                <h3 className="font-['Montserrat'] font-bold text-lg md:text-2xl">{dest.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-section-gap px-margin-desktop max-w-container-max mx-auto mb-16">
        <div className="relative bg-primary/10 dark:bg-slate-900/60 border border-primary/20 rounded-3xl p-8 md:p-16 overflow-hidden flex flex-col md:flex-row items-center gap-12">
          <div className="absolute -right-10 -bottom-10 opacity-10 transform rotate-12">
            <span className="material-symbols-outlined text-[300px] text-primary">mail</span>
          </div>
          
          <div className="flex-1 relative z-10">
            <h2 className="font-['Montserrat'] font-bold text-2xl md:text-4xl text-primary dark:text-primary-fixed mb-4">
              The Voyage Letter
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-lg leading-relaxed">
              Get curated travel guides, hidden gem alerts, and priority access to flash deals directly in your inbox.
            </p>
          </div>
          
          <div className="flex-1 w-full relative z-10">
            <form onSubmit={e => { e.preventDefault(); alert('Subscribed successfully!'); }} className="flex flex-col sm:flex-row gap-3">
              <input 
                className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-3 focus:ring-1 focus:ring-primary text-sm shadow-sm outline-none text-slate-800 dark:text-white" 
                placeholder="Your premium email" 
                type="email"
                required
              />
              <button 
                className="bg-primary hover:bg-primary-container text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md cursor-pointer shrink-0" 
                type="submit"
              >
                Join Elite
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="bg-slate-100 dark:bg-slate-900/40 w-full border-t border-slate-200 dark:border-slate-800 mt-auto">
        <div className="py-12 px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between gap-12 text-sm text-slate-500">
          <div className="max-w-xs">
            <span className="font-['Montserrat'] font-bold text-lg text-primary block mb-3">VoyagePremium</span>
            <p className="leading-relaxed text-xs">
              Redefining luxury travel through intuitive design and curated experiences. Your journey starts here, managed by the world's most sophisticated digital concierge.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <h5 className="font-bold text-xs uppercase text-slate-700 dark:text-slate-300 mb-3 tracking-wider">Company</h5>
              <ul className="space-y-2 text-xs">
                <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Sustainability</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-xs uppercase text-slate-700 dark:text-slate-300 mb-3 tracking-wider">Legal</h5>
              <ul className="space-y-2 text-xs">
                <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Terms</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-xs uppercase text-slate-700 dark:text-slate-300 mb-3 tracking-wider">Support</h5>
              <ul className="space-y-2 text-xs">
                <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
