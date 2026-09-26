import React, { useEffect, useState } from 'react';
import {
  Pencil,
  Check,
  ShieldCheck,
  Mail,
  Briefcase,
  Building2,
} from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import { Field, Input, Button, Badge, Skeleton } from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { overallScore } from '../data/mockSkills';

function ProfileLoadingSkeleton() {
  return (
    <div className="profile-loading" aria-busy="true" aria-label="Loading profile">
      <div className="profile-loading-shell">
        <div className="profile-loading-header">
          <Skeleton width={190} height={30} />
          <Skeleton width={92} height={40} radius={8} />
        </div>

        <div className="profile-loading-hero">
          <Skeleton width={104} height={104} radius="50%" />
          <div className="profile-loading-identity">
            <Skeleton width={132} height={12} />
            <Skeleton width="min(100%, 380px)" height={52} />
            <Skeleton width="min(100%, 300px)" height={16} />
          </div>
        </div>

        <div className="profile-loading-metrics">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="profile-loading-metric" key={index}>
              <Skeleton width="48%" height={30} />
              <Skeleton width="70%" height={14} />
              <Skeleton width="55%" height={12} />
            </div>
          ))}
        </div>

        <div className="profile-loading-details">
          <Skeleton width={220} height={28} />
          <div className="profile-loading-fields">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index}>
                <Skeleton width="34%" height={12} />
                <Skeleton width="100%" height={42} radius={6} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .profile-loading {
          width: 100%;
        }

        .profile-loading-shell {
          width: min(1360px, calc(100% - 80px));
          margin: 0 auto;
          padding-top: 24px;
        }

        .profile-loading-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .profile-loading-hero {
          min-height: 325px;
          display: flex;
          align-items: center;
          gap: 34px;
          padding: 48px 58px;
          margin-bottom: 16px;
          background: #fff;
          border-radius: 8px;
        }

        .profile-loading-identity {
          display: grid;
          gap: 14px;
          width: min(100%, 590px);
        }

        .profile-loading-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr) 1.3fr;
          border-bottom: 1px solid var(--color-border);
        }

        .profile-loading-metric {
          min-height: 92px;
          display: grid;
          align-content: center;
          gap: 8px;
          padding: 16px 24px;
          border-right: 1px solid var(--color-border);
        }

        .profile-loading-details {
          display: grid;
          gap: 22px;
          margin-top: 48px;
        }

        .profile-loading-fields {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .profile-loading-fields > div {
          display: grid;
          gap: 8px;
        }

        @media (max-width: 760px) {
          .profile-loading-shell {
            width: calc(100% - 30px);
            padding-top: 18px;
          }

          .profile-loading-hero {
            min-height: 300px;
            align-items: flex-start;
            flex-direction: column;
            gap: 20px;
            padding: 32px 27px;
          }

          .profile-loading-metrics {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .profile-loading-fields {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .profile-loading-metrics {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default function Profile() {
  const { user, disciplineScore, courseCompletion } = useApp();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    designation: user?.designation || '',
    department: user?.department || '',
  });

  const update = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsInitialLoading(false), 1000);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (isInitialLoading) return <ProfileLoadingSkeleton />;

  return (
    <div className="profile-page">

      {/* =====================================================
          ABSTRACT क ART
      ===================================================== */}

      <svg
        className="profile-art"
        viewBox="0 0 900 900"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <marker
            id="profile-k-arrow"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path
              d="M 0 0 L 10 5 L 0 10"
              fill="none"
              stroke="#ea580c"
              strokeWidth="1.4"
            />
          </marker>
        </defs>

        <g
          fill="none"
          stroke="#ea580c"
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd="url(#profile-k-arrow)"
        >

          {/* Main vertical stroke */}
          <path
            className="k-line k-line-1"
            d="
              M 438 40
              C 410 180 456 310 438 440
              C 420 580 450 710 430 865
            "
          />

          {/* Left Devanagari sweep */}
          <path
            className="k-line k-line-2"
            d="
              M 445 275
              C 310 238 175 300 170 430
              C 164 560 280 620 442 505
            "
          />

          {/* Right hook */}
          <path
            className="k-line k-line-3"
            d="
              M 438 355
              C 570 350 705 400 704 535
              C 703 660 595 755 455 795
            "
          />

          {/* Bottom sweep */}
          <path
            className="k-line k-line-4"
            d="
              M 50 735
              C 245 790 420 710 560 665
              C 680 625 785 645 865 700
            "
          />

        </g>
      </svg>


      {/* =====================================================
          PAGE SHELL
      ===================================================== */}

      <div className="profile-shell">

        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <PageHeader
          title="Profile"
          action={
            <Button
              variant="secondary"
              className="edit-profile"
              onClick={() => setEditing((prev) => !prev)}
            >
              {editing ? (
                <>
                  <Check size={18} />
                  Save
                </>
              ) : (
                <>
                  <Pencil size={18} />
                  Edit
                </>
              )}
            </Button>
          }
        />


        {/* ===================================================
            IDENTITY HERO
        =================================================== */}

        <section className="identity-hero">

          <div className="hero-orange-line" />


          {/* Identity content */}

          <div className="identity-content">

            <div className="identity-top">

              {/* Avatar */}

              <div className="identity-avatar-wrap">

                <div className="identity-avatar">
                  <img
                    src="/assets/pfp.jpg"
                    alt={user?.name || 'Profile'}
                  />
                </div>

                <div className="verified">
                  <ShieldCheck size={16} />
                  VERIFIED
                </div>

              </div>


              {/* Name */}

              <div className="identity-copy">

                <div className="identity-eyebrow">
                  OFFICER / PROFILE
                </div>

                <h1>
                  {user?.name || "Corporate User"}
                </h1>

                <div className="identity-role">
                  {user?.designation || 'Officer'}

                  <span>·</span>

                  {user?.department || 'KushalAI'}
                </div>

              </div>

            </div>


          </div>

          <div className="hero-logo">
            <img src="/assets/kushalAI_logo.png" alt="KushalAI" />
          </div>

        </section>


        {/* ===================================================
            METRICS
        =================================================== */}

        <section className="metrics">

          <div className="metric">

            <div className="metric-value orange">
              {disciplineScore || '92'}
            </div>

            <div className="metric-copy">
              <strong>Discipline</strong>
              <span>Current score</span>
            </div>

          </div>


          <div className="metric">

            <div className="metric-value">
              {overallScore ? overallScore() : '85'}%
            </div>

            <div className="metric-copy">
              <strong>Skill score</strong>
              <span>Overall competency</span>
            </div>

          </div>


          <div className="metric">

            <div className="metric-value">
              {courseCompletion?.completed || '12'}
            </div>

            <div className="metric-copy">
              <strong>Completed</strong>
              <span>Learning modules</span>
            </div>

          </div>


          <div className="metric-note">
            <span />
            Learning profile active
          </div>

        </section>


        {/* ===================================================
            DETAILS
        =================================================== */}

        <section className="details-section">

          <div className="details-heading">

            <span className="details-number">
              01
            </span>

            <div>
              <h2>
                About you
              </h2>

            </div>

          </div>


          <div className="details-grid">

            {/* =================================================
                PERSONAL DETAILS
            ================================================= */}

            <div className="details-fields">

              <Field label="Full name">
                <Input
                  value={form.name}
                  disabled={!editing}
                  onChange={(e) =>
                    update('name', e.target.value)
                  }
                />
              </Field>


              <Field label="Email">
                <div className="profile-input-icon">

                  <Input
                    value={form.email}
                    disabled={!editing}
                    onChange={(e) =>
                      update('email', e.target.value)
                    }
                  />

                  <Mail size={18} />

                </div>
              </Field>


              <Field label="Designation">
                <div className="profile-input-icon">

                  <Input
                    value={form.designation}
                    disabled={!editing}
                    onChange={(e) =>
                      update('designation', e.target.value)
                    }
                  />

                  <Briefcase size={18} />

                </div>
              </Field>


              <Field label="Department">
                <div className="profile-input-icon">

                  <Input
                    value={form.department}
                    disabled={!editing}
                    onChange={(e) =>
                      update('department', e.target.value)
                    }
                  />

                  <Building2 size={18} />

                </div>
              </Field>

            </div>


            {/* =================================================
                INTERESTS
            ================================================= */}

            <div className="profile-interests">

              <div className="interest-block">

                <div className="interest-label">
                  INTERESTED IN
                </div>

                <div className="domain-list">

                  {(user?.interestedDomains || ['Technology', 'Leadership']).map((domain) => (
                    <Badge
                      key={domain}
                      tone="neutral"
                    >
                      {domain}
                    </Badge>
                  ))}

                </div>

              </div>


              <div className="interest-block">

                <div className="interest-label">
                  QUALIFICATIONS
                </div>

                <div className="simple-list">

                  {(user?.qualifications || ['Bachelor of Engineering', 'Project Management']).map((item) => (
                    <div
                      key={item}
                      className="simple-list-item"
                    >
                      <span />
                      {item}
                    </div>
                  ))}

                </div>

              </div>


              <div className="profile-statement">

                <div className="statement-mark">
                  क
                </div>

                <p>
                  Learn with purpose.
                  <br />
                  Grow with clarity.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="profile-footer">

          <span>
            KUSHALAI
          </span>

          <span>
            PROFESSIONAL LEARNING INTELLIGENCE
          </span>

          <span>
            2026
          </span>

        </footer>

      </div>


      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* =====================================================
           PAGE
        ===================================================== */

        .profile-page {
          position: relative;
          min-height: calc(100vh - 76px);
          overflow: hidden;
          background: var(--color-offwhite, #f7f7f5);
          color: var(--color-primary, #123f73);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .profile-shell {
          position: relative;
          z-index: 3;
          width: min(1360px, calc(100% - 80px));
          margin: 0 auto;
          padding: 28px 0 42px;
        }

        /* =====================================================
           ABSTRACT क
        ===================================================== */

        .profile-art {
          position: absolute;
          z-index: 1;
          top: 80px;
          right: -70px;
          width: min(720px, 52vw);
          height: 720px;
          pointer-events: none;
          overflow: visible;
          opacity: .13;
          transform: rotate(-2deg);
        }

        .k-line {
          stroke-width: 4.5;
          stroke-dasharray: 2600;
          stroke-dashoffset: 2600;
          animation: drawK 4.2s cubic-bezier(.65, 0, .35, 1) forwards;
        }

        .k-line-1 { animation-delay: .15s; }
        .k-line-2 { animation-delay: .45s; }
        .k-line-3 { animation-delay: .8s; }
        .k-line-4 { animation-delay: 1.1s; }

        @keyframes drawK {
          0% { stroke-dashoffset: 2600; }
          100% { stroke-dashoffset: 0; }
        }

        /* =====================================================
           EDIT BUTTON
        ===================================================== */

        .edit-profile {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          min-height: 42px !important;
          padding: 0 20px !important;
          border-radius: 999px !important;
          background: transparent !important;
          border: 1px solid rgba(18,63,115,.2) !important;
          color: var(--color-primary, #123f73) !important;
          font-size: 15px !important;
          font-weight: 600 !important;
          transition: background .2s ease, color .2s ease;
        }

        .edit-profile:hover {
          background: var(--color-primary, #123f73) !important;
          color: white !important;
        }

        /* =====================================================
           HERO
        ===================================================== */

        .identity-hero {
          position: relative;
          min-height: 325px;
          margin-top: 20px;
          overflow: hidden;
          background: var(--color-primary, #123f73);
          color: white;
          border-radius: 0 0 0 110px;
        }

        .hero-orange-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 90px;
          height: 5px;
          background: #ea580c;
        }

        /* =====================================================
           HERO CONTENT
        ===================================================== */

        .identity-content {
          position: relative;
          z-index: 5;
          min-height: 325px;
          padding: 55px 58px 38px;
          padding-right: 390px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
        }

        .hero-logo {
          position: absolute;
          z-index: 7;
          top: 50%;
          right: 70px;
          width: 280px;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .hero-logo img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .identity-top {
          display: flex;
          align-items: center;
          gap: 34px;
        }

        /* =====================================================
           AVATAR
        ===================================================== */

        .identity-avatar-wrap {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .identity-avatar {
          width: 104px;
          height: 104px;
          overflow: hidden;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 12px 30px rgba(0,0,0,.16);
        }

        .identity-avatar img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center 20%;
        }

        .verified {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,.9);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .12em;
        }

        .verified svg {
          color: #ea580c;
        }

        /* =====================================================
           NAME
        ===================================================== */

        .identity-copy {
          position: relative;
          z-index: 6;
          max-width: 590px;
        }

        .identity-eyebrow {
          margin-bottom: 12px;
          color: rgba(255,255,255,.65);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: .18em;
        }

        .identity-copy h1 {
          margin: 0;
          color: white;
          font-size: clamp(40px, 5.5vw, 64px);
          font-weight: 800;
          line-height: .95;
          letter-spacing: -.03em;
        }

        .identity-role {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,.85);
          font-size: 16px;
          font-weight: 500;
        }

        .identity-role span {
          color: #ea580c;
        }

        /* =====================================================
           METRICS
        ===================================================== */

        .metrics {
          position: relative;
          z-index: 5;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1.3fr;
          border-bottom: 1px solid rgba(18,63,115,.16);
        }

        .metric {
          min-height: 92px;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 24px;
          border-right: 1px solid rgba(18,63,115,.12);
        }

        .metric-value {
          font-size: 36px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: -.04em;
        }

        .metric-value.orange {
          color: #ea580c;
        }

        .metric-copy strong {
          display: block;
          font-size: 16px;
          font-weight: 700;
        }

        .metric-copy span {
          display: block;
          margin-top: 4px;
          color: #717d89;
          font-size: 14px;
        }

        .metric-note {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 18px 24px;
          color: #717d89;
          font-size: 15px;
          font-weight: 600;
        }

        .metric-note span {
          width: 8px;
          height: 8px;
          flex: 0 0 8px;
          border-radius: 50%;
          background: #ea580c;
        }

        /* =====================================================
           DETAILS
        ===================================================== */

        .details-section {
          position: relative;
          z-index: 5;
          margin-top: 58px;
        }

        .details-heading {
          display: flex;
          align-items: flex-start;
          gap: 18px;
        }

        .details-number {
          padding-top: 4px;
          color: #ea580c;
          font-family: ui-monospace, monospace;
          font-size: 16px;
          font-weight: 800;
        }

        .details-heading h2 {
          margin: 0;
          font-size: 28px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -.03em;
        }

        .details-heading p {
          margin: 8px 0 0;
          color: #717d89;
          font-size: 15px;
        }

        .details-grid {
          margin-top: 25px;
          display: grid;
          grid-template-columns: 1.15fr .85fr;
          gap: 60px;
          padding-top: 30px;
          border-top: 1px solid rgba(18,63,115,.16);
        }

        /* =====================================================
           FORM
        ===================================================== */

        .details-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 32px;
          row-gap: 32px;
        }

        .details-fields input {
          padding-left: 0 !important;
          padding-right: 28px !important;
          padding-bottom: 6px !important;
          border: 0 !important;
          border-bottom: 1px solid #cbd2d9 !important;
          border-radius: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          color: var(--color-primary, #123f73) !important;
          font-size: 16px !important;
          font-weight: 500;
          width: 100%;
        }

        .details-fields input:focus {
          border-bottom-color: #ea580c !important;
          outline: none;
        }

        .details-fields input:disabled {
          opacity: 1 !important;
          color: #4a5568 !important;
        }

        .profile-input-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .profile-input-icon svg {
          position: absolute;
          right: 0;
          bottom: 10px;
          color: #8c97a3;
          pointer-events: none;
        }

        .details-fields label {
          font-size: 14px !important;
          font-weight: 700 !important;
          color: var(--color-primary, #123f73) !important;
          letter-spacing: .03em;
          margin-bottom: 8px;
          display: inline-block;
          text-transform: uppercase;
        }

        /* =====================================================
           INTERESTS
        ===================================================== */

        .profile-interests {
          padding-left: 40px;
          border-left: 1px solid rgba(18,63,115,.13);
        }

        .interest-block + .interest-block {
          margin-top: 36px;
        }

        .interest-label {
          margin-bottom: 14px;
          color: var(--color-primary, #123f73);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: .12em;
        }

        .domain-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .domain-list > div {
          font-size: 14px;
          padding: 8px 14px;
        }

        .simple-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .simple-list-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #4a5568;
          font-size: 16px;
          font-weight: 500;
        }

        .simple-list-item span {
          width: 16px;
          height: 2px;
          background: #ea580c;
        }

        /* =====================================================
           STATEMENT
        ===================================================== */

        .profile-statement {
          position: relative;
          margin-top: 40px;
          padding: 28px 30px;
          overflow: hidden;
          background: var(--color-primary, #123f73);
          color: white;
          border-radius: 8px;
        }

        .statement-mark {
          position: absolute;
          right: 15px;
          bottom: -20px;
          color: transparent;
          font-family: "Noto Sans Devanagari", "Mangal", sans-serif;
          font-size: 115px;
          line-height: 1;
          font-weight: 700;
          -webkit-text-stroke: 1.5px rgba(234,88,12,.4);
        }

        .profile-statement p {
          position: relative;
          z-index: 2;
          margin: 0;
          font-size: 18px;
          line-height: 1.6;
          font-weight: 500;
        }

        /* =====================================================
           FOOTER
        ===================================================== */

        .profile-footer {
          position: relative;
          z-index: 5;
          margin-top: 70px;
          padding-top: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(18,63,115,.14);
          color: #8c97a3;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .12em;
        }

        .profile-footer span:first-child {
          color: var(--color-primary, #123f73);
        }

        .profile-footer span:last-child {
          color: #ea580c;
        }

        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 1100px) {
          .profile-shell {
            width: min(1360px, calc(100% - 50px));
          }
          .profile-art {
            right: -190px;
            width: 620px;
            opacity: .095;
          }
          .hero-logo {
            right: 35px;
            width: 220px;
            height: 145px;
          }
          .identity-content {
            padding-right: 300px;
          }
          .details-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .profile-interests {
            padding-left: 0;
            padding-top: 30px;
            border-left: 0;
            border-top: 1px solid rgba(18,63,115,.13);
          }
        }

        /* =====================================================
           SMALL LAPTOP
        ===================================================== */

        @media (max-width: 900px) {
          .hero-logo {
            right: 30px;
            width: 180px;
            height: 120px;
          }
          .identity-content {
            padding-right: 245px;
          }
          .identity-copy h1 {
            font-size: 48px;
          }
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 760px) {
          .profile-shell {
            width: calc(100% - 30px);
            padding-top: 18px;
          }
          .profile-art {
            top: 120px;
            right: -300px;
            width: 600px;
            opacity: .07;
          }
          .identity-hero {
            min-height: auto;
            border-radius: 0 0 0 55px;
          }
          .identity-content {
            min-height: auto;
            padding: 42px 27px 30px;
            padding-right: 27px;
          }
          .hero-logo {
            display: none;
          }
          .identity-top {
            align-items: flex-start;
            flex-direction: column;
            gap: 20px;
          }
          .identity-copy h1 {
            font-size: 38px;
          }
          .identity-role {
            flex-wrap: wrap;
            line-height: 1.5;
          }
          .metrics {
            grid-template-columns: 1fr 1fr;
          }
          .metric {
            border-bottom: 1px solid rgba(18,63,115,.12);
          }
          .metric:nth-child(2) {
            border-right: 0;
          }
          .metric-note {
            grid-column: 1 / -1;
          }
          .details-fields {
            grid-template-columns: 1fr;
          }
          .profile-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }

        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 480px) {
          .identity-copy h1 {
            font-size: 34px;
          }
          .metrics {
            grid-template-columns: 1fr;
          }
          .metric {
            border-right: 0;
          }
          .metric-note {
            grid-column: auto;
          }
        }

      `}</style>

    </div>
  );
}