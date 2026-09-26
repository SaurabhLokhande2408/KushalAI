import React from 'react';
import { ProgressBar } from '../common/UI';

export default function QuizProgress({ current, total }) {
  return (
    <div style={{ marginBottom: 'var(--space-4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span className="text-meta" style={{ fontWeight: 600 }}>Question {current} of {total}</span>
        <span className="text-meta">{Math.round((current / total) * 100)}% complete</span>
      </div>
      <ProgressBar value={(current / total) * 100} />
    </div>
  );
}
