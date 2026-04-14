import { useContext } from 'react';
import { AdminAuthContext } from '../context/AdminAuthContext.jsx';

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};