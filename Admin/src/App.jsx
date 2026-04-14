import React from 'react'
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/auth/AdminLogin';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />

      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>

        </Route>
      </Route>
    </Routes>

  )
}

export default App