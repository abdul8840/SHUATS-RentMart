import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AdminAuthContext } from '../../context/AdminAuthContext.jsx';
import Loader from '../common/Loader.jsx';

const AdminProtectedRoute = () => {
  const { admin, token, loading } = useContext(AdminAuthContext);

  if (loading) {
    return <Loader />;
  }

  if (!token || !admin || admin.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;