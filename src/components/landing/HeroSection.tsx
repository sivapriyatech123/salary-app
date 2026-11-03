import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake, TrendingUp, CheckCircle2 } from 'lucide-react';
import { WalletCharacter } from '../illustrations/WalletCharacter';
import { CurrencyCode } from '../../types';
import { CURRENCIES, formatCurrency } from '../../utils/financials';
import { useApp } from '../../context/AppContext';

interface HeroSectionProps {
  onStartSplitting: (income?: number, currency?: CurrencyCode) => void;
  onExploreFeatures: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartSplitting, onExploreFeatures }) => {
  const { userProfile } = useApp();
  const [quickIncome, setQuickIncome] = useState<number>(userProfile.monthlyIncome || 60000);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(userProfile.currency || 'INR');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    onStartSplitting(quickIncome, selectedCurrency);
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Blobs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#7557E8]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#75D9B0]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Hero Text & Live Quick Input Form */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left z-10">
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill border border-[#7557E8]/20 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#7557E8] animate-bounce" />
            <span className="text-xs font-bold text-[#4B35A8] tracking-wide uppercase">
              SMART SALARY, SAVINGS & HOUSEHOLD BUDGETING
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#242139] leading-[1.1] tracking-tight font-heading"
          >
            Your salary.{' '}
            <span className="bg-gradient-to-r from-[#7557E8] via-[#4B35A8] to-[#EC4899] bg-clip-text text-transparent">
              Your goals.
            </span>{' '}
            Your balance.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-[#77748B] max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed"
          >
            Turn every paycheck into a plan. Organize your salary into customizable categories, manage everyday grocery spending, grow your savings, and achieve your financial dreams together with your household.
          </motion.p>

          {/* Live Quick Income Allocation Card */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleStart}
            className="glass-card rounded-3xl p-4 sm:p-6 shadow-xl border border-white/80 max-w-xl mx-auto lg:mx-0 space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Currency Picker */}
              <div className="w-full sm:w-auto">
                <label className="block text-[11px] font-bold text-[#77748B] uppercase tracking-wider mb-1 text-left">
                  Currency
                </label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value as CurrencyCode)}
                  className="w-full py-3 px-3 rounded-xl bg-white border border-gray-200 text-[#242139] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#7557E8]"
                >
                  {Object.values(CURRENCIES).map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.symbol} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Monthly Income Input */}
              <div className="w-full flex-1">
                <label className="block text-[11px] font-bold text-[#77748B] uppercase tracking-wider mb-1 text-left">
                  Monthly Take-Home Paycheck
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-lg text-[#7557E8]">
                    {CURRENCIES[selectedCurrency].symbol}
                  </span>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={quickIncome}
                    onChange={(e) => setQuickIncome(Number(e.target.value))}
                    className="w-full py-3 pl-10 pr-4 rounded-xl bg-white border border-gray-200 text-[#242139] font-extrabold text-lg focus:outline-none focus:ring-2 focus:ring-[#7557E8] font-mono"
                    placeholder="Enter monthly salary"
                  />
                </div>
              </div>
            </div>

            {/* Instant Split Action Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#7557E8] to-[#4B35A8] text-white font-extrabold text-base hover:shadow-xl hover:shadow-[#7557E8]/30 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 group"
              >
                <span>Start Splitting My Salary</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onExploreFeatures}
                className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-[#F0EBFF] text-[#7557E8] font-bold text-base hover:bg-[#7557E8] hover:text-white transition"
              >
                Explore Features
              </button>
            </div>
          </motion.form>

          {/* Social Proof & Features Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-[#77748B] pt-2"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-gray-100 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#75D9B0]" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-gray-100 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#7557E8]" />
              <span>100% Private local storage & Supabase</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-gray-100 shadow-sm">
              <HeartHandshake className="w-4 h-4 text-[#EC4899]" />
              <span>CoupleSpace shared budgeting</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Cartoon Illustration & Floating Cards Stage */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          {/* Animated Main Wallet Character */}
          <div className="relative z-10 flex flex-col items-center">
            <WalletCharacter size={260} mood="excited" />
          </div>

          {/* Floating Card 1: Salary Allocation Card (Top Left) */}
          <motion.div
            initial={{ x: -40, y: -20, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="absolute top-2 -left-6 z-20 glass-card p-3 sm:p-4 rounded-2xl shadow-xl border border-white max-w-[200px] animate-float-slow"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-[#7557E8]/20 text-[#7557E8] flex items-center justify-center font-bold text-xs">
                50%
              </div>
              <span className="text-xs font-bold text-[#242139]">Needs & Rent</span>
            </div>
            <div className="text-sm font-black text-[#7557E8] font-mono">
              {formatCurrency(quickIncome * 0.5, selectedCurrency)}
            </div>
          </motion.div>

          {/* Floating Card 2: Dream Cottage Goal (Bottom Right) */}
          <motion.div
            initial={{ x: 40, y: 20, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="absolute bottom-4 -right-4 z-20 glass-card p-3 sm:p-4 rounded-2xl shadow-xl border border-white max-w-[210px] animate-float-medium"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-[#242139]">🏡 Beach Cottage Goal</span>
              <span className="text-[10px] font-extrabold text-[#059669] bg-[#75D9B0]/30 px-1.5 py-0.5 rounded">
                75%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
              <div className="h-full bg-gradient-to-r from-[#7557E8] to-[#75D9B0] w-3/4 rounded-full" />
            </div>
            <span className="text-[11px] font-bold text-[#77748B] font-mono">
              {formatCurrency(375000, selectedCurrency)} / {formatCurrency(500000, selectedCurrency)}
            </span>
          </motion.div>

          {/* Floating Card 3: SmartPantry Basket Alert (Middle Right) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="absolute top-1/2 -right-10 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3 animate-float-slow"
          >
            <div className="w-9 h-9 rounded-xl bg-[#75D9B0]/20 text-[#059669] flex items-center justify-center font-bold text-lg">
              🛒
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#242139]">Grocery Budget</div>
              <div className="text-[11px] font-semibold text-[#059669]">
                ₹6,000 Planned • On Track!
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
