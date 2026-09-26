import React from 'react';
import { Check, Lock, Sparkles, Circle } from 'lucide-react';

const STYLES = {
  completed: { bg: 'var(--color-primary)', color: '#fff', border: 'var(--color-primary)' },
  current: { bg: '#fff', color: 'var(--color-primary)', border: 'var(--color-orange)' },
  recommended: { bg: '#fff', color: 'var(--color-primary)', border: 'var(--color-primary)' },
  locked: { bg: 'var(--color-locked-bg)', color: 'var(--color-locked)', border: 'var(--color-border)' }
};

const ICONS = {
  completed: Check,
  current: Sparkles,
  recommended: Circle,
  locked: Lock
};

export default function RoadmapNode({ node, course, onClick, style }) {
  const s = STYLES[node.status];
  const Icon = ICONS[node.status];

  return (
    <button
      onClick={onClick}
      aria-label={`${course?.title} — ${node.status}`}
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        width: 132,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        ...style
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: s.bg,
          color: s.color,
          border: `2px solid ${s.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: node.status === 'current' ? '0 0 0 6px rgba(245,161,42,0.18)' : 'var(--shadow-card)',
          transition: 'transform var(--t-fast)'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <Icon size={20} />
      </div>
      <div
        style={{
          fontSize: 12.5,
          fontWeight: 600,
          textAlign: 'center',
          color: node.status === 'locked' ? 'var(--color-locked)' : 'var(--color-text)',
          lineHeight: 1.3
        }}
      >
        {course?.title}
      </div>
      {node.status === 'current' && <span className="badge badge-proficient" style={{ fontSize: 10.5 }}>Current focus</span>}
    </button>
  );
}
