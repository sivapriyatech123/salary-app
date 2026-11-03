import React from 'react';

interface HouseConstructionProps {
  progress: number; // 0 to 100
  size?: number;
  className?: string;
}

export const HouseConstruction: React.FC<HouseConstructionProps> = ({
  progress,
  size = 220,
  className = '',
}) => {
  const normalized = Math.min(100, Math.max(0, progress));

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg transition-all duration-700"
      >
        {/* Background Sky / Sun */}
        <circle cx="120" cy="120" r="100" fill={normalized === 100 ? '#F0F9FF' : '#FAF9FF'} />
        {normalized >= 75 && (
          <circle cx="200" cy="50" r="24" fill="#FEF08A" opacity="0.8" className="animate-pulse-glow" />
        )}
        {normalized === 100 && (
          /* Rainbow arch */
          <path
            d="M30 180 A 90 90 0 0 1 210 180"
            stroke="url(#rainbowGrad)"
            strokeWidth="8"
            fill="none"
            opacity="0.6"
          />
        )}

        {/* Stage 1: Ground / Foundation (Always Visible) */}
        <rect x="20" y="180" width="200" height="20" rx="4" fill="#A8A29E" stroke="#78716C" strokeWidth="2" />
        <line x1="20" y1="190" x2="220" y2="190" stroke="#E7E5E4" strokeDasharray="4 4" strokeWidth="2" />

        {/* Blueprint & Construction Grid (< 25%) */}
        {normalized < 25 && (
          <g opacity="0.8">
            <rect x="60" y="90" width="120" height="90" fill="#3B82F6" opacity="0.15" stroke="#2563EB" strokeWidth="2" strokeDasharray="6 4" />
            <path d="M60 90 L120 45 L180 90 Z" fill="#3B82F6" opacity="0.1" stroke="#2563EB" strokeWidth="2" strokeDasharray="6 4" />
            <text x="75" y="140" fill="#2563EB" fontSize="12" fontWeight="bold" fontFamily="monospace">
              FOUNDATION 25%
            </text>
            {/* Hardhat illustration */}
            <path d="M105 175 Q120 155 135 175 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
            <rect x="100" y="174" width="40" height="4" rx="2" fill="#F59E0B" />
          </g>
        )}

        {/* Stage 2: Main Walls & Structure (>= 25%) */}
        {normalized >= 25 && (
          <g className="transition-all duration-500">
            {/* House Main Body */}
            <rect
              x="55"
              y="95"
              width="130"
              height="85"
              rx="6"
              fill={normalized >= 75 ? '#F4F0FF' : '#E7E5E4'}
              stroke="#4B35A8"
              strokeWidth="4"
            />
            {/* Brick pattern lines if building (< 75%) */}
            {normalized < 75 && (
              <g opacity="0.4" stroke="#78716C" strokeWidth="1.5">
                <line x1="55" y1="115" x2="185" y2="115" />
                <line x1="55" y1="135" x2="185" y2="135" />
                <line x1="55" y1="155" x2="185" y2="155" />
                <line x1="90" y1="95" x2="90" y2="115" />
                <line x1="140" y1="95" x2="140" y2="115" />
                <line x1="115" y1="115" x2="115" y2="135" />
                <line x1="165" y1="115" x2="165" y2="135" />
              </g>
            )}
            {/* Scaffolding if 25-50% */}
            {normalized < 50 && (
              <g stroke="#D97706" strokeWidth="3" opacity="0.7">
                <line x1="40" y1="70" x2="40" y2="180" />
                <line x1="200" y1="70" x2="200" y2="180" />
                <line x1="40" y1="110" x2="200" y2="110" />
                <line x1="40" y1="150" x2="200" y2="150" />
              </g>
            )}
          </g>
        )}

        {/* Stage 3: Roof Construction (>= 50%) */}
        {normalized >= 50 && (
          <g className="transition-all duration-500">
            {/* Roof Peak */}
            <path
              d="M45 100 L120 40 L195 100 Z"
              fill={normalized >= 75 ? '#7557E8' : '#EA580C'}
              stroke="#4B35A8"
              strokeWidth="4"
            />
            {/* Roof Shingles trim */}
            <path
              d="M40 102 L120 38 L200 102"
              stroke="#FFF"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Chimney */}
            <rect x="155" y="48" width="18" height="28" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="2" />
            {normalized >= 75 && (
              /* Smoke puffs */
              <g className="animate-float-medium" opacity="0.7">
                <circle cx="164" cy="38" r="5" fill="#CBD5E1" />
                <circle cx="170" cy="28" r="7" fill="#E2E8F0" />
              </g>
            )}
          </g>
        )}

        {/* Stage 4: Windows & Doors (>= 75%) */}
        {normalized >= 75 && (
          <g className="transition-all duration-500">
            {/* Front Door */}
            <rect x="100" y="125" width="40" height="55" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3" />
            <circle cx="132" cy="155" r="3" fill="#FBBF24" />

            {/* Left Window */}
            <rect x="68" y="115" width="24" height="28" rx="4" fill="#93C5FD" stroke="#1E40AF" strokeWidth="2" />
            <line x1="80" y1="115" x2="80" y2="143" stroke="#FFF" strokeWidth="2" />
            <line x1="68" y1="129" x2="92" y2="129" stroke="#FFF" strokeWidth="2" />

            {/* Right Window */}
            <rect x="148" y="115" width="24" height="28" rx="4" fill="#93C5FD" stroke="#1E40AF" strokeWidth="2" />
            <line x1="160" y1="115" x2="160" y2="143" stroke="#FFF" strokeWidth="2" />
            <line x1="148" y1="129" x2="172" y2="129" stroke="#FFF" strokeWidth="2" />

            {/* Attic Window */}
            <circle cx="120" cy="72" r="11" fill="#FEF08A" stroke="#7557E8" strokeWidth="2" />
            <line x1="120" y1="61" x2="120" y2="83" stroke="#7557E8" strokeWidth="1.5" />
            <line x1="109" y1="72" x2="131" y2="72" stroke="#7557E8" strokeWidth="1.5" />
          </g>
        )}

        {/* Stage 5: Landscaping & 100% Finish */}
        {normalized === 100 && (
          <g className="animate-float-slow">
            {/* Garden Lawn & Flowers */}
            <path d="M20 180 Q60 170 100 180 T180 180 T220 180 V200 H20 Z" fill="#75D9B0" />
            <circle cx="45" cy="172" r="4" fill="#EC4899" />
            <circle cx="55" cy="170" r="3" fill="#FBBF24" />
            <circle cx="185" cy="172" r="4" fill="#EC4899" />
            <circle cx="195" cy="170" r="3" fill="#3B82F6" />
            {/* Pathway to door */}
            <polygon points="110,180 130,180 135,200 105,200" fill="#FEF08A" opacity="0.9" />
          </g>
        )}

        {/* Gradients */}
        <defs>
          <linearGradient id="rainbowGrad" x1="30" y1="180" x2="210" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF6B6B" />
            <stop offset="0.33" stopColor="#FBBF24" />
            <stop offset="0.66" stopColor="#75D9B0" />
            <stop offset="1" stopColor="#7557E8" />
          </linearGradient>
        </defs>
      </svg>
      {/* Progress Pill Badge */}
      <div className="mt-2 px-3 py-1 rounded-full text-xs font-bold bg-[#F0EBFF] text-[#7557E8] border border-[#7557E8]/20 flex items-center gap-1.5 shadow-sm">
        <span>🏡</span>
        <span>
          {normalized === 100
            ? 'Dream Cottage Complete!'
            : normalized >= 75
            ? 'Finishing Touches'
            : normalized >= 50
            ? 'Roofing & Framing'
            : normalized >= 25
            ? 'Brick Walls Rising'
            : 'Laying Foundation'}
        </span>
        <span className="ml-1 text-[#242139] font-mono">({normalized}%)</span>
      </div>
    </div>
  );
};
