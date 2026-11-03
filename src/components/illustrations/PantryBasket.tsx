import React from 'react';

interface PantryBasketProps {
  size?: number;
  className?: string;
}

export const PantryBasket: React.FC<PantryBasketProps> = ({
  size = 180,
  className = '',
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float-slow">
        {/* Background Glow */}
        <circle cx="100" cy="100" r="85" fill="#ECFDF5" />

        {/* Basket Woven Grid Base */}
        <path d="M 40 100 L 160 100 L 145 165 C 143 172 135 178 125 178 H 75 C 65 178 57 172 55 165 Z" fill="#75D9B0" stroke="#059669" strokeWidth="4" />
        
        {/* Basket Handle */}
        <path d="M 60 100 Q 100 30 140 100" stroke="#059669" strokeWidth="6" fill="none" strokeLinecap="round" />

        {/* Grocery Contents */}
        {/* Milk Bottle */}
        <rect x="62" y="65" width="22" height="40" rx="4" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2" />
        <rect x="67" y="60" width="12" height="5" rx="1" fill="#3B82F6" />

        {/* Red Carrot / Pepper */}
        <path d="M 95 65 Q 110 85 92 105 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />

        {/* Green Broccoli Head */}
        <circle cx="122" cy="72" r="14" fill="#10B981" />
        <circle cx="132" cy="80" r="10" fill="#059669" />
        <rect x="122" y="85" width="8" height="18" fill="#D1FAE5" rx="2" />

        {/* French Baguette Bread */}
        <rect x="135" y="55" width="16" height="55" rx="8" fill="#F59E0B" stroke="#B45309" strokeWidth="2" transform="rotate(22 135 55)" />

        {/* Basket Grid Lines */}
        <line x1="45" y1="120" x2="155" y2="120" stroke="#047857" strokeWidth="2" opacity="0.4" />
        <line x1="50" y1="140" x2="150" y2="140" stroke="#047857" strokeWidth="2" opacity="0.4" />
        <line x1="80" y1="100" x2="72" y2="178" stroke="#047857" strokeWidth="2" opacity="0.4" />
        <line x1="120" y1="100" x2="128" y2="178" stroke="#047857" strokeWidth="2" opacity="0.4" />
      </svg>
    </div>
  );
};
