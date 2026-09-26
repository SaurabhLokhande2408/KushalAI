import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const PUBLIC_PRODUCT_ITEMS = [
  'Competence Gap Engine',
  'Course Recommendation Engine',
  'Assessment Engine',
  'Learning Workspace'
];

const OFFICER_LINK_GROUPS = [
  {
    title: 'Learning',
    links: [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Roadmap', to: '/roadmap' },
      { label: 'Learning workspace', to: '/learning-workspace' }
    ]
  },
  {
    title: 'Practice',
    links: [
      { label: 'Doubts & Guidance', to: '/doubts-guidance' },
      { label: 'Scenario assessment', to: '/scenario-assessment' }
    ]
  },
  {
    title: 'Account',
    links: [{ label: 'Profile', to: '/profile' }]
  }
];

const ADMIN_LINK_GROUPS = [
  {
    title: 'Administration',
    links: [{ label: 'Workforce overview', to: '/admin', end: false }]
  }
];

function FooterLink({ link }) {
  if (link.href) {
    return <a className="kushal-footer__link" href={link.href}>{link.label}</a>;
  }

  return (
    <NavLink
      className={({ isActive }) => `kushal-footer__link${isActive ? ' is-current' : ''}`}
      to={link.to}
      end={link.end ?? true}
    >
      {link.label}
    </NavLink>
  );
}

function LinkGroups({ groups }) {
  return groups.map((group) => (
    <nav className="kushal-footer__group" aria-label={group.title} key={group.title}>
      <h3>{group.title}</h3>
      <ul>
        {group.links.map((link) => (
          <li key={link.label}><FooterLink link={link} /></li>
        ))}
      </ul>
    </nav>
  ));
}

export function PublicFooter() {
  return (
    <footer className="kushal-footer kushal-footer--public">
      <div className="kushal-footer__inner">
        <div className="kushal-footer__public-grid">
          <div className="kushal-footer__brand">
            <Link to="/" aria-label="KushalAI home">
              <img src="/assets/kushalAI_logo.png" alt="KushalAI" />
            </Link>
            <p>Intelligence architecture for capability building.</p>
            <div className="kushal-footer__brand-mark" aria-hidden="true">क</div>
          </div>

          <section className="kushal-footer__group" aria-labelledby="kushal-footer-product">
            <h3 id="kushal-footer-product">Product</h3>
            <ul>
              {PUBLIC_PRODUCT_ITEMS.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section className="kushal-footer__context" aria-labelledby="kushal-footer-sih">
            <h3 id="kushal-footer-sih">About / SIH</h3>
            <ul className="kushal-footer__about-links">
              <li><a className="kushal-footer__link" href="/#problem">Problem statement</a></li>
              <li><a className="kushal-footer__link" href="/#solution">Solution</a></li>
            </ul>
            <dl>
              <div>
                <dt>SIH 2026 · Problem statement 26101</dt>
                <dd>Smart Education</dd>
              </div>
              <div>
                <dt>Organisation</dt>
                <dd>Ministry of Statistics &amp; Programme Implementation</dd>
              </div>
              <div>
                <dt>Division</dt>
                <dd>Data Informatics &amp; Innovation Division</dd>
              </div>
              <div>
                <dt>Theme</dt>
                <dd>Smart Education</dd>
              </div>
            </dl>
          </section>

          <nav className="kushal-footer__group kushal-footer__access" aria-label="Access">
            <h3>Access</h3>
            <ul>
              <li><Link className="kushal-footer__link" to="/login">Login</Link></li>
              <li><Link className="kushal-footer__link" to="/register">Register</Link></li>
            </ul>
          </nav>
        </div>

        <div className="kushal-footer__bottom">
          <span>KushalAI · SIH 2026 · PS 26101</span>
          <span>Synthetic demo environment</span>
        </div>
      </div>
    </footer>
  );
}

export function AuthenticatedFooter() {
  const { user } = useApp();
  const groups = user.role === 'admin' ? ADMIN_LINK_GROUPS : OFFICER_LINK_GROUPS;
  const nextPath = user.role === 'admin' ? '/admin' : '/roadmap';
  const nextLabel = user.role === 'admin' ? 'Return to workforce overview' : 'Continue to your roadmap';

  return (
    <footer className="kushal-footer kushal-footer--app">
      <div className="kushal-footer__inner">
        <div className="kushal-footer__app-grid">
          <div className="kushal-footer__app-intro">
            <span className="kushal-footer__eyebrow">KUSHALAI / YOUR WORKSPACE</span>
            <h2>Where to next?</h2>
            <p>{user?.name} · {user?.role === 'admin' ? 'Administrator' : 'Officer'}</p>
            <Link className="kushal-footer__next" to={nextPath}>
              {nextLabel} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <LinkGroups groups={groups} />
        </div>

        <div className="kushal-footer__bottom">
          <span>KushalAI · Professional learning intelligence</span>
          <Link to="/">Public home <ArrowUpRight size={13} aria-hidden="true" /></Link>
        </div>
      </div>
    </footer>
  );
}