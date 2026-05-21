import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
