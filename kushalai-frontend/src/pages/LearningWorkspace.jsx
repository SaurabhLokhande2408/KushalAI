import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, MessageCircle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '../components/common/UI';

const MODES = [
  {
    number: '01',
    category: 'GUIDANCE & SUPPORT',
    title: 'Doubts & Guidance',
    description:
      'Ask questions, clarify concepts, upload learning material, and continue previous conversations in one guided learning environment.',
    action: 'OPEN GUIDANCE',
    path: '/doubts-guidance',
    icon: MessageCircle,
    accent: 'blue',
  },
  {
    number: '02',
    category: 'PRACTICAL APPLICATION',
    title: 'Scenario Based Assessment',
    description:
      'Apply what you have learned to realistic workplace situations and strengthen practical decision-making through contextual assessment.',
    action: 'START ASSESSMENT',
    path: '/scenario-assessment',
    icon: BookOpen,
    accent: 'orange',
  },
];

function LearningWorkspaceLoadingSkeleton() {
  return (
    <div className="learning-workspace-page learning-workspace-loading" aria-busy="true" aria-label="Loading learning workspace">
      <header className="learning-loading-header">
        <div className="learning-loading-top">
          <Skeleton width={210} height={30} radius={999} />
          <Skeleton width={190} height={30} radius={999} />
        </div>
        <Skeleton width="100%" height={1} radius={0} />
        <div className="learning-loading-hero">
          <Skeleton width={160} height={13} />
          <Skeleton width="min(100%, 620px)" height={82} />
          <Skeleton width="min(100%, 500px)" height={18} />
          <Skeleton width="min(100%, 420px)" height={18} />
        </div>
      </header>

      <div className="learning-loading-intro">
        <Skeleton width={210} height={20} />
        <Skeleton width="min(100%, 360px)" height={15} />
      </div>

      <div className="learning-loading-modes">
        {Array.from({ length: 2 }, (_, index) => (
          <div className="learning-loading-mode" key={index}>
            <div className="learning-loading-mode-meta">
              <div><Skeleton width={48} height={48} radius={14} /><Skeleton width={48} height={48} radius={14} /></div>
              <Skeleton width={160} height={12} />
            </div>
            <div className="learning-loading-mode-content">
              <Skeleton width={130} height={12} />
              <Skeleton width="min(100%, 420px)" height={36} />
              <Skeleton width={32} height={3} radius={3} />
              <Skeleton width="100%" height={15} />
              <Skeleton width="82%" height={15} />
              <Skeleton width="68%" height={15} />
            </div>
            <div className="learning-loading-mode-footer">
              <Skeleton width={150} height={14} />
              <Skeleton width={44} height={44} radius="50%" />
            </div>
          </div>
        ))}
      </div>

      <footer className="learning-loading-footer">
        <Skeleton width="100%" height={1} radius={0} />
        <div><Skeleton width={210} height={11} /><Skeleton width={250} height={11} /></div>
      </footer>

      <style>{`
        .learning-workspace-loading {
          --lw-offwhite: #F7F3ED;
          --lw-white: #FFFFFF;
          --lw-line: #D9DEE5;
          min-height: 100vh;
          padding: 60px 7vw 80px;
          background: linear-gradient(180deg, var(--lw-offwhite) 0%, #FAFAF7 40%, var(--lw-offwhite) 100%);
        }

        .learning-loading-header,
        .learning-loading-intro,
        .learning-loading-modes,
        .learning-loading-footer {
          width: min(100%, 1420px);
          margin-right: auto;
          margin-left: auto;
        }

        .learning-loading-top,
        .learning-loading-intro,
        .learning-loading-mode-meta,
        .learning-loading-mode-meta > div,
        .learning-loading-mode-footer,
        .learning-loading-footer > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .learning-loading-header > .skeleton {
          margin: 24px 0 60px;
        }

        .learning-loading-hero {
          display: grid;
          gap: 16px;
        }

        .learning-loading-intro {
          margin-top: 70px;
          padding: 20px 32px;
          border: 1px solid var(--lw-line);
          border-radius: 20px;
          background: var(--lw-white);
        }

        .learning-loading-modes {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
          margin-top: 32px;
        }

        .learning-loading-mode {
          min-height: 440px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 24px;
          padding: 36px;
          border: 1px solid var(--lw-line);
          border-radius: 28px;
          background: var(--lw-white);
        }

        .learning-loading-mode-meta > div {
          justify-content: flex-start;
        }

        .learning-loading-mode-content {
          display: grid;
          gap: 14px;
          padding: 24px 0;
        }

        .learning-loading-mode-footer {
          padding-top: 28px;
          border-top: 1px solid var(--lw-line);
        }

        .learning-loading-footer {
          margin-top: 80px;
        }

        .learning-loading-footer > div {
          padding-top: 24px;
        }

        @media (max-width: 1024px) {
          .learning-loading-modes {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .learning-workspace-loading {
            padding: 30px 5vw 60px;
          }

          .learning-loading-top,
          .learning-loading-intro,
          .learning-loading-mode-meta,
          .learning-loading-footer > div {
            align-items: flex-start;
            flex-direction: column;
          }

          .learning-loading-intro {
            margin-top: 50px;
            padding: 20px;
          }

          .learning-loading-mode {
            min-height: 380px;
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
}

export default function LearningWorkspace() {
  const navigate = useNavigate();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsInitialLoading(false), 800);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (isInitialLoading) return <LearningWorkspaceLoadingSkeleton />;

  return (
    <div className="learning-workspace-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}
      <header className="learning-workspace-header">
        <div className="learning-header-top">
          <div className="learning-header-code">
            KUSHALAI / LEARNING SERVICES
          </div>

          <div className="learning-header-status">
            <span className="learning-status-dot" />
            LEARNING ENVIRONMENT
          </div>
        </div>

        <div className="learning-header-rule" />

        <div className="learning-header-content">
          <div className="learning-header-eyebrow">
            <span className="learning-eyebrow-line" />
            LEARNING WORKSPACE
          </div>

          <h1>
            Learn.
            <span> Apply.</span>
            <br />
            Progress.
          </h1>

          <p>
            Build practical knowledge through guided learning, realistic
            workplace scenarios, and targeted practice.
          </p>
        </div>

        <div className="learning-header-index">
          <span>01</span>
          <div />
          <span>02</span>
        </div>
      </header>


      {/* =====================================================
          INTRO STRIP
      ===================================================== */}
      <section className="learning-intro-strip">
        <div className="learning-intro-label">
          <ShieldCheck size={20} strokeWidth={2} className="shield-icon" />
          <span>STRUCTURED LEARNING</span>
        </div>
        <p>
          Choose a learning mode based on what you need to accomplish.
        </p>
      </section>


      {/* =====================================================
          LEARNING MODES
      ===================================================== */}
      <main className="learning-mode-grid">
        {MODES.map(({ icon: Icon, ...mode }) => (
          <article
            className={`learning-mode learning-mode-${mode.accent}`}
            key={mode.path}
            onClick={() => navigate(mode.path)}
            style={{ cursor: 'pointer' }}
          >
            {/* Top metadata */}
            <div className="learning-mode-meta">
              <div className="learning-mode-badge-group">
                <div className="learning-mode-number">
                  {mode.number}
                </div>
                <div className="learning-mode-icon">
                  <Icon
                    size={20}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div className="learning-mode-category">
                {mode.category}
              </div>
            </div>

            {/* Main content */}
            <div className="learning-mode-content">
              <div className="learning-mode-kicker">
                LEARNING MODE
              </div>
              <h2>
                {mode.title}
              </h2>
              <div className="learning-mode-divider" />
              <p>
                {mode.description}
              </p>
            </div>

            {/* Footer */}
            <div className="learning-mode-footer">
              <button
                type="button"
                className="learning-mode-action"
                /* Removed onClick to prevent double navigation, relies on article click */
              >
                <span>{mode.action}</span>
                <span className="learning-action-arrow">
                  <ArrowRight
                    size={18}
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </span>
              </button>
              
            </div>
          </article>
        ))}
      </main>


      {/* =====================================================
          FOOTER NOTE
      ===================================================== */}
      <footer className="learning-workspace-footer">
        <div className="learning-footer-rule" />
        <div className="learning-footer-content">
          <span>
            KUSHALAI LEARNING WORKSPACE
          </span>
          <span>
            GUIDED • PRACTICAL • CONTINUOUS
          </span>
        </div>
      </footer>


      {/* =====================================================
          STYLES (Apple-Inspired & Refined)
      ===================================================== */}
      <style>{`

        /* =====================================================
           BASE (Variables Kept Intact)
        ===================================================== */

        .learning-workspace-page {
          --lw-blue: #123B66;
          --lw-blue-dark: #0B2947;
          --lw-orange: #EA580C;
          --lw-orange-soft: #FFF1E8;
          --lw-offwhite: #F7F3ED;
          --lw-white: #FFFFFF;
          --lw-ink: #10243B;
          --lw-muted: #657385;
          --lw-line: #D9DEE5;

          /* Using rgb representations of the hex vars strictly for shadow alphas */
          --lw-ink-rgb: 16, 36, 59; 
          --lw-blue-rgb: 18, 59, 102;
          --lw-orange-rgb: 234, 88, 12;

          min-height: 100vh;
          padding: 60px 7vw 80px;

          background: linear-gradient(
            180deg,
            var(--lw-offwhite) 0%,
            #FAFAF7 40%,
            var(--lw-offwhite) 100%
          );

          color: var(--lw-ink);
          font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
          overflow-x: hidden;
        }

        /* =====================================================
           HEADER
        ===================================================== */

        .learning-workspace-header {
          position: relative;
          max-width: 1420px;
          margin: 0 auto;
        }

        .learning-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .learning-header-code {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: var(--lw-muted);
          background: var(--lw-white);
          padding: 8px 16px;
          border-radius: 99px;
          box-shadow: 0 2px 10px rgba(var(--lw-ink-rgb), 0.03);
          border: 1px solid var(--lw-line);
        }

        .learning-header-status {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: var(--lw-blue);
          background: var(--lw-white);
          padding: 8px 16px;
          border-radius: 99px;
          box-shadow: 0 2px 10px rgba(var(--lw-ink-rgb), 0.03);
          border: 1px solid var(--lw-line);
        }

        .learning-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #2E8B57; /* Keeping original green dot */
          box-shadow: 0 0 0 3px rgba(46, 139, 87, 0.15);
        }

        .learning-header-rule {
          height: 1px;
          background: linear-gradient(
            90deg,
            var(--lw-blue) 0%,
            var(--lw-blue) 12%,
            var(--lw-line) 12%,
            var(--lw-line) 100%
          );
          margin-bottom: 60px;
          opacity: 0.6;
        }

        .learning-header-content {
          max-width: 900px;
        }

        .learning-header-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          color: var(--lw-orange);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .learning-eyebrow-line {
          width: 40px;
          height: 2px;
          background: var(--lw-orange);
          border-radius: 2px;
        }

        .learning-header-content h1 {
          margin: 0;
          font-size: clamp(48px, 6vw, 84px);
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 800;
          color: var(--lw-ink);
        }

        .learning-header-content h1 span {
          color: var(--lw-blue);
        }

        .learning-header-content p {
          max-width: 650px;
          margin: 32px 0 0;
          color: var(--lw-muted);
          font-size: 19px;
          line-height: 1.6;
          font-weight: 500;
          letter-spacing: -0.01em;
        }

        .learning-header-index {
          position: absolute;
          right: 0;
          bottom: 12px;
          display: flex;
          align-items: center;
          gap: 16px;
          color: var(--lw-muted);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
        }

        .learning-header-index div {
          width: 60px;
          height: 1px;
          background: var(--lw-line);
        }

        /* =====================================================
           INTRO STRIP (Refined Apple Container)
        ===================================================== */

        .learning-intro-strip {
          max-width: 1420px;
          margin: 70px auto 0;
          padding: 20px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          background: var(--lw-white);
          border-radius: 20px;
          border: 1px solid var(--lw-line);
          box-shadow: 0 4px 24px rgba(var(--lw-ink-rgb), 0.04);
        }

        .learning-intro-label {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--lw-blue);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.15em;
        }

        .learning-intro-label .shield-icon {
          color: var(--lw-orange);
        }

        .learning-intro-strip p {
          margin: 0;
          color: var(--lw-muted);
          font-size: 14px;
          font-weight: 500;
        }

        /* =====================================================
           MODE GRID & CARDS
        ===================================================== */

        .learning-mode-grid {
          max-width: 1420px;
          margin: 32px auto 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .learning-mode {
          position: relative;
          min-height: 440px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 36px;
          background: var(--lw-white);
          border: 1px solid var(--lw-line);
          border-radius: 28px; /* Smooth, Apple-like squircles */
          cursor: pointer;
          
          /* Elegant, subtle cubic-bezier transitions */
          transition: 
            transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1),
            border-color 0.4s ease;
            
          box-shadow: 0 4px 12px rgba(var(--lw-ink-rgb), 0.03);
          overflow: hidden;
        }

        /* Replaced sharp brutalist top border with a refined inset glow/tint */
        .learning-mode::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(135deg, rgba(var(--lw-blue-rgb), 0.15), transparent 40%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .learning-mode-orange::before {
          background: linear-gradient(135deg, rgba(var(--lw-orange-rgb), 0.25), transparent 40%);
        }

        .learning-mode:hover {
          transform: scale(1.015) translateY(-4px);
          border-color: transparent;
          box-shadow: 
            0 24px 48px -12px rgba(var(--lw-ink-rgb), 0.12),
            0 8px 16px -4px rgba(var(--lw-ink-rgb), 0.04);
        }

        .learning-mode:hover::before {
          opacity: 1;
        }

        /* =====================================================
           CARD META
        ===================================================== */

        .learning-mode-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 24px;
          /* Removed harsh bottom border for cleaner whitespace */
        }

        .learning-mode-badge-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .learning-mode-number {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--lw-blue);
          color: var(--lw-white);
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.05em;
          border-radius: 14px; /* Smooth squircle */
          box-shadow: 0 4px 12px rgba(var(--lw-blue-rgb), 0.2);
        }

        .learning-mode-orange .learning-mode-number {
          background: var(--lw-orange);
          box-shadow: 0 4px 12px rgba(var(--lw-orange-rgb), 0.2);
        }

        .learning-mode-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--lw-offwhite);
          color: var(--lw-blue);
          border-radius: 14px; /* Matches number */
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .learning-mode-orange .learning-mode-icon {
          background: var(--lw-orange-soft);
          color: var(--lw-orange);
        }

        .learning-mode:hover .learning-mode-icon {
          transform: scale(1.08) rotate(-4deg);
        }

        .learning-mode-category {
          color: var(--lw-muted);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
        }

        /* =====================================================
           CARD CONTENT
        ===================================================== */

        .learning-mode-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 24px 0;
        }

        .learning-mode-kicker {
          margin-bottom: 12px;
          color: var(--lw-orange);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .learning-mode-content h2 {
          max-width: 620px;
          margin: 0;
          color: var(--lw-ink);
          font-size: clamp(28px, 2.5vw, 40px);
          line-height: 1.1;
          letter-spacing: -0.03em;
          font-weight: 800;
        }

        /* Softened the divider to a subtle gradient pip */
        .learning-mode-divider {
          width: 32px;
          height: 3px;
          margin: 24px 0;
          border-radius: 3px;
          background: var(--lw-orange);
          opacity: 0.6;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
        }

        .learning-mode:hover .learning-mode-divider {
          width: 48px;
          opacity: 1;
        }

        .learning-mode-content p {
          max-width: 540px;
          margin: 0;
          color: var(--lw-muted);
          font-size: 16px;
          line-height: 1.6;
          font-weight: 500;
        }

        /* =====================================================
           CARD FOOTER
        ===================================================== */

        .learning-mode-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 28px;
          border-top: 1px solid rgba(217, 222, 229, 0.6); /* Softened var(--lw-line) */
        }

        .learning-mode-action {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          padding: 0;
          border: 0;
          background: transparent;
          color: var(--lw-blue);
          font-family: inherit;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.1em;
          cursor: pointer;
        }

        /* Converted to a premium circular button element */
        .learning-action-arrow {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: var(--lw-offwhite);
          color: var(--lw-blue);
          transition: 
            background 0.3s ease,
            color 0.3s ease,
            transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.3s ease;
        }

        .learning-mode-orange .learning-action-arrow {
          background: var(--lw-orange-soft);
          color: var(--lw-orange);
        }

        /* Interactive styling applied when the whole card is hovered */
        .learning-mode:hover .learning-action-arrow,
        .learning-mode-action:hover .learning-action-arrow {
          background: var(--lw-blue);
          color: var(--lw-white);
          transform: translateX(6px) scale(1.05);
          box-shadow: 0 4px 12px rgba(var(--lw-blue-rgb), 0.3);
        }

        .learning-mode-orange:hover .learning-action-arrow {
          background: var(--lw-orange);
          box-shadow: 0 4px 12px rgba(var(--lw-orange-rgb), 0.3);
        }

        .learning-mode-reference {
          color: #9AA4B0;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.15em;
        }

        /* =====================================================
           FOOTER
        ===================================================== */

        .learning-workspace-footer {
          max-width: 1420px;
          margin: 80px auto 0;
        }

        .learning-footer-rule {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--lw-line) 15%, var(--lw-line) 85%, transparent);
        }

        .learning-footer-content {
          display: flex;
          justify-content: space-between;
          padding-top: 24px;
          color: #8A95A2;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
        }

        /* =====================================================
           RESPONSIVE REFINEMENTS
        ===================================================== */

        @media (max-width: 1024px) {
          .learning-mode-grid {
            grid-template-columns: 1fr;
          }
          
          .learning-mode {
            min-height: auto;
          }

          .learning-header-index {
            display: none;
          }
        }

        @media (max-width: 600px) {
          .learning-workspace-page {
            padding: 30px 5vw 60px;
          }

          .learning-header-top {
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
          }

          .learning-header-rule {
            margin-bottom: 40px;
          }

          .learning-header-content h1 {
            font-size: 44px;
          }

          .learning-header-content p {
            font-size: 16px;
          }

          .learning-intro-strip {
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
            margin-top: 50px;
            padding: 20px;
            border-radius: 16px;
          }

          .learning-mode {
            padding: 24px;
            border-radius: 20px;
          }

          .learning-mode-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .learning-mode-content h2 {
            font-size: 26px;
          }

          .learning-mode-content p {
            font-size: 15px;
          }

          .learning-footer-content {
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .learning-mode,
          .learning-mode::before,
          .learning-mode-icon,
          .learning-mode-divider,
          .learning-action-arrow {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}