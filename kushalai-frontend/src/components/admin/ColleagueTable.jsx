import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Badge } from '../common/UI';

const STATUS_TONE = { 'On Track': 'mastered', Steady: 'developing', 'Needs Attention': 'gap' };

export default function ColleagueTable({ officers }) {
  const navigate = useNavigate();

  return (
    <div className="scroll-x">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Designation</th>
            <th>Department</th>
            <th>Discipline</th>
            <th>Latest quiz</th>
            <th>Top gaps</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {officers.map((o) => (
            <tr key={o.id} className="clickable" onClick={() => navigate(`/admin/colleagues/${o.id}`)}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={o.name} size={32} profileImage={o.profileImage} />
                  <span style={{ fontWeight: 600 }}>{o.name}</span>
                </div>
              </td>
              <td>{o.designation}</td>
              <td>{o.department}</td>
              <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{o.disciplineScore}</td>
              <td>{o.latestQuiz}%</td>
              <td>{o.topGaps.join(', ')}</td>
              <td><Badge tone={STATUS_TONE[o.status]}>{o.status}</Badge></td>
            </tr>
          ))}
          {officers.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                No officers match these filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
