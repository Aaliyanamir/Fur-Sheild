import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="w-12 h-12 border-4 border-camel-200 border-t-camel-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If no user is logged in, send them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and the user doesn't have it
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />; 
  }

  // Otherwise, render the protected component
  return <Outlet />;
}
