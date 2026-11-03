import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trash2, Pencil, CheckCircle2, X, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GoalCategoryType, DreamGoal } from '../../types';
import { formatCurrency } from '../../utils/financials';
import { HouseConstruction } from '../illustrations/HouseConstruction';
import { CarRoadAnimation } from '../illustrations/CarRoadAnimation';
import { PlaneVacationAnimation } from '../illustrations/PlaneVacationAnimation';
import { ShieldProtectionAnimation } from '../illustrations/ShieldProtectionAnimation';

export const DreamGoalsView: React.FC = () => {
  const {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    savingsCategories,
    addSavingsContribution,
    savingsTx,
    currency,
  } = useApp();

  // Create Goal Modal State
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [catInput, setCatInput] = useState<GoalCategoryType>('house');
  const [targetInput, setTargetInput] = useState<number>(500000);
  const [targetDateInput, setTargetDateInput] = useState('');

  // Edit Goal Modal State
  const [editingGoal, setEditingGoal] = useState<DreamGoal | null>(null);
  const [editName, setEditName] = useState('');
  const [editTarget, setEditTarget] = useState<number>(0);
  const [editDate, setEditDate] = useState('');

  // Direct Contribution Deposit Modal State
  const [selectedGoalForDeposit, setSelectedGoalForDeposit] = useState<DreamGoal | null>(null);
  const [selectedSavingsCatId, setSelectedSavingsCatId] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState<number>(5000);
  const [depositMonth, setDepositMonth] = useState<string>('January');
  const [depositDate, setDepositDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || targetInput <= 0) return;

    await addGoal({
      name: nameInput.trim(),
      category: catInput,
      targetAmount: Number(targetInput),
      targetDate: targetDateInput || undefined,
      description: `${catInput.toUpperCase()} Dream Goal`,
      status: 'active',
    });

    setNameInput('');
    setTargetInput(500000);
    setIsAddingGoal(false);
  };

  const handleSaveEditGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal || editTarget <= 0) return;

    await updateGoal(editingGoal.id, {
      name: editName.trim() || editingGoal.name,
      targetAmount: Number(editTarget),
      targetDate: editDate || undefined,
    });

    setEditingGoal(null);
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalForDeposit || depositAmount <= 0) return;

    // Use selected savings category or first available or create one
    const catId = selectedSavingsCatId || (savingsCategories[0]?.id || '');

    if (!catId) {
      alert('Please create a savings category first in My Savings to link your savings contribution.');
      return;
    }

    await addSavingsContribution({
      savingsCategoryId: catId,
      goalId: selectedGoalForDeposit.id,
      amount: Number(depositAmount),
      month: depositMonth,
      date: depositDate,
      note: `Contribution towards ${selectedGoalForDeposit.name}`,
    });

    setSelectedGoalForDeposit(null);
    setDepositAmount(5000);
  };

  const renderGoalIllustration = (category: GoalCategoryType, progress: number) => {
    switch (category) {
      case 'house':
        return <HouseConstruction progress={progress} size={170} />;
      case 'car':
        return <CarRoadAnimation progress={progress} size={160} />;
      case 'vacation':
        return <PlaneVacationAnimation progress={progress} size={160} />;
      case 'emergency':
        return <ShieldProtectionAnimation progress={progress} size={160} />;
      default:
        return <HouseConstruction progress={progress} size={160} />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF2F8] text-[#EC4899] font-bold text-xs uppercase tracking-wider mb-2">
            <Target className="w-4 h-4" />
            <span>FINANCIAL DREAM GOALS</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#242139] font-heading">Dream Goals Tracker</h2>
          <p className="text-sm text-[#77748B] mt-1 max-w-2xl">
            Create long-term targets, track savings contributions without double-counting, and watch your progress bar advance.
          </p>
        </div>

        <button
          onClick={() => setIsAddingGoal(true)}
          className="py-3 px-5 rounded-2xl bg-gradient-to-r from-[#EC4899] to-[#7557E8] text-white font-extrabold text-sm hover:shadow-xl hover:shadow-[#EC4899]/30 transition flex items-center gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {isAddingGoal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full bg-white shadow-2xl border border-white/80 relative">
              <button
                onClick={() => setIsAddingGoal(false)}
                className="absolute right-4 top-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleCreateGoal} className="space-y-4">
                <h3 className="text-xl font-black text-[#242139]">Create New Dream Goal</h3>

                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">Goal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Buy a House, Buy a Car, International Trip"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#77748B] mb-1">Target Amount ({currency})</label>
                    <input
                      type="number"
                      required
                      min="1000"
                      step="5000"
                      value={targetInput}
                      onChange={(e) => setTargetInput(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#77748B] mb-1">Category</label>
                    <select
                      value={catInput}
                      onChange={(e) => setCatInput(e.target.value as GoalCategoryType)}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                    >
                      <option value="house">🏡 House</option>
                      <option value="car">🏎️ Car / Vehicle</option>
                      <option value="vacation">✈️ Trip / Vacation</option>
                      <option value="emergency">🛡️ Emergency Shield</option>
                      <option value="tech">💻 Laptop / Tech</option>
                      <option value="education">🎓 Education</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">Target Date (Optional)</label>
                  <input
                    type="date"
                    value={targetDateInput}
                    onChange={(e) => setTargetDateInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#EC4899] to-[#7557E8] text-white font-extrabold text-xs hover:shadow-lg transition"
                  >
                    Create Goal
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingGoal(false)}
                    className="py-3 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Goal Modal */}
      <AnimatePresence>
        {editingGoal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full bg-white shadow-2xl border border-white/80 relative">
              <button
                onClick={() => setEditingGoal(null)}
                className="absolute right-4 top-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleSaveEditGoal} className="space-y-4">
                <h3 className="text-xl font-black text-[#242139]">Edit {editingGoal.name}</h3>

                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">Goal Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">Target Amount ({currency})</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="5000"
                    value={editTarget}
                    onChange={(e) => setEditTarget(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">Target Date</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#EC4899] to-[#7557E8] text-white font-extrabold text-xs hover:shadow-lg transition"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingGoal(null)}
                    className="py-3 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goal Deposit Modal */}
      <AnimatePresence>
        {selectedGoalForDeposit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.form
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onSubmit={handleDepositSubmit}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl max-w-md w-full space-y-4 border border-white relative"
            >
              <button
                type="button"
                onClick={() => setSelectedGoalForDeposit(null)}
                className="absolute right-4 top-4 p-2 rounded-xl text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-black text-[#242139]">
                Contribute to {selectedGoalForDeposit.name}
              </h3>
              <p className="text-xs text-[#77748B]">
                Record a confirmed savings contribution. It will be added to this dream goal and stored in My Savings without double-counting.
              </p>

              <div>
                <label className="block text-xs font-bold text-[#77748B] mb-1">Select Savings Category</label>
                <select
                  required
                  value={selectedSavingsCatId || (savingsCategories[0]?.id || '')}
                  onChange={(e) => setSelectedSavingsCatId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                >
                  {savingsCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">
                    Amount ({currency})
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="500"
                    required
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">Contribution Month</label>
                  <select
                    value={depositMonth}
                    onChange={(e) => setDepositMonth(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                  >
                    {[
                      'January',
                      'February',
                      'March',
                      'April',
                      'May',
                      'June',
                      'July',
                      'August',
                      'September',
                      'October',
                      'November',
                      'December',
                    ].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#77748B] mb-1">Transaction Date</label>
                <input
                  type="date"
                  required
                  value={depositDate}
                  onChange={(e) => setDepositDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#7557E8] to-[#4B35A8] text-white font-extrabold text-xs hover:shadow-lg transition"
                >
                  Record Contribution
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGoalForDeposit(null)}
                  className="py-3 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* Goals Cards Grid or Empty State */}
      {goals.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 border border-white text-center space-y-3 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#FDF2F8] text-[#EC4899] mx-auto flex items-center justify-center font-bold">
            <Target className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-black text-[#242139]">No Dream Goals Created Yet</h4>
          <p className="text-xs text-[#77748B] max-w-md mx-auto">
            You don't have any dream goals set up. Create a goal (e.g. Buy a House, Buy a Car, International Trip) to track your savings progress.
          </p>
          <button
            onClick={() => setIsAddingGoal(true)}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#EC4899] to-[#7557E8] text-white font-bold text-xs hover:shadow-lg transition shadow"
          >
            + Create Your First Dream Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {goals.map((goal) => {
            const amountSaved = Number(goal.currentBalance || 0);
            const targetAmount = Number(goal.targetAmount || 1);
            const remainingAmount = Math.max(0, targetAmount - amountSaved);
            const progress = targetAmount > 0 ? Math.min(100, Math.round((amountSaved / targetAmount) * 100)) : 0;

            // Contributions assigned to this goal
            const assignedTx = savingsTx.filter((t) => t.goalId === goal.id);

            return (
              <div
                key={goal.id}
                className="glass-card rounded-3xl p-6 sm:p-7 border border-white card-hover-lift flex flex-col justify-between space-y-5 relative shadow-sm"
              >
                {/* Top Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black text-[#242139]">{goal.name}</h3>
                    {goal.targetDate && (
                      <span className="text-[11px] text-[#77748B] font-medium block mt-0.5">
                        Target Date: {goal.targetDate}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingGoal(goal);
                        setEditName(goal.name);
                        setEditTarget(goal.targetAmount);
                        setEditDate(goal.targetDate || '');
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#7557E8] hover:bg-[#F0EBFF]"
                      title="Edit Goal"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Animated Illustration */}
                <div className="py-2 flex justify-center">{renderGoalIllustration(goal.category, progress)}</div>

                {/* Metrics Breakdown (Requirement 6) */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-[#77748B] uppercase block">Target</span>
                    <span className="font-mono text-xs font-black text-[#242139]">
                      {formatCurrency(targetAmount, currency)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#10B981] uppercase block">Saved</span>
                    <span className="font-mono text-xs font-black text-[#10B981]">
                      {formatCurrency(amountSaved, currency)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#7557E8] uppercase block">Remaining</span>
                    <span className="font-mono text-xs font-black text-[#7557E8]">
                      {formatCurrency(remainingAmount, currency)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Achievement Percentage */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#77748B]">Achievement Percentage</span>
                    <span className="font-mono font-black text-[#EC4899]">{progress}%</span>
                  </div>

                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-[#7557E8] via-[#75D9B0] to-[#EC4899] transition-all duration-700 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={() => setSelectedGoalForDeposit(goal)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#7557E8] to-[#4B35A8] text-white font-extrabold text-xs hover:shadow-lg transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Allocate Savings Contribution</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
