import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex.owner@furshield.com',
    role: 'owner', // 'owner' | 'vet' | 'shelter'
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const switchRole = (newRole) => {
    let mockUser = { ...user, role: newRole };
    if (newRole === 'owner') {
      mockUser.name = 'Alex Johnson (Pet Owner)';
      mockUser.email = 'alex.owner@furshield.com';
    } else if (newRole === 'vet') {
      mockUser.name = 'Dr. Sarah Connor (DVM)';
      mockUser.email = 'dr.connor@furshield.com';
    } else if (newRole === 'shelter') {
      mockUser.name = 'Happy Tails Shelter';
      mockUser.email = 'contact@happytails.org';
    }
    setUser(mockUser);
  };

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, role: user.role, switchRole, login, logout }}>
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
