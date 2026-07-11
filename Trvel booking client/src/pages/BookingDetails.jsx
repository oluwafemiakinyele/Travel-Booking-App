import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/Bookings/${id}`);
      setBooking(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load booking details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axiosInstance.delete(`/Bookings/${id}`);
      setBooking({ ...booking, status: 'Cancelled' });
      alert('Booking cancelled successfully.');
    } catch (err) {
      alert('Failed to cancel booking: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-slate-500">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mr-3"></div>
        Loading booking details...
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex-1 max-w-container-max mx-auto px-margin-desktop py-12 text-center text-red-500">
        {error || 'Booking details not found.'}
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background text-on-background py-8 px-margin-mobile md:px-margin-desktop max-w-2xl mx-auto w-full">
      <button 
        onClick={() => navigate('/dashboard')}
        className="text-xs text-slate-500 hover:text-primary mb-6 flex items-center gap-1 cursor-pointer font-semibold"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span> Back to dashboard
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h1 className="font-['Montserrat'] font-bold text-xl text-slate-800 dark:text-white">
              Booking Details
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">
              ID: {booking.id}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
            booking.status === 'Confirmed'
              ? 'bg-green-500/10 text-green-500 border-green-500/20'
              : booking.status === 'Cancelled'
              ? 'bg-red-500/10 text-red-500 border-red-500/20'
              : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
          }`}>
            {booking.status}
          </span>
        </div>

        {/* Dynamic details */}
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850 space-y-3">
            <h3 className="font-['Montserrat'] font-bold text-xs text-slate-400 uppercase tracking-wider">
              {booking.bookingType} Information
            </h3>
            
            {booking.bookingType === 'Flight' ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  {booking.flight?.airline} ({booking.flight?.flightNumber})
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 mt-2">
                  <div>
                    <span className="block font-bold uppercase text-[9px]">From</span>
                    <span className="text-slate-700 dark:text-slate-300 mt-0.5 block">{booking.flight?.departureCity}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{new Date(booking.flight?.departureTime).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block font-bold uppercase text-[9px]">To</span>
                    <span className="text-slate-700 dark:text-slate-300 mt-0.5 block">{booking.flight?.arrivalCity}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{new Date(booking.flight?.arrivalTime).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  {booking.hotel?.name}
                </p>
                <p className="text-xs text-slate-500">{booking.hotel?.address || booking.hotel?.city}</p>
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 mt-3 border-t border-slate-200 dark:border-slate-800 pt-2.5">
                  <div>
                    <span className="block font-bold uppercase text-[9px]">Check-in Date</span>
                    <span className="text-slate-700 dark:text-slate-300 mt-0.5 block">{new Date(booking.checkInDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="block font-bold uppercase text-[9px]">Check-out Date</span>
                    <span className="text-slate-700 dark:text-slate-300 mt-0.5 block">{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Number of Guests</span>
              <span className="text-base font-semibold text-slate-700 dark:text-slate-200 mt-1 block">{booking.numberOfGuests}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Total Cost</span>
              <span className="text-base font-bold text-primary mt-1 block">₦{Number(booking.totalAmount).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850 flex justify-between items-center">
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Payment Status</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5 block">{booking.paymentStatus}</span>
            </div>
            {booking.paymentStatus === 'Unpaid' && booking.status !== 'Cancelled' && (
              <button 
                onClick={() => navigate(`/payment?bookingId=${booking.id}`)}
                className="bg-primary hover:bg-primary-container text-white px-5 py-2 rounded-xl text-xs font-semibold shadow shadow-primary/15 cursor-pointer"
              >
                Pay Now
              </button>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          {booking.status !== 'Cancelled' && (
            <button 
              onClick={handleCancel}
              className="flex-1 py-3 border border-red-200 dark:border-red-900/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl text-xs font-semibold cursor-pointer transition-all"
            >
              Cancel Reservation
            </button>
          )}
          <Link 
            to="/dashboard"
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer transition-all text-center"
          >
            Close Details
          </Link>
        </div>
      </div>
    </div>
  );
}
