import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthLogout = () => {
      logout();
    };
    window.addEventListener('auth-logout', handleAuthLogout);

    // Restore session on mount
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);

    return () => {
      window.removeEventListener('auth-logout', handleAuthLogout);
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/Auth/login', { email, password });
      const { accessToken, refreshToken } = response.data;
      
      // Decode JWT token payload to extract claims (e.g. role, name, id)
      const payloadBase64 = accessToken.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      
      // Claims mapping:
      // http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier -> User ID
      // http://schemas.microsoft.com/ws/2008/06/identity/claims/role -> User Role
      const userId = decodedPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      const role = decodedPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      const userEmail = decodedPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || email;
      
      const loggedInUser = {
        id: userId,
        email: userEmail,
        role: role, // "Admin" or "Customer"
        firstName: decodedPayload.given_name || userEmail.split('@')[0],
        lastName: decodedPayload.family_name || ''
      };

      setToken(accessToken);
      setUser(loggedInUser);
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      
      return loggedInUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || { message: 'Authentication failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const response = await axiosInstance.post('/Auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Extract specific validation errors if present from FluentValidation
      if (error.response?.data?.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat().join(' ');
        throw { message: validationErrors };
      }
      
      throw error.response?.data || { message: 'Registration failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axiosInstance.post('/Auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to request password reset' };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await axiosInstance.post('/Auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reset password' };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await axiosInstance.post('/Auth/change-password', { currentPassword, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to change password' };
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'Admin',
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
