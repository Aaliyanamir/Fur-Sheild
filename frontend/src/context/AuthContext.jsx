import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';
import api from '../services/api'; // to handle interceptors if needed

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          // Verify with backend
          const data = await authService.getProfile();
          if (data && data.success) {
            setUser(JSON.parse(storedUser));
          } else {
            throw new Error("Invalid token");
          }
        } catch (error) {
          // Token is stale or invalid
          console.error("Auth validation failed:", error);
          localStorage.removeItem('user');
          sessionStorage.removeItem('user');
          // Clear any cookies if they were used
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          setUser(null);
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    if (data.success) {
      setUser(data);
    }
    return data;
  };

  const register = async (name, email, password, role) => {
    const data = await authService.register(name, email, password, role);
    if (data.success) {
      setUser(data);
    }
    return data;
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

