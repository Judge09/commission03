/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 */

import { createContext, useContext, useState, useEffect } from 'react';
import {
  getUser,
  getAccessToken,
  setAuthTokens,
  clearAuthTokens,
  isAuthenticated,
  logout as logoutUtil,
} from '../utils/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);

  /**
   * Check authentication status on mount and set up token refresh
   */
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const currentUser = getUser();

      setIsAuthenticatedState(authenticated);
      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, []);

  /**
   * Login method
   * @param {string} accessToken - JWT access token
   * @param {string} refreshToken - JWT refresh token
   * @param {object} userData - User data object
   */
  const login = (accessToken, refreshToken, userData) => {
    setAuthTokens(accessToken, refreshToken, userData);
    setUser(userData);
    setIsAuthenticatedState(true);
  };

  /**
   * Logout method
   */
  const logout = async () => {
    await logoutUtil();
    setUser(null);
    setIsAuthenticatedState(false);
  };

  /**
   * Update user data
   * @param {object} userData - Updated user data
   */
  const updateUser = (userData) => {
    setAuthTokens(getAccessToken(), null, userData);
    setUser(userData);
  };

  const value = {
    user,
    loading,
    isAuthenticated: isAuthenticatedState,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
