import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to appropriate workspace
    if (isAuthenticated && user) {
      if (user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser && loggedInUser.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const autofillAdmin = () => {
    setEmail('admin@travelbooking.com');
    setPassword('Admin@123');
  };

  const autofillUser = () => {
    setEmail('user@travelbooking.com');
    setPassword('User@123');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row font-['Inter'] text-slate-100 w-full">
      {/* Left Column: Aspirational Image */}
      <div className="md:w-1/2 relative min-h-[300px] md:min-h-screen overflow-hidden flex items-center justify-center p-8 md:p-16">
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80"
          alt="Luxury beach sunset"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950/65"></div>
        
        <div className="relative z-10 max-w-lg text-center md:text-left">
          <span className="bg-primary/20 border border-primary/30 text-primary-fixed-dim text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
            VoyagePremium Concierge
          </span>
          <h1 className="font-['Montserrat'] text-3xl md:text-5xl font-bold text-white leading-tight mb-6 drop-shadow-md">
            Start Your Voyage
          </h1>
          <p className="text-sm md:text-base text-slate-200 leading-relaxed drop-shadow-sm">
            Discover curated luxury stays, premier flights, and bespoke travel experiences. Sign in to access your digital concierge and unlock elite privileges.
          </p>
        </div>
      </div>

      {/* Right Column: Authentication Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-slate-950 border-t md:border-t-0 md:border-l border-slate-900">
        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="font-['Montserrat'] text-2xl font-bold text-primary mb-2">VoyagePremium</h2>
            <p className="text-xs text-slate-400">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-950/40 border border-red-900 text-red-200 text-xs rounded-xl p-3 leading-relaxed">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 block">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="traveler@voyage.com"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary transition-all text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-semibold text-slate-300 block">Password</label>
                <Link to="/forgot-password" className="text-[10px] text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary transition-all text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-container text-white font-semibold text-sm rounded-xl shadow-lg transition-all active:scale-95 mt-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Please wait...
                </span>
              ) : (
                'Sign In to Voyage'
              )}
            </button>

            <div className="text-center pt-2 text-xs text-slate-400">
              <p>
                Don't have an account yet?{' '}
                <Link to="/register" className="text-primary font-bold hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex gap-2 justify-center text-[10px]">
              <button
                type="button"
                onClick={autofillAdmin}
                className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                Admin Autofill
              </button>
              <button
                type="button"
                onClick={autofillUser}
                className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                User Autofill
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
