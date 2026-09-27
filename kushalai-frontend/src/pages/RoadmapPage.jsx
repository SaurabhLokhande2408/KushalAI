import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { Badge, Pill, Skeleton } from '../components/common/UI';
import Roadmap from '../components/roadmap/Roadmap';
import CourseDrawer from '../components/roadmap/CourseDrawer';
import { useApp } from '../context/AppContext';
import { getCourseById } from '../data/mockCourses';
import { prereqTitlesFor } from '../data/mockRoadmap';

const DOMAIN_FILTERS = [
  'All',
  'Statistical',
  'Technical',
  'Digital Governance',
  'Behavioural'
];

const STATUS_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'In progress', value: 'current' },
  { label: 'Recommended', value: 'recommended' },
  { label: 'Locked', value: 'locked' }
];

function RoadmapLoadingSkeleton() {
  return (
    <div className="roadmap-page roadmap-loading" aria-busy="true" aria-label="Loading roadmap">
      <div className="roadmap-loading-header">
        <Skeleton width={156} height={14} />
        <Skeleton width="min(100%, 430px)" height={40} />
        <Skeleton width="min(100%, 760px)" height={15} />
      </div>

      <div className="roadmap-loading-taxonomy">
        <Skeleton width={276} height={24} radius={999} />
        <Skeleton width={250} height={13} />
      </div>

      <div className="roadmap-loading-filters">
        {['All', 'Statistical', 'Technical', 'Digital Governance', 'Behavioural', 'All', 'Completed', 'In progress', 'Recommended', 'Locked'].map((label, index) => (
          <Skeleton key={`${label}-${index}`} width={label.length * 8 + 28} height={36} radius={999} />
        ))}
      </div>

      <div className="roadmap-loading-stage">
        <Skeleton width="100%" height="100%" radius={18} />
      </div>

      <style>{`
        .roadmap-loading-header {
          display: grid;
          justify-items: start;
          gap: 10px;
          margin-bottom: 24px;
        }

        .roadmap-loading-taxonomy {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: var(--space-2);
        }

        .roadmap-loading-filters {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: var(--space-4);
        }

        .roadmap-loading-stage {
          height: 660px;
          padding: 14px;
          border: 1px solid rgba(18, 63, 115, .08);
          border-radius: 25px;
          background: #e9edf2;
        }

        @media (max-width: 760px) {
          .roadmap-loading-stage {
            height: 520px;
          }
        }
      `}</style>
    </div>
  );
}

export default function RoadmapPage() {
  const { roadmap, showToast, roadmapCreationCourseId, clearRoadmapCreation } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [newlyAddedCourseId, setNewlyAddedCourseId] = useState(() => (
    location.state?.animateNewNode ? location.state.newlyAddedCourseId : null
  ));
  const creatingCourseId = roadmapCreationCourseId || newlyAddedCourseId;
  const creatingNodeId = roadmap.find((node) => node.courseId === creatingCourseId)?.id ?? null;

  const [domainFilter, setDomainFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const filtered = roadmap.filter(
    (n) =>
      (domainFilter === 'All' || n.domain === domainFilter) &&
      (statusFilter === 'all' || n.status === statusFilter)
  );

  const selectedNode =
    roadmap.find((n) => n.id === selectedNodeId) || null;

  const selectedCourse = selectedNode
    ? getCourseById(selectedNode.courseId)
    : null;

  const prereqTitles = selectedNode
    ? prereqTitlesFor(
        selectedNode,
        roadmap,
        getCourseById
      )
    : [];

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsInitialLoading(false), 1000);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!location.state?.animateNewNode) return;
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (isInitialLoading || !creatingNodeId) return undefined;
    const timeoutId = window.setTimeout(() => {
      const node = roadmap.find((item) => item.id === creatingNodeId);
      const course = node ? getCourseById(node.courseId) : null;
      setNewlyAddedCourseId(null);
      clearRoadmapCreation();
      if (course) showToast(`${course.title} has been added to your learning path.`, 'success');
    }, 1850);
    return () => window.clearTimeout(timeoutId);
  }, [isInitialLoading, creatingNodeId, roadmap, showToast, clearRoadmapCreation]);

  if (isInitialLoading) return <RoadmapLoadingSkeleton />;

  return (
    <div className="roadmap-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <PageHeader
        eyebrow="Competency Roadmap"
        title="Your learning journey"
        subtitle="Follow the path to close your highest-impact skill gaps first. Locked courses unlock as you complete their prerequisites."
      />

      <div
        className="roadmap-taxonomy-note"
        role="note"
        aria-label="Aligned with iGOT Karmayogi course taxonomy · Ready for integration"
      >
        <div className="roadmap-taxonomy-marquee" aria-hidden="true">
          <div className="roadmap-taxonomy-track">
            {Array.from({ length: 6 }, (_, copy) => (
              <div className="roadmap-taxonomy-item" key={copy}>
                <Badge tone="neutral">Aligned with iGOT Karmayogi's courses</Badge>
                <span className="text-meta">· Ready for integration</span>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="roadmap-filters">

        {/* Domain filters */}

        <div className="chip-select">
          {DOMAIN_FILTERS.map((d) => (
            <Pill
              key={d}
              active={domainFilter === d}
              onClick={() => setDomainFilter(d)}
            >
              {d}
            </Pill>
          ))}
        </div>


        {/* Status filters */}

        <div className="chip-select">
          {STATUS_FILTERS.map((s) => (
            <Pill
              key={s.value}
              active={statusFilter === s.value}
              onClick={() => setStatusFilter(s.value)}
            >
              {s.label}
            </Pill>
          ))}
        </div>

      </div>


      {/* =====================================================
          3D ROADMAP STAGE
      ===================================================== */}

      <div className={`roadmap-stage${creatingNodeId ? ' is-building' : ''}`}>

        {/* outer depth rim */}

        <div className="roadmap-stage-rim" />

        {/* actual roadmap */}

        <div className="roadmap-scroll">

          <Roadmap
            nodes={filtered}
            creatingNodeId={creatingNodeId}
            onNodeClick={(node) =>
              setSelectedNodeId(node.id)
            }
          />

        </div>

      </div>


      {/* =====================================================
          COURSE DRAWER
      ===================================================== */}

      <CourseDrawer
        open={!!selectedNode}
        node={selectedNode}
        course={selectedCourse}
        prereqTitles={prereqTitles}
        onClose={() => setSelectedNodeId(null)}
      />


      {/* =====================================================
          PAGE STYLES
      ===================================================== */}

      <style>{`

        /* ===================================================
           PAGE
        =================================================== */

        .roadmap-page {
          position: relative;

          width: 100%;

          min-width: 0;
        }

        .roadmap-taxonomy-note {
          overflow: hidden;
          margin: calc(var(--space-1) - var(--space-4)) 0 var(--space-1);
          padding: 14px 18px;
          border-left: 5px solid var(--color-orange);
          border-radius: 8px;
          background: var(--color-primary);
          box-shadow: 0 4px 14px rgba(27, 76, 161, 0.16);
        }

        .roadmap-taxonomy-marquee {
          overflow: hidden;
          width: 100%;
        }

        .roadmap-taxonomy-track {
          display: flex;
          width: max-content;
          animation: roadmap-taxonomy-scroll 20s linear infinite;
        }

        .roadmap-taxonomy-item {
          display: flex;
          flex: 0 0 auto;
          align-items: center;
          gap: 6px;
          padding-right: 48px;
          white-space: nowrap;
        }

        .roadmap-taxonomy-item .text-meta {
          color: var(--color-white);
          font-size: 14px;
          font-weight: 700;
        }

        .roadmap-taxonomy-note:hover .roadmap-taxonomy-track {
          animation-play-state: paused;
        }

        @keyframes roadmap-taxonomy-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-16.666667%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .roadmap-taxonomy-marquee {
            overflow: visible;
          }

          .roadmap-taxonomy-track {
            width: 100%;
            animation: none;
          }

          .roadmap-taxonomy-item {
            flex-wrap: wrap;
            justify-content: flex-end;
            padding-right: 0;
            white-space: normal;
          }

          .roadmap-taxonomy-item + .roadmap-taxonomy-item {
            display: none;
          }

          .roadmap-taxonomy-item .text-meta {
            white-space: normal;
          }
        }


        /* ===================================================
           FILTER AREA
        =================================================== */

        .roadmap-filters {
          position: relative;

          z-index: 5;

          display: flex;

          flex-wrap: wrap;

          align-items: center;

          gap: 20px;

          margin-bottom:
            var(--space-4);
        }


        .chip-select {
          display: flex;

          flex-wrap: wrap;

          align-items: center;

          gap: 8px;
        }


        /* ===================================================
           ROADMAP OUTER STAGE
        =================================================== */

        .roadmap-stage {
          position: relative;

          isolation: isolate;

          padding: 14px;

          overflow: hidden;

          border-radius: 25px;

          background:
            #e9edf2;

          border:
            1px solid
            rgba(18, 63, 115, .08);

          box-shadow:
            inset 0 1px 0
              rgba(255,255,255,.95),

            inset 0 -1px 0
              rgba(18,63,115,.04),

            0 12px 25px
              rgba(18,63,115,.055),

            0 28px 55px
              rgba(18,63,115,.045);
        }

        .roadmap-stage.is-building .roadmap-node:not(.is-creating) {
          opacity: .52;
          filter: saturate(.75);
          transition: opacity .4s ease, filter .4s ease;
        }

        .roadmap-stage.is-building .roadmap-connectors {
          opacity: .42;
        }

        .roadmap-stage.is-building .roadmap-connector-creating {
          opacity: 1;
        }


        /* ===================================================
           OUTER 3D RIM
        =================================================== */

        .roadmap-stage-rim {
          position: absolute;

          z-index: 0;

          left: 20px;
          right: 20px;

          bottom: -9px;

          height: 18px;

          border-radius:
            0 0 20px 20px;

          background:
            rgba(18,63,115,.09);

          filter:
            blur(8px);

          pointer-events: none;
        }


        /* ===================================================
           SCROLL CONTAINER
        =================================================== */

        .roadmap-scroll {
          position: relative;

          z-index: 2;

          width: 100%;

          overflow-x: auto;

          overflow-y: hidden;

          border-radius: 18px;

          scrollbar-width: thin;

          scrollbar-color:
            rgba(18,63,115,.2)
            transparent;
        }


        .roadmap-scroll::-webkit-scrollbar {
          height: 7px;
        }


        .roadmap-scroll::-webkit-scrollbar-track {
          background:
            transparent;
        }


        .roadmap-scroll::-webkit-scrollbar-thumb {
          background:
            rgba(18,63,115,.18);

          border-radius:
            999px;
        }


        .roadmap-scroll::-webkit-scrollbar-thumb:hover {
          background:
            rgba(18,63,115,.28);
        }


        /* ===================================================
           DESKTOP DEPTH
        =================================================== */

        @media (min-width: 1000px) {

          .roadmap-stage {
            padding: 16px;

            transform:
              translateZ(0);
          }

          .roadmap-stage::before {
            content: '';

            position: absolute;

            z-index: 0;

            left: 10%;
            right: 10%;

            bottom: 2px;

            height: 35px;

            border-radius: 50%;

            background:
              rgba(18,63,115,.08);

            filter:
              blur(22px);

            pointer-events: none;
          }

        }


        /* ===================================================
           TABLET
        =================================================== */

        @media (max-width: 900px) {

          .roadmap-filters {
            gap: 12px;

            margin-bottom: 18px;
          }


          .chip-select {
            gap: 7px;
          }


          .roadmap-stage {
            padding: 10px;

            border-radius: 20px;
          }


          .roadmap-scroll {
            border-radius: 15px;
          }

        }


        /* ===================================================
           MOBILE
        =================================================== */

        @media (max-width: 720px) {

          .roadmap-filters {
            flex-direction: column;

            align-items: flex-start;

            gap: 13px;
          }


          .chip-select {
            width: 100%;

            overflow-x: auto;

            flex-wrap: nowrap;

            padding-bottom: 4px;

            scrollbar-width: none;
          }


          .chip-select::-webkit-scrollbar {
            display: none;
          }


          .roadmap-stage {
            padding: 7px;

            border-radius: 17px;
          }


          .roadmap-scroll {
            overflow-x: visible;
          }

        }


        /* ===================================================
           REDUCED MOTION
        =================================================== */

        @media (prefers-reduced-motion: reduce) {

          .roadmap-stage,
          .roadmap-stage::before {
            transition: none !important;
          }

        }

      `}</style>

    </div>
  );
}