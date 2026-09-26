import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <div
        className="auth-brand-panel"
        style={{
          flex: '0 0 42%',
          background: 'linear-gradient(160deg, var(--color-primary), var(--color-secondary))',
          color: '#fff',
          padding: 'var(--space-6) var(--space-5)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/assets/kushalAI_logo.png" alt="KushalAI" style={{ height: 52, filter: 'brightness(0) invert(1)' }} />
        </Link>
        <div>
          <h1 className="text-hero" style={{ color: '#fff', marginBottom: 'var(--space-2)' }}>
            Competency intelligence for India's Official Statistical System.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15.5, lineHeight: 1.7, maxWidth: 460 }}>
            KushalAI maps every officer's skills, closes competency gaps with personalised learning paths,
            and gives administrators clear visibility into workforce readiness.
          </p>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>Synthetic demo environment · No live iGOT integration</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
        <div style={{ width: '100%', maxWidth: 420 }} className="page-enter">
          <Outlet />
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .auth-brand-panel { display: none; }
        }
      `}</style>
    </div>
  );
}
