import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { WalletCharacter } from '../illustrations/WalletCharacter';

interface CTASectionProps {
  onStart: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onStart }) => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#7557E8] via-[#4B35A8] to-[#242139] text-white relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#75D9B0]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFB800]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
        <div className="space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#75D9B0] font-bold text-xs uppercase tracking-wider border border-white/20">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>TAKE CONTROL OF YOUR MONEY TODAY</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black leading-tight font-heading">
            Ready to turn your salary into real financial freedom?
          </h2>

          <p className="text-lg text-white/80 font-normal">
            Join thousands of smart individuals and households using SalarySplit to organize income, manage daily groceries, grow savings, and achieve their dream goals.
          </p>

          <div className="pt-2">
            <button
              onClick={onStart}
              className="py-4 px-8 rounded-2xl bg-[#75D9B0] text-[#242139] font-extrabold text-lg hover:bg-white hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition flex items-center justify-center gap-3 mx-auto lg:mx-0 shadow-xl"
            >
              <span>Start Splitting My Salary Now</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Character graphic */}
        <div className="relative">
          <WalletCharacter size={240} mood="excited" />
        </div>
      </div>
    </section>
  );
};
