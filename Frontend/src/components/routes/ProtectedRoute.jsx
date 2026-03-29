import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import Loader from '../common/Loader.jsx';

const ProtectedRoute = () => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader />;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin' && user.accountStatus === 'pending') {
    return <Navigate to="/pending-approval" replace />;
  }

  if (user.role !== 'admin' && user.accountStatus === 'rejected') {
    return <Navigate to="/pending-approval" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;