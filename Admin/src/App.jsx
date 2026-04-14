import React from 'react'
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/auth/AdminLogin';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AdminProtectedRoute from './components/routes/AdminProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />

      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>

  )
}

export default App