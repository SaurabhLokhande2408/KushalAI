import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Bell, Menu, X, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/common/UI';
import ToastHost from '../components/common/ToastHost';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/skills', label: 'Skill Passport' },
  { to: '/profile', label: 'Profile' }
];

export default function OfficerLayout() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <header className="navbar">
        <div className="container navbar-inner">
          <NavLink to="/dashboard" className="navbar-logo-slot">
            <span className="navbar-logo-crop">
              <img className="navbar-logo-crop-image" src="/assets/kushalAI_logo.png" alt="KushalAI" />
            </span>
          </NavLink>

          <nav className="nav-links">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button aria-label="Notifications" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
              <Bell size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar name={user?.name} size={36} />
              <div style={{ lineHeight: 1.2, display: window.innerWidth < 560 ? 'none' : 'block' }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{user?.name}</div>
                <div className="text-meta">{user?.designation}</div>
              </div>
            </div>
            <button aria-label="Log out" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
              <LogOut size={19} />
            </button>
            <button className="nav-mobile-toggle" aria-label="Menu" onClick={() => setMobileOpen((v) => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="container" style={{ paddingBottom: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                {l.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <main className="container page-shell page-enter">
        <Outlet />
      </main>

      <ToastHost />
    </div>
  );
}
