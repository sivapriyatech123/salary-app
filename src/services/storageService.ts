import {
  BillItem,
  BudgetCategory,
  DreamGoal,
  ExpenseTransaction,
  GroceryItem,
  SavingsCategory,
  SavingsTransaction,
  SubscriptionItem,
  UserProfile,
} from '../types';

const STORAGE_KEY_PREFIX = 'salarysplit_';

// Initial Fresh Profile (All zero / empty)
export const INITIAL_USER_PROFILE: UserProfile = {
  id: '',
  name: '',
  phone: '',
  currency: 'INR',
  monthlyIncome: 0,
  isLoggedIn: false,
};

// All initial modules start completely empty (No demo/sample data)
export const INITIAL_CATEGORIES: BudgetCategory[] = [];
export const INITIAL_EXPENSES: ExpenseTransaction[] = [];
export const INITIAL_GROCERY_ITEMS: GroceryItem[] = [];
export const INITIAL_SAVINGS_CATEGORIES: SavingsCategory[] = [];
export const INITIAL_SAVINGS_TX: SavingsTransaction[] = [];
export const INITIAL_GOALS: DreamGoal[] = [];
export const INITIAL_BILLS: BillItem[] = [];
export const INITIAL_SUBSCRIPTIONS: SubscriptionItem[] = [];

// Storage helper functions (Used as client-side cache and persistence fallback)
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!data) return defaultValue;
    return JSON.parse(data) as T;
  } catch {
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to local storage', key, err);
  }
}

export function clearUserStorage(): void {
  const keysToRemove = [
    'session_token',
    'userProfile',
    'categories',
    'expenses',
    'groceryItems',
    'savingsCategories',
    'savingsTx',
    'goals',
    'bills',
    'subscriptions',
  ];
  keysToRemove.forEach((key) => localStorage.removeItem(STORAGE_KEY_PREFIX + key));
}
