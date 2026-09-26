import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, CircleHelp, Clock3, LockKeyhole } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getCourseById } from '../data/mockCourses';
import { scenarioAssessments } from '../data/mockScenarioAssessments';

function statusLabel(status) {
  return status === 'current' ? 'Current focus' : status.charAt(0).toUpperCase() + status.slice(1);
}

function CourseSelection({ courses, onSelect, onBack }) {
  return (
    <>
      <button type="button" className="workspace-back-link" onClick={onBack}>
        <ArrowLeft size={16} aria-hidden="true" /> Learning Workspace
      </button>
      <header className="assessment-header">
        <div className="text-meta assessment-eyebrow">SCENARIO BASED ASSESSMENT</div>
        <h1>Apply your learning to real-world situations.</h1>
        <p>Select a course from your competency roadmap to begin a practical assessment.</p>
      </header>
      <div className="assessment-section-heading">
        <span>SELECT A COURSE</span>
        <small>{courses.length} roadmap courses</small>
      </div>
      <section className="assessment-course-grid">
        {courses.map(({ course, node }) => (
          <button type="button" className="assessment-course-card" key={course.id} onClick={() => onSelect(course.id)}>
            <div className="assessment-course-indicator" aria-hidden="true">{course.skill.slice(0, 2).toUpperCase()}</div>
            <div className="assessment-course-content">
              <div className="assessment-course-status">{statusLabel(node.status)}</div>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <div className="assessment-course-meta">
                <span>{course.domain}</span><span>{course.difficulty}</span><span><Clock3 size={13} /> {course.estTime}</span>
              </div>
            </div>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        ))}
      </section>
    </>
  );
}

function AssessmentIntro({ course, alreadyCompleted, onStart, onBack }) {
  return (
    <div className="assessment-intro-wrap">
      <button type="button" className="workspace-back-link" onClick={onBack}>
        <ArrowLeft size={16} aria-hidden="true" /> Select another course
      </button>
      <section className="assessment-intro">
        <div className="text-meta assessment-eyebrow">SCENARIO ASSESSMENT</div>
        <h1>{course.title}</h1>
        <p>Complete this assessment to apply your learning in realistic situations.</p>
        <div className="assessment-intro-facts">
          <div><strong>10</strong><span>Questions</span></div>
          <div><strong>4 · 3 · 3</strong><span>MCQ · Short · Long</span></div>
          <div className="assessment-reward"><strong>+5</strong><span>Discipline Score</span></div>
        </div>
        <div className="assessment-reward-note">
          <strong>DISCIPLINE SCORE {alreadyCompleted ? 'ALREADY AWARDED' : '+5 POINTS'}</strong>
          <p>{alreadyCompleted ? 'This course assessment has already received its one-time reward.' : 'Successfully submitting this assessment will improve your Discipline Score by +5 points.'}</p>
        </div>
        <button type="button" className="assessment-primary-action" onClick={onStart}>
          {alreadyCompleted ? 'REVIEW ASSESSMENT' : 'START ASSESSMENT'} <ArrowRight size={17} aria-hidden="true" />
        </button>
      </section>
    </div>
  );
}

function AssessmentQuestion({ question, answer, onAnswer }) {
  return (
    <section className="assessment-question-panel">
      <div className="assessment-question-label">SCENARIO</div>
      <p className="assessment-scenario">{question.scenario}</p>
      <div className="assessment-question-label">QUESTION</div>
      <h2>{question.prompt}</h2>
      {question.type === 'mcq' ? (
        <div className="assessment-options" role="radiogroup" aria-label="Answer choices">
          {question.options.map((option, index) => (
            <label className={`assessment-option${answer === index ? ' is-selected' : ''}`} key={option}>
              <input type="radio" name={question.id} checked={answer === index} onChange={() => onAnswer(index)} />
              <span className="assessment-option-marker">{String.fromCharCode(65 + index)}</span>
              <span>{option}</span>
            </label>
          ))}
        </div>
      ) : (
        <textarea
          className={`assessment-response ${question.type === 'long' ? 'is-long' : ''}`}
          value={answer || ''}
          onChange={(event) => onAnswer(event.target.value)}
          placeholder={question.type === 'long' ? 'Write approximately 150–300 words.' : 'Write approximately 2–5 sentences.'}
          rows={question.type === 'long' ? 12 : 7}
        />
      )}
    </section>
  );
}

function AssessmentResult({ course, correctCount, writtenCount, rewarded, onBack }) {
  return (
    <section className="assessment-result">
      <div className="result-mark"><CheckCircle2 size={28} aria-hidden="true" /></div>
      <div className="text-meta assessment-eyebrow">ASSESSMENT COMPLETE</div>
      <h1>{course.title}</h1>
      <p>Your assessment has been submitted.</p>
      <div className="assessment-result-grid">
        <div><span>DISCIPLINE SCORE</span><strong>{rewarded ? '+5' : 'RECORDED'}</strong><small>{rewarded ? 'One-time assessment reward' : 'Reward already awarded'}</small></div>
        <div><span>PRACTICAL ASSESSMENT</span><strong>10 / 10</strong><small>Questions submitted</small></div>
        <div><span>MCQ PERFORMANCE</span><strong>{correctCount} / 4</strong><small>Automatically scored</small></div>
        <div><span>WRITTEN RESPONSES</span><strong>{writtenCount} submitted</strong><small>Recorded for review</small></div>
      </div>
      <p className="assessment-result-note">Written responses recorded for review. This demo does not apply automated AI grading.</p>
      <button type="button" className="assessment-primary-action" onClick={onBack}>RETURN TO LEARNING WORKSPACE <ArrowRight size={17} aria-hidden="true" /></button>
    </section>
  );
}

export default function ScenarioAssessment() {
  const navigate = useNavigate();
  const { roadmap, completedScenarioAssessments, recordScenarioAssessment } = useApp();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [started, setStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const courses = useMemo(() => roadmap.map((node) => {
    const course = getCourseById(node.courseId);
    return course ? { course, node } : null;
  }).filter(Boolean), [roadmap]);
  const selected = courses.find(({ course }) => course.id === selectedCourseId);
  const assessment = selected ? scenarioAssessments[selected.course.id] : null;
  const question = assessment?.questions[questionIndex];
  const hasAnswer = question && (question.type === 'mcq' ? answers[question.id] !== undefined : Boolean(answers[question.id]?.trim()));

  function chooseCourse(courseId) {
    setSelectedCourseId(courseId);
    setStarted(false);
    setResult(null);
    setAnswers({});
  }

  function startAssessment() {
    setStarted(true);
    setQuestionIndex(0);
    setAnswers({});
  }

  function setAnswer(value) {
    setAnswers((current) => ({ ...current, [question.id]: value }));
  }

  function submitAssessment() {
    const correctCount = assessment.questions.filter((item) => item.type === 'mcq' && answers[item.id] === item.correctOption).length;
    const writtenCount = assessment.questions.filter((item) => item.type !== 'mcq' && answers[item.id]?.trim()).length;
    const rewarded = recordScenarioAssessment(
      selected.course.id,
      selected.course.title,
      correctCount,
      assessment.questions.filter((item) => item.type === 'mcq').length
    );
    setResult({ correctCount, writtenCount, rewarded });
  }

  if (!selected) {
    return <div className="scenario-assessment-page"><CourseSelection courses={courses} onSelect={chooseCourse} onBack={() => navigate('/learning-workspace')} /></div>;
  }

  if (result) {
    return <div className="scenario-assessment-page"><AssessmentResult course={selected.course} {...result} onBack={() => navigate('/learning-workspace')} /></div>;
  }

  if (!started) {
    return <div className="scenario-assessment-page"><AssessmentIntro course={selected.course} alreadyCompleted={completedScenarioAssessments.includes(selected.course.id)} onStart={startAssessment} onBack={() => chooseCourse(null)} /></div>;
  }

  const isLast = questionIndex === assessment.questions.length - 1;
  return (
    <div className="scenario-assessment-page">
      <button type="button" className="workspace-back-link" onClick={() => setStarted(false)}><ArrowLeft size={16} aria-hidden="true" /> Assessment introduction</button>
      <header className="assessment-progress-header">
        <div><div className="text-meta assessment-eyebrow">SCENARIO BASED ASSESSMENT</div><h1>{selected.course.title}</h1></div>
        <div className="assessment-progress-count">Question <strong>{questionIndex + 1}</strong> of {assessment.questions.length}</div>
      </header>
      <div className="assessment-progress-track"><span style={{ width: `${((questionIndex + 1) / assessment.questions.length) * 100}%` }} /></div>
      <AssessmentQuestion question={question} answer={answers[question.id]} onAnswer={setAnswer} />
      <div className="assessment-navigation">
        <button type="button" className="assessment-secondary-action" disabled={questionIndex === 0} onClick={() => setQuestionIndex((index) => index - 1)}><ArrowLeft size={16} /> BACK</button>
        {isLast ? (
          <button type="button" className="assessment-primary-action" disabled={!hasAnswer} onClick={submitAssessment}>SUBMIT ASSESSMENT <CheckCircle2 size={17} /></button>
        ) : (
          <button type="button" className="assessment-primary-action" disabled={!hasAnswer} onClick={() => setQuestionIndex((index) => index + 1)}>NEXT <ArrowRight size={17} /></button>
        )}
      </div>
    </div>
  );
}
