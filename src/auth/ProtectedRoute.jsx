import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-[#00342b] font-semibold text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (roles.length && !roles.includes(user.role)) {
    // Admins trying to access member-only pages → go to admin dashboard
    if (user.role === 'admin' || user.role === 'super_admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Members trying to access admin-only pages → go home
    return <Navigate to="/" replace />;
  }

  return children;
}
