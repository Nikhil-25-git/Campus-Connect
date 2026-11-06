import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await axiosClient.get('/auth/me');
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          logout(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axiosClient.post('/auth/login', { email, password });
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        toast.success(res.message || 'Login successful!');
        return { success: true, user: res.user };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await axiosClient.post('/auth/register', formData);
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        toast.success(res.message || 'Registration completed successfully!');
        return { success: true, user: res.user };
      }
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = (notify = true) => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (notify) {
      toast.info('You have been logged out.');
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const res = await axiosClient.put('/auth/profile', profileData);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
        toast.success(res.message || 'Profile updated successfully!');
        return { success: true, user: res.user };
      }
      return { success: false };
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        isStudent: user?.role === 'student',
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
