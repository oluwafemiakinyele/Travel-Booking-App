import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PaymentFailed() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="flex-1 bg-background text-on-background flex items-center justify-center p-6 min-h-[70vh] font-['Inter']">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
          <span className="material-symbols-outlined text-5xl">cancel</span>
        </div>
        <div>
          <h2 className="font-['Montserrat'] font-bold text-2xl text-slate-800 dark:text-white">
            Payment Cancelled
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            The transaction was cancelled or failed to process. Your account has not been charged.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-all"
          >
            Go to Dashboard
          </button>
          {bookingId && (
            <button 
              onClick={() => navigate(`/payment?bookingId=${bookingId}`)}
              className="flex-1 py-3 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-primary/10"
            >
              Retry Payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
