export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export type AllocationMethod = 'percentage' | 'fixed' | 'hybrid';

export type CategoryType = 'needs' | 'wants' | 'savings' | 'debt';

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  color: string;
  type: CategoryType;
  allocatedAmount: number; // In currency units
  allocatedPercentage: number;
  isHybridFixed?: boolean;
  order: number;
}

export type PaymentMethod = 'UPI' | 'Credit Card' | 'Debit Card' | 'Cash' | 'Bank Transfer';

export interface ExpenseTransaction {
  id: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  date: string; // ISO date string YYYY-MM-DD
  description: string;
  paymentMethod: PaymentMethod;
  billId?: string;
}

export interface SavingsCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  monthlyTarget?: number;
  targetAmount?: number;
}

export interface SavingsTransaction {
  id: string;
  savingsCategoryId: string;
  savingsCategoryName?: string;
  goalId?: string;
  goalName?: string;
  amount: number;
  month: string; // e.g. "January" or "2026-01"
  date: string; // ISO date string YYYY-MM-DD
  note: string;
}

export type GoalCategoryType = 'house' | 'car' | 'vacation' | 'emergency' | 'tech' | 'education' | 'general';

export interface DreamGoal {
  id: string;
  name: string;
  description?: string;
  category: GoalCategoryType;
  targetAmount: number;
  currentBalance: number;
  startingAmount?: number;
  monthlyTarget?: number;
  targetDate?: string;
  status: 'active' | 'completed' | 'paused';
  createdAt?: string;
}

// SmartPantry types
export type GroceryCategory = 'Produce' | 'Dairy' | 'Meat & Fish' | 'Pantry' | 'Bakery' | 'Beverages' | 'Household';

export interface GroceryItem {
  id: string;
  name: string;
  category: GroceryCategory;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  actualPrice?: number;
  isPurchased: boolean;
  purchasedDate?: string;
}

export interface BillItem {
  id: string;
  title: string;
  amount: number;
  dueDate: string; // Day of month or specific date
  category: string;
  isAutoPay: boolean;
  isPaid: boolean;
  paidDate?: string;
}

export interface SubscriptionItem {
  id: string;
  name: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly';
  renewalDate: string;
  category: string;
  icon: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  currency: CurrencyCode;
  monthlyIncome: number;
  paydayDate?: number;
  isLoggedIn: boolean;
}
