import React from 'react'
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/auth/AdminLogin';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AdminProtectedRoute from './components/routes/AdminProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import PendingApprovals from './pages/users/PendingApprovals';
import AllUsers from './pages/users/AllUsers';
import UserDetail from './pages/users/UserDetail';
import ManageItems from './pages/items/ManageItems';
import ItemDetail from './pages/items/ItemDetail';

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

          <Route path="/items" element={<ManageItems />} />
          <Route path="/items/:id" element={<ItemDetail />} />


        </Route>
      </Route>
    </Routes>

  )
}

export default App