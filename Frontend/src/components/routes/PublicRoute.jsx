import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import Loader from '../common/Loader.jsx';

const PublicRoute = () => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader />;
  }

  if (token && user && user.accountStatus === 'approved') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;