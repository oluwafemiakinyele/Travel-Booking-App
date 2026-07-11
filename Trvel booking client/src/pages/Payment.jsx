import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

export default function Payment() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      setError('Missing bookingId parameter.');
      setLoading(false);
      return;
    }
    initializeCheckout();
  }, [bookingId]);

  const initializeCheckout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Calculate callback URL
      // E.g. http://localhost:5173/#/payment/success
      const callbackUrl = `${window.location.origin}/#/payment/success`;
      
      const payload = {
        bookingId: bookingId,
        callbackUrl: callbackUrl
      };

      const response = await axiosInstance.post('/Payments/initialize', payload);
      const data = response.data;
      const authorizationUrl = data?.authorizationUrl || data?.AuthorizationUrl || data?.data?.authorizationUrl || data?.data?.AuthorizationUrl;
      
      if (authorizationUrl) {
        // Redirect browser to Paystack checkout portal
        window.location.href = authorizationUrl;
      } else {
        const keys = Object.keys(data || {}).join(', ');
        throw new Error(`Failed to retrieve authorization URL from Paystack API. Properties returned: ${keys || 'none'}.`);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Payment initialization failed.');
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-background text-on-background flex items-center justify-center p-6 font-['Inter']">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-6">
        {loading ? (
          <>
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <div>
              <h2 className="font-['Montserrat'] font-bold text-lg text-slate-800 dark:text-white">
                Initializing Secure Checkout
              </h2>
              <p className="text-xs text-slate-500 mt-2">
                We are routing you to our secure Paystack transaction portal. Please do not refresh the page.
              </p>
            </div>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-5xl text-red-500">error</span>
            <div>
              <h2 className="font-['Montserrat'] font-bold text-lg text-slate-800 dark:text-white">
                Payment Failed to Initialize
              </h2>
              <p className="text-xs text-slate-500 mt-2">
                {error}
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-all"
              >
                Back to Dashboard
              </button>
              <button 
                onClick={initializeCheckout}
                className="flex-1 py-3 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-md shadow-primary/10"
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
