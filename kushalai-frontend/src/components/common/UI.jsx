import React from 'react';

export function Button({ variant = 'primary', size = 'md', block, children, className = '', ...rest }) {
  const cls = ['btn', `btn-${variant}`, size === 'sm' ? 'btn-sm' : '', block ? 'btn-block' : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}

export function Card({ children, className = '', flush = false, hover = false, style, ...rest }) {
  const cls = ['card', flush ? 'card-flush' : '', hover ? 'card-hover' : '', className].filter(Boolean).join(' ');
  return (
    <div className={cls} style={style} {...rest}>
      {children}
    </div>
  );
}

const STATUS_MAP = {
  Mastered: 'badge-mastered',
  Proficient: 'badge-proficient',
  Developing: 'badge-developing',
  Gap: 'badge-gap',
  completed: 'badge-mastered',
  current: 'badge-proficient',
  recommended: 'badge-developing',
  locked: 'badge-locked'
};

export function StatusBadge({ status, label }) {
  const cls = STATUS_MAP[status] || 'badge-neutral';
  return <span className={`badge ${cls}`}>{label || status}</span>;
}

export function Badge({ children, tone = 'neutral' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function Pill({ active, children, ...rest }) {
  return (
    <button type="button" className={`pill ${active ? 'active' : ''}`} {...rest}>
      {children}
    </button>
  );
}

export function Field({ label, children, hint }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {children}
      {hint && <span className="text-meta">{hint}</span>}
    </div>
  );
}

export function Input(props) {
  return <input className="input" {...props} />;
}

export function Select({ children, ...rest }) {
  return (
    <select className="select" {...rest}>
      {children}
    </select>
  );
}

export function ProgressBar({ value }) {
  return (
    <div className="progress-track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function CircularProgress({ value, size = 120, stroke = 12, label, sublabel }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, value) / 100) * circumference;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--color-cream)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-orange)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 700ms ease' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}
      >
        <span className="text-stat" style={{ color: 'var(--color-primary)' }}>{label}</span>
        {sublabel && <span className="text-meta">{sublabel}</span>}
      </div>
    </div>
  );
}

export function StatCard({ icon, label, value, sub }) {
  return (
    <Card hover>
      <div className="stat-card">
        <div className="stat-card-top">
          <span className="text-meta" style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>{label}</span>
          {icon && <div className="stat-icon">{icon}</div>}
        </div>
        <div className="text-stat" style={{ color: 'var(--color-primary)' }}>{value}</div>
        {sub && <span className="text-meta">{sub}</span>}
      </div>
    </Card>
  );
}

export function Avatar({ name, size = 40 }) {
  const initials = name
    ?.split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {initials}
    </div>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button key={t.value} className={`tab-btn ${active === t.value ? 'active' : ''}`} onClick={() => onChange(t.value)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Skeleton({ width = '100%', height = 16, radius = 8, style }) {
  return <div className="skeleton" style={{ width, height, borderRadius: radius, ...style }} />;
}

export function EmptyState({ icon, title, message, action }) {
  return (
    <div className="empty-state">
      {icon && <div className="icon-wrap">{icon}</div>}
      <div className="text-card-heading">{title}</div>
      {message && <p className="text-body">{message}</p>}
      {action}
    </div>
  );
}
