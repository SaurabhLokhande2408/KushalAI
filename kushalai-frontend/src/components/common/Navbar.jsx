import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  GraduationCap,
  Route as RouteIcon,
  ShieldCheck,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const OFFICER_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/roadmap', label: 'Roadmap', icon: RouteIcon, end: true },
  { to: '/learning-workspace', label: 'LEARNING WORKSPACE', icon: GraduationCap, end: true },
  { to: '/profile', label: 'Profile', icon: ShieldCheck, end: true }
];

const ADMIN_LINKS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: false }
];

function RouteLink({ link, onNavigate, className = 'nav-link', activeOverride = false }) {
  const Icon = link.icon;

  return (
    <NavLink
      to={link.to}
      end={link.end}
      onClick={onNavigate}
      className={({ isActive }) => `${className} ${isActive || activeOverride ? 'active' : ''}`}
    >
      {Icon && <Icon size={17} aria-hidden="true" />}
      <span>{link.label}</span>
    </NavLink>
  );
}

export default function Navbar() {
  const { user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const headerRef = useRef(null);

  // Check if current view is a public landing page or auth page
  const isAuthRoute = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');
  const isLandingRoute = location.pathname === '/';
  const forcePublic = isAuthRoute || isLandingRoute;

  const activeUser = forcePublic ? null : user;
  const isOfficer = activeUser?.role === 'officer';
  const isAdmin = activeUser?.role === 'admin';
  const links = isAdmin ? ADMIN_LINKS : isOfficer ? OFFICER_LINKS : [];
  const homePath = activeUser?.role === 'admin' ? '/admin' : activeUser ? '/dashboard' : '/';
  const roleLabel = isAdmin ? 'Administrator' : 'Officer';
  const isLearningWorkspace = ['/learning-workspace', '/doubts-guidance', '/scenario-assessment']
    .some((path) => location.pathname.startsWith(path));

  useEffect(() => {
    setOpenMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    if (!openMenu) return undefined;

    function handlePointerDown(event) {
      if (!headerRef.current?.contains(event.target)) setOpenMenu(null);
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpenMenu(null);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openMenu]);

  function handleLogout() {
    setOpenMenu(null);
    logout();
    navigate('/login');
  }

  function closeMenu() {
    setOpenMenu(null);
  }

  return (
    <>
      <header className="navbar navbar-sticky" ref={headerRef}>
        <div className="container navbar-inner">
          
          {/* Logo Slot */}
          <NavLink to={homePath} className="navbar-logo-slot" aria-label="KushalAI home" onClick={closeMenu}>
            <span className="navbar-logo-crop">
              <img className="navbar-logo-crop-image" src="/assets/kushalAI_logo.png" alt="KushalAI" />
            </span>
          </NavLink>

          {/* Navigation Links */}
          {links.length > 0 && (
            <nav className="nav-links" aria-label="Main navigation">
              {links.map((link) => (
                <RouteLink
                  key={link.to}
                  link={link}
                  onNavigate={closeMenu}
                  activeOverride={link.to === '/learning-workspace' && isLearningWorkspace}
                />
              ))}
            </nav>
          )}

          {/* User Actions & Profile OR Public Actions */}
          {activeUser ? (
            <div className="navbar-actions">
              <button
                className="navbar-icon-button navbar-notifications"
                aria-label="Notifications are unavailable in this demo"
                title="Notifications are unavailable in this demo"
                type="button"
                disabled
              >
                <Bell size={18} />
              </button>
              
              <div className="navbar-popover-anchor navbar-account">
                <button
                  className="navbar-account-trigger"
                  type="button"
                  aria-label={`Account options for ${activeUser.name}, ${roleLabel}`}
                  aria-expanded={openMenu === 'account'}
                  aria-controls="navbar-account-menu"
                  onClick={() => setOpenMenu((current) => current === 'account' ? null : 'account')}
                >
                  <div className="navbar-custom-avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                    <img src="/assets/pfp.jpg" alt={activeUser.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }} />
                  </div>
                  <span className="navbar-user-copy">
                    <span className="navbar-user-name">{activeUser.name}</span>
                    <span className="navbar-user-role">{roleLabel}</span>
                  </span>
                  <ChevronDown className={`navbar-account-chevron ${openMenu === 'account' ? 'rotate' : ''}`} size={14} aria-hidden="true" />
                </button>
                
                {openMenu === 'account' && (
                  <div className="navbar-popover navbar-account-menu animate-popover" id="navbar-account-menu">
                    <div className="navbar-account-summary">
                      <div className="navbar-custom-avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                        <img src="/assets/pfp.jpg" alt={activeUser.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }} />
                      </div>
                      <div className="navbar-account-details">
                        <strong>{activeUser.name}</strong>
                        <span>{roleLabel}</span>
                        <span className="text-meta">{activeUser.designation || activeUser.department}</span>
                      </div>
                    </div>
                    <div className="navbar-menu-divider" />
                    <button className="navbar-menu-action navbar-logout-action" onClick={handleLogout} type="button">
                      <LogOut size={16} aria-hidden="true" />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="navbar-public-actions">
              <Link to="/login" className="btn btn-secondary btn-sm navbar-login-btn">Log in</Link>
              <Link to="/register" className="btn btn-primary btn-sm navbar-register-btn">Register</Link>
            </div>
          )}

          {/* Mobile Toggle Button */}
          <button
            className="nav-mobile-toggle navbar-icon-button"
            aria-label={openMenu === 'mobile' ? 'Close menu' : 'Open menu'}
            aria-expanded={openMenu === 'mobile'}
            aria-controls="navbar-mobile-menu"
            onClick={() => setOpenMenu((current) => current === 'mobile' ? null : 'mobile')}
            type="button"
          >
            {openMenu === 'mobile' ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {openMenu === 'mobile' && (
          <nav className="container navbar-mobile-menu animate-mobile-menu" id="navbar-mobile-menu" aria-label="Mobile navigation">
            {activeUser && isOfficer && (
              <>
                <div className="navbar-mobile-group">
                  <span className="navbar-mobile-section-label">Navigation</span>
                  {OFFICER_LINKS.map((link) => (
                    <RouteLink
                      key={link.to}
                      link={link}
                      onNavigate={closeMenu}
                      activeOverride={link.to === '/learning-workspace' && isLearningWorkspace}
                    />
                  ))}
                </div>
                <div className="navbar-mobile-group">
                  <span className="navbar-mobile-section-label">Account</span>
                  <button className="navbar-menu-action navbar-logout-action" onClick={handleLogout} type="button">
                    <LogOut size={17} aria-hidden="true" />
                    <span>Log out</span>
                  </button>
                </div>
              </>
            )}
            {activeUser && isAdmin && (
              <div className="navbar-mobile-group">
                <span className="navbar-mobile-section-label">Administration</span>
                <RouteLink link={ADMIN_LINKS[0]} onNavigate={closeMenu} />
                <button className="navbar-menu-action navbar-logout-action" onClick={handleLogout} type="button">
                  <LogOut size={17} aria-hidden="true" />
                  <span>Log out</span>
                </button>
              </div>
            )}
            {!activeUser && (
              <div className="navbar-mobile-group navbar-mobile-public">
                <span className="navbar-mobile-section-label">Get Started</span>
                <Link to="/login" onClick={closeMenu} className="nav-link">Log in</Link>
                <Link to="/register" onClick={closeMenu} className="nav-link mobile-register-link">Register</Link>
              </div>
            )}
          </nav>
        )}
      </header>

      <style>{`
        .navbar {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          position: sticky;
          top: 0;
          z-index: 1000;
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        .navbar-inner {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 76px;
          padding: 0 24px;
          max-width: 1440px;
          margin: 0 auto;
        }

        .navbar-logo-slot {
          text-decoration: none;
          display: flex;
          align-items: center;
          z-index: 12;
        }

        .navbar-logo-crop {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex: 0 0 116px;
          width: 116px;
          height: 44px;
        }

        .navbar-logo-crop-image {
          position: relative;
          top: auto;
          left: auto;
          height: 150px;
          width: auto;
          max-width: none;
          object-fit: contain;
          display: block;
          flex: 0 0 auto;
          transform: translateX(7px);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 500;
          color: #475569;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          color: #ea580c;
          background: rgba(234, 88, 12, 0.08);
        }

        .nav-link.active {
          color: #ea580c;
          background: rgba(234, 88, 12, 0.08);
          font-weight: 600;
        }

        .navbar-account-chevron {
          transition: transform 0.2s ease;
        }

        .navbar-account-chevron.rotate {
          transform: rotate(180deg);
        }

        .navbar-popover-anchor {
          position: relative;
        }

        .navbar-popover {
          position: absolute;
          top: calc(100% + 12px);
          left: 0;
          min-width: 200px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
          padding: 8px;
          z-index: 9999;
        }

        .animate-popover {
          animation: popoverFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes popoverFadeIn {
          0% { opacity: 0; transform: translateY(8px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .navbar-icon-button {
          background: transparent;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .navbar-icon-button:hover:not(:disabled) {
          background: rgba(234, 88, 12, 0.08);
          color: #ea580c;
          border-color: rgba(234, 88, 12, 0.3);
        }

        .navbar-account-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: 1px solid rgba(0, 0, 0, 0.08);
          padding: 6px 12px 6px 6px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .navbar-account-trigger:hover {
          background: rgba(234, 88, 12, 0.04);
          border-color: rgba(234, 88, 12, 0.3);
        }

        .navbar-user-copy {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          line-height: 1.2;
        }

        .navbar-user-name {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          transition: color 0.2s ease;
        }

        .navbar-account-trigger:hover .navbar-user-name {
          color: #ea580c;
        }

        .navbar-user-role {
          font-size: 11px;
          color: #64748b;
        }

        .navbar-account-menu {
          right: 0;
          left: auto;
          min-width: 240px;
          padding: 12px;
        }

        .navbar-account-summary {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4px 4px 12px 4px;
        }

        .navbar-account-details {
          display: flex;
          flex-direction: column;
          font-size: 13px;
          line-height: 1.3;
        }

        .navbar-account-details strong {
          color: #0f172a;
        }

        .navbar-account-details span {
          color: #64748b;
        }

        .text-meta {
          font-size: 11px;
          color: #94a3b8 !important;
          margin-top: 2px;
        }

        .navbar-menu-divider {
          height: 1px;
          background: rgba(0, 0, 0, 0.06);
          margin: 6px 0;
        }

        .navbar-menu-action {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          background: transparent;
          border: none;
          font-size: 14px;
          font-weight: 500;
          color: #334155;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .navbar-menu-action:hover {
          background: rgba(234, 88, 12, 0.08);
          color: #ea580c;
        }

        .navbar-logout-action {
          color: #ef4444;
        }

        .navbar-logout-action:hover {
          background: rgba(239, 68, 68, 0.08);
          color: #dc2626;
        }

        .navbar-public-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .navbar-login-btn {
          border-radius: 999px;
          font-weight: 600;
          border-color: rgba(0, 0, 0, 0.12);
          transition: all 0.2s ease;
        }

        .navbar-login-btn:hover {
          color: #ea580c;
          border-color: rgba(234, 88, 12, 0.4);
          background: rgba(234, 88, 12, 0.04);
        }

        .navbar-register-btn {
          border-radius: 999px;
          background: #ea580c !important;
          border-color: #ea580c !important;
          color: #ffffff !important;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .navbar-register-btn:hover {
          background: #c2410c !important;
        }

        .nav-mobile-toggle {
          display: none;
        }

        .navbar-mobile-menu {
          display: none;
          background: #ffffff;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          padding: 20px 24px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.06);
          position: relative;
          z-index: 10;
        }

        .animate-mobile-menu {
          animation: mobileMenuSlide 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes mobileMenuSlide {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .navbar-mobile-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 16px;
        }

        .navbar-mobile-group:last-child { margin-bottom: 0; }

        .navbar-mobile-section-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 4px;
          padding-left: 12px;
        }

        .navbar-mobile-group .nav-link {
          width: 100%;
          border-radius: 12px;
          padding: 10px 14px;
        }

        .navbar-mobile-public .nav-link { justify-content: flex-start; }

        .mobile-register-link {
          color: #ea580c !important;
          font-weight: 600;
        }

        @media (max-width: 760px) {
          .nav-links, .navbar-actions, .navbar-public-actions { display: none; }
          .nav-mobile-toggle { display: inline-flex; }
          .navbar-mobile-menu { display: block; }
        }
      `}</style>
    </>
  );
}