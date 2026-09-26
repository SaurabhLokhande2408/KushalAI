import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Field, Input } from '../components/common/UI';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { loginAsDemo } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

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

      <div className="card" style={{ background: 'var(--color-offwhite)', marginTop: 'var(--space-3)' }}>
        <div className="text-meta" style={{ fontWeight: 700, marginBottom: 10 }}>Demo access</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button variant="secondary" size="sm" onClick={() => handleDemo('officer')}>Demo officer</Button>
          <Button variant="secondary" size="sm" onClick={() => handleDemo('admin')}>Demo admin</Button>
        </div>
      </div>
    </div>
  );
}
