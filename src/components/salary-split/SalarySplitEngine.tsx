import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders,
  Plus,
  Trash2,
  DollarSign,
  PieChart,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Wallet,
  Sparkles,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AllocationMethod, BudgetCategory, CategoryType } from '../../types';
import { formatCurrency, getTotalAllocated, getUnallocatedIncome, CURRENCIES } from '../../utils/financials';

export const SalarySplitEngine: React.FC = () => {
  const {
    currency,
    monthlyIncome,
    setMonthlyIncome,
    allocationMethod,
    setAllocationMethod,
    categories,
    updateCategory,
    addCategory,
    deleteCategory,
    distributeRemainingPercentage,
    setActiveTab,
    userProfile,
  } = useApp();

  const [inputIncome, setInputIncome] = useState<string>(monthlyIncome ? String(monthlyIncome) : '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync when monthlyIncome changes externally
  React.useEffect(() => {
    setInputIncome(monthlyIncome ? String(monthlyIncome) : '');
  }, [monthlyIncome]);

  const handleSaveIncome = async () => {
    const amount = Number(inputIncome);
    if (isNaN(amount) || amount < 0) return;
    await setMonthlyIncome(amount);
    setInputIncome(String(amount));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryTypeFilter, setCategoryTypeFilter] = useState<'all' | 'expenses' | 'savings'>('all');
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<CategoryType>('needs');
  const [newCatColor, setNewCatColor] = useState('#7557E8');
  const [newCatAmount, setNewCatAmount] = useState(3000);

  // Editing Category Inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState(0);

  const expenseCategories = categories.filter((c) => c.type !== 'savings');
  const savingsCategories = categories.filter((c) => c.type === 'savings');

  const totalExpenseAlloc = expenseCategories.reduce((s, c) => s + (c.allocatedAmount || 0), 0);
  const totalSavingsAlloc = savingsCategories.reduce((s, c) => s + (c.allocatedAmount || 0), 0);

  const displayedCategories = categories.filter((c) => {
    if (categoryTypeFilter === 'expenses') return c.type !== 'savings';
    if (categoryTypeFilter === 'savings') return c.type === 'savings';
    return true;
  });

  const totalAllocated = getTotalAllocated(categories);
  const unallocatedIncome = getUnallocatedIncome(monthlyIncome, categories);
  const allocatedPercentageSum = categories.reduce((sum, c) => sum + (c.allocatedPercentage || 0), 0);

  const isOverAllocated = monthlyIncome > 0 && totalAllocated > monthlyIncome;
  const overAllocatedAmount = Math.max(0, totalAllocated - monthlyIncome);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const initialPct = monthlyIncome > 0 ? Math.round((newCatAmount / monthlyIncome) * 1000) / 10 : 0;
    await addCategory({
      name: newCatName.trim(),
      icon: 'Tag',
      color: newCatColor,
      type: newCatType,
      allocatedAmount: newCatAmount,
      allocatedPercentage: initialPct,
      order: categories.length + 1,
    });

    setNewCatName('');
    setIsAddingCategory(false);
  };

  const startEdit = (cat: BudgetCategory) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditAmount(cat.allocatedAmount);
  };

  const saveEdit = async (cat: BudgetCategory) => {
    const newAmt = Math.max(0, Number(editAmount));
    const newPct = monthlyIncome > 0 ? Math.round((newAmt / monthlyIncome) * 1000) / 10 : cat.allocatedPercentage;
    await updateCategory(cat.id, {
      name: editName.trim() || cat.name,
      allocatedAmount: newAmt,
      allocatedPercentage: newPct,
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0EBFF] text-[#7557E8] font-bold text-xs uppercase tracking-wider mb-2">
            <Sliders className="w-4 h-4" />
            <span>CORE ALLOCATION ENGINE</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#242139] font-heading">Salary Split Engine</h2>
          <p className="text-sm text-[#77748B] mt-1">
            Enter your monthly salary, create custom allocation categories, and automatically sync your live dashboard.
          </p>
        </div>

        {/* Allocation Method Selector Pills */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#FAF9FF] border border-gray-200">
          {[
            { id: 'percentage', label: 'Percentage %' },
            { id: 'fixed', label: 'Fixed Amount $' },
            { id: 'hybrid', label: 'Hybrid Rules' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setAllocationMethod(m.id as AllocationMethod)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                allocationMethod === m.id
                  ? 'bg-[#7557E8] text-white shadow'
                  : 'text-[#77748B] hover:text-[#7557E8]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Monthly Salary Setup Card (Quick Select completely removed) */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 border-2 border-[#7557E8]/30 bg-gradient-to-br from-white via-[#FAF9FF] to-[#F0EBFF] shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#7557E8] text-white flex items-center justify-center shadow-md shadow-[#7557E8]/30 flex-shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-[#242139] font-heading">
                  Set Your Monthly Salary
                </h3>
                {monthlyIncome > 0 ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#ECFDF5] text-[#059669] border border-[#75D9B0]/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Configured: {formatCurrency(monthlyIncome, currency)}
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Income Required
                  </span>
                )}
              </div>
              <p className="text-xs text-[#77748B] mt-0.5">
                {userProfile.name ? `User: ${userProfile.name} • ` : ''}Manually enter your monthly take-home salary. Allocations and dashboard charts update automatically.
              </p>
            </div>
          </div>

          {monthlyIncome > 0 && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="self-start sm:self-auto py-2.5 px-4 rounded-xl bg-white border border-[#7557E8]/30 text-[#7557E8] hover:bg-[#7557E8] hover:text-white font-extrabold text-xs transition shadow-sm flex items-center gap-2"
            >
              <span>View Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Manual Salary Input Form */}
        <div className="flex flex-col sm:flex-row gap-3 items-center pt-2">
          <div className="relative flex-1 w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-lg text-[#7557E8]">
              {CURRENCIES[currency]?.symbol || '₹'}
            </span>
            <input
              type="number"
              min="0"
              step="500"
              placeholder="Enter monthly salary, e.g. 50000"
              value={inputIncome}
              onChange={(e) => setInputIncome(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveIncome();
              }}
              className="w-full py-3.5 pl-10 pr-4 rounded-2xl bg-white border-2 border-[#7557E8]/30 font-mono font-black text-xl text-[#242139] focus:outline-none focus:ring-4 focus:ring-[#7557E8]/20 focus:border-[#7557E8] transition shadow-inner"
            />
          </div>
          <button
            onClick={handleSaveIncome}
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#7557E8] to-[#4B35A8] text-white font-black text-sm hover:shadow-xl hover:shadow-[#7557E8]/30 active:scale-[0.99] transition flex items-center justify-center gap-2 flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Save & Apply Income</span>
          </button>
        </div>

        {/* Validation Warning when Allocations exceed salary */}
        {isOverAllocated && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>
              Validation Warning: Total allocations exceed your monthly salary by{' '}
              <strong>{formatCurrency(overAllocatedAmount, currency)}</strong>. Please decrease category allocations.
            </span>
          </div>
        )}

        {/* Success Alert Banner */}
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                Monthly salary successfully updated to <strong>{formatCurrency(monthlyIncome, currency)}</strong>! All category allocations and dashboard charts are synchronized.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="underline text-emerald-900 font-extrabold hover:text-emerald-700 text-xs flex items-center gap-1"
            >
              <span>See Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Salary & Unallocated Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income Card */}
        <div className="glass-card rounded-2xl p-5 border border-white flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold text-[#77748B] uppercase tracking-wider">Monthly Salary</span>
            <div className="text-2xl font-black text-[#7557E8] font-mono mt-1">
              {formatCurrency(monthlyIncome, currency)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F0EBFF] text-[#7557E8] flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Total Allocated Card */}
        <div className="glass-card rounded-2xl p-5 border border-white flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold text-[#77748B] uppercase tracking-wider">Total Allocated</span>
            <div className="text-2xl font-black text-[#242139] font-mono mt-1">
              {formatCurrency(totalAllocated, currency)} ({allocatedPercentageSum.toFixed(1)}%)
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center font-bold">
            <PieChart className="w-5 h-5" />
          </div>
        </div>

        {/* Unallocated Income Card */}
        <div
          className={`glass-card rounded-2xl p-5 border flex items-center justify-between transition-colors shadow-sm ${
            isOverAllocated ? 'bg-red-50/80 border-red-200 text-red-900' : 'border-white'
          }`}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#77748B]">
              {isOverAllocated ? 'Over Allocated Warning' : 'Remaining Salary'}
            </span>
            <div
              className={`text-2xl font-black font-mono mt-1 ${
                isOverAllocated ? 'text-red-600' : 'text-[#7557E8]'
              }`}
            >
              {isOverAllocated
                ? `-${formatCurrency(overAllocatedAmount, currency)}`
                : formatCurrency(unallocatedIncome, currency)}
            </div>
          </div>

          {unallocatedIncome > 0 && allocationMethod === 'percentage' && categories.length > 0 && (
            <button
              onClick={distributeRemainingPercentage}
              className="px-3 py-1.5 rounded-xl bg-[#7557E8] text-white font-bold text-xs hover:bg-[#4B35A8] transition shadow"
            >
              Distribute %
            </button>
          )}
        </div>
      </div>

      {/* Category Manager Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-[#242139] font-heading">Category Allocations</h3>
          <p className="text-xs text-[#77748B] mt-0.5">
            Configure allocations for expenses and savings. Amounts and percentages synchronize in real time.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Expenses vs Savings Filters */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 border border-gray-200 text-xs font-bold">
            <button
              onClick={() => setCategoryTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                categoryTypeFilter === 'all'
                  ? 'bg-white text-[#7557E8] shadow-sm font-extrabold'
                  : 'text-[#77748B] hover:text-[#242139]'
              }`}
            >
              All ({categories.length})
            </button>
            <button
              onClick={() => setCategoryTypeFilter('expenses')}
              className={`px-3 py-1.5 rounded-lg transition ${
                categoryTypeFilter === 'expenses'
                  ? 'bg-white text-[#FF6B6B] shadow-sm font-extrabold'
                  : 'text-[#77748B] hover:text-[#242139]'
              }`}
            >
              Expenses ({formatCurrency(totalExpenseAlloc, currency)})
            </button>
            <button
              onClick={() => setCategoryTypeFilter('savings')}
              className={`px-3 py-1.5 rounded-lg transition ${
                categoryTypeFilter === 'savings'
                  ? 'bg-white text-[#10B981] shadow-sm font-extrabold'
                  : 'text-[#77748B] hover:text-[#242139]'
              }`}
            >
              Savings ({formatCurrency(totalSavingsAlloc, currency)})
            </button>
          </div>

          <button
            onClick={() => setIsAddingCategory(true)}
            className="py-2.5 px-4 rounded-xl bg-[#7557E8] text-white font-bold text-xs hover:bg-[#4B35A8] shadow-md shadow-[#7557E8]/20 transition flex items-center gap-1.5 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Add Custom Category Form Modal */}
      <AnimatePresence>
        {isAddingCategory && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateCategory}
            className="glass-card rounded-2xl p-6 border border-[#7557E8]/30 space-y-4"
          >
            <h4 className="text-base font-extrabold text-[#242139]">Create New Salary Category</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#77748B] mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rent, Groceries, Emergency Fund"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#77748B] mb-1">Category Type</label>
                <select
                  value={newCatType}
                  onChange={(e) => setNewCatType(e.target.value as CategoryType)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                >
                  <option value="needs">Needs (Essential Expenses)</option>
                  <option value="wants">Wants (Lifestyle Expenses)</option>
                  <option value="savings">Savings & Goals (Vault)</option>
                  <option value="debt">Debt / EMIs</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#77748B] mb-1">
                  Monthly Allocation ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={newCatAmount}
                  onChange={(e) => setNewCatAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139] font-mono"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#7557E8] text-white font-bold text-xs hover:bg-[#4B35A8] transition shadow"
                >
                  Save Category
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Categories Grid or Empty State */}
      {displayedCategories.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 border border-white text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#F0EBFF] text-[#7557E8] mx-auto flex items-center justify-center font-bold">
            <Sliders className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-black text-[#242139]">No Categories Created Yet</h4>
          <p className="text-xs text-[#77748B] max-w-md mx-auto">
            You don't have any salary allocation categories configured. Click "+ Add Category" to start splitting your monthly salary.
          </p>
          <button
            onClick={() => setIsAddingCategory(true)}
            className="py-2.5 px-5 rounded-xl bg-[#7557E8] text-white font-bold text-xs hover:bg-[#4B35A8] transition shadow"
          >
            + Add Your First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCategories.map((cat) => {
            const isEditing = editingId === cat.id;

            return (
              <div
                key={cat.id}
                className="glass-card rounded-3xl p-6 border border-white card-hover-lift flex flex-col justify-between space-y-4 relative shadow-sm"
              >
                {/* Header: Icon, Name & Actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm"
                      style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                    >
                      ●
                    </div>
                    <div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="p-1 rounded-lg border border-[#7557E8] text-sm font-bold text-[#242139]"
                        />
                      ) : (
                        <h4 className="text-base font-extrabold text-[#242139]">{cat.name}</h4>
                      )}
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-gray-100 text-[#77748B] inline-block mt-0.5">
                        {cat.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {isEditing ? (
                      <button
                        onClick={() => saveEdit(cat)}
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                        title="Save Changes"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#7557E8] hover:bg-[#F0EBFF]"
                        title="Edit Category"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Amount / Percentage Inputs */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#77748B]">Allocated Amount</span>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={editAmount}
                        onChange={(e) => setEditAmount(Number(e.target.value))}
                        className="w-28 p-1 rounded-lg border border-[#7557E8] text-sm font-mono font-bold text-right"
                      />
                    ) : (
                      <span className="text-xl font-black text-[#242139] font-mono">
                        {formatCurrency(cat.allocatedAmount, currency)}
                      </span>
                    )}
                  </div>

                  {/* Percentage Slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#77748B] font-semibold">Paycheck Share</span>
                      <span className="font-mono font-bold text-[#7557E8]">
                        {cat.allocatedPercentage}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="0.5"
                      value={cat.allocatedPercentage}
                      onChange={(e) => {
                        const newPct = Number(e.target.value);
                        const newAmt = monthlyIncome > 0 ? Math.round((monthlyIncome * newPct) / 100) : cat.allocatedAmount;
                        updateCategory(cat.id, {
                          allocatedPercentage: newPct,
                          allocatedAmount: newAmt,
                        });
                      }}
                      className="w-full accent-[#7557E8] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
