import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Fetch full profile from /auth/me
  const fetchProfile = useCallback(async (jwt) => {
    try {
      const res = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const { userId, email, firstName, lastName, role, permissions } = res.data;
      const profile = { token: jwt, userId, email, firstName, lastName, role, permissions: permissions || [] };
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
      localStorage.setItem('permissions', JSON.stringify(permissions || []));
      setUser(profile);
    } catch {
      // Token invalid or expired — clear everything
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      localStorage.removeItem('permissions');
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (token) {
      // Hydrate from localStorage first for instant UI, then verify with /me
      const role = localStorage.getItem('role');
      const userId = localStorage.getItem('userId');
      const perms = localStorage.getItem('permissions');
      setUser({
        token,
        role,
        userId: userId ? Number(userId) : null,
        permissions: perms ? JSON.parse(perms) : [],
      });
      fetchProfile(token).finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token, fetchProfile]);

  const login = async ({ token: jwt, role, userId, permissions }) => {
    localStorage.setItem('token', jwt);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
    localStorage.setItem('permissions', JSON.stringify(permissions || []));
    setToken(jwt);
    setUser({ token: jwt, role, userId, permissions: permissions || [] });
    // Fetch full profile in background
    await fetchProfile(jwt);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('permissions');
    setToken(null);
    setUser(null);
  };

  // Permission helpers
  const isAdmin = () => user?.role === 'ROLE_STAFF' || user?.role === 'ROLE_SUPER_ADMIN';
  const isCustomer = () => user?.role === 'ROLE_CUSTOMER';
  const isSuperAdmin = () => user?.role === 'ROLE_SUPER_ADMIN';
  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'ROLE_SUPER_ADMIN') return true;
    return user.permissions?.includes(permission) ?? false;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isCustomer, isSuperAdmin, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
