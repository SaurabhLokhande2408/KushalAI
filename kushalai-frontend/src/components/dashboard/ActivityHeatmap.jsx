import React from 'react';

const LEVEL_COLORS = [
  '#ebedf0',
  '#ffd9b3',
  '#ffb366',
  '#ff8c1a',
  '#e65c00'
];

const CELL = 12;
const GAP = 4;

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function ActivityHeatmap({ days }) {
  const weeks = [];

  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Month labels
  let lastMonth = -1;

  const monthLabels = weeks.map((week) => {
    if (!week.length) return '';

    const d = new Date(week[0].date);
    const m = d.getMonth();

    if (m !== lastMonth) {
      lastMonth = m;
      return MONTHS[m];
    }

    return '';
  });

  return (
    <div
      style={{
        width: '100%',
        boxSizing: 'border-box',
        background: '#ffffff',
        padding: '16px 28px',
        borderRadius: '8px',
        color: '#24292f'
      }}
    >
      {/* MONTH LABELS */}
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: `repeat(${weeks.length}, 1fr)`,
          marginBottom: '8px'
        }}
      >
        {monthLabels.map((label, index) => (
          <div
            key={index}
            style={{
              fontSize: '12px',
              fontWeight: 500
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* FULL WEEK GRID */}
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: `repeat(${weeks.length}, 1fr)`,
          gap: '4px'
        }}
      >
        {weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            style={{
              width: '100%',
              minHeight: `${7 * CELL + 6 * GAP}px`,

              /* WHITE WEEK GRID */
              background: '#ffffff',

              border: '1px solid #f0f0f0',
              borderRadius: '4px',

              padding: '3px',

              boxSizing: 'border-box',

              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',

              gap: `${GAP}px`
            }}
          >
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date} — activity level ${day.level}`}
                style={{
                  width: `${CELL}px`,
                  height: `${CELL}px`,

                  flexShrink: 0,

                  borderRadius: '3px',

                  background:
                    LEVEL_COLORS[day.level] || LEVEL_COLORS[0],

                  border: '1px solid #d0d7de',

                  boxSizing: 'border-box'
                }}
              />
            ))}

            {/* Fill missing days so every week has 7 rows */}
            {Array.from({
              length: 7 - week.length
            }).map((_, index) => (
              <div
                key={`empty-${index}`}
                style={{
                  width: `${CELL}px`,
                  height: `${CELL}px`,
                  borderRadius: '3px',
                  background: '#ffffff',
                  border: '1px solid #f0f0f0',
                  boxSizing: 'border-box'
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* LEGEND */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '6px',
          marginTop: '20px',
          fontSize: '12px'
        }}
      >
        <span>Consistency intensity</span>

        {LEVEL_COLORS.map((c) => (
          <div
            key={c}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '3px',
              background: c,
              border: '1px solid #d0d7de'
            }}
          />
        ))}
      </div>
    </div>
  );
}