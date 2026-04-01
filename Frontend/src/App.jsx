import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import ProtectedRoute from './components/routes/ProtectedRoute.jsx';
import PublicRoute from './components/routes/PublicRoute.jsx';

import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import PendingApproval from './pages/auth/PendingApproval.jsx';

import Home from './pages/home/Home.jsx';

import BrowseItems from './pages/items/BrowseItems.jsx';
import ItemDetail from './pages/items/ItemDetail.jsx';
import CreateItem from './pages/items/CreateItem.jsx';
import EditItem from './pages/items/EditItem.jsx';
import MyListings from './pages/items/MyListings.jsx';
import VerifyEmail from './pages/auth/VerifyEmail.jsx';

import Profile from './pages/profile/Profile.jsx';
import EditProfile from './pages/profile/EditProfile.jsx';
import PublicProfile from './pages/profile/PublicProfile.jsx';

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      <Route path="/pending-approval" element={<PendingApproval />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route path="/items" element={<BrowseItems />} />
          <Route path="/items/create" element={<CreateItem />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/items/:id/edit" element={<EditItem />} />
          <Route path="/my-listings" element={<MyListings />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/user/:userId" element={<PublicProfile />} />

        </Route>
      </Route>
    </Routes>
  );
}

export default App;