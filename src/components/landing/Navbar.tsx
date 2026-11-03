import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Menu, X, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  onStartDemo: () => void;
  onLoginClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onStartDemo, onLoginClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userProfile } = useApp();

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'SmartPantry', href: '#smart-pantry' },
    { label: 'MySavings', href: '#my-savings' },
    { label: 'DreamGoals', href: '#dream-goals' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full glass-nav backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#7557E8] to-[#4B35A8] flex items-center justify-center text-white shadow-lg shadow-[#7557E8]/30 animate-pulse-glow">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-[#242139] font-heading">
                Salary<span className="text-[#7557E8]">Split</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#75D9B0]/20 text-[#059669] border border-[#75D9B0]/40 uppercase tracking-wider">
                FINTECH v2.0
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-[#77748B] hover:text-[#7557E8] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {userProfile?.isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-[#F0EBFF] text-[#7557E8] font-bold text-xs flex items-center gap-1.5 border border-[#7557E8]/20">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{userProfile.name}</span>
                </div>
                <button
                  onClick={onStartDemo}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7557E8] to-[#4B35A8] text-white font-bold text-sm hover:shadow-xl hover:shadow-[#7557E8]/30 transition flex items-center gap-2"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-[#242139] hover:bg-[#F0EBFF] hover:text-[#7557E8] transition"
                >
                  Log In
                </button>

                <button
                  onClick={onLoginClick}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7557E8] to-[#4B35A8] text-white font-bold text-sm hover:shadow-xl hover:shadow-[#7557E8]/30 hover:scale-[1.02] transition active:scale-[0.98] flex items-center gap-2"
                >
                  <span>Start Splitting</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#F0EBFF] text-[#7557E8] hover:bg-[#7557E8] hover:text-white transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-lg border-b border-gray-100 overflow-hidden px-4 pt-2 pb-6 space-y-4"
          >
            <div className="flex flex-col space-y-3 pt-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-bold text-[#242139] hover:bg-[#F0EBFF] hover:text-[#7557E8]"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              {userProfile?.isLoggedIn ? (
                <>
                  <div className="px-4 py-2 rounded-xl bg-[#F0EBFF] text-[#7557E8] font-bold text-sm flex items-center justify-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    <span>Signed in as {userProfile.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onStartDemo();
                    }}
                    className="w-full py-3 rounded-xl bg-[#7557E8] text-white text-sm font-bold shadow-lg shadow-[#7557E8]/30 flex items-center justify-center gap-2"
                  >
                    <span>Open Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLoginClick();
                    }}
                    className="w-full py-3 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLoginClick();
                    }}
                    className="w-full py-3 rounded-xl bg-[#7557E8] text-white text-sm font-bold shadow-lg shadow-[#7557E8]/30 flex items-center justify-center gap-2"
                  >
                    <span>Start Splitting My Salary</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
