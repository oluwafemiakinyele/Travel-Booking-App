import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchHotelDetails();
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/Hotels/${id}`);
      setHotel(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load hotel details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please sign in or register to book a room.');
      return;
    }

    if (!checkInDate || !checkOutDate) {
      alert('Please select check-in and check-out dates.');
      return;
    }

    try {
      setBookingLoading(true);
      const payload = {
        bookingType: 'Hotel',
        hotelId: id,
        checkInDate,
        checkOutDate,
        numberOfGuests: Number(numberOfGuests),
      };
      
      const response = await axiosInstance.post('/Bookings', payload);
      const booking = response.data;
      
      // Redirect to payment screen
      navigate(`/payment?bookingId=${booking.id}`);
    } catch (err) {
      alert('Failed to complete booking: ' + (err.response?.data?.message || err.message));
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-slate-500">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mr-3"></div>
        Retrieving stay details...
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="flex-1 max-w-container-max mx-auto px-margin-desktop py-12 text-center text-red-500">
        {error || 'Stay details not found'}
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background text-on-background py-8 px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto w-full">
      <button 
        onClick={() => navigate('/hotels')}
        className="text-xs text-slate-500 hover:text-primary mb-6 flex items-center gap-1 cursor-pointer font-semibold"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span> Back to search
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm space-y-0">
        {/* Cover image */}
        <div className="h-80 w-full relative">
          <img 
            src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80'} 
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-6 right-6 bg-slate-900/80 backdrop-blur-md text-accent-yellow font-bold text-sm px-3.5 py-1.5 rounded-xl flex items-center gap-1 border border-white/10">
            <span className="material-symbols-outlined text-sm">star</span>
            {hotel.rating || '4.5'}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h1 className="font-['Montserrat'] font-bold text-2xl md:text-3xl text-slate-800 dark:text-white">
              {hotel.name}
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {hotel.address || hotel.city}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-['Montserrat'] font-bold text-sm text-slate-700 dark:text-slate-300">About the Stay</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {hotel.description || 'Experience high-end accommodations in a beautifully designed building. Enjoy exceptional hospitality, comfortable suites, premium amenities, and convenient access to local city sights.'}
            </p>
          </div>

          {/* Booking / Checkout Form */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
            <h3 className="font-['Montserrat'] font-bold text-sm text-slate-700 dark:text-slate-300 mb-4">Book Your Accommodation</h3>
            
            <form onSubmit={handleBooking} className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 p-6 rounded-xl space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase block">Check-in</label>
                  <input 
                    type="date"
                    required
                    value={checkInDate}
                    onChange={e => setCheckInDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs outline-none focus:ring-1 focus:ring-primary cursor-pointer font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase block">Check-out</label>
                  <input 
                    type="date"
                    required
                    value={checkOutDate}
                    onChange={e => setCheckOutDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs outline-none focus:ring-1 focus:ring-primary cursor-pointer font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase block">Guests</label>
                  <input 
                    type="number"
                    min="1"
                    required
                    value={numberOfGuests}
                    onChange={e => setNumberOfGuests(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs outline-none focus:ring-1 focus:ring-primary font-bold text-center"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-200 dark:border-slate-800 pt-4 mt-2">
                <div>
                  <span className="text-2xl font-bold text-primary">₦{Number(hotel.pricePerNight).toLocaleString()}</span>
                  <span className="text-xs text-slate-500"> / night</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{hotel.availableRooms} rooms available in this building</p>
                </div>
                
                <button 
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full md:w-auto bg-primary hover:bg-primary-container text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50"
                >
                  {bookingLoading ? 'Reserving...' : 'Reserve Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
