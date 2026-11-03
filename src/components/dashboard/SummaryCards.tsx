import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Receipt, PiggyBank, Target } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/financials';

export const SummaryCards: React.FC = () => {
  const {
    currency,
    monthlyIncome,
    totalExpenses,
    totalSavings,
    totalSavedInGoals,
    goalsAchievementPercentage,
    setActiveTab,
  } = useApp();

  // Exactly FOUR summary cards as strictly required by Requirement 2
  const cards = [
    {
      id: 'monthly-income',
      title: 'Monthly Income',
      amountText: formatCurrency(monthlyIncome, currency),
      subtext: monthlyIncome > 0 ? 'Configured in Salary Split' : 'No income entered yet (₹0)',
      icon: Wallet,
      color: '#7557E8',
      bgColor: '#F0EBFF',
      badge: monthlyIncome > 0 ? 'Current Month' : 'Not Set',
      badgeColor: monthlyIncome > 0 ? 'text-[#7557E8] bg-[#F0EBFF]' : 'text-gray-500 bg-gray-100',
      onClick: () => setActiveTab('salary-split'),
    },
    {
      id: 'total-expenses',
      title: 'Total Expenses',
      amountText: formatCurrency(totalExpenses, currency),
      subtext: totalExpenses > 0 ? 'Expenses & Paid Bills' : 'No expenses recorded yet',
      icon: Receipt,
      color: '#EF4444',
      bgColor: '#FEF2F2',
      badge: totalExpenses > 0 ? 'Total Spent' : '₹0 Spent',
      badgeColor: totalExpenses > 0 ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-gray-100',
      onClick: () => setActiveTab('bills'),
    },
    {
      id: 'total-savings',
      title: 'Total Savings',
      amountText: formatCurrency(totalSavings, currency),
      subtext: totalSavings > 0 ? 'Actual contributions across vaults' : 'No savings recorded yet',
      icon: PiggyBank,
      color: '#10B981',
      bgColor: '#ECFDF5',
      badge: totalSavings > 0 ? 'Cumulative Vaults' : '₹0 Saved',
      badgeColor: totalSavings > 0 ? 'text-[#059669] bg-[#ECFDF5]' : 'text-gray-500 bg-gray-100',
      onClick: () => setActiveTab('my-savings'),
    },
    {
      id: 'dream-goals-progress',
      title: 'Dream Goals Progress',
      amountText: formatCurrency(totalSavedInGoals, currency),
      subtext: `${goalsAchievementPercentage}% Overall Achievement`,
      icon: Target,
      color: '#EC4899',
      bgColor: '#FDF2F8',
      badge: `${goalsAchievementPercentage}% Reached`,
      badgeColor: 'text-pink-600 bg-pink-50',
      onClick: () => setActiveTab('dream-goals'),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            onClick={card.onClick}
            className="glass-card rounded-3xl p-5 card-hover-lift border border-white/80 flex flex-col justify-between space-y-4 relative overflow-hidden cursor-pointer hover:border-[#7557E8]/40 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold shadow-sm"
                style={{ backgroundColor: card.bgColor, color: card.color }}
              >
                <Icon className="w-5 h-5" />
              </div>

              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#77748B] uppercase tracking-wider block mb-1">
                {card.title}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#242139] font-mono tracking-tight">
                {card.amountText}
              </div>
            </div>

            <div className="text-xs font-semibold text-[#77748B] border-t border-gray-100 pt-2.5 truncate">
              {card.subtext}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
