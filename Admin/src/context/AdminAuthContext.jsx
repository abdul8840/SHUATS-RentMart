import { createContext, useState, useEffect } from 'react';
import { adminGetMeAPI } from '../api/axios.js';

export const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchAdmin();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchAdmin = async () => {
    try {
      const { data } = await adminGetMeAPI();
      if (data.success && data.user.role === 'admin') {
        setAdmin(data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Admin auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (tokenValue, userData) => {
    if (userData.role !== 'admin') {
      return false;
    }
    localStorage.setItem('admin_token', tokenValue);
    localStorage.setItem('admin_user', JSON.stringify(userData));
    setToken(tokenValue);
    setAdmin(userData);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, token, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};