import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';

export default function MainLayout() {
  const { user, isAuthenticated, logout, login } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-['Inter'] relative flex flex-col">
      {/* Top Header Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex justify-between items-center h-16 px-margin-desktop max-w-container-max mx-auto w-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-['Montserrat'] font-bold text-xl text-primary">
              VoyagePremium
            </Link>
            <nav className="hidden md:flex gap-6 items-center">
              <Link 
                to="/" 
                className={`text-xs font-semibold hover:text-primary transition-colors ${
                  location.pathname === '/' ? 'text-primary border-b-2 border-primary pb-1' : 'text-slate-500'
                }`}
              >
                Discover
              </Link>
              <Link 
                to="/flights" 
                className={`text-xs font-semibold hover:text-primary transition-colors ${
                  location.pathname === '/flights' ? 'text-primary border-b-2 border-primary pb-1' : 'text-slate-500'
                }`}
              >
                Flights
              </Link>
              <Link 
                to="/hotels" 
                className={`text-xs font-semibold hover:text-primary transition-colors ${
                  location.pathname === '/hotels' ? 'text-primary border-b-2 border-primary pb-1' : 'text-slate-500'
                }`}
              >
                Stays
              </Link>
              {isAuthenticated && (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`text-xs font-semibold hover:text-primary transition-colors ${
                      location.pathname === '/dashboard' ? 'text-primary border-b-2 border-primary pb-1' : 'text-slate-500'
                    }`}
                  >
                    Dashboard
                  </Link>
                  {user?.role === 'Admin' && (
                    <Link 
                      to="/admin" 
                      className="text-xs font-semibold text-accent-yellow bg-accent-yellow/10 px-2.5 py-1 rounded-full hover:bg-accent-yellow/20 transition-all"
                    >
                      Admin Panel
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 cursor-pointer">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 cursor-pointer">
              <span className="material-symbols-outlined text-xl">favorite</span>
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-3">
                <div className="flex flex-col text-right hidden sm:block">
                  <span className="text-xs font-bold text-slate-800 dark:text-white block">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize block">
                    {(user?.role || '').toLowerCase()}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-xs text-slate-500 hover:text-red-500 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-full transition-all cursor-pointer font-semibold"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-primary-container transition-all active:scale-95 shadow cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col pt-16">
        <Outlet />
      </div>

      {/* Reusable Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLoginSuccess={() => {}} 
      />
    </div>
  );
}
