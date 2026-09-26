import React from 'react';

export default function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-4)'
      }}
    >
      <div>
        {eyebrow && <div className="text-meta" style={{ color: 'var(--color-secondary)', fontWeight: 600, marginBottom: 6 }}>{eyebrow}</div>}
        <h1 className="text-page-heading">{title}</h1>
        {subtitle && <p className="text-body" style={{ marginTop: 6 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
