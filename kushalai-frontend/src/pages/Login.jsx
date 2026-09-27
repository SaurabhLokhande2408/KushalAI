import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Field, Input } from '../components/common/UI';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { loginAsDemo } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [demoPickerOpen, setDemoPickerOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') setDemoPickerOpen(false);
    }
    if (demoPickerOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [demoPickerOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    // Frontend-only mock: any credentials sign in as the demo officer.
    loginAsDemo('officer');
    navigate('/dashboard');
  }

  function handleDemo(role) {
    loginAsDemo(role);
    navigate(role === 'admin' ? '/admin' : '/dashboard');
  }

  return (
    <div>
      <h1 className="text-page-heading" style={{ marginBottom: 6 }}>Welcome back</h1>
      <p className="text-body" style={{ marginBottom: 'var(--space-4)' }}>Sign in to continue your competency journey.</p>

      <form onSubmit={handleSubmit}>
        <Field label="Email or Officer ID">
          <Input type="text" placeholder="you@department.gov.in" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Password">
          <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <label className="checkbox-row">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember me
          </label>
          <span className="text-meta" style={{ color: 'var(--color-secondary)', cursor: 'pointer' }}>Forgot password?</span>
        </div>
        <Button type="submit" block>Log in</Button>
      </form>

      <p className="text-meta" style={{ textAlign: 'center', margin: 'var(--space-3) 0' }}>
        New officer? <Link to="/register" style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Register here</Link>
      </p>

      <div style={{ marginTop: 'var(--space-3)' }}>
        <Button variant="secondary" block onClick={() => setDemoPickerOpen(true)}>Try Demo</Button>
      </div>

      {demoPickerOpen && (
        <div
          className="login-demo-overlay"
          onMouseDown={(event) => event.target === event.currentTarget && setDemoPickerOpen(false)}
        >
          <section className="login-demo-modal" role="dialog" aria-modal="true" aria-labelledby="login-demo-title">
            <button
              type="button"
              className="login-demo-close"
              onClick={() => setDemoPickerOpen(false)}
              aria-label="Close demo role selection"
            >
              ×
            </button>
            <h2 id="login-demo-title">Welcome to KushalAI</h2>
            <p>Choose how you'd like to explore the platform.</p>
            <div className="login-demo-roles">
              <button type="button" className="login-demo-role" onClick={() => handleDemo('officer')}>
                <span className="login-demo-role-title">OFFICER</span>
                <span className="login-demo-role-copy">Explore the competency and learning experience.</span>
                <span className="login-demo-role-action">Continue <span aria-hidden="true">→</span></span>
              </button>
              <button type="button" className="login-demo-role" onClick={() => handleDemo('admin')}>
                <span className="login-demo-role-title">ADMIN</span>
                <span className="login-demo-role-copy">Explore the administration and management experience.</span>
                <span className="login-demo-role-action">Continue <span aria-hidden="true">→</span></span>
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
