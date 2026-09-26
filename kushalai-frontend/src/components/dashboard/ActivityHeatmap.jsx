import React from 'react';

const LEVEL_COLORS = ['#F0F0F1', '#FCE5CC', '#F5A12A', '#1663C0', '#1B4CA1'];

export default function ActivityHeatmap({ days }) {
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div>
      <div className="scroll-x">
        <div style={{ display: 'flex', gap: 4 }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {week.map((day) => (
                <div
                  key={day.date}
                  title={`${day.date} — activity level ${day.level}`}
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: 4,
                    background: LEVEL_COLORS[day.level]
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
        <span className="text-meta">Less</span>
        {LEVEL_COLORS.map((c) => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: 4, background: c }} />
        ))}
        <span className="text-meta">More</span>
      </div>
    </div>
  );
}
