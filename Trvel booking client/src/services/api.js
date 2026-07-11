const API_BASE_URL = 'http://localhost:5184/api';

// Helper to get authorization headers
const getHeaders = (contentType = 'application/json') => {
  const headers = {};
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth API
  auth: {
    login: async (email, password) => {
      const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Login failed');
      }
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || { email, role: data.role }));
      return data;
    },
    register: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/Auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Registration failed');
      }
      return response.json();
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    getCurrentUser: () => {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    },
    getToken: () => {
      return localStorage.getItem('token');
    }
  },

  // Flights API
  flights: {
    search: async (params = {}) => {
      const query = new URLSearchParams();
      if (params.departureCity) query.append('DepartureCity', params.departureCity);
      if (params.arrivalCity) query.append('ArrivalCity', params.arrivalCity);
      if (params.departureDate) query.append('DepartureDate', params.departureDate);
      if (params.maxPrice) query.append('MaxPrice', params.maxPrice);

      const response = await fetch(`${API_BASE_URL}/Flights?${query.toString()}`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch flights');
      return response.json();
    },
    getById: async (id) => {
      const response = await fetch(`${API_BASE_URL}/Flights/${id}`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch flight details');
      return response.json();
    }
  },

  // Hotels API
  hotels: {
    search: async (params = {}) => {
      const query = new URLSearchParams();
      if (params.city) query.append('City', params.city);
      if (params.maxPricePerNight) query.append('MaxPricePerNight', params.maxPricePerNight);
      if (params.minRating) query.append('MinRating', params.minRating);

      const response = await fetch(`${API_BASE_URL}/Hotels?${query.toString()}`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch hotels');
      return response.json();
    },
    getById: async (id) => {
      const response = await fetch(`${API_BASE_URL}/Hotels/${id}`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch hotel details');
      return response.json();
    },
    create: async (hotelData) => {
      const response = await fetch(`${API_BASE_URL}/Hotels`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(hotelData),
      });
      if (!response.ok) throw new Error('Failed to create hotel');
      return response.json();
    },
    update: async (id, hotelData) => {
      const response = await fetch(`${API_BASE_URL}/Hotels/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(hotelData),
      });
      if (!response.ok) throw new Error('Failed to update hotel');
      return response.json();
    },
    delete: async (id) => {
      const response = await fetch(`${API_BASE_URL}/Hotels/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete hotel');
      return response;
    }
  },

  // Bookings API
  bookings: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/Bookings`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return response.json();
    },
    create: async (bookingData) => {
      const response = await fetch(`${API_BASE_URL}/Bookings`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) throw new Error('Failed to create booking');
      return response.json();
    }
  }
};
