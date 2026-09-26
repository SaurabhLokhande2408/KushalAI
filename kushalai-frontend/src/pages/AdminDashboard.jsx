import React, { useMemo, useState } from 'react';
import { Users, Gauge, AlertTriangle, BookOpenCheck, Search } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { Card, StatCard, Input, Select } from '../components/common/UI';
import Heatmap from '../components/admin/Heatmap';
import EmergingSkills from '../components/admin/EmergingSkills';
import ColleagueTable from '../components/admin/ColleagueTable';
import { officers, adminKpis, emergingSkillGaps } from '../data/mockAdmin';

const DEPARTMENTS = ['All', ...new Set(officers.map((o) => o.department))];
const STATUSES = ['All', 'On Track', 'Steady', 'Needs Attention'];

export default function AdminDashboard() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [status, setStatus] = useState('All');

  const filtered = useMemo(() => {
    return officers.filter((o) => {
      const matchesSearch = o.name.toLowerCase().includes(search.toLowerCase());
      const matchesDept = department === 'All' || o.department === department;
      const matchesStatus = status === 'All' || o.status === status;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [search, department, status]);

  const gaps = emergingSkillGaps();

  return (
    <div>
      <PageHeader
        eyebrow="Workforce Overview"
        title="Admin dashboard"
        subtitle="Read-only view of officer competency and training progress across your department."
      />

      <div className="grid grid-4" style={{ marginBottom: 'var(--space-4)' }}>
        <StatCard icon={<Users size={20} />} label="Total officers" value={adminKpis.totalOfficers} />
        <StatCard icon={<Gauge size={20} />} label="Average skill score" value={`${adminKpis.avgSkillScore}%`} />
        <StatCard icon={<AlertTriangle size={20} />} label="Critical skill gaps" value={adminKpis.criticalGaps} />
        <StatCard icon={<BookOpenCheck size={20} />} label="Courses completed" value={adminKpis.coursesCompleted} sub={`Avg discipline ${adminKpis.avgDisciplineScore}`} />
      </div>

      <div className="grid grid-3" style={{ marginBottom: 'var(--space-4)', alignItems: 'stretch' }}>
        <Card style={{ gridColumn: 'span 2' }}>
          <h3 className="text-card-heading" style={{ marginBottom: 4 }}>Workforce competency heatmap</h3>
          <p className="text-meta" style={{ marginBottom: 14 }}>Hover a cell to see officer, skill and mastery.</p>
          <Heatmap officers={officers} />
        </Card>
        <Card>
          <h3 className="text-card-heading" style={{ marginBottom: 14 }}>Emerging skills in your department</h3>
          <EmergingSkills data={gaps} />
        </Card>
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <h3 className="text-card-heading">Officers</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--color-text-secondary)' }} />
              <Input placeholder="Search officer name" value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 38, width: 220 }} />
            </div>
            <Select value={department} onChange={(e) => setDepartment(e.target.value)}>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </Select>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
        </div>
        <ColleagueTable officers={filtered} />
      </Card>
    </div>
  );
}
