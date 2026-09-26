import React from 'react';
import { ArrowRight, BookOpen, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MODES = [
  {
    label: '01 / GUIDANCE',
    title: 'Doubts & Guidance',
    description: 'Ask questions, clarify concepts, upload learning material, and continue your previous conversations.',
    action: 'OPEN GUIDANCE',
    path: '/doubts-guidance',
    icon: MessageCircle,
    className: 'learning-mode-guidance'
  },
  {
    label: '02 / APPLICATION',
    title: 'Scenario Based Assessment',
    description: 'Apply what you\'ve learned to realistic workplace situations and strengthen your practical decision-making skills.',
    action: 'START ASSESSMENT',
    path: '/scenario-assessment',
    icon: BookOpen,
    className: 'learning-mode-assessment'
  }
];

export default function LearningWorkspace() {
  const navigate = useNavigate();

  return (
    <div className="learning-workspace-page">
      <header className="learning-workspace-header">
        <div className="learning-workspace-rule" />
        <div className="text-meta learning-workspace-eyebrow">LEARNING WORKSPACE</div>
        <h1>Learning Workspace</h1>
        <p>Build practical knowledge through guided learning, real-world scenarios, and targeted practice.</p>
      </header>

      <section className="learning-mode-grid" aria-label="Learning modes">
        {MODES.map(({ icon: Icon, ...mode }) => (
          <article className={`learning-mode ${mode.className}`} key={mode.path}>
            <div className="learning-mode-topline">
              <span>{mode.label}</span>
              <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
            </div>
            <div className="learning-mode-copy">
              <h2>{mode.title}</h2>
              <p>{mode.description}</p>
            </div>
            <button type="button" className="learning-mode-action" onClick={() => navigate(mode.path)}>
              <span>{mode.action}</span>
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
