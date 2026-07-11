import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: 'dashboard' },
    { path: '/admin/users', label: 'User Management', icon: 'group' },
    { path: '/admin/flights', label: 'Flight Management', icon: 'flight' },
    { path: '/admin/hotels', label: 'Hotel Management', icon: 'domain' },
    { path: '/admin/bookings', label: 'Booking Management', icon: 'assignment' },
    { path: '/admin/revenue', label: 'Revenue Analytics', icon: 'monitoring' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Inter'] flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-4 shrink-0 fixed h-screen left-0 top-0 z-50">
        <div className="mb-8 px-2 flex justify-between items-center">
          <div>
            <h1 className="font-['Montserrat'] font-bold text-xl text-primary">VoyagePremium</h1>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Admin Dashboard</p>
          </div>
        </div>
        
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 p-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 font-bold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="border-t border-slate-800 pt-4 mt-auto">
          <div className="flex items-center gap-3 p-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow">
              {user?.firstName?.[0] || 'A'}{user?.lastName?.[0] || 'P'}
            </div>
            <div>
              <p className="font-semibold text-xs text-slate-200 truncate max-w-[120px]">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-slate-500">System Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-slate-800 hover:bg-red-950/20 hover:text-red-400 py-3 rounded-xl text-slate-300 font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 pl-64 min-h-screen flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
