const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('salarysplit_session_token');
}

export function setSessionToken(token: string): void {
  localStorage.setItem('salarysplit_session_token', token);
}

export function clearSessionToken(): void {
  localStorage.removeItem('salarysplit_session_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }
  return data;
}

export const api = {
  // Auth
  async login(name: string, phone: string) {
    const res = await request<{ success: boolean; token: string; user: any; isNewUser: boolean; data: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ name, phone }),
    });
    if (res.token) {
      setSessionToken(res.token);
    }
    return res;
  },

  async getMe() {
    return request<{ success: boolean; user: any; data: any }>('/auth/me');
  },

  async logout() {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      clearSessionToken();
    }
  },

  async getFullData() {
    return request<{ success: boolean; data: any }>('/data');
  },

  // Income
  async updateIncome(monthlyIncome: number, currency = 'INR') {
    return request<{ success: boolean; monthlyIncome: number }>('/income', {
      method: 'POST',
      body: JSON.stringify({ monthlyIncome, currency }),
    });
  },

  // Categories (Salary Split)
  async saveCategory(category: any) {
    return request<{ success: boolean; category: any }>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  async deleteCategory(id: string) {
    return request<{ success: boolean }>(`/categories/${id}`, { method: 'DELETE' });
  },

  // Expenses
  async addExpense(expense: any) {
    return request<{ success: boolean; expense: any }>('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  },

  async deleteExpense(id: string) {
    return request<{ success: boolean }>(`/expenses/${id}`, { method: 'DELETE' });
  },

  // Savings Categories (My Savings)
  async createSavingsCategory(category: { name: string; icon?: string; color?: string; monthly_target?: number; target_amount?: number }) {
    return request<{ success: boolean; category: any }>('/savings/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  async updateSavingsCategory(id: string, updates: any) {
    return request<{ success: boolean; category: any }>(`/savings/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteSavingsCategory(id: string) {
    return request<{ success: boolean }>(`/savings/categories/${id}`, { method: 'DELETE' });
  },

  // Savings Transactions (Monthly contributions)
  async addSavingsTransaction(tx: { savings_category_id: string; goal_id?: string; amount: number; month: string; date?: string; note?: string }) {
    return request<{ success: boolean; transaction: any }>('/savings/transactions', {
      method: 'POST',
      body: JSON.stringify(tx),
    });
  },

  async deleteSavingsTransaction(id: string) {
    return request<{ success: boolean }>(`/savings/transactions/${id}`, { method: 'DELETE' });
  },

  // Dream Goals
  async createGoal(goal: any) {
    return request<{ success: boolean; goal: any }>('/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
  },

  async updateGoal(id: string, updates: any) {
    return request<{ success: boolean; goal: any }>(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteGoal(id: string) {
    return request<{ success: boolean }>(`/goals/${id}`, { method: 'DELETE' });
  },

  // Shopping Items (Smart Pantry)
  async addShoppingItem(item: any) {
    return request<{ success: boolean; item: any }>('/shopping', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  async updateShoppingItem(id: string, updates: any) {
    return request<{ success: boolean; item: any }>(`/shopping/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteShoppingItem(id: string) {
    return request<{ success: boolean }>(`/shopping/${id}`, { method: 'DELETE' });
  },

  // Bills
  async addBill(bill: any) {
    return request<{ success: boolean; bill: any }>('/bills', {
      method: 'POST',
      body: JSON.stringify(bill),
    });
  },

  async updateBill(id: string, updates: any) {
    return request<{ success: boolean; bill: any }>(`/bills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteBill(id: string) {
    return request<{ success: boolean }>(`/bills/${id}`, { method: 'DELETE' });
  },

  // Subscriptions
  async addSubscription(sub: any) {
    return request<{ success: boolean; subscription: any }>('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(sub),
    });
  },

  async updateSubscription(id: string, updates: any) {
    return request<{ success: boolean; subscription: any }>(`/subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteSubscription(id: string) {
    return request<{ success: boolean }>(`/subscriptions/${id}`, { method: 'DELETE' });
  },

  // Security test for unauthorized access
  async testOtherUserData(otherUserId: string) {
    return request<{ success: boolean; data?: any }>(`/users/${otherUserId}/data`);
  },
};

