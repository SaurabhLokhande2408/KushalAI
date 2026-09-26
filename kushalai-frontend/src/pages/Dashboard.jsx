import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, BookOpenCheck, Target, Flame, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, Button, StatCard, CircularProgress, ProgressBar, StatusBadge } from '../components/common/UI';
import ActivityHeatmap from '../components/dashboard/ActivityHeatmap';
import QuizTrendChart from '../components/dashboard/QuizTrendChart';
import { useApp } from '../context/AppContext';
import { skillDomains, domainAverage, statusFromMastery } from '../data/mockSkills';
import { generateActivityHeatmap } from '../data/mockQuizzes';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, disciplineScore, disciplineLog, quizHistory, courseCompletion, roadmap } = useApp();
  const activity = generateActivityHeatmap(14);
  const activeGaps = skillDomains.flatMap((d) => d.competencies).filter((c) => c.mastery < 55).length;
  const completionPct = Math.round((courseCompletion.completed / (courseCompletion.completed + courseCompletion.inProgress + courseCompletion.recommended)) * 100);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0];

  return (
    <div>
      <Card style={{ marginBottom: 'var(--space-4)', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h1 className="text-page-heading" style={{ color: '#fff', marginBottom: 6 }}>{greeting}, {firstName}.</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15 }}>Your personalised competency journey is progressing.</p>
            <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13.5 }}>{user?.designation}</span>
              <span style={{ fontSize: 13.5, opacity: 0.7 }}>·</span>
              <span style={{ fontSize: 13.5 }}>{user?.department}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button onClick={() => navigate('/roadmap')} style={{ background: '#fff' }}>
              Continue roadmap <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-4" style={{ marginBottom: 'var(--space-4)' }}>
        <StatCard icon={<Flame size={20} />} label="Discipline score" value={disciplineScore} sub={`${disciplineLog[0]?.delta > 0 ? '+' : ''}${disciplineLog[0]?.delta} ${disciplineLog[0]?.label}`} />
        <StatCard icon={<BookOpenCheck size={20} />} label="Courses completed" value={courseCompletion.completed} sub={`${courseCompletion.inProgress} in progress`} />
        <StatCard icon={<TrendingUp size={20} />} label="Latest quiz score" value={`${quizHistory[quizHistory.length - 1].score}%`} sub="Most recent attempt" />
        <StatCard icon={<Target size={20} />} label="Active skill gaps" value={activeGaps} sub="Below 55% mastery" />
      </div>

      <div className="grid grid-3" style={{ marginBottom: 'var(--space-4)', alignItems: 'stretch' }}>
        <Card style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 className="text-card-heading">Discipline score activity</h3>
            <Award size={20} color="var(--color-orange)" />
          </div>
          <ActivityHeatmap days={activity} />
          <div style={{ display: 'flex', gap: 18, marginTop: 16, flexWrap: 'wrap' }}>
            {disciplineLog.slice(0, 3).map((l, i) => (
              <span key={i} className="text-meta">
                {l.delta > 0 ? '+' : ''}{l.delta} {l.label}
              </span>
            ))}
          </div>
        </Card>
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <CircularProgress value={completionPct} label={`${completionPct}%`} sublabel="Course completion" />
          <div style={{ display: 'flex', gap: 14, marginTop: 4 }}>
            <span className="text-meta">{courseCompletion.completed} completed</span>
            <span className="text-meta">{courseCompletion.inProgress} in progress</span>
          </div>
          <span className="text-meta">{courseCompletion.recommended} recommended</span>
        </Card>
      </div>

      <div className="grid grid-3" style={{ alignItems: 'stretch' }}>
        <Card style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <h3 className="text-card-heading">Skill Passport</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/skills')}>View full passport</Button>
          </div>
          <div className="grid grid-2" style={{ marginTop: 10 }}>
            {skillDomains.map((d) => {
              const avg = domainAverage(d);
              return (
                <div key={d.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{d.name}</span>
                    <StatusBadge status={statusFromMastery(avg)} />
                  </div>
                  <ProgressBar value={avg} />
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <h3 className="text-card-heading" style={{ marginBottom: 10 }}>Quiz trend</h3>
          <QuizTrendChart data={quizHistory} />
        </Card>
      </div>
    </div>
  );
}
