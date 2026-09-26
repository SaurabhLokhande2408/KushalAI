import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, BarChart3, Lock, Sparkles } from 'lucide-react';
import Drawer from '../common/Drawer';
import { Button, ProgressBar, StatusBadge, Badge } from '../common/UI';
import UploadDropzone from './UploadDropzone';
import { getQuizByCourseId } from '../../data/mockQuizzes';
import { useApp } from '../../context/AppContext';

const PROCESSING_STEPS = ['Reading material...', 'Extracting concepts...', 'Generating questions...', 'Preparing assessment...'];

export default function CourseDrawer({ node, course, prereqTitles, open, onClose }) {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [quizReady, setQuizReady] = useState(false);

  if (!course || !node) return null;

  const isLocked = node.status === 'locked';
  const gap = Math.max(0, course.requiredMastery - course.currentMastery);

  function resetUploadState() {
    setFile(null);
    setProcessing(false);
    setStepIndex(0);
    setQuizReady(false);
  }

  function handleClose() {
    resetUploadState();
    onClose();
  }

  function generateQuiz() {
    setProcessing(true);
    setStepIndex(0);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setStepIndex(i);
      if (i >= PROCESSING_STEPS.length) {
        clearInterval(interval);
        setProcessing(false);
        setQuizReady(true);
      }
    }, 650);
  }

  function goToQuiz() {
    handleClose();
    navigate(`/quiz/${course.id}`);
  }

  const existingQuiz = getQuizByCourseId(course.id);

  return (
    <Drawer open={open} onClose={handleClose} title={course.title}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
        <Badge tone="neutral">{course.source}</Badge>
        <Badge tone="neutral">Synthetic demo dataset</Badge>
        <StatusBadge status={node.status} label={node.status === 'current' ? 'Current focus' : node.status} />
      </div>

      <p className="text-body" style={{ marginBottom: 'var(--space-3)' }}>{course.description}</p>

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-3)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Clock size={16} color="var(--color-secondary)" />
          <span className="text-meta">{course.estTime}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <BarChart3 size={16} color="var(--color-secondary)" />
          <span className="text-meta">{course.difficulty}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Sparkles size={16} color="var(--color-secondary)" />
          <span className="text-meta">{course.skill}</span>
        </div>
      </div>

      {isLocked && (
        <div className="card" style={{ background: 'var(--color-locked-bg)', marginBottom: 'var(--space-3)', display: 'flex', gap: 10 }}>
          <Lock size={18} color="var(--color-locked)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Locked</div>
            <p className="text-meta">
              Complete {prereqTitles?.length ? prereqTitles.join(' and ') : 'the prerequisite courses'} to unlock this course.
            </p>
          </div>
        </div>
      )}

      <Card_WhyRecommended course={course} gap={gap} />

      <div style={{ marginTop: 'var(--space-3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span className="text-meta" style={{ fontWeight: 600 }}>Progress toward required mastery</span>
          <span className="text-meta">{course.currentMastery}% / {course.requiredMastery}%</span>
        </div>
        <ProgressBar value={(course.currentMastery / course.requiredMastery) * 100} />
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 'var(--space-4)', flexWrap: 'wrap' }}>
        <Button
          disabled={isLocked}
          onClick={() => showToast(`Opening "${course.title}" on ${course.source} (demo link).`, 'info')}
        >
          Go to course
        </Button>
        {existingQuiz && (
          <Button variant="secondary" disabled={isLocked} onClick={goToQuiz}>
            Start quiz
          </Button>
        )}
      </div>

      {!isLocked && (
        <div style={{ marginTop: 'var(--space-5)' }}>
          <h3 className="text-card-heading" style={{ marginBottom: 10 }}>Upload material to generate quiz</h3>
          <p className="text-meta" style={{ marginBottom: 12 }}>Generate a short assessment grounded in your own study material.</p>

          {!quizReady && <UploadDropzone file={file} onFileSelected={setFile} onClear={() => setFile(null)} />}

          {file && !processing && !quizReady && (
            <Button block style={{ marginTop: 12 }} onClick={generateQuiz}>
              Generate MCQs
            </Button>
          )}

          {processing && (
            <div className="card" style={{ marginTop: 12, textAlign: 'center' }}>
              <div className="text-meta" style={{ fontWeight: 600 }}>{PROCESSING_STEPS[Math.min(stepIndex, PROCESSING_STEPS.length - 1)]}</div>
              <ProgressBar value={((stepIndex + 1) / PROCESSING_STEPS.length) * 100} />
            </div>
          )}

          {quizReady && (
            <div className="card" style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontWeight: 700 }}>Quiz ready</div>
                <span className="text-meta">Generated from uploaded material</span>
              </div>
              <Button onClick={goToQuiz}>Start quiz</Button>
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
}

function Card_WhyRecommended({ course, gap }) {
  return (
    <div className="card" style={{ background: 'var(--color-offwhite)' }}>
      <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>Why this was recommended</div>
      <div className="grid grid-2" style={{ gap: 10 }}>
        <Info label="Required competency" value={course.skill} />
        <Info label="Current mastery" value={`${course.currentMastery}%`} />
        <Info label="Required mastery" value={`${course.requiredMastery}%`} />
        <Info label="Current gap" value={`${gap}%`} />
      </div>
      <p className="text-meta" style={{ marginTop: 10 }}>{course.reason}</p>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div className="text-meta">{label}</div>
      <div style={{ fontWeight: 600, fontSize: 14 }}>{value}</div>
    </div>
  );
}
