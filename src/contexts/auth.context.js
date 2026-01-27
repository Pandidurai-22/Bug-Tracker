// src/contexts/auth.context.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/auth.service';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const userData = await AuthService.login(username, password);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (username, email, password) => {
    try {
      await AuthService.register(username, email, password);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const mockAdminLogin = () => {
    // Create a mock admin user object (works without backend)
    const mockAdminUser = {
      id: 999,
      username: 'admin',
      email: 'admin@bugtracker.com',
      accessToken: 'mock-admin-token-' + Date.now(),
      roles: [{ name: 'ROLE_ADMIN' }],
      type: 'Bearer'
    };
    
    // Store in localStorage (same format as real login)
    localStorage.setItem('user', JSON.stringify(mockAdminUser));
    
    // Update context state
    setUser(mockAdminUser);
    setIsAuthenticated(true);
    
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
        mockAdminLogin
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Add the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};