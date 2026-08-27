import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalLayout from './components/organisms/GlobalLayout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OwnerDashboard from './pages/OwnerDashboard';
import MyPets from './pages/MyPets';
import VetHub from './pages/VetHub';
import VetAppointments from './pages/VetAppointments';
import ShelterHub from './pages/ShelterHub';
import ShelterDashboard from './pages/ShelterDashboard';
import ShopCatalog from './pages/ShopCatalog';
import Checkout from './pages/Checkout';
import SuperAdmin from './pages/SuperAdmin';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';
import AdoptionCatalog from './pages/AdoptionCatalog';
import BookAppointment from './pages/BookAppointment';
import MyOrders from './pages/MyOrders';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        <Route path="/adopt" element={<AdoptionCatalog />} />
          
          {/* App Routes wrapped in the Global Layout */}
          <Route element={<GlobalLayout />}>
            <Route path="/shop" element={<ShopCatalog />} />
        <Route path="/checkout" element={<Checkout />} />

                        {/* Protected Routes - Only logged-in users */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={
          <ProtectedRoute>
            <SuperAdmin />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={<OwnerDashboard />} />
              <Route path="/my-pets" element={<MyPets />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/book-appointment" element={<BookAppointment />} />
            </Route>

            {/* Protected Routes - Strictly for Vets */}
            <Route element={<ProtectedRoute allowedRoles={['VET']} />}>
              <Route path="/vet" element={<VetHub />} />
              <Route path="/appointments" element={<VetAppointments />} />
            </Route>

            {/* Protected Routes - Strictly for Shelter Admins */}
            <Route element={<ProtectedRoute allowedRoles={['SHELTER_ADMIN']} />}>
              <Route path="/shelter" element={<ShelterDashboard />} />
              <Route path="/pipeline" element={<ShelterHub />} />
            </Route>
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}


