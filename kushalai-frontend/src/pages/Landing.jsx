import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowDown, ArrowRight, ArrowUpRight, BarChart3, Check, Compass,
  FileText, Route, Target, MessageSquare, ClipboardCheck, Layers3,
  Gauge, CircleDot,
} from 'lucide-react';

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

function SectionLabel({ children, number }) {
  return (
    <div className="landing-section-label">
      <span>{number}</span>
      <div />
      <strong>{children}</strong>
    </div>
  );
}

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

function EngineCard({ number, icon, title, description, tag, large = false }) {
  return (
    <motion.article variants={reveal} className={`engine-card ${large ? 'engine-card-large' : ''}`}>
      <div className="engine-top">
        <span className="engine-number">{number}</span>
        <div className="engine-icon">{icon}</div>
      </div>
      <div className="engine-content">
        <div className="engine-tag">{tag}</div>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="engine-line"><span /></div>
      </div>
    </motion.article>
  );
}

function WorkspaceFeature({ eyebrow, title, description, points, children, reverse = false }) {
  return (
    <motion.div variants={reveal} className={`workspace-feature ${reverse ? 'reverse' : ''}`}>
      <div className="workspace-copy">
        <div className="feature-eyebrow">
          <span />
          {eyebrow}
        </div>
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
            <motion.div variants={reveal} className="hero-kicker">
              <span className="kicker-mark" /> Smart Education · SIH 2026
            </motion.div>
            <motion.h1 variants={reveal}>
              From <span className="hero-word-blue">capability gaps</span> to <span className="hero-word-orange">field readiness.</span>
            </motion.h1>
            <motion.p variants={reveal} className="hero-description">
              KushalAI is a competency-driven learning platform designed to help public-sector professionals identify what they need to learn, discover the right learning path, understand difficult material, and prove that knowledge through practical assessment.
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
        <div className="hero-side-note">
          <span>01</span><div />
          <span>CAPABILITY<br />ARCHITECTURE</span>
        </div>
      </section>

      {/* PROBLEM STATEMENT */}
      <section id="problem" className="problem-section">
        <div className="content-width">
          <SectionLabel number="01">THE PROBLEM</SectionLabel>
          <div className="problem-layout">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={reveal} className="problem-heading">
              <h2>Learning exists.<br /><em>Direction is missing.</em></h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={reveal} className="problem-copy">
              <p className="problem-lead">Modern public-sector work demands continuously evolving statistical, digital and managerial capabilities.</p>
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
            <h3>An AI-enabled approach to competency assessment, targeted training and continuous capability building.</h3>
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
          <SectionLabel number="02">THE SOLUTION</SectionLabel>
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
          <SectionLabel number="03">THE CORE ENGINES</SectionLabel>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            <motion.div variants={reveal} className="engines-heading">
              <div>
                <h2>Five systems.<br /><span>One capability loop.</span></h2>
              </div>
              <p>The platform is organised around the decisions a learner needs to make throughout their development — not around isolated features.</p>
            </motion.div>
            <div className="engines-grid">
              <EngineCard number="01" tag="DIAGNOSIS" title="Competence Gap Engine" description="Maps the learner's current competency profile against defined skill requirements and surfaces the areas that need attention." icon={<BarChart3 size={24} />} large />
              <EngineCard number="02" tag="DIRECTION" title="Course Recommendation Engine" description="Converts identified gaps into a prioritised learning roadmap, helping the learner focus on the courses that matter most." icon={<Route size={24} />} />
              <EngineCard number="03" tag="VALIDATION" title="Assessment Engine" description="Uses course-linked quizzes and knowledge checks to validate whether learning has actually been retained." icon={<ClipboardCheck size={24} />} />
              <EngineCard number="04" tag="DEEP LEARNING" title="Doubts & Guidance" description="A learning workspace where learners can upload study material, ask questions, clarify concepts and generate practice questions." icon={<MessageSquare size={24} />} />
              <EngineCard number="05" tag="APPLICATION" title="Scenario Assessment Engine" description="Moves beyond recall into realistic administrative and statistical situations that test practical understanding and decision-making." icon={<Compass size={24} />} large />
            </div>
          </motion.div>
        </div>
      </section>

      {/* LEARNING WORKSPACE */}
      <section className="workspace-section">
        <div className="content-width">
          <SectionLabel number="04">LEARNING WORKSPACE</SectionLabel>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={stagger} className="workspace-heading">
            <motion.h2 variants={reveal}>Learning does not stop<br />at<span> watching a course.</span></motion.h2>
            <motion.p variants={reveal}>KushalAI gives the learner a space to move from consuming information to understanding it and finally applying it.</motion.p>
          </motion.div>
          <div className="workspace-features">
            {/* DOUBTS & GUIDANCE */}
            <WorkspaceFeature
              eyebrow="01 / UNDERSTAND"
              title="Doubts & Guidance"
              description="Turn static learning material into an interactive workspace. Upload a document, ask questions about it, clarify concepts and create practice questions from the material."
              points={[
                'Document-based learning workspace',
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
                    <p>Fundamentals, supervised learning, evaluation, overfitting and practical machine-learning workflows.</p>
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
              eyebrow="02 / APPLY"
              title="Scenario-Based Assessment"
              description="Move beyond traditional multiple-choice testing. Scenario assessments place learners inside realistic situations where they must reason, decide and respond."
              points={[
                'Real-world statistical situations',
                'Decision-making focused prompts',
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
                    <p>A district-level dataset shows statistically impossible variance in infant mortality rates compared with the five-year trend.</p>
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
          <SectionLabel number="05">THE DIFFERENCE</SectionLabel>
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
          <SectionLabel number="06">THE CAPABILITY LOOP</SectionLabel>
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
                    <img src="/assets/kushalAI_logo.png" alt="" />
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
              <SectionLabel number="07">CONTINUOUS VISIBILITY</SectionLabel>
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
              <SectionLabel number="08">THE CHALLENGE WE RESPONDED TO</SectionLabel>
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
        <div className="final-cta-content">
          <span className="final-kicker">KUSHALAI</span>
          <h2>Build capability.<br /><span>Not just course completion.</span></h2>
          <p>A competency-first learning experience designed to move from identifying gaps to demonstrating readiness.</p>
          <div className="final-actions">
            <Link to="/register" className="hero-primary">Explore KushalAI <ArrowUpRight size={18} /></Link>
            <Link to="/login" className="hero-secondary">Sign in <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      {/* STYLES */}
      <style>{`
        /* BASE */
        .landing-page {
          --blue: ${BLUE}; --blue-dark: ${BLUE_DARK}; --orange: ${ORANGE};
          --offwhite: ${OFFWHITE}; --white: ${WHITE}; --ink: ${INK};
          --muted: ${MUTED}; --line: ${LINE};
          position: relative; min-height: 100vh; overflow-x: hidden;
          background: var(--offwhite); color: var(--ink);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .landing-page *, .landing-page *::before, .landing-page *::after { box-sizing: border-box; }

        /* BACKGROUND */
        .landing-background { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
        .landing-grid { position: absolute; inset: 0; opacity: 0.25; background-image: linear-gradient(rgba(18, 59, 102, 0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(18, 59, 102, 0.045) 1px, transparent 1px); background-size: 56px 56px; }
        .landing-blue-block { position: absolute; width: 420px; height: 620px; right: -260px; top: 12%; border: 1px solid rgba(18, 59, 102, 0.08); transform: rotate(17deg); }
        .landing-orange-line { position: absolute; width: 180px; height: 1px; background: var(--orange); opacity: 0.65; }
        .landing-orange-line-1 { top: 28%; left: -30px; transform: rotate(-12deg); }
        .landing-orange-line-2 { right: -50px; bottom: 18%; transform: rotate(-16deg); }
        .landing-cross { position: absolute; color: var(--orange); font-size: 22px; font-weight: 300; }
        .landing-cross-1 { top: 19%; left: 5%; }
        .landing-cross-2 { right: 8%; bottom: 12%; }

        /* CONTENT WIDTH */
        .content-width { position: relative; width: min(1380px, calc(100% - 96px)); margin: 0 auto; }

        /* HERO */
        .hero-section { position: relative; z-index: 1; min-height: 760px; display: flex; align-items: center; overflow: hidden; border-bottom: 1px solid rgba(16, 36, 59, 0.12); }
        .hero-content { position: relative; z-index: 4; width: min(1380px, calc(100% - 96px)); margin: 0 auto; padding: 100px 0 125px; }
        .hero-kicker { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 30px; color: var(--blue); font-size: 12px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; }
        .kicker-mark { width: 28px; height: 3px; background: var(--orange); }
        .hero-content h1 { max-width: 1030px; margin: 0; color: var(--ink); font-size: clamp(64px, 8vw, 132px); line-height: 0.91; letter-spacing: -0.065em; font-weight: 820; }
        .hero-word-blue { display: block; color: var(--blue); }
        .hero-word-orange { display: block; color: var(--orange); }
        .hero-description { max-width: 650px; margin: 42px 0 0; color: #596779; font-size: 18px; line-height: 1.72; }
        .hero-actions { display: flex; align-items: center; gap: 18px; margin-top: 38px; }
        .hero-primary, .hero-secondary { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 50px; padding: 0 21px; text-decoration: none; font-size: 14px; font-weight: 750; transition: transform 180ms ease, background 180ms ease; }
        .hero-primary { background: var(--blue); color: white; }
        .hero-primary:hover { background: var(--blue-dark); transform: translateY(-2px); }
        .hero-secondary { color: var(--ink); border: 1px solid rgba(16, 36, 59, 0.2); }
        .hero-secondary:hover { transform: translateY(-2px); }
        .hero-context { display: flex; align-items: center; gap: 14px; margin-top: 76px; color: #7a8592; font-size: 10px; font-weight: 750; letter-spacing: 0.13em; text-transform: uppercase; }
        .context-divider { width: 28px; height: 1px; background: var(--orange); }
        .hero-side-note { position: absolute; right: 42px; bottom: 64px; z-index: 5; display: flex; align-items: center; gap: 12px; color: #8290a0; font-size: 9px; font-weight: 750; letter-spacing: 0.18em; writing-mode: vertical-rl; text-transform: uppercase; }
        .hero-side-note div { width: 1px; height: 50px; background: var(--orange); }

        /* ABSTRACT LINE */
        .architecture-line { position: absolute; z-index: 2; top: 30px; right: -40px; width: 720px; height: 720px; opacity: 0.13; pointer-events: none; }
        .landing-draw-path { stroke-dasharray: 3000; stroke-dashoffset: 3000; animation: landingDraw 5s cubic-bezier(.22,1,.36,1) forwards; }
        .landing-draw-delay-1 { animation-delay: 0.55s; }
        .landing-draw-delay-2 { animation-delay: 1s; }
        .landing-draw-delay-3 { animation-delay: 1.4s; }
        @keyframes landingDraw { to { stroke-dashoffset: 0; } }

        /* SECTION LABEL */
        .landing-section-label { display: flex; align-items: center; gap: 14px; margin-bottom: 54px; color: var(--blue); font-size: 10px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; }
        .landing-section-label span { color: var(--orange); }
        .landing-section-label div { width: 48px; height: 1px; background: var(--orange); }

        /* PROBLEM */
        .problem-section { position: relative; z-index: 1; padding: 130px 0 140px; background: var(--white); }
        .problem-layout { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 100px; align-items: start; }
        .problem-heading h2 { margin: 0; font-size: clamp(48px, 5.5vw, 82px); line-height: 0.98; letter-spacing: -0.055em; font-weight: 800; }
        .problem-heading em { color: var(--orange); font-style: normal; }
        .problem-copy { padding-top: 9px; }
        .problem-copy p { margin: 0 0 22px; color: var(--muted); font-size: 17px; line-height: 1.78; }
        .problem-copy .problem-lead { color: var(--ink); font-size: 22px; line-height: 1.5; font-weight: 620; }
        .problem-copy strong { color: var(--blue); }
        .problem-callout { display: flex; gap: 15px; margin-top: 35px; padding: 20px 0; color: var(--blue); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
        .problem-callout svg { flex: 0 0 auto; color: var(--orange); }
        .problem-callout span { font-size: 14px; line-height: 1.65; }
        .problem-statement { position: relative; margin-top: 100px; padding: 42px 48px; overflow: hidden; background: var(--blue); color: white; }
        .problem-statement::after { content: 'क'; position: absolute; right: 20px; bottom: -80px; color: rgba(255,255,255,0.055); font-size: 310px; line-height: 1; font-weight: 700; }
        .ps-meta, .ps-footer { position: relative; z-index: 2; display: flex; align-items: center; gap: 24px; flex-wrap: wrap; font-size: 10px; font-weight: 750; letter-spacing: 0.14em; text-transform: uppercase; }
        .ps-meta { color: rgba(255,255,255,0.65); }
        .ps-meta span:last-child { color: var(--orange); }
        .problem-statement h3 { position: relative; z-index: 2; max-width: 970px; margin: 32px 0 44px; font-size: clamp(30px, 3.8vw, 56px); line-height: 1.08; letter-spacing: -0.045em; font-weight: 700; }
        .ps-footer { position: relative; z-index: 2; padding-top: 22px; border-top: 1px solid rgba(255,255,255,0.16); color: rgba(255,255,255,0.58); }

        /* SOLUTION */
        .solution-section { position: relative; z-index: 1; padding: 130px 0 150px; background: var(--offwhite); }
        .solution-intro { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 100px; align-items: end; }
        .solution-intro h2 { margin: 0; font-size: clamp(52px, 6vw, 92px); line-height: 0.95; letter-spacing: -0.06em; font-weight: 800; }
        .solution-intro h2 span { color: var(--blue); }
        .solution-intro p { max-width: 450px; margin: 0; color: var(--muted); font-size: 17px; line-height: 1.75; }
        .capability-flow { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr auto 1fr; gap: 18px; align-items: stretch; margin-top: 85px; }
        .flow-step { min-height: 235px; padding: 24px; background: var(--white); border-top: 3px solid var(--blue); }
        .flow-number { width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; margin-bottom: 35px; border: 1px solid rgba(18,59,102,0.2); color: var(--blue); font-size: 10px; font-weight: 800; }
        .flow-number.orange { background: var(--orange); border-color: var(--orange); color: white; }
        .flow-step h3 { margin: 0 0 10px; font-size: 22px; letter-spacing: -0.025em; }
        .flow-step p { margin: 0; color: var(--muted); font-size: 13px; line-height: 1.65; }
        .flow-arrow { display: flex; align-items: center; justify-content: center; color: var(--orange); }

        /* CORE ENGINES */
        .engines-section { position: relative; z-index: 1; padding: 140px 0; background: var(--blue); color: white; }
        .engines-section .landing-section-label { color: rgba(255,255,255,0.72); }
        .engines-heading { display: grid; grid-template-columns: 1fr 0.7fr; gap: 100px; align-items: end; margin-bottom: 70px; }
        .engines-heading h2 { margin: 0; font-size: clamp(52px, 6vw, 92px); line-height: 0.92; letter-spacing: -0.06em; }
        .engines-heading h2 span { color: var(--orange); }
        .engines-heading p { max-width: 450px; margin: 0; color: rgba(255,255,255,0.65); font-size: 16px; line-height: 1.75; }
        .engines-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.15); }
        .engine-card { min-height: 390px; display: flex; flex-direction: column; justify-content: space-between; padding: 34px; position: relative; background: var(--blue); }
        .engine-card-large { grid-column: span 2; }
        .engine-top { display: flex; align-items: flex-start; justify-content: space-between; }
        .engine-number { color: rgba(255,255,255,0.35); font-size: 11px; font-weight: 800; letter-spacing: 0.14em; }
        .engine-icon { width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.18); color: var(--orange); }
        .engine-tag { margin-bottom: 16px; color: var(--orange); font-size: 9px; font-weight: 800; letter-spacing: 0.18em; }
        .engine-content h3 { max-width: 560px; margin: 0 0 15px; font-size: 28px; line-height: 1.05; letter-spacing: -0.035em; }
        .engine-content p { max-width: 570px; margin: 0; color: rgba(255,255,255,0.64); font-size: 14px; line-height: 1.7; }
        .engine-line { width: 100%; height: 1px; margin-top: 28px; background: rgba(255,255,255,0.12); }
        .engine-line span { display: block; width: 40px; height: 2px; background: var(--orange); }

        /* LEARNING WORKSPACE */
        .workspace-section { position: relative; z-index: 1; padding: 140px 0 160px; background: var(--offwhite); }
        .workspace-heading { display: grid; grid-template-columns: 1fr 0.65fr; gap: 100px; align-items: end; margin-bottom: 120px; }
        .workspace-heading h2 { margin: 0; font-size: clamp(50px, 6vw, 88px); line-height: 0.94; letter-spacing: -0.06em; }
        .workspace-heading h2 span { color: var(--orange); }
        .workspace-heading p { max-width: 450px; margin: 0; color: var(--muted); font-size: 17px; line-height: 1.75; }
        .workspace-feature { display: grid; grid-template-columns: 0.75fr 1.25fr; gap: 100px; align-items: center; margin-bottom: 150px; }
        .workspace-feature.reverse { grid-template-columns: 1.25fr 0.75fr; }
        .workspace-feature.reverse .workspace-copy { order: 2; }
        .workspace-feature.reverse .workspace-visual { order: 1; }
        .feature-eyebrow { display: flex; align-items: center; gap: 10px; margin-bottom: 22px; color: var(--blue); font-size: 10px; font-weight: 800; letter-spacing: 0.18em; }
        .feature-eyebrow span { width: 28px; height: 2px; background: var(--orange); }
        .workspace-copy h3 { margin: 0 0 20px; font-size: clamp(36px, 4vw, 58px); line-height: 0.98; letter-spacing: -0.045em; }
        .workspace-copy p { margin: 0; color: var(--muted); font-size: 16px; line-height: 1.78; }
        .workspace-copy ul { list-style: none; padding: 0; margin: 30px 0 0; }
        .workspace-copy li { display: flex; align-items: center; gap: 10px; margin-bottom: 13px; color: var(--ink); font-size: 13px; font-weight: 650; }
        .workspace-copy li svg { color: var(--orange); }

        /* GUIDANCE MOCK */
        .guidance-mock { min-height: 490px; background: var(--white); border: 1px solid var(--line); box-shadow: 20px 25px 0 rgba(18,59,102,0.07); }
        .mock-topbar { height: 62px; display: flex; align-items: center; justify-content: space-between; padding: 0 22px; border-bottom: 1px solid var(--line); }
        .mock-file { display: flex; align-items: center; gap: 9px; color: var(--ink); font-size: 12px; font-weight: 650; }
        .mock-file svg { color: var(--orange); }
        .mock-status { color: var(--muted); font-size: 8px; font-weight: 800; letter-spacing: 0.16em; }
        .mock-content { display: grid; grid-template-columns: 0.85fr 1.15fr; min-height: 425px; }
        .mock-summary { padding: 30px 25px; border-right: 1px solid var(--line); }
        .mock-summary > span { color: var(--orange); font-size: 8px; font-weight: 800; letter-spacing: 0.15em; }
        .mock-summary h4 { margin: 18px 0 12px; color: var(--ink); font-size: 23px; line-height: 1.1; letter-spacing: -0.03em; }
        .mock-summary p { margin: 0; color: var(--muted); font-size: 12px; line-height: 1.65; }
        .mock-chat { display: flex; flex-direction: column; justify-content: flex-end; gap: 16px; padding: 25px; background: #fbfaf8; }
        .mock-message { max-width: 85%; padding: 14px 16px; font-size: 12px; line-height: 1.6; }
        .mock-message.user { align-self: flex-end; background: var(--blue); color: white; }
        .mock-message.bot { align-self: flex-start; background: white; border: 1px solid var(--line); color: var(--muted); }
        .bot-label { display: block; margin-bottom: 6px; color: var(--orange); font-size: 8px; font-weight: 800; letter-spacing: 0.14em; }
        .mock-input { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 46px; padding: 0 13px; border: 1px solid var(--line); background: white; color: #9aa3ae; font-size: 11px; }
        .mock-input svg { color: var(--orange); }

        /* SCENARIO MOCK */
        .scenario-mock { min-height: 500px; background: var(--blue); color: white; box-shadow: -20px 25px 0 rgba(234,88,12,0.13); }
        .scenario-header { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 22px 25px; border-bottom: 1px solid rgba(255,255,255,0.15); }
        .scenario-header span { display: block; margin-bottom: 7px; color: var(--orange); font-size: 8px; font-weight: 800; letter-spacing: 0.16em; }
        .scenario-header strong { font-size: 16px; letter-spacing: -0.015em; }
        .scenario-timer { color: rgba(255,255,255,0.65); font-size: 12px; font-variant-numeric: tabular-nums; }
        .scenario-body { padding: 35px 25px; }
        .scenario-context { padding-bottom: 28px; border-bottom: 1px solid rgba(255,255,255,0.12); }
        .scenario-label { color: rgba(255,255,255,0.4); font-size: 8px; font-weight: 800; letter-spacing: 0.16em; }
        .scenario-context p { max-width: 690px; margin: 13px 0 0; color: rgba(255,255,255,0.76); font-size: 15px; line-height: 1.65; }
        .scenario-question { padding-top: 30px; }
        .scenario-question h4 { max-width: 600px; margin: 13px 0 22px; font-size: 23px; line-height: 1.2; letter-spacing: -0.025em; }
        .scenario-options { display: grid; gap: 8px; }
        .scenario-options div { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border: 1px solid rgba(255,255,255,0.13); color: rgba(255,255,255,0.7); font-size: 11px; }
        .scenario-options span { color: var(--orange); font-weight: 800; }
        .scenario-footer { display: flex; align-items: center; justify-content: space-between; padding: 16px 25px; border-top: 1px solid rgba(255,255,255,0.13); color: rgba(255,255,255,0.45); font-size: 9px; font-weight: 750; letter-spacing: 0.12em; text-transform: uppercase; }

        /* DIFFERENCE */
        .difference-section { position: relative; z-index: 1; padding: 140px 0; background: white; }
        .difference-layout { display: grid; grid-template-columns: 0.75fr 1.25fr; gap: 100px; align-items: start; }
        .difference-heading h2 { margin: 0; font-size: clamp(50px, 5vw, 76px); line-height: 0.95; letter-spacing: -0.06em; }
        .difference-heading h2 span { color: var(--blue); }
        .difference-heading p { max-width: 420px; margin: 28px 0 0; color: var(--muted); font-size: 15px; line-height: 1.75; }
        .difference-table { border-top: 1px solid var(--line); }
        .difference-row { display: grid; grid-template-columns: 1fr 1fr; min-height: 76px; border-bottom: 1px solid var(--line); }
        .difference-row > div, .difference-row > span { display: flex; align-items: center; gap: 10px; padding: 15px 20px; font-size: 13px; }
        .difference-row > div:first-child { color: #8b95a0; border-right: 1px solid var(--line); }
        .difference-row > div:last-child { color: var(--blue); font-weight: 700; }
        .difference-row svg { flex: 0 0 auto; }
        .difference-row div:first-child svg { color: #b0b8c1; }
        .difference-row div:last-child svg { color: var(--orange); }
        .difference-head { min-height: 48px; background: var(--offwhite); color: var(--muted); font-size: 9px; font-weight: 800; letter-spacing: 0.14em; }

        /* CAPABILITY LOOP */
        .loop-section { position: relative; z-index: 1; padding: 150px 0; background: var(--offwhite); overflow: hidden; }
        .loop-layout { display: grid; grid-template-columns: 0.7fr 1.3fr; gap: 70px; align-items: center; }
        .loop-copy h2 { margin: 0; font-size: clamp(50px, 5vw, 78px); line-height: 0.95; letter-spacing: -0.06em; }
        .loop-copy h2 span { color: var(--orange); }
        .loop-copy p { max-width: 420px; margin: 30px 0; color: var(--muted); font-size: 16px; line-height: 1.75; }
        .landing-arrow-link { display: inline-flex; align-items: center; gap: 8px; color: var(--blue); text-decoration: none; font-size: 13px; font-weight: 750; }
        .landing-arrow-link svg { color: var(--orange); }
        .loop-visual { position: relative; min-height: 650px; }
        .loop-circle { position: absolute; border: 1px solid rgba(18,59,102,0.14); border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .loop-circle-outer { width: 570px; height: 570px; }
        .loop-circle-middle { width: 380px; height: 380px; border-color: rgba(234,88,12,0.28); }
        .loop-circle-inner { width: 185px; height: 185px; display: flex; align-items: center; justify-content: center; background: white; border-color: var(--orange); }
        .loop-circle-inner img { width: 110px; height: auto; }
        .loop-node { position: absolute; min-width: 140px; padding: 13px 15px; background: white; border: 1px solid var(--line); box-shadow: 8px 8px 0 rgba(18,59,102,0.05); }
        .loop-node span, .loop-node small, .loop-node strong { display: block; }
        .loop-node span { margin-bottom: 5px; color: var(--orange); font-size: 8px; font-weight: 800; }
        .loop-node strong { color: var(--ink); font-size: 11px; letter-spacing: 0.04em; }
        .loop-node small { margin-top: 4px; color: var(--muted); font-size: 9px; }
        .loop-node-top { top: 5%; left: 50%; transform: translateX(-50%); }
        .loop-node-right { top: 31%; right: 0; }
        .loop-node-bottom-right { right: 13%; bottom: 9%; }
        .loop-node-bottom-left { bottom: 9%; left: 13%; }
        .loop-node-left { top: 31%; left: 0; }

        /* SKILL PASSPORT */
        .passport-section { position: relative; z-index: 1; padding: 140px 0; background: white; }
        .passport-layout { display: grid; grid-template-columns: 0.75fr 1.25fr; gap: 110px; align-items: center; }
        .passport-copy h2 { margin: 0; font-size: clamp(48px, 5vw, 76px); line-height: 0.95; letter-spacing: -0.06em; }
        .passport-copy h2 span { color: var(--blue); }
        .passport-copy p { max-width: 440px; margin: 30px 0; color: var(--muted); font-size: 16px; line-height: 1.75; }
        .passport-points { display: grid; gap: 13px; }
        .passport-points div { display: flex; align-items: center; gap: 10px; color: var(--ink); font-size: 13px; font-weight: 650; }
        .passport-points svg { color: var(--orange); }
        .passport-mock { padding: 25px; background: var(--offwhite); border: 1px solid var(--line); }
        .passport-mock-header { display: flex; justify-content: space-between; padding-bottom: 18px; border-bottom: 1px solid var(--line); color: var(--muted); font-size: 9px; font-weight: 800; letter-spacing: 0.14em; }
        .passport-score { padding: 28px 0; border-bottom: 1px solid var(--line); }
        .passport-score > div:first-child { display: flex; align-items: flex-end; justify-content: space-between; }
        .passport-score span { color: var(--muted); font-size: 9px; font-weight: 800; letter-spacing: 0.13em; }
        .passport-score strong { color: var(--blue); font-size: 48px; line-height: 0.9; letter-spacing: -0.05em; }
        .score-bar { height: 7px; margin-top: 22px; background: #e6e9eb; }
        .score-bar span { display: block; width: 72%; height: 100%; background: var(--orange); }
        .passport-domains { display: grid; gap: 19px; padding: 27px 0; border-bottom: 1px solid var(--line); }
        .passport-domains > div { display: grid; grid-template-columns: 1fr auto; gap: 10px; }
        .passport-domains span { color: var(--ink); font-size: 12px; font-weight: 650; }
        .passport-domains strong { color: var(--blue); font-size: 12px; }
        .passport-domains i { grid-column: 1 / -1; height: 4px; background: #e5e8eb; }
        .passport-domains b { display: block; height: 100%; background: var(--blue); }
        .passport-bottom { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding-top: 24px; }
        .passport-bottom div { display: flex; flex-direction: column; gap: 8px; }
        .passport-bottom span { color: var(--muted); font-size: 8px; font-weight: 800; letter-spacing: 0.13em; }
        .passport-bottom strong { color: var(--ink); font-size: 20px; letter-spacing: -0.025em; }

        /* SIH */
        .sih-section { position: relative; z-index: 1; padding: 130px 0; background: var(--blue); color: white; }
        .sih-inner { display: grid; grid-template-columns: 0.35fr 1.65fr; gap: 80px; }
        .sih-number { padding-top: 10px; }
        .sih-number span, .sih-number strong { display: block; }
        .sih-number span { color: var(--orange); font-size: 10px; font-weight: 800; letter-spacing: 0.18em; }
        .sih-number strong { margin-top: 6px; font-size: 48px; line-height: 0.9; letter-spacing: -0.05em; }
        .sih-section .landing-section-label { color: rgba(255,255,255,0.65); }
        .sih-copy h2 { max-width: 900px; margin: 0; font-size: clamp(48px, 5vw, 76px); line-height: 0.95; letter-spacing: -0.06em; }
        .sih-copy h2 span { color: var(--orange); }
        .sih-copy > p { max-width: 720px; margin: 32px 0 55px; color: rgba(255,255,255,0.66); font-size: 16px; line-height: 1.8; }
        .sih-meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(255,255,255,0.15); }
        .sih-meta-grid div { min-height: 125px; padding: 22px; background: var(--blue); }
        .sih-meta-grid span { display: block; margin-bottom: 13px; color: rgba(255,255,255,0.38); font-size: 8px; font-weight: 800; letter-spacing: 0.16em; }
        .sih-meta-grid strong { color: white; font-size: 13px; line-height: 1.5; }

        /* FINAL CTA */
        .final-cta { position: relative; z-index: 1; min-height: 650px; display: flex; align-items: center; overflow: hidden; background: var(--offwhite); border-bottom: 1px solid var(--line); }
        .final-cta-content { position: relative; z-index: 4; width: min(1380px, calc(100% - 96px)); margin: 0 auto; }
        .final-kicker { display: block; margin-bottom: 24px; color: var(--orange); font-size: 10px; font-weight: 850; letter-spacing: 0.2em; }
        .final-cta h2 { max-width: 950px; margin: 0; font-size: clamp(58px, 7vw, 110px); line-height: 0.92; letter-spacing: -0.065em; }
        .final-cta h2 span { color: var(--blue); }
        .final-cta p { max-width: 560px; margin: 35px 0 30px; color: var(--muted); font-size: 17px; line-height: 1.7; }
        .final-actions { display: flex; align-items: center; gap: 15px; }

        /* RESPONSIVE */
        @media (max-width: 1180px) {
          .content-width, .hero-content, .final-cta-content { width: min(calc(100% - 56px), 1100px); }
          .capability-flow { grid-template-columns: repeat(3, 1fr); }
          .flow-arrow { display: none; }
          .engine-card-large { grid-column: span 1; }
          .engines-grid { grid-template-columns: repeat(2, 1fr); }
          .workspace-feature, .workspace-feature.reverse { grid-template-columns: 1fr; gap: 55px; }
          .workspace-feature.reverse .workspace-copy, .workspace-feature.reverse .workspace-visual { order: initial; }
          .loop-layout, .passport-layout { grid-template-columns: 1fr; gap: 70px; }
          .loop-copy { max-width: 600px; }
          .sih-inner { grid-template-columns: 1fr; }
          .sih-number { padding: 0; }
        }

        @media (max-width: 800px) {
          .content-width, .hero-content, .final-cta-content { width: calc(100% - 38px); }
          .hero-section { min-height: 700px; }
          .hero-content { padding: 85px 0 100px; }
          .hero-content h1 { font-size: clamp(54px, 15vw, 92px); }
          .hero-description { font-size: 16px; }
          .hero-actions { align-items: stretch; flex-direction: column; width: 210px; }
          .hero-context { align-items: flex-start; flex-direction: column; gap: 9px; margin-top: 55px; }
          .context-divider { width: 24px; }
          .hero-side-note { display: none; }
          .architecture-line { top: 70px; right: -260px; width: 600px; opacity: 0.08; }
          .problem-layout, .solution-intro, .engines-heading, .difference-layout, .passport-layout { grid-template-columns: 1fr; gap: 45px; }
          .problem-heading h2, .solution-intro h2, .engines-heading h2, .workspace-heading h2, .difference-heading h2, .loop-copy h2, .passport-copy h2, .sih-copy h2 { font-size: clamp(45px, 13vw, 68px); }
          .problem-statement { padding: 30px; }
          .problem-statement h3 { font-size: 35px; }
          .capability-flow { grid-template-columns: 1fr; }
          .flow-step { min-height: auto; }
          .engines-grid { grid-template-columns: 1fr; }
          .engine-card, .engine-card-large { grid-column: span 1; min-height: 330px; }
          .workspace-heading { grid-template-columns: 1fr; gap: 30px; margin-bottom: 80px; }
          .workspace-feature { margin-bottom: 100px; }
          .mock-content { grid-template-columns: 1fr; }
          .mock-summary { border-right: none; border-bottom: 1px solid var(--line); }
          .loop-visual { min-height: 530px; transform: scale(0.82); transform-origin: center; margin: -40px -50px; }
          .loop-circle-outer { width: 480px; height: 480px; }
          .loop-circle-middle { width: 330px; height: 330px; }
          .loop-circle-inner { width: 160px; height: 160px; }
          .sih-meta-grid { grid-template-columns: 1fr; }
          .final-cta { min-height: 560px; }
          .final-cta h2 { font-size: clamp(55px, 14vw, 82px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .landing-page *, .landing-page *::before, .landing-page *::after { scroll-behavior: auto !important; animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </main>
  );
}