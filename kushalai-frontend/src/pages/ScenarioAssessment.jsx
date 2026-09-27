import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  ShieldCheck,
  Target,
  Award,
  FileCheck2,
  CircleHelp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { getCourseById } from '../data/mockCourses';
import { scenarioAssessments } from '../data/mockScenarioAssessments';

/* =========================================================
   KUSHALAI — SCENARIO ASSESSMENT
   Premium Government / Institutional UI
   ========================================================= */

function statusLabel(status) {
  return status === 'current'
    ? 'Current Focus'
    : status.charAt(0).toUpperCase() + status.slice(1);
}

/* =========================================================
   SHARED HEADER
   ========================================================= */

function SectionHeader({
  eyebrow,
  title,
  description,
  backText,
  onBack,
}) {
  return (
    <>
      <div className="sa-topbar">
        <button
          type="button"
          className="sa-back-link"
          onClick={onBack}
        >
          <ArrowLeft size={15} />
          {backText}
        </button>

        <div className="sa-system-label">
          <span className="sa-live-dot" />
          KUSHALAI / ASSESSMENT
        </div>
      </div>

      <header className="sa-page-header">
        <div className="sa-eyebrow">
          <span className="sa-eyebrow-line" />
          {eyebrow}
        </div>

        <h1>{title}</h1>

        <p>{description}</p>
      </header>
    </>
  );
}

/* =========================================================
   COURSE SELECTION
   ========================================================= */

function CourseSelection({ courses, onSelect, onBack }) {
  return (
    <div className="sa-shell">

      <SectionHeader
        eyebrow="SCENARIO BASED ASSESSMENT"
        title={
          <>
            Apply your learning
            <span> in context.</span>
          </>
        }
        description="Select a course from your competency roadmap and demonstrate how you would apply that knowledge in realistic workplace situations."
        backText="Learning Workspace"
        onBack={onBack}
      />

      <section className="sa-selection-bar">
        <div>
          <span>AVAILABLE ASSESSMENTS</span>
          <strong>Competency application</strong>
        </div>

        <div className="sa-selection-count">
          <strong>{courses.length}</strong>
          <span>ROADMAP COURSES</span>
        </div>
      </section>

      <section className="sa-course-grid">
        {courses.map(({ course, node }, index) => {
          const isLocked = node.status === 'locked';

          return (
            <button
              type="button"
              className={`sa-course-card ${
                isLocked ? 'is-locked' : ''
              }`}
              key={course.id}
              onClick={() =>
                !isLocked && onSelect(course.id)
              }
              disabled={isLocked}
            >
              <div className="sa-course-top">

                <div className="sa-course-number">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="sa-course-status">
                  {isLocked ? (
                    <>
                      <LockKeyhole size={12} />
                      LOCKED
                    </>
                  ) : (
                    <>
                      <span />
                      {statusLabel(node.status)}
                    </>
                  )}
                </div>

                <ArrowRight
                  className="sa-course-arrow"
                  size={19}
                />
              </div>

              <div className="sa-course-main">

                <div className="sa-course-code">
                  {course.skill?.slice(0, 3).toUpperCase()}
                </div>

                <h2>{course.title}</h2>

                <p>{course.description}</p>

              </div>

              <div className="sa-course-meta">

                <span>{course.domain}</span>

                <span>{course.difficulty}</span>

                <span>
                  <Clock3 size={13} />
                  {course.estTime}
                </span>

              </div>
            </button>
          );
        })}
      </section>

      <div className="sa-page-footer">
        <span>KUSHALAI LEARNING SYSTEM</span>
        <span>ASSESSMENT</span>
      </div>
    </div>
  );
}

/* =========================================================
   ASSESSMENT INTRO
   ========================================================= */

function AssessmentIntro({
  course,
  alreadyCompleted,
  onStart,
  onBack,
}) {
  return (
    <div className="sa-shell">

      <SectionHeader
        eyebrow="SCENARIO ASSESSMENT"
        title={course.title}
        description="Demonstrate how you would apply the knowledge from this course in realistic workplace situations."
        backText="Select another course"
        onBack={onBack}
      />

      <section className="sa-intro-layout">

        {/* Main intro */}
        <div className="sa-intro-main">

          <div className="sa-intro-code">
            <span>ASSESSMENT BRIEF</span>
          </div>

          <div className="sa-intro-icon">
            <Target size={28} strokeWidth={1.7} />
          </div>

          <h2>
            Put knowledge
            <span> into practice.</span>
          </h2>

          <p className="sa-intro-description">
            This assessment presents realistic situations that require
            you to apply concepts, reason through decisions, and
            demonstrate practical understanding.
          </p>

          <button
            type="button"
            className="sa-primary-button"
            onClick={onStart}
          >
            {alreadyCompleted
              ? 'REVIEW ASSESSMENT'
              : 'START ASSESSMENT'}
            <ArrowRight size={17} />
          </button>

        </div>

        {/* Facts */}
        <aside className="sa-intro-aside">

          <div className="sa-aside-heading">
            <span>ASSESSMENT FORMAT</span>
            <FileCheck2 size={17} />
          </div>

          <div className="sa-fact">
            <strong>10</strong>
            <span>QUESTIONS</span>
          </div>

          <div className="sa-fact">
            <strong>4 · 3 · 3</strong>
            <span>MCQ · SHORT · LONG</span>
          </div>

          <div className="sa-fact">
            <strong>+5</strong>
            <span>DISCIPLINE SCORE</span>
          </div>

          <div className="sa-reward-box">

            <div className="sa-reward-title">
              <Award size={16} />
              DISCIPLINE SCORE
            </div>

            <strong>
              {alreadyCompleted
                ? 'ALREADY AWARDED'
                : '+5 POINTS'}
            </strong>

            <p>
              {alreadyCompleted
                ? 'This assessment has already received its one-time reward.'
                : 'Successfully submitting this assessment improves your Discipline Score by +5 points.'}
            </p>

          </div>

        </aside>

      </section>

      <div className="sa-page-footer">
        <span>
          {course.domain?.toUpperCase()}
        </span>
        <span>SCENARIO ASSESSMENT</span>
      </div>

    </div>
  );
}

/* =========================================================
   QUESTION
   ========================================================= */

function AssessmentQuestion({
  question,
  answer,
  onAnswer,
}) {
  return (
    <section className="sa-question-panel">

      <div className="sa-question-meta">

        <div>
          <span>SCENARIO</span>
          <strong>WORKPLACE CONTEXT</strong>
        </div>

        <CircleHelp
          size={19}
          strokeWidth={1.6}
        />

      </div>

      <div className="sa-scenario">
        {question.scenario}
      </div>

      <div className="sa-question-label">
        QUESTION
      </div>

      <h2>{question.prompt}</h2>

      {question.type === 'mcq' ? (
        <div
          className="sa-options"
          role="radiogroup"
          aria-label="Answer choices"
        >
          {question.options.map((option, index) => (
            <label
              className={`sa-option ${
                answer === index
                  ? 'is-selected'
                  : ''
              }`}
              key={option}
            >
              <input
                type="radio"
                name={question.id}
                checked={answer === index}
                onChange={() =>
                  onAnswer(index)
                }
              />

              <span className="sa-option-marker">
                {String.fromCharCode(65 + index)}
              </span>

              <span className="sa-option-text">
                {option}
              </span>

              {answer === index && (
                <CheckCircle2
                  className="sa-option-check"
                  size={18}
                />
              )}
            </label>
          ))}
        </div>
      ) : (
        <textarea
          className={`sa-response ${
            question.type === 'long'
              ? 'is-long'
              : ''
          }`}
          value={answer || ''}
          onChange={(event) =>
            onAnswer(event.target.value)
          }
          placeholder={
            question.type === 'long'
              ? 'Write approximately 150–300 words.'
              : 'Write approximately 2–5 sentences.'
          }
          rows={
            question.type === 'long'
              ? 12
              : 7
          }
        />
      )}

    </section>
  );
}

/* =========================================================
   RESULT
   ========================================================= */

function AssessmentResult({
  course,
  correctCount,
  writtenCount,
  rewarded,
  onBack,
}) {
  return (
    <div className="sa-shell">

      <section className="sa-result">

        <div className="sa-result-top">

          <div className="sa-result-mark">
            <CheckCircle2
              size={28}
              strokeWidth={2}
            />
          </div>

          <div>

            <div className="sa-eyebrow">
              <span className="sa-eyebrow-line" />
              ASSESSMENT COMPLETE
            </div>

            <h1>{course.title}</h1>

            <p>
              Your practical assessment has been
              successfully submitted.
            </p>

          </div>

        </div>

        <div className="sa-result-grid">

          <div className="sa-result-card">
            <span>DISCIPLINE SCORE</span>

            <strong>
              {rewarded ? '+5' : 'RECORDED'}
            </strong>

            <small>
              {rewarded
                ? 'One-time assessment reward'
                : 'Reward already awarded'}
            </small>
          </div>

          <div className="sa-result-card">
            <span>PRACTICAL ASSESSMENT</span>

            <strong>10 / 10</strong>

            <small>
              Questions submitted
            </small>
          </div>

          <div className="sa-result-card">
            <span>MCQ PERFORMANCE</span>

            <strong>
              {correctCount} / 4
            </strong>

            <small>
              Automatically scored
            </small>
          </div>

          <div className="sa-result-card">
            <span>WRITTEN RESPONSES</span>

            <strong>
              {writtenCount} submitted
            </strong>

            <small>
              Recorded for review
            </small>
          </div>

        </div>

        <div className="sa-result-note">
          <ShieldCheck size={18} />

          <p>
            Written responses have been recorded for
            review. This demo does not apply automated
            AI grading.
          </p>
        </div>

        <button
          type="button"
          className="sa-primary-button"
          onClick={onBack}
        >
          RETURN TO LEARNING WORKSPACE
          <ArrowRight size={17} />
        </button>

      </section>

    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

function ScenarioAssessmentLoadingSkeleton() {
  return (
    <div className="scenario-assessment-page" aria-busy="true" aria-label="Loading scenario assessments">
      <div className="sa-shell">
        <div className="sa-topbar">
          <Skeleton width={170} height={14} />
          <Skeleton width={190} height={12} />
        </div>
        <header className="sa-page-header sa-loading-header">
          <Skeleton width={220} height={12} />
          <Skeleton width="min(100%, 700px)" height={46} />
          <Skeleton width="min(100%, 610px)" height={16} />
          <Skeleton width="min(100%, 510px)" height={16} />
        </header>
        <section className="sa-selection-bar sa-loading-selection">
          <div><Skeleton width={180} height={12} /><Skeleton width={240} height={16} /></div>
          <div><Skeleton width={36} height={25} /><Skeleton width={120} height={12} /></div>
        </section>
        <section className="sa-course-grid">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="sa-course-card sa-loading-course" key={index}>
              <div className="sa-course-top"><Skeleton width={42} height={42} radius={4} /><Skeleton width={100} height={12} /></div>
              <div className="sa-course-main">
                <Skeleton width={54} height={28} radius={4} />
                <Skeleton width="82%" height={24} />
                <Skeleton width="100%" height={14} />
                <Skeleton width="92%" height={14} />
                <Skeleton width="70%" height={14} />
              </div>
              <div className="sa-course-meta"><Skeleton width={82} height={12} /><Skeleton width={65} height={12} /><Skeleton width={70} height={12} /></div>
            </div>
          ))}
        </section>
        <div className="sa-page-footer"><Skeleton width={190} height={11} /><Skeleton width={100} height={11} /></div>
      </div>
      <ScenarioAssessmentStyles />
      <style>{`
        .sa-loading-header {
          display: grid;
          justify-items: start;
          gap: 14px;
        }
        .sa-loading-selection > div,
        .sa-loading-course .sa-course-top,
        .sa-loading-course .sa-course-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .sa-loading-selection > div:first-child,
        .sa-loading-course .sa-course-main {
          display: grid;
          align-content: start;
          gap: 13px;
        }
        .sa-loading-course {
          cursor: default;
          pointer-events: none;
        }
        .sa-loading-course .sa-course-top {
          margin-bottom: 24px;
        }
        .sa-loading-course .sa-course-main {
          flex: 1;
        }
        .sa-loading-course .sa-course-meta {
          justify-content: flex-start;
          flex-wrap: wrap;
        }
        .sa-page-footer {
          display: flex;
          justify-content: space-between;
        }
        @media (max-width: 600px) {
          .sa-loading-selection {
            align-items: flex-start;
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default function ScenarioAssessment() {
  const navigate = useNavigate();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsInitialLoading(false), 800);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const {
    roadmap,
    completedScenarioAssessments,
    recordScenarioAssessment,
  } = useApp();

  const [selectedCourseId, setSelectedCourseId] =
    useState(null);

  const [started, setStarted] =
    useState(false);

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [answers, setAnswers] =
    useState({});

  const [result, setResult] =
    useState(null);

  const courses = useMemo(
    () =>
      roadmap
        .map((node) => {
          const course =
            getCourseById(node.courseId);

          return course
            ? { course, node }
            : null;
        })
        .filter(Boolean),
    [roadmap]
  );

  const selected = courses.find(
    ({ course }) =>
      course.id === selectedCourseId
  );

  const assessment = selected
    ? scenarioAssessments[
        selected.course.id
      ]
    : null;

  const question =
    assessment?.questions[questionIndex];

  const hasAnswer =
    question &&
    (
      question.type === 'mcq'
        ? answers[question.id] !== undefined
        : Boolean(
            answers[question.id]?.trim()
          )
    );

      if (isInitialLoading) return <ScenarioAssessmentLoadingSkeleton />;

  function chooseCourse(courseId) {
    setSelectedCourseId(courseId);
    setStarted(false);
    setResult(null);
    setAnswers({});
    setQuestionIndex(0);
  }

  function startAssessment() {
    setStarted(true);
    setQuestionIndex(0);
    setAnswers({});
  }

  function setAnswer(value) {
    setAnswers((current) => ({
      ...current,
      [question.id]: value,
    }));
  }

  function submitAssessment() {
    const correctCount =
      assessment.questions.filter(
        (item) =>
          item.type === 'mcq' &&
          answers[item.id] ===
            item.correctOption
      ).length;

    const writtenCount =
      assessment.questions.filter(
        (item) =>
          item.type !== 'mcq' &&
          answers[item.id]?.trim()
      ).length;

    const rewarded =
      recordScenarioAssessment(
        selected.course.id,
        selected.course.title,
        correctCount,
        assessment.questions.filter(
          (item) =>
            item.type === 'mcq'
        ).length
      );

    setResult({
      correctCount,
      writtenCount,
      rewarded,
    });
  }

  /* =====================================================
     COURSE SELECTION
     ===================================================== */

  if (!selected) {
    return (
      <div className="scenario-assessment-page">

        <CourseSelection
          courses={courses}
          onSelect={chooseCourse}
          onBack={() =>
            navigate('/learning-workspace')
          }
        />

        <ScenarioAssessmentStyles />

      </div>
    );
  }

  /* =====================================================
     RESULT
     ===================================================== */

  if (result) {
    return (
      <div className="scenario-assessment-page">

        <AssessmentResult
          course={selected.course}
          {...result}
          onBack={() =>
            navigate('/learning-workspace')
          }
        />

        <ScenarioAssessmentStyles />

      </div>
    );
  }

  /* =====================================================
     INTRO
     ===================================================== */

  if (!started) {
    return (
      <div className="scenario-assessment-page">

        <AssessmentIntro
          course={selected.course}
          alreadyCompleted={
            completedScenarioAssessments.includes(
              selected.course.id
            )
          }
          onStart={startAssessment}
          onBack={() =>
            chooseCourse(null)
          }
        />

        <ScenarioAssessmentStyles />

      </div>
    );
  }

  /* =====================================================
     QUESTIONS
     ===================================================== */

  const isLast =
    questionIndex ===
    assessment.questions.length - 1;

  const progress =
    ((questionIndex + 1) /
      assessment.questions.length) *
    100;

  return (
    <div className="scenario-assessment-page">

      <div className="sa-shell">

        <div className="sa-topbar">

          <button
            type="button"
            className="sa-back-link"
            onClick={() =>
              setStarted(false)
            }
          >
            <ArrowLeft size={15} />
            Assessment introduction
          </button>

          <div className="sa-system-label">
            <span className="sa-live-dot" />
            KUSHALAI / LIVE ASSESSMENT
          </div>

        </div>

        <header className="sa-question-header">

          <div>

            <div className="sa-eyebrow">
              <span className="sa-eyebrow-line" />
              SCENARIO BASED ASSESSMENT
            </div>

            <h1>
              {selected.course.title}
            </h1>

          </div>

          <div className="sa-progress-count">

            <span>QUESTION</span>

            <strong>
              {String(
                questionIndex + 1
              ).padStart(2, '0')}
            </strong>

            <small>
              /{' '}
              {String(
                assessment.questions.length
              ).padStart(2, '0')}
            </small>

          </div>

        </header>

        <div className="sa-progress-wrapper">

          <div className="sa-progress-label">
            <span>ASSESSMENT PROGRESS</span>

            <strong>
              {Math.round(progress)}%
            </strong>
          </div>

          <div className="sa-progress-track">
            <span
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

        </div>

        <AssessmentQuestion
          question={question}
          answer={answers[question.id]}
          onAnswer={setAnswer}
        />

        <div className="sa-navigation">

          <button
            type="button"
            className="sa-secondary-button"
            disabled={
              questionIndex === 0
            }
            onClick={() =>
              setQuestionIndex(
                (index) => index - 1
              )
            }
          >
            <ArrowLeft size={16} />
            BACK
          </button>

          {isLast ? (
            <button
              type="button"
              className="sa-primary-button"
              disabled={!hasAnswer}
              onClick={
                submitAssessment
              }
            >
              SUBMIT ASSESSMENT
              <CheckCircle2 size={17} />
            </button>
          ) : (
            <button
              type="button"
              className="sa-primary-button"
              disabled={!hasAnswer}
              onClick={() =>
                setQuestionIndex(
                  (index) => index + 1
                )
              }
            >
              NEXT
              <ArrowRight size={17} />
            </button>
          )}

        </div>

        <div className="sa-page-footer">
          <span>
            KUSHALAI LEARNING SYSTEM
          </span>

          <span>
            {selected.course.domain?.toUpperCase()}
          </span>
        </div>

      </div>

      <ScenarioAssessmentStyles />

    </div>
  );
}

/* =========================================================
   STYLES
   ========================================================= */

function ScenarioAssessmentStyles() {
  return (
    <style>{`

      /* =====================================================
         ROOT
         ===================================================== */

      .scenario-assessment-page {
        --k-blue: #123B66;
        --k-blue-dark: #0B2947;
        --k-orange: #EA580C;
        --k-orange-soft: #FFF1E8;
        --k-cream: #F7F3ED;
        --k-white: #FFFFFF;
        --k-ink: #10243B;
        --k-muted: #64748B;
        --k-line: #D9E0E7;
        --k-soft: #F8FAFC;

        min-height: 100vh;

        background:
          linear-gradient(
            180deg,
            #F7F3ED 0%,
            #FCFBF9 45%,
            #F7F3ED 100%
          );

        color: var(--k-ink);

        font-family:
          Inter,
          "Segoe UI",
          Arial,
          sans-serif;

        -webkit-font-smoothing: antialiased;

        padding: 42px 6vw 70px;
      }


      .sa-shell {
        width: min(1400px, 100%);
        margin: 0 auto;
      }


      /* =====================================================
         TOPBAR
         ===================================================== */

      .sa-topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;

        margin-bottom: 42px;
      }


      .sa-back-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;

        border: 0;
        background: transparent;

        color: var(--k-blue);

        font-family: inherit;

        font-size: 12px;
        font-weight: 800;

        letter-spacing: 0.04em;

        cursor: pointer;

        padding: 0;
      }


      .sa-back-link:hover {
        color: var(--k-orange);
      }


      .sa-system-label {
        display: flex;
        align-items: center;
        gap: 8px;

        color: #718096;

        font-size: 10px;
        font-weight: 850;

        letter-spacing: 0.14em;
      }


      .sa-live-dot {
        width: 7px;
        height: 7px;

        border-radius: 50%;

        background: #2F855A;

        box-shadow:
          0 0 0 4px rgba(47, 133, 90, 0.08);
      }


      /* =====================================================
         HEADER
         ===================================================== */

      .sa-page-header {
        max-width: 900px;

        padding-bottom: 42px;

        border-bottom: 1px solid var(--k-line);
      }


      .sa-eyebrow {
        display: flex;
        align-items: center;
        gap: 10px;

        color: var(--k-orange);

        font-size: 11px;
        font-weight: 900;

        letter-spacing: 0.17em;
      }


      .sa-eyebrow-line {
        width: 30px;
        height: 2px;

        background: var(--k-orange);
      }


      .sa-page-header h1 {
        margin: 19px 0 18px;

        font-size: clamp(46px, 6vw, 78px);

        line-height: 0.98;

        letter-spacing: -0.06em;

        font-weight: 850;

        color: var(--k-ink);
      }


      .sa-page-header h1 span {
        color: var(--k-blue);
      }


      .sa-page-header p {
        max-width: 760px;

        margin: 0;

        color: var(--k-muted);

        font-size: 17px;

        line-height: 1.7;

        font-weight: 500;
      }


      /* =====================================================
         COURSE SELECTION
         ===================================================== */

      .sa-selection-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;

        margin: 32px 0 18px;

        padding-bottom: 15px;

        border-bottom: 1px solid var(--k-line);
      }


      .sa-selection-bar > div:first-child {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }


      .sa-selection-bar span,
      .sa-selection-count span {
        color: #7B8796;

        font-size: 10px;
        font-weight: 850;

        letter-spacing: 0.14em;
      }


      .sa-selection-bar strong {
        color: var(--k-ink);

        font-size: 14px;
        font-weight: 800;
      }


      .sa-selection-count {
        display: flex;
        align-items: center;
        gap: 10px;
      }


      .sa-selection-count strong {
        color: var(--k-orange);

        font-size: 18px;
        font-weight: 900;
      }


      /* =====================================================
         COURSE GRID
         ===================================================== */

      .sa-course-grid {
        display: grid;

        grid-template-columns:
          repeat(2, minmax(0, 1fr));

        gap: 16px;
      }


      .sa-course-card {
        position: relative;

        min-height: 280px;

        display: flex;
        flex-direction: column;

        padding: 25px;

        text-align: left;

        background: var(--k-white);

        border: 1px solid var(--k-line);

        border-radius: 4px;

        color: inherit;

        cursor: pointer;

        overflow: hidden;

        transition:
          transform 250ms ease,
          box-shadow 250ms ease,
          border-color 250ms ease;
      }


      .sa-course-card::before {
        content: "";

        position: absolute;

        top: 0;
        left: 0;

        width: 100%;
        height: 3px;

        background: var(--k-blue);

        transform: scaleX(0);
        transform-origin: left;

        transition:
          transform 300ms ease;
      }


      .sa-course-card:hover {
        transform: translateY(-4px);

        border-color: #C4CFDB;

        box-shadow:
          0 16px 35px
          rgba(11, 41, 71, 0.08);
      }


      .sa-course-card:hover::before {
        transform: scaleX(1);
      }


      .sa-course-card.is-locked {
        cursor: not-allowed;

        opacity: 0.6;
      }


      .sa-course-top {
        display: grid;

        grid-template-columns:
          45px 1fr auto;

        align-items: center;

        gap: 14px;

        padding-bottom: 19px;

        border-bottom: 1px solid var(--k-line);
      }


      .sa-course-number {
        width: 40px;
        height: 40px;

        display: flex;
        align-items: center;
        justify-content: center;

        background: var(--k-blue);

        color: white;

        font-size: 11px;
        font-weight: 900;
      }


      .sa-course-status {
        display: flex;
        align-items: center;
        gap: 7px;

        color: #66758A;

        font-size: 10px;
        font-weight: 850;

        letter-spacing: 0.1em;
      }


      .sa-course-status > span {
        width: 6px;
        height: 6px;

        border-radius: 50%;

        background: #2F855A;
      }


      .sa-course-arrow {
        color: var(--k-blue);

        transition:
          transform 200ms ease;
      }


      .sa-course-card:hover .sa-course-arrow {
        transform: translateX(4px);

        color: var(--k-orange);
      }


      .sa-course-main {
        flex: 1;

        padding: 27px 0 22px;
      }


      .sa-course-code {
        display: inline-flex;

        padding: 5px 8px;

        margin-bottom: 13px;

        background: var(--k-orange-soft);

        color: var(--k-orange);

        font-size: 9px;
        font-weight: 900;

        letter-spacing: 0.1em;
      }


      .sa-course-main h2 {
        margin: 0 0 11px;

        color: var(--k-ink);

        font-size: 25px;

        line-height: 1.15;

        letter-spacing: -0.025em;

        font-weight: 850;
      }


      .sa-course-main p {
        max-width: 580px;

        margin: 0;

        color: var(--k-muted);

        font-size: 13px;

        line-height: 1.65;

        font-weight: 500;
      }


      .sa-course-meta {
        display: flex;
        align-items: center;

        gap: 8px;

        padding-top: 15px;

        border-top: 1px solid var(--k-line);
      }


      .sa-course-meta span {
        display: inline-flex;
        align-items: center;
        gap: 5px;

        padding-right: 9px;

        border-right: 1px solid var(--k-line);

        color: #718096;

        font-size: 10px;
        font-weight: 750;
      }


      .sa-course-meta span:last-child {
        border-right: 0;
      }


      /* =====================================================
         INTRO
         ===================================================== */

      .sa-intro-layout {
        display: grid;

        grid-template-columns:
          minmax(0, 1.6fr)
          minmax(300px, 0.75fr);

        margin-top: 42px;

        background: white;

        border: 1px solid var(--k-line);

        border-radius: 4px;

        overflow: hidden;
      }


      .sa-intro-main {
        position: relative;

        padding: 50px;

        border-right: 1px solid var(--k-line);
      }


      .sa-intro-code {
        display: flex;
        align-items: center;

        margin-bottom: 45px;

        color: #8290A0;

        font-size: 10px;

        font-weight: 850;

        letter-spacing: 0.13em;
      }


      .sa-intro-icon {
        width: 58px;
        height: 58px;

        display: flex;
        align-items: center;
        justify-content: center;

        margin-bottom: 28px;

        background: var(--k-blue);

        color: white;
      }


      .sa-intro-main h2 {
        max-width: 700px;

        margin: 0;

        font-size: clamp(40px, 5vw, 68px);

        line-height: 0.98;

        letter-spacing: -0.055em;

        font-weight: 850;
      }


      .sa-intro-main h2 span {
        color: var(--k-orange);
      }


      .sa-intro-description {
        max-width: 650px;

        margin: 25px 0 35px;

        color: var(--k-muted);

        font-size: 16px;

        line-height: 1.75;

        font-weight: 500;
      }


      .sa-intro-aside {
        background:
          linear-gradient(
            180deg,
            #FBFCFD 0%,
            #F5F7F9 100%
          );

        padding: 32px;
      }


      .sa-aside-heading {
        display: flex;
        justify-content: space-between;
        align-items: center;

        padding-bottom: 18px;

        border-bottom: 1px solid var(--k-line);

        color: var(--k-blue);

        font-size: 10px;

        font-weight: 900;

        letter-spacing: 0.13em;
      }


      .sa-fact {
        display: flex;
        flex-direction: column;

        padding: 22px 0;

        border-bottom: 1px solid var(--k-line);
      }


      .sa-fact strong {
        color: var(--k-ink);

        font-size: 28px;

        font-weight: 850;
      }


      .sa-fact span {
        margin-top: 4px;

        color: #7A8796;

        font-size: 9px;

        font-weight: 850;

        letter-spacing: 0.13em;
      }


      .sa-reward-box {
        margin-top: 22px;

        padding: 19px;

        background: var(--k-orange-soft);

        border-left: 3px solid var(--k-orange);
      }


      .sa-reward-title {
        display: flex;
        align-items: center;
        gap: 7px;

        color: var(--k-orange);

        font-size: 9px;

        font-weight: 900;

        letter-spacing: 0.11em;
      }


      .sa-reward-box > strong {
        display: block;

        margin-top: 9px;

        color: var(--k-ink);

        font-size: 19px;

        font-weight: 900;
      }


      .sa-reward-box p {
        margin: 8px 0 0;

        color: #6D7785;

        font-size: 11px;

        line-height: 1.55;
      }


      /* =====================================================
         BUTTONS
         ===================================================== */

      .sa-primary-button {
        display: inline-flex;

        align-items: center;

        justify-content: center;

        gap: 11px;

        min-height: 48px;

        padding: 0 20px;

        border: 0;

        border-radius: 3px;

        background: var(--k-orange);

        color: white;

        font-family: inherit;

        font-size: 11px;

        font-weight: 900;

        letter-spacing: 0.09em;

        cursor: pointer;

        transition:
          transform 200ms ease,
          background 200ms ease,
          box-shadow 200ms ease;
      }


      .sa-primary-button:hover:not(:disabled) {
        transform: translateY(-2px);

        background: #D94E09;

        box-shadow:
          0 9px 20px
          rgba(234, 88, 12, 0.2);
      }


      .sa-primary-button:disabled {
        opacity: 0.4;

        cursor: not-allowed;
      }


      .sa-secondary-button {
        display: inline-flex;

        align-items: center;

        gap: 8px;

        min-height: 46px;

        padding: 0 17px;

        background: transparent;

        border: 1px solid var(--k-line);

        border-radius: 3px;

        color: var(--k-blue);

        font-family: inherit;

        font-size: 10px;

        font-weight: 900;

        letter-spacing: 0.09em;

        cursor: pointer;
      }


      .sa-secondary-button:hover:not(:disabled) {
        border-color: var(--k-blue);
      }


      .sa-secondary-button:disabled {
        opacity: 0.35;

        cursor: not-allowed;
      }


      /* =====================================================
         QUESTION HEADER
         ===================================================== */

      .sa-question-header {
        display: flex;

        justify-content: space-between;

        align-items: flex-end;

        padding-bottom: 27px;

        border-bottom: 1px solid var(--k-line);
      }


      .sa-question-header h1 {
        margin: 15px 0 0;

        font-size: clamp(32px, 4vw, 55px);

        line-height: 1;

        letter-spacing: -0.045em;

        font-weight: 850;
      }


      .sa-progress-count {
        display: flex;

        align-items: baseline;

        gap: 5px;

        color: #7C8896;
      }


      .sa-progress-count span {
        margin-right: 8px;

        font-size: 9px;

        font-weight: 900;

        letter-spacing: 0.13em;
      }


      .sa-progress-count strong {
        color: var(--k-orange);

        font-size: 31px;

        font-weight: 900;
      }


      .sa-progress-count small {
        font-size: 12px;

        font-weight: 750;
      }


      .sa-progress-wrapper {
        margin: 25px 0 32px;
      }


      .sa-progress-label {
        display: flex;

        justify-content: space-between;

        margin-bottom: 8px;

        color: #778496;

        font-size: 9px;

        font-weight: 850;

        letter-spacing: 0.11em;
      }


      .sa-progress-label strong {
        color: var(--k-orange);
      }


      .sa-progress-track {
        width: 100%;

        height: 4px;

        overflow: hidden;

        background: #DDE3E9;
      }


      .sa-progress-track span {
        display: block;

        height: 100%;

        background:
          linear-gradient(
            90deg,
            var(--k-blue),
            var(--k-orange)
          );

        transition:
          width 400ms ease;
      }


      /* =====================================================
         QUESTION PANEL
         ===================================================== */

      .sa-question-panel {
        max-width: 1000px;

        margin: 0 auto;

        padding: 42px 45px;

        background: white;

        border: 1px solid var(--k-line);

        border-radius: 4px;
      }


      .sa-question-meta {
        display: flex;

        justify-content: space-between;

        align-items: center;

        padding-bottom: 17px;

        border-bottom: 1px solid var(--k-line);

        color: var(--k-blue);
      }


      .sa-question-meta div {
        display: flex;

        flex-direction: column;

        gap: 5px;
      }


      .sa-question-meta span {
        color: var(--k-orange);

        font-size: 9px;

        font-weight: 900;

        letter-spacing: 0.14em;
      }


      .sa-question-meta strong {
        color: var(--k-ink);

        font-size: 11px;

        font-weight: 800;

        letter-spacing: 0.06em;
      }


      .sa-scenario {
        margin: 24px 0 31px;

        padding: 20px 22px;

        background: #F7F9FB;

        border-left: 3px solid var(--k-blue);

        color: #506176;

        font-size: 14px;

        line-height: 1.7;

        font-weight: 500;
      }


      .sa-question-label {
        margin-bottom: 10px;

        color: var(--k-orange);

        font-size: 10px;

        font-weight: 900;

        letter-spacing: 0.15em;
      }


      .sa-question-panel h2 {
        max-width: 850px;

        margin: 0 0 27px;

        color: var(--k-ink);

        font-size: clamp(25px, 3vw, 37px);

        line-height: 1.2;

        letter-spacing: -0.025em;

        font-weight: 800;
      }


      /* =====================================================
         OPTIONS
         ===================================================== */

      .sa-options {
        display: grid;

        gap: 10px;
      }


      .sa-option {
        position: relative;

        display: flex;

        align-items: center;

        gap: 15px;

        min-height: 62px;

        padding: 10px 15px;

        background: white;

        border: 1px solid var(--k-line);

        border-radius: 3px;

        cursor: pointer;

        transition:
          border-color 180ms ease,
          background 180ms ease,
          transform 180ms ease;
      }


      .sa-option:hover {
        border-color: #B7C4D1;

        transform: translateX(2px);
      }


      .sa-option.is-selected {
        border-color: var(--k-orange);

        background: var(--k-orange-soft);
      }


      .sa-option input {
        position: absolute;

        opacity: 0;

        pointer-events: none;
      }


      .sa-option-marker {
        width: 34px;
        height: 34px;

        flex: 0 0 34px;

        display: flex;

        align-items: center;

        justify-content: center;

        border: 1px solid #C9D2DC;

        color: var(--k-blue);

        font-size: 11px;

        font-weight: 900;
      }


      .sa-option.is-selected
      .sa-option-marker {
        background: var(--k-orange);

        border-color: var(--k-orange);

        color: white;
      }


      .sa-option-text {
        flex: 1;

        color: #33465D;

        font-size: 14px;

        line-height: 1.5;

        font-weight: 600;
      }


      .sa-option-check {
        color: var(--k-orange);
      }


      /* =====================================================
         WRITTEN RESPONSE
         ===================================================== */

      .sa-response {
        width: 100%;

        box-sizing: border-box;

        padding: 17px;

        resize: vertical;

        background: #FBFCFD;

        border: 1px solid var(--k-line);

        border-radius: 3px;

        outline: none;

        color: var(--k-ink);

        font-family: inherit;

        font-size: 14px;

        line-height: 1.7;
      }


      .sa-response:focus {
        border-color: var(--k-blue);

        box-shadow:
          0 0 0 3px
          rgba(18, 59, 102, 0.07);
      }


      .sa-response.is-long {
        min-height: 280px;
      }


      /* =====================================================
         NAVIGATION
         ===================================================== */

      .sa-navigation {
        max-width: 1000px;

        margin: 17px auto 0;

        display: flex;

        align-items: center;

        justify-content: space-between;
      }


      /* =====================================================
         RESULT
         ===================================================== */

      .sa-result {
        max-width: 1100px;

        margin: 50px auto 0;

        padding: 48px;

        background: white;

        border: 1px solid var(--k-line);

        border-radius: 4px;
      }


      .sa-result-top {
        display: flex;

        align-items: flex-start;

        gap: 23px;

        padding-bottom: 35px;

        border-bottom: 1px solid var(--k-line);
      }


      .sa-result-mark {
        width: 58px;
        height: 58px;

        flex: 0 0 58px;

        display: flex;

        align-items: center;

        justify-content: center;

        background: var(--k-blue);

        color: white;
      }


      .sa-result-top h1 {
        margin: 13px 0 7px;

        font-size: 40px;

        line-height: 1.05;

        letter-spacing: -0.04em;

        font-weight: 850;
      }


      .sa-result-top p {
        margin: 0;

        color: var(--k-muted);

        font-size: 14px;
      }


      .sa-result-grid {
        display: grid;

        grid-template-columns:
          repeat(4, 1fr);

        gap: 1px;

        margin: 32px 0;

        background: var(--k-line);

        border: 1px solid var(--k-line);
      }


      .sa-result-card {
        min-height: 145px;

        display: flex;

        flex-direction: column;

        padding: 22px;

        background: white;
      }


      .sa-result-card span {
        color: #7B8795;

        font-size: 9px;

        font-weight: 900;

        letter-spacing: 0.12em;
      }


      .sa-result-card strong {
        margin-top: auto;

        color: var(--k-blue);

        font-size: 28px;

        font-weight: 900;
      }


      .sa-result-card:first-child strong {
        color: var(--k-orange);
      }


      .sa-result-card small {
        margin-top: 4px;

        color: #8A95A2;

        font-size: 10px;
      }


      .sa-result-note {
        display: flex;

        align-items: flex-start;

        gap: 11px;

        margin-bottom: 25px;

        padding: 15px 17px;

        background: #F6F8FA;

        border-left: 3px solid var(--k-blue);

        color: #64748B;
      }


      .sa-result-note svg {
        flex: 0 0 auto;

        color: var(--k-blue);

        margin-top: 2px;
      }


      .sa-result-note p {
        margin: 0;

        font-size: 12px;

        line-height: 1.6;
      }


      /* =====================================================
         FOOTER
         ===================================================== */

      .sa-page-footer {
        display: flex;

        justify-content: space-between;

        margin-top: 45px;

        padding-top: 13px;

        border-top: 1px solid var(--k-line);

        color: #8A96A4;

        font-size: 9px;

        font-weight: 850;

        letter-spacing: 0.14em;
      }


      /* =====================================================
         TABLET
         ===================================================== */

      @media (max-width: 900px) {

        .scenario-assessment-page {
          padding:
            32px
            4vw
            55px;
        }


        .sa-course-grid {
          grid-template-columns: 1fr;
        }


        .sa-intro-layout {
          grid-template-columns: 1fr;
        }


        .sa-intro-main {
          border-right: 0;

          border-bottom: 1px solid var(--k-line);
        }


        .sa-result-grid {
          grid-template-columns:
            repeat(2, 1fr);
        }

      }


      /* =====================================================
         MOBILE
         ===================================================== */

      @media (max-width: 600px) {

        .scenario-assessment-page {
          padding:
            24px
            18px
            45px;
        }


        .sa-topbar {
          align-items: flex-start;

          flex-direction: column;

          gap: 14px;
        }


        .sa-page-header h1 {
          font-size: 48px;
        }


        .sa-page-header p {
          font-size: 15px;
        }


        .sa-selection-bar {
          align-items: flex-start;

          flex-direction: column;

          gap: 14px;
        }


        .sa-course-card {
          min-height: 300px;

          padding: 21px;
        }


        .sa-course-main h2 {
          font-size: 23px;
        }


        .sa-intro-main {
          padding: 28px;
        }


        .sa-intro-aside {
          padding: 25px;
        }


        .sa-intro-main h2 {
          font-size: 42px;
        }


        .sa-question-header {
          align-items: flex-start;

          flex-direction: column;

          gap: 20px;
        }


        .sa-question-header h1 {
          font-size: 34px;
        }


        .sa-question-panel {
          padding: 27px 20px;
        }


        .sa-question-panel h2 {
          font-size: 26px;
        }


        .sa-option {
          min-height: 58px;

          padding: 9px 11px;

          gap: 10px;
        }


        .sa-option-text {
          font-size: 13px;
        }


        .sa-navigation {
          gap: 10px;
        }


        .sa-result {
          padding: 27px 20px;
        }


        .sa-result-top {
          gap: 14px;
        }


        .sa-result-top h1 {
          font-size: 30px;
        }


        .sa-result-grid {
          grid-template-columns: 1fr;
        }


        .sa-page-footer {
          align-items: flex-start;

          flex-direction: column;

          gap: 7px;
        }

      }


      /* =====================================================
         ACCESSIBILITY
         ===================================================== */

      @media (prefers-reduced-motion: reduce) {

        .sa-course-card,
        .sa-course-card::before,
        .sa-course-arrow,
        .sa-option,
        .sa-progress-track span,
        .sa-primary-button {
          transition: none !important;
        }

      }

    `}</style>
  );
}