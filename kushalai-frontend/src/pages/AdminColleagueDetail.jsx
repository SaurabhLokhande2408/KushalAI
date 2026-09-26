import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, Avatar, Badge, StatCard, ProgressBar, EmptyState, Button } from '../components/common/UI';
import { getOfficerById } from '../data/mockAdmin';
import { heatmapSkills } from '../data/mockSkills';
import { UserX } from 'lucide-react';

export default function AdminColleagueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const officer = getOfficerById(id);

  if (!officer) {
    return (
      <EmptyState
        icon={<UserX size={26} />}
        title="Officer not found"
        message="This synthetic officer profile does not exist."
        action={<Button onClick={() => navigate('/admin')}>Back to admin dashboard</Button>}
      />
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/admin')}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-secondary)', fontWeight: 600, marginBottom: 'var(--space-3)' }}
      >
        <ArrowLeft size={16} /> Back to admin dashboard
      </button>

      <div className="grid grid-3" style={{ marginBottom: 'var(--space-4)' }}>
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Avatar name={officer.name} size={72} />
          <h2 className="text-card-heading" style={{ marginTop: 12 }}>{officer.name}</h2>
          <p className="text-meta">{officer.designation}</p>
          <p className="text-meta">{officer.department}</p>
          <Badge tone="neutral" >{officer.status}</Badge>
        </Card>
        <StatCard label="Discipline score" value={officer.disciplineScore} />
        <StatCard label="Latest quiz" value={`${officer.latestQuiz}%`} sub={`${officer.coursesCompleted} courses completed`} />
      </div>

      <div className="grid grid-3" style={{ marginBottom: 'var(--space-4)' }}>
        <Card style={{ gridColumn: 'span 2' }}>
          <h3 className="text-card-heading" style={{ marginBottom: 14 }}>Skill Passport</h3>
          {heatmapSkills.map((skill) => (
            <div key={skill} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{skill}</span>
                <span className="text-meta">{officer.skillMastery[skill]}%</span>
              </div>
              <ProgressBar value={officer.skillMastery[skill]} />
            </div>
          ))}
        </Card>

        <Card>
          <h3 className="text-card-heading" style={{ marginBottom: 12 }}>Top skill gaps</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {officer.topGaps.map((g) => (
              <Badge key={g} tone="gap">{g}</Badge>
            ))}
          </div>

          <h3 className="text-card-heading" style={{ margin: '20px 0 10px' }}>Qualifications</h3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: 'var(--color-text-secondary)' }}>
            {officer.qualifications.map((q) => <li key={q}>{q}</li>)}
          </ul>
        </Card>
      </div>

      <Card>
        <h3 className="text-card-heading" style={{ marginBottom: 12 }}>Recent learning activity</h3>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {officer.recentActivity.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      </Card>
    </div>
  );
}
