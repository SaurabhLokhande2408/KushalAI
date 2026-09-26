import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

export default function QuizTrendChart({ data }) {
  const latest = data[data.length - 1];
  const previous = data[data.length - 2];
  const improvement = previous ? latest.score - previous.score : 0;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
        <span className="text-stat" style={{ color: 'var(--color-primary)' }}>{latest.score}%</span>
        {improvement !== 0 && (
          <span className="text-meta" style={{ color: improvement > 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>
            {improvement > 0 ? '▲' : '▼'} {Math.abs(improvement)}% vs last attempt
          </span>
        )}
      </div>
      <div style={{ width: '100%', height: 60 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 4, bottom: 0, left: 0, right: 4 }}>
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              formatter={(value) => [`${value}%`, 'Score']}
              labelFormatter={(label) => label}
              contentStyle={{ borderRadius: 10, border: '1px solid var(--color-border)', fontSize: 12 }}
            />
            <Line type="monotone" dataKey="score" stroke="#F5A12A" strokeWidth={3} dot={{ r: 3, fill: '#1B4CA1' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
