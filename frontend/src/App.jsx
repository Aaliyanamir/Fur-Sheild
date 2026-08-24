import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Shop from './pages/Shop';
import AvatarStudio from './pages/AvatarStudio';

// Protected Dashboards
import OwnerDashboard from './pages/OwnerDashboard';
import VetDashboard from './pages/VetDashboard';
import ShelterDashboard from './pages/ShelterDashboard';

// Protected Route Guard Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'owner') return <Navigate to="/owner-dashboard" replace />;
    if (role === 'vet') return <Navigate to="/vet-dashboard" replace />;
    if (role === 'shelter') return <Navigate to="/shelter-dashboard" replace />;
  }

  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes wrapped in MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/avatar-studio" element={<AvatarStudio />} />
        </Route>

        {/* Protected Dashboard Routes wrapped in DashboardLayout */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/owner-dashboard"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vet-dashboard"
            element={
              <ProtectedRoute allowedRoles={['vet']}>
                <VetDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shelter-dashboard"
            element={
              <ProtectedRoute allowedRoles={['shelter']}>
                <ShelterDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
