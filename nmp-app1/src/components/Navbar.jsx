import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Find a Doctor', path: '/search' },
    { label: 'Contact', path: '/contact' },
    { label: 'Admin Login', path: '/login' },
  ];

  return (
    <header className="bg-[#00342b] text-white sticky top-0 z-50 w-full">
      <nav className="flex justify-between items-center w-full px-4 md:px-12 py-4 max-w-[1500px] mx-auto">
        <Link to="/" className="font-bold text-lg md:text-xl leading-tight truncate max-w-[60%] sm:max-w-none">
          NETWORK OF MUSLIM PHYSICIANS
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`font-medium text-base transition-colors duration-200 hover:text-[#c2cf47] ${
                location.pathname === l.path ? 'text-[#c2cf47] border-b-2 border-[#c2cf47] pb-0.5' : 'text-white/80'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <button className="md:hidden p-2" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-[#00342b] border-t border-white/10 flex flex-col px-4 py-2 shadow-lg">
          {links.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              onClick={() => setMenuOpen(false)}
              className={`py-3 border-b border-white/10 font-medium text-base ${
                location.pathname === l.path ? 'text-[#c2cf47]' : 'text-white/80'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
