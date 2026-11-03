import { AllocationMethod, BudgetCategory, CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
};

/**
 * Format currency amount cleanly with locale awareness
 */
export function formatCurrency(amount: number, currencyCode: CurrencyCode = 'INR'): string {
  const config = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const safeAmount = isNaN(amount) ? 0 : Math.round(amount * 100) / 100;
  
  if (currencyCode === 'INR') {
    // Format Indian Numbering System e.g., 1,00,000
    const parts = safeAmount.toFixed(0).toString().split('.');
    let lastThree = parts[0].slice(-3);
    const otherNumbers = parts[0].slice(0, -3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    return `${config.symbol}${formattedInteger}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: config.code,
    maximumFractionDigits: 0,
  }).format(safeAmount);
}

/**
 * Safely calculate allocation amounts based on method
 */
export function recalculateAllocations(
  categories: BudgetCategory[],
  income: number,
  method: AllocationMethod
): BudgetCategory[] {
  if (income <= 0) {
    return categories.map((c) => ({ ...c, allocatedAmount: 0 }));
  }

  if (method === 'percentage') {
    return categories.map((cat) => {
      const amount = Math.round((income * cat.allocatedPercentage) / 100);
      return {
        ...cat,
        allocatedAmount: amount,
      };
    });
  } else if (method === 'fixed') {
    return categories.map((cat) => {
      const percentage = Math.round((cat.allocatedAmount / income) * 1000) / 10;
      return {
        ...cat,
        allocatedPercentage: percentage,
      };
    });
  } else {
    // Hybrid method: fixed items keep fixed amount, remainder split by percentage among non-fixed
    const fixedTotal = categories
      .filter((c) => c.isHybridFixed)
      .reduce((sum, c) => sum + c.allocatedAmount, 0);

    const remainingIncome = Math.max(0, income - fixedTotal);

    return categories.map((cat) => {
      if (cat.isHybridFixed) {
        const percentage = Math.round((cat.allocatedAmount / income) * 1000) / 10;
        return { ...cat, allocatedPercentage: percentage };
      } else {
        const amount = Math.round((remainingIncome * cat.allocatedPercentage) / 100);
        return { ...cat, allocatedAmount: amount };
      }
    });
  }
}

/**
 * Calculate total allocated amount across active categories
 */
export function getTotalAllocated(categories: BudgetCategory[]): number {
  return categories.reduce((sum, cat) => sum + (cat.allocatedAmount || 0), 0);
}

/**
 * Calculate unallocated income remaining
 */
export function getUnallocatedIncome(income: number, categories: BudgetCategory[]): number {
  const total = getTotalAllocated(categories);
  return Math.max(0, income - total);
}

/**
 * Calculate budget adherence percentage (Spent / Planned * 100)
 */
export function calculateBudgetAdherence(planned: number, actual: number): number {
  if (planned <= 0) return actual > 0 ? 100 : 0;
  return Math.min(200, Math.round((actual / planned) * 100));
}

/**
 * Calculate budget variance (Planned - Actual)
 */
export function calculateBudgetVariance(planned: number, actual: number): number {
  return planned - actual;
}

/**
 * Calculate savings completion percentage
 */
export function calculateSavingsCompletion(planned: number, actual: number): number {
  if (planned <= 0) return actual > 0 ? 100 : 0;
  return Math.round((actual / planned) * 100);
}

/**
 * Calculate goal percentage completed
 */
export function calculateGoalProgress(current: number, target: number): number {
  if (target <= 0) return 100;
  return Math.min(100, Math.round((current / target) * 100));
}

/**
 * Calculate estimated months to reach financial goal
 */
export function calculateEstimatedMonthsToGoal(
  current: number,
  target: number,
  monthlyContribution: number
): number | null {
  const remaining = target - current;
  if (remaining <= 0) return 0;
  if (monthlyContribution <= 0) return null; // Infinite / unknown
  return Math.ceil(remaining / monthlyContribution);
}


