import React from 'react';

interface PlaneVacationProps {
  progress: number;
  size?: number;
  className?: string;
}

export const PlaneVacationAnimation: React.FC<PlaneVacationProps> = ({
  progress,
  size = 200,
  className = '',
}) => {
  const normalized = Math.min(100, Math.max(0, progress));
  // Plane altitude and distance from departure (30,170) to tropical island (190, 70)
  const planeX = 30 + (normalized / 100) * 160;
  const planeY = 170 - (normalized / 100) * 100;

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ocean Background */}
        <circle cx="120" cy="120" r="100" fill="#E0F2FE" />

        {/* Tropical Island Destination at (180, 160) */}
        <g transform="translate(150, 130)">
          {/* Island Sand */}
          <ellipse cx="40" cy="40" rx="35" ry="18" fill="#FDE68A" />
          {/* Palm Tree */}
          <path d="M 38 40 Q 34 20 45 5" stroke="#78350F" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 45 5 Q 25 0 15 10" stroke="#15803D" strokeWidth="3" fill="none" />
          <path d="M 45 5 Q 65 0 75 12" stroke="#15803D" strokeWidth="3" fill="none" />
          <path d="M 45 5 Q 45 -15 35 -20" stroke="#15803D" strokeWidth="3" fill="none" />
        </g>

        {/* Flight Trajectory Path */}
        <path
          d="M 30 170 Q 100 100 190 70"
          stroke="#7557E8"
          strokeWidth="3"
          strokeDasharray="6 6"
          fill="none"
          opacity="0.6"
        />

        {/* Airplane */}
        <g transform={`translate(${planeX - 20}, ${planeY - 20}) rotate(-18)`} className="transition-all duration-700">
          <path
            d="M 5 20 C 5 20 20 18 35 15 C 40 14 44 10 42 5 C 40 0 32 3 26 8 L 15 12 L 8 8 L 5 10 L 10 16 L 2 17 Z"
            fill="#FFFFFF"
            stroke="#7557E8"
            strokeWidth="2"
          />
          {/* Jet Stream Trail */}
          <line x1="-10" y1="20" x2="2" y2="20" stroke="#93C5FD" strokeWidth="3" strokeDasharray="3 3" />
        </g>
      </svg>
      <div className="mt-2 px-3 py-1 rounded-full text-xs font-bold bg-[#F0EBFF] text-[#7557E8] border border-[#7557E8]/20 flex items-center gap-1.5 shadow-sm">
        <span>✈️</span>
        <span>{normalized === 100 ? 'Landed in Paradise!' : `Flight Progress: ${normalized}%`}</span>
      </div>
    </div>
  );
};
