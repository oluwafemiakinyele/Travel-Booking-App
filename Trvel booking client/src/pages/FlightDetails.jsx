import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function FlightDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchFlightDetails();
  }, [id]);

  const fetchFlightDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/Flights/${id}`);
      setFlight(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load flight details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please sign in or register to book a flight.');
      return;
    }

    try {
      setBookingLoading(true);
      const payload = {
        bookingType: 'Flight',
        flightId: id,
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
        Retrieving flight details...
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="flex-1 max-w-container-max mx-auto px-margin-desktop py-12 text-center text-red-500">
        {error || 'Flight not found'}
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background text-on-background py-8 px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto w-full">
      <button 
        onClick={() => navigate('/flights')}
        className="text-xs text-slate-500 hover:text-primary mb-6 flex items-center gap-1 cursor-pointer font-semibold"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span> Back to search
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
        {/* Airline & Number */}
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h1 className="font-['Montserrat'] font-bold text-2xl text-slate-800 dark:text-white">
              {flight.airline}
            </h1>
            <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">
              Flight Number: {flight.flightNumber} • Status: {flight.status}
            </p>
          </div>
          <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
            Available
          </span>
        </div>

        {/* Departure & Arrival Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
          <div className="text-left md:text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Departure</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">{flight.departureCity}</p>
            <p className="text-[11px] text-slate-500">{new Date(flight.departureTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: '2-digit' })}</p>
          </div>

          <div className="flex flex-col items-center py-4 md:py-0">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Direct</span>
            <div className="w-full max-w-[150px] h-[1px] bg-slate-300 dark:bg-slate-700 my-2 relative">
              <span className="w-1.5 h-1.5 rounded-full bg-primary absolute left-0 top-1/2 -translate-y-1/2"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary absolute right-0 top-1/2 -translate-y-1/2"></span>
            </div>
            <span className="material-symbols-outlined text-primary text-xl">flight</span>
          </div>

          <div className="text-right md:text-left">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Arrival</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              {new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">{flight.arrivalCity}</p>
            <p className="text-[11px] text-slate-500">{new Date(flight.arrivalTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: '2-digit' })}</p>
          </div>
        </div>

        {/* Pricing & Booking Panel */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Price per ticket</p>
            <span className="text-3xl font-bold text-primary">₦{Number(flight.price).toLocaleString()}</span>
            <span className="text-xs text-slate-500"> / guest</span>
            <p className="text-[11px] text-slate-400 mt-1">{flight.availableSeats} seats left on this flight</p>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleBooking} className="flex gap-3 items-end w-full md:w-auto">
            <div className="space-y-1.5 w-24">
              <label className="text-[11px] font-semibold text-slate-400 uppercase block">Guests</label>
              <input 
                type="number" 
                min="1" 
                max={flight.availableSeats}
                value={numberOfGuests}
                onChange={e => setNumberOfGuests(e.target.value)}
                className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs outline-none focus:ring-1 focus:ring-primary text-center font-bold"
              />
            </div>
            <button 
              type="submit"
              disabled={bookingLoading}
              className="flex-1 md:flex-none bg-primary hover:bg-primary-container text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50"
            >
              {bookingLoading ? 'Booking...' : 'Book Flight Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
