import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Avatar, Badge } from '../components/common/UI';
import ToastHost from '../components/common/ToastHost';

export default function AdminLayout() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <header className="navbar">
        <div className="container navbar-inner">
          <NavLink to="/admin" className="navbar-logo-slot" style={{ gap: 12 }}>
            <span className="navbar-logo-crop">
              <img className="navbar-logo-crop-image" src="/assets/kushalAI_logo.png" alt="KushalAI" />
            </span>
            <Badge tone="neutral">Admin Dashboard</Badge>
          </NavLink>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button aria-label="Notifications" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
              <Bell size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar name={user?.name} size={36} />
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{user?.name}</div>
                <div className="text-meta">{user?.department}</div>
              </div>
            </div>
            <button aria-label="Log out" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
              <LogOut size={19} />
            </button>
          </div>
        </div>
      </header>

      <main className="container page-shell page-enter">
        <Outlet />
      </main>

      <ToastHost />
    </div>
  );
}
