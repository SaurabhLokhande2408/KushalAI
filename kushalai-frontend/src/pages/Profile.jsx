import React, { useState } from 'react';
import { Pencil, Check } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { Card, Field, Input, Button, Avatar, Badge } from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { overallScore } from '../data/mockSkills';

export default function Profile() {
  const { user, disciplineScore, courseCompletion } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    designation: user?.designation || '',
    department: user?.department || ''
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <div>
      <PageHeader
        eyebrow="Profile"
        title="Your profile"
        subtitle="Personal and professional information. Changes here are local to this demo session."
        action={
          <Button variant="secondary" onClick={() => setEditing((e) => !e)}>
            {editing ? <><Check size={16} /> Done</> : <><Pencil size={16} /> Edit</>}
          </Button>
        }
      />

      <div className="grid grid-3">
        <Card style={{ gridColumn: 'span 1', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <Avatar name={user?.name} size={72} />
          </div>
          <h3 className="text-card-heading">{user?.name}</h3>
          <p className="text-meta" style={{ marginTop: 4 }}>{user?.officerId}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 'var(--space-3)' }}>
            <div>
              <div className="text-stat" style={{ fontSize: 22, color: 'var(--color-primary)' }}>{disciplineScore}</div>
              <div className="text-meta">Discipline</div>
            </div>
            <div>
              <div className="text-stat" style={{ fontSize: 22, color: 'var(--color-primary)' }}>{overallScore()}%</div>
              <div className="text-meta">Skill score</div>
            </div>
            <div>
              <div className="text-stat" style={{ fontSize: 22, color: 'var(--color-primary)' }}>{courseCompletion.completed}</div>
              <div className="text-meta">Completed</div>
            </div>
          </div>
        </Card>

        <Card style={{ gridColumn: 'span 2' }}>
          <h3 className="text-card-heading" style={{ marginBottom: 14 }}>Personal & professional information</h3>
          <div className="grid grid-2">
            <Field label="Full name">
              <Input value={form.name} disabled={!editing} onChange={(e) => update('name', e.target.value)} />
            </Field>
            <Field label="Email">
              <Input value={form.email} disabled={!editing} onChange={(e) => update('email', e.target.value)} />
            </Field>
            <Field label="Designation">
              <Input value={form.designation} disabled={!editing} onChange={(e) => update('designation', e.target.value)} />
            </Field>
            <Field label="Department">
              <Input value={form.department} disabled={!editing} onChange={(e) => update('department', e.target.value)} />
            </Field>
          </div>

          <div style={{ marginTop: 'var(--space-2)' }}>
            <div className="text-meta" style={{ fontWeight: 600, marginBottom: 8 }}>Qualifications</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--color-text-secondary)', fontSize: 14 }}>
              {user?.qualifications?.map((q) => <li key={q}>{q}</li>)}
            </ul>
          </div>

          <div style={{ marginTop: 'var(--space-2)' }}>
            <div className="text-meta" style={{ fontWeight: 600, marginBottom: 8 }}>Past trainings</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--color-text-secondary)', fontSize: 14 }}>
              {user?.pastTrainings?.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>

          <div style={{ marginTop: 'var(--space-2)' }}>
            <div className="text-meta" style={{ fontWeight: 600, marginBottom: 8 }}>Interested domains</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {user?.interestedDomains?.map((d) => <Badge key={d} tone="neutral">{d}</Badge>)}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
