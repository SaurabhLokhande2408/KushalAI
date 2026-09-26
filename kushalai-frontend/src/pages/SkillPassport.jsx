import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { courses } from '../data/mockCourses';
import {
  skillDomains,
  domainAverage,
  overallScore,
  statusFromMastery,
} from '../data/mockSkills';

/* =========================================================
   ANIMATED PROGRESS BAR
========================================================= */

function AnimatedProgressBar({ value, small = false }) {
  return (
    <div
      className={`skill-progress ${small ? 'skill-progress-small' : ''}`}
      role="progressbar"
      aria-label="Competency progress"
      aria-valuenow={value}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        className={`skill-progress-fill ${value > 60 ? 'skill-progress-fill-high' : ''}`}
        style={{ '--target-width': `${value}%` }}
      />
    </div>
  );
}

/* =========================================================
   COMPETENCY FOCUS
========================================================= */

function CompetencyFocus() {
  const priorities = useMemo(
    () => skillDomains
      .flatMap((domain) => domain.competencies.map((competency) => ({
        ...competency,
        domain: domain.name,
      })))
      .sort((first, second) => first.mastery - second.mastery),
    []
  );
  const priority = priorities[0];

  if (!priority) {
    return (
      <div className="consistency-card competency-focus-card">
        <div className="consistency-header">
          <div>
            <h2>Priority competency</h2>
            <p>No competency data is available.</p>
          </div>
        </div>
      </div>
    );
  }

  const status = statusFromMastery(priority.mastery);
  const relatedCourse = courses.find((course) =>
    course.skill?.toLowerCase() === priority.name.toLowerCase()
  );
  const insight = relatedCourse ? competencyInsights[relatedCourse.title] : null;
  const otherPriorities = priorities.slice(1, 3);

  return (
    <section className="consistency-card competency-focus-card">
      <div className="consistency-header">
        <div>
          <h2>Priority competency</h2>
          <p>Development priority based on recorded mastery</p>
        </div>

        <div className="consistency-score">
          <strong>{priority.mastery}%</strong>
          <span>Current mastery</span>
        </div>
      </div>

      <div className="competency-focus-primary">
        <div className="competency-focus-name">
          <strong>{priority.name}</strong>
          <span>{priority.domain}</span>
        </div>
        <StatusBadge status={status} />
      </div>

      <div
        className="competency-focus-progress"
        role="progressbar"
        aria-label={`${priority.name} mastery`}
        aria-valuenow={priority.mastery}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <span style={{ width: `${priority.mastery}%` }} />
      </div>

      <div className="competency-focus-context">
        <div>
          <span className="competency-focus-label">Why it matters</span>
          <p>{relatedCourse?.reason || priority.evidence?.join(' · ')}</p>
        </div>
        <div>
          <span className="competency-focus-label">Recommended development</span>
          <p>
            {insight?.focus || relatedCourse?.description || 'Review the evidence for this competency and practice its foundational skills.'}
          </p>
        </div>
      </div>

      {otherPriorities.length > 0 && (
        <div className="competency-focus-others">
          <span className="competency-focus-label">Additional development areas</span>
          {otherPriorities.map((competency) => (
            <span key={competency.id}>
              {competency.name} <strong>{competency.mastery}%</strong>
            </span>
          ))}
        </div>
      )}

      <Link className="competency-focus-link" to="/roadmap">
        Open learning roadmap <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </section>
  );
}

/* =========================================================
   COMPETENCY DONUT
========================================================= */

function CompetencyDonut() {
  const [score, setScore] = useState(0);

  const allCompetencies =
    skillDomains.flatMap(
      (domain) => domain.competencies
    );

  const finalScore = overallScore();

  const radius = 92;

  const circumference =
    2 * Math.PI * radius;

  const coloredCircumference =
    circumference * (score / 100);

  const statusOrder = [
    'Mastered',
    'Proficient',
    'Developing',
    'Gap',
  ];

  const statusMeta = {
    Mastered: {
      label: 'Mastered',
      color: '#198754',
    },

    Proficient: {
      label: 'Proficient',
      color: '#2563B8',
    },

    Developing: {
      label: 'Developing',
      color: '#F59E0B',
    },

    Gap: {
      label: 'Needs Attention',
      color: '#D6452D',
    },
  };

  const statusGroups = {
    Mastered: 0,
    Proficient: 0,
    Developing: 0,
    Gap: 0,
  };

  allCompetencies.forEach(
    (competency) => {
      const status =
        statusFromMastery(
          competency.mastery
        );

      if (
        statusGroups[status] !==
        undefined
      ) {
        statusGroups[status] += 1;
      }
    }
  );

  const totalStatus =
    Object.values(
      statusGroups
    ).reduce(
      (sum, count) => sum + count,
      0
    );

  const segments = statusOrder.map(
    (status) => ({
      status,

      label:
        statusMeta[status].label,

      color:
        statusMeta[status].color,

      count:
        statusGroups[status],

      value: totalStatus
        ? (statusGroups[status] /
            totalStatus) *
          100
        : 0,
    })
  );

  useEffect(() => {
    const duration = 3000;

    const startTime =
      performance.now();

    let animationFrame;

    const animate = (
      currentTime
    ) => {
      const progress = Math.min(
        (currentTime -
          startTime) /
          duration,
        1
      );

      const eased =
        1 -
        Math.pow(
          1 - progress,
          3
        );

      setScore(
        Math.round(
          finalScore * eased
        )
      );

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(
            animate
          );
      }
    };

    animationFrame =
      requestAnimationFrame(
        animate
      );

    return () =>
      cancelAnimationFrame(
        animationFrame
      );
  }, [finalScore]);

  return (
    <div className="competency-overview">
      <div className="donut-wrapper">
        <svg
          className="competency-donut"
          viewBox="0 0 260 260"
          role="img"
          aria-label={`${score}% Overall Competency Score`}
        >
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke="#E8EEF5"
            strokeWidth="18"
          />

          {(() => {
            let accumulatedLength = 0;

            return segments.map(
              (segment) => {
                const segmentLength =
                  totalStatus
                    ? coloredCircumference *
                      (segment.count /
                        totalStatus)
                    : 0;

                const segmentOffset =
                  accumulatedLength;

                accumulatedLength +=
                  segmentLength;

                return (
                  <circle
                    key={
                      segment.status
                    }
                    cx="130"
                    cy="130"
                    r={radius}
                    fill="none"
                    stroke={
                      segment.color
                    }
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeDasharray={`${segmentLength} ${circumference}`}
                    strokeDashoffset={
                      -segmentOffset
                    }
                    transform="rotate(-90 130 130)"
                    style={{
                      transition:
                        'stroke-dasharray 0.15s linear, stroke-dashoffset 0.15s linear',
                      stroke:
                        segment.color,
                    }}
                  />
                );
              }
            );
          })()}
        </svg>

        <div className="donut-center">
          <span className="donut-score">
            {score}%
          </span>

          <span className="donut-label">
            Overall
            <br />
            Competency Score
          </span>
        </div>
      </div>

      <div className="donut-legend">
        {segments.map(
          (segment) => (
            <div
              className="legend-item"
              key={segment.status}
            >
              <span
                className="legend-dot"
                style={{
                  backgroundColor:
                    segment.color,
                }}
              />

              <span>
                {segment.label}
              </span>

              <strong>
                {Math.round(
                  segment.value
                )}
                %
              </strong>
            </div>
          )
        )}
      </div>
    </div>
  );
}

/* =========================================================
   COMPETENCY INSIGHT DATA
========================================================= */

const competencyInsights = {
  'Python Basics': {
    why: 'Your score reflects a solid understanding of core Python concepts and syntax, with room to strengthen problem-solving depth.',

    excels:
      'You demonstrate confidence with fundamental Python concepts and can apply them consistently.',

    lacks:
      'More practice with advanced problem-solving, edge cases, and optimized solutions would improve mastery.',

    focus:
      'Practice progressively harder coding problems and work with real datasets.',
  },

  'Python for Data Analysis': {
    why: 'Your score reflects your ability to work with Python in analytical workflows while indicating areas where deeper data-handling skills can grow.',

    excels:
      'You show good familiarity with Python-based analytical workflows.',

    lacks:
      'Advanced data manipulation, optimization, and handling larger datasets need more practice.',

    focus:
      'Build small analytical projects using realistic datasets.',
  },

  'Pandas & NumPy Deep Dive': {
    why: 'Your score reflects your current ability to manipulate and analyze structured data using the core numerical Python ecosystem.',

    excels:
      'You are comfortable with common data manipulation and numerical operations.',

    lacks:
      'Advanced transformations, vectorization, and performance-aware operations can be strengthened.',

    focus:
      'Practice complex transformations and vectorized workflows.',
  },

  'Statistical Programming': {
    why: 'Your score reflects your current understanding of statistical programming concepts and their application.',

    excels:
      'You demonstrate familiarity with statistical workflows and quantitative reasoning.',

    lacks:
      'More complex statistical methods and interpretation of results require additional practice.',

    focus:
      'Work through applied statistical analysis problems.',
  },

  'Machine Learning Fundamentals': {
    why: 'Your score reflects your current understanding of the machine-learning workflow, from concepts to practical application.',

    excels:
      'You understand the fundamental ML workflow and core concepts.',

    lacks:
      'Model evaluation, feature engineering, and choosing appropriate approaches need deeper practice.',

    focus:
      'Build and evaluate small end-to-end ML projects.',
  },

  'Introduction to GIS': {
    why: 'Your score reflects your current exposure to geographic information concepts and spatial workflows.',

    excels:
      'You have established foundational awareness of GIS concepts.',

    lacks:
      'Hands-on spatial analysis and practical GIS workflows need more development.',

    focus:
      'Complete practical mapping and spatial-analysis exercises.',
  },

  'SQL Foundations': {
    why: 'Your score reflects your current ability to work with relational data and fundamental SQL operations.',

    excels:
      'You demonstrate a working understanding of SQL fundamentals.',

    lacks:
      'Complex joins, aggregation, optimization, and advanced queries can be improved.',

    focus:
      'Practice multi-table queries and analytical SQL problems.',
  },

  'Data Engineering Essentials': {
    why: 'Your score reflects your current understanding of data-engineering foundations and how data moves through analytical systems.',

    excels:
      'You have a good foundation in data workflows and structured data concepts.',

    lacks:
      'Pipeline design, reliability, scalability, and production-oriented practices need more depth.',

    focus:
      'Build a small end-to-end data pipeline.',
  },

  'Data Privacy & Protection': {
    why: 'Your score reflects your current understanding of privacy principles and responsible handling of data.',

    excels:
      'You demonstrate awareness of core privacy and protection concepts.',

    lacks:
      'Applying privacy principles to real-world scenarios requires more practice.',

    focus:
      'Study practical privacy scenarios and data-handling decisions.',
  },

  'Applied AI for Official Statistics': {
    why: 'Your score reflects your current understanding of applying AI concepts within statistical and public-sector contexts.',

    excels:
      'You understand the potential role of AI in analytical workflows.',

    lacks:
      'Practical model application, validation, and responsible AI considerations can be strengthened.',

    focus:
      'Explore an applied AI workflow using a statistics-oriented dataset.',
  },

  'Communication for Public Officers': {
    why: 'Your score reflects your current ability to communicate analytical information clearly and effectively.',

    excels:
      'You demonstrate a foundation in communicating technical or analytical information.',

    lacks:
      'Concise explanation, audience adaptation, and communicating complex findings can improve.',

    focus:
      'Practice turning technical findings into short executive summaries.',
  },

  'Cloud Fundamentals for Government': {
    why: 'Your score reflects your current understanding of foundational cloud concepts and their relevance to government systems.',

    excels:
      'You understand the basic concepts behind cloud-based infrastructure.',

    lacks:
      'Architecture, security, deployment, and cloud-service selection need more practical exposure.',

    focus:
      'Build a small cloud architecture and understand each component.',
  },

  'Analytics for Policy Decisions': {
    why: 'Your score reflects your ability to connect analytical thinking with policy-oriented decision making.',

    excels:
      'You demonstrate an understanding of using data to support decisions.',

    lacks:
      'Translating analysis into actionable policy recommendations needs more practice.',

    focus:
      'Work through case studies involving real policy decisions.',
  },
};

/* =========================================================
   COMPETENCY DETAILS
========================================================= */

function CompetencyDetails({ domain }) {
  const [
    selectedCompetency,
    setSelectedCompetency,
  ] = useState(null);

  const [loadingId, setLoadingId] =
    useState(null);

  const handleViewDetails = (
    competency
  ) => {
    if (
      selectedCompetency?.id ===
      competency.id
    ) {
      setSelectedCompetency(null);
      return;
    }

    setLoadingId(
      competency.id
    );

    setTimeout(() => {
      setSelectedCompetency(
        competency
      );

      setLoadingId(null);
    }, 700);
  };

  return (
    <div className="domain-content">
      <div className="competency-table">

        {/* TABLE HEADER */}

        <div className="competency-header">
          <div>
            Skill / Competency
          </div>

          <div>
            Proficiency
          </div>

          <div>
            Status
          </div>

          <div>
            Evidence
          </div>

          <div>
            Action
          </div>
        </div>

        {domain.competencies.map(
          (competency) => {
            const status =
              statusFromMastery(
                competency.mastery
              );

            const isSelected =
              selectedCompetency?.id ===
              competency.id;

            const isLoading =
              loadingId ===
              competency.id;

            const fallbackInsight = {
              why:
                competency.mastery >=
                75
                  ? 'Your score reflects consistent competency performance and a strong understanding of the expected skills.'
                  : competency.mastery >=
                    55
                  ? 'Your score reflects a developing understanding of the competency with several skills already established.'
                  : 'Your score indicates that the competency needs additional development and practice.',

              excels:
                competency.mastery >=
                75
                  ? 'You are demonstrating strong competency across the evaluated areas.'
                  : competency.mastery >=
                    55
                  ? 'You have established a useful foundation in this competency.'
                  : 'You have started building the foundational understanding required for this competency.',

              lacks:
                competency.mastery >=
                75
                  ? 'Focus now on consistency, advanced applications, and more challenging scenarios.'
                  : competency.mastery >=
                    55
                  ? 'More practice is needed to move from developing understanding to consistent mastery.'
                  : 'The core concepts need more reinforcement through guided practice and application.',

              focus:
                competency.mastery >=
                75
                  ? 'Apply the competency to more complex real-world problems.'
                  : 'Practice the weaker areas through targeted exercises.',
            };

            const insight =
              competencyInsights[
                competency.name
              ] ||
              fallbackInsight;

            return (
              <React.Fragment
                key={competency.id}
              >

                {/* =================================================
                    COMPETENCY ROW
                ================================================= */}

                <div
                  className={`competency-row ${
                    isSelected
                      ? 'competency-row-selected'
                      : ''
                  }`}
                >
                  <div className="competency-name">
                    {competency.name}
                  </div>

                  <div className="competency-proficiency">
                    <AnimatedProgressBar
                      value={
                        competency.mastery
                      }
                      small
                    />

                    <span className={competency.mastery > 60 ? 'score-above-threshold' : ''}>
                      {competency.mastery}%
                    </span>
                  </div>

                  <div className="competency-status">
                    <StatusBadge
                      status={status}
                      label={
                        status ===
                        'Gap'
                          ? 'Needs Attention'
                          : status
                      }
                    />
                  </div>

                  <div className="competency-evidence">
                    {competency
                      .evidence
                      ?.length
                      ? competency.evidence.map(
                          (
                            item,
                            index
                          ) => (
                            <span
                              key={`${competency.id}-${index}`}
                            >
                              {item}

                              {index <
                              competency
                                .evidence
                                .length -
                                1
                                ? ' · '
                                : ''}
                            </span>
                          )
                        )
                      : 'No evidence available'}
                  </div>

                  <div className="competency-action">
                    <button
                      type="button"
                      onClick={() =>
                        handleViewDetails(
                          competency
                        )
                      }
                      aria-expanded={
                        isSelected
                      }
                      aria-label={`View details for ${competency.name}`}
                    >
                      {isLoading ? (
                        <>
                          <span className="details-spinner" />

                          <span>
                            Checking
                          </span>
                        </>
                      ) : (
                        <>
                          <span>
                            {isSelected
                              ? 'Hide details'
                              : 'View details'}
                          </span>

                          <span
                            className={`details-arrow ${
                              isSelected
                                ? 'details-arrow-open'
                                : ''
                            }`}
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* =================================================
                    COMPETENCY INSIGHT CARD
                ================================================= */}

                {isSelected &&
                  !isLoading && (
                    <div className="competency-explanation-wrapper">
                      <div className="competency-explanation-card">

                        {/* HEADER */}

                        <div className="explanation-top">
                          <div>
                            <span className="explanation-eyebrow">
                              Competency insight
                            </span>

                            <h4>
                              {
                                competency.name
                              }
                            </h4>
                          </div>

                          <div className="explanation-score">
                            <strong>
                              {
                                competency.mastery
                              }
                              %
                            </strong>

                            <span>
                              current score
                            </span>
                          </div>
                        </div>

                        {/* WHY SCORE */}

                        <div className="explanation-section">
                          <span className="explanation-label">
                            Why this score?
                          </span>

                          <p>
                            {
                              insight.why
                            }
                          </p>
                        </div>

                        {/* STRENGTH + GAP */}

                        <div className="explanation-grid">

                          {/* STRENGTH */}

                          <div className="explanation-mini-card explanation-strength">
                            <div className="explanation-mini-title">
                              <span className="explanation-dot strength-dot" />

                              Where you excel
                            </div>

                            <p>
                              {
                                insight.excels
                              }
                            </p>
                          </div>

                          {/* GAP */}

                          <div className="explanation-mini-card explanation-gap">
                            <div className="explanation-mini-title">
                              <span className="explanation-dot gap-dot" />

                              Where you can improve
                            </div>

                            <p>
                              {
                                insight.lacks
                              }
                            </p>
                          </div>
                        </div>

                        {/* RECOMMENDED FOCUS */}

                        <div className="explanation-focus">
                          <div>
                            <span>
                              Recommended
                              focus
                            </span>

                            <p>
                              {
                                insight.focus
                              }
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
              </React.Fragment>
            );
          }
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN SKILL PASSPORT
========================================================= */

export default function SkillPassport({
  embedded = false,
}) {
  const {
    user,
  } = useApp();

  return (
    <>
      <div className="skill-passport-page">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div
          className={`skill-passport-page-header${embedded ? ' skill-passport-page-header-embedded' : ''}`}
          style={{ marginBottom: embedded ? 12 : 'var(--space-4)' }}
        >
          <div className="skill-passport-header-eyebrow">Skill Passport</div>
          <h1 className="skill-passport-header-title">
            {user?.name}'s competency record
          </h1>
          <p className="skill-passport-header-subtitle">
            <span>{user?.department} · </span>
            <strong>Overall competency score: {overallScore()}%</strong>
          </p>
        </div>

        {/* =====================================================
            OVERVIEW
        ===================================================== */}

        <section className="passport-overview">
          <CompetencyFocus />

          <div className="competency-card">
            <CompetencyDonut />
          </div>
        </section>

        {/* =====================================================
            DOMAIN LIST
        ===================================================== */}

        <div className="domain-list">
          {skillDomains.map(
            (domain) => {
              const avg =
                domainAverage(
                  domain
                );

              return (
                <div
                  key={domain.id}
                  className="domain-card"
                >
                  <div className="domain-inner">

                    {/* DOMAIN HEADER */}

                    <div className="domain-top">
                      <h3 className="domain-name">
                        {domain.name}
                      </h3>
                    </div>

                    {/* DOMAIN PROGRESS */}

                    <div className="domain-progress-row">
                      <div className="domain-progress">
                        <AnimatedProgressBar
                          value={avg}
                        />
                      </div>

                      <span className={`domain-score ${avg > 60 ? 'score-above-threshold' : ''}`}>
                        {avg}%
                      </span>
                    </div>

                    {/* DOMAIN FOOTER */}

                    <div className="domain-footer">
                      <span>
                        Competencies
                      </span>
                    </div>

                    {/* COMPETENCIES */}

                    <CompetencyDetails
                      domain={domain}
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* =========================================================
          STYLES
      ========================================================= */}

      <style>{`

        /* =====================================================
           PAGE
        ===================================================== */

        .skill-passport-page {
          width: 100%;
        }

        .skill-passport-page .badge {
          padding: 0;
          border-radius: 0;
          background: transparent;
          font-size: 13px;
        }

        .skill-passport-page-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0;
          text-align: left;
        }

        .skill-passport-header-eyebrow {
          align-self: center;
          margin-bottom: 5px;
          color: #1769d1;
          font-size: 26px;
          font-weight: 800;
          line-height: 1.2;
        }

        .skill-passport-header-title {
          margin: 0;
          color: #14213d;
          font-size: 32px;
          line-height: 1.2;
          font-weight: 800;
        }

        .skill-passport-header-subtitle {
          margin: 6px 0 0;
          color: #667085;
          font-size: 14px;
          line-height: 1.5;
        }

        .skill-passport-header-subtitle strong {
          color: #1769d1;
          font-weight: 700;
        }

        @media (max-width: 640px) {
          .skill-passport-header-title {
            font-size: 30px;
          }
        }


        /* =====================================================
           OVERVIEW
        ===================================================== */

        .passport-overview {
          display: grid;
          grid-template-columns:
            minmax(0, 1.35fr)
            minmax(420px, 0.65fr);

          gap: 18px;
          align-items: start;

          margin-top: 8px;
          margin-bottom: 22px;
        }


        /* =====================================================
           CONSISTENCY CARD
        ===================================================== */

        .consistency-card {
          min-height: 300px;

          padding: 24px 26px 18px;

          background: #ffffff;

          border-radius: 18px;

          box-shadow:
            0 4px 18px
            rgba(16, 33, 61, 0.045);
        }

        .consistency-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          gap: 20px;

          margin-bottom: 8px;
        }

        .consistency-header h2 {
          margin: 0;

          color: #101828;

          font-size: 20px;
          line-height: 1.2;
          font-weight: 700;
        }

        .consistency-header p {
          margin-top: 6px;

          color: #667085;

          font-size: 13px;
          line-height: 1.4;
        }

        .consistency-score {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .consistency-score strong {
          color: #ff6f00;

          font-size: 22px;
          line-height: 1;
          font-weight: 700;
        }

        .consistency-score span {
          margin-top: 5px;

          color: #98a2b3;

          font-size: 11px;
        }

        .competency-focus-card {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          border: 1px solid #e4e7ec;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(20, 33, 61, 0.05);
        }

        .competency-focus-card .consistency-header {
          margin-bottom: 14px;
        }

        .competency-focus-card .consistency-header h2 {
          color: #14213d;
          font-size: 22px;
          line-height: 1.25;
          font-weight: 700;
        }

        .competency-focus-card .consistency-header p {
          margin-bottom: 0;
          color: #667085;
          font-size: 14px;
          line-height: 1.45;
        }

        .competency-focus-card .consistency-score strong {
          color: #1769d1;
          font-size: 28px;
          font-weight: 700;
        }

        .competency-focus-card .consistency-score span {
          color: #667085;
          font-size: 12px;
        }

        .competency-focus-primary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin: 4px 0 9px;
        }

        .competency-focus-name {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 6px 10px;
          min-width: 0;
        }

        .competency-focus-name strong {
          color: #14213d;
          font-size: 19px;
          font-weight: 700;
        }

        .competency-focus-name span {
          color: #667085;
          font-size: 13px;
        }

        .competency-focus-progress {
          height: 7px;
          overflow: hidden;
          border-radius: 3px;
          background: #e4e7ec;
        }

        .competency-focus-progress span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: #d6452d;
        }

        .competency-focus-context {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-top: 12px;
          padding-top: 11px;
          border-top: 1px solid #edf0f4;
        }

        .competency-focus-context > div {
          min-width: 0;
        }

        .competency-focus-label {
          display: block;
          margin-bottom: 4px;
          color: #14213d;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .competency-focus-context p {
          display: -webkit-box;
          overflow: hidden;
          margin: 0;
          color: #667085;
          font-size: 14px;
          line-height: 1.5;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .competency-focus-others {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 4px 14px;
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px solid #edf0f4;
          color: #475467;
          font-size: 14px;
        }

        .competency-focus-others .competency-focus-label {
          flex-basis: 100%;
          margin-bottom: 0;
        }

        .competency-focus-others strong {
          color: #14213d;
          font-weight: 700;
        }

        .competency-focus-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          align-self: flex-start;
          margin-top: auto;
          padding-top: 10px;
          color: #1769d1;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
        }

        .competency-focus-link:hover {
          text-decoration: underline;
        }

        .competency-focus-link:focus-visible {
          outline: 2px solid #1769d1;
          outline-offset: 2px;
        }


        /* =====================================================
           COMPETENCY OVERVIEW CARD
        ===================================================== */

        .competency-card {
          min-height: 300px;

          display: flex;

          align-items: center;
          justify-content: center;

          padding: 20px;

          background: #ffffff;

          border-radius: 18px;

          box-shadow:
            0 4px 18px
            rgba(16, 33, 61, 0.045);
        }

        .competency-overview {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 30px;

          width: 100%;
        }

        .donut-wrapper {
          position: relative;

          width: 230px;
          height: 230px;

          flex-shrink: 0;
        }

        .competency-donut {
          width: 230px;
          height: 230px;
        }

        .donut-center {
          position: absolute;

          inset: 0;

          display: flex;

          flex-direction: column;

          align-items: center;
          justify-content: center;

          text-align: center;

          pointer-events: none;
        }

        .donut-score {
          color: #14213d;

          font-size: 44px;

          line-height: 1;

          font-weight: 700;
        }

        .donut-label {
          margin-top: 8px;

          color: #667085;

          font-size: 12px;

          line-height: 1.4;
        }

        .donut-legend {
          min-width: 170px;

          display: flex;

          flex-direction: column;

          gap: 20px;
        }

        .legend-item {
          display: grid;

          grid-template-columns:
            12px 1fr auto;

          align-items: center;

          column-gap: 10px;

          color: #475467;

          font-size: 14px;

          line-height: 1.3;
        }

        .legend-item strong {
          color: #14213D;

          font-weight: 700;

          font-size: 14px;
        }

        .legend-dot {
          width: 11px;
          height: 11px;

          border-radius: 50%;

          display: block;

          flex-shrink: 0;
        }


        /* =====================================================
           DOMAIN LIST
        ===================================================== */

        .domain-list {
          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 16px;

          width: 100%;
        }

        .domain-card {
          overflow: hidden;

          background: #ffffff;

          border-radius: 16px;

          box-shadow:
            0 4px 18px
            rgba(16, 33, 61, 0.045);

          transform: none !important;

          transition: none !important;
        }

        .domain-card:hover {
          transform: none !important;

          box-shadow:
            0 4px 18px
            rgba(16, 33, 61, 0.045);
        }

        .domain-inner {
          width: 100%;

          padding: 20px;
        }

        .domain-top {
          display: flex;

          align-items: center;
          justify-content: space-between;

          width: 100%;

          margin-bottom: 18px;
        }

        .domain-name {
          margin: 0;

          color: #101828;

          font-size: 20px;

          line-height: 1.25;

          font-weight: 700;
        }

        .domain-progress-row {
          display: grid;

          grid-template-columns:
            1fr auto;

          align-items: center;

          gap: 18px;

          width: 100%;

          margin-bottom: 18px;
        }

        .domain-progress {
          width: 100%;
        }

        .domain-score {
          min-width: 48px;

          color: #ff6f00;

          font-size: 24px;

          line-height: 1;

          font-weight: 700;

          text-align: right;
        }

        .domain-score.score-above-threshold,
        .competency-proficiency > .score-above-threshold {
          color: #198754;
          font-weight: 700;
        }

        .domain-footer {
          display: flex;

          align-items: center;

          margin-bottom: 20px;

          color: #ff6f00;

          font-size: 14px;

          font-weight: 500;
        }


        /* =====================================================
           PROGRESS
        ===================================================== */

        .skill-progress {
          width: 100%;

          height: 11px;

          overflow: hidden;

          border-radius: 999px;

          background: #fff0dc;
        }

        .skill-progress-small {
          width: 55px;

          height: 9px;

          flex-shrink: 0;
        }

        .skill-progress-fill {
          width: 0;

          height: 100%;

          border-radius: inherit;

          background: #ff7a00;

          animation:
            skillBarLoad
            3s
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            forwards;
        }

          .skill-progress-fill-high {
            background: #198754;
          }

        @keyframes skillBarLoad {
          from {
            width: 0;
          }

          to {
            width: var(
              --target-width
            );
          }
        }


        /* =====================================================
           COMPETENCY TABLE
        ===================================================== */

        .domain-content {
          padding: 0;
        }

        .competency-table {
          overflow: hidden;

          border: 1px solid #e7ebf0;

          border-radius: 14px;

          background: #ffffff;
        }

        .competency-header {
          display: grid;

          grid-template-columns:
            1.35fr
            1fr
            0.8fr
            1.5fr
            130px;

          gap: 18px;

          align-items: center;

          min-height: 64px;

          padding: 12px 18px;

          background: #f8fafc;

          color: #14213d;

          font-size: 13px;

          font-weight: 600;
        }

        .competency-row {
          display: grid;

          grid-template-columns:
            1.35fr
            1fr
            0.8fr
            1.5fr
            130px;

          gap: 18px;

          align-items: center;

          min-height: 84px;

          padding: 12px 18px;

          border-top:
            1px solid #edf0f4;

          color: #172033;

          font-size: 14px;

          transition:
            background 180ms ease;
        }

        .competency-row-selected {
          background: #f8fbff;

          border-top-color:
            #dbeafe;
        }

        .competency-name {
          color: #101828;

          font-size: 15px;

          line-height: 1.35;

          font-weight: 600;
        }

        .competency-proficiency {
          display: flex;

          align-items: center;

          gap: 10px;
        }

        .competency-proficiency
          .skill-progress {
          width: 55px;

          flex-shrink: 0;
        }

        .competency-proficiency
          > span {
          min-width: 38px;

          color: #344054;

          font-size: 13px;

          font-weight: 500;
        }

        .competency-status {
          display: flex;

          align-items: center;
        }

        .competency-evidence {
          color: #475467;

          font-size: 13px;

          line-height: 1.45;
        }

        .competency-action {
          display: flex;

          justify-content: flex-end;
        }


        /* =====================================================
           VIEW DETAILS BUTTON
        ===================================================== */

        .competency-action button {
          position: relative;

          min-width: 128px;

          min-height: 42px;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 9px;

          padding: 8px 14px;

          border:
            1px solid #b8d5fa;

          border-radius: 10px;

          background: #ffffff;

          color: #1769d1;

          font-size: 13px;

          line-height: 1;

          font-weight: 650;

          cursor: pointer;

          transition:
            background 180ms ease,
            border-color 180ms ease,
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .competency-action
          button:hover {
          background: #f5f9ff;

          border-color: #1769d1;

          box-shadow:
            0 4px 12px
            rgba(
              23,
              105,
              209,
              0.10
            );

          transform:
            translateY(-1px);
        }

        .competency-action
          button:active {
          transform:
            translateY(0);
        }

        .competency-action
          button:focus-visible {
          outline:
            3px solid
            rgba(
              37,
              99,
              235,
              0.18
            );

          outline-offset: 2px;
        }


        /* =====================================================
           ARROW
        ===================================================== */

        .details-arrow {
          display: inline-flex;

          transition:
            transform 200ms ease;
        }

        .details-arrow-open {
          transform:
            rotate(90deg);
        }


        /* =====================================================
           LOADING SPINNER
        ===================================================== */

        .details-spinner {
          width: 14px;

          height: 14px;

          border:
            2px solid #e4e7ec;

          border-top-color:
            #1769d1;

          border-radius: 50%;

          animation:
            detailsSpinner
            0.65s
            linear
            infinite;
        }

        @keyframes detailsSpinner {
          to {
            transform:
              rotate(360deg);
          }
        }


        /* =====================================================
           COMPETENCY INSIGHT WRAPPER
        ===================================================== */

        .competency-explanation-wrapper {
          padding:
            0 16px 16px;

          background: #f8fafc;

          border-top:
            1px solid #e4e7ec;

          animation:
            explanationReveal
            220ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes explanationReveal {
          from {
            opacity: 0;

            transform:
              translateY(-4px);
          }

          to {
            opacity: 1;

            transform:
              translateY(0);
          }
        }


        /* =====================================================
           INSIGHT CARD
        ===================================================== */

        .competency-explanation-card {
          position: relative;

          padding: 20px 21px;

          border:
            1px solid #e4e7ec;

          border-radius: 10px;

          background: #ffffff;

          box-shadow:
            0 2px 8px
            rgba(
              16,
              33,
              61,
              0.05
            );
        }


        /* =====================================================
           INSIGHT HEADER
        ===================================================== */

        .explanation-top {
          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 16px;

          padding-bottom: 12px;

          border-bottom:
            1px solid #edf0f4;
        }

        .explanation-eyebrow {
          display: block;

          margin-bottom: 5px;

          color: #1769d1;

          font-size: 11px;

          font-weight: 700;

          letter-spacing:
            0.08em;

          text-transform:
            uppercase;
        }

        .explanation-top h4 {
          margin: 0;

          color: #101828;

          font-size: 18px;

          line-height: 1.3;

          font-weight: 700;
        }

        .explanation-score {
          display: flex;

          flex-direction: column;

          align-items: flex-end;

          flex-shrink: 0;
        }

        .explanation-score strong {
          color: #14213d;

          font-size: 30px;

          line-height: 1;

          font-weight: 800;
        }

        .explanation-score span {
          margin-top: 4px;

          color: #667085;

          font-size: 11px;
        }


        /* =====================================================
           WHY SCORE
        ===================================================== */

        .explanation-section {
          padding: 16px 0;
        }

        .explanation-label {
          display: block;

          margin-bottom: 5px;

          color: #14213d;

          font-size: 12px;

          font-weight: 700;
        }

        .explanation-section p {
          margin: 0;

          color: #667085;

          font-size: 14px;

          line-height: 1.55;
        }


        /* =====================================================
           STRENGTH / GAP
        ===================================================== */

        .explanation-grid {
          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 0;
        }

        .explanation-mini-card {
          min-width: 0;
          padding: 0 16px 0 0;
        }

        .explanation-strength {
          border-right: 1px solid #e4e7ec;
        }

        .explanation-gap {
          padding: 0 0 0 16px;
        }

        .explanation-mini-title {
          display: flex;

          align-items: center;

          gap: 7px;

          margin-bottom: 6px;

          color: #14213d;

          font-size: 12px;

          font-weight: 700;
        }

        .explanation-mini-card p {
          margin: 0;

          color: #667085;

          font-size: 12px;

          line-height: 1.5;
        }

        .explanation-dot {
          width: 6px;

          height: 6px;

          border-radius: 50%;

          flex-shrink: 0;
        }

        .strength-dot {
          background: #198754;
        }

        .gap-dot {
          background: #d6452d;
        }


        /* =====================================================
           RECOMMENDED FOCUS
        ===================================================== */

        .explanation-focus {
          display: flex;

          align-items: flex-start;

          margin-top: 14px;
          padding: 8px 0 8px 12px;
          border-left: 2px solid #ff7a00;
        }

        .explanation-focus span {
          display: block;

          margin-bottom: 3px;

          color: #14213d;

          font-size: 12px;

          font-weight: 700;
          text-transform: uppercase;
        }

        .explanation-focus p {
          margin: 0;

          color: #667085;

          font-size: 13px;

          line-height: 1.5;
        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1150px) {

          .passport-overview {
            grid-template-columns: 1fr;
          }

          .competency-card {
            min-height: 280px;
          }

          .competency-header,
          .competency-row {
            grid-template-columns:
              1.2fr
              1fr
              0.8fr
              1.2fr
              110px;
          }
        }


        @media (max-width: 900px) {

          .domain-list {
            grid-template-columns: 1fr;
          }

          .competency-header {
            display: none;
          }

          .competency-row {
            grid-template-columns:
              1fr 1fr;

            gap: 16px;

            min-height: auto;

            padding: 20px;
          }

          .competency-name {
            grid-column:
              1 / -1;
          }

          .competency-proficiency {
            grid-column: 1;
          }

          .competency-status {
            grid-column: 2;
          }

          .competency-evidence {
            grid-column:
              1 / -1;
          }

          .competency-action {
            grid-column:
              1 / -1;

            justify-content:
              flex-start;
          }

          .explanation-grid {
            grid-template-columns: 1fr;
          }

          .explanation-strength {
            padding: 0 0 12px;
            border-right: 0;
            border-bottom: 1px solid #e4e7ec;
          }

          .explanation-gap {
            padding: 12px 0 0;
          }
        }


        @media (max-width: 640px) {

          .passport-overview {
            grid-template-columns: 1fr;

            gap: 16px;

            margin-bottom: 24px;
          }

          .consistency-card {
            min-height: 260px;

            padding:
              18px
              16px
              12px;
          }

          .competency-card {
            min-height: 280px;

            padding: 16px;
          }

          .competency-overview {
            flex-direction: column;

            gap: 20px;
          }

          .donut-wrapper {
            width: 220px;
            height: 220px;
          }

          .competency-donut {
            width: 220px;
            height: 220px;
          }

          .donut-legend {
            width: 100%;

            min-width: 0;
          }

          .domain-list {
            grid-template-columns: 1fr;

            gap: 16px;
          }

          .domain-inner {
            padding: 20px;
          }

          .domain-name {
            font-size: 18px;
          }

          .domain-score {
            font-size: 21px;
          }

          .competency-focus-context {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .competency-row {
            grid-template-columns: 1fr;

            gap: 14px;

            padding: 18px;
          }

          .competency-name,
          .competency-proficiency,
          .competency-status,
          .competency-evidence,
          .competency-action {
            grid-column: 1;
          }

          .competency-action {
            justify-content:
              flex-start;
          }

          .competency-action button {
            width: 100%;

            min-height: 54px;
          }

          .competency-explanation-wrapper {
            padding:
              0 10px 12px;
          }

          .competency-explanation-card {
            padding: 17px 16px;
          }

          .explanation-top {
            align-items:
              flex-start;
          }

          .explanation-top h4 {
            font-size: 15px;
          }

          .explanation-score strong {
            font-size: 26px;
          }
        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .donut-segment,
          .skill-progress-fill,
          .competency-explanation-wrapper,
          .details-spinner {
            animation: none;
          }

          .skill-progress-fill {
            width:
              var(--target-width);
          }

        }

      `}</style>
    </>
  );
}