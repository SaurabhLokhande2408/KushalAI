import React from 'react';

export default function EmergingSkills({ data }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {data.map((d, i) => (
        <div key={d.skill}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{i + 1}. {d.skill}</span>
            <span className="text-meta">{d.count} officer{d.count === 1 ? '' : 's'} with gaps</span>
          </div>
          <div className="progress-track" style={{ height: 8 }}>
            <div
              className="progress-fill"
              style={{ width: `${(d.count / max) * 100}%`, background: 'var(--color-orange)' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
