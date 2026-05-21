import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { NavLink } from 'react-router-dom';

const mobileNavItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
  { label: 'Doctors', path: '/admin/doctors', icon: '👨‍⚕️' },
  { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
];

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        {/* Mobile bottom nav */}
        <nav className="lg:hidden flex border-t border-[#e1e3e4] bg-white sticky bottom-0 z-40">
          {mobileNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-3 text-xs font-semibold transition-colors ${
                  isActive ? 'text-[#00342b]' : 'text-[#707975]'
                }`
              }
            >
              <span className="text-lg mb-0.5">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
