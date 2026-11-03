import React from 'react';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/financials';
import { PieChart, TrendingUp, PiggyBank, Plus } from 'lucide-react';

export const DashboardCharts: React.FC = () => {
  const { categories, savingsTx, currency, setActiveTab } = useApp();

  const totalAllocated = categories.reduce((s, c) => s + (c.allocatedAmount || 0), 0);

  // 1. Donut Chart Data: Salary Allocation by Category
  const donutData = categories
    .filter((cat) => (cat.allocatedAmount || 0) > 0)
    .map((cat) => ({
      name: cat.name,
      value: cat.allocatedAmount,
      color: cat.color || '#7557E8',
    }));

  // 2. Cumulative Monthly Savings Growth from ACTUAL savings transactions
  // Sort transactions chronologically
  const sortedTx = [...savingsTx].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Aggregate by month and calculate cumulative total
  const monthMap = new Map<string, number>();
  sortedTx.forEach((tx) => {
    const monthKey = tx.month || tx.date.slice(0, 7);
    monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + tx.amount);
  });

  let runningTotal = 0;
  const cumulativeGrowthData = Array.from(monthMap.entries()).map(([month, monthlyAmount]) => {
    runningTotal += monthlyAmount;
    return {
      month,
      monthlyContribution: monthlyAmount,
      cumulativeSavings: runningTotal,
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Chart A: Salary Allocation Donut Chart (5 cols) */}
      <div className="lg:col-span-5 glass-card rounded-3xl p-6 border border-white flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F0EBFF] text-[#7557E8] flex items-center justify-center font-bold">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#242139] font-heading">Salary Allocation</h3>
              <p className="text-xs text-[#77748B]">Category breakdown percentage</p>
            </div>
          </div>
        </div>

        {totalAllocated === 0 || donutData.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F0EBFF] text-[#7557E8] flex items-center justify-center">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#242139]">No Salary Split Configured</div>
              <div className="text-xs text-[#77748B] mt-0.5 max-w-xs">
                Enter your monthly salary and allocate categories in the Salary Split page to generate your chart.
              </div>
            </div>
            <button
              onClick={() => setActiveTab('salary-split')}
              className="py-2 px-4 rounded-xl bg-[#7557E8] text-white font-bold text-xs hover:bg-[#4B35A8] transition shadow"
            >
              Configure in Salary Split &rarr;
            </button>
          </div>
        ) : (
          <>
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <ReTooltip
                    formatter={(value: any) => [formatCurrency(Number(value), currency), 'Allocated']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  />
                </RePieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold text-[#77748B] uppercase">Total</span>
                <span className="text-sm font-black text-[#242139] font-mono">
                  {formatCurrency(totalAllocated, currency)}
                </span>
              </div>
            </div>

            {/* Legend pills */}
            <div className="flex flex-wrap gap-2 pt-2 max-h-20 overflow-y-auto">
              {donutData.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-[11px] font-bold text-[#242139]"
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="truncate max-w-[90px]">{c.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Chart B: Cumulative Monthly Savings Growth (7 cols) */}
      <div className="lg:col-span-7 glass-card rounded-3xl p-6 border border-white flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#242139] font-heading">
                Cumulative Monthly Savings Growth
              </h3>
              <p className="text-xs text-[#77748B]">
                Total accumulated savings over time based on actual recorded contributions
              </p>
            </div>
          </div>
        </div>

        {cumulativeGrowthData.length === 0 ? (
          <div className="h-72 flex flex-col items-center justify-center text-center p-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
              <PiggyBank className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#242139]">No Savings Recorded Yet</div>
              <div className="text-xs text-[#77748B] mt-0.5 max-w-xs">
                Create a savings category and record your first contribution in My Savings to start your growth chart.
              </div>
            </div>
            <button
              onClick={() => setActiveTab('my-savings')}
              className="py-2 px-4 rounded-xl bg-[#10B981] text-white font-bold text-xs hover:bg-[#059669] transition shadow"
            >
              Go to My Savings &rarr;
            </button>
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulativeGrowthData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="actualSavingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#77748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#77748B' }} />
                <ReTooltip
                  formatter={(value: any, name: any) => [
                    formatCurrency(Number(value), currency),
                    name === 'cumulativeSavings' ? 'Total Accumulated Savings' : 'Monthly Contribution',
                  ]}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="cumulativeSavings"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#actualSavingsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};
