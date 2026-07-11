import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfileManagement() {
  const { user, changePassword } = useAuth();
  const navigate = useNavigate();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      await changePassword(currentPassword, newPassword);
      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to change password. Please verify current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-background text-on-background py-8 px-margin-mobile md:px-margin-desktop max-w-2xl mx-auto w-full">
      <button 
        onClick={() => navigate('/dashboard')}
        className="text-xs text-slate-500 hover:text-primary mb-6 flex items-center gap-1 cursor-pointer font-semibold"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span> Back to dashboard
      </button>

      <div className="space-y-6">
        {/* Profile Details Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="font-['Montserrat'] font-bold text-lg text-slate-800 dark:text-white mb-4">
            Profile Details
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">First Name</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mt-1">{user?.firstName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Last Name</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mt-1">{user?.lastName || '-'}</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Email Address</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mt-1">{user?.email}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">User Role</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize block mt-1">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="font-['Montserrat'] font-bold text-lg text-slate-800 dark:text-white mb-4">
            Update Security Password
          </h2>

          <form onSubmit={handleSubmitPassword} className="space-y-4">
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

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 block">Current Password</label>
              <input 
                type="password"
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block">New Password</label>
                <input 
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block">Confirm New Password</label>
                <input 
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
