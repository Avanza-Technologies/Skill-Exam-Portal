import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('ns_user_profile');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('ns_access_token') || null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth & verify token with backend
  useEffect(() => {
    async function initAuth() {
      const savedToken = localStorage.getItem('ns_access_token');
      if (savedToken) {
        try {
          const res = await authApi.getProfile();
          if (res?.data) {
            setUser(res.data);
            localStorage.setItem('ns_user_profile', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session verification failed or token expired:', err.message);
          // If unauthorized, clear invalid session
          if (err.status === 401 || err.status === 403) {
            logout();
          }
        }
      }
      setIsLoading(false);
    }

    initAuth();
  }, []);

  const login = useCallback(async (usernameOrEmail, password) => {
    const res = await authApi.login(usernameOrEmail, password);
    if (res?.data) {
      const { accessToken, refreshToken, ...profile } = res.data;
      localStorage.setItem('ns_access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('ns_refresh_token', refreshToken);
      }
      localStorage.setItem('ns_user_profile', JSON.stringify(profile));
      setToken(accessToken);
      setUser(profile);
      return profile;
    }
    throw new Error(res?.message || 'Login failed');
  }, []);

  const register = useCallback(async (userData) => {
    const res = await authApi.register(userData);
    if (res?.data) {
      const { accessToken, refreshToken, ...profile } = res.data;
      localStorage.setItem('ns_access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('ns_refresh_token', refreshToken);
      }
      localStorage.setItem('ns_user_profile', JSON.stringify(profile));
      setToken(accessToken);
      setUser(profile);
      return profile;
    }
    throw new Error(res?.message || 'Registration failed');
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('ns_access_token');
      localStorage.removeItem('ns_refresh_token');
      localStorage.removeItem('ns_user_profile');
    } catch {
      // ignore storage errors
    }
    setToken(null);
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await authApi.getProfile();
      if (res?.data) {
        setUser(res.data);
        localStorage.setItem('ns_user_profile', JSON.stringify(res.data));
        return res.data;
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
    return null;
  }, []);

  // Role helper checks
  const roles = user?.roles || [];
  const isSuperAdmin = roles.includes('ROLE_SUPER_ADMIN') || roles.includes('SUPER_ADMIN');
  const isHR = roles.includes('ROLE_HR_ADMIN') || roles.includes('HR_ADMIN') || isSuperAdmin;
  const isManager = roles.includes('ROLE_MANAGER') || roles.includes('MANAGER') || isHR;
  const isEmployee = roles.includes('ROLE_EMPLOYEE') || roles.includes('EMPLOYEE');

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    refreshProfile,
    isSuperAdmin,
    isHR,
    isManager,
    isEmployee,
    roles,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
