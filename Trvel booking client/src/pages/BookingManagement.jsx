import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

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
      console.error(err);
      setError('Failed to retrieve bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action is irreversible.')) return;
    try {
      await axiosInstance.delete(`/Bookings/${id}`);
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
      alert('Booking cancelled successfully.');
    } catch (err) {
      alert('Failed to cancel booking: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredBookings = bookings.filter(b => {
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      b.id?.toLowerCase().includes(query) || 
      b.userId?.toLowerCase().includes(query) ||
      (b.bookingType === 'Flight' ? b.flight?.airline?.toLowerCase().includes(query) : b.hotel?.name?.toLowerCase().includes(query));
    
    const matchesType = typeFilter === 'All' || b.bookingType === typeFilter;
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;

    return matchesQuery && matchesType && matchesStatus;
  });

  return (
    <div className="flex-1 p-6 md:p-8 max-w-[1400px] mx-auto w-full font-['Inter'] space-y-6 text-slate-100">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-['Montserrat'] font-bold text-2xl text-slate-100">Booking Management</h2>
          <p className="text-xs text-slate-500 mt-1">Monitor passenger seat bookings, hotel check-ins, and billing details.</p>
        </div>
        <button 
          onClick={fetchBookings}
          className="w-10 h-10 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 rounded-xl transition-all flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
        </button>
      </header>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
        <div className="sm:col-span-2 relative flex items-center bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-805">
          <span className="material-symbols-outlined text-slate-500 text-lg mr-2">search</span>
          <input 
            type="text" 
            placeholder="Search by Booking ID, User ID, Flight, or Hotel name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs w-full text-slate-200 placeholder-slate-650"
          />
        </div>
        <div>
          <select 
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-350 outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Flight">Flights</option>
            <option value="Hotel">Hotels</option>
          </select>
        </div>
        <div>
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-350 outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-24 text-center text-slate-500 text-sm">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            Loading customer bookings...
          </div>
        ) : error ? (
          <div className="py-20 text-center text-red-500 text-sm">
            <p className="font-bold">{error}</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            No bookings recorded matching filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-950/40 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Customer ID</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Booking Target Details</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-850/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {b.id?.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {b.userId?.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-200">
                      {b.bookingType}
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-xs">
                      {b.bookingType === 'Flight' ? (
                        <div>
                          <p className="font-bold">{b.flight?.airline} ({b.flight?.flightNumber})</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{b.flight?.departureCity} ➔ {b.flight?.arrivalCity}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-bold">{b.hotel?.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">City: {b.hotel?.city}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      ₦{Number(b.totalAmount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                        b.paymentStatus === 'Paid'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {b.paymentStatus || 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                        b.status === 'Confirmed'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : b.status === 'Cancelled'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {b.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {b.status !== 'Cancelled' && (
                        <button 
                          onClick={() => handleCancelBooking(b.id)}
                          className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold border border-red-500/20 cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
