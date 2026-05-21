import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/admin/StatCard";
import { getDashboardStats } from "../../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    verified: 0,
    pending: 0,
    inactive: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getDashboardStats();
        if (res?.success) setStats(res.stats || stats);
      } catch (e) {
        setError(e.message || "Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#00342b]">
            Dashboard
          </h2>
          <p className="text-sm md:text-base text-[#3f4945] mt-1">
            Overview of doctor records and portal activity
          </p>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#e1e3e4] p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Doctors"
              value={stats.totalDoctors}
              subtitle="All registered physicians"
            />
            <StatCard
              title="Verified"
              value={stats.verified}
              subtitle="Active & accepting patients"
            />
            <StatCard
              title="Pending"
              value={stats.pending}
              subtitle="Awaiting review"
            />
            <StatCard
              title="Inactive"
              value={stats.inactive}
              subtitle="Not accepting patients"
            />
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-white rounded-2xl border border-[#e1e3e4] p-6">
            <h3 className="text-lg font-bold text-[#00342b] mb-2">Quick Actions</h3>
            <div className="space-y-3">
              <a
                href="/admin/doctors"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f3f4f5] transition group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#00342b]/10 flex items-center justify-center text-[#00342b] group-hover:bg-[#00342b] group-hover:text-white transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#191c1d] text-sm">Manage Doctors</p>
                  <p className="text-xs text-[#707975]">View, edit, and update records</p>
                </div>
              </a>
              <a
                href="/admin/settings"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f3f4f5] transition group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#00342b]/10 flex items-center justify-center text-[#00342b] group-hover:bg-[#00342b] group-hover:text-white transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#191c1d] text-sm">Settings</p>
                  <p className="text-xs text-[#707975]">Portal configuration</p>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e1e3e4] p-6">
            <h3 className="text-lg font-bold text-[#00342b] mb-2">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#3f4945]">Public Site</span>
                <span className="flex items-center gap-1.5 text-green-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#3f4945]">Admin Portal</span>
                <span className="flex items-center gap-1.5 text-green-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#3f4945]">PHP Backend API</span>
                <span className={`flex items-center gap-1.5 font-medium ${error ? "text-red-600" : "text-green-600"}`}>
                  <span className={`w-2 h-2 rounded-full inline-block ${error ? "bg-red-500" : "bg-green-500"}`} />
                  {error ? "Error" : "Connected"}
                </span>
              </div>
            </div>
            {error && (
              <p className="text-xs text-red-600 mt-4 bg-red-50 border border-red-200 rounded-xl p-3">
                {error}
              </p>
            )}
            <p className="text-xs text-[#707975] mt-3">
              API: <code className="font-mono">{process.env.REACT_APP_API_URL || "http://localhost/nopm-api"}</code>
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
