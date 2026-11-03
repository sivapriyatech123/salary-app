import React from 'react';

interface WalletCharacterProps {
  className?: string;
  size?: number;
  mood?: 'happy' | 'excited' | 'saving';
}

export const WalletCharacter: React.FC<WalletCharacterProps> = ({
  className = '',
  size = 200,
  mood = 'excited',
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[#7557E8]/20 rounded-full blur-2xl animate-pulse-glow" />

      {/* SVG Character */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-xl animate-float-slow"
      >
        {/* Wallet Main Body */}
        <rect
          x="30"
          y="50"
          width="180"
          height="140"
          rx="24"
          fill="url(#walletGradient)"
          stroke="#4B35A8"
          strokeWidth="6"
        />

        {/* Wallet Top Fold / Clasp */}
        <path
          d="M30 74C30 60.7452 40.7452 50 54 50H186C199.255 50 210 60.7452 210 74V90H30V74Z"
          fill="#4B35A8"
        />

        {/* Wallet Flap Pocket */}
        <rect
          x="150"
          y="100"
          width="60"
          height="50"
          rx="14"
          fill="#F0EBFF"
          stroke="#4B35A8"
          strokeWidth="4"
        />

        {/* Gold Clasp Button */}
        <circle cx="170" cy="125" r="8" fill="#FFB800" stroke="#B38000" strokeWidth="2" />
        <circle cx="170" cy="125" r="3" fill="#FFF" />

        {/* Face Elements */}
        {/* Left Eye */}
        <circle cx="85" cy="115" r="9" fill="#242139" />
        <circle cx="88" cy="112" r="3" fill="#FFFFFF" />

        {/* Right Eye */}
        <circle cx="125" cy="115" r="9" fill="#242139" />
        <circle cx="128" cy="112" r="3" fill="#FFFFFF" />

        {/* Blush Cheeks */}
        <ellipse cx="73" cy="125" rx="8" ry="5" fill="#FF6B6B" opacity="0.4" />
        <ellipse cx="137" cy="125" rx="8" ry="5" fill="#FF6B6B" opacity="0.4" />

        {/* Smile */}
        {mood === 'excited' ? (
          <path
            d="M93 130 Q105 148 117 130 Z"
            fill="#FF6B6B"
            stroke="#242139"
            strokeWidth="3"
          />
        ) : (
          <path
            d="M93 132 Q105 144 117 132"
            stroke="#242139"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Floating Money Paper coming out top */}
        <g className="animate-float-medium">
          <rect x="70" y="20" width="45" height="36" rx="6" fill="#75D9B0" stroke="#2D8C65" strokeWidth="3" transform="rotate(-12 70 20)" />
          <circle cx="92" cy="38" r="6" fill="#FFFFFF" opacity="0.8" transform="rotate(-12 70 20)" />
        </g>
        <g className="animate-float-slow">
          <rect x="120" y="15" width="50" height="38" rx="6" fill="#93C5FD" stroke="#2563EB" strokeWidth="3" transform="rotate(8 120 15)" />
          <circle cx="145" cy="34" r="6" fill="#FFFFFF" opacity="0.8" transform="rotate(8 120 15)" />
        </g>

        {/* Gradients */}
        <defs>
          <linearGradient id="walletGradient" x1="30" y1="50" x2="210" y2="190" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7557E8" />
            <stop offset="1" stopColor="#5B3DC8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
