import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function UserDashboard() {
  const { user } = useAuth();
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
    <div className="flex-1 bg-background text-on-background py-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h1 className="font-['Montserrat'] font-bold text-2xl md:text-3xl text-slate-800 dark:text-white">
            My Voyage Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Welcome back, {user?.firstName}. Track your luxury stays and flight details here.
          </p>
        </div>
        <Link 
          to="/profile" 
          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">settings</span>
          Manage Profile
        </Link>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="material-symbols-outlined text-primary text-xl">calendar_month</span>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">TOTAL BOOKINGS</span>
          </div>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">{bookings.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="material-symbols-outlined text-primary text-xl">flight_takeoff</span>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">ACTIVE TRIPS</span>
          </div>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">
            {bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending').length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="material-symbols-outlined text-primary text-xl">payments</span>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">PAYMENTS COMPLETED</span>
          </div>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">
            {bookings.filter(b => b.paymentStatus === 'Paid').length}
          </p>
        </div>
      </div>

      {/* Bookings List */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 dark:text-white text-base">Booking History</h3>
          {error && <span className="text-xs text-red-400">{error}</span>}
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-slate-500">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              Retrieving bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              <span className="material-symbols-outlined text-4xl text-slate-400 mb-3">travel</span>
              <p className="font-semibold text-slate-700 dark:text-slate-300">No bookings yet</p>
              <p className="text-xs text-slate-500 mt-1">Create your first flight or hotel stay booking to get started.</p>
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-950/20 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Booking Status</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/40 transition-colors text-sm">
                    <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400">
                          {booking.bookingType === 'Flight' ? 'flight' : 'hotel'}
                        </span>
                        {booking.bookingType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {booking.bookingType === 'Flight' ? (
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-white">
                            {booking.flight?.airline} ({booking.flight?.flightNumber})
                          </div>
                          <div className="text-xs text-slate-400">
                            {booking.flight?.departureCity} ➔ {booking.flight?.arrivalCity}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-white">
                            {booking.hotel?.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {booking.hotel?.city}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {booking.bookingType === 'Flight' ? (
                        <span>{new Date(booking.flight?.departureTime).toLocaleDateString()}</span>
                      ) : (
                        <div className="text-xs">
                          <div>In: {new Date(booking.checkInDate).toLocaleDateString()}</div>
                          <div>Out: {new Date(booking.checkOutDate).toLocaleDateString()}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                        booking.status === 'Confirmed'
                          ? 'bg-green-500/10 text-green-500 border-green-500/20'
                          : booking.status === 'Cancelled'
                          ? 'bg-red-500/10 text-red-500 border-red-500/20'
                          : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                        booking.paymentStatus === 'Paid'
                          ? 'bg-green-500/10 text-green-500 border-green-500/20'
                          : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          to={`/bookings/${booking.id}`} 
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          View Details
                        </Link>
                        {booking.status === 'Pending' && booking.paymentStatus === 'Unpaid' && (
                          <button
                            onClick={() => navigate(`/payment?bookingId=${booking.id}`)}
                            className="px-3 py-1.5 bg-primary hover:bg-primary-container text-white rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Pay
                          </button>
                        )}
                        {booking.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
