import { Wallet, Heart, Globe, Share2, Shield, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#242139] text-white pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7557E8] flex items-center justify-center text-white font-bold">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black font-heading tracking-tight">
                Salary<span className="text-[#75D9B0]">Split</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Smart salary allocation, intelligent SmartPantry grocery management, DreamGoals, and CoupleSpace household budgeting.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#75D9B0]">Modules</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#salary-split" className="hover:text-white transition">SalarySplit Engine</a></li>
              <li><a href="#smart-pantry" className="hover:text-white transition">SmartPantry Grocery Manager</a></li>
              <li><a href="#dream-goals" className="hover:text-white transition">DreamGoals Animations</a></li>
              <li><a href="#my-savings" className="hover:text-white transition">MySavings Individual Vaults</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#75D9B0]">Features</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">MySavings Vaults</a></li>
              <li><a href="#" className="hover:text-white transition">What-If Simulator</a></li>
              <li><a href="#" className="hover:text-white transition">Bill & Subscription Tracker</a></li>
              <li><a href="#" className="hover:text-white transition">Monthly Reports CSV Export</a></li>
            </ul>
          </div>

          {/* Privacy & Trust */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#75D9B0]">Security & Privacy</h4>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#75D9B0]" />
                <span>Zero Bank Credentials Required</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#7557E8]" />
                <span>Row Level Security (RLS) Supabase Ready</span>
              </div>
              <p className="pt-2 text-[11px] text-gray-500">
                SalarySplit is designed to empower your financial decisions without tracking private bank logins.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div>
            © {new Date().getFullYear()} SalarySplit Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-[#EC4899] fill-[#EC4899]" />
            <span>for smart fintech management</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
