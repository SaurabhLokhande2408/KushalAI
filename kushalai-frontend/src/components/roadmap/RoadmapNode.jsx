import React, { useState } from 'react';
import {
  Check,
  Lock,
  Sparkles,
  Circle,
} from 'lucide-react';

const STYLES = {
  completed: {
    bg: 'var(--color-primary)',
    color: '#fff',
    border: 'var(--color-primary)',
  },

  current: {
    bg: '#fff',
    color: 'var(--color-primary)',
    border: 'var(--color-orange)',
  },

  recommended: {
    bg: '#fff',
    color: 'var(--color-primary)',
    border: 'var(--color-primary)',
  },

  locked: {
    bg: 'var(--color-locked-bg)',
    color: 'var(--color-locked)',
    border: 'var(--color-border)',
  },
};

const ICONS = {
  completed: Check,
  current: Sparkles,
  recommended: Circle,
  locked: Lock,
};

export default function RoadmapNode({
  node,
  course,
  onClick,
  style,
}) {
  const s = STYLES[node.status];
  const Icon = ICONS[node.status];

  const [hovered, setHovered] = useState(false);

  const isCompleted =
    node.status === 'completed';

  const isCurrent =
    node.status === 'current';

  const isLocked =
    node.status === 'locked';

  return (
    <button
      onClick={onClick}
      aria-label={`${course?.title} — ${node.status}`}
      className={`
        roadmap-node
        roadmap-node-${node.status}
        ${hovered ? 'is-hovered' : ''}
      `}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      {/* =================================================
          FLOATING SHADOW
      ================================================= */}

      <span className="node-ground-shadow" />


      {/* =================================================
          ORBIT FOR CURRENT
      ================================================= */}

      {isCurrent && (
        <span className="node-orbit">
          <span />
        </span>
      )}


      {/* =================================================
          3D NODE
      ================================================= */}

      <span
        className="node-3d"
        style={{
          '--node-bg': s.bg,
          '--node-color': s.color,
          '--node-border': s.border,
        }}
      >

        {/* bottom extrusion */}
        <span className="node-extrusion" />

        {/* outer rim */}
        <span className="node-rim">

          {/* face */}
          <span className="node-face">

            {/* top light */}
            <span className="node-highlight" />

            {/* icon */}
            <Icon
              size={isLocked ? 17 : 19}
              strokeWidth={
                isCompleted ? 2.5 : 2
              }
            />

          </span>

        </span>

      </span>


      {/* =================================================
          COURSE TITLE
      ================================================= */}

      <span
        className={`roadmap-node-title ${
          isLocked ? 'title-locked' : ''
        }`}
      >
        {course?.title}
      </span>


      {/* =================================================
          CURRENT LABEL
      ================================================= */}

      {isCurrent && (
        <span className="roadmap-current-label">
          <span className="current-dot" />
          CURRENT FOCUS
        </span>
      )}


      <style>{`

        /* =================================================
           NODE BASE
        ================================================= */

        .roadmap-node {
          position: absolute;

          transform:
            translate(-50%, -50%)
            translateZ(0);

          width: 150px;

          display: flex;

          flex-direction: column;

          align-items: center;

          gap: 9px;

          padding: 0;

          background: transparent;

          border: none;

          cursor: pointer;

          z-index: 10;

          transform-style: preserve-3d;

          outline: none;

          transition:
            transform .28s
            cubic-bezier(.2,.8,.2,1);
        }


        .roadmap-node:hover,
        .roadmap-node.is-hovered {
          transform:
            translate(-50%, -50%)
            translateY(-7px)
            scale(1.025);
        }


        .roadmap-node:focus-visible {
          outline:
            2px solid #ea580c;

          outline-offset: 8px;

          border-radius: 20px;
        }


        /* =================================================
           GROUND SHADOW
        ================================================= */

        .node-ground-shadow {
          position: absolute;

          top: 48px;

          width: 48px;
          height: 14px;

          border-radius: 50%;

          background:
            rgba(18,63,115,.18);

          filter:
            blur(7px);

          opacity: .38;

          transform:
            translateZ(-30px)
            scaleX(1.15);

          transition:
            transform .28s ease,
            opacity .28s ease;
        }


        .roadmap-node:hover
        .node-ground-shadow {
          opacity: .22;

          transform:
            translateY(6px)
            translateZ(-30px)
            scaleX(1.35);
        }


        /* =================================================
           CURRENT ORBIT
        ================================================= */

        .node-orbit {
          position: absolute;

          top: -8px;

          width: 68px;
          height: 68px;

          border-radius: 50%;

          border:
            1px solid
            rgba(234,88,12,.32);

          transform:
            rotateX(68deg);

          animation:
            orbitPulse 2.8s
            ease-in-out
            infinite;

          pointer-events: none;
        }


        .node-orbit span {
          position: absolute;

          top: 2px;
          left: 50%;

          width: 6px;
          height: 6px;

          margin-left: -3px;

          border-radius: 50%;

          background: #ea580c;

          box-shadow:
            0 0 0 3px
            rgba(234,88,12,.12);
        }


        @keyframes orbitPulse {

          0%,
          100% {
            opacity: .45;

            transform:
              rotateX(68deg)
              scale(.96);
          }

          50% {
            opacity: .9;

            transform:
              rotateX(68deg)
              scale(1.06);
          }

        }


        /* =================================================
           3D BODY
        ================================================= */

        .node-3d {
          position: relative;

          width: 56px;
          height: 56px;

          display: block;

          transform-style: preserve-3d;

          transform:
            translateZ(18px);

          transition:
            transform .28s
            cubic-bezier(.2,.8,.2,1);
        }


        .roadmap-node:hover
        .node-3d {
          transform:
            translateZ(28px)
            rotateX(4deg)
            rotateY(-4deg);
        }


        /* =================================================
           EXTRUSION
        ================================================= */

        .node-extrusion {
          position: absolute;

          inset: 0;

          border-radius: 50%;

          background:
            var(--node-border);

          transform:
            translateY(7px)
            translateZ(-5px);

          opacity: .28;

          filter:
            brightness(.72);
        }


        /* =================================================
           OUTER RIM
        ================================================= */

        .node-rim {
          position: absolute;

          inset: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 50%;

          background:
            var(--node-border);

          box-shadow:
            0 12px 18px
            rgba(18,63,115,.13),

            0 3px 4px
            rgba(18,63,115,.12),

            inset 0 1px 0
            rgba(255,255,255,.5);

          transform:
            translateZ(4px);
        }


        /* =================================================
           NODE FACE
        ================================================= */

        .node-face {
          position: relative;

          width: 48px;
          height: 48px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 50%;

          background:
            var(--node-bg);

          color:
            var(--node-color);

          box-shadow:
            inset 0 1px 0
            rgba(255,255,255,.48),

            inset 0 -4px 8px
            rgba(0,0,0,.06);

          transform:
            translateZ(6px);
        }


        /* =================================================
           FACE HIGHLIGHT
        ================================================= */

        .node-highlight {
          position: absolute;

          top: 5px;
          left: 8px;

          width: 21px;
          height: 9px;

          border-radius:
            50%;

          background:
            rgba(255,255,255,.27);

          filter:
            blur(2px);

          transform:
            rotate(-18deg);

          pointer-events: none;
        }


        /* =================================================
           COMPLETED
        ================================================= */

        .roadmap-node-completed
        .node-rim {
          box-shadow:
            0 13px 20px
            rgba(18,63,115,.19),

            0 3px 5px
            rgba(18,63,115,.14),

            inset 0 1px 0
            rgba(255,255,255,.35);
        }


        .roadmap-node-completed
        .node-face {
          box-shadow:
            inset 0 2px 0
            rgba(255,255,255,.22),

            inset 0 -6px 10px
            rgba(0,0,0,.12);
        }


        /* =================================================
           RECOMMENDED
        ================================================= */

        .roadmap-node-recommended
        .node-rim {
          box-shadow:
            0 10px 17px
            rgba(18,63,115,.12),

            0 2px 4px
            rgba(18,63,115,.08),

            inset 0 1px 0
            rgba(255,255,255,.75);
        }


        /* =================================================
           LOCKED
        ================================================= */

        .roadmap-node-locked {
          opacity: .78;
        }


        .roadmap-node-locked
        .node-3d {
          transform:
            translateZ(3px);
        }


        .roadmap-node-locked
        .node-extrusion {
          opacity: .14;
        }


        .roadmap-node-locked
        .node-rim {
          box-shadow:
            0 5px 8px
            rgba(0,0,0,.07),

            inset 0 1px 0
            rgba(255,255,255,.7);
        }


        /* =================================================
           TITLE
        ================================================= */

        .roadmap-node-title {
          position: relative;

          z-index: 4;

          max-width: 150px;

          color:
            var(--color-text);

          font-size: 12px;

          font-weight: 650;

          line-height: 1.25;

          text-align: center;

          letter-spacing: -.01em;

          transition:
            transform .28s ease,
            color .2s ease;
        }


        .roadmap-node:hover
        .roadmap-node-title {
          transform:
            translateY(-2px);
        }


        .title-locked {
          color:
            var(--color-locked) !important;
        }


        /* =================================================
           CURRENT LABEL
        ================================================= */

        .roadmap-current-label {
          display: inline-flex;

          align-items: center;

          gap: 5px;

          margin-top: -2px;

          padding:
            4px 8px;

          border-radius: 999px;

          background:
            rgba(234,88,12,.09);

          color:
            #ea580c;

          font-size: 8px;

          font-weight: 800;

          letter-spacing: .08em;
        }


        .current-dot {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background:
            #ea580c;

          box-shadow:
            0 0 0 3px
            rgba(234,88,12,.1);
        }


        /* =================================================
           MOTION REDUCTION
        ================================================= */

        @media (prefers-reduced-motion: reduce) {

          .node-orbit {
            animation: none;
          }

          .roadmap-node,
          .node-3d,
          .node-ground-shadow,
          .roadmap-node-title {
            transition: none;
          }

        }

      `}</style>
    </button>
  );
}