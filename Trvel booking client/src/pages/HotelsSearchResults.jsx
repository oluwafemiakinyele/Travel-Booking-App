import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

export default function HotelsSearchResults() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search parameters state
  const [city, setCity] = useState('');
  const [maxPrice, setMaxPrice] = useState(500000);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    // Parse URL query parameter if any
    const queryParams = new URLSearchParams(window.location.search);
    const cityParam = queryParams.get('city');
    if (cityParam) {
      setCity(cityParam);
      fetchHotels(cityParam);
    } else {
      fetchHotels();
    }
  }, []);

  const fetchHotels = async (targetCity = city) => {
    try {
      setLoading(true);
      const params = {};
      if (targetCity.trim()) params.City = targetCity.trim();
      if (maxPrice) params.MaxPricePerNight = maxPrice;
      if (minRating) params.MinRating = minRating;

      const response = await axiosInstance.get('/Hotels', { params });
      setHotels(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch hotels from the backend database.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUpdate = (e) => {
    e.preventDefault();
    fetchHotels();
  };

  return (
    <div className="flex-1 bg-background text-on-background py-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
      {/* Quick Search Bar */}
      <section className="mb-10">
        <form onSubmit={handleSearchUpdate} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-md flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px] space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Destination City</label>
            <div className="flex items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="material-symbols-outlined text-primary mr-2 text-lg">location_on</span>
              <input 
                className="bg-transparent border-none p-0 w-full focus:ring-0 text-sm text-white outline-none" 
                type="text" 
                placeholder="e.g. Lagos, Abuja, Paris"
                value={city}
                onChange={e => setCity(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-[150px] space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Min Rating</label>
            <div className="flex items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="material-symbols-outlined text-primary mr-2 text-lg">star</span>
              <select 
                className="bg-transparent border-none focus:ring-0 w-full text-sm text-white appearance-none outline-none"
                value={minRating}
                onChange={e => setMinRating(Number(e.target.value))}
              >
                <option value={0}>Any Rating</option>
                <option value={4.0}>4.0+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={4.8}>4.8+ Stars</option>
              </select>
            </div>
          </div>

          <button type="submit" className="bg-primary hover:bg-primary-container text-white font-semibold text-sm py-4 px-8 rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20 cursor-pointer">
            Update Search
          </button>
        </form>
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filter */}
        <aside className="w-full lg:w-72 space-y-6 shrink-0">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-['Montserrat'] font-bold text-base text-slate-800 dark:text-white">Filters</h2>
              <button 
                type="button"
                onClick={() => { setCity(''); setMaxPrice(500000); setMinRating(0); }}
                className="text-primary font-semibold text-xs hover:underline cursor-pointer"
              >
                Clear all
              </button>
            </div>

            {/* Price Range */}
            <div className="pb-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-semibold text-xs text-slate-700 dark:text-slate-300 mb-3">Price Range</h3>
              <input 
                className="w-full accent-primary mb-2 cursor-pointer" 
                max="500000" 
                min="10000" 
                step="10000"
                type="range" 
                value={maxPrice} 
                onChange={e => setMaxPrice(Number(e.target.value))}
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>₦10,000</span>
                <span className="font-bold text-primary">₦{maxPrice.toLocaleString()} max</span>
              </div>
            </div>
            
            <button
              onClick={() => fetchHotels()}
              className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs py-3 rounded-xl mt-4 transition-all cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Results List */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
              Showing <span className="font-bold text-slate-800 dark:text-white">{hotels.length}</span> luxury stays
            </p>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-500">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              Searching stays...
            </div>
          ) : error ? (
            <div className="py-16 text-center text-red-400 bg-red-950/20 border border-red-900 rounded-2xl p-6">
              {error}
            </div>
          ) : hotels.length === 0 ? (
            <div className="py-20 text-center text-slate-500 bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
              <span className="material-symbols-outlined text-4xl text-slate-600 mb-3">apartment</span>
              <p className="font-semibold text-base text-slate-300">No luxury stays found</p>
              <p className="text-xs text-slate-500 mt-1">Try modifying your search criteria or cities (e.g. Lagos, Abuja).</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotels.map((hotel) => (
                <div 
                  key={hotel.id} 
                  onClick={() => navigate(`/hotels/${hotel.id}`)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
                >
                  <div className="h-48 relative overflow-hidden bg-slate-800">
                    <img 
                      src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80'} 
                      alt={hotel.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 right-4 bg-slate-900/70 backdrop-blur-md text-accent-yellow font-bold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">star</span>
                      {hotel.rating || '4.5'}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-['Montserrat'] font-bold text-base text-slate-800 dark:text-white mb-2">{hotel.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        {hotel.city}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-6">
                        {hotel.description || 'A premium luxury accommodation featuring world-class amenities and comfortable suites.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                      <div>
                        <span className="text-xl font-bold text-primary">₦{Number(hotel.pricePerNight).toLocaleString()}</span>
                        <span className="text-[10px] text-slate-500"> / night</span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {hotel.availableRooms} rooms available
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
