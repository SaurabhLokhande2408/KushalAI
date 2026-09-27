import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getCourseById } from '../data/mockCourses';
import { getPrerequisiteCheck } from '../data/mockCoursePrerequisites';
import '../styles/courseRecommendations.css';

function statusForScore(score) {
  if (score >= 80) return { label: 'READY TO BEGIN', copy: 'Your prerequisite readiness is strong.' };
  if (score >= 50) return { label: 'PARTIALLY READY', copy: 'You meet several prerequisites, but foundational learning is recommended before beginning this course.' };
  return { label: 'FOUNDATION REQUIRED', copy: 'Several prerequisites need attention before beginning this course.' };
}

function EvaluationMissing({ onExplore }) {
  return (
    <main className="course-evaluation">
      <section className="cer-missing-panel">
        <p className="ce-eyebrow">COURSE EVALUATION</p>
        <h2>Course not found</h2>
        <p>This course is not available in the current learning catalogue.</p>
        <button className="cer-primary" type="button" onClick={onExplore}>Explore courses <ArrowRight size={16} /></button>
      </section>
    </main>
  );
}

export default function CourseRecommendation() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { roadmap, addCourseToRoadmap } = useApp();
  const [view, setView] = useState('overview');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [alreadyOnRoadmap, setAlreadyOnRoadmap] = useState(false);
  const [additionError, setAdditionError] = useState('');
  const [showPrerequisites, setShowPrerequisites] = useState(false);

  const course = getCourseById(courseId);
  const check = useMemo(() => getPrerequisiteCheck(course), [course]);
  const questions = check.questions;
  const question = questions[questionIndex];
  const roadmapNode = roadmap.find((node) => node.courseId === courseId);
  const evaluated = useMemo(() => {
    const correctCount = questions.reduce((total, item) => (
      total + (Number(answers[item.id]) >= item.expected ? 1 : 0)
    ), 0);
    const score = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
    const readinessByPrerequisite = check.prerequisites.map((prerequisite) => {
      const related = questions.filter((item) => item.prerequisite === prerequisite);
      const isReady = related.length > 0 && related.every((item) => Number(answers[item.id]) >= item.expected);
      return { name: prerequisite, isReady };
    });
    return {
      score,
      readinessByPrerequisite,
      gaps: readinessByPrerequisite.filter((item) => !item.isReady).map((item) => item.name)
    };
  }, [answers, check.prerequisites, questions]);

  const foundationCourses = useMemo(() => check.prerequisiteCourseIds
    .map((id) => getCourseById(id))
    .filter(Boolean), [check.prerequisiteCourseIds]);
  const status = statusForScore(evaluated.score);
  const isReady = evaluated.score >= 80;
  const progressPercent = Math.round(((questionIndex + 1) / questions.length) * 100);

  useEffect(() => {
    if (view !== 'analysing' && view !== 'adding') return undefined;
    const timeoutId = window.setTimeout(() => {
      if (view === 'analysing') {
        setView('result');
        return;
      }

      const roadmapStatus = isReady || check.prerequisiteCourseIds.length === 0 ? 'recommended' : 'locked';
      const result = addCourseToRoadmap(course.id, check.prerequisiteCourseIds, roadmapStatus);
      if (!result.added) {
        setAlreadyOnRoadmap(true);
        setAdditionError(result.reason === 'duplicate' ? '' : 'The learning path could not be updated. Please try again.');
        setView('result');
        return;
      }

      navigate('/roadmap', {
        state: { animateNewNode: true, newlyAddedCourseId: course.id }
      });
    }, view === 'analysing' ? 1500 : 1550);
    return () => window.clearTimeout(timeoutId);
  }, [view, addCourseToRoadmap, check.prerequisiteCourseIds, course, isReady, navigate]);

  if (!course) return <EvaluationMissing onExplore={() => navigate('/explore-courses')} />;

  function beginCheck() {
    setQuestionIndex(0);
    setAnswers({});
    setView('check');
  }

  function continueCheck() {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((index) => index + 1);
    } else {
      setView('analysing');
    }
  }

  function addToRoadmap() {
    if (roadmap.some((node) => node.courseId === course.id)) {
      setAlreadyOnRoadmap(true);
      return;
    }
    setAdditionError('');
    setView('adding');
  }

  function renderQuestionCheck() {
    return (
      <section className="cer-main" aria-label="Prerequisite readiness questions">
        <div className="cer-progress-top">
          <p className="cer-kicker">PREREQUISITE READINESS CHECK</p>
          <strong>QUESTION {questionIndex + 1} OF {questions.length}</strong>
        </div>
        <div className="cer-progress-track" role="progressbar" aria-label="Question progress" aria-valuemin="0" aria-valuemax={questions.length} aria-valuenow={questionIndex + 1}>
          <span style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="cer-question" key={question.id}>
          <h2 id="cer-question-title">{question.question}</h2>
          <div className="cer-answer-list" role="radiogroup" aria-labelledby="cer-question-title">
            {question.options.map((option, index) => (
              <label
                className="cer-answer"
                key={option}
                onClick={() => setAnswers((current) => ({ ...current, [question.id]: index }))}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={index}
                  checked={Number(answers[question.id]) === index}
                  onChange={() => setAnswers((current) => ({ ...current, [question.id]: index }))}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="cer-question-nav">
          <button className="cer-secondary" type="button" onClick={() => questionIndex === 0 ? setView('overview') : setQuestionIndex((index) => index - 1)}>
            <ArrowLeft size={15} /> Back
          </button>
          <button className="cer-primary" type="button" disabled={answers[question.id] === undefined} onClick={continueCheck}>
            {questionIndex === questions.length - 1 ? 'Analyse readiness' : 'Next question'} <ArrowRight size={15} />
          </button>
        </div>
      </section>
    );
  }

  function renderAnalysis() {
    return (
      <section className="cer-analysis-panel" aria-live="polite">
        <div className="cer-analysis-mark"><Compass size={24} /></div>
        <p className="cer-kicker">KUSHALAI RECOMMENDATION ENGINE</p>
        <h2>Analysing prerequisites</h2>
        <p>Evaluating your responses against the course foundation and mapping a recommended learning path.</p>
        <div className="cer-analysis-steps">
          <span className="is-active">01 &nbsp; Evaluate prerequisite readiness</span>
          <span className="is-active">02 &nbsp; Identify learning foundations</span>
          <span className="is-active">03 &nbsp; Generate recommendation</span>
        </div>
      </section>
    );
  }

  function renderResult() {
    return (
      <section className="cer-result-panel">
        <div className="cer-progress-top">
          <p className="cer-kicker">KUSHALAI RECOMMENDATION</p>
          <span className={`cer-result-status ${evaluated.score < 80 ? evaluated.score < 50 ? 'is-foundation' : 'is-partial' : ''}`}>{status.label}</span>
        </div>
        <h2>{course.title}</h2>
        <p className="cer-result-copy">{status.copy} Your responses indicate {evaluated.gaps.length ? `${evaluated.gaps.length} foundation area${evaluated.gaps.length === 1 ? '' : 's'} to strengthen.` : 'readiness across the assessed foundations.'}</p>

        <div className="cer-result-columns">
          <div>
            <h3>PREREQUISITE READINESS</h3>
            <ul>
              {evaluated.readinessByPrerequisite.map((item) => (
                <li className={item.isReady ? 'is-ready' : 'is-gap'} key={item.name}>
                  {item.isReady ? <Check size={15} /> : <AlertTriangle size={15} />}
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="cer-score-block">
            <h3>READINESS SCORE</h3>
            <div className="cer-score-meter"><span style={{ width: `${evaluated.score}%` }} /></div>
            <strong>{evaluated.score}%</strong>
            <small>Based on this mock readiness check</small>
          </div>
        </div>

        <div className="cer-path">
          <h3>RECOMMENDED LEARNING PATH</h3>
          <div className="cer-path-list">
            {!isReady && foundationCourses.map((foundation, index) => (
              <React.Fragment key={foundation.id}>
                <div className="cer-path-item">
                  <span className="cer-path-number">{index + 1}</span>
                  <span><strong>{foundation.title}</strong><small>Foundation course · {foundation.skill}</small></span>
                  <ArrowRight size={17} aria-hidden="true" />
                </div>
                <div className="cer-path-connector" aria-hidden="true" />
              </React.Fragment>
            ))}
            <div className="cer-path-item is-target">
              <span className="cer-path-number">{isReady ? '01' : foundationCourses.length + 1}</span>
              <span><strong>{course.title}</strong><small>Recommended course · {course.domain}</small></span>
              <Compass size={17} aria-hidden="true" />
            </div>
          </div>
        </div>

        {showPrerequisites && (
          <div className="cer-prerequisite-detail">
            <h3>PREREQUISITE FOUNDATIONS</h3>
            <ul>
              {evaluated.readinessByPrerequisite.map((item) => (
                  <li className={item.isReady ? 'is-ready' : 'is-gap'} key={item.name}><span>{item.isReady ? <Check size={14} /> : <AlertTriangle size={14} />}</span>{item.name}</li>
              ))}
            </ul>
          </div>
        )}

        {alreadyOnRoadmap ? (
          <div className="cer-duplicate-note" role="status">
            <strong>ALREADY ON YOUR ROADMAP</strong> This course is already part of your learning path.
            <button className="cer-primary" type="button" onClick={() => navigate('/roadmap')}>View roadmap <ArrowRight size={15} /></button>
          </div>
        ) : (
          <div className="cer-result-actions">
            <button className="cer-primary" type="button" onClick={addToRoadmap}>Add to roadmap <ArrowRight size={16} /></button>
            <button className="cer-secondary" type="button" aria-expanded={showPrerequisites} onClick={() => setShowPrerequisites((visible) => !visible)}>{showPrerequisites ? 'Hide prerequisites' : 'View prerequisites'}</button>
            <button className="cer-secondary" type="button" onClick={() => navigate('/explore-courses')}>Explore another course</button>
            <span className="cer-ready-score">{evaluated.score}% <small>READINESS</small></span>
          </div>
        )}
        {additionError && <p className="cer-error-note" role="alert">{additionError}</p>}
      </section>
    );
  }

  function renderOverview() {
    return (
      <>
        <section className="cer-main">
          <div className="cer-course-top">
            <span className="cer-tag">{course.domain}</span>
            <span className="cer-tag cer-tag-orange">RECOMMENDATION ENGINE</span>
            {roadmapNode && <span className="cer-tag">ON YOUR ROADMAP</span>}
          </div>
          <p className="cer-kicker">COURSE EVALUATION</p>
          <h2>{course.title}</h2>
          <p className="cer-course-summary">{course.description}</p>

          <section className="cer-why">
            <h3>Why this course?</h3>
            <p>{course.reason || `This course can strengthen your ${course.skill} competency and support your development goals.`}</p>
          </section>

          <section className="cer-profile">
            <h3>Course profile</h3>
            <div className="cer-profile-grid">
              <div className="cer-profile-item"><span>Difficulty</span><strong>{course.difficulty}</strong></div>
              <div className="cer-profile-item"><span>Duration</span><strong>{course.estTime}</strong></div>
              <div className="cer-profile-item"><span>Domain</span><strong>{course.domain}</strong></div>
              <div className="cer-profile-item"><span>Skill</span><strong>{course.skill}</strong></div>
            </div>
          </section>

          <div className="cer-prerequisite-intro">
            <ShieldCheck size={20} />
            <p>Evaluate your prerequisite readiness before adding this course to your personalised learning path.</p>
          </div>
          <button className="cer-primary" type="button" onClick={beginCheck}>Begin prerequisite check <ArrowRight size={16} /></button>
          {roadmapNode && <p className="cer-duplicate-note" role="note">This course is already part of your roadmap. The readiness check remains available, and a duplicate node will not be created.</p>}
        </section>

        <aside className="cer-aside">
          <h3>READINESS PATHWAY</h3>
          <ol>
            <li><span>01</span>Assess prerequisite knowledge</li>
            <li><span>02</span>Identify foundations to strengthen</li>
            <li><span>03</span>Generate a recommended path</li>
            <li><span>04</span>Extend your learning roadmap</li>
          </ol>
          <p className="cer-demo-note">This is a deterministic mock readiness check for demonstration. It is not a validated competency assessment.</p>
        </aside>
      </>
    );
  }

  function renderAdding() {
    return (
      <section className="cer-adding-panel" aria-live="polite">
        <p className="cer-kicker">KUSHALAI / LEARNING SERVICES</p>
        <h2>Adding to your learning roadmap</h2>
        <p>Creating a persistent learning path entry for {course.title}.</p>
        <div className="cer-adding-steps">
          <span className="is-active">✓ &nbsp; Validating prerequisites</span>
          <span className="is-active">✓ &nbsp; Positioning course</span>
          <span className="is-active">● &nbsp; Creating learning path</span>
          <span>○ &nbsp; Updating roadmap</span>
        </div>
      </section>
    );
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <main className="course-evaluation">
        <section className="cer-missing-panel">
          <LockKeyhole size={22} />
          <h2>Prerequisite information is being prepared</h2>
          <p>This course can still be explored in the catalogue.</p>
          <Link className="cer-secondary" to="/explore-courses">Explore another course</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="course-evaluation">
      <header className="ce-evaluation-header">
        <Link className="cer-back-link" to="/explore-courses"><ArrowLeft size={15} /> Explore courses</Link>
        <div className="ce-system-line">
          <span>KUSHALAI / COURSE EVALUATION</span>
          <span className="ce-engine-badge"><Compass size={15} /> RECOMMENDATION ENGINE</span>
        </div>
        <div className="ce-heading-rule" />
        <p className="ce-eyebrow">COURSE EVALUATION / {course.domain.toUpperCase()}</p>
        <h1>{course.title}</h1>
        <p className="ce-lede">Evaluate your readiness and identify the learning foundation that best supports your next step.</p>
      </header>

      <div className="ce-evaluation-content">
        {view === 'overview' && renderOverview()}
        {view === 'check' && renderQuestionCheck()}
        {view === 'analysing' && renderAnalysis()}
        {view === 'result' && renderResult()}
        {view === 'adding' && renderAdding()}
        {(view === 'check' || view === 'analysing' || view === 'adding') && (
          <aside className="cer-side-readiness">
            <span>{view === 'adding' ? 'ROADMAP UPDATE' : 'COURSE PROFILE'}</span>
            <strong>{course.title}</strong>
            {view === 'check' && <><div className="cer-score-meter"><span style={{ width: `${progressPercent}%` }} /></div><small>Question {questionIndex + 1} of {questions.length}</small></>}
            {view === 'analysing' && <small>Responses are being mapped to course foundations.</small>}
            {view === 'adding' && <small>Adding this course to the existing roadmap state.</small>}
          </aside>
        )}
        {view === 'overview' && (
          <aside className="cer-aside">
            <h3>PREREQUISITE FOUNDATIONS</h3>
            <ol id="cer-prerequisite-list">
              {check.prerequisites.map((prerequisite, index) => (
                <li key={prerequisite}><span>{String(index + 1).padStart(2, '0')}</span>{prerequisite}</li>
              ))}
            </ol>
            <p className="cer-demo-note">A short mock readiness assessment will identify areas to strengthen. Responses are evaluated locally and deterministically.</p>
          </aside>
        )}
      </div>

      <footer className="ce-footer"><span>KUSHALAI LEARNING INTELLIGENCE</span><span>DEMO PREREQUISITE READINESS CHECK</span></footer>
    </main>
  );
}