import React, { useEffect, useState } from 'react';
import RoadmapNode from './RoadmapNode';
import { connectorsForNodes } from '../../data/mockRoadmap';
import { getCourseById } from '../../data/mockCourses';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 720);

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 720);
    }

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  return isMobile;
}

function connectorColor(status) {
  if (status === 'completed') return 'var(--color-primary)';
  return '#D8D8DB';
}

export default function Roadmap({ nodes, onNodeClick }) {
  const isMobile = useIsMobile();
  const links = connectorsForNodes(nodes);

  if (isMobile) {
    const ordered = [...nodes].sort(
      (a, b) => a.y - b.y || a.x - b.x
    );

    return (
      <>
        <div className="roadmap-mobile">
          {ordered.map((node, i) => {
            const course = getCourseById(node.courseId);

            return (
              <React.Fragment key={node.id}>
                <RoadmapNode
                  node={node}
                  course={course}
                  onClick={() => onNodeClick(node)}
                  style={{
                    position: 'static',
                    transform: 'none',
                  }}
                />

                {i < ordered.length - 1 && (
                  <svg
                    className="roadmap-mobile-connector"
                    width="3"
                    height="28"
                    viewBox="0 0 3 28"
                    aria-hidden="true"
                  >
                    <path
                      d="M 1.5 0 L 1.5 28"
                      fill="none"
                      stroke="var(--color-primary)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity=".28"
                    />
                  </svg>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <style>{`
          .roadmap-mobile {
            position: relative;

            display: flex;
            flex-direction: column;
            align-items: center;

            gap: 26px;

            padding: 30px 10px 40px;

            background:
              var(--color-white, #fff);

            border-radius: 18px;
          }

          .roadmap-mobile-connector {
            display: block;
            width: 3px;
            height: 28px;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <div className="roadmap-3d">

        {/* subtle technical floor */}
        <div className="roadmap-floor" />

        {/* ambient depth layer */}
        <div className="roadmap-depth" />

        <svg
          className="roadmap-connectors"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {links.map((link) => {
            const {
              x: x1,
              y: y1,
            } = link.from;

            const {
              x: x2,
              y: y2,
            } = link.to;

            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            const path = `
              M ${x1} ${y1}
              Q ${midX} ${y1}, ${midX} ${midY}
              T ${x2} ${y2}
            `;

            const isLocked =
              link.to.status === 'locked';

            const isCompleted =
              link.from.status === 'completed';

            const dashed =
              isLocked && !isCompleted;
            const key = `${link.from.id}-${link.to.id}`;

            return (
              <path
                key={key}
                d={path}
                vectorEffect="non-scaling-stroke"
                fill="none"
                stroke={connectorColor(isLocked ? 'locked' : link.from.status)}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={dashed ? '5 7' : undefined}
              />
            );
          })}
        </svg>


        {/* Nodes */}

        <div className="roadmap-nodes">
          {nodes.map((node) => {
            const course = getCourseById(node.courseId);

            return (
              <RoadmapNode
                key={node.id}
                node={node}
                course={course}
                onClick={() => onNodeClick(node)}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                }}
              />
            );
          })}
        </div>

      </div>


      <style>{`

        /* ==================================================
           MAIN 3D ROADMAP
        ================================================== */

        .roadmap-3d {
          position: relative;

          width: 100%;

          height: 660px;

          min-width: 760px;

          overflow: hidden;

          isolation: isolate;

          background:
            #ffffff;

          border-radius: 18px;

          perspective: 1400px;

          box-shadow:
            0 1px 0 rgba(18,63,115,.05),
            0 12px 30px rgba(18,63,115,.06),
            0 30px 70px rgba(18,63,115,.045);

          border:
            1px solid rgba(18,63,115,.07);
        }


        /* ==================================================
           TECHNICAL FLOOR
        ================================================== */

        .roadmap-floor {
          position: absolute;

          inset: 0;

          z-index: 0;

          pointer-events: none;

          opacity: .38;

          background-image:
            linear-gradient(
              rgba(18,63,115,.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(18,63,115,.035) 1px,
              transparent 1px
            );

          background-size:
            38px 38px;

          mask-image:
            linear-gradient(
              to bottom,
              rgba(0,0,0,.8),
              rgba(0,0,0,.2)
            );
        }


        /* ==================================================
           DEPTH / FLOOR EDGE
        ================================================== */

        .roadmap-depth {
          position: absolute;

          z-index: 1;

          left: 20px;
          right: 20px;

          bottom: -16px;

          height: 42px;

          pointer-events: none;

          border-radius: 50%;

          background:
            rgba(18,63,115,.08);

          filter:
            blur(18px);

          opacity: .35;
        }


        /* ==================================================
           CONNECTOR SVG
        ================================================== */

        .roadmap-connectors {
          position: absolute;

          inset: 0;

          z-index: 2;

          overflow: visible;

          pointer-events: none;
        }


        /* ==================================================
           NODE LAYER
        ================================================== */

        .roadmap-nodes {
          position: absolute;

          inset: 0;

          z-index: 5;

          transform-style: preserve-3d;
        }


        /* ==================================================
           RESPONSIVE
        ================================================== */

        @media (max-width: 1050px) {

          .roadmap-3d {
            height: 620px;
          }

        }


        @media (prefers-reduced-motion: reduce) {

          .roadmap-3d * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }

        }

      `}</style>
    </>
  );
}