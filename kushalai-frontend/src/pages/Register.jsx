import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Field, Input, Pill } from '../components/common/UI';

const DOMAINS = ['Statistical Analysis', 'Python', 'SQL', 'GIS', 'AI / ML', 'Cloud', 'Data Privacy', 'Digital Governance', 'Leadership', 'Communication'];

export default function Register() {
  const navigate = useNavigate();
  const [selectedDomains, setSelectedDomains] = useState(['Python', 'SQL']);

  function toggleDomain(domain) {
    setSelectedDomains((prev) => (prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]));
  }

  function handleSubmit(e) {
    e.preventDefault();
    navigate('/profile-setup');
  }

  return (
    <div>
      <h1 className="text-page-heading" style={{ marginBottom: 6 }}>Create your profile</h1>
      <p className="text-body" style={{ marginBottom: 'var(--space-4)' }}>Tell us about your role so we can map your competencies.</p>

      <form onSubmit={handleSubmit}>
        <Field label="Full name"><Input required placeholder="e.g. Arjun Mehta" /></Field>
        <Field label="Officer ID"><Input required placeholder="e.g. OSS-2291" /></Field>
        <Field label="Email"><Input type="email" required placeholder="you@department.gov.in" /></Field>
        <Field label="Designation"><Input required placeholder="e.g. Data Analyst" /></Field>
        <Field label="Department"><Input required placeholder="e.g. Data Informatics & Innovation Division" /></Field>
        <Field label="Qualifications"><Input placeholder="e.g. M.Sc. Statistics" /></Field>
        <Field label="Past trainings"><Input placeholder="e.g. Foundations of Official Statistics (2023)" /></Field>

        <Field label="Interested domains / courses">
          <div className="chip-select">
            {DOMAINS.map((d) => (
              <Pill key={d} active={selectedDomains.includes(d)} type="button" onClick={() => toggleDomain(d)}>
                {d}
              </Pill>
            ))}
          </div>
        </Field>

        <Button type="submit" block style={{ marginTop: 'var(--space-2)' }}>Create profile</Button>
      </form>

      <p className="text-meta" style={{ textAlign: 'center', marginTop: 'var(--space-3)' }}>
        Already registered? <Link to="/login" style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Log in</Link>
      </p>
    </div>
  );
}
