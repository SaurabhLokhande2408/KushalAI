import React from 'react';

export default function BrandCurveAnimation({ className = '' }) {
  return (
    <>
      <svg
        className={`auth-hero-curves ${className}`.trim()}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <marker
            id="brand-curve-arrowhead"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#ea580c" />
          </marker>
        </defs>

        <g stroke="#ea580c" fill="none" strokeLinecap="round" markerEnd="url(#brand-curve-arrowhead)">
          <path d="M 450,-50 C 420,300 480,650 450,980" strokeWidth="4.5" opacity="0.9" className="brand-curve-draw" />
          <path d="M 460,350 C 140,280 140,720 460,540" strokeWidth="5.5" opacity="0.95" className="brand-curve-draw" />
          <path d="M 460,450 C 860,450 890,780 560,940" strokeWidth="4" opacity="0.85" className="brand-curve-draw" />
          <path d="M -50,850 C 300,900 600,680 1020,750" strokeWidth="3" opacity="0.5" className="brand-curve-draw" />
        </g>
      </svg>
      <style>{`
        .auth-hero-curves {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .brand-curve-draw {
          stroke-dasharray: 3000;
          stroke-dashoffset: 3000;
          animation: brand-curve-draw 5s ease-in-out forwards;
        }

        @keyframes brand-curve-draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </>
  );
}