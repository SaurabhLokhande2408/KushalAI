import React, { useEffect, useState } from 'react';
import RoadmapNode from './RoadmapNode';
import { connectorsForNodes } from '../../data/mockRoadmap';
import { getCourseById } from '../../data/mockCourses';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 720);
  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 720);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

function connectorColor(status) {
  if (status === 'completed') return 'var(--color-primary)';
  return '#D8D8DB';
}

export default function Roadmap({ nodes, onNodeClick }) {
  const isMobile = useIsMobile();
  const links = connectorsForNodes(nodes);

  if (isMobile) {
    const ordered = [...nodes].sort((a, b) => a.y - b.y || a.x - b.x);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, padding: '24px 0' }}>
        {ordered.map((node, i) => {
          const course = getCourseById(node.courseId);
          return (
            <React.Fragment key={node.id}>
              <RoadmapNode node={node} course={course} onClick={() => onNodeClick(node)} style={{ position: 'static', transform: 'none' }} />
              {i < ordered.length - 1 && <div style={{ width: 2, height: 28, background: 'var(--color-border)' }} />}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: 620, minWidth: 760 }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}
      >
        {links.map((link, i) => {
          const { x: x1, y: y1 } = link.from;
          const { x: x2, y: y2 } = link.to;
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;
          return (
            <path
              key={i}
              d={`M ${x1} ${y1} Q ${midX} ${y1}, ${midX} ${midY} T ${x2} ${y2}`}
              vectorEffect="non-scaling-stroke"
              stroke={connectorColor(link.to.status === 'locked' ? 'locked' : link.from.status)}
              strokeWidth={2.5}
              fill="none"
              strokeDasharray={link.to.status === 'locked' && link.from.status !== 'completed' ? '6 6' : 'none'}
            />
          );
        })}
      </svg>
      {nodes.map((node) => {
        const course = getCourseById(node.courseId);
        return (
          <RoadmapNode
            key={node.id}
            node={node}
            course={course}
            onClick={() => onNodeClick(node)}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          />
        );
      })}
    </div>
  );
}
