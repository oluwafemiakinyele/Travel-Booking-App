import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await register({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role: 0 // Customer role
      });
      setSuccess('Account created successfully! Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row font-['Inter'] text-slate-100 w-full">
      {/* Left Column: Image banner */}
      <div className="md:w-1/2 relative min-h-[300px] md:min-h-screen overflow-hidden flex items-center justify-center p-8 md:p-16">
        <img 
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80"
          alt="Scenic alpine landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950/65"></div>
        
        <div className="relative z-10 max-w-lg text-center md:text-left">
          <span className="bg-primary/20 border border-primary/30 text-primary-fixed-dim text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
            VoyagePremium Concierge
          </span>
          <h1 className="font-['Montserrat'] text-3xl md:text-5xl font-bold text-white leading-tight mb-6 drop-shadow-md">
            Unlock Privilege
          </h1>
          <p className="text-sm md:text-base text-slate-200 leading-relaxed drop-shadow-sm">
            Create an account today to track your booking histories, manage secure payments, and save your preferred stays and flight lines.
          </p>
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-slate-950 border-t md:border-t-0 md:border-l border-slate-900">
        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="font-['Montserrat'] text-2xl font-bold text-primary mb-2">Create Account</h2>
            <p className="text-xs text-slate-400">Unlock your digital travel concierge</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-950/40 border border-red-900 text-red-200 text-xs rounded-xl p-3 leading-relaxed">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-950/40 border border-emerald-900 text-emerald-200 text-xs rounded-xl p-3 leading-relaxed">
                {success}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 block">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary transition-all text-xs"
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
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary transition-all text-xs"
                />
              </div>
            </div>

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
              <label className="text-[11px] font-semibold text-slate-300 block">Phone Number</label>
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+1 234 567 890"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary transition-all text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary transition-all text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-container text-white font-semibold text-sm rounded-xl shadow-lg transition-all active:scale-95 mt-4 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Creating Account...
                </span>
              ) : (
                'Create Free Account'
              )}
            </button>

            <div className="text-center pt-2 text-xs text-slate-400">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
