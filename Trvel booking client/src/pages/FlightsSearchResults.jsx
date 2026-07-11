import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

export default function FlightsSearchResults() {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search filter states
  const [departureCity, setDepartureCity] = useState('');
  const [arrivalCity, setArrivalCity] = useState('');
  const [maxPrice, setMaxPrice] = useState(2500000);

  useEffect(() => {
    // Parse URL query parameter if any
    const queryParams = new URLSearchParams(window.location.search);
    const depParam = queryParams.get('departureCity');
    const arrParam = queryParams.get('arrivalCity');
    
    if (depParam || arrParam) {
      if (depParam) setDepartureCity(depParam);
      if (arrParam) setArrivalCity(arrParam);
      fetchFlights(depParam, arrParam);
    } else {
      fetchFlights();
    }
  }, []);

  const fetchFlights = async (dep = departureCity, arr = arrivalCity) => {
    try {
      setLoading(true);
      const params = {};
      if (dep.trim()) params.DepartureCity = dep.trim();
      if (arr.trim()) params.ArrivalCity = arr.trim();
      if (maxPrice) params.MaxPrice = maxPrice;

      const response = await axiosInstance.get('/Flights', { params });
      setFlights(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load flights from PostgreSQL database.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUpdate = (e) => {
    e.preventDefault();
    fetchFlights();
  };

  const formatTime = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '08:00';
    }
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString([], { month: 'short', day: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex-1 bg-background text-on-background py-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
      {/* Quick Search Widget */}
      <section className="mb-8">
        <form onSubmit={handleSearchUpdate} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[150px] space-y-2">
            <label className="block text-xs font-semibold text-slate-300">From</label>
            <div className="flex items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="material-symbols-outlined text-primary mr-2 text-lg">flight_takeoff</span>
              <input 
                className="bg-transparent border-none focus:ring-0 w-full text-sm text-white outline-none" 
                placeholder="e.g. Lagos" 
                type="text" 
                value={departureCity}
                onChange={e => setDepartureCity(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-[150px] space-y-2">
            <label className="block text-xs font-semibold text-slate-300">To</label>
            <div className="flex items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="material-symbols-outlined text-primary mr-2 text-lg">flight_land</span>
              <input 
                className="bg-transparent border-none focus:ring-0 w-full text-sm text-white outline-none" 
                placeholder="e.g. Abuja" 
                type="text" 
                value={arrivalCity}
                onChange={e => setArrivalCity(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="bg-primary hover:bg-primary-container text-white font-semibold text-sm py-4 px-8 rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20 cursor-pointer">
            Update Search
          </button>
        </form>
      </section>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-72 shrink-0 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-['Montserrat'] font-bold text-base text-slate-800 dark:text-white">Filters</h3>
              <button 
                type="button"
                onClick={() => { setDepartureCity(''); setArrivalCity(''); setMaxPrice(2500000); }}
                className="text-primary font-semibold text-xs hover:underline cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Price Range */}
            <div className="pb-6 border-b border-slate-100 dark:border-slate-800">
              <p className="font-semibold text-xs text-slate-700 dark:text-slate-300 mb-3">Price Limit</p>
              <input 
                className="w-full accent-primary mb-2 cursor-pointer" 
                max="2500000" 
                min="50000" 
                step="50000"
                type="range" 
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>₦50,000</span>
                <span className="font-bold text-primary">₦{maxPrice.toLocaleString()} max</span>
              </div>
            </div>

            <button
              onClick={() => fetchFlights()}
              className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs py-3 rounded-xl mt-4 transition-all cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Results List */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
              Showing <span className="font-bold text-slate-800 dark:text-white">{flights.length}</span> flights available
            </p>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-500">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              Searching flights...
            </div>
          ) : error ? (
            <div className="py-16 text-center text-red-400 bg-red-950/20 border border-red-900 rounded-2xl p-6">
              {error}
            </div>
          ) : flights.length === 0 ? (
            <div className="py-20 text-center text-slate-500 bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
              <span className="material-symbols-outlined text-4xl text-slate-600 mb-3">flight</span>
              <p className="font-semibold text-base text-slate-300">No flights found</p>
              <p className="text-xs text-slate-500 mt-1">Try modifying your departure or arrival cities (e.g. Lagos, Abuja).</p>
            </div>
          ) : (
            <div className="space-y-4">
              {flights.map((flight) => (
                <div 
                  key={flight.id} 
                  onClick={() => navigate(`/flights/${flight.id}`)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-6 items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="bg-primary/10 p-3.5 rounded-xl flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-2xl">flight_takeoff</span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-white text-base">{flight.airline}</div>
                      <div className="text-xs text-slate-500 font-semibold">{flight.flightNumber} • {flight.status}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-center gap-8 w-full md:w-auto text-center">
                    <div className="text-left md:text-right">
                      <div className="text-lg font-bold text-slate-800 dark:text-white">{formatTime(flight.departureTime)}</div>
                      <div className="text-xs text-slate-500 font-semibold">{flight.departureCity}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{formatDate(flight.departureTime)}</div>
                    </div>

                    <div className="flex flex-col items-center shrink-0">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Direct</span>
                      <div className="w-24 h-[1px] bg-slate-300 dark:bg-slate-700 my-1.5 relative">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary absolute left-0 top-1/2 -translate-y-1/2"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary absolute right-0 top-1/2 -translate-y-1/2"></span>
                      </div>
                      <span className="material-symbols-outlined text-slate-400 text-sm">flight</span>
                    </div>

                    <div className="text-right md:text-left">
                      <div className="text-lg font-bold text-slate-800 dark:text-white">{formatTime(flight.arrivalTime)}</div>
                      <div className="text-xs text-slate-500 font-semibold">{flight.arrivalCity}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{formatDate(flight.arrivalTime)}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                      <div className="text-2xl font-bold text-primary">₦{Number(flight.price).toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500">{flight.availableSeats} seats left</div>
                    </div>
                    <button className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition-all active:scale-95 shadow-md shadow-primary/10 cursor-pointer">
                      Select Flight
                    </button>
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
