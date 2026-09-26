import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Route as RouteIcon, ShieldCheck } from 'lucide-react';
import { Button, Card } from '../components/common/UI';

const FEATURES = [
  { icon: BarChart3, title: 'Competency-gap analysis', text: 'Every officer\u2019s skill profile is scored against the competencies their role requires.' },
  { icon: RouteIcon, title: 'Personalised learning paths', text: 'An ordered roadmap of courses closes the highest-impact gaps first.' },
  { icon: ShieldCheck, title: 'Administrator visibility', text: 'Read-only workforce analytics help training teams see where gaps concentrate.' }
];

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <section className="container" style={{ padding: 'var(--space-9) 0 var(--space-6)', textAlign: 'center' }}>
        <div className="text-meta" style={{ color: 'var(--color-secondary)', fontWeight: 600, marginBottom: 12 }}>
          For India's Official Statistical System
        </div>
        <h1 className="text-hero" style={{ maxWidth: 780, margin: '0 auto' }}>
          Close competency gaps with an AI-enabled learning platform built for public-sector officers.
        </h1>
        <p className="text-body" style={{ maxWidth: 560, margin: 'var(--space-3) auto 0' }}>
          KushalAI analyses each officer's role and skills, then builds a personalised roadmap of
          courses and assessments to close the gaps that matter most.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 'var(--space-4)' }}>
          <Link to="/register"><Button>Get started</Button></Link>
          <Link to="/login"><Button variant="secondary">I already have an account</Button></Link>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 'var(--space-9)' }}>
        <div className="grid grid-3">
          {FEATURES.map((f) => (
            <Card key={f.title} hover>
              <div className="stat-icon" style={{ marginBottom: 14 }}>
                <f.icon size={20} />
              </div>
              <h3 className="text-card-heading" style={{ marginBottom: 8 }}>{f.title}</h3>
              <p className="text-body">{f.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="container" style={{ padding: 'var(--space-4) 0', borderTop: '1px solid var(--color-border)' }}>
        <span className="text-meta">KushalAI demo prototype · Synthetic data throughout · No live iGOT Karmayogi integration</span>
      </footer>
    </div>
  );
}
