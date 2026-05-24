import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import DoctorLogin from "./pages/auth/DoctorLogin";
import DoctorSignup from "./pages/auth/DoctorSignup";
import Dashboard from "./pages/admin/Dashboard";
import Doctors from "./pages/admin/Doctors";
import Settings from "./pages/admin/Settings";
import ForumModeration from "./pages/admin/ForumModeration";
import JobsAdmin from "./pages/admin/JobsAdmin";
import MemberUsers from "./pages/admin/MemberUsers";
import MemberDashboard from "./pages/member/Dashboard";
import MemberProfile from "./pages/member/Profile";
import YourPosts from "./pages/member/YourPosts";
import ForumList from "./pages/forum/ForumList";
import ForumDetail from "./pages/forum/ForumDetail";
import CreateForumPost from "./pages/forum/CreatePost";
import JobsPage from "./pages/jobs/JobsPage";
import CreateJobPost from "./pages/jobs/CreateJob";
import AvailableDoctorsPage from "./pages/jobs/AvailableDoctorsPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import PublicLayout from "./components/PublicLayout";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ContactPage from "./pages/ContactPage";
import DoctorProfilePage from "./pages/DoctorProfilePage";
import ComingSoonModal from "./components/ComingSoonModal";

const SITE_MODE = 0;

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/doctor-login" element={<DoctorLogin />} />
      <Route path="/doctor-signup" element={<DoctorSignup />} />

      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={["admin", "super_admin"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <ProtectedRoute roles={["admin", "super_admin"]}>
            <Doctors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={["admin", "super_admin"]}>
            <MemberUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/forum"
        element={
          <ProtectedRoute roles={["admin", "super_admin"]}>
            <ForumModeration />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/jobs"
        element={
          <ProtectedRoute roles={["admin", "super_admin"]}>
            <JobsAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute roles={["admin", "super_admin"]}>
            <Settings />
          </ProtectedRoute>
        }
      />

      {SITE_MODE === 0 ? (
        <>
          <Route path="/" element={<ComingSoonModal />} />
          <Route path="*" element={<ComingSoonModal />} />
        </>
      ) : (
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/doctor/:id" element={<DoctorProfilePage />} />
          <Route path="/forum" element={<ForumList />} />
          <Route
            path="/forum/create"
            element={
              <ProtectedRoute roles={["member", "admin", "super_admin"]}>
                <CreateForumPost />
              </ProtectedRoute>
            }
          />
          <Route path="/forum/:id" element={<ForumDetail />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route
            path="/jobs/create"
            element={
              <ProtectedRoute roles={["member", "admin", "super_admin"]}>
                <CreateJobPost />
              </ProtectedRoute>
            }
          />
          <Route path="/jobs/available" element={<AvailableDoctorsPage />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute roles={["member"]}>
                <MemberDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/profile"
            element={
              <ProtectedRoute roles={["member"]}>
                <MemberProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/posts"
            element={
              <ProtectedRoute roles={["member"]}>
                <YourPosts />
              </ProtectedRoute>
            }
          />
        </Route>
      )}

      <Route
        path="*"
        element={<Navigate to={SITE_MODE === 0 ? "/" : "/"} replace />}
      />
    </Routes>
  );
}
