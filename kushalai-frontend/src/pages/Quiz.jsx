import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, EmptyState } from '../components/common/UI';
import QuizProgress from '../components/quiz/QuizProgress';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizResult from '../components/quiz/QuizResult';
import { getQuizByCourseId } from '../data/mockQuizzes';
import { getCourseById } from '../data/mockCourses';
import { useApp } from '../context/AppContext';
import { FileQuestion } from 'lucide-react';

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { roadmap, completeNode, recordQuizResult } = useApp();

  const course = getCourseById(id);
  const quiz = getQuizByCourseId(id);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!course || !quiz) {
    return (
      <EmptyState
        icon={<FileQuestion size={26} />}
        title="Quiz not available"
        message="There is no assessment for this course yet."
        action={<Button onClick={() => navigate('/roadmap')}>Back to roadmap</Button>}
      />
    );
  }

  const question = quiz.questions[index];
  const isLast = index === quiz.questions.length - 1;
  const hasAnswered = answers[question.id] !== undefined;

  function selectOption(optionIndex) {
    if (answers[question.id] !== undefined) return;
    setAnswers((a) => ({ ...a, [question.id]: optionIndex }));
  }

  function handleSubmit() {
    const correctCount = quiz.questions.filter((q) => answers[q.id] === q.correct).length;
    const scorePercent = Math.round((correctCount / quiz.questions.length) * 100);
    recordQuizResult(course.title, scorePercent);

    const node = roadmap.find((n) => n.courseId === course.id);
    if (node && node.status !== 'completed') completeNode(node.id);

    setSubmitted(true);
  }

  if (submitted) {
    const correctCount = quiz.questions.filter((q) => answers[q.id] === q.correct).length;
    const scorePercent = Math.round((correctCount / quiz.questions.length) * 100);
    return (
      <div className="container page-shell">
        <QuizResult
          quiz={quiz}
          answers={answers}
          scorePercent={scorePercent}
          onReturnToRoadmap={() => navigate('/roadmap')}
          onBackToDashboard={() => navigate('/dashboard')}
        />
      </div>
    );
  }

  return (
    <div className="container page-shell" style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <div className="text-meta" style={{ fontWeight: 600 }}>{course.title}</div>
      </div>

      <QuizProgress current={index + 1} total={quiz.questions.length} />

      <div className="card">
        <QuizQuestion question={question} selected={answers[question.id]} onSelect={selectOption} revealed={hasAnswered} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-3)' }}>
        <Button variant="secondary" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>Previous</Button>
        {isLast ? (
          <Button disabled={!hasAnswered} onClick={handleSubmit}>Submit</Button>
        ) : (
          <Button disabled={!hasAnswered} onClick={() => setIndex((i) => i + 1)}>Next</Button>
        )}
      </div>
    </div>
  );
}
