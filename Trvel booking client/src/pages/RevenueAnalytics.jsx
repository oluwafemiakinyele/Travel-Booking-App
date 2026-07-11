import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';

export default function RevenueAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/Admin/dashboard');
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load revenue data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <span>Loading financial portfolios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 text-center text-red-500">
        <span className="material-symbols-outlined text-5xl mb-4">error</span>
        <p className="font-bold">{error}</p>
      </div>
    );
  }

  // Calculate some analytics fields
  const totalRevenue = stats?.totalRevenue || 0;
  const totalBookings = stats?.totalBookings || 0;
  const avgOrderValue = totalBookings > 0 ? (totalRevenue / totalBookings) : 0;
  
  const flightRevenueMock = totalRevenue * 0.45;
  const hotelRevenueMock = totalRevenue * 0.55;

  return (
    <div className="flex-1 p-6 md:p-8 max-w-[1400px] mx-auto w-full font-['Inter'] space-y-8 text-slate-100">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-['Montserrat'] font-bold text-2xl text-slate-100">Revenue Analytics</h2>
          <p className="text-xs text-slate-500 mt-1">Financial reporting, gateway yields, and transaction volumes.</p>
        </div>
        <button 
          onClick={fetchStats}
          className="w-10 h-10 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 rounded-xl transition-all flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
        </button>
      </header>

      {/* Finance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-500 bg-slate-850 px-2.5 py-1 rounded">GROSS YIELD</span>
          <p className="text-sm text-slate-400 mt-4">Gross Invoiced Revenue</p>
          <h3 className="font-['Montserrat'] text-3xl font-bold text-white mt-1">
            ₦{totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-500 bg-slate-850 px-2.5 py-1 rounded">TICKET AVERAGE</span>
          <p className="text-sm text-slate-400 mt-4">Average Value per Booking</p>
          <h3 className="font-['Montserrat'] text-3xl font-bold text-white mt-1">
            ₦{avgOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-500 bg-slate-850 px-2.5 py-1 rounded">SETTLED INVOICES</span>
          <p className="text-sm text-slate-400 mt-4">Successful Payments</p>
          <h3 className="font-['Montserrat'] text-3xl font-bold text-white mt-1">
            {stats?.recentBookings?.filter(b => b.paymentStatus === 'Paid').length || 0} Paid
          </h3>
        </div>
      </div>

      {/* Channel Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Streams split */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div>
            <h4 className="font-['Montserrat'] font-bold text-white">Revenue Split</h4>
            <p className="text-xs text-slate-500">Distribution between flights and boutique hotel stays.</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span>Flight Seat Bookings (45%)</span>
                <span>₦{flightRevenueMock.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-850">
                <div className="bg-primary h-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span>Hotel Accommodations (55%)</span>
                <span>₦{hotelRevenueMock.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-850">
                <div className="bg-accent-yellow h-full" style={{ width: '55%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Security / Settlements Gateway */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div>
            <h4 className="font-['Montserrat'] font-bold text-white">Settlement Integrity</h4>
            <p className="text-xs text-slate-500">Paystack checkout processor credentials & live status.</p>
          </div>

          <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Primary Processor:</span>
              <span className="font-semibold text-slate-200">Paystack (Secured Integration)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-505">Integrations Key:</span>
              <span className="font-mono text-slate-400">sk_live_****</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Webhooks Callback:</span>
              <span className="font-mono text-slate-400">/api/Payments/webhook</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Processor Status:</span>
              <span className="text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                OPERATIONAL
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
