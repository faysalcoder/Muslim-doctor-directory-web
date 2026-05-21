import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/admin/Dashboard";
import Doctors from "./pages/admin/Doctors";
import Settings from "./pages/admin/Settings";
import ProtectedRoute from "./auth/ProtectedRoute";
import PublicLayout from "./components/PublicLayout";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ContactPage from "./pages/ContactPage";
import DoctorProfilePage from "./pages/DoctorProfilePage";
import ComingSoonModal from "./components/ComingSoonModal";

// ─────────────────────────────────────────────
// 0 = Coming Soon mode — every route shows only
//     the popup, nothing else is accessible
// 1 = Live mode — full site works normally
// ─────────────────────────────────────────────
const SITE_MODE = 0;

export default function App() {
  // ── Coming Soon mode ──────────────────────
  if (SITE_MODE === 0) {
    return <ComingSoonModal />;
  }

  // ── Live mode ─────────────────────────────
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/doctor/:id" element={<DoctorProfilePage />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Admin Routes (protected) */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <ProtectedRoute>
            <Doctors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
