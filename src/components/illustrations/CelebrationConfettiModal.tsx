import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, CheckCircle2, RotateCcw, X, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/financials';
import { CurrencyCode } from '../../types';

interface CelebrationConfettiModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  amountSaved?: number;
  currency?: CurrencyCode;
  goalType?: 'house' | 'car' | 'vacation' | 'emergency' | 'general' | 'pantry';
  onReplay?: () => void;
}

export const CelebrationConfettiModal: React.FC<CelebrationConfettiModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle = 'You turned your monthly income into real financial freedom!',
  amountSaved = 0,
  currency = 'INR',
  goalType = 'house',
  onReplay,
}) => {
  const triggerConfetti = () => {
    // Left burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.2, y: 0.5 },
      colors: ['#7557E8', '#75D9B0', '#FFB800', '#FF6B6B'],
    });
    // Right burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.8, y: 0.5 },
      colors: ['#7557E8', '#75D9B0', '#FFB800', '#EC4899'],
    });
  };

  useEffect(() => {
    if (isOpen) {
      triggerConfetti();
      const timer = setTimeout(() => triggerConfetti(), 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl text-center border-4 border-[#7557E8]/20 overflow-hidden"
        >
          {/* Top Decorative Arc */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#7557E8] via-[#75D9B0] to-[#FFB800]" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Animated Trophy / Icon */}
          <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center bg-gradient-to-br from-[#F0EBFF] to-[#FFF9F0] rounded-full shadow-inner border-2 border-[#7557E8]/30">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            >
              <Trophy className="w-12 h-12 text-[#7557E8]" />
            </motion.div>
            <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-[#FFB800] animate-bounce" />
          </div>

          {/* Title & Celebration Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#75D9B0]/20 text-[#059669] font-bold text-xs mb-3">
            <CheckCircle2 className="w-4 h-4" />
            <span>MILESTONE ACHIEVED!</span>
          </div>

          <h2 className="text-3xl font-extrabold text-[#242139] mb-2">{title}</h2>
          <p className="text-[#77748B] text-sm max-w-sm mx-auto mb-6">{subtitle}</p>

          {/* Financial Breakdown Card */}
          {amountSaved > 0 && (
            <div className="bg-gradient-to-r from-[#F0EBFF] to-[#FFF9F0] rounded-2xl p-5 mb-6 border border-[#7557E8]/20 flex items-center justify-between">
              <div className="text-left">
                <span className="text-xs uppercase tracking-wider font-bold text-[#77748B]">Total Accumulated</span>
                <div className="text-2xl font-black text-[#7557E8] font-mono">
                  {formatCurrency(amountSaved, currency)}
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white shadow-sm border border-gray-100 text-xs font-bold text-[#059669] flex items-center gap-1">
                <span>100% Unlocked</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                triggerConfetti();
                if (onReplay) onReplay();
              }}
              className="w-full sm:w-1/2 py-3 px-4 rounded-xl border-2 border-[#7557E8] text-[#7557E8] font-bold text-sm hover:bg-[#F0EBFF] transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay Fireworks</span>
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-[#7557E8] text-white font-bold text-sm hover:bg-[#4B35A8] shadow-lg shadow-[#7557E8]/30 transition flex items-center justify-center gap-2"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
