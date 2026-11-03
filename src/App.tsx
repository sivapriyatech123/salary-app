import React, { useState } from 'react';
import { AppProvider, useApp, AppTab } from './context/AppContext';
import { Navbar } from './components/landing/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { InteractiveSplitPreview } from './components/landing/InteractiveSplitPreview';
import { FeatureGrid } from './components/landing/FeatureGrid';
import { HowItWorks } from './components/landing/HowItWorks';
import { CTASection } from './components/landing/CTASection';
import { Footer } from './components/landing/Footer';


import { Sidebar } from './components/dashboard/Sidebar';
import { Header } from './components/dashboard/Header';
import { SummaryCards } from './components/dashboard/SummaryCards';
import { DashboardCharts } from './components/dashboard/DashboardCharts';
import { SalarySplitEngine } from './components/salary-split/SalarySplitEngine';
import { SmartPantryView } from './components/smart-pantry/SmartPantryView';
import { MySavingsView } from './components/savings/MySavingsView';
import { DreamGoalsView } from './components/goals/DreamGoalsView';
import { BillCalendarView } from './components/extras/BillCalendarView';

import { CelebrationConfettiModal } from './components/illustrations/CelebrationConfettiModal';
import { LoginModal } from './components/auth/LoginModal';
import { CurrencyCode } from './types';
import { formatCurrency } from './utils/financials';
import { Sparkles, Calendar, Plus, Sliders } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    userProfile,
    setUserProfile,
    monthlyIncome,
    setMonthlyIncome,
    currency,
    setCurrency,
    activeCelebration,
    closeCelebration,
  } = useApp();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [viewState, setViewState] = useState<'landing' | 'dashboard'>(
    userProfile.isLoggedIn ? 'dashboard' : 'landing'
  );

  React.useEffect(() => {
    if (userProfile.isLoggedIn) {
      setViewState('dashboard');
    } else {
      setViewState('landing');
    }
  }, [userProfile.isLoggedIn]);

  const handleStartSplittingFromHero = (inc?: number, curr?: CurrencyCode) => {
    if (inc) setMonthlyIncome(inc);
    if (curr) setCurrency(curr);
    if (!userProfile.isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      setViewState('dashboard');
      setActiveTab('salary-split');
    }
  };


  if (viewState === 'landing') {
    return (
      <div className="min-h-screen bg-[#FAF9FF] flex flex-col justify-between">
        <Navbar
          onStartDemo={() => {
            if (userProfile.isLoggedIn) {
              setViewState('dashboard');
            } else {
              setIsLoginModalOpen(true);
            }
          }}
          onLoginClick={() => setIsLoginModalOpen(true)}
        />
        <main className="flex-1">
          <HeroSection
            onStartSplitting={handleStartSplittingFromHero}
            onExploreFeatures={() => {
              const elem = document.getElementById('features');
              elem?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
          <InteractiveSplitPreview
            onTryFullApp={() => {
              if (userProfile.isLoggedIn) {
                setViewState('dashboard');
              } else {
                setIsLoginModalOpen(true);
              }
            }}
          />
          <FeatureGrid
            onSelectFeature={(tab) => {
              if (userProfile.isLoggedIn) {
                setActiveTab(tab as AppTab);
                setViewState('dashboard');
              } else {
                setIsLoginModalOpen(true);
              }
            }}
          />
          <HowItWorks
            onGetStarted={() => {
              if (userProfile.isLoggedIn) {
                setViewState('dashboard');
                setActiveTab('salary-split');
              } else {
                setIsLoginModalOpen(true);
              }
            }}
          />
          <CTASection
            onStart={() => {
              if (userProfile.isLoggedIn) {
                setViewState('dashboard');
                setActiveTab('salary-split');
              } else {
                setIsLoginModalOpen(true);
              }
            }}
          />
        </main>
        <Footer />

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={() => {
            setViewState('dashboard');
            setActiveTab('salary-split');
          }}
        />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#FAF9FF] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={activeTab.replace('-', ' ')} onMobileMenuOpen={() => {}} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Active Tab Router */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Personalized User Welcome Banner */}
              <div className="glass-card rounded-3xl p-6 sm:p-7 border border-[#7557E8]/20 bg-gradient-to-r from-white via-[#F0EBFF]/50 to-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#7557E8] text-white flex items-center justify-center font-black text-xl shadow-lg shadow-[#7557E8]/30 flex-shrink-0">
                    {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#242139] font-heading">
                      Welcome, {userProfile.name || 'User'}! 👋
                    </h2>
                    {monthlyIncome > 0 ? (
                      <p className="text-xs text-[#77748B] mt-0.5">
                        Your dashboard is actively calculating budget allocations, spending, and savings based on your monthly salary of{' '}
                        <strong className="text-[#7557E8] font-mono">{formatCurrency(monthlyIncome, currency)}</strong>.
                      </p>
                    ) : (
                      <p className="text-xs text-amber-700 font-semibold mt-0.5">
                        ⚠️ You haven't set your monthly salary yet. Please enter your income in the Salary Split page to calculate your budget allocations.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                  {monthlyIncome > 0 ? (
                    <button
                      onClick={() => setActiveTab('salary-split')}
                      className="py-2.5 px-4 rounded-xl bg-[#7557E8] text-white font-extrabold text-xs hover:bg-[#4B35A8] transition shadow-md shadow-[#7557E8]/20 flex items-center gap-2"
                    >
                      <Sliders className="w-4 h-4" />
                      <span>Adjust Salary in Salary Split</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('salary-split')}
                      className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#7557E8] to-[#4B35A8] text-white font-black text-xs hover:shadow-xl hover:shadow-[#7557E8]/30 transition flex items-center justify-center gap-2 animate-pulse"
                    >
                      <span>👉 Set Salary in Salary Split</span>
                    </button>
                  )}
                </div>
              </div>

              <SummaryCards />
              <DashboardCharts />
            </div>
          )}

          {activeTab === 'salary-split' && <SalarySplitEngine />}
          {activeTab === 'smart-pantry' && <SmartPantryView />}
          {activeTab === 'my-savings' && <MySavingsView />}
          {activeTab === 'dream-goals' && <DreamGoalsView />}
          {activeTab === 'bills' && <BillCalendarView />}
        </main>
      </div>

      {/* Global Modals */}
      {activeCelebration && (
        <CelebrationConfettiModal
          isOpen={activeCelebration.isOpen}
          onClose={closeCelebration}
          title={activeCelebration.title}
          subtitle={activeCelebration.subtitle}
          amountSaved={activeCelebration.amount}
        />
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setViewState('dashboard');
          setActiveTab('salary-split');
        }}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
