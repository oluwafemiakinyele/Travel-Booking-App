import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5184/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const mapBookingObject = (obj) => {
  if (obj && typeof obj === 'object') {
    const statusKey = 'bookingStatus' in obj ? 'bookingStatus' : ('BookingStatus' in obj ? 'BookingStatus' : null);
    if (statusKey) {
      const val = obj[statusKey];
      if (!('status' in obj)) {
        if (val === 'PendingPayment') {
          obj.status = 'Pending';
        } else if (val === 'Confirmed') {
          obj.status = 'Confirmed';
        } else if (val === 'Cancelled') {
          obj.status = 'Cancelled';
        } else {
          obj.status = val;
        }
      }
      if (!('paymentStatus' in obj)) {
        obj.paymentStatus = val === 'Confirmed' ? 'Paid' : 'Unpaid';
      }
    }
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        mapBookingObject(obj[key]);
      }
    }
  }
};

// Response interceptor to handle errors globally (e.g., 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data) {
      mapBookingObject(response.data);
    }
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 Unauthorized and not a login request
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/Auth/login')
    ) {
      originalRequest._retry = true;
      
      // Clean up session and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Notify AuthContext to clear state
      window.dispatchEvent(new Event('auth-logout'));
      
      // Redirect to login using hash routing
      window.location.hash = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
