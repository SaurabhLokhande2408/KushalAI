import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { scenarioAssessments } from '../../data/mockScenarioAssessments';
import { courses } from '../../data/mockCourses';

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function ScenarioAssessmentAnalytics({ completedScenarioAssessments, attempts }) {
  const totalAssessments = courses.filter((course) => scenarioAssessments[course.id]).length;
  const completedAssessments = completedScenarioAssessments.filter((courseId) => scenarioAssessments[courseId]).length;
  const remainingAssessments = Math.max(totalAssessments - completedAssessments, 0);
  const completionPercent = totalAssessments > 0
    ? Math.round((completedAssessments / totalAssessments) * 100)
    : 0;
  const orderedAttempts = useMemo(
    () => attempts
      .filter((attempt) => Number.isFinite(attempt.mcqScore) && Number.isFinite(attempt.mcqTotal) && attempt.mcqTotal > 0)
      .sort((first, second) => new Date(first.completedAt) - new Date(second.completedAt))
      .map((attempt, index) => ({
        ...attempt,
        label: formatDate(attempt.completedAt),
        sequence: `Assessment ${index + 1}`,
        percentage: Math.round((attempt.mcqScore / attempt.mcqTotal) * 100)
      })),
    [attempts]
  );
  const averageScore = orderedAttempts.length
    ? Math.round(orderedAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / orderedAttempts.length)
    : null;
  const bestScore = orderedAttempts.length
    ? Math.max(...orderedAttempts.map((attempt) => attempt.percentage))
    : null;
  const latest = orderedAttempts[orderedAttempts.length - 1];
  const previous = orderedAttempts[orderedAttempts.length - 2];
  const comparison = latest && previous ? latest.percentage - previous.percentage : null;
  const donutData = [
    { name: 'Completed', value: completedAssessments, color: '#1B4CA1' },
    { name: 'Remaining', value: remainingAssessments, color: '#FCE5CC' }
  ];

  return (
    <>
      <div className="scenario-analytics-grid">
        <div className="scenario-analytics-card scenario-donut-card">
          <h3>Scenario assessments</h3>
          <div className="scenario-donut-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={76} paddingAngle={2} stroke="none">
                  {donutData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="scenario-donut-center">
              <strong>{completedAssessments ? `${completedAssessments} / ${totalAssessments}` : '0%'}</strong>
              <span>{completedAssessments ? 'Assessments completed' : 'No assessments completed'}</span>
            </div>
          </div>
          <div className="scenario-donut-percent">{completionPercent}% completed</div>
          <div className="scenario-donut-legend">
            {donutData.map((entry) => (
              <span key={entry.name}><i style={{ background: entry.color }} />{entry.name}</span>
            ))}
          </div>
          <p>Practical assessments completed</p>
        </div>

        <div className="scenario-analytics-card scenario-trend-card">
          <div className="scenario-trend-heading">
            <div>
              <h3>Scenario Assessment Trend</h3>
              <p>Practical assessment performance over time</p>
            </div>
            {averageScore !== null && <div className="scenario-trend-metric"><strong>{averageScore}%</strong><span>Average assessment score</span></div>}
          </div>
          {orderedAttempts.length ? (
            <div className="scenario-trend-chart">
              <ResponsiveContainer>
                <LineChart data={orderedAttempts} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#667085' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 11, fill: '#667085' }} axisLine={false} tickLine={false} width={42} />
                  <Tooltip formatter={(value) => [`${value}%`, 'MCQ score']} labelFormatter={(label) => label} contentStyle={{ borderRadius: 10, border: '1px solid var(--color-border)', fontSize: 12 }} />
                  <Line type="monotone" dataKey="percentage" stroke="#1B4CA1" strokeWidth={3} dot={{ r: 4, fill: '#F5A12A', stroke: '#1B4CA1', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="scenario-trend-empty">
              <p>Complete your first scenario assessment to start building your practical performance trend.</p>
              <Link to="/scenario-assessment">Start assessment <span aria-hidden="true">→</span></Link>
            </div>
          )}
          <div className="scenario-trend-footer">
            <span><strong>{orderedAttempts.length}</strong> completed</span>
            <span><strong>{averageScore === null ? '—' : `${averageScore}%`}</strong> average score</span>
            <span><strong>{bestScore === null ? '—' : `${bestScore}%`}</strong> best score</span>
            {comparison !== null && <span className={comparison >= 0 ? 'is-positive' : 'is-negative'}>{comparison >= 0 ? '↑' : '↓'} {Math.abs(comparison)}% vs previous assessment</span>}
            {orderedAttempts.length === 1 && <span>Complete another assessment to see your trend.</span>}
          </div>
        </div>
      </div>

      <style>{`
        .scenario-analytics-grid { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(300px, 0.8fr); gap: var(--space-3); }
        .scenario-analytics-card { background: #fff; border: 1px solid #e4e7ec; border-radius: 10px; padding: 22px 24px; box-shadow: 0 2px 8px rgba(20, 33, 61, 0.05); }
        .scenario-analytics-card h3 { margin: 0; color: #14213d; font-size: 18px; }
        .scenario-donut-card { text-align: center; }
        .scenario-donut-wrap { position: relative; width: 170px; height: 170px; margin: 12px auto 2px; }
        .scenario-donut-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; }
        .scenario-donut-center strong { color: #14213d; font-size: 22px; }
        .scenario-donut-center span { max-width: 86px; margin-top: 3px; color: #667085; font-size: 10px; line-height: 1.25; }
        .scenario-donut-percent { color: #1B4CA1; font-size: 13px; font-weight: 700; }
        .scenario-donut-legend { display: flex; justify-content: center; gap: 14px; margin-top: 15px; color: #667085; font-size: 11px; }
        .scenario-donut-legend span { display: inline-flex; align-items: center; gap: 5px; }
        .scenario-donut-legend i { width: 7px; height: 7px; border-radius: 50%; }
        .scenario-donut-card p { margin: 12px 0 0; color: #98a2b3; font-size: 11px; }
        .scenario-trend-heading { display: flex; justify-content: space-between; gap: 18px; }
        .scenario-trend-heading p { margin: 5px 0 0; color: #667085; font-size: 12px; }
        .scenario-trend-metric { display: flex; flex-direction: column; align-items: flex-end; }
        .scenario-trend-metric strong { color: #1B4CA1; font-size: 26px; line-height: 1; }
        .scenario-trend-metric span { margin-top: 4px; color: #98a2b3; font-size: 10px; }
        .scenario-trend-chart { width: 100%; height: 170px; margin-top: 18px; }
        .scenario-trend-empty { display: grid; place-items: center; min-height: 170px; padding: 20px; text-align: center; }
        .scenario-trend-empty p { max-width: 420px; margin: 0 0 12px; color: #667085; font-size: 13px; }
        .scenario-trend-empty a { color: #1B4CA1; font-size: 12px; font-weight: 700; text-transform: uppercase; }
        .scenario-trend-footer { display: flex; flex-wrap: wrap; gap: 14px 24px; margin-top: 12px; color: #667085; font-size: 11px; }
        .scenario-trend-footer strong { color: #14213d; font-size: 14px; margin-right: 4px; }
        .scenario-trend-footer .is-positive { color: var(--color-success); font-weight: 600; }
        .scenario-trend-footer .is-negative { color: var(--color-danger); font-weight: 600; }
        @media (max-width: 760px) { .scenario-analytics-grid { grid-template-columns: 1fr; } .scenario-trend-heading { flex-direction: column; } .scenario-trend-metric { align-items: flex-start; } }
      `}</style>
    </>
  );
}