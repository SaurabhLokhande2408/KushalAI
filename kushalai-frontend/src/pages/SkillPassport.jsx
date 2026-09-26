import React, { useEffect, useMemo, useState } from 'react';

import PageHeader from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/UI';
import { useApp } from '../context/AppContext';
import {
  skillDomains,
  domainAverage,
  overallScore,
  statusFromMastery,
} from '../data/mockSkills';

function AnimatedProgressBar({ value, small = false }) {
  return (
    <div
      className={`skill-progress ${small ? 'skill-progress-small' : ''}`}
      role="progressbar"
      aria-label="Competency progress"
      aria-valuenow={value}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div className="skill-progress-fill" style={{ '--target-width': `${value}%` }} />
    </div>
  );
}

function ConsistencyGraph({ history = [] }) {
  const chartData = useMemo(() => {
    const points = history.length
      ? history.slice(-8).map((item, index) => ({
          label: item.attempt || item.label || `Attempt ${index + 1}`,
          value: Number.isFinite(item.score) ? item.score : Number(item.value) || 0,
        }))
      : [];

    const average = points.length
      ? Math.round(points.reduce((sum, item) => sum + item.value, 0) / points.length)
      : 0;

    return { points, average };
  }, [history]);

  if (!chartData.points.length) {
    return (
      <div className="consistency-card">
        <div className="consistency-header">
          <div>
            <h2>Consistency</h2>
            <p>No historical activity data available yet.</p>
          </div>
        </div>
      </div>
    );
  }

  const width = 640;
  const height = 240;
  const paddingLeft = 42;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 42;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = chartData.points.map((item, index) => {
    const x = paddingLeft + (index / Math.max(chartData.points.length - 1, 1)) * chartWidth;
    const y = paddingTop + chartHeight - (item.value / 100) * chartHeight;
    return { ...item, x, y };
  });

  const linePath = points
    .map((point, index) => (index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`))
    .join(' ');

  return (
    <div className="consistency-card">
      <div className="consistency-header">
        <div>
          <h2>Consistency</h2>
          <p>Recent learning activity</p>
        </div>
        <div className="consistency-score">
          <strong>{chartData.average}%</strong>
          <span>Average</span>
        </div>
      </div>

      <div className="consistency-chart">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="consistency-svg">
          {[0, 25, 50, 75, 100].map((value) => {
            const y = paddingTop + chartHeight - (value / 100) * chartHeight;
            return (
              <g key={value}>
                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} className="chart-grid-line" />
                <text x={paddingLeft - 10} y={y + 4} className="chart-y-label" textAnchor="end">
                  {value}
                </text>
              </g>
            );
          })}

          <path
            d={`
              ${linePath}
              L ${points[points.length - 1].x} ${paddingTop + chartHeight}
              L ${points[0].x} ${paddingTop + chartHeight}
              Z
            `}
            className="consistency-area"
          />

          <path d={linePath} className="consistency-line" />

          {points.map((point) => (
            <circle key={point.label} cx={point.x} cy={point.y} r="4" className="consistency-point" />
          ))}

          {points.map((point) => (
            <text key={`label-${point.label}`} x={point.x} y={height - 12} className="chart-x-label" textAnchor="middle">
              {point.label.replace('Attempt ', 'A')}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

function CompetencyDonut() {
  const [score, setScore] = useState(0);
  const allCompetencies = skillDomains.flatMap((domain) => domain.competencies);
  const finalScore = overallScore();
  const radius = 92;
  const circumference = 2 * Math.PI * radius;
  const coloredCircumference = circumference * (score / 100);

  const statusOrder = ['Mastered', 'Proficient', 'Developing', 'Gap'];
  const statusMeta = {
    Mastered: { label: 'Mastered', color: '#198754' },
    Proficient: { label: 'Proficient', color: '#2563B8' },
    Developing: { label: 'Developing', color: '#F59E0B' },
    Gap: { label: 'Needs Attention', color: '#D6452D' },
  };

  const statusGroups = { Mastered: 0, Proficient: 0, Developing: 0, Gap: 0 };
  allCompetencies.forEach((competency) => {
    const status = statusFromMastery(competency.mastery);
    if (statusGroups[status] !== undefined) statusGroups[status] += 1;
  });

  const totalStatus = Object.values(statusGroups).reduce((sum, count) => sum + count, 0);
  const segments = statusOrder.map((status) => ({
    status,
    label: statusMeta[status].label,
    color: statusMeta[status].color,
    count: statusGroups[status],
    value: totalStatus ? (statusGroups[status] / totalStatus) * 100 : 0,
  }));

  useEffect(() => {
    const duration = 3000;
    const startTime = performance.now();
    let animationFrame;

    const animate = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setScore(Math.round(finalScore * eased));
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [finalScore]);

  return (
    <div className="competency-overview">
      <div className="donut-wrapper">
        <svg
          className="competency-donut"
          viewBox="0 0 260 260"
          role="img"
          aria-label={`${score}% Overall Competency Score`}
        >
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke="#E8EEF5"
            strokeWidth="18"
          />
          {(() => {
            let accumulatedLength = 0;

            return segments.map((segment) => {
              const segmentLength = totalStatus
                ? coloredCircumference * (segment.count / totalStatus)
                : 0;
              const segmentOffset = accumulatedLength;
              accumulatedLength += segmentLength;

              return (
                <circle
                  key={segment.status}
                  cx="130"
                  cy="130"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeDasharray={`${segmentLength} ${circumference}`}
                  strokeDashoffset={-segmentOffset}
                  transform="rotate(-90 130 130)"
                  style={{
                    transition: 'stroke-dasharray 0.15s linear, stroke-dashoffset 0.15s linear',
                    stroke: segment.color,
                  }}
                />
              );
            });
          })()}
        </svg>

        <div className="donut-center">
          <span className="donut-score">{score}%</span>
          <span className="donut-label">Overall<br />Competency Score</span>
        </div>
      </div>

      <div className="donut-legend">
        {segments.map((segment) => (
          <div className="legend-item" key={segment.status}>
            <span
              className="legend-dot"
              style={{ backgroundColor: segment.color }}
            />
            <span>{segment.label}</span>
            <strong>{Math.round(segment.value)}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompetencyDetails({ domain }) {
  return (
    <div className="domain-content">
      <div className="competency-table">
        <div className="competency-header">
          <div>Skill / Competency</div>
          <div>Proficiency</div>
          <div>Status</div>
          <div>Evidence</div>
          <div>Action</div>
        </div>

        {domain.competencies.map((competency) => {
          const status = statusFromMastery(competency.mastery);

          return (
            <div className="competency-row" key={competency.id}>
              <div className="competency-name">{competency.name}</div>

              <div className="competency-proficiency">
                <AnimatedProgressBar value={competency.mastery} small />
                <span>{competency.mastery}%</span>
              </div>

              <div className="competency-status">
                <StatusBadge status={status} label={status === 'Gap' ? 'Needs Attention' : status} />
              </div>

            <div className="competency-evidence">
              {competency.evidence?.length
                ? competency.evidence.map((item, index) => (
                    <span key={`${competency.id}-${index}`}>
                      {item}
                      {index < competency.evidence.length - 1 ? ' · ' : ''}
                    </span>
                  ))
                : 'No evidence available'}
            </div>

              <div className="competency-action">
                <button type="button" aria-label={`View details for ${competency.name}`}>
                  <span>View details</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SkillPassport({ embedded = false }) {
  const { user, quizHistory } = useApp();

  return (
    <>
      <div className="skill-passport-page">
        {!embedded && (
          <PageHeader
            eyebrow="Skill Passport"
            title={`${user?.name}'s competency record`}
            subtitle={`${user?.department} · Overall competency score: ${overallScore()}%`}
          />
        )}

        {embedded && (
          <div style={{ marginBottom: 12 }}>
            <div className="text-meta" style={{ color: 'var(--color-secondary)', fontWeight: 600, marginBottom: 6 }}>Skill Passport</div>
            <h3 className="text-card-heading" style={{ margin: 0 }}>{user?.name}'s competency record</h3>
            <p className="text-body" style={{ marginTop: 6, marginBottom: 0 }}>
              {user?.department} · Overall competency score: {overallScore()}%
            </p>
          </div>
        )}

        <section className="passport-overview">
          <ConsistencyGraph history={quizHistory} />
          <div className="competency-card">
            <CompetencyDonut />
          </div>
        </section>

        <div className="domain-list">
          {skillDomains.map((domain) => {
            const avg = domainAverage(domain);
            return (
              <div key={domain.id} className="domain-card">
                <div className="domain-inner">
                  <div className="domain-top">
                    <h3 className="domain-name">{domain.name}</h3>
                  </div>

                  <div className="domain-progress-row">
                    <div className="domain-progress">
                      <AnimatedProgressBar value={avg} />
                    </div>
                    <span className="domain-score">{avg}%</span>
                  </div>

                  <div className="domain-footer">
                    <span>Competencies</span>
                  </div>

                  <CompetencyDetails domain={domain} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .skill-passport-page { width: 100%; }

        .passport-overview {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(420px, 0.65fr);
          gap: 18px;
          align-items: start;
          margin-top: 8px;
          margin-bottom: 22px;
        }

        .consistency-card {
          min-height: 300px;
          padding: 24px 26px 18px;
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 4px 18px rgba(16, 33, 61, 0.045);
        }

        .consistency-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 8px;
        }

        .consistency-header h2 {
          margin: 0;
          color: #101828;
          font-size: 20px;
          line-height: 1.2;
          font-weight: 700;
        }

        .consistency-header p {
          margin-top: 6px;
          color: #667085;
          font-size: 13px;
          line-height: 1.4;
        }

        .consistency-score {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .consistency-score strong {
          color: #ff6f00;
          font-size: 22px;
          line-height: 1;
          font-weight: 700;
        }

        .consistency-score span {
          margin-top: 5px;
          color: #98a2b3;
          font-size: 11px;
        }

        .consistency-chart {
          width: 100%;
          height: 215px;
          margin-top: 5px;
        }

        .consistency-svg {
          display: block;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .chart-grid-line {
          stroke: #edf0f4;
          stroke-width: 1;
          vector-effect: non-scaling-stroke;
        }

        .chart-y-label {
          fill: #98a2b3;
          font-size: 10px;
          font-family: inherit;
        }

        .chart-x-label {
          fill: #667085;
          font-size: 10px;
          font-family: inherit;
        }

        .consistency-area {
          fill: #fff1e4;
          opacity: 0;
          animation: consistencyArea 3s ease forwards;
        }

        @keyframes consistencyArea {
          from { opacity: 0; }
          to { opacity: 0.65; }
        }

        .consistency-line {
          fill: none;
          stroke: #ff6f00;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
          vector-effect: non-scaling-stroke;
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: consistencyLine 3s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        @keyframes consistencyLine {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }

        .consistency-point {
          fill: #ffffff;
          stroke: #ff6f00;
          stroke-width: 2;
          opacity: 0;
          animation: consistencyPoint 0.45s ease forwards;
        }

        @keyframes consistencyPoint {
          from { opacity: 0; r: 0; }
          to { opacity: 1; r: 4; }
        }

        .competency-card {
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 4px 18px rgba(16, 33, 61, 0.045);
        }

        .competency-overview {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 30px;
          width: 100%;
        }

        .donut-wrapper {
          position: relative;
          width: 230px;
          height: 230px;
          flex-shrink: 0;
        }

        .competency-donut {
          width: 230px;
          height: 230px;
        }

        .donut-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          pointer-events: none;
        }

        .donut-score {
          color: #14213d;
          font-size: 44px;
          line-height: 1;
          font-weight: 700;
        }

        .donut-label {
          margin-top: 8px;
          color: #667085;
          font-size: 12px;
          line-height: 1.4;
        }

        .donut-legend {
          min-width: 170px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .legend-item {
          display: grid;
          grid-template-columns: 12px 1fr auto;
          align-items: center;
          column-gap: 10px;
          color: #475467;
          font-size: 14px;
          line-height: 1.3;
        }

        .legend-item strong {
          color: #14213D;
          font-weight: 700;
          font-size: 14px;
        }

        .legend-dot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          display: block;
          flex-shrink: 0;
        }

        .domain-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          width: 100%;
        }

        .domain-card {
          overflow: hidden;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 18px rgba(16, 33, 61, 0.045);
          transform: none !important;
          transition: none !important;
        }

        .domain-card:hover {
          transform: none !important;
          box-shadow: 0 4px 18px rgba(16, 33, 61, 0.045);
        }

        .domain-inner {
          width: 100%;
          padding: 20px;
        }

        .domain-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 18px;
        }

        .domain-name {
          margin: 0;
          color: #101828;
          font-size: 20px;
          line-height: 1.25;
          font-weight: 700;
        }

        .domain-progress-row {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 18px;
          width: 100%;
          margin-bottom: 18px;
        }

        .domain-progress { width: 100%; }

        .domain-score {
          min-width: 48px;
          color: #ff6f00;
          font-size: 24px;
          line-height: 1;
          font-weight: 700;
          text-align: right;
        }

        .domain-footer {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          color: #ff6f00;
          font-size: 14px;
          font-weight: 500;
        }

        .skill-progress {
          width: 100%;
          height: 11px;
          overflow: hidden;
          border-radius: 999px;
          background: #fff0dc;
        }

        .skill-progress-small {
          width: 55px;
          height: 9px;
          flex-shrink: 0;
        }

        .skill-progress-fill {
          width: 0;
          height: 100%;
          border-radius: inherit;
          background: #ff7a00;
          animation: skillBarLoad 3s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        @keyframes skillBarLoad {
          from { width: 0; }
          to { width: var(--target-width); }
        }

        .domain-content { padding: 0; }

        .competency-table {
          overflow: hidden;
          border: 1px solid #e7ebf0;
          border-radius: 14px;
          background: #ffffff;
        }

        .competency-header {
          display: grid;
          grid-template-columns: 1.35fr 1fr 0.8fr 1.5fr 130px;
          gap: 18px;
          align-items: center;
          min-height: 64px;
          padding: 12px 18px;
          background: #f8fafc;
          color: #14213d;
          font-size: 13px;
          font-weight: 600;
        }

        .competency-row {
          display: grid;
          grid-template-columns: 1.35fr 1fr 0.8fr 1.5fr 130px;
          gap: 18px;
          align-items: center;
          min-height: 84px;
          padding: 12px 18px;
          border-top: 1px solid #edf0f4;
          color: #172033;
          font-size: 14px;
        }

        .competency-name {
          color: #101828;
          font-size: 15px;
          line-height: 1.35;
          font-weight: 600;
        }

        .competency-proficiency {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .competency-proficiency .skill-progress { width: 55px; flex-shrink: 0; }
        .competency-proficiency > span {
          min-width: 38px;
          color: #344054;
          font-size: 13px;
          font-weight: 500;
        }

        .competency-status { display: flex; align-items: center; }
        .competency-evidence { color: #475467; font-size: 13px; line-height: 1.45; }
        .competency-action { display: flex; justify-content: flex-end; }
        .competency-action button {
          min-width: 112px;
          min-height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 8px 14px;
          border: 1px solid #b8d5fa;
          border-radius: 35px;
          background: #ffffff;
          color: #1769d1;
          font-size: 13px;
          line-height: 1.2;
          font-weight: 600;
          cursor: pointer;
        }

        @media (max-width: 1150px) {
          .passport-overview { grid-template-columns: 1fr; }
          .competency-card { min-height: 280px; }
          .competency-header, .competency-row {
            grid-template-columns: 1.2fr 1fr 0.8fr 1.2fr 110px;
          }
        }

        @media (max-width: 900px) {
          .domain-list { grid-template-columns: 1fr; }
          .competency-header { display: none; }
          .competency-row {
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            min-height: auto;
            padding: 20px;
          }
          .competency-name { grid-column: 1 / -1; }
          .competency-proficiency { grid-column: 1; }
          .competency-status { grid-column: 2; }
          .competency-evidence { grid-column: 1 / -1; }
          .competency-action { grid-column: 1 / -1; justify-content: flex-start; }
        }

        @media (max-width: 640px) {
          .passport-overview { grid-template-columns: 1fr; gap: 16px; margin-bottom: 24px; }
          .consistency-card { min-height: 260px; padding: 18px 16px 12px; }
          .consistency-chart { height: 190px; }
          .competency-card { min-height: 280px; padding: 16px; }
          .competency-overview { flex-direction: column; gap: 20px; }
          .donut-wrapper { width: 220px; height: 220px; }
          .competency-donut { width: 220px; height: 220px; }
          .donut-legend { width: 100%; min-width: 0; }
          .domain-list { grid-template-columns: 1fr; gap: 16px; }
          .domain-inner { padding: 20px; }
          .domain-name { font-size: 18px; }
          .domain-score { font-size: 21px; }
          .competency-row { grid-template-columns: 1fr; gap: 14px; padding: 18px; }
          .competency-name, .competency-proficiency, .competency-status, .competency-evidence, .competency-action { grid-column: 1; }
          .competency-action { justify-content: flex-start; }
          .competency-action button { width: 100%; min-height: 54px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .consistency-line, .consistency-area, .consistency-point, .donut-segment, .skill-progress-fill {
            animation: none;
          }
          .skill-progress-fill { width: var(--target-width); }
          .consistency-area { opacity: 0.65; }
          .consistency-point { opacity: 1; }
        }
      `}</style>
    </>
  );
}
