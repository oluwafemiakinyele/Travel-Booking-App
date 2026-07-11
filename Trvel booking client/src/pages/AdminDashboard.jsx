import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/Admin/dashboard');
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <span>Retrieving system analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 text-center text-red-500">
        <span className="material-symbols-outlined text-5xl mb-4">error</span>
        <p className="font-bold">{error}</p>
        <button 
          onClick={fetchDashboardStats}
          className="mt-4 bg-primary text-white px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-8 max-w-[1400px] mx-auto w-full font-['Inter'] space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-['Montserrat'] font-bold text-2xl text-slate-100">Overview</h2>
          <p className="text-xs text-slate-500 mt-1">Live administration and reporting analytics platform.</p>
        </div>
        <button 
          onClick={fetchDashboardStats}
          className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer"
          title="Refresh Analytics"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
        </button>
      </header>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">REVENUE</span>
          </div>
          <p className="text-xs text-slate-400 mb-1">Total Revenue</p>
          <h3 className="font-['Montserrat'] text-3xl font-bold text-white">
            ₦{stats?.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
          </h3>
        </div>

        {/* Bookings Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <span className="material-symbols-outlined">confirmation_number</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">BOOKINGS</span>
          </div>
          <p className="text-xs text-slate-400 mb-1">Total Bookings</p>
          <h3 className="font-['Montserrat'] text-3xl font-bold text-white">{stats?.totalBookings || 0}</h3>
        </div>

        {/* Users Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">CUSTOMERS</span>
          </div>
          <p className="text-xs text-slate-400 mb-1">Registered Profiles</p>
          <h3 className="font-['Montserrat'] text-3xl font-bold text-white">{stats?.totalUsers || 0}</h3>
        </div>

        {/* Flight & Hotel Count Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <span className="material-symbols-outlined">travel</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">RATIO</span>
          </div>
          <p className="text-xs text-slate-400 mb-1">Flights vs Hotel Stays</p>
          <h3 className="font-['Montserrat'] text-xl font-bold text-white flex items-center gap-2 mt-2">
            <span className="flex items-center gap-1 text-sm bg-slate-800 px-2 py-1 rounded">
              <span className="material-symbols-outlined text-xs">flight</span> {stats?.flightBookingsCount || 0}
            </span>
            <span className="flex items-center gap-1 text-sm bg-slate-800 px-2 py-1 rounded">
              <span className="material-symbols-outlined text-xs">hotel</span> {stats?.hotelBookingsCount || 0}
            </span>
          </h3>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h4 className="font-['Montserrat'] font-bold text-white text-base">Revenue Analytics</h4>
            <p className="text-xs text-slate-500">Monthly Performance Target vs Revenue Stream</p>
          </div>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
            <button className="px-3.5 py-1.5 bg-slate-800 text-white rounded-lg shadow-sm font-semibold">Monthly</button>
            <button className="px-3.5 py-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer">Quarterly</button>
            <button className="px-3.5 py-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer">Yearly</button>
          </div>
        </div>
        
        {/* Simple SVG Chart */}
        <div className="relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/45 p-6 flex items-end justify-between min-h-[200px]">
          <div className="absolute inset-0 flex flex-col justify-between py-6 px-4 pointer-events-none opacity-5">
            <div className="border-b border-white"></div>
            <div className="border-b border-white"></div>
            <div className="border-b border-white"></div>
            <div className="border-b border-white"></div>
          </div>
          <svg className="absolute inset-0 w-full h-full p-6 overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 300">
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#4648d4" stopOpacity="0.3"></stop>
                <stop offset="100%" stopColor="#4648d4" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <path d="M0,250 Q100,180 200,200 T400,100 T600,150 T800,50 T1000,80 L1000,300 L0,300 Z" fill="url(#chartGradient)"></path>
            <path d="M0,250 Q100,180 200,200 T400,100 T600,150 T800,50 T1000,80" fill="none" stroke="#4648d4" strokeLinecap="round" strokeWidth="4"></path>
            <circle className="animate-pulse" cx="200" cy="200" fill="#4648d4" r="6"></circle>
            <circle className="animate-pulse" cx="400" cy="100" fill="#4648d4" r="6"></circle>
            <circle className="animate-pulse" cx="800" cy="50" fill="#4648d4" r="6"></circle>
          </svg>
          <div className="absolute bottom-2 left-0 w-full flex justify-between px-6 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
          <h4 className="font-['Montserrat'] font-bold text-white text-base">Recent Transactions</h4>
          <Link 
            to="/admin/bookings" 
            className="text-xs font-semibold text-primary hover:text-primary-container flex items-center gap-1 transition-all"
          >
            Manage Bookings
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          {!stats?.recentBookings || stats.recentBookings.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No recent transactions recorded.
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-950/40 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Customer ID</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Payment Status</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {stats.recentBookings.slice(0, 5).map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-850/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {booking.userId?.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-200">
                      {booking.bookingType}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {booking.bookingType === 'Flight' ? (
                        <span>{booking.flight?.airline} ({booking.flight?.flightNumber})</span>
                      ) : (
                        <span>{booking.hotel?.name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      ₦{Number(booking.totalAmount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        booking.paymentStatus === 'Paid'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        booking.status === 'Confirmed'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : booking.status === 'Cancelled'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {booking.status}
                      </span>
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
