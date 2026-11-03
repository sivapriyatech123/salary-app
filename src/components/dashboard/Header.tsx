import React from 'react';
import { Search, Bell, Calendar, Sparkles, Menu, Wallet, LogOut } from 'lucide-react';
import { useApp, AppTab } from '../../context/AppContext';
import { CURRENCIES, formatCurrency } from '../../utils/financials';
import { CurrencyCode } from '../../types';

interface HeaderProps {
  title: string;
  onMobileMenuOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onMobileMenuOpen }) => {
  const { userProfile, currency, setCurrency, monthlyIncome, logout } = useApp();

  // Calculate days until next salary payday (e.g. 1st of month)
  const today = new Date();
  const payday = userProfile.paydayDate || 1;
  let nextPayday = new Date(today.getFullYear(), today.getMonth(), payday);
  if (today > nextPayday) {
    nextPayday = new Date(today.getFullYear(), today.getMonth() + 1, payday);
  }
  const diffTime = Math.abs(nextPayday.getTime() - today.getTime());
  const daysUntilPayday = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <header className="sticky top-0 z-20 w-full bg-white/90 backdrop-blur-md border-b border-purple-100/80 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
      {/* Title & Mobile Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden p-2 rounded-xl bg-[#F0EBFF] text-[#7557E8]"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#242139] tracking-tight font-heading capitalize">
            {title}
          </h1>
          <p className="text-xs text-[#77748B] hidden sm:block">
            Monthly Budget:{' '}
            <span className="font-mono font-bold text-[#7557E8]">
              {formatCurrency(monthlyIncome, currency)}
            </span>
          </p>
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-3">
        {/* Salary Day Countdown Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0EBFF] border border-[#7557E8]/20 text-xs font-bold text-[#7557E8]">
          <Calendar className="w-4 h-4 text-[#7557E8]" />
          <span>Payday in <span className="font-mono text-[#4B35A8] font-black">{daysUntilPayday}</span> days</span>
        </div>

        {/* Currency Quick Selector */}
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
          className="py-1.5 px-2.5 rounded-xl bg-[#FAF9FF] border border-gray-200 text-xs font-extrabold text-[#242139] focus:outline-none focus:ring-2 focus:ring-[#7557E8] font-mono cursor-pointer"
        >
          {Object.values(CURRENCIES).map((c) => (
            <option key={c.code} value={c.code}>
              {c.symbol} {c.code}
            </option>
          ))}
        </select>

        {/* Notification Icon */}
        <button className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-[#F0EBFF] text-gray-600 hover:text-[#7557E8] transition">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EC4899]" />
        </button>

        {/* User Info & Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-[#7557E8]/20 border border-[#7557E8]/30 flex items-center justify-center text-[#7557E8] font-black text-sm">
            {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-bold text-[#242139] leading-tight">
              {userProfile.name || 'User'}
            </span>
            <span className="block text-[10px] text-[#77748B]">
              {userProfile.isLoggedIn ? 'Active User' : 'Guest'}
            </span>
          </div>

          {userProfile?.isLoggedIn && (
            <button
              onClick={logout}
              title="Log Out"
              className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
