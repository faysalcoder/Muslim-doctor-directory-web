import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function Settings() {
  return (
    <AdminLayout>
      <div className="bg-white rounded-2xl border border-[#e1e3e4] p-6">
        <h2 className="text-2xl font-extrabold text-[#00342b]">Settings</h2>
        <p className="text-sm text-[#3f4945] mt-2">Portal settings, branding, and admin roles can be managed here.</p>
      </div>
    </AdminLayout>
  );
}
