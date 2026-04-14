import React from 'react'
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/auth/AdminLogin';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AdminProtectedRoute from './components/routes/AdminProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import PendingApprovals from './pages/users/PendingApprovals';
import AllUsers from './pages/users/AllUsers';
import UserDetail from './pages/users/UserDetail';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />

      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<AdminDashboard />} />

          <Route path="/users/pending" element={<PendingApprovals />} />
          <Route path="/users" element={<AllUsers />} />
          <Route path="/users/:id" element={<UserDetail />} />


        </Route>
      </Route>
    </Routes>

  )
}

export default App