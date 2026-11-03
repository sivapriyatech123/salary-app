import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Sliders, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/financials';
import { CurrencyCode } from '../../types';

interface InteractiveSplitPreviewProps {
  onTryFullApp: () => void;
}

export const InteractiveSplitPreview: React.FC<InteractiveSplitPreviewProps> = ({ onTryFullApp }) => {
  const [testIncome, setTestIncome] = useState<number>(60000);
  const [rentPct, setRentPct] = useState<number>(30);
  const [groceryPct, setGroceryPct] = useState<number>(15);
  const [savingsPct, setSavingsPct] = useState<number>(25);

  const rentAmount = Math.round((testIncome * rentPct) / 100);
  const groceryAmount = Math.round((testIncome * groceryPct) / 100);
  const savingsAmount = Math.round((testIncome * savingsPct) / 100);
  const unallocatedPct = Math.max(0, 100 - (rentPct + groceryPct + savingsPct));
  const unallocatedAmount = Math.round((testIncome * unallocatedPct) / 100);

  return (
    <section className="py-16 bg-white border-y border-purple-100/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0EBFF] text-[#7557E8] font-bold text-xs uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>Interactive Live Sandbox</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#242139] tracking-tight font-heading">
            Test Salary Allocation in Seconds
          </h2>
          <p className="text-[#77748B] text-base sm:text-lg">
            Drag the sliders below to see how SalarySplit automatically calculates your categories, unallocated income, and financial balance.
          </p>
        </div>

        {/* Live Interactive Sandbox Box */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#7557E8]/20 max-w-4xl mx-auto shadow-xl">
          {/* Income Controller Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold text-[#77748B] uppercase tracking-wider">Monthly Take-Home Pay</span>
              <div className="text-3xl font-black text-[#7557E8] font-mono mt-1">
                {formatCurrency(testIncome, 'INR')}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[30000, 60000, 100000, 150000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setTestIncome(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition ${
                    testIncome === preset
                      ? 'bg-[#7557E8] text-white shadow'
                      : 'bg-[#F0EBFF] text-[#7557E8] hover:bg-[#7557E8]/20'
                  }`}
                >
                  {formatCurrency(preset, 'INR')}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders & Visual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            {/* Sliders Column */}
            <div className="space-y-6">
              {/* Category 1: Rent */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-[#242139]">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#7557E8]" /> Rent & Housing
                  </span>
                  <span className="font-mono text-[#7557E8]">
                    {rentPct}% ({formatCurrency(rentAmount, 'INR')})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={rentPct}
                  onChange={(e) => setRentPct(Number(e.target.value))}
                  className="w-full h-2.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#7557E8]"
                />
              </div>

              {/* Category 2: Groceries */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-[#242139]">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#75D9B0]" /> Groceries & Pantry
                  </span>
                  <span className="font-mono text-[#059669]">
                    {groceryPct}% ({formatCurrency(groceryAmount, 'INR')})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={groceryPct}
                  onChange={(e) => setGroceryPct(Number(e.target.value))}
                  className="w-full h-2.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#75D9B0]"
                />
              </div>

              {/* Category 3: Savings & Goals */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-[#242139]">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FFB800]" /> Savings & House Goal
                  </span>
                  <span className="font-mono text-[#D97706]">
                    {savingsPct}% ({formatCurrency(savingsAmount, 'INR')})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={savingsPct}
                  onChange={(e) => setSavingsPct(Number(e.target.value))}
                  className="w-full h-2.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#FFB800]"
                />
              </div>
            </div>

            {/* Visual Allocation Summary Stack */}
            <div className="bg-[#FAF9FF] rounded-2xl p-6 border border-[#7557E8]/15 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-xs font-extrabold uppercase text-[#77748B] tracking-wider mb-3">
                  Live Budget Balance
                </h4>

                {/* Progress bar visual stack */}
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden flex mb-4 shadow-inner">
                  <div style={{ width: `${rentPct}%` }} className="bg-[#7557E8] h-full" />
                  <div style={{ width: `${groceryPct}%` }} className="bg-[#75D9B0] h-full" />
                  <div style={{ width: `${savingsPct}%` }} className="bg-[#FFB800] h-full" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-[#77748B]">
                    <span>Total Allocated</span>
                    <span className="font-mono text-[#242139]">
                      {rentPct + groceryPct + savingsPct}% ({formatCurrency(rentAmount + groceryAmount + savingsAmount, 'INR')})
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-extrabold text-[#242139]">
                    <span>Remaining Unallocated</span>
                    <span className="font-mono text-[#7557E8]">
                      {unallocatedPct}% ({formatCurrency(unallocatedAmount, 'INR')})
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onTryFullApp}
                className="w-full py-3.5 px-4 rounded-xl bg-[#7557E8] text-white font-extrabold text-sm hover:bg-[#4B35A8] transition shadow-lg shadow-[#7557E8]/20 flex items-center justify-center gap-2"
              >
                <span>Customize Unlimited Categories</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
