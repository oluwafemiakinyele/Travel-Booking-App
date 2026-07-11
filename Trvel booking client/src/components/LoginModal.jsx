import React, { useState } from 'react';
import { api } from '../services/api';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await api.auth.register({
          firstName,
          lastName,
          email,
          password,
          phoneNumber,
          role: 0 // User role
        });
        setSuccess('Registration successful! You can now log in.');
        setIsRegister(false);
      } else {
        const data = await api.auth.login(email, password);
        onLoginSuccess(data.user || { email, role: data.role });
        onClose();
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@travelbooking.com');
    setPassword('Admin@123');
    setIsRegister(false);
  };

  const fillUserCredentials = () => {
    setEmail('user@travelbooking.com');
    setPassword('User@123');
    setIsRegister(false);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 font-['Inter']">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Card */}
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl relative z-10 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-primary p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="font-['Montserrat'] font-bold text-lg">
              {isRegister ? 'Create an Account' : 'Welcome to VoyagePremium'}
            </h3>
            <p className="text-white/70 text-xs mt-0.5">
              {isRegister ? 'Sign up to manage your luxury travels' : 'Sign in to access your digital concierge'}
            </p>
          </div>
          <button
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-100">
          {error && (
            <div className="bg-red-950/40 border border-red-900 text-red-200 text-xs rounded-xl p-3">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-950/40 border border-emerald-900 text-emerald-200 text-xs rounded-xl p-3">
              {success}
            </div>
          )}

          {isRegister && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 block">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary transition-all text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 block">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary transition-all text-xs"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300 block">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. traveler@voyage.com"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary transition-all text-xs"
            />
          </div>

          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 block">Phone Number</label>
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+234..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary transition-all text-xs"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300 block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary transition-all text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary-container text-white font-semibold text-sm rounded-xl shadow-lg transition-all active:scale-95 mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                Processing...
              </span>
            ) : isRegister ? (
              'Create Free Account'
            ) : (
              'Sign In'
            )}
          </button>

          <div className="text-center pt-2 text-xs text-slate-400">
            {isRegister ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegister(false); setError(null); }}
                  className="text-primary font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegister(true); setError(null); }}
                  className="text-primary font-bold hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
          
          {!isRegister && (
            <div className="mt-4 pt-4 border-t border-slate-800/60 flex gap-2 justify-center text-[10px]">
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="px-2 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                Autofill Admin
              </button>
              <button
                type="button"
                onClick={fillUserCredentials}
                className="px-2 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                Autofill User
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
