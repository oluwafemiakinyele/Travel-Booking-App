import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

export default function BookingHistory() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/Bookings');
      setBookings(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load your booking history.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axiosInstance.delete(`/Bookings/${id}`);
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
      alert('Booking cancelled successfully.');
    } catch (err) {
      alert('Failed to cancel booking: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex-1 bg-background text-on-background py-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full font-['Inter']">
      <header className="mb-8 border-b border-slate-100 dark:border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="font-['Montserrat'] font-bold text-2xl text-slate-805 dark:text-white">
            Booking History
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review all your premium flights and stay itineraries.</p>
        </div>
        <Link 
          to="/dashboard" 
          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-250 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <span className="material-symbols-outlined text-sm">dashboard</span>
          Back to Dashboard
        </Link>
      </header>

      {loading ? (
        <div className="py-24 text-center text-slate-400">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          Retrieving itineraries...
        </div>
      ) : error ? (
        <div className="py-20 text-center text-red-500 font-semibold text-sm">
          {error}
        </div>
      ) : bookings.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          <span className="material-symbols-outlined text-5xl mb-4 text-slate-400">explore</span>
          <p className="font-bold text-slate-750 dark:text-slate-300 text-base">No Bookings Found</p>
          <p className="text-xs text-slate-500 mt-1">You haven't made any flight or hotel reservations yet.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/flights" className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-xl text-xs font-semibold">
              Book Flights
            </Link>
            <Link to="/hotels" className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl text-xs font-semibold">
              Book Hotels
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-805 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      {booking.bookingType === 'Flight' ? 'flight_takeoff' : 'hotel'}
                    </span>
                    <span className="font-bold text-sm text-slate-800 dark:text-white uppercase">{booking.bookingType}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                    booking.status === 'Confirmed'
                      ? 'bg-green-500/10 text-green-500 border-green-500/20'
                      : booking.status === 'Cancelled'
                      ? 'bg-red-500/10 text-red-500 border-red-500/20'
                      : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                  }`}>
                    {booking.status}
                  </span>
                </div>

                {booking.bookingType === 'Flight' ? (
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-base">
                      {booking.flight?.airline} ({booking.flight?.flightNumber})
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Route: {booking.flight?.departureCity} ➔ {booking.flight?.arrivalCity}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      Departure: {new Date(booking.flight?.departureTime).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-base">
                      {booking.hotel?.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Location: {booking.hotel?.address || booking.hotel?.city}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      Check-in: {new Date(booking.checkInDate).toLocaleDateString()} | Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Total Cost</span>
                    <span className="font-bold text-primary text-sm">₦{Number(booking.totalAmount).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Payment Status</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      booking.paymentStatus === 'Paid'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                <Link 
                  to={`/bookings/${booking.id}`} 
                  className="flex-1 text-center py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all"
                >
                  View Details
                </Link>
                {booking.paymentStatus === 'Unpaid' && booking.status !== 'Cancelled' && (
                  <button 
                    onClick={() => navigate(`/payment?bookingId=${booking.id}`)}
                    className="flex-1 py-2.5 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md shadow-primary/10 transition-all"
                  >
                    Pay Invoice
                  </button>
                )}
                {booking.status !== 'Cancelled' && (
                  <button 
                    onClick={() => handleCancelBooking(booking.id)}
                    className="px-3.5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
