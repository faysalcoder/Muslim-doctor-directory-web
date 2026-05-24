import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMemberProfile } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

export default function MemberDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const res = await getMemberProfile();
        setData(res.data);
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return <div className="p-8 text-[#00342b] font-semibold">Loading...</div>;

  if (error)
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-sm border p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
            Member Dashboard
          </p>
          <h1 className="text-2xl font-extrabold text-red-600 mt-2">
            Could not load profile
          </h1>
          <p className="text-gray-500 mt-2">{error}</p>
          <p className="text-sm text-gray-400 mt-1">
            Make sure you are logged in as a doctor (member) account, not an
            admin account.
          </p>
          <Link
            to="/doctor-login"
            className="inline-block mt-4 px-5 py-3 rounded-xl bg-[#00342b] text-white font-semibold"
          >
            Go to doctor login
          </Link>
        </div>
      </div>
    );

  const profile = data?.profile || {};
  const stats = data?.stats || {};

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-sm border p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
          Member Dashboard
        </p>
        <div className="d-flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#00342b] mt-2">
              {profile.name || "Doctor Profile"}
            </h1>
            <p className="text-gray-500 mt-1">{profile.email || ""}</p>
          </div>
          <div>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-semibold hover:bg-gray-100 transition mt-3"
            >
              Logout
            </button>

            <div className="border-t my-6" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            ["Forum Posts", stats.forum_posts],
            ["Comments", stats.forum_comments],
            ["Jobs", stats.job_posts],
            ["Availability", stats.availability],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border p-4 bg-gray-50">
              <div className="text-xs uppercase tracking-[0.2em] text-gray-500">
                {label}
              </div>
              <div className="text-2xl font-bold text-[#00342b] mt-1">
                {value || 0}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-6">
          <Link
            to="/account/profile"
            className="px-5 py-3 rounded-xl bg-[#00342b] text-white font-semibold"
          >
            Edit profile
          </Link>
          <Link
            to="/account/posts"
            className="px-5 py-3 rounded-xl border font-semibold"
          >
            Your posts
          </Link>
          <Link
            to="/forum/create"
            className="px-5 py-3 rounded-xl border font-semibold"
          >
            Create forum post
          </Link>
          <Link
            to="/jobs/create"
            className="px-5 py-3 rounded-xl border font-semibold"
          >
            Post a job
          </Link>
        </div>
      </div>
    </div>
  );
}
