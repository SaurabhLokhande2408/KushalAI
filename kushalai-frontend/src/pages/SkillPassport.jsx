import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { Card, ProgressBar, StatusBadge } from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { skillDomains, domainAverage, overallScore, statusFromMastery } from '../data/mockSkills';

export default function SkillPassport() {
  const { user } = useApp();
  const [openDomain, setOpenDomain] = useState('technical');

  return (
    <div>
      <PageHeader
        eyebrow="Skill Passport"
        title={`${user?.name}'s competency record`}
        subtitle={`${user?.department} · Overall competency score: ${overallScore()}%`}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {skillDomains.map((domain) => {
          const avg = domainAverage(domain);
          const isOpen = openDomain === domain.id;
          return (
            <Card key={domain.id} flush>
              <button
                onClick={() => setOpenDomain(isOpen ? null : domain.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-3)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <h3 className="text-card-heading">{domain.name}</h3>
                    <StatusBadge status={statusFromMastery(avg)} />
                  </div>
                  <div style={{ maxWidth: 380 }}>
                    <ProgressBar value={avg} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span className="text-stat" style={{ color: 'var(--color-primary)', fontSize: 22 }}>{avg}%</span>
                  <ChevronDown size={20} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--t-fast)' }} />
                </div>
              </button>

              {isOpen && (
                <div style={{ padding: '0 var(--space-3) var(--space-3)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {domain.competencies.map((c) => (
                    <div key={c.id} style={{ paddingTop: 14, borderTop: '1px solid #EEEEEE' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span className="text-meta">{c.mastery}%</span>
                          <StatusBadge status={statusFromMastery(c.mastery)} />
                        </div>
                      </div>
                      <ProgressBar value={c.mastery} />
                      <div className="text-meta" style={{ marginTop: 8 }}>
                        Evidence: {c.evidence.join(' · ')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
