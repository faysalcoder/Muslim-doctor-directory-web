import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-[#00342b] font-semibold text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
