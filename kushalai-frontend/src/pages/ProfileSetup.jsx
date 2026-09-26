import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const STEPS = [
  'Analyzing your professional profile...',
  'Mapping your competencies...',
  'Identifying skill gaps...',
  'Building your learning roadmap...'
];

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { loginAsDemo } = useApp();
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      if (i >= STEPS.length) {
        clearInterval(interval);
        setDone(true);
      } else {
        setStepIndex(i);
      }
    }, 900);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => {
        loginAsDemo('officer');
        navigate('/dashboard');
      }, 900);
      return () => clearTimeout(t);
    }
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 className="text-page-heading" style={{ marginBottom: 'var(--space-4)' }}>
        {done ? 'Your roadmap is ready' : 'Setting up your competency scan'}
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start', maxWidth: 360, margin: '0 auto' }}>
        {STEPS.map((label, i) => {
          const isComplete = i < stepIndex || done;
          const isActive = i === stepIndex && !done;
          return (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: isComplete || isActive ? 1 : 0.4 }}>
              {isComplete ? (
                <CheckCircle2 size={18} color="var(--color-success)" />
              ) : (
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: '2px solid var(--color-secondary)',
                    borderTopColor: 'transparent',
                    animation: isActive ? 'spin 0.8s linear infinite' : 'none'
                  }}
                />
              )}
              <span style={{ fontSize: 14.5, fontWeight: isActive ? 600 : 500 }}>{label}</span>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
