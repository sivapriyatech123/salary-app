import React from 'react';

interface CarRoadAnimationProps {
  progress: number;
  size?: number;
  className?: string;
}

export const CarRoadAnimation: React.FC<CarRoadAnimationProps> = ({
  progress,
  size = 200,
  className = '',
}) => {
  const normalized = Math.min(100, Math.max(0, progress));
  // Translate car X position along road: from X=30 to X=170
  const carX = 30 + (normalized / 100) * 140;

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Sky Background */}
        <circle cx="120" cy="120" r="100" fill="#F0F9FF" />

        {/* Clouds */}
        <g opacity="0.7" className="animate-float-slow">
          <ellipse cx="60" cy="60" rx="20" ry="12" fill="#FFF" />
          <ellipse cx="75" cy="55" rx="16" ry="10" fill="#FFF" />
          <ellipse cx="180" cy="80" rx="25" ry="14" fill="#FFF" />
        </g>

        {/* Winding Road */}
        <path
          d="M 20 170 Q 70 150 120 170 T 220 170"
          stroke="#475569"
          strokeWidth="28"
          strokeLinecap="round"
          fill="none"
        />
        {/* Road Center Dash Lines */}
        <path
          d="M 25 170 Q 70 150 120 170 T 215 170"
          stroke="#FBBF24"
          strokeWidth="3"
          strokeDasharray="8 8"
          fill="none"
        />

        {/* Finish Line Flag at X=210 */}
        <g transform="translate(205, 130)">
          <line x1="0" y1="0" x2="0" y2="40" stroke="#1E293B" strokeWidth="3" />
          <polygon points="0,0 18,6 0,14" fill="#EF4444" />
        </g>

        {/* Moving Car */}
        <g transform={`translate(${carX - 25}, 138)`} className="transition-all duration-700">
          {/* Car Shadow */}
          <ellipse cx="25" cy="28" rx="22" ry="5" fill="#000000" opacity="0.2" />

          {/* Car Main Body */}
          <path
            d="M 5 18 C 5 12 12 6 22 6 L 30 6 C 36 6 42 12 45 18 L 48 20 C 50 20 52 23 52 25 L 50 27 L 2 27 L 2 22 C 2 20 3 18 5 18 Z"
            fill="#7557E8"
            stroke="#4B35A8"
            strokeWidth="2"
          />
          {/* Car Windshield */}
          <path d="M 16 10 L 28 10 L 33 18 L 12 18 Z" fill="#93C5FD" opacity="0.9" />

          {/* Front headlight beam */}
          <polygon points="48,22 65,15 65,30" fill="#FEF08A" opacity="0.6" />

          {/* Wheels */}
          <circle cx="14" cy="27" r="6" fill="#1E293B" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="38" cy="27" r="6" fill="#1E293B" stroke="#CBD5E1" strokeWidth="2" />
        </g>
      </svg>
      <div className="mt-2 px-3 py-1 rounded-full text-xs font-bold bg-[#F0EBFF] text-[#7557E8] border border-[#7557E8]/20 flex items-center gap-1.5 shadow-sm">
        <span>🏎️</span>
        <span>{normalized === 100 ? 'Destination Reached!' : `On the Road: ${normalized}%`}</span>
      </div>
    </div>
  );
};
