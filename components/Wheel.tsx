import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { Segment } from '../types';

interface WheelProps {
  segments: Segment[];
  rotation: number;
  onTransitionEnd: () => void;
  size: number;
  isSpinning: boolean;
  winner: Segment | null;
}

export const Wheel: React.FC<WheelProps> = ({ segments, rotation, onTransitionEnd, size, isSpinning, winner }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const radius = size / 2;

  // Generate pie slices using D3
  const pie = useMemo(() => {
    return d3.pie<Segment>()
      .sort(null)
      .value(() => 1)(segments);
  }, [segments]);

  // Arc generator
  const arc = useMemo(() => {
    return d3.arc<d3.PieArcDatum<Segment>>()
      .innerRadius(20) // Small hole in center
      .outerRadius(radius - 10); // Leave space for border
  }, [radius]);

  // Calculate font size based on segment count
  const fontSize = Math.max(12, 24 - segments.length);

  return (
    <>
      <style>
        {`
          @keyframes wheel-enter {
             0% { opacity: 0; transform: scale(0.5) rotate(-180deg); }
             100% { opacity: 1; transform: scale(1) rotate(0deg); }
          }
          .wheel-entrance {
            animation: wheel-enter 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
        `}
      </style>
      <div 
        className={`relative flex items-center justify-center overflow-hidden rounded-full border-4 border-white shadow-2xl bg-gray-900 wheel-entrance`}
        style={{ width: size, height: size }}
      >
        {/* Pointer/Indicator - Fixed relative to the wheel container */}
        <div 
          className="absolute z-20 top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-white drop-shadow-md"
        />

        {/* Rotating SVG */}
        <svg
          ref={svgRef}
          width={size}
          height={size}
          style={{
            transform: `rotate(${rotation}deg)`,
            // Cubic-bezier adjusted for a more realistic heavy wheel deceleration
            transition: rotation === 0 ? 'none' : 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)',
          }}
          onTransitionEnd={onTransitionEnd}
          viewBox={`0 0 ${size} ${size}`}
        >
          <defs>
            <filter id="winner-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
              <feFlood floodColor="white" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g transform={`translate(${size / 2},${size / 2})`}>
            {pie.map((slice, index) => {
              const centroid = arc.centroid(slice);
              // Calculate rotation for text to be readable
              const sliceAngle = (slice.startAngle + slice.endAngle) / 2;
              const degrees = (sliceAngle * 180) / Math.PI - 90;

              const isWinner = !isSpinning && winner && winner.id === slice.data.id;
              
              // Display Text ONLY (Icon removed from wheel face)
              const displayText = slice.data.text;

              return (
                <g key={slice.data.id} style={{ opacity: (!isSpinning && winner && !isWinner) ? 0.6 : 1, transition: 'opacity 0.5s' }}>
                  <path
                    d={arc(slice) || undefined}
                    fill={slice.data.color}
                    stroke="white"
                    strokeWidth={isWinner ? "4" : "2"}
                    filter={isWinner ? "url(#winner-glow)" : undefined}
                  />
                  <text
                    transform={`translate(${centroid}) rotate(${degrees})`}
                    dy="0.35em"
                    textAnchor="middle"
                    fill="white"
                    style={{
                      fontSize: `${fontSize}px`,
                      fontWeight: '900',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                      pointerEvents: 'none'
                    }}
                  >
                    {displayText}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
        
        {/* Center cap (UNO style) */}
        <div className="absolute z-10 w-16 h-16 bg-red-600 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
          <span className="text-white font-black italic text-sm transform -rotate-12">UNO</span>
        </div>
      </div>
    </>
  );
};