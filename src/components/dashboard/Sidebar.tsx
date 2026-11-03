import React, { useState } from 'react';
import {
  LayoutDashboard,
  PieChart,
  ShoppingBag,
  PiggyBank,
  Target,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Wallet,
  LogOut,
} from 'lucide-react';
import { useApp, AppTab } from '../../context/AppContext';

interface SidebarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { userProfile, logout } = useApp();

  // Navigation Items (CoupleSpace and Settings completely removed as per Requirements 7 & 9)
  const navItems = [
    { id: 'dashboard' as AppTab, label: 'Overview', icon: LayoutDashboard, color: '#7557E8' },
    { id: 'salary-split' as AppTab, label: 'Salary Split', icon: PieChart, color: '#7557E8' },
    { id: 'smart-pantry' as AppTab, label: 'Smart Pantry', icon: ShoppingBag, color: '#75D9B0' },
    { id: 'my-savings' as AppTab, label: 'My Savings', icon: PiggyBank, color: '#10B981' },
    { id: 'dream-goals' as AppTab, label: 'Dream Goals', icon: Target, color: '#EC4899' },
    { id: 'bills' as AppTab, label: 'Bills & Subs', icon: CalendarCheck, color: '#D97706' },
  ];

  return (
    <aside
      className={`relative hidden md:flex flex-col bg-white border-r border-purple-100/80 transition-all duration-300 z-30 shadow-sm ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-7 w-7 h-7 rounded-full bg-white border border-gray-200 text-[#7557E8] flex items-center justify-center shadow-md hover:scale-110 transition"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Header Logo */}
      <div className="p-5 flex items-center gap-3 border-b border-gray-100">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7557E8] to-[#4B35A8] flex items-center justify-center text-white shadow-md shadow-[#7557E8]/30 flex-shrink-0">
          <Wallet className="w-5 h-5" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-xl font-black text-[#242139] tracking-tight font-heading">
              Salary<span className="text-[#7557E8]">Split</span>
            </span>
            <span className="block text-[10px] font-bold text-[#75D9B0] uppercase tracking-widest">
              FINTECH PLATFORM
            </span>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-bold text-sm transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-[#7557E8] to-[#5B3DC8] text-white shadow-lg shadow-[#7557E8]/25'
                  : 'text-[#77748B] hover:bg-[#F0EBFF]/70 hover:text-[#7557E8]'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}
                style={{ color: isActive ? '#FFFFFF' : item.color }}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>

              {!collapsed && (
                <div className="flex-1 flex items-center justify-between overflow-hidden">
                  <span className="truncate">{item.label}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom User Card with Logout */}
      <div className="p-3 border-t border-gray-100">
        <div className="p-2.5 flex items-center justify-between gap-2 rounded-2xl bg-[#FAF9FF] border border-purple-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#7557E8] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="text-xs font-bold text-[#242139] truncate">{userProfile.name || 'User'}</div>
                <div className="text-[10px] text-[#77748B] truncate font-mono">{userProfile.phone || 'Signed in'}</div>
              </div>
            )}
          </div>
          {!collapsed && userProfile?.isLoggedIn && (
            <button
              onClick={logout}
              title="Log Out"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
