import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  BookOpenCheck,
  Target,
  Flame,
  TrendingUp,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import {
  Card,
  Button,
  StatCard,
  CircularProgress,
  Skeleton
} from '../components/common/UI';

import ActivityHeatmap from '../components/dashboard/ActivityHeatmap';
import QuizTrendChart from '../components/dashboard/QuizTrendChart';
import ScenarioAssessmentAnalytics from '../components/dashboard/ScenarioAssessmentAnalytics';
import SkillPassport from './SkillPassport';

import { useApp } from '../context/AppContext';
import { getCourseById } from '../data/mockCourses';
import {
  skillDomains,
  domainAverage,
  statusFromMastery
} from '../data/mockSkills';

import { generateActivityHeatmap } from '../data/mockQuizzes';

function DashboardLoadingSkeleton() {
  return (
    <div className="dashboard-loading-skeleton" aria-busy="true" aria-label="Loading dashboard">
      <Card style={{ minHeight: 176, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <div style={{ display: 'grid', gap: 12, width: 'min(100%, 480px)' }}>
          <Skeleton width="42%" height={28} />
          <Skeleton width="76%" height={14} />
          <Skeleton width="54%" height={12} />
        </div>
        <Skeleton width={150} height={42} radius={8} />
      </Card>

      <div className="dashboard-loading-stats">
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index} style={{ minHeight: 106, display: 'grid', alignContent: 'center', gap: 10 }}>
            <Skeleton width="58%" height={13} />
            <Skeleton width="36%" height={25} />
            <Skeleton width="72%" height={11} />
          </Card>
        ))}
      </div>

      <div className="grid grid-3" style={{ marginBottom: 'var(--space-4)', alignItems: 'stretch' }}>
        <Card style={{ gridColumn: 'span 2', minHeight: 290, display: 'grid', alignContent: 'space-between', gap: 20 }}>
          <Skeleton width="40%" height={22} />
          <Skeleton width="100%" height={118} radius={6} />
          <Skeleton width="84%" height={14} />
        </Card>
        <Card style={{ minHeight: 290, display: 'grid', alignContent: 'space-between', justifyItems: 'center', gap: 16 }}>
          <Skeleton width="62%" height={19} />
          <Skeleton width={116} height={116} radius="50%" />
          <div style={{ display: 'grid', gap: 12, width: '100%' }}>
            <Skeleton width="100%" height={13} />
            <Skeleton width="100%" height={13} />
            <Skeleton width="100%" height={13} />
          </div>
        </Card>
      </div>

      <div className="dashboard-loading-lower">
        <Card style={{ minHeight: 300, display: 'grid', alignContent: 'space-between', gap: 20 }}>
          <Skeleton width="36%" height={24} />
          <Skeleton width="100%" height={160} radius={6} />
          <Skeleton width="70%" height={14} />
        </Card>
        <Card style={{ minHeight: 300, display: 'grid', alignContent: 'space-between', gap: 20 }}>
          <Skeleton width="50%" height={22} />
          <Skeleton width="100%" height={185} radius={6} />
          <Skeleton width="65%" height={13} />
        </Card>
      </div>

      <style>{`
        .dashboard-loading-skeleton {
          display: grid;
          gap: var(--space-4);
        }

        .dashboard-loading-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .dashboard-loading-lower {
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(300px, 0.8fr);
          gap: var(--space-3);
        }

        @media (max-width: 1100px) {
          .dashboard-loading-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .dashboard-loading-lower {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .dashboard-loading-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsInitialLoading(false), 1300);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const {
    user,
    disciplineScore,
    disciplineLog,
    quizHistory,
    completedScenarioAssessments,
    scenarioAssessmentAttempts,
    courseCompletion,
    roadmap
  } = useApp();
  const [selectedCourseId, setSelectedCourseId] = useState('all');
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [courseDropdownPosition, setCourseDropdownPosition] = useState(null);
  const inProgressCourses = roadmap.reduce((courses, node) => {
    if (node.status === 'completed' || node.status === 'locked') return courses;

    const course = getCourseById(node.courseId);
    if (!course || courses.some((entry) => entry.course.id === course.id)) return courses;

    courses.push({ node, course });
    return courses;
  }, []);
  const selectedInProgressCourse = inProgressCourses.find(
    ({ course }) => course.id === selectedCourseId
  );
  const selectedCourse = selectedInProgressCourse?.course;
  const selectedCourseMastery = Number.isFinite(selectedCourse?.currentMastery)
    ? Math.max(0, Math.min(100, Math.round(selectedCourse.currentMastery)))
    : null;
  const displayedCourseCounts = selectedInProgressCourse
    ? {
        completed: selectedInProgressCourse.node.status === 'completed' ? 1 : 0,
        inProgress: selectedInProgressCourse.node.status === 'current' ? 1 : 0,
        recommended: selectedInProgressCourse.node.status === 'recommended' ? 1 : 0
      }
    : {
        completed: courseCompletion.completed,
        inProgress: inProgressCourses.length,
        recommended: courseCompletion.recommended
      };
  const courseDropdownRef = useRef(null);
  const courseDropdownTriggerRef = useRef(null);
  const courseDropdownMenuRef = useRef(null);

  useEffect(() => {
    if (selectedCourseId !== 'all' && !selectedInProgressCourse) {
      setSelectedCourseId('all');
    }
  }, [selectedCourseId, Boolean(selectedInProgressCourse)]);

  useEffect(() => {
    if (!isCourseDropdownOpen) return undefined;

    function handlePointerDown(event) {
      if (
        !courseDropdownRef.current?.contains(event.target) &&
        !courseDropdownMenuRef.current?.contains(event.target)
      ) {
        setIsCourseDropdownOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsCourseDropdownOpen(false);
        courseDropdownTriggerRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCourseDropdownOpen]);

  useLayoutEffect(() => {
    if (!isCourseDropdownOpen) return undefined;

    function updateDropdownPosition() {
      const trigger = courseDropdownTriggerRef.current;
      if (!trigger) return;

      const bounds = trigger.getBoundingClientRect();
      const viewportMargin = 8;
      const menuGap = 4;
      const desiredMaxHeight = 220;
      const spaceBelow = window.innerHeight - bounds.bottom - viewportMargin;
      const spaceAbove = bounds.top - viewportMargin;
      const openAbove = spaceBelow < desiredMaxHeight && spaceAbove > spaceBelow;
      const availableHeight = Math.max(0, (openAbove ? spaceAbove : spaceBelow) - menuGap);
      const width = Math.min(bounds.width, window.innerWidth - viewportMargin * 2);
      const left = Math.max(
        viewportMargin,
        Math.min(bounds.left, window.innerWidth - width - viewportMargin)
      );
      const maxHeight = Math.min(desiredMaxHeight, availableHeight);
      const preferredTop = openAbove
        ? bounds.top - maxHeight - menuGap
        : bounds.bottom + menuGap;
      const top = Math.max(
        viewportMargin,
        Math.min(preferredTop, window.innerHeight - maxHeight - viewportMargin)
      );

      setCourseDropdownPosition({ top, left, width, maxHeight });
    }

    updateDropdownPosition();
    window.addEventListener('resize', updateDropdownPosition);
    window.addEventListener('scroll', updateDropdownPosition, true);
    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
      window.removeEventListener('scroll', updateDropdownPosition, true);
    };
  }, [isCourseDropdownOpen]);

  const activity = generateActivityHeatmap(14);

  const activeGaps = skillDomains
    .flatMap((d) => d.competencies)
    .filter((c) => c.mastery < 55).length;

  const targetCompletionPct = Math.round(
    (
      courseCompletion.completed /
      (
        courseCompletion.completed +
        courseCompletion.inProgress +
        courseCompletion.recommended
      )
    ) * 100
  );

  // Real-time smooth loading animation states
  const [animatedPct, setAnimatedPct] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 1200; // Animation duration in milliseconds

    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out expo for a professional fluid motion
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setAnimatedPct(Math.round(easedProgress * targetCompletionPct));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    const animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [targetCompletionPct]);

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 17
        ? 'Good afternoon'
        : 'Good evening';

  const firstName = user?.name?.split(' ')[0];
  const visibleDisciplineLog = disciplineLog.filter((log, index, entries) => {
    if (log.label !== 'Daily login') return true;

    const logDate = log.date?.slice(0, 10);
    return entries.findIndex((entry) =>
      entry.label === 'Daily login' &&
      (entry.date?.slice(0, 10) || null) === (logDate || null)
    ) === index;
  }).slice(0, 5);

  if (isInitialLoading) return <DashboardLoadingSkeleton />;

  return (
    <div>

      {/* =========================================================
          HERO
      ========================================================= */}

      <Card
        style={{
          marginBottom: 'var(--space-4)',
          background:
            'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          color: '#fff'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20
          }}
        >
          <div>
            <h1
              className="text-page-heading"
              style={{
                color: '#fff',
                marginBottom: 6
              }}
            >
              {greeting}, {firstName}.
            </h1>

            <p
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: 15
              }}
            >
              Your personalised competency journey is progressing.
            </p>

            <div
              style={{
                display: 'flex',
                gap: 16,
                marginTop: 14,
                flexWrap: 'wrap'
              }}
            >
              <span style={{ fontSize: 13.5 }}>
                {user?.designation}
              </span>

              <span
                style={{
                  fontSize: 13.5,
                  opacity: 0.7
                }}
              >
                ·
              </span>

              <span style={{ fontSize: 13.5 }}>
                {user?.department}
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Button
              onClick={() => navigate('/roadmap')}
              style={{
                background: '#fff'
              }}
            >
              Continue roadmap
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </Card>
{/* =========================================================
          STAT CARDS (Professional Enterprise Redesign)
      ========================================================= */}

      <div className="corporate-stats-grid">
        <div className="corporate-stat-card">
          <div className="corporate-stat-icon-wrapper flame-bg">
            <Flame size={20} />
          </div>
          <div className="corporate-stat-content">
            <span className="corporate-stat-label">Discipline score</span>
            <div className="corporate-stat-main">
              <span className="corporate-stat-value">{disciplineScore}</span>
              <span className="corporate-stat-sub positive">
                {disciplineLog[0]
                  ? `${disciplineLog[0].delta > 0 ? '+' : ''}${disciplineLog[0].delta} ${disciplineLog[0].label}`
                  : 'No recent activity'}
              </span>
            </div>
          </div>
        </div>

        <div className="corporate-stat-card">
          <div className="corporate-stat-icon-wrapper course-bg">
            <BookOpenCheck size={20} />
          </div>
          <div className="corporate-stat-content">
            <span className="corporate-stat-label">Courses completed</span>
            <div className="corporate-stat-main">
              <span className="corporate-stat-value">{courseCompletion.completed}</span>
              <span className="corporate-stat-sub neutral">{courseCompletion.inProgress} in progress</span>
            </div>
          </div>
        </div>

        <div className="corporate-stat-card">
          <div className="corporate-stat-icon-wrapper quiz-bg">
            <TrendingUp size={20} />
          </div>
          <div className="corporate-stat-content">
            <span className="corporate-stat-label">Latest quiz score</span>
            <div className="corporate-stat-main">
              <span className="corporate-stat-value">{quizHistory[quizHistory.length - 1].score}%</span>
              <span className="corporate-stat-sub neutral">Most recent attempt</span>
            </div>
          </div>
        </div>

        <div className="corporate-stat-card">
          <div className="corporate-stat-icon-wrapper gap-bg">
            <Target size={20} />
          </div>
          <div className="corporate-stat-content">
            <span className="corporate-stat-label">Active skill gaps</span>
            <div className="corporate-stat-main">
              <span className="corporate-stat-value">{activeGaps}</span>
              <span className="corporate-stat-sub warning">Below 55% mastery</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .corporate-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: var(--space-4);
        }

        .corporate-stat-card {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          transition: all 0.2s ease;
        }

        .corporate-stat-card:hover {
          border-color: rgba(234, 88, 12, 0.3);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
          transform: translateY(-2px);
        }

        .corporate-stat-icon-wrapper {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .flame-bg { background: rgba(234, 88, 12, 0.08); color: #ea580c; }
        .course-bg { background: rgba(37, 99, 235, 0.08); color: #2563eb; }
        .quiz-bg { background: rgba(16, 185, 129, 0.08); color: #10b981; }
        .gap-bg { background: rgba(217, 119, 6, 0.08); color: #d97706; }

        .corporate-stat-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow: hidden;
        }

        .corporate-stat-label {
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
          white-space: nowrap;
        }

        .corporate-stat-main {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .corporate-stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .corporate-stat-sub {
          font-size: 11.5px;
          font-weight: 500;
        }

        .corporate-stat-sub.positive { color: #16a34a; }
        .corporate-stat-sub.neutral { color: #64748b; }
        .corporate-stat-sub.warning { color: #d97706; }

        @media (max-width: 1100px) {
          .corporate-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .corporate-stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* =========================================================
          DISCIPLINE ACTIVITY + COURSE COMPLETION
      ========================================================= */}

      <div
        className="grid grid-3"
        style={{
          marginBottom: 'var(--space-4)',
          alignItems: 'stretch'
        }}
      >

        {/* =====================================================
            DISCIPLINE SCORE ACTIVITY
        ===================================================== */}

        <Card
          style={{
            gridColumn: 'span 2'
          }}
        >

          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 18
            }}
          >
            <h3
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                margin: 0
              }}
            >
              Discipline score activity
            </h3>

            <Award
              size={22}
              strokeWidth={2.2}
              color="var(--color-orange)"
            />
          </div>


          {/* Heatmap */}
          <ActivityHeatmap days={activity} />


          {/* ===================================================
              DISCIPLINE ACTIVITY LOG
          =================================================== */}

          <div
            style={{
              display: 'flex',
              gap: 24,
              marginTop: 18,
              paddingTop: 16,
              flexWrap: 'wrap',
              borderTop:
                '1px solid rgba(15, 23, 42, 0.10)'
            }}
          >
            {visibleDisciplineLog
              .map((log, index) => {

                const isPositive = log.delta > 0;
                const isNegative = log.delta < 0;

                return (
                  <div
                    key={`${log.date || 'activity'}-${index}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#475569',
                      lineHeight: 1.4
                    }}
                  >

                    {/* Score */}
                    <strong
                      style={{
                        fontSize: '15px',
                        fontWeight: 900,
                        color: isNegative
                          ? '#dc2626'
                          : '#16a34a'
                      }}
                    >
                      {log.delta > 0 ? '+' : ''}
                      {log.delta}
                    </strong>

                    {/* Activity label */}
                    <span>
                      {log.label}
                    </span>

                  </div>
                );
              })}
            <div
              aria-label="Inactivity penalty example, not a recorded activity"
              title="Example only; this is not a recorded activity."
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                fontSize: '14px',
                fontWeight: 700,
                color: '#475569',
                lineHeight: 1.4
              }}
            >
              <strong style={{ fontSize: '15px', fontWeight: 900, color: '#dc2626' }}>
                -1
              </strong>
              <span>No login for 7 days</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>
                
              </span>
            </div>
          </div>

        </Card>


        {/* =====================================================
            COURSE COMPLETION (Real-Time Animated Telemetry)
        ===================================================== */}

        <Card className="corporate-progress-card" style={{ overflow: 'hidden' }}>
          <div className="corporate-card-header">
            <span className="corporate-card-title">Course Completion</span>
            <BookOpenCheck size={18} className="corporate-header-icon" />
          </div>

          <div className="corporate-progress-ring-container">
            <CircularProgress
              value={selectedCourseMastery ?? animatedPct}
              label={`${selectedCourseMastery ?? animatedPct}%`}
              sublabel={selectedCourseMastery === null ? 'Overall' : 'Mastery'}
            />
          </div>

          <div className="corporate-metrics-list">
            <div className="corporate-metric-row">
              <span className="corporate-metric-label">
                <span className="corporate-dot completed-dot"></span>
                Completed
              </span>
              <span className="corporate-metric-value">{displayedCourseCounts.completed}</span>
            </div>

            <div>
              <div style={{ position: 'relative' }} ref={courseDropdownRef}>
                <div className="corporate-metric-row">
                  <span className="corporate-metric-label">
                    <span className="corporate-dot active-dot"></span>
                    In progress
                  </span>
                  <span className="corporate-metric-value">{displayedCourseCounts.inProgress}</span>
                </div>

                <button
                  className="in-progress-course-trigger"
                  type="button"
                  aria-expanded={isCourseDropdownOpen}
                  aria-haspopup="menu"
                  aria-controls="in-progress-course-list"
                  ref={courseDropdownTriggerRef}
                  onClick={() => setIsCourseDropdownOpen((open) => !open)}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowDown' && !isCourseDropdownOpen) {
                      event.preventDefault();
                      setIsCourseDropdownOpen(true);
                      window.requestAnimationFrame(() => {
                        courseDropdownMenuRef.current?.querySelector('.in-progress-course-option')?.focus();
                      });
                    }
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    marginTop: 8,
                    padding: '8px 10px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 6,
                    background: '#fff',
                    color: 'var(--color-text)',
                    font: 'inherit',
                    cursor: 'pointer',
                    textAlign: 'left',
                    minWidth: 0
                  }}
                  >
                  <span style={{ overflowWrap: 'anywhere' }}>
                    {selectedCourseId === 'all' ? 'All' : selectedCourse?.title ?? 'All'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    {isCourseDropdownOpen
                      ? <ChevronUp size={15} aria-hidden="true" />
                      : <ChevronDown size={15} aria-hidden="true" />}
                  </span>
                </button>

              </div>
              {isCourseDropdownOpen && courseDropdownPosition && createPortal(
                <div
                  ref={courseDropdownMenuRef}
                  id="in-progress-course-list"
                  role="menu"
                  aria-label="Courses in progress"
                  onKeyDown={(event) => {
                    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
                    event.preventDefault();
                    const options = Array.from(
                      courseDropdownMenuRef.current?.querySelectorAll('.in-progress-course-option') ?? []
                    );
                    if (!options.length) return;

                    const currentIndex = options.indexOf(document.activeElement);
                    const direction = event.key === 'ArrowDown' ? 1 : -1;
                    const nextIndex = (currentIndex + direction + options.length) % options.length;
                    options[nextIndex].focus();
                  }}
                  style={{
                    position: 'fixed',
                    top: courseDropdownPosition.top,
                    left: courseDropdownPosition.left,
                    width: courseDropdownPosition.width,
                    zIndex: 1200,
                    maxHeight: courseDropdownPosition.maxHeight,
                    overflowY: 'auto',
                    padding: 6,
                    background: '#fff',
                    border: '1px solid var(--color-border)',
                    borderRadius: 6,
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)'
                  }}
                >
                  <button
                    className="in-progress-course-option"
                    type="button"
                    role="menuitemradio"
                    aria-checked={selectedCourseId === 'all'}
                    onClick={() => {
                      setSelectedCourseId('all');
                      setIsCourseDropdownOpen(false);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px 10px',
                      border: 0,
                      borderRadius: 4,
                      background: selectedCourseId === 'all' ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                      color: 'var(--color-text)',
                      font: 'inherit',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    All
                  </button>
                  {inProgressCourses.map(({ course }) => (
                    <button
                      key={course.id}
                      className="in-progress-course-option"
                      type="button"
                      role="menuitemradio"
                      aria-checked={course.id === selectedCourseId}
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        setIsCourseDropdownOpen(false);
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '8px 10px',
                        border: 0,
                        borderRadius: 4,
                        background: course.id === selectedCourseId
                          ? 'rgba(37, 99, 235, 0.08)'
                          : 'transparent',
                        color: 'var(--color-text)',
                        font: 'inherit',
                        textAlign: 'left',
                        cursor: 'pointer',
                        whiteSpace: 'normal',
                        overflowWrap: 'anywhere'
                      }}
                    >
                      {course.title}
                    </button>
                  ))}
                </div>,
                document.body
              )}

            </div>

            <div className="corporate-metric-row">
              <span className="corporate-metric-label">
                <span className="corporate-dot recommended-dot"></span>
                Recommended
              </span>
              <span className="corporate-metric-value">{displayedCourseCounts.recommended}</span>
            </div>
          </div>
        </Card>

      </div>


      {/* =========================================================
          SKILL PASSPORT + QUIZ TREND
      ========================================================= */}

      <div className="skill-passport-analytics-layout">
        <SkillPassport embedded />
        <div className="skill-passport-analytics-row">
          <Card>
            <h3 className="text-card-heading" style={{ marginBottom: 10 }}>Quiz trend</h3>
            <QuizTrendChart data={quizHistory} />
          </Card>
          <ScenarioAssessmentAnalytics
            completedScenarioAssessments={completedScenarioAssessments}
            attempts={scenarioAssessmentAttempts}
          />
        </div>
      </div>

      <style>{`
        .skill-passport-analytics-layout { display: grid; gap: var(--space-3); }
        .skill-passport-analytics-row { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(300px, 0.8fr); gap: var(--space-3); align-items: start; }
        .skill-passport-analytics-row > .scenario-analytics-grid { display: contents; }
        .skill-passport-analytics-row > .scenario-analytics-grid .scenario-donut-card { grid-column: 2; grid-row: 1; }
        .skill-passport-analytics-row > .scenario-analytics-grid .scenario-trend-card { grid-column: 1 / -1; grid-row: 2; }
        @media (max-width: 760px) { .skill-passport-analytics-row { grid-template-columns: 1fr; } .skill-passport-analytics-row > .scenario-analytics-grid .scenario-donut-card, .skill-passport-analytics-row > .scenario-analytics-grid .scenario-trend-card { grid-column: 1; grid-row: auto; } }

        .corporate-progress-card {
          background: #ffffff !important;
          border: 1px solid rgba(15, 23, 42, 0.08) !important;
          border-radius: 16px !important;
          padding: 24px !important;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
        }

        .corporate-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 12px;
        }

        .corporate-card-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.01em;
        }

        .corporate-header-icon {
          color: #64748b;
        }

        .corporate-progress-ring-container {
          margin: 12px 0 16px 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .corporate-metrics-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          border-top: 1px solid #f1f5f9;
          padding-top: 14px;
        }

        .corporate-metric-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13.5px;
        }

        .corporate-metric-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #475569;
          font-weight: 500;
        }

        .corporate-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .completed-dot { background: #16a34a; }
        .active-dot { background: #2563eb; }
        .recommended-dot { background: #d97706; }

        .corporate-metric-value {
          font-weight: 600;
          color: #0f172a;
        }

        .in-progress-course-trigger:focus-visible,
        .in-progress-course-option:focus-visible {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}