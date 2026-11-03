import React from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  ShoppingBag,
  Target,
  PiggyBank,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { PantryBasket } from '../illustrations/PantryBasket';

interface FeatureGridProps {
  onSelectFeature: (tab: string) => void;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ onSelectFeature }) => {
  const features = [
    {
      id: 'salary-split',
      icon: PieChart,
      color: '#7557E8',
      bg: '#F0EBFF',
      title: 'SalarySplit Engine',
      description: 'Choose Percentage, Fixed Amount, or Hybrid allocation. Customize unlimited categories with safety over-allocation locks.',
    },
    {
      id: 'smart-pantry',
      icon: ShoppingBag,
      color: '#75D9B0',
      bg: '#ECFDF5',
      title: 'SmartPantry Manager',
      description: 'Intelligent kitchen inventory, grocery shopping list, expiry alerts, and weekly meal planner with 1-click auto expense creation.',
    },
    {
      id: 'dream-goals',
      icon: Target,
      color: '#EC4899',
      bg: '#FDF2F8',
      title: 'DreamGoals & Milestones',
      description: 'Multi-stage cartoon animations for House, Car, Vacation, and Emergency Shield goals with full-screen confetti fireworks!',
    },
    {
      id: 'my-savings',
      icon: PiggyBank,
      color: '#10B981',
      bg: '#ECFDF5',
      title: 'MySavings Vaults',
      description: 'Track individual savings categories and record monthly contributions without double-counting your goals.',
    },
    {
      id: 'bills',
      icon: CalendarCheck,
      color: '#FFB800',
      bg: '#FFFBEB',
      title: 'Bills & Subscriptions',
      description: 'Salary day countdown timer, recurring bill calendar, and no-spend streak challenges.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-[#FAF9FF] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0EBFF] text-[#7557E8] font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>EVERYTHING YOU NEED</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#242139] tracking-tight font-heading">
            Built for Real Life, Designed to Delight
          </h2>
          <p className="text-[#77748B] text-base sm:text-lg">
            Say goodbye to dull, overwhelming spreadsheets. SalarySplit brings clarity, joy, and smart automation to every corner of your finances.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => onSelectFeature(feature.id)}
                className="glass-card rounded-3xl p-8 card-hover-lift cursor-pointer border border-white flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-md"
                    style={{ backgroundColor: feature.bg, color: feature.color }}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#242139] group-hover:text-[#7557E8] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-[#77748B] text-sm leading-relaxed">{feature.description}</p>
                </div>

                <div className="pt-4 flex items-center text-xs font-bold text-[#7557E8] group-hover:translate-x-1 transition-transform">
                  <span>Explore Module</span>
                  <span className="ml-1">→</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
