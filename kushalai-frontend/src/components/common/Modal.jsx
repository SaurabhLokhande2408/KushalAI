import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
          <h2 className="text-card-heading">{title}</h2>
          <button className="btn-ghost" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div>{children}</div>
        {footer && <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 12, justifyContent: 'flex-end' }}>{footer}</div>}
      </div>
    </div>
  );
}
