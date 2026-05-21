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

  useEffect(() => {
    (async () => {
      const res = await getDashboardStats();
      if (res?.success) setStats(res.stats || stats);
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

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Doctors" value={stats.totalDoctors} />
          <StatCard title="Verified" value={stats.verified} />
          <StatCard title="Pending" value={stats.pending} />
          <StatCard title="Inactive" value={stats.inactive} />
        </div>

        <div className="bg-white rounded-2xl border border-[#e1e3e4] p-6">
          <h3 className="text-lg font-bold text-[#00342b]">Quick Notes</h3>
          <p className="text-sm text-[#3f4945] mt-2">
            Use the Doctors section to add, update, verify, or remove physician
            records. Gallery images and profile photos are stored by the PHP
            backend.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
