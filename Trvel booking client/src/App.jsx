import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import VoyagePremiumBooking from './pages/VoyagePremiumBooking';
import FlightsSearchResults from './pages/FlightsSearchResults';
import FlightDetails from './pages/FlightDetails';
import HotelsSearchResults from './pages/HotelsSearchResults';
import HotelDetails from './pages/HotelDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Customer Pages
import UserDashboard from './pages/UserDashboard';
import ProfileManagement from './pages/ProfileManagement';
import BookingHistory from './pages/BookingHistory';
import BookingDetails from './pages/BookingDetails';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import FlightManagement from './pages/FlightManagement';
import HotelManagement from './pages/HotelManagement';
import BookingManagement from './pages/BookingManagement';
import RevenueAnalytics from './pages/RevenueAnalytics';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const token = localStorage.getItem('token');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mb-3"></div>
        <span>Validating security session...</span>
      </div>
    );
  }

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  const token = localStorage.getItem('token');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mb-3"></div>
        <span>Authorizing system clearances...</span>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function NonAdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mb-3"></div>
        <span>Validating security session...</span>
      </div>
    );
  }

  if (user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="w-full min-h-screen bg-background text-on-background relative flex flex-col">
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Public & Customer pages sharing MainLayout */}
            <Route element={<NonAdminRoute><MainLayout /></NonAdminRoute>}>
              <Route path="/" element={<VoyagePremiumBooking />} />
              <Route path="/flights" element={<FlightsSearchResults />} />
              <Route path="/flights/:id" element={<FlightDetails />} />
              <Route path="/hotels" element={<HotelsSearchResults />} />
              <Route path="/hotels/:id" element={<HotelDetails />} />
              
              {/* Protected Customer Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfileManagement /></ProtectedRoute>} />
              <Route path="/bookings" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
              <Route path="/bookings/:id" element={<ProtectedRoute><BookingDetails /></ProtectedRoute>} />
              <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
              <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
              <Route path="/payment/failed" element={<ProtectedRoute><PaymentFailed /></ProtectedRoute>} />
            </Route>

            {/* Protected Admin Routes sharing AdminLayout */}
            <Route path="/admin" element={<ProtectedRoute><AdminRoute><AdminLayout /></AdminRoute></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="flights" element={<FlightManagement />} />
              <Route path="hotels" element={<HotelManagement />} />
              <Route path="bookings" element={<BookingManagement />} />
              <Route path="revenue" element={<RevenueAnalytics />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
