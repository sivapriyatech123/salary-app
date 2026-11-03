import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PiggyBank,
  Plus,
  Trash2,
  Pencil,
  CheckCircle2,
  X,
  Target,
  Sparkles,
  Calendar,
  DollarSign,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/financials';
import { SavingsCategory } from '../../types';

const MONTH_NAMES = [
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
];

export const MySavingsView: React.FC = () => {
  const {
    savingsCategories,
    savingsTx,
    addSavingsCategory,
    updateSavingsCategory,
    deleteSavingsCategory,
    addSavingsContribution,
    deleteSavingsTransaction,
    goals,
    totalSavings,
    currency,
  } = useApp();

  // Create Category Modal State
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [catNameInput, setCatNameInput] = useState('');
  const [catMonthlyTarget, setCatMonthlyTarget] = useState<number>(5000);
  const [catTargetAmount, setCatTargetAmount] = useState<number>(50000);
  const [catColor, setCatColor] = useState('#10B981');

  // Edit Category Modal State
  const [editingCategory, setEditingCategory] = useState<SavingsCategory | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatMonthly, setEditCatMonthly] = useState<number>(0);
  const [editCatTarget, setEditCatTarget] = useState<number>(0);

  // Add Contribution Modal State
  const [contributingCatId, setContributingCatId] = useState<string | null>(null);
  const [contribAmount, setContribAmount] = useState<number>(5000);
  const [contribMonth, setContribMonth] = useState<string>(
    MONTH_NAMES[new Date().getMonth()]
  );
  const [contribDate, setContribDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [contribNote, setContribNote] = useState<string>('Monthly contribution');
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');

  // Handle Create Savings Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameInput.trim()) return;

    await addSavingsCategory({
      name: catNameInput.trim(),
      monthlyTarget: Number(catMonthlyTarget) || 0,
      targetAmount: Number(catTargetAmount) || 0,
      color: catColor,
      icon: 'PiggyBank',
    });

    setCatNameInput('');
    setCatMonthlyTarget(5000);
    setIsCreatingCategory(false);
  };

  // Handle Edit Category Save
  const handleSaveEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    await updateSavingsCategory(editingCategory.id, {
      name: editCatName.trim() || editingCategory.name,
      monthlyTarget: Number(editCatMonthly) || 0,
      targetAmount: Number(editCatTarget) || 0,
    });

    setEditingCategory(null);
  };

  // Handle Add Contribution Save
  const handleRecordContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributingCatId || contribAmount <= 0) return;

    await addSavingsContribution({
      savingsCategoryId: contributingCatId,
      amount: Number(contribAmount),
      month: contribMonth,
      date: contribDate,
      note: contribNote,
      goalId: selectedGoalId || undefined,
    });

    setContributingCatId(null);
    setContribAmount(5000);
    setSelectedGoalId('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#10B981] font-bold text-xs uppercase tracking-wider mb-2">
            <PiggyBank className="w-4 h-4" />
            <span>INDIVIDUAL SAVINGS VAULTS</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#242139] font-heading">My Savings</h2>
          <p className="text-sm text-[#77748B] mt-1 max-w-2xl">
            Track individual savings categories independently month-by-month. Savings increase only when actual contributions are recorded.
          </p>
        </div>

        {/* Stats Pill & Add Button */}
        <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-left sm:text-right">
            <span className="text-[11px] font-bold text-[#77748B] uppercase block">Total Saved</span>
            <div className="text-2xl sm:text-3xl font-black text-[#10B981] font-mono mt-0.5">
              {formatCurrency(totalSavings, currency)}
            </div>
          </div>

          <button
            onClick={() => setIsCreatingCategory(true)}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-extrabold text-sm hover:shadow-lg hover:shadow-[#10B981]/25 transition flex items-center gap-2 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Savings Category</span>
          </button>
        </div>
      </div>

      {/* Create Category Modal */}
      <AnimatePresence>
        {isCreatingCategory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full bg-white shadow-2xl border border-white/80 relative">
              <button
                onClick={() => setIsCreatingCategory(false)}
                className="absolute right-4 top-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center">
                    <PiggyBank className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#242139]">Create Savings Category</h3>
                    <p className="text-xs text-[#77748B]">Set up an independent savings fund</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. House Saving, Car Saving, Emergency Fund"
                    value={catNameInput}
                    onChange={(e) => setCatNameInput(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#77748B] mb-1">
                      Monthly Contribution ({currency})
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={catMonthlyTarget}
                      onChange={(e) => setCatMonthlyTarget(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#77748B] mb-1">
                      Target Goal ({currency})
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={catTargetAmount}
                      onChange={(e) => setCatTargetAmount(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">Color Theme</label>
                  <div className="flex items-center gap-2">
                    {['#10B981', '#7557E8', '#EC4899', '#38BDF8', '#F59E0B'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setCatColor(color)}
                        className={`w-7 h-7 rounded-xl transition ${
                          catColor === color ? 'ring-2 ring-offset-2 ring-[#242139] scale-110' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-extrabold text-xs hover:shadow-lg transition"
                  >
                    Create Category
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreatingCategory(false)}
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

      {/* Record Monthly Contribution Modal */}
      <AnimatePresence>
        {contributingCatId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full bg-white shadow-2xl border border-white/80 relative">
              <button
                onClick={() => setContributingCatId(null)}
                className="absolute right-4 top-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleRecordContribution} className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#242139]">
                      Record Contribution
                    </h3>
                    <p className="text-xs text-[#77748B]">
                      {savingsCategories.find((c) => c.id === contributingCatId)?.name}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#77748B] mb-1">
                      Contribution Amount ({currency})
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="500"
                      required
                      value={contribAmount}
                      onChange={(e) => setContribAmount(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#77748B] mb-1">Contribution Month</label>
                    <select
                      value={contribMonth}
                      onChange={(e) => setContribMonth(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                    >
                      {MONTH_NAMES.map((m) => (
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
                    value={contribDate}
                    onChange={(e) => setContribDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                  />
                </div>

                {/* Optional Dream Goal Assignment (Integration with Requirement 6) */}
                {goals.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-[#7557E8] mb-1 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" />
                      <span>Assign to Dream Goal (Optional)</span>
                    </label>
                    <select
                      value={selectedGoalId}
                      onChange={(e) => setSelectedGoalId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#7557E8]/30 bg-[#FAF9FF] text-xs font-bold text-[#242139]"
                    >
                      <option value="">-- No Dream Goal Linked --</option>
                      {goals.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name} (Target: {formatCurrency(g.targetAmount, currency)})
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-[#77748B] mt-0.5 block">
                      Assigning directly updates the dream goal's progress without double-counting savings.
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">Note / Description</label>
                  <input
                    type="text"
                    value={contribNote}
                    onChange={(e) => setContribNote(e.target.value)}
                    placeholder="e.g. Monthly salary savings deposit"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-extrabold text-xs hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Contribution</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContributingCatId(null)}
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

      {/* Edit Category Modal */}
      <AnimatePresence>
        {editingCategory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full bg-white shadow-2xl border border-white/80 relative">
              <button
                onClick={() => setEditingCategory(null)}
                className="absolute right-4 top-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleSaveEditCategory} className="space-y-4">
                <h3 className="text-lg font-black text-[#242139]">Edit {editingCategory.name}</h3>

                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    value={editCatName}
                    onChange={(e) => setEditCatName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#77748B] mb-1">
                      Monthly Contribution ({currency})
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={editCatMonthly}
                      onChange={(e) => setEditCatMonthly(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#77748B] mb-1">
                      Target Goal ({currency})
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={editCatTarget}
                      onChange={(e) => setEditCatTarget(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139] font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-extrabold text-xs hover:shadow-lg transition"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
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

      {/* Individual Savings Categories (Compact & Clean Interface) */}
      {savingsCategories.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 border border-white text-center space-y-3 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#10B981] mx-auto flex items-center justify-center font-bold">
            <PiggyBank className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-black text-[#242139]">No Savings Categories Added Yet</h4>
          <p className="text-xs text-[#77748B] max-w-md mx-auto">
            You haven't started saving yet. Create your first individual savings category (e.g., House Saving, Emergency Fund, Car Saving) to track monthly contributions.
          </p>
          <button
            onClick={() => setIsCreatingCategory(true)}
            className="py-2.5 px-5 rounded-xl bg-[#10B981] text-white font-bold text-xs hover:bg-[#059669] transition shadow"
          >
            + Create First Savings Category
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savingsCategories.map((cat) => {
              // Transactions belonging to this category
              const catTx = savingsTx.filter((t) => t.savingsCategoryId === cat.id);
              const catTotalSaved = catTx.reduce((sum, t) => sum + (t.amount || 0), 0);

              return (
                <div
                  key={cat.id}
                  className="glass-card rounded-2xl p-5 border border-white flex flex-col justify-between space-y-4 shadow-sm relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0"
                        style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                      >
                        <PiggyBank className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-[#242139] leading-tight">{cat.name}</h4>
                        <span className="text-[11px] text-[#77748B] block mt-0.5 font-medium">
                          Monthly: {formatCurrency(cat.monthlyTarget || 0, currency)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setEditCatName(cat.name);
                          setEditCatMonthly(cat.monthlyTarget || 0);
                          setEditCatTarget(cat.targetAmount || 0);
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#7557E8] hover:bg-[#F0EBFF]"
                        title="Edit Category"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteSavingsCategory(cat.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Total Amount Saved Under Category */}
                  <div className="p-3.5 rounded-xl bg-[#ECFDF5]/60 border border-emerald-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#059669] uppercase tracking-wider block">
                        Total Amount Saved
                      </span>
                      <span className="text-xl font-black text-[#059669] font-mono">
                        {formatCurrency(catTotalSaved, currency)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setContributingCatId(cat.id);
                        setContribAmount(cat.monthlyTarget || 5000);
                      }}
                      className="py-1.5 px-3 rounded-lg bg-[#10B981] text-white font-extrabold text-xs hover:bg-[#059669] transition shadow-sm flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Contribution</span>
                    </button>
                  </div>

                  {/* Individual Monthly Contributions Tracking */}
                  <div className="space-y-1.5 pt-1 border-t border-gray-100">
                    <span className="text-[11px] font-bold text-[#77748B] block">
                      Monthly Contributions ({catTx.length})
                    </span>

                    {catTx.length === 0 ? (
                      <p className="text-[11px] text-[#77748B] italic py-1">
                        No contributions added yet.
                      </p>
                    ) : (
                      <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                        {catTx.map((tx) => (
                          <div
                            key={tx.id}
                            className="p-2 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-extrabold text-[#242139]">{tx.month}</span>
                              <span className="text-[10px] text-[#77748B] ml-1.5 font-mono">({tx.date})</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-[#059669]">
                                +{formatCurrency(tx.amount, currency)}
                              </span>
                              <button
                                onClick={() => deleteSavingsTransaction(tx.id)}
                                className="text-gray-300 hover:text-red-500 p-0.5"
                                title="Delete Contribution"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
