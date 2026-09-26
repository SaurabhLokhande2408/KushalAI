import React, { useState } from 'react';
import { heatmapSkills } from '../../data/mockSkills';

function cellColor(value) {
  if (value >= 80) return { bg: '#1B4CA1', text: '#fff' };
  if (value >= 65) return { bg: '#5C86C9', text: '#fff' };
  if (value >= 50) return { bg: '#F5A12A', text: '#1F1F23' };
  if (value >= 35) return { bg: '#F7C578', text: '#1F1F23' };
  return { bg: '#FBEAE6', text: '#C4432B' };
}

export default function Heatmap({ officers }) {
  const [hovered, setHovered] = useState(null);
  const rows = officers.slice(0, 12);

  return (
    <div>
      <div className="scroll-x">
        <table className="table" style={{ minWidth: 640 }}>
          <thead>
            <tr>
              <th>Officer</th>
              {heatmapSkills.map((skill) => (
                <th key={skill} style={{ textAlign: 'center' }}>{skill}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id}>
                <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{o.name}</td>
                {heatmapSkills.map((skill) => {
                  const value = o.skillMastery[skill];
                  const { bg, text } = cellColor(value);
                  return (
                    <td key={skill} style={{ textAlign: 'center', padding: 8 }}>
                      <div
                        onMouseEnter={() => setHovered({ officer: o.name, skill, value })}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                          background: bg,
                          color: text,
                          borderRadius: 8,
                          height: 34,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: 'default'
                        }}
                      >
                        {value}%
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ minHeight: 20, marginTop: 10 }}>
        {hovered && (
          <span className="text-meta">
            <strong>{hovered.officer}</strong> · {hovered.skill} · {hovered.value}% mastery
          </span>
        )}
      </div>
    </div>
  );
}
