import React from 'react';
import { NavLink } from 'react-router-dom';

const navClass = ({ isActive }) =>
  `block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
    isActive ? 'bg-[#00342b] text-white' : 'text-[#3f4945] hover:bg-[#e7e8e9]'
  }`;

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-72 flex-col border-r border-[#bfc9c4] bg-white">
      <div className="p-6 border-b border-[#e1e3e4]">
        <div className="text-[#00342b] text-xl font-extrabold leading-tight">NETWORK OF MUSLIM PHYSICIANS</div>
        <div className="text-xs tracking-[0.3em] uppercase text-[#707975] mt-1">Admin Portal</div>
      </div>
      <nav className="p-4 space-y-2">
        <NavLink to="/admin/dashboard" className={navClass}>Dashboard</NavLink>
        <NavLink to="/admin/doctors" className={navClass}>Doctors</NavLink>
        <NavLink to="/admin/doctors/create" className={navClass}>Add Doctor</NavLink>
        <NavLink to="/admin/settings" className={navClass}>Settings</NavLink>
      </nav>
    </aside>
  );
}
