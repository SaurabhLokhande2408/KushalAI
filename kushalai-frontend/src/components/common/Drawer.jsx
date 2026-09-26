import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Drawer({
  open,
  onClose,
  title,
  children,
}) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        onClose?.();
      }
    }

    if (open) {
      document.addEventListener(
        'keydown',
        onKey
      );
    }

    return () => {
      document.removeEventListener(
        'keydown',
        onKey
      );
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="kushal-drawer-overlay"
        onMouseDown={onClose}
      />

      <aside
        className="kushal-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >

        <header className="kushal-drawer-header">

          <div className="kushal-drawer-header-label">
            COURSE DETAILS
          </div>

          <button
            type="button"
            className="kushal-drawer-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={21} />
          </button>

        </header>

        <div className="kushal-drawer-content">
          {children}
        </div>

      </aside>

      <style>{`

        .kushal-drawer-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(13, 29, 49, 0.30);
          backdrop-filter: blur(2px);
          animation: kushalOverlayIn 180ms ease-out;
        }

        .kushal-drawer {
          position: fixed;
          z-index: 1000;
          top: 0;
          right: 0;
          width: min(720px, 92vw);
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border-left: 1px solid rgba(18, 63, 115, 0.10);
          box-shadow: -20px 0 70px rgba(18, 63, 115, 0.13);
          animation: kushalDrawerIn 320ms cubic-bezier(
            .22,
            1,
            .36,
            1
          );
        }

        .kushal-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 0 0 auto;
          padding: 22px 34px;
          border-bottom: 1px solid rgba(18, 63, 115, 0.09);
          background: rgba(255, 255, 255, 0.98);
        }

        .kushal-drawer-header-label {
          color: #8090a2;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.18em;
        }

        .kushal-drawer-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(18, 63, 115, 0.12);
          border-radius: 50%;
          background: white;
          color: #52647a;
          cursor: pointer;
          transition:
            color 160ms ease,
            border-color 160ms ease,
            transform 160ms ease;
        }

        .kushal-drawer-close:hover {
          color: #ea580c;
          border-color: rgba(234, 88, 12, 0.25);
          transform: rotate(3deg);
        }

        .kushal-drawer-content {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 38px 42px 50px;
          scrollbar-width: thin;
          scrollbar-color:
            rgba(18, 63, 115, 0.20)
            transparent;
        }

        .kushal-drawer-content::-webkit-scrollbar {
          width: 7px;
        }

        .kushal-drawer-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .kushal-drawer-content::-webkit-scrollbar-thumb {
          background: rgba(18, 63, 115, 0.17);
          border-radius: 999px;
        }

        @keyframes kushalDrawerIn {
          from {
            opacity: 0;
            transform: translateX(32px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes kushalOverlayIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @media (max-width: 700px) {

          .kushal-drawer {
            width: 100vw;
          }

          .kushal-drawer-header {
            padding: 17px 20px;
          }

          .kushal-drawer-content {
            padding: 28px 20px 42px;
          }

        }

        @media (prefers-reduced-motion: reduce) {

          .kushal-drawer,
          .kushal-drawer-overlay {
            animation: none;
          }

        }

      `}</style>
    </>
  );
}