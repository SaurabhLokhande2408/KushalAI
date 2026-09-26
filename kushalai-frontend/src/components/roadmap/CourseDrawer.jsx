import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock3,
  BarChart3,
  Lock,
  Sparkles,
  ArrowUpRight,
  BookOpen,
  Target,
  X,
} from 'lucide-react';

import Drawer from '../common/Drawer';
import { Button, ProgressBar, StatusBadge, Badge } from '../common/UI';
import UploadDropzone from './UploadDropzone';
import { getQuizByCourseId } from '../../data/mockQuizzes';
import { useApp } from '../../context/AppContext';
import { useGuidance } from '../../context/GuidanceContext';

const PROCESSING_STEPS = [
  'Uploading material...',
  'Reading document...',
  'Extracting concepts...',
  'Preparing your guidance workspace...',
];

export default function CourseDrawer({
  node,
  course,
  prereqTitles,
  open,
  onClose,
}) {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const { createConversation } = useGuidance();

  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const processingIntervalRef = useRef(null);
  const navigationTimeoutRef = useRef(null);

  useEffect(() => () => {
    if (processingIntervalRef.current) {
      window.clearInterval(processingIntervalRef.current);
    }
    if (navigationTimeoutRef.current) {
      window.clearTimeout(navigationTimeoutRef.current);
    }
  }, []);

  if (!course || !node) return null;

  const isLocked = node.status === 'locked';

  const gap = Math.max(
    0,
    course.requiredMastery - course.currentMastery
  );

  const progress =
    course.requiredMastery > 0
      ? Math.min(
          100,
          (course.currentMastery / course.requiredMastery) * 100
        )
      : 0;

  function resetUploadState() {
    if (processingIntervalRef.current) {
      window.clearInterval(processingIntervalRef.current);
      processingIntervalRef.current = null;
    }
    if (navigationTimeoutRef.current) {
      window.clearTimeout(navigationTimeoutRef.current);
      navigationTimeoutRef.current = null;
    }
    setFile(null);
    setProcessing(false);
    setStepIndex(0);
    setUploadProgress(0);
  }

  function handleClose() {
    resetUploadState();
    onClose();
  }

  function prepareGuidanceWorkspace() {
    if (!file || processing) return;

    setProcessing(true);
    setStepIndex(0);
    setUploadProgress(0);

    let phase = 0;

    processingIntervalRef.current = window.setInterval(() => {
      phase += 1;
      setUploadProgress(Math.min(phase * 25, 100));

      if (phase < PROCESSING_STEPS.length) {
        setStepIndex(phase);
      } else {
        window.clearInterval(processingIntervalRef.current);
        processingIntervalRef.current = null;

        navigationTimeoutRef.current = window.setTimeout(() => {
          navigationTimeoutRef.current = null;
          createConversation({
            material: {
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
              courseId: course.id,
              courseTitle: course.title,
            }
          });
          navigate('/doubts-guidance');
        }, 160);
      }
    }, 600);
  }

  function goToQuiz() {
    handleClose();
    navigate(`/quiz/${course.id}`);
  }

  function goToCourse() {
    window.open(
      'https://igotkarmayogi.gov.in/',
      '_blank',
      'noopener,noreferrer'
    );
  }

  const existingQuiz = getQuizByCourseId(course.id);

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      title={course.title}
    >
      <div className="course-drawer">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="course-hero">

          <div className="course-hero-top">

            <div className="course-eyebrow">
              <span className="course-eyebrow-dot" />
              COMPETENCY ROADMAP
            </div>

            <button
              className="course-close-mobile"
              onClick={handleClose}
              aria-label="Close"
            >
              <X size={20} />
            </button>

          </div>

          <h1 className="course-title">
            {course.title}
          </h1>

          <div className="course-source-row">

            <Badge tone="neutral">
              {course.source}
            </Badge>

            <Badge tone="neutral">
              Synthetic demo dataset
            </Badge>

            <StatusBadge
              status={node.status}
              label={
                node.status === 'current'
                  ? 'Current focus'
                  : node.status
              }
            />

          </div>

          <p className="course-description">
            {course.description}
          </p>

        </section>


        {/* =====================================================
            COURSE META
        ===================================================== */}

        <section className="course-meta-grid">

          <MetaItem
            icon={<Clock3 />}
            label="Estimated time"
            value={course.estTime}
          />

          <MetaItem
            icon={<BarChart3 />}
            label="Difficulty"
            value={course.difficulty}
          />

          <MetaItem
            icon={<Sparkles />}
            label="Skill"
            value={course.skill}
          />

        </section>


        {/* =====================================================
            LOCKED STATE
        ===================================================== */}

        {isLocked && (
          <section className="course-locked">

            <div className="course-locked-icon">
              <Lock size={21} />
            </div>

            <div className="course-locked-content">

              <div className="course-section-kicker">
                COURSE LOCKED
              </div>

              <h3>
                Complete the prerequisites first
              </h3>

              <p>
                Complete{' '}
                {prereqTitles?.length
                  ? prereqTitles.join(' and ')
                  : 'the prerequisite courses'}{' '}
                to unlock this course.
              </p>

            </div>

          </section>
        )}


        {/* =====================================================
            WHY RECOMMENDED
        ===================================================== */}

        <section className="course-section">

          <div className="course-section-header">

            <div>
              <div className="course-section-kicker">
                LEARNING PRIORITY
              </div>

              <h2>
                Why this was recommended
              </h2>
            </div>

            <Target
              className="course-section-icon"
              size={23}
            />

          </div>

          <div className="course-insight-grid">

            <Insight
              label="Required competency"
              value={course.skill}
            />

            <Insight
              label="Current mastery"
              value={`${course.currentMastery}%`}
            />

            <Insight
              label="Required mastery"
              value={`${course.requiredMastery}%`}
            />

            <Insight
              label="Current gap"
              value={`${gap}%`}
              accent
            />

          </div>

          <p className="course-reason">
            {course.reason}
          </p>

        </section>


        {/* =====================================================
            PROGRESS
        ===================================================== */}

        <section className="course-progress-section">

          <div className="course-section-header">

            <div>
              <div className="course-section-kicker">
                YOUR PROGRESS
              </div>

              <h2>
                Progress toward required mastery
              </h2>
            </div>

            <div className="course-progress-value">
              {course.currentMastery}%
              <span>
                / {course.requiredMastery}%
              </span>
            </div>

          </div>

          <div className="course-progress-track">
            <div
              className="course-progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="course-progress-footer">
            <span>
              Current mastery
            </span>

            <span>
              {course.requiredMastery -
                course.currentMastery >
              0
                ? `${
                    course.requiredMastery -
                    course.currentMastery
                  }% to target`
                : 'Target reached'}
            </span>
          </div>

        </section>


        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <section className="course-actions">

          <Button
            disabled={isLocked}
            onClick={goToCourse}
          >
            <span>Go to course</span>
            <ArrowUpRight size={17} />
          </Button>

          {existingQuiz && (
            <Button
              variant="secondary"
              disabled={isLocked}
              onClick={goToQuiz}
            >
              <BookOpen size={17} />
              Start quiz
            </Button>
          )}

        </section>


        {/* =====================================================
            UPLOAD MATERIAL
        ===================================================== */}

        {!isLocked && (
          <section className="course-material-section">

            <div className="course-material-heading">

              <div className="course-material-number">
                01
              </div>

              <div>

                <div className="course-section-kicker">
                  PERSONAL ASSESSMENT
                </div>

                <h2>
                  Generate a quiz from your material
                </h2>

                <p>
                  Upload your own study material and create
                  a short assessment grounded in it.
                </p>

              </div>

            </div>


            {!processing && (
              <UploadDropzone
                file={file}
                onFileSelected={setFile}
                onClear={() => setFile(null)}
              />
            )}


            {file && !processing && (
              <Button
                block
                style={{ marginTop: 16 }}
                onClick={prepareGuidanceWorkspace}
              >
                Prepare guidance workspace
              </Button>
            )}


            {processing && (
              <div className="course-processing">

                <div className="course-processing-top">

                  <div className="course-processing-icon">
                    <Sparkles size={18} />
                  </div>

                  <div>

                    <div className="course-processing-title">
                      {
                        PROCESSING_STEPS[
                          Math.min(
                            stepIndex,
                            PROCESSING_STEPS.length - 1
                          )
                        ]
                      }
                    </div>

                    <div className="course-processing-meta">
                      Step {stepIndex + 1} of {PROCESSING_STEPS.length}
                    </div>

                  </div>

                </div>

                <ProgressBar
                  value={uploadProgress}
                />

              </div>
            )}


          </section>
        )}

      </div>

      <style>{`

        /* =====================================================
           COURSE DRAWER
        ===================================================== */

        .course-drawer {
          color: var(--color-text);
          padding-bottom: 32px;
        }


        /* =====================================================
           HERO
        ===================================================== */

        .course-hero {
          padding: 6px 0 32px;
          border-bottom: 1px solid rgba(18, 63, 115, 0.10);
        }

        .course-hero-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .course-eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;
          color: var(--color-secondary);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .course-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ea580c;
          flex-shrink: 0;
        }

        .course-title {
          margin: 0;
          max-width: 650px;
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1.02;
          letter-spacing: -0.045em;
          font-weight: 800;
          color: #10233f;
        }

        .course-source-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 20px;
        }

        .course-description {
          max-width: 680px;
          margin: 22px 0 0;
          font-size: 18px;
          line-height: 1.65;
          color: #52647a;
        }

        .course-close-mobile {
          display: none;
          border: 0;
          background: transparent;
          color: #52647a;
          cursor: pointer;
          padding: 6px;
        }


        /* =====================================================
           META
        ===================================================== */

        .course-meta-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 0;
          margin: 0 0 34px;
          border-bottom: 1px solid rgba(18, 63, 115, 0.10);
        }

        .course-meta-item {
          padding: 23px 20px 23px 0;
          border-right: 1px solid rgba(18, 63, 115, 0.10);
        }

        .course-meta-item:not(:first-child) {
          padding-left: 20px;
        }

        .course-meta-item:last-child {
          border-right: 0;
        }

        .course-meta-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          margin-bottom: 12px;
          border-radius: 10px;
          background: #f3f6fa;
          color: var(--color-secondary);
        }

        .course-meta-icon svg {
          width: 18px;
          height: 18px;
        }

        .course-meta-label {
          margin-bottom: 5px;
          color: #7a8898;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .course-meta-value {
          color: #162b47;
          font-size: 17px;
          line-height: 1.3;
          font-weight: 750;
        }


        /* =====================================================
           LOCKED
        ===================================================== */

        .course-locked {
          display: flex;
          gap: 18px;
          padding: 22px;
          margin-bottom: 34px;
          border-left: 4px solid #8c98a7;
          background: #f3f5f7;
        }

        .course-locked-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          flex: 0 0 44px;
          border-radius: 50%;
          background: #e4e8ed;
          color: #697686;
        }

        .course-section-kicker {
          margin-bottom: 7px;
          color: var(--color-secondary);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .course-locked h3 {
          margin: 0;
          color: #172b46;
          font-size: 18px;
          line-height: 1.25;
        }

        .course-locked p {
          margin: 8px 0 0;
          color: #647387;
          font-size: 15px;
          line-height: 1.55;
        }


        /* =====================================================
           SECTIONS
        ===================================================== */

        .course-section {
          padding: 0 0 34px;
          border-bottom: 1px solid rgba(18, 63, 115, 0.10);
        }

        .course-section-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .course-section-header h2 {
          margin: 0;
          color: #152a46;
          font-size: 23px;
          line-height: 1.2;
          letter-spacing: -0.025em;
          font-weight: 780;
        }

        .course-section-icon {
          color: #ea580c;
          flex-shrink: 0;
        }


        /* =====================================================
           INSIGHTS
        ===================================================== */

        .course-insight-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          border-top: 1px solid rgba(18, 63, 115, 0.10);
          border-left: 1px solid rgba(18, 63, 115, 0.10);
        }

        .course-insight {
          min-height: 92px;
          padding: 17px 18px;
          border-right: 1px solid rgba(18, 63, 115, 0.10);
          border-bottom: 1px solid rgba(18, 63, 115, 0.10);
          background: #fff;
        }

        .course-insight-label {
          margin-bottom: 8px;
          color: #7b8999;
          font-size: 12px;
          font-weight: 650;
        }

        .course-insight-value {
          color: #172c47;
          font-size: 18px;
          line-height: 1.3;
          font-weight: 780;
        }

        .course-insight-value.accent {
          color: #ea580c;
        }

        .course-reason {
          margin: 18px 0 0;
          color: #52647a;
          font-size: 15px;
          line-height: 1.65;
        }


        /* =====================================================
           PROGRESS
        ===================================================== */

        .course-progress-section {
          padding: 34px 0;
          border-bottom: 1px solid rgba(18, 63, 115, 0.10);
        }

        .course-progress-section
        .course-section-header {
          align-items: flex-end;
        }

        .course-progress-value {
          color: #1f559d;
          white-space: nowrap;
          font-size: 26px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: -0.035em;
        }

        .course-progress-value span {
          color: #8995a4;
          font-size: 15px;
          font-weight: 650;
        }

        .course-progress-track {
          width: 100%;
          height: 9px;
          overflow: hidden;
          background: #e9edf2;
          border-radius: 999px;
        }

        .course-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: #1f559d;
          transition: width 500ms ease;
        }

        .course-progress-footer {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 10px;
          color: #8190a0;
          font-size: 12px;
          font-weight: 600;
        }


        /* =====================================================
           ACTIONS
        ===================================================== */

        .course-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          padding: 30px 0 6px;
        }


        /* =====================================================
           MATERIAL
        ===================================================== */

        .course-material-section {
          margin-top: 32px;
          padding-top: 34px;
          border-top: 2px solid #172b46;
        }

        .course-material-heading {
          display: flex;
          gap: 16px;
          margin-bottom: 22px;
        }

        .course-material-number {
          color: #ea580c;
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            monospace;
          font-size: 13px;
          font-weight: 800;
          padding-top: 5px;
        }

        .course-material-heading h2 {
          margin: 0;
          color: #152a46;
          font-size: 24px;
          line-height: 1.18;
          letter-spacing: -0.025em;
          font-weight: 780;
        }

        .course-material-heading p {
          max-width: 570px;
          margin: 8px 0 0;
          color: #647387;
          font-size: 15px;
          line-height: 1.55;
        }


        /* =====================================================
           PROCESSING
        ===================================================== */

        .course-processing {
          margin-top: 16px;
          padding: 20px;
          border: 1px solid rgba(31, 85, 157, 0.15);
          background: #f5f8fc;
        }

        .course-processing-top {
          display: flex;
          align-items: center;
          gap: 13px;
          margin-bottom: 16px;
        }

        .course-processing-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #e6eef9;
          color: #1f559d;
        }

        .course-processing-title {
          color: #182e4a;
          font-size: 15px;
          font-weight: 750;
        }

        .course-processing-meta {
          margin-top: 3px;
          color: #7a8898;
          font-size: 12px;
        }


        /* =====================================================
           QUIZ READY
        ===================================================== */

        .course-quiz-ready {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 16px;
          padding: 18px;
          border: 1px solid rgba(31, 85, 157, 0.15);
          background: #f6f9fc;
        }

        .course-quiz-ready-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          border-radius: 50%;
          background: #e4eef9;
          color: #1f559d;
        }

        .course-quiz-ready-copy {
          flex: 1;
          min-width: 140px;
        }

        .course-quiz-ready-title {
          color: #172c47;
          font-size: 16px;
          font-weight: 800;
        }

        .course-quiz-ready-text {
          margin-top: 3px;
          color: #7a8898;
          font-size: 13px;
        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 600px) {

          .course-close-mobile {
            display: block;
          }

          .course-title {
            font-size: 34px;
          }

          .course-description {
            font-size: 16px;
            line-height: 1.6;
          }

          .course-meta-grid {
            grid-template-columns: 1fr;
          }

          .course-meta-item,
          .course-meta-item:not(:first-child) {
            display: grid;
            grid-template-columns: 42px 1fr;
            column-gap: 12px;
            padding: 16px 0;
            border-right: 0;
            border-bottom: 1px solid rgba(18, 63, 115, 0.10);
          }

          .course-meta-item:last-child {
            border-bottom: 0;
          }

          .course-meta-icon {
            grid-row: span 2;
            margin: 0;
          }

          .course-meta-label {
            align-self: end;
          }

          .course-meta-value {
            align-self: start;
          }

          .course-insight-grid {
            grid-template-columns: 1fr;
          }

          .course-section-header h2,
          .course-material-heading h2 {
            font-size: 21px;
          }

          .course-progress-value {
            font-size: 22px;
          }

          .course-material-heading {
            gap: 10px;
          }

          .course-quiz-ready {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .course-quiz-ready .btn {
            width: 100%;
          }

        }

      `}</style>
    </Drawer>
  );
}


/* =========================================================
   META ITEM
========================================================= */

function MetaItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="course-meta-item">

      <div className="course-meta-icon">
        {icon}
      </div>

      <div className="course-meta-label">
        {label}
      </div>

      <div className="course-meta-value">
        {value}
      </div>

    </div>
  );
}


/* =========================================================
   INSIGHT
========================================================= */

function Insight({
  label,
  value,
  accent = false,
}) {
  return (
    <div className="course-insight">

      <div className="course-insight-label">
        {label}
      </div>

      <div
        className={`course-insight-value ${
          accent ? 'accent' : ''
        }`}
      >
        {value}
      </div>

    </div>
  );
}