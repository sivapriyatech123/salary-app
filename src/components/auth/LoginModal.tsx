import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Phone, Sparkles, AlertCircle, ArrowRight, Wallet } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, triggerCelebration } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await login(name.trim(), phone.trim());
      triggerCelebration(
        `Welcome, ${name.trim()}! 🎉`,
        res?.isNewUser
          ? 'Your personal financial workspace is created. Start by setting your salary in Salary Split.'
          : 'Welcome back! Your saved workspace has been restored.'
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full bg-white shadow-2xl border border-white/80 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Modal Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#F0EBFF] text-[#7557E8] mx-auto flex items-center justify-center shadow-inner">
              <Wallet className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-[#242139] font-heading">
              Sign In to <span className="text-[#7557E8]">SalarySplit</span>
            </h3>
            <p className="text-xs text-[#77748B] max-w-xs mx-auto">
              Enter your Name and Phone Number to access your isolated personal workspace. No OTP or password required.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields: EXACTLY Name and Phone Number */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#77748B] mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Siva Priya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 rounded-xl border border-gray-200 text-sm font-bold text-[#242139] focus:outline-none focus:ring-2 focus:ring-[#7557E8] focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#77748B] mb-1.5 uppercase tracking-wider">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 rounded-xl border border-gray-200 text-sm font-bold text-[#242139] font-mono focus:outline-none focus:ring-2 focus:ring-[#7557E8] focus:border-transparent transition"
                />
              </div>
              <span className="text-[11px] text-[#77748B] mt-1 block">
                Existing users log in with their phone number to restore saved data.
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7557E8] to-[#4B35A8] text-white font-extrabold text-sm hover:shadow-lg hover:shadow-[#7557E8]/25 active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
