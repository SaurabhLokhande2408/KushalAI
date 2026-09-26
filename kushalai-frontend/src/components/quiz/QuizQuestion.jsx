import React from 'react';
import { Check, X } from 'lucide-react';

export default function QuizQuestion({ question, selected, onSelect, revealed }) {
  return (
    <div>
      <h2 className="text-card-heading" style={{ marginBottom: 'var(--space-3)', lineHeight: 1.4 }}>{question.prompt}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {question.options.map((opt, idx) => {
          const isSelected = selected === idx;
          const isCorrect = idx === question.correct;
          let stateStyle = { borderColor: 'var(--color-border)', background: '#fff' };

          if (revealed) {
            if (isCorrect) stateStyle = { borderColor: 'var(--color-success)', background: 'var(--color-success-bg)' };
            else if (isSelected && !isCorrect) stateStyle = { borderColor: 'var(--color-danger)', background: 'var(--color-danger-bg)' };
          } else if (isSelected) {
            stateStyle = { borderColor: 'var(--color-secondary)', background: '#F0F6FE' };
          }

          return (
            <button
              key={idx}
              disabled={revealed}
              onClick={() => onSelect(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'left',
                padding: '16px 18px',
                borderRadius: 'var(--radius-input)',
                border: `1.5px solid ${stateStyle.borderColor}`,
                background: stateStyle.background,
                cursor: revealed ? 'default' : 'pointer',
                fontSize: 14.5,
                fontWeight: 500,
                color: 'var(--color-text)',
                transition: 'all var(--t-fast)'
              }}
            >
              <span>{opt}</span>
              {revealed && isCorrect && <Check size={18} color="var(--color-success)" />}
              {revealed && isSelected && !isCorrect && <X size={18} color="var(--color-danger)" />}
            </button>
          );
        })}
      </div>
      {revealed && (
        <div className="card" style={{ marginTop: 16, background: 'var(--color-offwhite)' }}>
          <span className="text-meta" style={{ fontWeight: 600 }}>Explanation: </span>
          <span className="text-meta">{question.explanation}</span>
        </div>
      )}
    </div>
  );
}
