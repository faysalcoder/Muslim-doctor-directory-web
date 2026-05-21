import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export default function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-[#e1e3e4] px-4 md:px-6 py-4 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-lg md:text-xl font-bold text-[#00342b]">Admin Dashboard</h1>
        <p className="text-xs md:text-sm text-[#3f4945]">Manage doctors, images, and portal content</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-[#191c1d]">{user?.name || 'Admin'}</p>
          <p className="text-xs text-[#707975]">System Admin</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-[#00342b] text-white text-sm font-semibold hover:opacity-90"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
