import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function ToastHost() {
  const { toast, clearToast } = useApp();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 3200);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  if (!toast) return null;

  return (
    <div className="toast-host">
      <div className={`toast ${toast.variant === 'success' ? 'toast-success' : toast.variant === 'danger' ? 'toast-danger' : ''}`}>
        {toast.message}
      </div>
    </div>
  );
}
