import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const steps = [
    {
      num: '01',
      title: 'Input Monthly Income',
      desc: 'Enter your take-home salary and select your local currency (₹ INR, $ USD, € EUR, £ GBP, etc.).',
      color: '#7557E8',
      bg: '#F0EBFF',
    },
    {
      num: '02',
      title: 'Pick Allocation Engine',
      desc: 'Select Percentage, Fixed Amount, or Hybrid rules. Allocate to Rent, Groceries, Savings, & Goals.',
      color: '#75D9B0',
      bg: '#ECFDF5',
    },
    {
      num: '03',
      title: 'Manage Kitchen & Spending',
      desc: 'Use SmartPantry to organize groceries. Confirmed items automatically create expenses without duplication.',
      color: '#FFB800',
      bg: '#FFFBEB',
    },
    {
      num: '04',
      title: 'Watch Goals Grow & Celebrate!',
      desc: 'Track animated progress for your house, car, or vacation. Trigger fireworks when milestones hit 100%!',
      color: '#EC4899',
      bg: '#FDF2F8',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-t border-purple-100/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0EBFF] text-[#7557E8] font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>SIMPLE 4-STEP WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#242139] tracking-tight font-heading">
            How SalarySplit Works
          </h2>
          <p className="text-[#77748B] text-base sm:text-lg">
            From payday to goal achievement, SalarySplit takes less than 3 minutes to organize your whole monthly income.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card rounded-3xl p-6 border border-white flex flex-col justify-between space-y-4 relative"
            >
              <div className="space-y-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm"
                  style={{ backgroundColor: step.bg, color: step.color }}
                >
                  {step.num}
                </div>
                <h3 className="text-xl font-extrabold text-[#242139] font-heading">{step.title}</h3>
                <p className="text-[#77748B] text-xs leading-relaxed">{step.desc}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-lg">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onGetStarted}
            className="py-4 px-8 rounded-2xl bg-gradient-to-r from-[#7557E8] to-[#4B35A8] text-white font-extrabold text-base hover:shadow-xl hover:shadow-[#7557E8]/30 hover:scale-[1.02] transition inline-flex items-center gap-2"
          >
            <span>Start Splitting My Paycheck Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
