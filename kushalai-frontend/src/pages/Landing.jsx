import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDown, ArrowRight, ArrowUpRight, BarChart3, Check, Compass,
  FileText, Route, Target, MessageSquare, ClipboardCheck, Layers3,
  Gauge, CircleDot,
} from 'lucide-react';
import { getCourseById } from '../data/mockCourses';
import { roadmapNodes } from '../data/mockRoadmap';

const BLUE = '#123B66';
const BLUE_DARK = '#0B2947';
const ORANGE = '#ea580c';
const OFFWHITE = '#f7f3ed';
const WHITE = '#ffffff';
const INK = '#10243b';
const MUTED = '#667085';
const LINE = '#dfe5ea';

const SIH = {
  id: '26101',
  organisation: 'Ministry of Statistics & Programme Implementation',
  division: 'Data Informatics & Innovation Division',
  theme: 'Smart Education',
};

const reveal = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const roadmapStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const roadmapNodeReveal = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const ROADMAP_PREVIEW_CONFIG = [
  { number: '01', category: 'FOUNDATION', nodeIds: ['n1'] },
  { number: '02', category: 'CORE SKILLS', nodeIds: ['n2', 'n3'] },
  { number: '03', category: 'APPLICATION', nodeIds: ['n5'] },
  { number: '04', category: 'SPECIALISATION', nodeIds: ['n8'] },
  { number: '05', category: 'ROLE READINESS', nodeIds: ['n12'] },
];

const ROADMAP_PREVIEW_STAGES = ROADMAP_PREVIEW_CONFIG.map((stage) => {
  const nodes = stage.nodeIds
    .map((nodeId) => roadmapNodes.find((node) => node.id === nodeId))
    .filter(Boolean);
  const courses = nodes
    .map((node) => getCourseById(node.courseId))
    .filter(Boolean);
  const status = nodes.every((node) => node.status === 'completed')
    ? 'completed'
    : nodes.find((node) => node.status === 'current')?.status || nodes[0]?.status || 'locked';

  return {
    ...stage,
    title: courses.map((course) => course.title).join(' + '),
    status,
    statusLabel: status === 'completed' ? 'Complete' : status === 'current' ? 'In progress' : 'Locked',
  };
});

function ArrowLink({ children, to = '/register' }) {
  return (
    <Link to={to} className="landing-arrow-link">
      <span>{children}</span>
      <ArrowUpRight size={17} />
    </Link>
  );
}

function ArchitectureLine() {
  return (
    <svg className="architecture-line" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <marker id="landingArrow" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={ORANGE} />
        </marker>
      </defs>
      <g fill="none" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#landingArrow)">
        <path className="landing-draw-path" d="M 450,-50 C 420,300 480,650 450,980" />
        <path className="landing-draw-path landing-draw-delay-1" d="M 460,350 C 140,280 140,720 460,540" />
        <path className="landing-draw-path landing-draw-delay-2" d="M 460,450 C 860,450 890,780 560,940" />
        <path className="landing-draw-path landing-draw-delay-3" d="M -50,850 C 300,900 600,680 1020,750" />
      </g>
    </svg>
  );
}

function FlowStep({ number, title, text, accent = false }) {
  return (
    <motion.div variants={reveal} className="flow-step">
      <div className={`flow-number ${accent ? 'orange' : ''}`}>{number}</div>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </motion.div>
  );
}

function EngineCard({ number, icon, title, description, large = false }) {
  return (
    <motion.article variants={reveal} className={`engine-card ${large ? 'engine-card-large' : ''}`}>
      <div className="engine-top">
        <span className="engine-number">{number}</span>
        <div className="engine-icon">{icon}</div>
      </div>
      <div className="engine-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="engine-line"><span /></div>
      </div>
    </motion.article>
  );
}

function WorkspaceFeature({ title, description, points, children, reverse = false }) {
  return (
    <motion.div variants={reveal} className={`workspace-feature ${reverse ? 'reverse' : ''}`}>
      <div className="workspace-copy">
        <h3>{title}</h3>
        <p>{description}</p>
        <ul>
          {points.map((point) => (
            <li key={point}>
              <Check size={16} />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="workspace-visual">
        {children}
      </div>
    </motion.div>
  );
}

export default function Landing() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="landing-page">
      {/* GLOBAL ARCHITECTURAL BACKGROUND */}
      <div className="landing-background" aria-hidden="true">
        <div className="landing-grid" />
        <div className="landing-blue-block" />
        <div className="landing-orange-line landing-orange-line-1" />
        <div className="landing-orange-line landing-orange-line-2" />
        <div className="landing-cross landing-cross-1">+</div>
        <div className="landing-cross landing-cross-2">+</div>
      </div>

      {/* HERO */}
      <section className="hero-section">
        <ArchitectureLine />
        <div className="hero-content">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.h1 variants={reveal}>
              From <span className="hero-word-blue">capability gaps</span> to <span className="hero-word-orange">field readiness.</span>
            </motion.h1>
            <motion.p variants={reveal} className="hero-description">
              KushalAI is a competency driven learning platform designed to help public sector professionals identify what they need to learn, discover the right learning path, understand difficult material, and prove that knowledge through practical assessment.
            </motion.p>
            <motion.div variants={reveal} className="hero-actions">
              <Link to="/register" className="hero-primary">
                Explore KushalAI <ArrowUpRight size={18} />
              </Link>
              <a href="#solution" className="hero-secondary">
                See how it works <ArrowDown size={17} />
              </a>
            </motion.div>
            <motion.div variants={reveal} className="hero-context">
              <span>Problem Statement {SIH.id}</span>
              <span className="context-divider" />
              <span>{SIH.organisation}</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PROBLEM STATEMENT */}
      <section id="problem" className="problem-section">
        <div className="content-width">
          <div className="problem-layout">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={reveal} className="problem-heading">
              <h2>Learning exists.<br /><em>Direction is missing.</em></h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={reveal} className="problem-copy">
              <p className="problem-lead">Modern public sector work demands continuously evolving statistical, digital and managerial capabilities.</p>
              <p>But knowing that learning resources exist is not the same as knowing <strong>what to learn next</strong>. A professional may have hundreds of courses available without a clear picture of which competencies are below requirement, which course should come first, or whether the knowledge can actually be applied.</p>
              <div className="problem-callout">
                <Target size={20} />
                <span>The challenge is not only access to learning. It is the intelligence required to <strong>personalise the learning journey.</strong></span>
              </div>
            </motion.div>
          </div>
          <div className="problem-statement">
            <div className="ps-meta">
              <span>SMART INDIA HACKATHON 2026</span>
              <span>PS ID {SIH.id}</span>
            </div>
            <h3>An AI enabled approach to competency assessment, targeted training and continuous capability building.</h3>
            <div className="ps-footer">
              <span>{SIH.organisation}</span>
              <span>{SIH.division}</span>
              <span>{SIH.theme}</span>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section id="solution" className="solution-section">
        <div className="content-width">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="solution-intro">
            <motion.h2 variants={reveal}>A learning system that<span> closes the loop.</span></motion.h2>
            <motion.p variants={reveal}>KushalAI connects diagnosis, recommendation, learning, practice and assessment into one continuous capability journey.</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="capability-flow">
            <FlowStep number="01" title="Identify" text="Understand the learner's competency landscape and surface meaningful gaps." />
            <div className="flow-arrow"><ArrowRight size={20} /></div>
            <FlowStep number="02" title="Prioritise" text="Turn capability gaps into a focused sequence of recommended learning." accent />
            <div className="flow-arrow"><ArrowRight size={20} /></div>
            <FlowStep number="03" title="Learn" text="Give the learner a workspace to study material, ask questions and practise." />
            <div className="flow-arrow"><ArrowRight size={20} /></div>
            <FlowStep number="04" title="Apply" text="Place the learner inside realistic situations that require practical decisions." accent />
            <div className="flow-arrow"><ArrowRight size={20} /></div>
            <FlowStep number="05" title="Measure" text="Use assessments and learning activity to show progress toward readiness." />
          </motion.div>
        </div>
      </section>

      {/* CORE ENGINES */}
      <section className="engines-section">
        <div className="content-width">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            <motion.div variants={reveal} className="engines-heading">
              <div>
                <h2>Five systems.<br /><span>One capability loop.</span></h2>
              </div>
              <p>The platform is organised around the decisions a learner needs to make throughout their development, not around isolated features.</p>
            </motion.div>
            <div className="engines-grid">
              <EngineCard number="01" title="Competence Gap Engine" description="Maps the learner's current competency profile against defined skill requirements and surfaces the areas that need attention." icon={<BarChart3 size={24} />} large />
              <EngineCard number="02" title="Course Recommendation Engine" description="Converts identified gaps into a prioritised learning roadmap, helping the learner focus on the courses that matter most." icon={<Route size={24} />} />
              <EngineCard number="03" title="Assessment Engine" description="Uses course linked quizzes and knowledge checks to validate whether learning has actually been retained." icon={<ClipboardCheck size={24} />} />
              <EngineCard number="04" title="Doubts & Guidance" description="A learning workspace where learners can upload study material, ask questions, clarify concepts and generate practice questions." icon={<MessageSquare size={24} />} />
              <EngineCard number="05" title="Scenario Assessment Engine" description="Moves beyond recall into realistic administrative and statistical situations that test practical understanding and decision making." icon={<Compass size={24} />} large />
              <motion.div variants={reveal} className="engine-script-card" aria-label="K letter emblem" aria-hidden="true">
                <span className="engine-script-orbit" />
                <span className="engine-script-glyph" aria-hidden="true">क</span>
                <span className="engine-script-caption">ज्ञान से कौशल तक</span>
                <span className="engine-script-index">LEARN · APPLY · GROW</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ROADMAP USP */}
      <section id="learning-roadmap" className="roadmap-usp">
        <div className="content-width">
          <motion.div
            className="learning-roadmap-intro"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
            viewport={{ once: true, amount: 0.2 }}
            variants={roadmapStagger}
          >
            <motion.h2 variants={prefersReducedMotion ? undefined : roadmapNodeReveal}>
              From learning to<br /><span>ready for your role.</span>
            </motion.h2>
            <motion.p variants={prefersReducedMotion ? undefined : roadmapNodeReveal}>
              Follow a structured learning path that turns competency gaps into measurable progress.
            </motion.p>
          </motion.div>

          <div className="learning-roadmap-generation">
            <motion.div
              className="learning-roadmap-generation-copy"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
            >
              <h3>Your roadmap <span>isn't predefined.</span></h3>
              <p>KushalAI builds it from your competency test, recommendation engine and prerequisite relationships, creating a learning path tailored to where you are and where you need to go.</p>
            </motion.div>
            <div
              className="learning-roadmap-process"
              role="group"
              aria-label="Competency Test plus Recommendation Engine plus Prerequisites equals Personalized Roadmap"
            >
              <div className="learning-roadmap-process-step">
                <span>COMPETENCY TEST</span>
                <small>Where are you now?</small>
              </div>
              <span className="learning-roadmap-operator" aria-hidden="true">+</span>
              <div className="learning-roadmap-process-step">
                <span>RECOMMENDATION ENGINE</span>
                <small>What should you learn?</small>
              </div>
              <span className="learning-roadmap-operator" aria-hidden="true">+</span>
              <div className="learning-roadmap-process-step">
                <span>PREREQUISITES</span>
                <small>In what order?</small>
              </div>
              <span className="learning-roadmap-operator" aria-hidden="true">=</span>
              <div className="learning-roadmap-process-step learning-roadmap-process-result">
                <span>PERSONALIZED ROADMAP</span>
                <small>Where to go next?</small>
              </div>
            </div>
          </div>

          <motion.div
            className="learning-roadmap-journey"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
            viewport={{ once: true, amount: 0.12 }}
            variants={roadmapStagger}
          >
            <motion.div className="learning-roadmap-path-ends" variants={prefersReducedMotion ? undefined : roadmapNodeReveal}>
              <span>START YOUR JOURNEY</span>
              <span>ROLE READY</span>
            </motion.div>
            <div className="learning-roadmap-mobile-start">
              <span>START YOUR JOURNEY</span>
              <ArrowDown size={16} />
            </div>
            <div className="learning-roadmap-stages-wrap">
              <svg className="learning-roadmap-journey-svg" viewBox="0 0 1000 56" preserveAspectRatio="none" aria-hidden="true">
                <path className="learning-roadmap-path-future" d="M 100 28 H 900" />
                <motion.path
                  className="learning-roadmap-path-completed"
                  d="M 100 28 H 500"
                  initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.path
                  className="learning-roadmap-path-current"
                  d="M 500 28 H 700"
                  initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.45, delay: prefersReducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <motion.div className="learning-roadmap-stages" variants={prefersReducedMotion ? undefined : roadmapStagger}>
                {ROADMAP_PREVIEW_STAGES.map((stage) => (
                  <motion.article
                    key={stage.number}
                    className={`learning-roadmap-stage learning-roadmap-stage-${stage.status}`}
                    variants={prefersReducedMotion ? undefined : roadmapNodeReveal}
                    whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                  >
                    <span className="learning-roadmap-stage-marker">{stage.number}</span>
                    <div className="learning-roadmap-stage-copy">
                      <span className="learning-roadmap-stage-category">{stage.category}</span>
                      <h3>{stage.title}</h3>
                      <span className="learning-roadmap-stage-status">
                        {stage.status === 'completed' && <Check size={14} />}
                        {stage.status === 'current' && <ArrowRight size={14} />}
                        {stage.status === 'locked' && <CircleDot size={14} />}
                        {stage.statusLabel}
                      </span>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </div>
            <div className="learning-roadmap-mobile-end">
              <ArrowDown size={16} />
              <span>ROLE READY</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LEARNING WORKSPACE */}
      <section className="workspace-section">
        <div className="content-width">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={stagger} className="workspace-heading">
            <motion.h2 variants={reveal}>Learning does not stop<br />at<span> watching a course.</span></motion.h2>
            <motion.p variants={reveal}>KushalAI gives the learner a space to move from consuming information to understanding it and finally applying it.</motion.p>
          </motion.div>
          <div className="workspace-features">
            {/* DOUBTS & GUIDANCE */}
            <WorkspaceFeature
              title="Doubts & Guidance"
              description="Turn static learning material into an interactive workspace. Upload a document, ask questions about it, clarify concepts and create practice questions from the material."
              points={[
                'Learning workspace for your documents',
                'Contextual question & answer flow',
                'Practice MCQ generation',
                'Persistent learning conversations',
              ]}
            >
              <div className="guidance-mock">
                <div className="mock-topbar">
                  <div className="mock-file">
                    <FileText size={15} />
                    <span>AI_ML_Study_Notes.pdf</span>
                  </div>
                  <span className="mock-status">MATERIAL</span>
                </div>
                <div className="mock-content">
                  <div className="mock-summary">
                    <span>DOCUMENT SUMMARY</span>
                    <h4>Artificial Intelligence & Machine Learning</h4>
                    <p>Fundamentals, supervised learning, evaluation, overfitting and practical machine learning workflows.</p>
                  </div>
                  <div className="mock-chat">
                    <div className="mock-message user">Explain supervised learning using this material.</div>
                    <div className="mock-message bot">
                      <span className="bot-label">KUSHALAI</span>
                      Supervised learning uses labelled examples to learn the relationship between inputs and known targets.
                    </div>
                    <div className="mock-input">
                      <span>Ask a doubt about this material...</span>
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </WorkspaceFeature>

            {/* SCENARIO ASSESSMENT */}
            <WorkspaceFeature
              title="Scenario Based Assessment"
              description="Move beyond traditional tests with multiple choice answers. Scenario assessments place learners inside realistic situations where they must reason, decide and respond."
              points={[
                'Statistical situations drawn from practice',
                'Prompts focused on decision making',
                'MCQ + written response structure',
                'Practical grasp beyond recall',
              ]}
              reverse
            >
              <div className="scenario-mock">
                <div className="scenario-header">
                  <div>
                    <span>SCENARIO ASSESSMENT</span>
                    <strong>Data Integrity Crisis</strong>
                  </div>
                  <div className="scenario-timer">00:14:32</div>
                </div>
                <div className="scenario-body">
                  <div className="scenario-context">
                    <span className="scenario-label">SITUATION</span>
                    <p>A district dataset shows statistically impossible variance in infant mortality rates compared with the five year trend.</p>
                  </div>
                  <div className="scenario-question">
                    <span className="scenario-label">YOUR TASK</span>
                    <h4>What should your immediate mitigation strategy include?</h4>
                    <div className="scenario-options">
                      <div><span>A</span> Validate source data and investigate anomalies.</div>
                      <div><span>B</span> Publish the data immediately.</div>
                      <div><span>C</span> Ignore the variance.</div>
                    </div>
                  </div>
                </div>
                <div className="scenario-footer">
                  <span>01 / 10</span>
                  <span>Practical application</span>
                </div>
              </div>
            </WorkspaceFeature>
          </div>
        </div>
      </section>

      {/* DIFFERENCE */}
      <section className="difference-section">
        <div className="content-width">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="difference-layout">
            <motion.div variants={reveal} className="difference-heading">
              <h2>Not another<br /><span>course catalogue.</span></h2>
              <p>KushalAI is designed around the learner's capability journey rather than the number of courses available.</p>
            </motion.div>
            <motion.div variants={reveal} className="difference-table">
              <div className="difference-row difference-head">
                <span>TRADITIONAL LEARNING</span>
                <span>KUSHALAI</span>
              </div>
              <div className="difference-row">
                <div><CircleDot size={14} /><span>Search for a course</span></div>
                <div><Check size={16} /><span>Start with the competency gap</span></div>
              </div>
              <div className="difference-row">
                <div><CircleDot size={14} /><span>Consume content</span></div>
                <div><Check size={16} /><span>Understand through guidance</span></div>
              </div>
              <div className="difference-row">
                <div><CircleDot size={14} /><span>Take a quiz</span></div>
                <div><Check size={16} /><span>Test practical application</span></div>
              </div>
              <div className="difference-row">
                <div><CircleDot size={14} /><span>Complete the course</span></div>
                <div><Check size={16} /><span>Build measurable readiness</span></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CAPABILITY LOOP */}
      <section className="loop-section">
        <div className="content-width">
          <div className="loop-layout">
            <div className="loop-copy">
              <h2>Every learning action<br />has a<span> next step.</span></h2>
              <p>The platform creates continuity between diagnosis, learning and assessment. A learner is never left wondering what comes next.</p>
              <ArrowLink to="/register">Experience the learning journey</ArrowLink>
            </div>
            <div className="loop-visual">
              <div className="loop-circle loop-circle-outer">
                <div className="loop-circle loop-circle-middle">
                  <div className="loop-circle loop-circle-inner">
                    <span className="loop-glyph" aria-label="K letter emblem">क</span>
                  </div>
                </div>
              </div>
              <div className="loop-node loop-node-top">
                <span>01</span><strong>IDENTIFY</strong><small>Competency gaps</small>
              </div>
              <div className="loop-node loop-node-right">
                <span>02</span><strong>RECOMMEND</strong><small>Learning path</small>
              </div>
              <div className="loop-node loop-node-bottom-right">
                <span>03</span><strong>LEARN</strong><small>Guidance workspace</small>
              </div>
              <div className="loop-node loop-node-bottom-left">
                <span>04</span><strong>APPLY</strong><small>Scenario assessment</small>
              </div>
              <div className="loop-node loop-node-left">
                <span>05</span><strong>MEASURE</strong><small>Progress & readiness</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILL PASSPORT */}
      <section className="passport-section">
        <div className="content-width">
          <div className="passport-layout">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} className="passport-copy">
              <h2>From learning<br />to a clearer<br /><span>skill passport.</span></h2>
              <p>The learner can see competency domains, proficiency, course progress, assessment activity and practical performance in one place.</p>
              <div className="passport-points">
                <div><Gauge size={19} /><span>Competency visibility</span></div>
                <div><Layers3 size={19} /><span>Learning progress</span></div>
                <div><ClipboardCheck size={19} /><span>Assessment performance</span></div>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} className="passport-mock">
              <div className="passport-mock-header">
                <span>SKILL PASSPORT</span>
                <span>LEARNING PROFILE</span>
              </div>
              <div className="passport-score">
                <div>
                  <span>OVERALL COMPETENCY</span>
                  <strong>72%</strong>
                </div>
                <div className="score-bar"><span /></div>
              </div>
              <div className="passport-domains">
                <div>
                  <span>Statistical</span><strong>78%</strong>
                  <i><b style={{ width: '78%' }} /></i>
                </div>
                <div>
                  <span>Technical</span><strong>64%</strong>
                  <i><b style={{ width: '64%' }} /></i>
                </div>
                <div>
                  <span>Digital Governance</span><strong>51%</strong>
                  <i><b style={{ width: '51%' }} /></i>
                </div>
                <div>
                  <span>Behavioural</span><strong>86%</strong>
                  <i><b style={{ width: '86%' }} /></i>
                </div>
              </div>
              <div className="passport-bottom">
                <div>
                  <span>SCENARIO ASSESSMENTS</span>
                  <strong>03 / 08</strong>
                </div>
                <div>
                  <span>COURSE COMPLETION</span>
                  <strong>69%</strong>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SIH CONTEXT */}
      <section className="sih-section">
        <div className="content-width">
          <div className="sih-inner">
            <div className="sih-number">
              <span>SIH</span><strong>26101</strong>
            </div>
            <div className="sih-copy">
              <h2>Built around the requirements of<span> Smart Education.</span></h2>
              <p>KushalAI was conceptualised as a response to the Smart India Hackathon 2026 problem statement from the Ministry of Statistics & Programme Implementation, Data Informatics & Innovation Division.</p>
              <div className="sih-meta-grid">
                <div><span>ORGANISATION</span><strong>{SIH.organisation}</strong></div>
                <div><span>DIVISION</span><strong>{SIH.division}</strong></div>
                <div><span>THEME</span><strong>{SIH.theme}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <ArchitectureLine />
        <div className="final-cta-emblem" aria-hidden="true">
          <span className="engine-script-orbit" />
          <span className="engine-script-glyph">क</span>
        </div>
        <div className="final-cta-content">
          <h2>Build capability.<br /><span>Not just course completion.</span></h2>
          <p>A competency focused learning experience designed to move from identifying gaps to demonstrating readiness.</p>
          <div className="final-actions">
            <Link to="/register" className="hero-primary">Explore KushalAI <ArrowUpRight size={18} /></Link>
            <Link to="/login" className="hero-secondary">Sign in <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      {/* STYLES */}
     <style>{`
  /* =========================================================
     KUSHALAI — COMPACT / MOTION SYSTEM
     ========================================================= */

  .landing-page {
    --blue: ${BLUE};
    --blue-dark: ${BLUE_DARK};
    --orange: ${ORANGE};
    --offwhite: ${OFFWHITE};
    --white: ${WHITE};
    --ink: ${INK};
    --muted: ${MUTED};
    --line: ${LINE};

    position: relative;
    min-height: 100vh;
    overflow-x: hidden;
    background: var(--offwhite);
    color: var(--ink);

    font-family:
      Inter,
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;

    scroll-behavior: smooth;
  }

  .landing-page *,
  .landing-page *::before,
  .landing-page *::after {
    box-sizing: border-box;
  }

  /* =========================================================
     GLOBAL BACKGROUND
     ========================================================= */

  .landing-background {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .landing-grid {
    position: absolute;
    inset: 0;
    opacity: 0.2;

    background-image:
      linear-gradient(
        rgba(18, 59, 102, 0.045) 1px,
        transparent 1px
      ),
      linear-gradient(
        90deg,
        rgba(18, 59, 102, 0.045) 1px,
        transparent 1px
      );

    background-size: 48px 48px;

    animation: gridDrift 18s linear infinite;
  }

  .landing-blue-block {
    position: absolute;
    width: 420px;
    height: 620px;
    right: -260px;
    top: 12%;

    border: 1px solid rgba(18, 59, 102, 0.08);

    transform: rotate(17deg);

    animation: architectureFloat 9s ease-in-out infinite;
  }

  .landing-orange-line {
    position: absolute;
    width: 180px;
    height: 1px;
    background: var(--orange);
    opacity: 0.65;
  }

  .landing-orange-line-1 {
    top: 28%;
    left: -30px;
    transform: rotate(-12deg);

    animation: linePulse 4s ease-in-out infinite;
  }

  .landing-orange-line-2 {
    right: -50px;
    bottom: 18%;
    transform: rotate(-16deg);

    animation: linePulse 4s ease-in-out infinite 1.5s;
  }

  .landing-cross {
    position: absolute;
    color: var(--orange);
    font-size: 22px;
    font-weight: 300;

    animation: crossFloat 4s ease-in-out infinite;
  }

  .landing-cross-1 {
    top: 19%;
    left: 5%;
  }

  .landing-cross-2 {
    right: 8%;
    bottom: 12%;
    animation-delay: 1.2s;
  }

  @keyframes gridDrift {
    from {
      background-position: 0 0;
    }

    to {
      background-position: 48px 48px;
    }
  }

  @keyframes architectureFloat {
    0%,
    100% {
      transform: rotate(17deg) translate3d(0, 0, 0);
    }

    50% {
      transform: rotate(18deg) translate3d(-18px, 15px, 0);
    }
  }

  @keyframes linePulse {
    0%,
    100% {
      opacity: 0.35;
      transform: translateX(0) rotate(-12deg);
    }

    50% {
      opacity: 0.9;
      transform: translateX(14px) rotate(-12deg);
    }
  }

  @keyframes crossFloat {
    0%,
    100% {
      transform: translateY(0) rotate(0deg);
      opacity: 0.55;
    }

    50% {
      transform: translateY(-10px) rotate(90deg);
      opacity: 1;
    }
  }

  /* =========================================================
     CONTENT WIDTH
     ========================================================= */

  .content-width {
    position: relative;
    width: min(1380px, calc(100% - 72px));
    margin: 0 auto;
  }

  /* =========================================================
     HERO
     ========================================================= */

  .hero-section {
    position: relative;
    z-index: 1;

    min-height: 680px;

    display: flex;
    align-items: center;

    overflow: hidden;

    border-bottom: 1px solid rgba(16, 36, 59, 0.12);
  }

  .hero-content {
    position: relative;
    z-index: 4;

    width: min(1380px, calc(100% - 72px));
    margin: 0 auto;

    padding: 78px 0 88px;
  }

  .hero-kicker {
    display: inline-flex;
    align-items: center;
    gap: 10px;

    margin-bottom: 24px;

    color: var(--blue);

    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .kicker-mark {
    width: 26px;
    height: 3px;
    background: var(--orange);

    animation: kickerPulse 2.5s ease-in-out infinite;
  }

  @keyframes kickerPulse {
    0%,
    100% {
      width: 26px;
    }

    50% {
      width: 42px;
    }
  }

  .hero-content h1 {
    max-width: 1000px;

    margin: 0;

    color: var(--ink);

    font-size: clamp(58px, 7vw, 116px);
    line-height: 0.91;

    letter-spacing: -0.065em;
    font-weight: 820;
  }

  .hero-word-blue {
    display: block;
    color: var(--blue);
  }

  .hero-word-orange {
    display: block;
    color: var(--orange);
  }

  .hero-description {
    max-width: 620px;

    margin: 30px 0 0;

    color: #596779;

    font-size: 16px;
    line-height: 1.65;
  }

  .hero-actions {
    display: flex;
    align-items: center;
    gap: 13px;

    margin-top: 28px;
  }

  .hero-primary,
  .hero-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;

    min-height: 46px;
    padding: 0 18px;

    text-decoration: none;

    font-size: 13px;
    font-weight: 750;

    transition:
      transform 220ms ease,
      background 220ms ease,
      box-shadow 220ms ease;
  }

  .hero-primary {
    background: var(--blue);
    color: white;
  }

  .hero-primary:hover {
    background: var(--blue-dark);

    transform: translateY(-4px);

    box-shadow:
      0 10px 25px rgba(18, 59, 102, 0.18);
  }

  .hero-primary svg {
    transition: transform 220ms ease;
  }

  .hero-primary:hover svg {
    transform: translate(3px, -3px);
  }

  .hero-secondary {
    color: var(--ink);

    border: 1px solid rgba(16, 36, 59, 0.2);

    background: rgba(255, 255, 255, 0.35);
  }

  .hero-secondary:hover {
    transform: translateY(-4px);
    border-color: var(--orange);
  }

  .hero-context {
    display: flex;
    align-items: center;
    gap: 12px;

    margin-top: 48px;

    color: #7a8592;

    font-size: 9px;
    font-weight: 750;
    letter-spacing: 0.13em;

    text-transform: uppercase;
  }

  .context-divider {
    width: 25px;
    height: 1px;
    background: var(--orange);
  }

  .hero-side-note {
    position: absolute;

    right: 32px;
    bottom: 45px;

    z-index: 5;

    display: flex;
    align-items: center;
    gap: 10px;

    color: #8290a0;

    font-size: 8px;
    font-weight: 750;

    letter-spacing: 0.18em;

    writing-mode: vertical-rl;
    text-transform: uppercase;
  }

  .hero-side-note div {
    width: 1px;
    height: 45px;
    background: var(--orange);
  }

  /* =========================================================
     ARCHITECTURE LINE
     ========================================================= */

  .architecture-line {
    position: absolute;

    z-index: 2;

    top: 20px;
    right: -40px;

    width: 650px;
    height: 650px;

    opacity: 0.12;

    pointer-events: none;
  }

  .landing-draw-path {
    stroke-dasharray: 3000;
    stroke-dashoffset: 3000;

    animation:
      landingDraw 4.5s cubic-bezier(.22, 1, .36, 1)
      forwards,
      architectureBreath 6s ease-in-out infinite 4.5s;
  }

  .landing-draw-delay-1 {
    animation-delay: 0.4s, 5s;
  }

  .landing-draw-delay-2 {
    animation-delay: 0.8s, 5.5s;
  }

  .landing-draw-delay-3 {
    animation-delay: 1.1s, 6s;
  }

  @keyframes landingDraw {
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes architectureBreath {
    0%,
    100% {
      opacity: 0.12;
    }

    50% {
      opacity: 0.22;
    }
  }

  /* =========================================================
     SECTION LABEL
     ========================================================= */

  .landing-section-label {
    display: flex;
    align-items: center;
    gap: 12px;

    margin-bottom: 38px;

    color: var(--blue);

    font-size: 9px;
    font-weight: 800;

    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .landing-section-label span {
    color: var(--orange);
  }

  .landing-section-label div {
    width: 38px;
    height: 1px;
    background: var(--orange);

    transition: width 300ms ease;
  }

  .landing-section-label:hover div {
    width: 58px;
  }

  /* =========================================================
     COMPACT SECTION SPACING
     ========================================================= */

  .problem-section {
    position: relative;
    z-index: 1;

    padding: 92px 0 100px;

    background: var(--white);
  }

  .solution-section {
    position: relative;
    z-index: 1;

    padding: 95px 0 105px;

    background: var(--offwhite);
  }

  .engines-section {
    position: relative;
    z-index: 1;

    padding: 100px 0;

    background: var(--blue);
    color: white;
  }

  .roadmap-usp {
    position: relative;
    z-index: 1;
    padding: 78px 0 86px;
    background: var(--offwhite);
    color: var(--ink);
  }

  .workspace-section {
    position: relative;
    z-index: 1;

    padding: 100px 0 110px;

    background: var(--offwhite);
  }

  .difference-section {
    position: relative;
    z-index: 1;

    padding: 100px 0;

    background: white;
  }

  .loop-section {
    position: relative;
    z-index: 1;

    padding: 105px 0;

    background: var(--offwhite);
    overflow: hidden;
  }

  .passport-section {
    position: relative;
    z-index: 1;

    padding: 100px 0;

    background: white;
  }

  .sih-section {
    position: relative;
    z-index: 1;

    padding: 95px 0;

    background: var(--blue);
    color: white;
  }
  .roadmap-usp {
    position: relative;
    z-index: 1;

    padding: 78px 0 86px;

    background: var(--offwhite);
    color: var(--ink);
  }

  /* =========================================================
     PROBLEM
     ========================================================= */

  .problem-layout {
    display: grid;
    grid-template-columns: 1fr 0.9fr;

    gap: 75px;

    align-items: start;
  }

  .problem-heading h2 {
    margin: 0;

    font-size: clamp(46px, 5vw, 76px);
    line-height: 0.98;

    letter-spacing: -0.055em;
    font-weight: 800;
  }

  .problem-heading em {
    color: var(--orange);
    font-style: normal;
  }

  .problem-copy {
    padding-top: 5px;
  }

  .problem-copy p {
    margin: 0 0 17px;

    color: var(--muted);

    font-size: 15px;
    line-height: 1.7;
  }

  .problem-copy .problem-lead {
    color: var(--ink);

    font-size: 19px;
    line-height: 1.5;

    font-weight: 620;
  }

  .problem-copy strong {
    color: var(--blue);
  }

  .problem-callout {
    display: flex;
    gap: 13px;

    margin-top: 25px;
    padding: 17px 0;

    color: var(--blue);

    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);

    transition: padding 250ms ease;
  }

  .problem-callout:hover {
    padding-left: 8px;
  }

  .problem-callout svg {
    flex: 0 0 auto;
    color: var(--orange);
  }

  .problem-callout span {
    font-size: 13px;
    line-height: 1.6;
  }

  .problem-statement {
    position: relative;

    margin-top: 65px;
    padding: 34px 40px;

    overflow: hidden;

    background: var(--blue);
    color: white;

    transition:
      transform 300ms ease,
      box-shadow 300ms ease;
  }

  .problem-statement:hover {
    transform: translateY(-5px);

    box-shadow:
      0 18px 45px rgba(18, 59, 102, 0.16);
  }

  .problem-statement::after {
    content: 'क';

    position: absolute;

    right: 20px;
    bottom: -80px;

    color: rgba(255,255,255,0.055);

    font-size: 280px;
    line-height: 1;
    font-weight: 700;

    animation: hindiFloat 7s ease-in-out infinite;
  }

  @keyframes hindiFloat {
    0%,
    100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-18px);
    }
  }

  .ps-meta,
  .ps-footer {
    position: relative;
    z-index: 2;

    display: flex;
    align-items: center;

    gap: 20px;
    flex-wrap: wrap;

    font-size: 9px;
    font-weight: 750;

    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .ps-meta {
    color: rgba(255,255,255,0.65);
  }

  .ps-meta span:last-child {
    color: var(--orange);
  }

  .problem-statement h3 {
    position: relative;
    z-index: 2;

    max-width: 930px;

    margin: 25px 0 34px;

    font-size: clamp(28px, 3.5vw, 52px);

    line-height: 1.08;

    letter-spacing: -0.045em;
    font-weight: 700;
  }

  .ps-footer {
    position: relative;
    z-index: 2;

    padding-top: 18px;

    border-top: 1px solid rgba(255,255,255,0.16);

    color: rgba(255,255,255,0.58);
  }

  /* =========================================================
     SOLUTION
     ========================================================= */

  .solution-intro {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;

    gap: 75px;

    align-items: end;
  }

  .solution-intro h2 {
    margin: 0;

    font-size: clamp(48px, 5.5vw, 84px);

    line-height: 0.95;
    letter-spacing: -0.06em;

    font-weight: 800;
  }

  .solution-intro h2 span {
    color: var(--blue);
  }

  .solution-intro p {
    max-width: 430px;

    margin: 0;

    color: var(--muted);

    font-size: 15px;
    line-height: 1.7;
  }

  .capability-flow {
    display: grid;

    grid-template-columns:
      1fr auto
      1fr auto
      1fr auto
      1fr auto
      1fr;

    gap: 12px;

    align-items: stretch;

    margin-top: 58px;
  }

  .flow-step {
    min-height: 205px;

    padding: 20px;

    background: var(--white);

    border-top: 3px solid var(--blue);

    transition:
      transform 250ms ease,
      box-shadow 250ms ease;
  }

  .flow-step:hover {
    transform: translateY(-7px);

    box-shadow:
      0 14px 30px rgba(18,59,102,0.09);
  }

  .flow-number {
    width: 32px;
    height: 32px;

    display: flex;
    align-items: center;
    justify-content: center;

    margin-bottom: 27px;

    border: 1px solid rgba(18,59,102,0.2);

    color: var(--blue);

    font-size: 9px;
    font-weight: 800;

    transition:
      transform 250ms ease,
      background 250ms ease;
  }

  .flow-step:hover .flow-number {
    transform: rotate(45deg);
  }

  .flow-number.orange {
    background: var(--orange);
    border-color: var(--orange);
    color: white;
  }

  .flow-step h3 {
    margin: 0 0 8px;

    font-size: 20px;
    letter-spacing: -0.025em;
  }

  .flow-step p {
    margin: 0;

    color: var(--muted);

    font-size: 12px;
    line-height: 1.6;
  }

  .flow-arrow {
    display: flex;
    align-items: center;
    justify-content: center;

    color: var(--orange);

    animation: arrowPulse 2s ease-in-out infinite;
  }

  @keyframes arrowPulse {
    0%,
    100% {
      transform: translateX(0);
      opacity: 0.45;
    }

    50% {
      transform: translateX(5px);
      opacity: 1;
    }
  }

  /* =========================================================
     CORE ENGINES
     ========================================================= */

  .engines-heading {
    display: grid;

    grid-template-columns: 1fr 0.7fr;

    gap: 75px;

    align-items: end;

    margin-bottom: 48px;
  }

  .engines-heading h2 {
    margin: 0;

    font-size: clamp(48px, 5.5vw, 84px);

    line-height: 0.92;

    letter-spacing: -0.06em;
  }

  .engines-heading h2 span {
    color: var(--orange);
  }

  .engines-heading p {
    max-width: 430px;

    margin: 0;

    color: rgba(255,255,255,0.65);

    font-size: 15px;
    line-height: 1.7;
  }

  .engines-grid {
    display: grid;

    grid-template-columns: repeat(3, 1fr);

    gap: 1px;

    background: rgba(255,255,255,0.15);

    border: 1px solid rgba(255,255,255,0.15);
  }

  .engine-card {
    min-height: 335px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    padding: 27px;

    position: relative;

    background: var(--blue);

    overflow: hidden;

    transition:
      transform 300ms ease,
      background 300ms ease;
  }

  .engine-card::before {
    content: '';

    position: absolute;

    left: 0;
    top: 0;

    width: 100%;
    height: 2px;

    background: var(--orange);

    transform: scaleX(0);
    transform-origin: left;

    transition: transform 400ms ease;
  }

  .engine-card:hover {
    background: var(--blue-dark);
    transform: translateY(-5px);
  }

  .engine-card:hover::before {
    transform: scaleX(1);
  }

  .engine-card-large {
    grid-column: span 2;
  }

  .engine-script-card {
    min-height: 335px;
    grid-column: 3;
    grid-row: 2 / span 2;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: var(--blue-dark);
    border: 1px solid rgba(255,255,255,0.12);
  }

  .engine-script-orbit {
    position: absolute;
    width: 230px;
    aspect-ratio: 1;
    border: 1px solid rgba(255,255,255,0.13);
    border-top-color: var(--orange);
    border-radius: 50%;
    transform: rotate(-24deg) scaleX(0.76);
    animation: scriptOrbit 18s linear infinite;
  }

  .engine-script-orbit::after {
    content: '';
    position: absolute;
    top: 18px;
    right: 39px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--orange);
    box-shadow: 0 0 16px rgba(234,88,12,0.7);
  }

  .engine-script-glyph {
    position: relative;
    display: inline-block;
    color: rgba(255,255,255,0.94);
    font-family: "Noto Serif Devanagari", "Noto Sans Devanagari", Georgia, serif;
    font-size: 164px;
    line-height: 0.9;
    font-weight: 700;
    letter-spacing: 0;
    transform: translateY(-4px);
    animation: scriptFloat 4s ease-in-out infinite;
  }

  .engine-script-caption,
  .engine-script-index {
    position: absolute;
    color: rgba(255,255,255,0.7);
    font-size: 11px;
    letter-spacing: 0.08em;
  }

  .engine-script-caption {
    bottom: 45px;
    font-family: Georgia, "Noto Serif Devanagari", serif;
    font-size: 15px;
    letter-spacing: 0;
  }

  .engine-script-index {
    bottom: 22px;
    color: rgba(255,255,255,0.38);
    font-size: 8px;
    font-weight: 750;
    letter-spacing: 0.16em;
  }

  @keyframes scriptOrbit {
    to { transform: rotate(336deg) scaleX(0.76); }
  }

  @keyframes scriptFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  /* =========================================================
     ROADMAP USP
     ========================================================= */

  .roadmap-usp .landing-section-label {
    margin-bottom: 26px;
  }

  .roadmap-usp-layout {
    display: grid;
    grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
    gap: clamp(36px, 5vw, 72px);
    align-items: center;
  }

  .roadmap-usp-copy h2 {
    margin: 0;
    color: var(--ink);
    font-size: 52px;
    font-weight: 850;
    line-height: 1;
    letter-spacing: -0.045em;
  }

  .roadmap-usp-copy h2 span {
    display: inline-block;
    margin-top: 5px;
    color: var(--orange);
  }

  .roadmap-usp-copy > p {
    max-width: 540px;
    margin: 18px 0 0;
    color: #596779;
    font-size: 16px;
    line-height: 1.65;
  }

  .roadmap-feature-list {
    display: grid;
    gap: 9px;
    list-style: none;
    margin: 21px 0 0;
    padding: 0;
  }

  .roadmap-feature-list li {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--ink);
    font-size: 14px;
    font-weight: 700;
    line-height: 1.4;
  }

  .roadmap-feature-list svg {
    flex: 0 0 auto;
    color: var(--orange);
  }

  .roadmap-contrast {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 21px;
    padding: 13px 0;
    border-top: 1px solid rgba(18,59,102,0.16);
    border-bottom: 1px solid rgba(18,59,102,0.16);
  }

  .roadmap-contrast > div + div {
    padding-left: 16px;
    border-left: 1px solid rgba(18,59,102,0.16);
  }

  .roadmap-contrast span {
    display: block;
    margin-bottom: 5px;
    color: #778395;
    font-size: 10px;
    font-weight: 850;
    letter-spacing: 0.1em;
  }

  .roadmap-contrast > div + div span {
    color: var(--orange);
  }

  .roadmap-contrast p {
    margin: 0;
    color: var(--ink);
    font-size: 13px;
    font-weight: 750;
    line-height: 1.4;
  }

  .roadmap-cta {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    margin-top: 19px;
    color: var(--blue);
    font-size: 15px;
    font-weight: 850;
    text-decoration: none;
  }

  .roadmap-cta svg,
  .roadmap-next-step svg {
    color: var(--orange);
    transition: transform 220ms ease;
  }

  .roadmap-cta:hover svg,
  .roadmap-next-step:hover svg {
    transform: translateX(4px);
  }

  .roadmap-cta:focus-visible,
  .roadmap-next-step:focus-visible {
    outline: 2px solid var(--orange);
    outline-offset: 4px;
  }

  .roadmap-preview {
    position: relative;
    padding: 21px 23px 19px;
    overflow: hidden;
    background: var(--white);
    border: 1px solid rgba(18,59,102,0.18);
    box-shadow: 0 16px 38px rgba(16,36,59,0.08);
  }

  .roadmap-preview::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 64px;
    height: 3px;
    background: var(--orange);
  }

  .roadmap-preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 14px;
  }

  .roadmap-preview-header > div:first-child > span,
  .roadmap-overall-progress > span {
    display: block;
    color: #778395;
    font-size: 10px;
    font-weight: 850;
    letter-spacing: 0.12em;
  }

  .roadmap-preview-header h3 {
    margin: 5px 0 0;
    color: var(--ink);
    font-size: 20px;
    font-weight: 850;
    line-height: 1.2;
  }

  .roadmap-overall-progress {
    flex: 0 0 auto;
    text-align: right;
  }

  .roadmap-overall-progress strong {
    display: block;
    color: var(--orange);
    font-size: 27px;
    font-weight: 900;
    line-height: 1;
  }

  .roadmap-overall-progress > span {
    margin-top: 5px;
    font-size: 9px;
  }

  .roadmap-progress-track,
  .roadmap-stage-progress {
    display: block;
    overflow: hidden;
    background: rgba(18,59,102,0.11);
  }

  .roadmap-progress-track {
    height: 4px;
  }

  .roadmap-progress-track > span,
  .roadmap-stage-progress > span {
    display: block;
    height: 100%;
    background: var(--orange);
  }

  .roadmap-stage-list {
    position: relative;
    display: grid;
    margin: 10px 0 14px;
  }

  .roadmap-track-base,
  .roadmap-track-fill {
    position: absolute;
    z-index: 0;
    top: 18px;
    bottom: 18px;
    left: 15px;
    width: 2px;
  }

  .roadmap-track-base {
    background: rgba(18,59,102,0.16);
  }

  .roadmap-track-fill {
    background: var(--orange);
    transform-origin: top;
  }

  .roadmap-stage {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 32px minmax(0, 1fr) auto;
    align-items: center;
    gap: 11px;
    min-height: 53px;
    padding: 5px 8px 5px 0;
    border-bottom: 1px solid rgba(18,59,102,0.09);
    background: var(--white);
    transition: background 220ms ease, border-color 220ms ease;
  }

  .roadmap-stage:hover {
    background: #f8fafc;
  }

  .roadmap-stage-current {
    border-left: 2px solid var(--orange);
    background: rgba(234,88,12,0.055);
  }

  .roadmap-stage-current:hover {
    background: rgba(234,88,12,0.09);
  }

  .roadmap-stage-marker {
    position: relative;
    z-index: 2;
    display: grid;
    width: 32px;
    height: 32px;
    place-items: center;
    border: 1px solid rgba(18,59,102,0.24);
    background: var(--white);
    color: var(--blue);
    font-size: 10px;
    font-weight: 900;
  }

  .roadmap-stage-completed .roadmap-stage-marker {
    border-color: var(--blue);
    background: var(--blue);
    color: var(--white);
  }

  .roadmap-stage-current .roadmap-stage-marker {
    border-color: var(--orange);
    background: var(--orange);
    color: var(--white);
  }

  .roadmap-stage-current .roadmap-stage-marker::after {
    content: '';
    position: absolute;
    inset: -5px;
    border: 1px solid var(--orange);
    animation: roadmapPulse 2.6s ease-out infinite;
  }

  @keyframes roadmapPulse {
    0% { opacity: 0.7; transform: scale(0.86); }
    100% { opacity: 0; transform: scale(1.38); }
  }

  .roadmap-stage-info {
    display: grid;
    min-width: 0;
    gap: 2px;
  }

  .roadmap-stage-category {
    color: #778395;
    font-size: 9px;
    font-weight: 850;
    letter-spacing: 0.1em;
    line-height: 1.2;
  }

  .roadmap-stage-info > strong {
    color: var(--ink);
    font-size: 14px;
    font-weight: 800;
    line-height: 1.25;
  }

  .roadmap-stage-current .roadmap-stage-category,
  .roadmap-stage-current .roadmap-stage-status {
    color: var(--orange);
  }

  .roadmap-stage-progress {
    width: 100%;
    max-width: 210px;
    height: 3px;
    margin-top: 3px;
  }

  .roadmap-stage-status {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
    color: #778395;
    font-size: 11px;
    font-weight: 750;
    white-space: nowrap;
  }

  .roadmap-stage-completed .roadmap-stage-status {
    color: var(--blue);
  }

  .roadmap-stage-status svg {
    flex: 0 0 auto;
  }

  .roadmap-next-step {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 66px;
    padding: 13px 16px;
    border-left: 3px solid var(--orange);
    background: var(--blue);
    color: var(--white);
    text-decoration: none;
    transition: background 220ms ease;
  }

  .roadmap-next-step:hover {
    background: var(--blue-dark);
  }

  .roadmap-next-step > span:first-child {
    display: grid;
    gap: 5px;
  }

  .roadmap-next-label {
    color: var(--orange);
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.12em;
  }

  .roadmap-next-step strong {
    color: var(--white);
    font-size: 15px;
    font-weight: 800;
    line-height: 1.3;
  }

  .engine-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .engine-number {
    color: rgba(255,255,255,0.35);

    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.14em;
  }

  .engine-icon {
    width: 46px;
    height: 46px;

    display: flex;
    align-items: center;
    justify-content: center;

    border: 1px solid rgba(255,255,255,0.18);

    color: var(--orange);

    transition:
      transform 350ms ease,
      border-color 350ms ease;
  }

  .engine-card:hover .engine-icon {
    transform: rotate(8deg) scale(1.08);

    border-color: var(--orange);
  }

  .engine-tag {
    margin-bottom: 13px;

    color: var(--orange);

    font-size: 8px;
    font-weight: 800;

    letter-spacing: 0.18em;
  }

  .engine-content h3 {
    max-width: 560px;

    margin: 0 0 12px;

    font-size: 25px;

    line-height: 1.05;

    letter-spacing: -0.035em;
  }

  .engine-content p {
    max-width: 570px;

    margin: 0;

    color: rgba(255,255,255,0.64);

    font-size: 13px;
    line-height: 1.65;
  }

  .engine-line {
    width: 100%;
    height: 1px;

    margin-top: 22px;

    background: rgba(255,255,255,0.12);
  }

  .engine-line span {
    display: block;

    width: 38px;
    height: 2px;

    background: var(--orange);

    transition: width 400ms ease;
  }

  .engine-card:hover .engine-line span {
    width: 100px;
  }

  /* =========================================================
     WORKSPACE
     ========================================================= */

  .workspace-heading {
    display: grid;

    grid-template-columns: 1fr 0.65fr;

    gap: 75px;

    align-items: end;

    margin-bottom: 82px;
  }

  .workspace-heading h2 {
    margin: 0;

    font-size: clamp(46px, 5.5vw, 82px);

    line-height: 0.94;

    letter-spacing: -0.06em;
  }

  .workspace-heading h2 span {
    color: var(--orange);
  }

  .workspace-heading p {
    max-width: 430px;

    margin: 0;

    color: var(--muted);

    font-size: 15px;
    line-height: 1.7;
  }

  .workspace-feature {
    display: grid;

    grid-template-columns: 0.75fr 1.25fr;

    gap: 75px;

    align-items: center;

    margin-bottom: 95px;
  }

  .workspace-feature.reverse {
    grid-template-columns: 1.25fr 0.75fr;
  }

  .workspace-feature.reverse .workspace-copy {
    order: 2;
  }

  .workspace-feature.reverse .workspace-visual {
    order: 1;
  }

  .feature-eyebrow {
    display: flex;
    align-items: center;
    gap: 9px;

    margin-bottom: 18px;

    color: var(--blue);

    font-size: 9px;
    font-weight: 800;

    letter-spacing: 0.18em;
  }

  .feature-eyebrow span {
    width: 25px;
    height: 2px;

    background: var(--orange);
  }

  .workspace-copy h3 {
    margin: 0 0 17px;

    font-size: clamp(34px, 3.5vw, 54px);

    line-height: 0.98;

    letter-spacing: -0.045em;
  }

  .workspace-copy p {
    margin: 0;

    color: var(--muted);

    font-size: 15px;
    line-height: 1.7;
  }

  .workspace-copy ul {
    list-style: none;

    padding: 0;
    margin: 24px 0 0;
  }

  .workspace-copy li {
    display: flex;
    align-items: center;
    gap: 9px;

    margin-bottom: 10px;

    color: var(--ink);

    font-size: 12px;
    font-weight: 650;

    transition: transform 200ms ease;
  }

  .workspace-copy li:hover {
    transform: translateX(5px);
  }

  .workspace-copy li svg {
    color: var(--orange);
  }

  /* =========================================================
     MOCKUPS
     ========================================================= */

  .guidance-mock,
  .scenario-mock,
  .passport-mock {
    transition:
      transform 350ms ease,
      box-shadow 350ms ease;
  }

  .guidance-mock:hover {
    transform: translateY(-7px);

    box-shadow:
      20px 25px 0 rgba(18,59,102,0.1),
      0 25px 50px rgba(18,59,102,0.08);
  }

  .scenario-mock:hover {
    transform: translateY(-7px);

    box-shadow:
      -20px 25px 0 rgba(234,88,12,0.16),
      0 25px 50px rgba(18,59,102,0.12);
  }

  .guidance-mock {
    min-height: 420px;

    background: var(--white);

    border: 1px solid var(--line);

    box-shadow:
      15px 20px 0 rgba(18,59,102,0.07);
  }

  .mock-topbar {
    height: 54px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 20px;

    border-bottom: 1px solid var(--line);
  }

  .mock-file {
    display: flex;
    align-items: center;
    gap: 8px;

    color: var(--ink);

    font-size: 11px;
    font-weight: 650;
  }

  .mock-file svg {
    color: var(--orange);
  }

  .mock-status {
    color: var(--muted);

    font-size: 7px;
    font-weight: 800;

    letter-spacing: 0.16em;
  }

  .mock-content {
    display: grid;

    grid-template-columns: 0.85fr 1.15fr;

    min-height: 365px;
  }

  .mock-summary {
    padding: 25px 22px;

    border-right: 1px solid var(--line);
  }

  .mock-summary > span {
    color: var(--orange);

    font-size: 7px;
    font-weight: 800;

    letter-spacing: 0.15em;
  }

  .mock-summary h4 {
    margin: 15px 0 10px;

    color: var(--ink);

    font-size: 21px;
    line-height: 1.1;

    letter-spacing: -0.03em;
  }

  .mock-summary p {
    margin: 0;

    color: var(--muted);

    font-size: 11px;
    line-height: 1.6;
  }

  .mock-chat {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    gap: 13px;

    padding: 22px;

    background: #fbfaf8;
  }

  .mock-message {
    max-width: 85%;

    padding: 12px 14px;

    font-size: 11px;
    line-height: 1.55;

    transition: transform 200ms ease;
  }

  .mock-message:hover {
    transform: translateX(4px);
  }

  .mock-message.user {
    align-self: flex-end;

    background: var(--blue);
    color: white;
  }

  .mock-message.bot {
    align-self: flex-start;

    background: white;

    border: 1px solid var(--line);

    color: var(--muted);
  }

  .bot-label {
    display: block;

    margin-bottom: 5px;

    color: var(--orange);

    font-size: 7px;
    font-weight: 800;

    letter-spacing: 0.14em;
  }

  .mock-input {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 10px;

    min-height: 42px;

    padding: 0 12px;

    border: 1px solid var(--line);

    background: white;

    color: #9aa3ae;

    font-size: 10px;
  }

  .mock-input svg {
    color: var(--orange);

    animation: inputArrow 1.8s ease-in-out infinite;
  }

  @keyframes inputArrow {
    0%,
    100% {
      transform: translate(0, 0);
    }

    50% {
      transform: translate(3px, -3px);
    }
  }

  /* =========================================================
     SCENARIO
     ========================================================= */

  .scenario-mock {
    min-height: 430px;

    background: var(--blue);
    color: white;

    box-shadow:
      -15px 20px 0 rgba(234,88,12,0.13);
  }

  .scenario-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 20px;

    padding: 19px 22px;

    border-bottom: 1px solid rgba(255,255,255,0.15);
  }

  .scenario-header span {
    display: block;

    margin-bottom: 6px;

    color: var(--orange);

    font-size: 7px;
    font-weight: 800;

    letter-spacing: 0.16em;
  }

  .scenario-header strong {
    font-size: 15px;
  }

  .scenario-timer {
    color: rgba(255,255,255,0.65);

    font-size: 11px;

    font-variant-numeric: tabular-nums;
  }

  .scenario-body {
    padding: 28px 22px;
  }

  .scenario-context {
    padding-bottom: 23px;

    border-bottom: 1px solid rgba(255,255,255,0.12);
  }

  .scenario-label {
    color: rgba(255,255,255,0.4);

    font-size: 7px;
    font-weight: 800;

    letter-spacing: 0.16em;
  }

  .scenario-context p {
    max-width: 690px;

    margin: 10px 0 0;

    color: rgba(255,255,255,0.76);

    font-size: 13px;
    line-height: 1.6;
  }

  .scenario-question {
    padding-top: 24px;
  }

  .scenario-question h4 {
    max-width: 600px;

    margin: 10px 0 18px;

    font-size: 21px;

    line-height: 1.2;

    letter-spacing: -0.025em;
  }

  .scenario-options {
    display: grid;
    gap: 7px;
  }

  .scenario-options div {
    display: flex;
    align-items: center;

    gap: 11px;

    padding: 10px 12px;

    border: 1px solid rgba(255,255,255,0.13);

    color: rgba(255,255,255,0.7);

    font-size: 10px;

    transition:
      background 200ms ease,
      border-color 200ms ease,
      transform 200ms ease;
  }

  .scenario-options div:hover {
    background: rgba(255,255,255,0.05);

    border-color: var(--orange);

    transform: translateX(4px);
  }

  .scenario-options span {
    color: var(--orange);
    font-weight: 800;
  }

  .scenario-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 14px 22px;

    border-top: 1px solid rgba(255,255,255,0.13);

    color: rgba(255,255,255,0.45);

    font-size: 8px;
    font-weight: 750;

    letter-spacing: 0.12em;

    text-transform: uppercase;
  }

  /* =========================================================
     DIFFERENCE
     ========================================================= */

  .difference-layout {
    display: grid;

    grid-template-columns: 0.75fr 1.25fr;

    gap: 75px;

    align-items: start;
  }

  .difference-heading h2 {
    margin: 0;

    font-size: clamp(46px, 4.8vw, 72px);

    line-height: 0.95;

    letter-spacing: -0.06em;
  }

  .difference-heading h2 span {
    color: var(--blue);
  }

  .difference-heading p {
    max-width: 400px;

    margin: 22px 0 0;

    color: var(--muted);

    font-size: 14px;
    line-height: 1.7;
  }

  .difference-table {
    border-top: 1px solid var(--line);
  }

  .difference-row {
    display: grid;

    grid-template-columns: 1fr 1fr;

    min-height: 64px;

    border-bottom: 1px solid var(--line);

    transition:
      background 200ms ease,
      padding 200ms ease;
  }

  .difference-row:not(.difference-head):hover {
    background: rgba(18,59,102,0.025);
  }

  .difference-row > div,
  .difference-row > span {
    display: flex;
    align-items: center;

    gap: 9px;

    padding: 12px 17px;

    font-size: 12px;
  }

  .difference-row > div:first-child {
    color: #8b95a0;

    border-right: 1px solid var(--line);
  }

  .difference-row > div:last-child {
    color: var(--blue);
    font-weight: 700;
  }

  .difference-row svg {
    flex: 0 0 auto;
  }

  .difference-row div:first-child svg {
    color: #b0b8c1;
  }

  .difference-row div:last-child svg {
    color: var(--orange);
  }

  .difference-head {
    min-height: 42px;

    background: var(--offwhite);

    color: var(--muted);

    font-size: 8px;

    font-weight: 800;

    letter-spacing: 0.14em;
  }

  /* =========================================================
     CAPABILITY LOOP
     ========================================================= */

  .loop-layout {
    display: grid;

    grid-template-columns: 0.7fr 1.3fr;

    gap: 55px;

    align-items: center;
  }

  .loop-copy h2 {
    margin: 0;

    font-size: clamp(46px, 4.8vw, 74px);

    line-height: 0.95;

    letter-spacing: -0.06em;
  }

  .loop-copy h2 span {
    color: var(--orange);
  }

  .loop-copy p {
    max-width: 400px;

    margin: 24px 0;

    color: var(--muted);

    font-size: 14px;
    line-height: 1.7;
  }

  .landing-arrow-link {
    display: inline-flex;
    align-items: center;
    gap: 7px;

    color: var(--blue);

    text-decoration: none;

    font-size: 12px;
    font-weight: 750;

    transition: transform 220ms ease;
  }

  .landing-arrow-link:hover {
    transform: translateX(5px);
  }

  .landing-arrow-link svg {
    color: var(--orange);
  }

  .loop-visual {
    position: relative;

    min-height: 550px;
  }

  .loop-circle {
    position: absolute;

    border: 1px solid rgba(18,59,102,0.14);

    border-radius: 50%;

    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);
  }

  .loop-circle-outer {
    width: 500px;
    height: 500px;

    animation: rotateSlow 35s linear infinite;
  }

  .loop-circle-middle {
    width: 335px;
    height: 335px;

    border-color: rgba(234,88,12,0.28);

    animation: rotateSlowReverse 25s linear infinite;
  }

  .loop-circle-inner {
    width: 165px;
    height: 165px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: white;

    border-color: var(--orange);

    animation: innerPulse 4s ease-in-out infinite;
  }

  .loop-glyph {
    display: inline-block;
    color: rgba(9, 33, 61, 0.88);
    font-family: "Noto Serif Devanagari", "Noto Sans Devanagari", Georgia, serif;
    font-size: 68px;
    line-height: 1;
    font-weight: 700;
    transform: translateY(-2px);
  }

  @keyframes rotateSlow {
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  @keyframes rotateSlowReverse {
    to {
      transform: translate(-50%, -50%) rotate(-360deg);
    }
  }

  @keyframes innerPulse {
    0%,
    100% {
      box-shadow: 0 0 0 rgba(234,88,12,0);
    }

    50% {
      box-shadow:
        0 0 0 12px rgba(234,88,12,0.04),
        0 0 35px rgba(234,88,12,0.12);
    }
  }

  .loop-node {
    position: absolute;

    min-width: 132px;

    padding: 11px 13px;

    background: white;

    border: 1px solid var(--line);

    box-shadow:
      7px 7px 0 rgba(18,59,102,0.05);

    transition:
      transform 250ms ease,
      box-shadow 250ms ease;
  }

  .loop-node:hover {
    box-shadow:
      10px 10px 0 rgba(234,88,12,0.09);

    transform: translateY(-5px);
  }

  .loop-node span,
  .loop-node small,
  .loop-node strong {
    display: block;
  }

  .loop-node span {
    margin-bottom: 4px;

    color: var(--orange);

    font-size: 7px;
    font-weight: 800;
  }

  .loop-node strong {
    color: var(--ink);

    font-size: 10px;

    letter-spacing: 0.04em;
  }

  .loop-node small {
    margin-top: 3px;

    color: var(--muted);

    font-size: 8px;
  }

  .loop-node-top {
    top: 2%;
    left: 50%;

    transform: translateX(-50%);
  }

  .loop-node-right {
    top: 30%;
    right: 0;
  }

  .loop-node-bottom-right {
    right: 13%;
    bottom: 6%;
  }

  .loop-node-bottom-left {
    bottom: 6%;
    left: 13%;
  }

  .loop-node-left {
    top: 30%;
    left: 0;
  }

  /* =========================================================
     PASSPORT
     ========================================================= */

  .passport-layout {
    display: grid;

    grid-template-columns: 0.75fr 1.25fr;

    gap: 80px;

    align-items: center;
  }

  .passport-copy h2 {
    margin: 0;

    font-size: clamp(46px, 4.8vw, 72px);

    line-height: 0.95;

    letter-spacing: -0.06em;
  }

  .passport-copy h2 span {
    color: var(--blue);
  }

  .passport-copy p {
    max-width: 420px;

    margin: 24px 0;

    color: var(--muted);

    font-size: 14px;
    line-height: 1.7;
  }

  .passport-points {
    display: grid;
    gap: 11px;
  }

  .passport-points div {
    display: flex;
    align-items: center;

    gap: 9px;

    color: var(--ink);

    font-size: 12px;
    font-weight: 650;

    transition: transform 200ms ease;
  }

  .passport-points div:hover {
    transform: translateX(5px);
  }

  .passport-points svg {
    color: var(--orange);
  }

  .passport-mock {
    padding: 21px;

    background: var(--offwhite);

    border: 1px solid var(--line);

    transition:
      transform 300ms ease,
      box-shadow 300ms ease;
  }

  .passport-mock:hover {
    transform: translateY(-6px);

    box-shadow:
      0 20px 40px rgba(18,59,102,0.08);
  }

  .passport-mock-header {
    display: flex;
    justify-content: space-between;

    padding-bottom: 15px;

    border-bottom: 1px solid var(--line);

    color: var(--muted);

    font-size: 8px;
    font-weight: 800;

    letter-spacing: 0.14em;
  }

  .passport-score {
    padding: 22px 0;

    border-bottom: 1px solid var(--line);
  }

  .passport-score > div:first-child {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .passport-score span {
    color: var(--muted);

    font-size: 8px;
    font-weight: 800;

    letter-spacing: 0.13em;
  }

  .passport-score strong {
    color: var(--blue);

    font-size: 43px;

    line-height: 0.9;

    letter-spacing: -0.05em;
  }

  .score-bar {
    height: 6px;

    margin-top: 17px;

    background: #e6e9eb;

    overflow: hidden;
  }

  .score-bar span {
    display: block;

    width: 72%;
    height: 100%;

    background: var(--orange);

    transform-origin: left;

    animation: progressGrow 1.4s cubic-bezier(.22,1,.36,1);
  }

  .passport-domains {
    display: grid;

    gap: 15px;

    padding: 22px 0;

    border-bottom: 1px solid var(--line);
  }

  .passport-domains > div {
    display: grid;

    grid-template-columns: 1fr auto;

    gap: 8px;
  }

  .passport-domains span {
    color: var(--ink);

    font-size: 11px;
    font-weight: 650;
  }

  .passport-domains strong {
    color: var(--blue);

    font-size: 11px;
  }

  .passport-domains i {
    grid-column: 1 / -1;

    height: 4px;

    background: #e5e8eb;

    overflow: hidden;
  }

  .passport-domains b {
    display: block;

    height: 100%;

    background: var(--blue);

    transform-origin: left;

    animation: progressGrow 1.3s cubic-bezier(.22,1,.36,1);
  }

  @keyframes progressGrow {
    from {
      transform: scaleX(0);
    }

    to {
      transform: scaleX(1);
    }
  }

  .passport-bottom {
    display: grid;

    grid-template-columns: 1fr 1fr;

    gap: 18px;

    padding-top: 20px;
  }

  .passport-bottom div {
    display: flex;
    flex-direction: column;

    gap: 6px;
  }

  .passport-bottom span {
    color: var(--muted);

    font-size: 7px;
    font-weight: 800;

    letter-spacing: 0.13em;
  }

  .passport-bottom strong {
    color: var(--ink);

    font-size: 18px;

    letter-spacing: -0.025em;
  }

  /* =========================================================
     SIH
     ========================================================= */

  .sih-inner {
    display: grid;

    grid-template-columns: 0.35fr 1.65fr;

    gap: 65px;
  }

  .sih-number {
    padding-top: 8px;
  }

  .sih-number span,
  .sih-number strong {
    display: block;
  }

  .sih-number span {
    color: var(--orange);

    font-size: 9px;
    font-weight: 800;

    letter-spacing: 0.18em;
  }

  .sih-number strong {
    margin-top: 5px;

    font-size: 43px;

    line-height: 0.9;

    letter-spacing: -0.05em;
  }

  .sih-section .landing-section-label {
    color: rgba(255,255,255,0.65);
  }

  .sih-copy h2 {
    max-width: 900px;

    margin: 0;

    font-size: clamp(46px, 4.8vw, 72px);

    line-height: 0.95;

    letter-spacing: -0.06em;
  }

  .sih-copy h2 span {
    color: var(--orange);
  }

  .sih-copy > p {
    max-width: 700px;

    margin: 25px 0 40px;

    color: rgba(255,255,255,0.66);

    font-size: 14px;
    line-height: 1.75;
  }

  .sih-meta-grid {
    display: grid;

    grid-template-columns: repeat(3, 1fr);

    gap: 1px;

    background: rgba(255,255,255,0.15);
  }

  .sih-meta-grid div {
    min-height: 105px;

    padding: 19px;

    background: var(--blue);

    transition:
      background 250ms ease,
      transform 250ms ease;
  }

  .sih-meta-grid div:hover {
    background: var(--blue-dark);

    transform: translateY(-3px);
  }

  .sih-meta-grid span {
    display: block;

    margin-bottom: 10px;

    color: rgba(255,255,255,0.38);

    font-size: 7px;
    font-weight: 800;

    letter-spacing: 0.16em;
  }

  .sih-meta-grid strong {
    color: white;

    font-size: 12px;

    line-height: 1.5;
  }

  /* =========================================================
     FINAL CTA
     ========================================================= */

  .final-cta {
    position: relative;
    z-index: 1;

    min-height: 560px;

    display: flex;
    align-items: center;

    overflow: hidden;

    background: var(--offwhite);

    border-bottom: 1px solid var(--line);
  }

  .final-cta .architecture-line {
    top: 50%;
    right: -70px;
    width: min(58vw, 880px);
    height: min(58vw, 880px);
    transform: translateY(-50%);
    opacity: 0.92;
  }

  .final-cta .architecture-line g {
    stroke-width: 10px;
    transform-box: fill-box;
    transform-origin: center;
    animation: finalCtaCurveDrift 8s ease-in-out infinite;
  }

  .final-cta-emblem {
    position: absolute;
    top: 50%;
    right: clamp(90px, 12vw, 230px);
    z-index: 3;
    width: min(32vw, 380px);
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .final-cta-emblem .engine-script-orbit {
    width: 100%;
    border-color: rgba(18, 59, 102, 0.2);
    border-top-color: var(--orange);
  }

  .final-cta-emblem .engine-script-glyph {
    color: var(--blue);
    font-size: clamp(150px, 19vw, 250px);
  }

  @media (max-width: 1180px) {
    .final-cta-emblem {
      display: none;
    }
  }

  @keyframes finalCtaCurveDrift {
    0%,
    100% {
      transform: translate(0, 0);
    }

    50% {
      transform: translate(-14px, 8px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .final-cta .architecture-line g {
      animation: none;
    }
  }

  .final-cta-content {
    position: relative;
    z-index: 4;

    width: min(1380px, calc(100% - 72px));

    margin: 0 auto;
  }

  .final-kicker {
    display: block;

    margin-bottom: 18px;

    color: var(--orange);

    font-size: 9px;
    font-weight: 850;

    letter-spacing: 0.2em;
  }

  .final-cta h2 {
    max-width: 900px;

    margin: 0;

    font-size: clamp(54px, 6.5vw, 102px);

    line-height: 0.92;

    letter-spacing: -0.065em;
  }

  .final-cta h2 span {
    color: var(--blue);
  }

  .final-cta p {
    max-width: 540px;

    margin: 25px 0;

    color: var(--muted);

    font-size: 15px;
    line-height: 1.65;
  }

  .final-actions {
    display: flex;
    align-items: center;

    gap: 12px;
  }

  /* =========================================================
     FRAMER MOTION ELEMENT SUPPORT
     ========================================================= */

  .flow-step,
  .engine-card,
  .workspace-feature,
  .difference-layout,
  .passport-copy,
  .passport-mock {
    will-change: transform, opacity;
  }

  /* =========================================================
     RESPONSIVE
     ========================================================= */

  @media (max-width: 1180px) {
    .content-width,
    .hero-content,
    .final-cta-content {
      width: min(calc(100% - 52px), 1100px);
    }

    .capability-flow {
      grid-template-columns: repeat(3, 1fr);
    }

    .flow-arrow {
      display: none;
    }
    .roadmap-usp-layout {
      grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
      gap: 34px;
    }
    .roadmap-usp-copy h2 {
      font-size: 43px;
    }

    .engine-card-large {
      grid-column: span 1;
    }

    .engine-script-card {
      grid-column: auto;
      grid-row: auto;
    }

    .engines-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .workspace-feature,
    .workspace-feature.reverse {
      grid-template-columns: 1fr;

      gap: 45px;
    }

    .workspace-feature.reverse .workspace-copy,
    .workspace-feature.reverse .workspace-visual {
      order: initial;
    }

    .loop-layout,
    .passport-layout {
      grid-template-columns: 1fr;

      gap: 55px;
    }

    .loop-copy {
      max-width: 600px;
    }

    .sih-inner {
      grid-template-columns: 1fr;
    }

    .sih-number {
      padding: 0;
    }
  }

  @media (max-width: 800px) {
    .content-width,
    .hero-content,
    .final-cta-content {
      width: calc(100% - 32px);
    }

    .hero-section {
      min-height: 650px;
    }

    .hero-content {
      padding: 70px 0 80px;
    }

    .hero-content h1 {
      font-size: clamp(50px, 14vw, 86px);
    }

    .hero-description {
      font-size: 15px;
    }

    .hero-actions {
      align-items: stretch;
      flex-direction: column;
      width: 210px;
    }

    .hero-context {
      align-items: flex-start;
      flex-direction: column;
      gap: 8px;

      margin-top: 42px;
    }

    .context-divider {
      width: 22px;
    }

    .hero-side-note {
      display: none;
    }

    .architecture-line {
      top: 80px;
      right: -280px;

      width: 580px;

      opacity: 0.07;
    }

    .final-cta-emblem {
      display: none;
    }

    .problem-layout,
    .solution-intro,
    .engines-heading,
    .roadmap-usp-layout,
    .difference-layout,
    .passport-layout {
      grid-template-columns: 1fr;

      gap: 35px;
    }
    .roadmap-usp-copy h2 {
      font-size: 48px;
    }

    .roadmap-preview {
      padding: 19px 18px 17px;
    }

    .problem-heading h2,
    .solution-intro h2,
    .engines-heading h2,
    .workspace-heading h2,
    .difference-heading h2,
    .loop-copy h2,
    .passport-copy h2,
    .sih-copy h2 {
      font-size: clamp(43px, 12vw, 65px);
    }

    .problem-statement {
      padding: 27px;
    }

    .problem-statement h3 {
      font-size: 32px;
    }

    .capability-flow {
      grid-template-columns: 1fr;
    }

    .flow-step {
      min-height: auto;
    }

    .engines-grid {
      grid-template-columns: 1fr;
    }

    .engine-card,
    .engine-card-large {
      grid-column: span 1;

      min-height: 300px;
    }

    .workspace-heading {
      grid-template-columns: 1fr;

      gap: 25px;

      margin-bottom: 65px;
    }

    .workspace-feature {
      margin-bottom: 75px;
    }

    .mock-content {
      grid-template-columns: 1fr;
    }

    .mock-summary {
      border-right: none;
      border-bottom: 1px solid var(--line);
    }

    .loop-visual {
      min-height: 480px;

      transform: scale(0.78);

      transform-origin: center;

      margin: -60px -80px;
    }

    .loop-circle-outer {
      width: 460px;
      height: 460px;
    }

    .loop-circle-middle {
      width: 310px;
      height: 310px;
    }

    .loop-circle-inner {
      width: 150px;
      height: 150px;
    }

    .sih-meta-grid {
      grid-template-columns: 1fr;
    }

    .final-cta {
      min-height: 520px;
    }

    .final-cta h2 {
      font-size: clamp(52px, 13vw, 80px);
    }

    .landing-section-label {
      margin-bottom: 30px;
    }

    .problem-section,
    .solution-section,
    .engines-section,
    .roadmap-usp,
    .workspace-section,
    .difference-section,
    .loop-section,
    .passport-section,
    .sih-section {
      padding-top: 75px;
      padding-bottom: 80px;
    }
  }


  /* =========================================================
     KUSHALAI — TYPOGRAPHY / READABILITY UPGRADE
     Bigger type, stronger hierarchy, high-visibility orange
     ========================================================= */

  .landing-page {
    font-family:
      Inter, "Segoe UI", Arial, sans-serif;
    font-size: 16px;
    font-weight: 500;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  /* Stronger global hierarchy */
  .landing-page h1,
  .landing-page h2,
  .landing-page h3,
  .landing-page h4,
  .landing-page strong {
    font-weight: 800;
  }

  .landing-page p,
  .landing-page li,
  .landing-page span {
    font-weight: 550;
  }

  /* Orange is an intentional visual accent — never let it look faint */
  .landing-page .hero-word-orange,
  .landing-page .problem-heading em,
  .landing-page .engines-heading h2 span,
  .landing-page .roadmap-usp-copy h2 span,
  .landing-page .workspace-heading h2 span,
  .landing-page .loop-copy h2 span,
  .landing-page .sih-copy h2 span,
  .landing-page .final-kicker,
  .landing-page .landing-section-label > span,
  .landing-page .engine-tag,
  .landing-page .feature-eyebrow,
  .landing-page .scenario-header span,
  .landing-page .scenario-options span,
  .landing-page .bot-label,
  .landing-page .mock-summary > span,
  .landing-page .kicker-mark,
  .landing-page .context-divider,
  .landing-page .landing-section-label div,
  .landing-page .scenario-label,
  .landing-page .roadmap-stage-current .roadmap-stage-category,
  .landing-page .roadmap-stage-current .roadmap-stage-status,
  .landing-page .roadmap-contrast > div + div span,
  .landing-page .roadmap-next-label {
    color: var(--orange);
    font-weight: 900;
    opacity: 1;
  }

  .landing-page .hero-word-orange {
    text-shadow: 0 0 0.01px currentColor;
  }

  /* Section labels: no more tiny micro-text */
  .landing-page .landing-section-label {
    font-size: 13px;
    font-weight: 850;
    letter-spacing: 0.14em;
  }

  .landing-page .landing-section-label > span {
    font-size: 13px;
    font-weight: 900;
  }

  /* Hero */
  .landing-page .hero-kicker {
    font-size: 14px;
    font-weight: 850;
    letter-spacing: 0.12em;
  }

  .landing-page .hero-description {
    font-size: 18px;
    line-height: 1.65;
    font-weight: 550;
    color: #4f5d6d;
  }

  .landing-page .hero-primary,
  .landing-page .hero-secondary {
    min-height: 52px;
    padding: 0 22px;
    font-size: 15px;
    font-weight: 850;
  }

  .landing-page .hero-context {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: #687586;
  }

  .landing-page .hero-side-note {
    font-size: 11px;
    font-weight: 850;
  }

  /* Body copy */
  .landing-page .problem-copy p,
  .landing-page .solution-intro p,
  .landing-page .engines-heading p,
  .landing-page .workspace-heading p,
  .landing-page .workspace-copy p,
  .landing-page .difference-heading p,
  .landing-page .loop-copy p,
  .landing-page .passport-copy p,
  .landing-page .sih-copy > p,
  .landing-page .final-cta p {
    font-size: 17px;
    line-height: 1.7;
    font-weight: 550;
  }

  .landing-page .problem-copy .problem-lead {
    font-size: 21px;
    font-weight: 700;
    line-height: 1.5;
  }

  .landing-page .problem-callout span {
    font-size: 16px;
    line-height: 1.6;
    font-weight: 600;
  }

  .landing-page .problem-statement h3 {
    font-weight: 800;
  }

  .landing-page .ps-meta,
  .landing-page .ps-footer {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.11em;
  }

  /* Solution flow */
  .landing-page .flow-number {
    width: 38px;
    height: 38px;
    font-size: 11px;
    font-weight: 900;
  }

  .landing-page .flow-step h3 {
    font-size: 23px;
    font-weight: 800;
  }

  .landing-page .flow-step p {
    font-size: 15px;
    line-height: 1.6;
    font-weight: 550;
  }

  /* Engine cards */
  .landing-page .engine-number {
    font-size: 12px;
    font-weight: 900;
  }

  .landing-page .engine-tag {
    font-size: 11px;
    letter-spacing: 0.14em;
  }

  .landing-page .engine-content h3 {
    font-size: 28px;
    font-weight: 800;
  }

  .landing-page .engine-content p {
    font-size: 15px;
    line-height: 1.65;
    font-weight: 550;
    color: rgba(255,255,255,0.76);
  }

  .landing-page .engine-script-caption {
    font-size: 17px;
    font-weight: 700;
  }

  .landing-page .engine-script-index {
    font-size: 10px;
    font-weight: 850;
  }

  .landing-page .roadmap-feature-list li {
    font-size: 15px;
    font-weight: 700;
  }

  .landing-page .roadmap-contrast span {
    font-size: 11px;
    font-weight: 850;
  }

  .landing-page .roadmap-contrast p {
    font-size: 13px;
    font-weight: 750;
  }

  .landing-page .roadmap-stage-category {
    font-size: 10px;
    font-weight: 850;
  }

  .landing-page .roadmap-stage-status {
    font-size: 11px;
    font-weight: 750;
  }

  .landing-page .roadmap-next-label {
    font-size: 10px;
  }

  .landing-page .roadmap-next-step strong {
    font-size: 15px;
    font-weight: 800;
  }

  /* Workspace */
  .landing-page .feature-eyebrow {
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.14em;
  }

  .landing-page .workspace-copy h3 {
    font-weight: 800;
  }

  .landing-page .workspace-copy li {
    font-size: 15px;
    font-weight: 700;
  }

  /* Mockups — make internal UI readable instead of decorative */
  .landing-page .mock-file {
    font-size: 13px;
    font-weight: 700;
  }

  .landing-page .mock-status,
  .landing-page .mock-summary > span,
  .landing-page .bot-label,
  .landing-page .scenario-header span,
  .landing-page .scenario-label,
  .landing-page .scenario-footer,
  .landing-page .passport-mock-header,
  .landing-page .passport-score span,
  .landing-page .passport-bottom span,
  .landing-page .sih-meta-grid span {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.12em;
  }

  .landing-page .mock-summary h4 {
    font-size: 24px;
    font-weight: 800;
  }

  .landing-page .mock-summary p,
  .landing-page .mock-message,
  .landing-page .mock-input {
    font-size: 13px;
    line-height: 1.6;
    font-weight: 550;
  }

  .landing-page .bot-label {
    font-size: 10px;
  }

  .landing-page .scenario-header strong {
    font-size: 18px;
    font-weight: 800;
  }

  .landing-page .scenario-timer {
    font-size: 14px;
    font-weight: 700;
  }

  .landing-page .scenario-context p {
    font-size: 15px;
    line-height: 1.65;
    font-weight: 550;
  }

  .landing-page .scenario-question h4 {
    font-size: 24px;
    font-weight: 800;
  }

  .landing-page .scenario-options div {
    font-size: 13px;
    line-height: 1.5;
    font-weight: 650;
  }

  /* Difference table */
  .landing-page .difference-row > div,
  .landing-page .difference-row > span {
    font-size: 14px;
    font-weight: 650;
  }

  .landing-page .difference-row > div:last-child {
    font-weight: 800;
  }

  .landing-page .difference-head {
    font-size: 10px;
    font-weight: 900;
  }

  /* Capability loop */
  .landing-page .landing-arrow-link {
    font-size: 15px;
    font-weight: 850;
  }

  .landing-page .loop-node span {
    font-size: 10px;
    font-weight: 900;
  }

  .landing-page .loop-node strong {
    font-size: 13px;
    font-weight: 850;
  }

  .landing-page .loop-node small {
    font-size: 11px;
    font-weight: 600;
  }

  /* Skill passport */
  .landing-page .passport-points div {
    font-size: 15px;
    font-weight: 700;
  }

  .landing-page .passport-score span {
    font-size: 10px;
  }

  .landing-page .passport-score strong {
    font-size: 50px;
    font-weight: 850;
  }

  .landing-page .passport-domains span,
  .landing-page .passport-domains strong {
    font-size: 14px;
    font-weight: 700;
  }

  .landing-page .passport-bottom strong {
    font-size: 21px;
    font-weight: 800;
  }

  /* SIH */
  .landing-page .sih-number span {
    font-size: 12px;
    font-weight: 900;
  }

  .landing-page .sih-number strong {
    font-size: 50px;
    font-weight: 850;
  }

  .landing-page .sih-meta-grid div {
    min-height: 120px;
  }

  .landing-page .sih-meta-grid strong {
    font-size: 14px;
    line-height: 1.55;
    font-weight: 750;
  }

  /* Final CTA */
  .landing-page .final-kicker {
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 0.18em;
  }

  .landing-page .final-cta p {
    font-size: 18px;
    font-weight: 550;
  }

  /* Icons and orange accents stay crisp */
  .landing-page svg {
    stroke-width: 2.25;
  }

  .landing-page .engine-icon,
  .landing-page .flow-number,
  .landing-page .loop-node,
  .landing-page .passport-points div,
  .landing-page .workspace-copy li {
    transition:
      transform 220ms ease,
      box-shadow 220ms ease,
      border-color 220ms ease;
  }

  /* Tablet */
  @media (max-width: 800px) {
    .landing-page .hero-kicker {
      font-size: 12px;
    }

    .landing-page .hero-description {
      font-size: 17px;
    }

    .landing-page .hero-context {
      font-size: 11px;
    }

    .landing-page .problem-copy p,
    .landing-page .solution-intro p,
    .landing-page .engines-heading p,
    .landing-page .roadmap-usp-copy > p,
    .landing-page .workspace-heading p,
    .landing-page .workspace-copy p,
    .landing-page .difference-heading p,
    .landing-page .loop-copy p,
    .landing-page .passport-copy p,
    .landing-page .sih-copy > p,
    .landing-page .final-cta p {
      font-size: 16px;
    }

    .landing-page .flow-step p,
    .landing-page .workspace-copy li,
    .landing-page .passport-points div {
      font-size: 14px;
    }
  }

  /* Small phones — still intentionally readable */
  @media (max-width: 520px) {
    .landing-page {
      font-size: 15px;
    }

    .landing-page .hero-kicker,
    .landing-page .landing-section-label {
      font-size: 11px;
    }

    .landing-page .hero-description,
    .landing-page .problem-copy p,
    .landing-page .solution-intro p,
    .landing-page .engines-heading p,
    .landing-page .roadmap-usp-copy > p,
    .landing-page .workspace-heading p,
    .landing-page .workspace-copy p,
    .landing-page .difference-heading p,
    .landing-page .loop-copy p,
    .landing-page .passport-copy p,
    .landing-page .sih-copy > p,
    .landing-page .final-cta p {
      font-size: 15px;
    }

    .landing-page .problem-copy .problem-lead {
      font-size: 18px;
    }

    .landing-page .flow-step p,
    .landing-page .workspace-copy li,
    .landing-page .difference-row > div,
    .landing-page .difference-row > span,
    .landing-page .passport-points div {
      font-size: 13px;
    }

    .landing-page .engine-content h3 {
      font-size: 25px;
    }

    .landing-page .engine-content p {
      font-size: 14px;
    }

    .landing-page .mock-summary h4,
    .landing-page .scenario-question h4 {
      font-size: 21px;
    }

    .landing-page .mock-summary p,
    .landing-page .mock-message,
    .landing-page .mock-input,
    .landing-page .scenario-context p {
      font-size: 13px;
    }

    .landing-page .scenario-options div {
      font-size: 12px;
    }

    .landing-page .loop-node strong {
      font-size: 12px;
    }

    .landing-page .loop-node small {
      font-size: 10px;
    }
  }

  /* =========================================================
     LEARNING ROADMAP JOURNEY
     ========================================================= */

  .learning-roadmap-intro {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(300px, 0.9fr);
    align-items: end;
    gap: 56px;
    margin-bottom: 40px;
  }

  .learning-roadmap-intro h2 {
    margin: 0;
    color: var(--ink);
    font-size: 60px;
    font-weight: 850;
    line-height: 0.98;
    letter-spacing: -0.05em;
  }

  .learning-roadmap-intro h2 span {
    color: var(--orange);
  }

  .learning-roadmap-intro p {
    max-width: 500px;
    margin: 0 0 4px;
    color: #596779;
    font-size: 18px;
    font-weight: 550;
    line-height: 1.65;
  }

  .learning-roadmap-generation {
    margin-bottom: 30px;
    padding: 16px 0 18px;
    border-top: 1px solid rgba(18,59,102,0.18);
    border-bottom: 1px solid rgba(18,59,102,0.18);
  }

  .learning-roadmap-generation-copy {
    display: grid;
    grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
    align-items: baseline;
    gap: 30px;
    margin-bottom: 16px;
  }

  .learning-roadmap-generation-copy h3 {
    margin: 0;
    color: var(--ink);
    font-size: 21px;
    font-weight: 850;
    line-height: 1.25;
  }

  .learning-roadmap-generation-copy h3 span {
    color: var(--orange);
  }

  .learning-roadmap-generation-copy p {
    margin: 0;
    color: #596779;
    font-size: 15px;
    font-weight: 550;
    line-height: 1.55;
  }

  .learning-roadmap-process {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1.3fr) auto minmax(0, 0.9fr) auto minmax(0, 1.2fr);
    align-items: center;
    gap: 12px;
  }

  .learning-roadmap-process-step {
    display: grid;
    min-height: 40px;
    align-content: center;
    gap: 4px;
    padding-left: 10px;
    border-left: 2px solid var(--blue);
  }

  .learning-roadmap-process-step > span {
    color: var(--blue);
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.08em;
    line-height: 1.3;
  }

  .learning-roadmap-process-step small {
    color: #596779;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.35;
  }

  .learning-roadmap-process-result {
    border-left-color: var(--orange);
  }

  .learning-roadmap-process-result > span {
    color: var(--orange);
  }

  .learning-roadmap-operator {
    color: var(--orange);
    font-size: 20px;
    font-weight: 800;
  }

  .learning-roadmap-journey {
    position: relative;
  }

  .learning-roadmap-path-ends {
    display: flex;
    justify-content: space-between;
    padding: 0 8.2%;
    margin-bottom: 6px;
    color: var(--orange);
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.13em;
  }

  .learning-roadmap-mobile-start,
  .learning-roadmap-mobile-end {
    display: none;
  }

  .learning-roadmap-stages-wrap {
    position: relative;
  }

  .learning-roadmap-journey-svg {
    position: absolute;
    inset: 0 0 auto;
    display: block;
    width: 100%;
    height: 56px;
    overflow: visible;
  }

  .learning-roadmap-journey-svg path {
    fill: none;
    stroke-linecap: round;
    stroke-width: 2.5px;
  }

  .learning-roadmap-path-future {
    stroke: var(--line);
    stroke-dasharray: 6 8;
  }

  .learning-roadmap-path-completed {
    stroke: var(--blue);
    stroke-width: 3px !important;
  }

  .learning-roadmap-path-current {
    stroke: var(--orange);
    stroke-width: 3px !important;
  }

  .learning-roadmap-stages {
    position: relative;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  .learning-roadmap-stage {
    display: flex;
    min-width: 0;
    flex-direction: column;
    align-items: center;
    padding: 0 8px;
    text-align: center;
  }

  .learning-roadmap-stage-marker {
    position: relative;
    z-index: 1;
    display: grid;
    width: 40px;
    height: 40px;
    flex: 0 0 auto;
    place-items: center;
    margin: 8px 0 14px;
    border: 2px solid rgba(18,59,102,0.28);
    border-radius: 50%;
    background: var(--offwhite);
    color: #778395;
    font-size: 11px;
    font-weight: 900;
  }

  .learning-roadmap-stage-completed .learning-roadmap-stage-marker {
    border-color: var(--blue);
    background: var(--blue);
    color: var(--white);
  }

  .learning-roadmap-stage-current .learning-roadmap-stage-marker {
    border-color: var(--orange);
    background: var(--orange);
    color: var(--white);
  }

  .learning-roadmap-stage-current .learning-roadmap-stage-marker::after {
    content: '';
    position: absolute;
    inset: -6px;
    border: 1px solid var(--orange);
    border-radius: 50%;
    animation: learningRoadmapPulse 2.8s ease-out infinite;
  }

  @keyframes learningRoadmapPulse {
    0% { opacity: 0.65; transform: scale(0.88); }
    100% { opacity: 0; transform: scale(1.32); }
  }

  .learning-roadmap-stage-copy {
    display: grid;
    width: 100%;
    min-height: 154px;
    align-content: start;
    justify-items: center;
    gap: 9px;
    padding: 14px 10px 12px;
    border-top: 1px solid rgba(18,59,102,0.18);
  }

  .learning-roadmap-stage-current .learning-roadmap-stage-copy {
    border-top: 2px solid var(--orange);
    background: rgba(234,88,12,0.055);
  }

  .learning-roadmap-stage-category {
    color: #667085;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.12em;
    line-height: 1.3;
  }

  .learning-roadmap-stage-current .learning-roadmap-stage-category,
  .learning-roadmap-stage-current .learning-roadmap-stage-status {
    color: var(--orange);
  }

  .learning-roadmap-stage-copy h3 {
    margin: 0;
    color: var(--ink);
    font-size: 16px;
    font-weight: 800;
    line-height: 1.35;
  }

  .learning-roadmap-stage-current .learning-roadmap-stage-copy h3 {
    color: var(--blue-dark);
  }

  .learning-roadmap-stage-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #778395;
    font-size: 12px;
    font-weight: 750;
    line-height: 1.3;
  }

  .learning-roadmap-stage-completed .learning-roadmap-stage-status {
    color: var(--blue);
  }

  .learning-roadmap-stage-status svg {
    flex: 0 0 auto;
  }

  @media (max-width: 1180px) {
    .learning-roadmap-intro {
      gap: 34px;
    }

    .learning-roadmap-generation-copy {
      grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
      gap: 24px;
    }

    .learning-roadmap-process {
      gap: 8px;
    }

    .learning-roadmap-process-step > span {
      font-size: 10px;
    }

    .learning-roadmap-intro h2 {
      font-size: 52px;
    }

    .learning-roadmap-stage {
      padding-right: 4px;
      padding-left: 4px;
    }

    .learning-roadmap-stage-copy {
      padding-right: 6px;
      padding-left: 6px;
    }

    .learning-roadmap-stage-copy h3 {
      font-size: 15px;
    }
  }

  @media (max-width: 800px) {
    .learning-roadmap-intro {
      grid-template-columns: 1fr;
      gap: 16px;
      margin-bottom: 30px;
    }

    .learning-roadmap-generation {
      margin-bottom: 25px;
    }

    .learning-roadmap-generation-copy {
      grid-template-columns: 1fr;
      gap: 7px;
      margin-bottom: 13px;
    }

    .learning-roadmap-process {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .learning-roadmap-process-step {
      grid-template-columns: minmax(132px, 0.85fr) minmax(0, 1.15fr);
      align-items: center;
      gap: 12px;
      min-height: 43px;
      padding: 5px 0 5px 10px;
    }

    .learning-roadmap-process-step > span {
      font-size: 11px;
    }

    .learning-roadmap-process-step small {
      font-size: 13px;
    }

    .learning-roadmap-operator {
      display: grid;
      width: 24px;
      height: 18px;
      place-items: center;
      margin-left: 4px;
      font-size: 0;
    }

    .learning-roadmap-operator::after {
      content: '\\2193';
      color: var(--blue);
      font-size: 16px;
    }

    .learning-roadmap-intro h2 {
      font-size: 46px;
    }

    .learning-roadmap-intro p {
      font-size: 16px;
    }

    .learning-roadmap-path-ends,
    .learning-roadmap-journey-svg {
      display: none;
    }

    .learning-roadmap-mobile-start,
    .learning-roadmap-mobile-end {
      display: flex;
      align-items: center;
      gap: 9px;
      color: var(--orange);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.12em;
    }

    .learning-roadmap-mobile-start {
      margin: 0 0 7px 9px;
    }

    .learning-roadmap-stages {
      grid-template-columns: 1fr;
    }

    .learning-roadmap-stage {
      position: relative;
      display: grid;
      grid-template-columns: 38px minmax(0, 1fr);
      align-items: start;
      gap: 13px;
      min-height: 86px;
      padding: 12px 0;
      text-align: left;
    }

    .learning-roadmap-stage::before {
      content: '';
      position: absolute;
      z-index: 0;
      top: 30px;
      bottom: -30px;
      left: 17px;
      width: 2px;
      background: var(--line);
    }

    .learning-roadmap-stage-completed::before {
      background: var(--blue);
    }

    .learning-roadmap-stage-completed:nth-child(2)::before {
      background: var(--orange);
    }

    .learning-roadmap-stage-current::before,
    .learning-roadmap-stage-locked::before {
      background: repeating-linear-gradient(to bottom, var(--line) 0 5px, transparent 5px 10px);
    }

    .learning-roadmap-stage:last-child::before {
      display: none;
    }

    .learning-roadmap-stage-marker {
      width: 36px;
      height: 36px;
      margin: 0;
    }

    .learning-roadmap-stage-copy {
      min-height: 0;
      justify-items: start;
      gap: 5px;
      padding: 0 0 13px;
      border-top: 0;
      border-bottom: 1px solid rgba(18,59,102,0.16);
    }

    .learning-roadmap-stage-current .learning-roadmap-stage-copy {
      padding: 8px 10px 13px;
      border-top: 0;
      border-left: 2px solid var(--orange);
    }

    .learning-roadmap-stage-copy h3 {
      font-size: 16px;
    }

    .learning-roadmap-mobile-end {
      margin: 2px 0 0 9px;
    }

  }

  @media (max-width: 520px) {
    .learning-roadmap-intro h2 {
      font-size: 40px;
    }

    .learning-roadmap-intro p {
      font-size: 15px;
    }

    .learning-roadmap-generation-copy h3 {
      font-size: 20px;
    }

    .learning-roadmap-process-step {
      grid-template-columns: minmax(118px, 0.9fr) minmax(0, 1.1fr);
      gap: 8px;
    }

    .learning-roadmap-process-step > span {
      font-size: 10px;
    }

    .learning-roadmap-process-step small {
      font-size: 12px;
    }

    .learning-roadmap-stage-copy h3 {
      font-size: 15px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .learning-roadmap-stage-current .learning-roadmap-stage-marker::after {
      animation: none;
    }
  }

  /* =========================================================
     ACCESSIBILITY
     ========================================================= */

  @media (prefers-reduced-motion: reduce) {
    .landing-page *,
    .landing-page *::before,
    .landing-page *::after {
      scroll-behavior: auto !important;

      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;

      transition-duration: 0.01ms !important;
    }
  }
`}</style>
    </main>
  );
}