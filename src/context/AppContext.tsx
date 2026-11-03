import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AllocationMethod,
  BillItem,
  BudgetCategory,
  CurrencyCode,
  DreamGoal,
  ExpenseTransaction,
  GroceryItem,
  SavingsCategory,
  SavingsTransaction,
  SubscriptionItem,
  UserProfile,
} from '../types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_CATEGORIES,
  INITIAL_EXPENSES,
  INITIAL_GROCERY_ITEMS,
  INITIAL_SAVINGS_CATEGORIES,
  INITIAL_SAVINGS_TX,
  INITIAL_GOALS,
  INITIAL_BILLS,
  INITIAL_SUBSCRIPTIONS,
  loadFromStorage,
  saveToStorage,
  clearUserStorage,
} from '../services/storageService';
import { recalculateAllocations } from '../utils/financials';
import { api, setSessionToken, clearSessionToken } from '../services/apiService';

export type AppTab =
  | 'dashboard'
  | 'salary-split'
  | 'smart-pantry'
  | 'my-savings'
  | 'dream-goals'
  | 'bills';

export interface AppContextType {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isLoggedIn: boolean;
  login: (name: string, phone: string) => Promise<{ isNewUser: boolean }>;
  logout: () => Promise<void>;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  monthlyIncome: number;
  setMonthlyIncome: (income: number) => Promise<void>;
  allocationMethod: AllocationMethod;
  setAllocationMethod: (m: AllocationMethod) => void;

  // Categories (Salary Split)
  categories: BudgetCategory[];
  addCategory: (category: Omit<BudgetCategory, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<BudgetCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  distributeRemainingPercentage: () => void;

  // Expenses
  expenses: ExpenseTransaction[];
  addExpense: (expense: Omit<ExpenseTransaction, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  // Smart Pantry (Shopping Items)
  groceryItems: GroceryItem[];
  addGroceryItem: (item: Omit<GroceryItem, 'id' | 'isPurchased'>) => Promise<void>;
  updateGroceryItem: (id: string, updates: Partial<GroceryItem>) => Promise<void>;
  markGroceryPurchased: (id: string, actualPrice?: number) => Promise<void>;
  deleteGroceryItem: (id: string) => Promise<void>;

  // My Savings (Individual Categories & Transactions)
  savingsCategories: SavingsCategory[];
  savingsTx: SavingsTransaction[];
  addSavingsCategory: (data: { name: string; icon?: string; color?: string; monthlyTarget?: number; targetAmount?: number }) => Promise<void>;
  updateSavingsCategory: (id: string, updates: Partial<SavingsCategory>) => Promise<void>;
  deleteSavingsCategory: (id: string) => Promise<void>;
  addSavingsContribution: (data: { savingsCategoryId: string; goalId?: string; amount: number; month: string; date?: string; note?: string }) => Promise<void>;
  deleteSavingsTransaction: (id: string) => Promise<void>;

  // Dream Goals
  goals: DreamGoal[];
  addGoal: (goal: Omit<DreamGoal, 'id' | 'currentBalance'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<DreamGoal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  // Bills & Subscriptions
  bills: BillItem[];
  addBill: (bill: Omit<BillItem, 'id' | 'isPaid'>) => Promise<void>;
  updateBill: (id: string, updates: Partial<BillItem>) => Promise<void>;
  toggleBillPaid: (id: string) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;
  subscriptions: SubscriptionItem[];
  addSubscription: (sub: Omit<SubscriptionItem, 'id'>) => Promise<void>;
  updateSubscription: (id: string, updates: Partial<SubscriptionItem>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;

  // Dynamic Overall Metrics
  totalExpenses: number;
  totalSavings: number;
  totalSavedInGoals: number;
  totalGoalTarget: number;
  goalsAchievementPercentage: number;

  // Celebrations
  activeCelebration: { isOpen: boolean; title: string; subtitle?: string; amount?: number } | null;
  triggerCelebration: (title: string, subtitle?: string, amount?: number) => void;
  closeCelebration: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() =>
    loadFromStorage<UserProfile>('userProfile', INITIAL_USER_PROFILE)
  );

  const [allocationMethod, setAllocationMethodState] = useState<AllocationMethod>('percentage');

  // Financial Modules State
  const [categories, setCategories] = useState<BudgetCategory[]>(() =>
    loadFromStorage('categories', INITIAL_CATEGORIES)
  );
  const [expenses, setExpenses] = useState<ExpenseTransaction[]>(() =>
    loadFromStorage('expenses', INITIAL_EXPENSES)
  );
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>(() =>
    loadFromStorage('groceryItems', INITIAL_GROCERY_ITEMS)
  );
  const [savingsCategories, setSavingsCategories] = useState<SavingsCategory[]>(() =>
    loadFromStorage('savingsCategories', INITIAL_SAVINGS_CATEGORIES)
  );
  const [savingsTx, setSavingsTx] = useState<SavingsTransaction[]>(() =>
    loadFromStorage('savingsTx', INITIAL_SAVINGS_TX)
  );
  const [goals, setGoals] = useState<DreamGoal[]>(() =>
    loadFromStorage('goals', INITIAL_GOALS)
  );
  const [bills, setBills] = useState<BillItem[]>(() =>
    loadFromStorage('bills', INITIAL_BILLS)
  );
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(() =>
    loadFromStorage('subscriptions', INITIAL_SUBSCRIPTIONS)
  );

  // Celebration state
  const [activeCelebration, setActiveCelebration] = useState<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    amount?: number;
  } | null>(null);

  // Sync to local storage as client cache
  useEffect(() => saveToStorage('userProfile', userProfile), [userProfile]);
  useEffect(() => saveToStorage('categories', categories), [categories]);
  useEffect(() => saveToStorage('expenses', expenses), [expenses]);
  useEffect(() => saveToStorage('groceryItems', groceryItems), [groceryItems]);
  useEffect(() => saveToStorage('savingsCategories', savingsCategories), [savingsCategories]);
  useEffect(() => saveToStorage('savingsTx', savingsTx), [savingsTx]);
  useEffect(() => saveToStorage('goals', goals), [goals]);
  useEffect(() => saveToStorage('bills', bills), [bills]);
  useEffect(() => saveToStorage('subscriptions', subscriptions), [subscriptions]);

  // Transform backend DB records to frontend models
  const hydrateUserData = (data: any, profile: UserProfile) => {
    if (!data) return;
    setUserProfile(profile);

    if (data.categories) {
      setCategories(
        data.categories.map((c: any) => ({
          id: c.id,
          name: c.name,
          icon: c.icon || 'Tag',
          color: c.color || '#7557E8',
          type: c.type || 'needs',
          allocatedAmount: Number(c.allocated_amount || 0),
          allocatedPercentage: Number(c.allocated_percentage || 0),
          order: c.display_order || 1,
        }))
      );
    }

    if (data.expenses) {
      setExpenses(
        data.expenses.map((e: any) => ({
          id: e.id,
          categoryId: e.category_id,
          categoryName: e.category_name,
          amount: Number(e.amount || 0),
          date: e.date,
          description: e.description,
          paymentMethod: e.payment_method || 'UPI',
          billId: e.bill_id || undefined,
        }))
      );
    }

    if (data.savingsCategories) {
      setSavingsCategories(
        data.savingsCategories.map((sc: any) => ({
          id: sc.id,
          name: sc.name,
          icon: sc.icon || 'PiggyBank',
          color: sc.color || '#10B981',
          monthlyTarget: Number(sc.monthly_target || 0),
          targetAmount: Number(sc.target_amount || 0),
        }))
      );
    }

    if (data.savingsTransactions) {
      setSavingsTx(
        data.savingsTransactions.map((st: any) => ({
          id: st.id,
          savingsCategoryId: st.savings_category_id,
          goalId: st.goal_id || undefined,
          amount: Number(st.amount || 0),
          month: st.month,
          date: st.date,
          note: st.note || 'Monthly contribution',
        }))
      );
    }

    if (data.goals) {
      setGoals(
        data.goals.map((g: any) => ({
          id: g.id,
          name: g.name,
          category: g.category || 'house',
          targetAmount: Number(g.target_amount || 0),
          currentBalance: Number(g.current_balance || 0),
          monthlyTarget: Number(g.monthly_target || 0),
          targetDate: g.target_date || undefined,
          description: g.description || '',
          status: g.status || 'active',
          createdAt: g.created_at,
        }))
      );
    }

    if (data.shoppingItems) {
      setGroceryItems(
        data.shoppingItems.map((si: any) => ({
          id: si.id,
          name: si.name,
          category: si.category || 'Produce',
          quantity: Number(si.quantity || 1),
          unit: si.unit || 'Kg',
          estimatedPrice: Number(si.estimated_price || 0),
          actualPrice: si.actual_price ? Number(si.actual_price) : undefined,
          isPurchased: Boolean(si.is_purchased),
          purchasedDate: si.purchased_date || undefined,
        }))
      );
    }

    if (data.bills) {
      setBills(
        data.bills.map((b: any) => ({
          id: b.id,
          title: b.title,
          amount: Number(b.amount || 0),
          dueDate: b.due_date,
          category: b.category || 'Rent',
          isAutoPay: Boolean(b.is_auto_pay),
          isPaid: Boolean(b.is_paid),
          paidDate: b.paid_date || undefined,
        }))
      );
    }

    if (data.subscriptions) {
      setSubscriptions(
        data.subscriptions.map((s: any) => ({
          id: s.id,
          name: s.name,
          cost: Number(s.cost || 0),
          billingCycle: s.billing_cycle || 'monthly',
          renewalDate: s.renewal_date,
          category: s.category || 'Entertainment',
          icon: s.icon || 'Tv',
        }))
      );
    }
  };

  // Check existing session token on application load
  useEffect(() => {
    async function checkAuthSession() {
      try {
        const res = await api.getMe();
        if (res.success && res.user) {
          const profile: UserProfile = {
            id: res.user.id,
            name: res.user.name,
            phone: res.user.phone,
            currency: (res.user.currency as CurrencyCode) || 'INR',
            monthlyIncome: Number(res.user.monthly_income || 0),
            isLoggedIn: true,
          };
          hydrateUserData(res.data, profile);
        }
      } catch (err) {
        // Session invalid or server offline -> keep logged out
        clearSessionToken();
        setUserProfile(INITIAL_USER_PROFILE);
      }
    }

    checkAuthSession();
  }, []);

  // Login handler: Authenticate via Name + Phone
  const login = async (name: string, phone: string): Promise<{ isNewUser: boolean }> => {
    const res = await api.login(name, phone);
    if (res.success && res.user) {
      const profile: UserProfile = {
        id: res.user.id,
        name: res.user.name,
        phone: res.user.phone,
        currency: (res.user.currency as CurrencyCode) || 'INR',
        monthlyIncome: Number(res.user.monthly_income || 0),
        isLoggedIn: true,
      };

      if (res.isNewUser) {
        // Clear all arrays for brand new user
        setCategories([]);
        setExpenses([]);
        setGroceryItems([]);
        setSavingsCategories([]);
        setSavingsTx([]);
        setGoals([]);
        setBills([]);
        setSubscriptions([]);
        setUserProfile(profile);
      } else {
        hydrateUserData(res.data, profile);
      }

      setActiveTab('dashboard');
      return { isNewUser: Boolean(res.isNewUser) };
    }
    throw new Error('Authentication failed');
  };

  // Logout handler: Destroy session and clear state
  const logout = async () => {
    try {
      await api.logout();
    } catch {
      clearSessionToken();
    }
    clearUserStorage();
    setUserProfile(INITIAL_USER_PROFILE);
    setCategories([]);
    setExpenses([]);
    setGroceryItems([]);
    setSavingsCategories([]);
    setSavingsTx([]);
    setGoals([]);
    setBills([]);
    setSubscriptions([]);
    setActiveTab('dashboard');
  };

  const currency = userProfile.currency;
  const setCurrency = (c: CurrencyCode) => {
    setUserProfile((prev) => ({ ...prev, currency: c }));
  };

  const monthlyIncome = userProfile.monthlyIncome;
  const setMonthlyIncome = async (inc: number) => {
    const cleanIncome = Math.max(0, inc);
    setUserProfile((prev) => ({ ...prev, monthlyIncome: cleanIncome }));
    const reallocated = recalculateAllocations(categories, cleanIncome, allocationMethod);
    setCategories(reallocated);

    try {
      await api.updateIncome(cleanIncome, currency);
    } catch (e) {
      console.error('Failed to sync income to DB', e);
    }
  };

  const setAllocationMethod = (m: AllocationMethod) => {
    setAllocationMethodState(m);
    const reallocated = recalculateAllocations(categories, monthlyIncome, m);
    setCategories(reallocated);
  };

  // Category Handlers (Salary Split)
  const addCategory = async (newCatData: Omit<BudgetCategory, 'id'>) => {
    const newCat: BudgetCategory = {
      ...newCatData,
      id: `cat_${Date.now()}`,
    };
    const updated = [...categories, newCat];
    const reallocated = recalculateAllocations(updated, monthlyIncome, allocationMethod);
    setCategories(reallocated);

    try {
      await api.saveCategory({
        id: newCat.id,
        name: newCat.name,
        icon: newCat.icon,
        color: newCat.color,
        type: newCat.type,
        allocated_amount: newCat.allocatedAmount,
        allocated_percentage: newCat.allocatedPercentage,
        display_order: newCat.order,
      });
    } catch (e) {
      console.error('Failed to save category to DB', e);
    }
  };

  const updateCategory = async (id: string, updates: Partial<BudgetCategory>) => {
    const updated = categories.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat));
    const reallocated = recalculateAllocations(updated, monthlyIncome, allocationMethod);
    setCategories(reallocated);

    const target = updated.find((c) => c.id === id);
    if (target) {
      try {
        await api.saveCategory({
          id: target.id,
          name: target.name,
          icon: target.icon,
          color: target.color,
          type: target.type,
          allocated_amount: target.allocatedAmount,
          allocated_percentage: target.allocatedPercentage,
          display_order: target.order,
        });
      } catch (e) {
        console.error('Failed to update category in DB', e);
      }
    }
  };

  const deleteCategory = async (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    const reallocated = recalculateAllocations(updated, monthlyIncome, allocationMethod);
    setCategories(reallocated);

    try {
      await api.deleteCategory(id);
    } catch (e) {
      console.error('Failed to delete category in DB', e);
    }
  };

  const distributeRemainingPercentage = () => {
    const currentTotal = categories.reduce((sum, c) => sum + c.allocatedPercentage, 0);
    const remaining = 100 - currentTotal;
    if (remaining <= 0 || categories.length === 0) return;
    const share = Math.round((remaining / categories.length) * 10) / 10;
    const updated = categories.map((c) => ({
      ...c,
      allocatedPercentage: Math.max(0, Math.round((c.allocatedPercentage + share) * 10) / 10),
    }));
    const reallocated = recalculateAllocations(updated, monthlyIncome, 'percentage');
    setCategories(reallocated);
  };

  // Expense Handlers
  const addExpense = async (expData: Omit<ExpenseTransaction, 'id'>) => {
    const newExp: ExpenseTransaction = {
      ...expData,
      id: `exp_${Date.now()}`,
    };
    setExpenses((prev) => [newExp, ...prev]);

    try {
      await api.addExpense({
        id: newExp.id,
        category_id: newExp.categoryId,
        category_name: newExp.categoryName,
        amount: newExp.amount,
        date: newExp.date,
        description: newExp.description,
        payment_method: newExp.paymentMethod,
        bill_id: newExp.billId,
      });
    } catch (e) {
      console.error('Failed to save expense in DB', e);
    }
  };

  const deleteExpense = async (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    try {
      await api.deleteExpense(id);
    } catch (e) {
      console.error('Failed to delete expense in DB', e);
    }
  };

  // SmartPantry Handlers
  const addGroceryItem = async (itemData: Omit<GroceryItem, 'id' | 'isPurchased'>) => {
    const newItem: GroceryItem = {
      ...itemData,
      id: `g_${Date.now()}`,
      isPurchased: false,
    };
    setGroceryItems((prev) => [...prev, newItem]);

    try {
      await api.addShoppingItem({
        id: newItem.id,
        name: newItem.name,
        category: newItem.category,
        quantity: newItem.quantity,
        unit: newItem.unit,
        estimated_price: newItem.estimatedPrice,
      });
    } catch (e) {
      console.error('Failed to save grocery item in DB', e);
    }
  };

  const updateGroceryItem = async (id: string, updates: Partial<GroceryItem>) => {
    setGroceryItems((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));

    try {
      await api.updateShoppingItem(id, {
        name: updates.name,
        category: updates.category,
        quantity: updates.quantity,
        unit: updates.unit,
        estimated_price: updates.estimatedPrice,
        actual_price: updates.actualPrice,
        is_purchased: updates.isPurchased,
      });
    } catch (e) {
      console.error('Failed to update shopping item in DB', e);
    }
  };

  const markGroceryPurchased = async (id: string, actualPrice?: number) => {
    const target = groceryItems.find((g) => g.id === id);
    if (!target) return;
    const finalPrice = actualPrice !== undefined ? actualPrice : target.estimatedPrice;

    setGroceryItems((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              isPurchased: !g.isPurchased,
              actualPrice: finalPrice,
              purchasedDate: new Date().toISOString().split('T')[0],
            }
          : g
      )
    );

    // Auto-record expense when marked purchased
    if (!target.isPurchased) {
      addExpense({
        categoryId: 'groceries',
        categoryName: 'Groceries & Kitchen',
        amount: finalPrice,
        date: new Date().toISOString().split('T')[0],
        description: `Grocery Purchase: ${target.name} (${target.quantity} ${target.unit})`,
        paymentMethod: 'UPI',
      });
    }

    try {
      await api.updateShoppingItem(id, {
        is_purchased: !target.isPurchased,
        actual_price: finalPrice,
        purchased_date: new Date().toISOString().split('T')[0],
      });
    } catch (e) {
      console.error('Failed to mark item purchased in DB', e);
    }
  };

  const deleteGroceryItem = async (id: string) => {
    setGroceryItems((prev) => prev.filter((g) => g.id !== id));
    try {
      await api.deleteShoppingItem(id);
    } catch (e) {
      console.error('Failed to delete shopping item in DB', e);
    }
  };

  // My Savings Handlers
  const addSavingsCategory = async (data: {
    name: string;
    icon?: string;
    color?: string;
    monthlyTarget?: number;
    targetAmount?: number;
  }) => {
    const newCat: SavingsCategory = {
      id: `sc_${Date.now()}`,
      name: data.name,
      icon: data.icon || 'PiggyBank',
      color: data.color || '#10B981',
      monthlyTarget: data.monthlyTarget || 0,
      targetAmount: data.targetAmount || 0,
    };
    setSavingsCategories((prev) => [...prev, newCat]);

    try {
      await api.createSavingsCategory({
        name: newCat.name,
        icon: newCat.icon,
        color: newCat.color,
        monthly_target: newCat.monthlyTarget,
        target_amount: newCat.targetAmount,
      });
    } catch (e) {
      console.error('Failed to create savings category in DB', e);
    }
  };

  const updateSavingsCategory = async (id: string, updates: Partial<SavingsCategory>) => {
    setSavingsCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );

    try {
      await api.updateSavingsCategory(id, {
        name: updates.name,
        icon: updates.icon,
        color: updates.color,
        monthly_target: updates.monthlyTarget,
        target_amount: updates.targetAmount,
      });
    } catch (e) {
      console.error('Failed to update savings category in DB', e);
    }
  };

  const deleteSavingsCategory = async (id: string) => {
    setSavingsCategories((prev) => prev.filter((c) => c.id !== id));
    setSavingsTx((prev) => prev.filter((t) => t.savingsCategoryId !== id));

    try {
      await api.deleteSavingsCategory(id);
    } catch (e) {
      console.error('Failed to delete savings category in DB', e);
    }
  };

  // Add Savings Contribution: Increases cumulative savings of that category, and updates Dream Goal if assigned
  const addSavingsContribution = async (data: {
    savingsCategoryId: string;
    goalId?: string;
    amount: number;
    month: string;
    date?: string;
    note?: string;
  }) => {
    const newTx: SavingsTransaction = {
      id: `stx_${Date.now()}`,
      savingsCategoryId: data.savingsCategoryId,
      goalId: data.goalId,
      amount: data.amount,
      month: data.month,
      date: data.date || new Date().toISOString().split('T')[0],
      note: data.note || 'Monthly contribution',
    };

    setSavingsTx((prev) => [newTx, ...prev]);

    // If assigned to a dream goal, increase goal's current balance
    if (data.goalId) {
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id !== data.goalId) return g;
          const newBal = g.currentBalance + data.amount;
          return {
            ...g,
            currentBalance: newBal,
            status: newBal >= g.targetAmount ? 'completed' : g.status,
          };
        })
      );
    }

    try {
      await api.addSavingsTransaction({
        savings_category_id: data.savingsCategoryId,
        goal_id: data.goalId,
        amount: data.amount,
        month: data.month,
        date: data.date,
        note: data.note,
      });
    } catch (e) {
      console.error('Failed to save savings transaction in DB', e);
    }
  };

  const deleteSavingsTransaction = async (id: string) => {
    const target = savingsTx.find((t) => t.id === id);
    if (!target) return;

    setSavingsTx((prev) => prev.filter((t) => t.id !== id));

    // If it was assigned to a goal, reverse the goal's balance
    if (target.goalId) {
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id !== target.goalId) return g;
          return {
            ...g,
            currentBalance: Math.max(0, g.currentBalance - target.amount),
          };
        })
      );
    }

    try {
      await api.deleteSavingsTransaction(id);
    } catch (e) {
      console.error('Failed to delete savings transaction in DB', e);
    }
  };

  // Dream Goals Handlers
  const addGoal = async (goalData: Omit<DreamGoal, 'id' | 'currentBalance'>) => {
    const newGoal: DreamGoal = {
      ...goalData,
      id: `goal_${Date.now()}`,
      currentBalance: 0,
      status: 'active',
    };
    setGoals((prev) => [...prev, newGoal]);

    try {
      await api.createGoal({
        id: newGoal.id,
        name: newGoal.name,
        category: newGoal.category,
        target_amount: newGoal.targetAmount,
        monthly_target: newGoal.monthlyTarget,
        target_date: newGoal.targetDate,
        description: newGoal.description,
      });
    } catch (e) {
      console.error('Failed to save dream goal in DB', e);
    }
  };

  const updateGoal = async (id: string, updates: Partial<DreamGoal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));

    try {
      await api.updateGoal(id, {
        name: updates.name,
        category: updates.category,
        target_amount: updates.targetAmount,
        current_balance: updates.currentBalance,
        monthly_target: updates.monthlyTarget,
        target_date: updates.targetDate,
        description: updates.description,
        status: updates.status,
      });
    } catch (e) {
      console.error('Failed to update dream goal in DB', e);
    }
  };

  const deleteGoal = async (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    // Unlink any savings transactions pointing to this goal
    setSavingsTx((prev) =>
      prev.map((t) => (t.goalId === id ? { ...t, goalId: undefined } : t))
    );

    try {
      await api.deleteGoal(id);
    } catch (e) {
      console.error('Failed to delete dream goal in DB', e);
    }
  };

  // Bills & Subscriptions Handlers
  const addBill = async (billData: Omit<BillItem, 'id' | 'isPaid'>) => {
    const newBill: BillItem = {
      ...billData,
      id: `bill_${Date.now()}`,
      isPaid: false,
    };
    setBills((prev) => [...prev, newBill]);

    try {
      await api.addBill({
        id: newBill.id,
        title: newBill.title,
        amount: newBill.amount,
        due_date: newBill.dueDate,
        category: newBill.category,
        is_auto_pay: newBill.isAutoPay,
      });
    } catch (e) {
      console.error('Failed to save bill in DB', e);
    }
  };

  const updateBill = async (id: string, updates: Partial<BillItem>) => {
    setBills((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));

    try {
      await api.updateBill(id, {
        title: updates.title,
        amount: updates.amount,
        due_date: updates.dueDate,
        category: updates.category,
        is_auto_pay: updates.isAutoPay,
        is_paid: updates.isPaid,
        paid_date: updates.paidDate,
      });
    } catch (e) {
      console.error('Failed to update bill in DB', e);
    }
  };

  const toggleBillPaid = async (id: string) => {
    const target = bills.find((b) => b.id === id);
    if (!target) return;
    const nextPaidState = !target.isPaid;
    const today = new Date().toISOString().split('T')[0];

    setBills((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, isPaid: nextPaidState, paidDate: nextPaidState ? today : undefined } : b
      )
    );

    // If marked paid, also auto-record in expenses
    if (nextPaidState) {
      addExpense({
        categoryId: 'bills',
        categoryName: target.category || 'Utilities & Bills',
        amount: target.amount,
        date: today,
        description: `Bill Payment: ${target.title}`,
        paymentMethod: 'Bank Transfer',
        billId: target.id,
      });
    }

    try {
      await api.updateBill(id, {
        is_paid: nextPaidState,
        paid_date: nextPaidState ? today : undefined,
      });
    } catch (e) {
      console.error('Failed to toggle bill paid state in DB', e);
    }
  };

  const deleteBill = async (id: string) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
    try {
      await api.deleteBill(id);
    } catch (e) {
      console.error('Failed to delete bill in DB', e);
    }
  };

  const addSubscription = async (subData: Omit<SubscriptionItem, 'id'>) => {
    const newSub: SubscriptionItem = {
      ...subData,
      id: `sub_${Date.now()}`,
    };
    setSubscriptions((prev) => [...prev, newSub]);

    try {
      await api.addSubscription({
        id: newSub.id,
        name: newSub.name,
        cost: newSub.cost,
        billing_cycle: newSub.billingCycle,
        renewal_date: newSub.renewalDate,
        category: newSub.category,
        icon: newSub.icon,
      });
    } catch (e) {
      console.error('Failed to save subscription in DB', e);
    }
  };

  const updateSubscription = async (id: string, updates: Partial<SubscriptionItem>) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );

    try {
      await api.updateSubscription(id, {
        name: updates.name,
        cost: updates.cost,
        billing_cycle: updates.billingCycle,
        renewal_date: updates.renewalDate,
        category: updates.category,
        icon: updates.icon,
      });
    } catch (e) {
      console.error('Failed to update subscription in DB', e);
    }
  };

  const deleteSubscription = async (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    try {
      await api.deleteSubscription(id);
    } catch (e) {
      console.error('Failed to delete subscription in DB', e);
    }
  };

  // Dynamic Overall Financial Metric Calculations
  // 1. Total Expenses: Sum of recorded expenses + paid bills
  const totalRecordedExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const paidBillsTotal = bills.filter((b) => b.isPaid).reduce((sum, b) => sum + (b.amount || 0), 0);
  // Avoid double counting if a paid bill already created an expense record with billId
  const unlinkedPaidBills = bills
    .filter((b) => b.isPaid && !expenses.some((e) => e.billId === b.id))
    .reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalExpenses = totalRecordedExpenses + unlinkedPaidBills;

  // 2. Total Savings: Sum of all actual contributions recorded across individual savings categories
  const totalSavings = savingsTx.reduce((sum, tx) => sum + (tx.amount || 0), 0);

  // 3. Dream Goals Progress: Total saved towards goals & achievement percentage
  const totalGoalTarget = goals.reduce((sum, g) => sum + (g.targetAmount || 0), 0);
  const totalSavedInGoals = goals.reduce((sum, g) => sum + (g.currentBalance || 0), 0);
  const goalsAchievementPercentage =
    totalGoalTarget > 0 ? Math.min(100, Math.round((totalSavedInGoals / totalGoalTarget) * 100)) : 0;

  // Celebration helpers
  const triggerCelebration = (title: string, subtitle?: string, amount?: number) => {
    setActiveCelebration({ isOpen: true, title, subtitle, amount });
  };

  const closeCelebration = () => {
    setActiveCelebration(null);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userProfile,
        setUserProfile,
        isLoggedIn: Boolean(userProfile.isLoggedIn),
        login,
        logout,
        currency,
        setCurrency,
        monthlyIncome,
        setMonthlyIncome,
        allocationMethod,
        setAllocationMethod,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        distributeRemainingPercentage,
        expenses,
        addExpense,
        deleteExpense,
        groceryItems,
        addGroceryItem,
        updateGroceryItem,
        markGroceryPurchased,
        deleteGroceryItem,
        savingsCategories,
        savingsTx,
        addSavingsCategory,
        updateSavingsCategory,
        deleteSavingsCategory,
        addSavingsContribution,
        deleteSavingsTransaction,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        bills,
        addBill,
        updateBill,
        toggleBillPaid,
        deleteBill,
        subscriptions,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        totalExpenses,
        totalSavings,
        totalSavedInGoals,
        totalGoalTarget,
        goalsAchievementPercentage,
        activeCelebration,
        triggerCelebration,
        closeCelebration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
