import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import { Pill } from '../components/common/UI';
import Roadmap from '../components/roadmap/Roadmap';
import CourseDrawer from '../components/roadmap/CourseDrawer';
import { useApp } from '../context/AppContext';
import { getCourseById } from '../data/mockCourses';
import { prereqTitlesFor } from '../data/mockRoadmap';

const DOMAIN_FILTERS = ['All', 'Statistical', 'Technical', 'Digital Governance', 'Behavioural'];
const STATUS_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'In progress', value: 'current' },
  { label: 'Recommended', value: 'recommended' },
  { label: 'Locked', value: 'locked' }
];

export default function RoadmapPage() {
  const { roadmap } = useApp();
  const [domainFilter, setDomainFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const filtered = roadmap.filter(
    (n) => (domainFilter === 'All' || n.domain === domainFilter) && (statusFilter === 'all' || n.status === statusFilter)
  );

  const selectedNode = roadmap.find((n) => n.id === selectedNodeId) || null;
  const selectedCourse = selectedNode ? getCourseById(selectedNode.courseId) : null;
  const prereqTitles = selectedNode ? prereqTitlesFor(selectedNode, roadmap, getCourseById) : [];

  return (
    <div>
      <PageHeader
        eyebrow="Competency Roadmap"
        title="Your learning journey"
        subtitle="Follow the path to close your highest-impact skill gaps first. Locked courses unlock as you complete their prerequisites."
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 'var(--space-4)' }}>
        <div className="chip-select">
          {DOMAIN_FILTERS.map((d) => (
            <Pill key={d} active={domainFilter === d} onClick={() => setDomainFilter(d)}>{d}</Pill>
          ))}
        </div>
        <div className="chip-select">
          {STATUS_FILTERS.map((s) => (
            <Pill key={s.value} active={statusFilter === s.value} onClick={() => setStatusFilter(s.value)}>{s.label}</Pill>
          ))}
        </div>
      </div>

      <div className="card scroll-x" style={{ padding: 'var(--space-3)' }}>
        <Roadmap nodes={filtered} onNodeClick={(node) => setSelectedNodeId(node.id)} />
      </div>

      <CourseDrawer
        open={!!selectedNode}
        node={selectedNode}
        course={selectedCourse}
        prereqTitles={prereqTitles}
        onClose={() => setSelectedNodeId(null)}
      />
    </div>
  );
}
