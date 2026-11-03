import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarCheck,
  CheckCircle2,
  Plus,
  Trash2,
  Pencil,
  X,
  Clock,
  Tv,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/financials';
import { BillItem, SubscriptionItem } from '../../types';

export const BillCalendarView: React.FC = () => {
  const {
    bills,
    addBill,
    updateBill,
    toggleBillPaid,
    deleteBill,
    subscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    currency,
  } = useApp();

  // Add Bill Modal State
  const [isAddingBill, setIsAddingBill] = useState(false);
  const [billTitle, setBillTitle] = useState('');
  const [billAmount, setBillAmount] = useState<number>(1500);
  const [billDueDate, setBillDueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [billCategory, setBillCategory] = useState('Utilities');
  const [billAutoPay, setBillAutoPay] = useState(false);

  // Edit Bill State
  const [editingBill, setEditingBill] = useState<BillItem | null>(null);
  const [editBillTitle, setEditBillTitle] = useState('');
  const [editBillAmount, setEditBillAmount] = useState<number>(0);
  const [editBillDue, setEditBillDue] = useState('');

  // Add Subscription Modal State
  const [isAddingSub, setIsAddingSub] = useState(false);
  const [subName, setSubName] = useState('');
  const [subCost, setSubCost] = useState<number>(499);
  const [subRenewal, setSubRenewal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [subCategory, setSubCategory] = useState('Entertainment');

  // Edit Subscription State
  const [editingSub, setEditingSub] = useState<SubscriptionItem | null>(null);
  const [editSubName, setEditSubName] = useState('');
  const [editSubCost, setEditSubCost] = useState<number>(0);
  const [editSubRenewal, setEditSubRenewal] = useState('');

  // Calculations
  const totalBills = bills.reduce((sum, b) => sum + (b.amount || 0), 0);
  const paidBillsTotal = bills.filter((b) => b.isPaid).reduce((sum, b) => sum + (b.amount || 0), 0);
  const upcomingBillsTotal = Math.max(0, totalBills - paidBillsTotal);
  const totalSubsCost = subscriptions.reduce((sum, s) => sum + (s.cost || 0), 0);

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!billTitle.trim() || billAmount <= 0) return;

    await addBill({
      title: billTitle.trim(),
      amount: Number(billAmount),
      dueDate: billDueDate,
      category: billCategory,
      isAutoPay: billAutoPay,
    });

    setBillTitle('');
    setIsAddingBill(false);
  };

  const handleSaveEditBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBill || editBillAmount <= 0) return;

    await updateBill(editingBill.id, {
      title: editBillTitle.trim() || editingBill.title,
      amount: Number(editBillAmount),
      dueDate: editBillDue || editingBill.dueDate,
    });

    setEditingBill(null);
  };

  const handleCreateSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || subCost <= 0) return;

    await addSubscription({
      name: subName.trim(),
      cost: Number(subCost),
      billingCycle: 'monthly',
      renewalDate: subRenewal,
      category: subCategory,
      icon: 'Tv',
    });

    setSubName('');
    setIsAddingSub(false);
  };

  const handleSaveEditSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub || editSubCost <= 0) return;

    await updateSubscription(editingSub.id, {
      name: editSubName.trim() || editingSub.name,
      cost: Number(editSubCost),
      renewalDate: editSubRenewal || editingSub.renewalDate,
    });

    setEditingSub(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFBEB] text-[#D97706] font-bold text-xs uppercase tracking-wider mb-2">
            <CalendarCheck className="w-4 h-4" />
            <span>RECURRING BILLS & SUBSCRIPTIONS</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#242139] font-heading">Bills & Subscriptions</h2>
          <p className="text-sm text-[#77748B] mt-1 max-w-2xl">
            Track rent, utility bills, and subscriptions. Marking bills as paid automatically synchronizes with your Overview Total Expenses.
          </p>
        </div>

        {/* Stats Pill Group */}
        <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-left sm:text-right">
            <span className="text-[11px] font-bold text-[#77748B] uppercase block">Upcoming Bills</span>
            <div className="text-xl sm:text-2xl font-black text-[#EF4444] font-mono mt-0.5">
              {formatCurrency(upcomingBillsTotal, currency)}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-emerald-200 shadow-sm text-left sm:text-right">
            <span className="text-[11px] font-bold text-[#059669] uppercase block">Paid Bills (Expenses)</span>
            <div className="text-xl sm:text-2xl font-black text-[#059669] font-mono mt-0.5">
              {formatCurrency(paidBillsTotal, currency)}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: HOUSEHOLD BILLS */}
      <div className="glass-card rounded-3xl p-6 border border-white space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#242139] font-heading">Household Bills</h3>
            <p className="text-xs text-[#77748B]">Click the checkmark when paid to auto-add to your monthly expenses</p>
          </div>

          <button
            onClick={() => setIsAddingBill(true)}
            className="py-2 px-3.5 rounded-xl bg-[#7557E8] text-white font-bold text-xs hover:bg-[#4B35A8] transition shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Bill</span>
          </button>
        </div>

        {/* Bills List or Empty State */}
        {bills.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#242139]">No bills added yet</p>
            <p className="text-xs text-[#77748B]">
              Add your upcoming bills (Rent, Electricity, Wifi, Water) to track due dates and auto-record expenses.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition shadow-sm ${
                  bill.isPaid ? 'bg-emerald-50/70 border-emerald-200' : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleBillPaid(bill.id)}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center border transition ${
                      bill.isPaid
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : 'border-gray-300 hover:border-emerald-600'
                    }`}
                    title={bill.isPaid ? 'Mark Unpaid' : 'Mark Paid (Adds to Total Expenses)'}
                  >
                    {bill.isPaid && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <div>
                    <div
                      className={`text-sm font-bold ${
                        bill.isPaid ? 'line-through text-gray-500' : 'text-[#242139]'
                      }`}
                    >
                      {bill.title}
                    </div>
                    <div className="text-xs text-[#77748B] flex items-center gap-2">
                      <span>Due: {bill.dueDate}</span> •{' '}
                      <span className="font-semibold text-[#7557E8]">
                        {bill.isAutoPay ? 'AutoPay Enabled' : 'Manual'}
                      </span>
                      {bill.isPaid && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Paid ✓ Recorded in Expenses
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="font-mono text-base font-black text-[#242139]">
                    {formatCurrency(bill.amount, currency)}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingBill(bill);
                        setEditBillTitle(bill.title);
                        setEditBillAmount(bill.amount);
                        setEditBillDue(bill.dueDate);
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#7557E8]"
                      title="Edit Bill"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteBill(bill.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500"
                      title="Delete Bill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: RECURRING SUBSCRIPTIONS */}
      <div className="glass-card rounded-3xl p-6 border border-white space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#242139] font-heading">Active Subscriptions</h3>
            <p className="text-xs text-[#77748B]">
              Total monthly subscriptions: {formatCurrency(totalSubsCost, currency)}/mo
            </p>
          </div>

          <button
            onClick={() => setIsAddingSub(true)}
            className="py-2 px-3.5 rounded-xl bg-[#7557E8] text-white font-bold text-xs hover:bg-[#4B35A8] transition shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subscription</span>
          </button>
        </div>

        {subscriptions.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
              <Tv className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#242139]">No subscriptions added yet</p>
            <p className="text-xs text-[#77748B]">
              Track streaming, gym, cloud services, and software memberships.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-2xl bg-white border border-gray-100 flex items-center justify-between shadow-sm"
              >
                <div>
                  <div className="text-sm font-extrabold text-[#242139]">{sub.name}</div>
                  <div className="text-xs text-[#77748B]">Renews: {sub.renewalDate}</div>
                  <div className="font-mono text-sm font-black text-[#7557E8] mt-1">
                    {formatCurrency(sub.cost, currency)}/mo
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingSub(sub);
                      setEditSubName(sub.name);
                      setEditSubCost(sub.cost);
                      setEditSubRenewal(sub.renewalDate);
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#7557E8]"
                    title="Edit Subscription"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteSubscription(sub.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500"
                    title="Delete Subscription"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Bill Modal */}
      <AnimatePresence>
        {isAddingBill && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full bg-white shadow-2xl border border-white/80 relative">
              <button
                onClick={() => setIsAddingBill(false)}
                className="absolute right-4 top-4 p-2 rounded-xl text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleCreateBill} className="space-y-4">
                <h3 className="text-xl font-black text-[#242139]">Add Household Bill</h3>

                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">Bill Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apartment Rent, Electricity Bill, Wifi"
                    value={billTitle}
                    onChange={(e) => setBillTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#77748B] mb-1">
                      Amount ({currency})
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="100"
                      required
                      value={billAmount}
                      onChange={(e) => setBillAmount(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#77748B] mb-1">Category</label>
                    <select
                      value={billCategory}
                      onChange={(e) => setBillCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                    >
                      <option value="Rent">Rent</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Insurance">Insurance</option>
                      <option value="EMI">EMI / Loan</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={billDueDate}
                    onChange={(e) => setBillDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoPayCheck"
                    checked={billAutoPay}
                    onChange={(e) => setBillAutoPay(e.target.checked)}
                    className="w-4 h-4 rounded text-[#7557E8]"
                  />
                  <label htmlFor="autoPayCheck" className="text-xs font-bold text-[#242139]">
                    Auto-Pay Enabled
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-[#7557E8] text-white font-extrabold text-xs hover:bg-[#4B35A8] transition"
                  >
                    Save Bill
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingBill(false)}
                    className="py-3 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Bill Modal */}
      <AnimatePresence>
        {editingBill && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full bg-white shadow-2xl border border-white/80 relative">
              <button
                onClick={() => setEditingBill(null)}
                className="absolute right-4 top-4 p-2 rounded-xl text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleSaveEditBill} className="space-y-4">
                <h3 className="text-xl font-black text-[#242139]">Edit Bill</h3>

                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">Bill Title</label>
                  <input
                    type="text"
                    required
                    value={editBillTitle}
                    onChange={(e) => setEditBillTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">
                    Amount ({currency})
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="100"
                    required
                    value={editBillAmount}
                    onChange={(e) => setEditBillAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={editBillDue}
                    onChange={(e) => setEditBillDue(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-[#7557E8] text-white font-extrabold text-xs hover:bg-[#4B35A8] transition"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingBill(null)}
                    className="py-3 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Subscription Modal */}
      <AnimatePresence>
        {isAddingSub && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full bg-white shadow-2xl border border-white/80 relative">
              <button
                onClick={() => setIsAddingSub(false)}
                className="absolute right-4 top-4 p-2 rounded-xl text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleCreateSub} className="space-y-4">
                <h3 className="text-xl font-black text-[#242139]">Add Subscription</h3>

                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">Subscription Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Netflix, Spotify, Gym"
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">
                    Monthly Cost ({currency})
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="50"
                    required
                    value={subCost}
                    onChange={(e) => setSubCost(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">Next Renewal Date</label>
                  <input
                    type="date"
                    required
                    value={subRenewal}
                    onChange={(e) => setSubRenewal(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-[#7557E8] text-white font-extrabold text-xs hover:bg-[#4B35A8] transition"
                  >
                    Save Subscription
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingSub(false)}
                    className="py-3 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Subscription Modal */}
      <AnimatePresence>
        {editingSub && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full bg-white shadow-2xl border border-white/80 relative">
              <button
                onClick={() => setEditingSub(null)}
                className="absolute right-4 top-4 p-2 rounded-xl text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleSaveEditSub} className="space-y-4">
                <h3 className="text-xl font-black text-[#242139]">Edit Subscription</h3>

                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">Subscription Name</label>
                  <input
                    type="text"
                    required
                    value={editSubName}
                    onChange={(e) => setEditSubName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">
                    Monthly Cost ({currency})
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="50"
                    required
                    value={editSubCost}
                    onChange={(e) => setEditSubCost(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#77748B] mb-1">Next Renewal Date</label>
                  <input
                    type="date"
                    required
                    value={editSubRenewal}
                    onChange={(e) => setEditSubRenewal(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#242139]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-[#7557E8] text-white font-extrabold text-xs hover:bg-[#4B35A8] transition"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingSub(null)}
                    className="py-3 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
