import React from 'react';
import { Check, X } from 'lucide-react';
import { Card, Button } from '../common/UI';

function verdict(score) {
  if (score >= 85) return 'Excellent progress.';
  if (score >= 70) return 'Solid performance.';
  if (score >= 50) return 'Good effort — a bit more practice will help.';
  return "Let's revisit this topic before moving on.";
}

export default function QuizResult({ quiz, answers, scorePercent, onReturnToRoadmap, onBackToDashboard }) {
  const correctCount = quiz.questions.filter((q) => answers[q.id] === q.correct).length;

  return (
    <div>
      <Card style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
        <div className="text-hero" style={{ color: 'var(--color-primary)' }}>{scorePercent}%</div>
        <p className="text-body" style={{ marginTop: 4 }}>{verdict(scorePercent)}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-6)', marginTop: 'var(--space-3)' }}>
          <Stat label="Correct" value={correctCount} tone="success" />
          <Stat label="Incorrect" value={quiz.questions.length - correctCount} tone="danger" />
          <Stat label="Skill impact" value="+ mastery" tone="neutral" />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 'var(--space-4)', flexWrap: 'wrap' }}>
          <Button onClick={onReturnToRoadmap}>Return to roadmap</Button>
          <Button variant="secondary" onClick={onBackToDashboard}>Back to dashboard</Button>
        </div>
      </Card>

      <h3 className="text-card-heading" style={{ marginBottom: 'var(--space-2)' }}>Question review</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {quiz.questions.map((q, i) => {
          const selected = answers[q.id];
          const isCorrect = selected === q.correct;
          return (
            <Card key={q.id}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                {isCorrect ? <Check size={18} color="var(--color-success)" style={{ marginTop: 2 }} /> : <X size={18} color="var(--color-danger)" style={{ marginTop: 2 }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>{i + 1}. {q.prompt}</div>
                  <div className="text-meta">Your answer: {q.options[selected] ?? 'Not answered'}</div>
                  {!isCorrect && <div className="text-meta">Correct answer: {q.options[q.correct]}</div>}
                  <p className="text-meta" style={{ marginTop: 6 }}>{q.explanation}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  const color = tone === 'success' ? 'var(--color-success)' : tone === 'danger' ? 'var(--color-danger)' : 'var(--color-primary)';
  return (
    <div>
      <div className="text-stat" style={{ color, fontSize: 22 }}>{value}</div>
      <div className="text-meta">{label}</div>
    </div>
  );
}
