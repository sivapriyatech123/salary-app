import React from 'react';

interface ShieldProtectionProps {
  progress: number;
  size?: number;
  className?: string;
}

export const ShieldProtectionAnimation: React.FC<ShieldProtectionProps> = ({
  progress,
  size = 200,
  className = '',
}) => {
  const normalized = Math.min(100, Math.max(0, progress));
  // Liquid fill height percentage inside shield (100% means shield fully filled with gold)
  const fillHeight = 120 * (normalized / 100);

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shield Outer Ring */}
        <circle cx="120" cy="120" r="100" fill="#F0F9FF" />

        {/* Outer Shield Frame */}
        <path
          d="M 120 30 L 190 60 V 120 C 190 170 120 205 120 205 C 120 205 50 170 50 120 V 60 Z"
          fill="#38BDF8"
          fillOpacity="0.15"
          stroke="#0284C7"
          strokeWidth="6"
        />

        {/* Clip Path for Shield Liquid Fill */}
        <clipPath id="shieldClip">
          <path d="M 120 35 L 185 63 V 120 C 185 165 120 198 120 198 C 120 198 55 165 55 120 V 63 Z" />
        </clipPath>

        {/* Liquid Gold Progress Fill */}
        <g clipPath="url(#shieldClip)">
          <rect
            x="40"
            y={200 - fillHeight}
            width="160"
            height={fillHeight}
            fill="url(#goldShieldGrad)"
            className="transition-all duration-700"
          />
          {/* Wave top effect */}
          {normalized > 0 && normalized < 100 && (
            <path
              d={`M 40 ${200 - fillHeight} Q 80 ${205 - fillHeight} 120 ${200 - fillHeight} T 200 ${200 - fillHeight} V 210 H 40 Z`}
              fill="#FBBF24"
              className="animate-pulse-glow"
            />
          )}
        </g>

        {/* Shield Center Emblem (Checkmark / Star) */}
        <path
          d="M 105 120 L 115 130 L 140 105"
          stroke={normalized >= 50 ? '#FFFFFF' : '#0284C7'}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Sparkles around shield if 100% */}
        {normalized === 100 && (
          <g className="animate-float-slow">
            <circle cx="45" cy="50" r="4" fill="#FBBF24" />
            <circle cx="195" cy="55" r="5" fill="#FBBF24" />
            <circle cx="120" cy="18" r="6" fill="#FBBF24" />
          </g>
        )}

        <defs>
          <linearGradient id="goldShieldGrad" x1="120" y1="200" x2="120" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D97706" />
            <stop offset="0.6" stopColor="#FBBF24" />
            <stop offset="1" stopColor="#FEF08A" />
          </linearGradient>
        </defs>
      </svg>
      <div className="mt-2 px-3 py-1 rounded-full text-xs font-bold bg-[#E0F2FE] text-[#0284C7] border border-[#0284C7]/20 flex items-center gap-1.5 shadow-sm">
        <span>🛡️</span>
        <span>{normalized === 100 ? 'Emergency Shield Fully Armed!' : `Shield Funded: ${normalized}%`}</span>
      </div>
    </div>
  );
};
