import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const getReferenceFromUrl = () => {
    // 1. Try standard react-router search params (after hash)
    let ref = searchParams.get('reference') || searchParams.get('trxref');
    if (ref && ref !== 'null' && ref !== 'undefined') return ref;

    // 2. Try window.location.search (before hash, e.g. /?ref=X#/path)
    const urlParams = new URLSearchParams(window.location.search);
    ref = urlParams.get('reference') || urlParams.get('trxref');
    if (ref && ref !== 'null' && ref !== 'undefined') return ref;

    // 3. Try manual parsing of hash query string
    const hash = window.location.hash;
    const hashQueryIdx = hash.indexOf('?');
    if (hashQueryIdx !== -1) {
      const hashParams = new URLSearchParams(hash.substring(hashQueryIdx));
      ref = hashParams.get('reference') || hashParams.get('trxref');
      if (ref && ref !== 'null' && ref !== 'undefined') return ref;
    }

    return null;
  };

  const reference = getReferenceFromUrl();
  
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!reference) {
      setError('No valid payment reference found. We could not verify this transaction.');
      setVerifying(false);
      return;
    }
    verifyPayment();
  }, [reference]);

  const verifyPayment = async () => {
    try {
      setVerifying(true);
      setError(null);
      
      // Call backend verification
      const response = await axiosInstance.get(`/Payments/verify/${reference}`);
      const data = response.data; // Expected response: booking details or verification status
      
      setSuccess(true);
      const booking = data.booking || data.Booking;
      const bookingId = data.bookingId || data.BookingId;
      
      if (data && booking) {
        setBookingDetails(booking);
      } else if (data && bookingId) {
        // If only bookingId is returned, fetch details
        const bookingRes = await axiosInstance.get(`/Bookings/${bookingId}`);
        setBookingDetails(bookingRes.data);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.response?.data?.message || err.message || 'Payment verification failed. Please contact support if you were debited.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex-1 bg-background text-on-background flex items-center justify-center p-6 min-h-[70vh] font-['Inter']">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-xl text-center space-y-6">
        {verifying ? (
          <div className="space-y-6 py-6">
            <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <div>
              <h2 className="font-['Montserrat'] font-bold text-xl text-slate-800 dark:text-white">
                Verifying Your Payment
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Securing confirmation for reference: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-primary font-mono text-xs">{reference}</code>. Please wait...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
              <span className="material-symbols-outlined text-5xl">warning</span>
            </div>
            <div>
              <h2 className="font-['Montserrat'] font-bold text-xl text-slate-800 dark:text-white">
                Verification Issue
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                {error}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-all"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={verifyPayment}
                className="flex-1 py-3.5 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-primary/10"
              >
                Retry Verification
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500 animate-bounce">
              <span className="material-symbols-outlined text-5xl font-bold">check_circle</span>
            </div>
            <div>
              <h2 className="font-['Montserrat'] font-bold text-2xl text-slate-800 dark:text-white">
                Booking Confirmed!
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Your payment of premium stay/flight was processed successfully.
              </p>
            </div>

            {bookingDetails && (
              <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl p-5 text-left space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Booking ID</span>
                  <span className="font-mono text-xs text-slate-700 dark:text-slate-350">{bookingDetails.id?.substring(0, 8)}...</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Service Type</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-white">{bookingDetails.bookingType}</span>
                </div>
                {bookingDetails.bookingType === 'Flight' ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase">Flight</span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-white">
                        {bookingDetails.flight?.airline} ({bookingDetails.flight?.flightNumber})
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase">Route</span>
                      <span className="text-sm font-semibold text-slate-850 dark:text-slate-200">
                        {bookingDetails.flight?.departureCity} ➔ {bookingDetails.flight?.arrivalCity}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase">Hotel</span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-white">
                        {bookingDetails.hotel?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase">Check-in</span>
                      <span className="text-sm font-semibold text-slate-850 dark:text-slate-200">
                        {new Date(bookingDetails.checkInDate).toLocaleDateString()}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center border-t border-slate-200/50 dark:border-slate-800 pt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Payment Status</span>
                  <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                    PAID
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-all"
              >
                Go to Dashboard
              </button>
              {bookingDetails && (
                <button 
                  onClick={() => navigate(`/bookings/${bookingDetails.id}`)}
                  className="flex-1 py-3.5 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-primary/10"
                >
                  View Details
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
