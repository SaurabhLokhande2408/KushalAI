import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import BrandCurveAnimation from '../components/common/BrandCurveAnimation';

export default function AuthLayout() {
  return (
    <div className="auth-page">

      {/* =====================================================
          LEFT CREATIVE PANEL (Minimalist Startup Redesign)
      ====================================================== */}

      <aside className="auth-brand-panel">

        <BrandCurveAnimation />

        <div className="auth-brand-content">

          {/* MASSIVE HERO TEXT WITH STAGGERED REVEAL */}
          <div className="auth-hero-wrapper">
            <div className="auth-hero-text-mask">
              <h1 className="auth-hero-text">
                <span className="auth-hero-k">क</span>ushal
              </h1>
            </div>
            
            <div className="auth-ai-reveal-container">
              <span className="auth-ai-badge">AI</span>
            </div>

            <div className="auth-hero-accent"></div>
          </div>

          {/* MINIMAL LOGIN */}
          <div className="auth-login-minimal">
            <span className="auth-login-prompt">Already registered?</span>
            <Link to="/login" className="auth-login-outline-btn">
              Log in
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>

        </div>

      </aside>


      {/* =====================================================
          RIGHT FORM AREA (Untouched)
      ====================================================== */}

      <main className="auth-content">

        <div className="auth-form-shell">

          <div className="auth-form-container page-enter">
            <Outlet />
          </div>

        </div>

      </main>


      <style>{`

        /* =====================================================
           MAIN LAYOUT (Untouched)
        ====================================================== */

        .auth-page {
          min-height: calc(100vh - 76px);
          width: 100%;

          display: grid;
          grid-template-columns: 38% 62%;

          overflow: hidden;

          background: var(--color-offwhite);
        }


        /* =====================================================
           LEFT CREATIVE PANEL (Redesigned)
        ====================================================== */

        .auth-brand-panel {
          position: relative;
          min-height: 100%;
          overflow: hidden;
          
          /* Solid Matte Blue Background */
          background: var(--color-primary);
          color: var(--color-white);
        }

        .auth-brand-content {
          position: relative;
          z-index: 2;
          min-height: 100%;
          display: flex;
          flex-direction: column;
          padding: 48px;
        }

        /* Hero Text Container */
        .auth-hero-wrapper {
          margin-top: 12vh;
          margin-bottom: auto;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        /* Improved Matte Typography & Reveal for Kushal */
        .auth-hero-text-mask {
          overflow: hidden;
          padding-bottom: 4px; /* Prevents clipping of descenders/accents */
        }

        .auth-hero-text {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: clamp(76px, 7.5vw, 130px);
          font-weight: 800;
          line-height: 0.95;
          margin: 0;
          color: #ffffff; /* Crisp Clean White */
          letter-spacing: -0.04em;
          opacity: 0;
          transform: translateY(40px);
          animation: kushalReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
        }

        @keyframes kushalReveal {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .auth-hero-k {
          color: #ea580c; /* Rich Matte Orange */
          font-weight: 800;
          display: inline-block;
        }

        /* Matte Reveal Animation for AI Badge */
        .auth-ai-reveal-container {
          overflow: hidden;
          margin-top: 10px;
        }

        .auth-ai-badge {
          display: inline-block;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: clamp(18px, 2vw, 28px);
          font-weight: 700;
          letter-spacing: 0.4em;
          color: #ea580c;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(30px);
          animation: aiReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
        }

        @keyframes aiReveal {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .auth-hero-accent {
          height: 5px;
          width: 72px;
          background: #ea580c; /* Solid Matte Orange Accent Borderline */
          margin-top: 18px;
          border-radius: 99px;
          opacity: 0;
          animation: accentReveal 0.8s ease 0.5s forwards;
        }

        @keyframes accentReveal {
          0% {
            opacity: 0;
            width: 0;
          }
          100% {
            opacity: 1;
            width: 72px;
          }
        }

        /* Minimal Login Section */
        .auth-login-minimal {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .auth-login-prompt {
          font-size: 15px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
        }

        .auth-login-outline-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          height: 44px;
          padding: 0 24px;
          border-radius: 999px;
          background: transparent;
          color: #ffffff;
          border: 1.5px solid rgba(255, 255, 255, 0.4);
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .auth-login-outline-btn:hover {
          background: #ffffff;
          color: var(--color-primary);
          border-color: #ffffff;
          transform: translateX(4px);
        }

        .auth-login-outline-btn svg {
          width: 18px;
          height: 18px;
          transition: transform 0.2s ease;
        }

        .auth-login-outline-btn:hover svg {
          transform: translateX(4px);
        }


        /* =====================================================
           RIGHT SIDE (Untouched)
        ====================================================== */

        .auth-content {
          position: relative;

          min-width: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          padding: 40px 48px;

          background: var(--color-offwhite);
        }


        /* =====================================================
           WHITE FORM SHELL (Untouched)
        ====================================================== */

        .auth-form-shell {
          position: relative;

          width: 100%;

          max-width: 920px;

          min-height: 680px;

          display: flex;

          align-items: center;

          background: var(--color-white);

          /*
             Large rounded outer shape
          */

          border-radius:
            135px
            26px
            26px
            135px;

          box-shadow:
            0 4px 20px rgba(0,0,0,0.06);

          overflow: hidden;
        }


        /* =====================================================
           LARGE BLUE CRESCENT (Untouched)
        ====================================================== */

        .auth-form-shell::before {
          content: '';

          position: absolute;

          /*
             Pull the ellipse far outside
             the white container.
          */

          left: -108px;

          top: -8%;

          width: 205px;

          height: 116%;

          border-radius: 50%;

          background: var(--color-primary);

          z-index: 1;
        }


        /* =====================================================
           FORM POSITION (Untouched)
        ====================================================== */

        .auth-form-container {
          position: relative;

          z-index: 2;

          width: 100%;

          max-width: 800px;

          /*
             Extra space for the larger
             blue crescent.
          */

          margin-left: 104px;

          margin-right: 56px;
        }


        /* =====================================================
           TABLET
        ====================================================== */

        @media (max-width: 1100px) {

          .auth-page {
            grid-template-columns: 34% 66%;
          }


          .auth-brand-content {
            padding: 40px 32px;
          }


          .auth-content {
            padding: 32px;
          }


          .auth-form-shell {
            min-height: 620px;

            border-radius:
              110px
              24px
              24px
              110px;
          }


          .auth-form-shell::before {
            left: -90px;

            width: 175px;
          }


          .auth-form-container {
            margin-left: 88px;

            margin-right: 40px;
          }

        }


        /* =====================================================
           MOBILE
        ====================================================== */

        @media (max-width: 760px) {

          .auth-page {
            min-height: auto;

            display: block;

            overflow: visible;
          }


          .auth-brand-panel {
            min-height: 400px;
          }


          .auth-brand-content {
            min-height: 400px;

            padding: 32px 24px;
          }


          .auth-hero-wrapper {
            margin-top: 24px;
          }


          .auth-hero-text {
            font-size: 60px;
          }


          .auth-login-minimal {
            position: absolute;
            right: 24px;
            bottom: 32px;
            gap: 12px;
          }
          
          .auth-login-prompt {
            display: none;
          }


          .auth-content {
            padding: 16px;

            display: block;
          }


          .auth-form-shell {
            min-height: auto;

            padding: 32px 24px;

            border-radius: 24px;

            overflow: hidden;
          }


          /*
             On mobile the crescent becomes
             unnecessary.
          */

          .auth-form-shell::before {
            display: none;
          }


          .auth-form-container {
            max-width: none;

            margin: 0;
          }

        }

      `}</style>

    </div>
  );
}