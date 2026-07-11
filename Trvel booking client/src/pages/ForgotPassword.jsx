import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await forgotPassword(email);
      setSuccess(result.message || 'Reset instructions sent successfully!');
    } catch (err) {
      setError(err.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-['Inter']">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-slate-100">
        <div className="text-center mb-8">
          <h1 className="font-['Montserrat'] text-2xl font-bold text-primary mb-2">VoyagePremium</h1>
          <p className="text-sm text-slate-400">Password Recovery</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-950/40 border border-red-900 text-red-200 text-xs rounded-xl p-3">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-950/40 border border-emerald-900 text-emerald-200 text-xs rounded-xl p-3 leading-relaxed">
              {success}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@travelbooking.com"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary-container text-white font-semibold rounded-xl shadow-lg transition-all active:scale-95 mt-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-400">
          <Link to="/login" className="text-primary hover:underline font-semibold">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
