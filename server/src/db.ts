// @ts-ignore
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

// Ensure database directory exists
const dbDir = path.resolve(process.cwd(), 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'salarysplit.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode & foreign keys for optimal performance and integrity
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  -- 1. Users table
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    monthly_income REAL NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  -- 2. Sessions table
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
  );

  -- 3. Budget Categories (Salary Split)
  CREATE TABLE IF NOT EXISTS budget_categories (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'Tag',
    color TEXT NOT NULL DEFAULT '#7557E8',
    type TEXT NOT NULL DEFAULT 'needs',
    allocated_amount REAL NOT NULL DEFAULT 0,
    allocated_percentage REAL NOT NULL DEFAULT 0,
    display_order INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  );

  -- 4. Expenses
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL,
    category_name TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'UPI',
    bill_id TEXT,
    created_at TEXT NOT NULL
  );

  -- 5. Savings Categories (My Savings individual categories)
  CREATE TABLE IF NOT EXISTS savings_categories (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'PiggyBank',
    color TEXT NOT NULL DEFAULT '#10B981',
    monthly_target REAL NOT NULL DEFAULT 0,
    target_amount REAL NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  -- 6. Savings Transactions (Monthly contributions per category)
  CREATE TABLE IF NOT EXISTS savings_transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    savings_category_id TEXT NOT NULL REFERENCES savings_categories(id) ON DELETE CASCADE,
    goal_id TEXT,
    amount REAL NOT NULL,
    month TEXT NOT NULL,
    date TEXT NOT NULL,
    note TEXT NOT NULL DEFAULT 'Monthly contribution',
    created_at TEXT NOT NULL
  );

  -- 7. Dream Goals
  CREATE TABLE IF NOT EXISTS dream_goals (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'house',
    target_amount REAL NOT NULL,
    current_balance REAL NOT NULL DEFAULT 0,
    monthly_target REAL NOT NULL DEFAULT 0,
    target_date TEXT,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL
  );

  -- 8. Smart Pantry Shopping Items
  CREATE TABLE IF NOT EXISTS shopping_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Produce',
    quantity REAL NOT NULL DEFAULT 1,
    unit TEXT NOT NULL DEFAULT 'Kg',
    estimated_price REAL NOT NULL DEFAULT 0,
    actual_price REAL,
    is_purchased INTEGER NOT NULL DEFAULT 0,
    purchased_date TEXT,
    created_at TEXT NOT NULL
  );

  -- 9. Bills
  CREATE TABLE IF NOT EXISTS bills (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    due_date TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Rent',
    is_auto_pay INTEGER NOT NULL DEFAULT 0,
    is_paid INTEGER NOT NULL DEFAULT 0,
    paid_date TEXT,
    created_at TEXT NOT NULL
  );

  -- 10. Subscriptions
  CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    cost REAL NOT NULL,
    billing_cycle TEXT NOT NULL DEFAULT 'monthly',
    renewal_date TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Entertainment',
    icon TEXT NOT NULL DEFAULT 'Tv',
    created_at TEXT NOT NULL
  );
`);

export interface DbUser {
  id: string;
  name: string;
  phone: string;
  currency: string;
  monthly_income: number;
  created_at: string;
}

// ----------------------------------------------------
// Authentication & Session Management
// ----------------------------------------------------

export function loginOrRegister(name: string, phone: string): { user: DbUser; token: string; isNewUser: boolean } {
  const cleanPhone = phone.trim().replace(/[\s-]/g, '');
  const cleanName = name.trim();

  const findUser = db.prepare('SELECT * FROM users WHERE phone = ?');
  let user = findUser.get(cleanPhone) as DbUser | undefined;
  let isNewUser = false;

  if (!user) {
    const userId = `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const insertUser = db.prepare(`
      INSERT INTO users (id, name, phone, currency, monthly_income, created_at)
      VALUES (?, ?, ?, 'INR', 0, ?)
    `);
    const now = new Date().toISOString();
    insertUser.run(userId, cleanName, cleanPhone, now);

    user = {
      id: userId,
      name: cleanName,
      phone: cleanPhone,
      currency: 'INR',
      monthly_income: 0,
      created_at: now,
    };
    isNewUser = true;
  } else if (cleanName && user.name !== cleanName) {
    // Update name if changed
    db.prepare('UPDATE users SET name = ? WHERE id = ?').run(cleanName, user.id);
    user.name = cleanName;
  }

  // Create session
  const token = `sess_${crypto.randomBytes(32).toString('hex')}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
  db.prepare(`
    INSERT INTO sessions (token, user_id, created_at, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(token, user.id, now.toISOString(), expiresAt);

  return { user, token, isNewUser };
}

export function getUserByToken(token: string): DbUser | null {
  if (!token) return null;
  const query = db.prepare(`
    SELECT u.* FROM users u
    JOIN sessions s ON u.id = s.user_id
    WHERE s.token = ? AND s.expires_at > ?
  `);
  const now = new Date().toISOString();
  const row = query.get(token, now) as DbUser | undefined;
  return row || null;
}

export function logoutSession(token: string): void {
  if (!token) return;
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
}

// ----------------------------------------------------
// User Data Queries (All enforce user_id isolation)
// ----------------------------------------------------

export function getUserFullData(userId: string) {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as DbUser | undefined;
  if (!user) return null;

  const categories = db.prepare('SELECT * FROM budget_categories WHERE user_id = ? ORDER BY display_order ASC, created_at ASC').all(userId);
  const expenses = db.prepare('SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC, created_at DESC').all(userId);
  const savingsCategories = db.prepare('SELECT * FROM savings_categories WHERE user_id = ? ORDER BY created_at ASC').all(userId);
  const savingsTransactions = db.prepare('SELECT * FROM savings_transactions WHERE user_id = ? ORDER BY date DESC, created_at DESC').all(userId);
  const goals = db.prepare('SELECT * FROM dream_goals WHERE user_id = ? ORDER BY created_at ASC').all(userId);
  const shoppingItems = db.prepare('SELECT * FROM shopping_items WHERE user_id = ? ORDER BY created_at ASC').all(userId);
  const bills = db.prepare('SELECT * FROM bills WHERE user_id = ? ORDER BY due_date ASC, created_at ASC').all(userId);
  const subscriptions = db.prepare('SELECT * FROM subscriptions WHERE user_id = ? ORDER BY renewal_date ASC, created_at ASC').all(userId);

  return {
    user,
    categories,
    expenses,
    savingsCategories,
    savingsTransactions,
    goals,
    shoppingItems,
    bills,
    subscriptions,
  };
}

// ----------------------------------------------------
// Income & Currency
// ----------------------------------------------------
export function updateIncome(userId: string, monthlyIncome: number, currency = 'INR'): void {
  db.prepare('UPDATE users SET monthly_income = ?, currency = ? WHERE id = ?').run(monthlyIncome, currency, userId);
}

// ----------------------------------------------------
// Budget Categories (Salary Split)
// ----------------------------------------------------
export function saveCategory(userId: string, category: {
  id?: string;
  name: string;
  icon?: string;
  color?: string;
  type?: string;
  allocated_amount?: number;
  allocated_percentage?: number;
  display_order?: number;
}) {
  const catId = category.id || `cat_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const now = new Date().toISOString();

  const existing = db.prepare('SELECT id FROM budget_categories WHERE id = ? AND user_id = ?').get(catId, userId);
  if (existing) {
    db.prepare(`
      UPDATE budget_categories
      SET name = ?, icon = ?, color = ?, type = ?, allocated_amount = ?, allocated_percentage = ?, display_order = ?
      WHERE id = ? AND user_id = ?
    `).run(
      category.name,
      category.icon || 'Tag',
      category.color || '#7557E8',
      category.type || 'needs',
      category.allocated_amount || 0,
      category.allocated_percentage || 0,
      category.display_order || 1,
      catId,
      userId
    );
  } else {
    db.prepare(`
      INSERT INTO budget_categories (id, user_id, name, icon, color, type, allocated_amount, allocated_percentage, display_order, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      catId,
      userId,
      category.name,
      category.icon || 'Tag',
      category.color || '#7557E8',
      category.type || 'needs',
      category.allocated_amount || 0,
      category.allocated_percentage || 0,
      category.display_order || 1,
      now
    );
  }
  return db.prepare('SELECT * FROM budget_categories WHERE id = ? AND user_id = ?').get(catId, userId);
}

export function deleteCategory(userId: string, categoryId: string): boolean {
  const res = db.prepare('DELETE FROM budget_categories WHERE id = ? AND user_id = ?').run(categoryId, userId);
  return res.changes > 0;
}

// ----------------------------------------------------
// Expenses
// ----------------------------------------------------
export function addExpense(userId: string, expense: {
  id?: string;
  category_id: string;
  category_name: string;
  amount: number;
  date: string;
  description: string;
  payment_method?: string;
  bill_id?: string;
}) {
  const expId = expense.id || `exp_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO expenses (id, user_id, category_id, category_name, amount, date, description, payment_method, bill_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    expId,
    userId,
    expense.category_id,
    expense.category_name,
    expense.amount,
    expense.date,
    expense.description,
    expense.payment_method || 'UPI',
    expense.bill_id || null,
    now
  );
  return db.prepare('SELECT * FROM expenses WHERE id = ? AND user_id = ?').get(expId, userId);
}

export function deleteExpense(userId: string, expenseId: string): boolean {
  const res = db.prepare('DELETE FROM expenses WHERE id = ? AND user_id = ?').run(expenseId, userId);
  return res.changes > 0;
}

// ----------------------------------------------------
// Savings Categories & Contributions (My Savings)
// ----------------------------------------------------
export function createSavingsCategory(userId: string, data: {
  id?: string;
  name: string;
  icon?: string;
  color?: string;
  monthly_target?: number;
  target_amount?: number;
}) {
  const catId = data.id || `sc_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO savings_categories (id, user_id, name, icon, color, monthly_target, target_amount, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    catId,
    userId,
    data.name,
    data.icon || 'PiggyBank',
    data.color || '#10B981',
    data.monthly_target || 0,
    data.target_amount || 0,
    now
  );
  return db.prepare('SELECT * FROM savings_categories WHERE id = ? AND user_id = ?').get(catId, userId);
}

export function updateSavingsCategory(userId: string, id: string, data: Partial<{
  name: string;
  icon: string;
  color: string;
  monthly_target: number;
  target_amount: number;
}>) {
  const existing = db.prepare('SELECT * FROM savings_categories WHERE id = ? AND user_id = ?').get(id, userId) as any;
  if (!existing) return null;

  db.prepare(`
    UPDATE savings_categories
    SET name = ?, icon = ?, color = ?, monthly_target = ?, target_amount = ?
    WHERE id = ? AND user_id = ?
  `).run(
    data.name !== undefined ? data.name : existing.name,
    data.icon !== undefined ? data.icon : existing.icon,
    data.color !== undefined ? data.color : existing.color,
    data.monthly_target !== undefined ? data.monthly_target : existing.monthly_target,
    data.target_amount !== undefined ? data.target_amount : existing.target_amount,
    id,
    userId
  );
  return db.prepare('SELECT * FROM savings_categories WHERE id = ? AND user_id = ?').get(id, userId);
}

export function deleteSavingsCategory(userId: string, id: string): boolean {
  const res = db.prepare('DELETE FROM savings_categories WHERE id = ? AND user_id = ?').run(id, userId);
  return res.changes > 0;
}

export function addSavingsTransaction(userId: string, tx: {
  id?: string;
  savings_category_id: string;
  goal_id?: string;
  amount: number;
  month: string;
  date: string;
  note?: string;
}) {
  const txId = tx.id || `stx_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const now = new Date().toISOString();

  // Verify savings category belongs to user
  const cat = db.prepare('SELECT id FROM savings_categories WHERE id = ? AND user_id = ?').get(tx.savings_category_id, userId);
  if (!cat) throw new Error('Savings category not found or unauthorized');

  db.prepare(`
    INSERT INTO savings_transactions (id, user_id, savings_category_id, goal_id, amount, month, date, note, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    txId,
    userId,
    tx.savings_category_id,
    tx.goal_id || null,
    tx.amount,
    tx.month,
    tx.date,
    tx.note || 'Monthly contribution',
    now
  );

  // If assigned to a dream goal, update the goal's current balance
  if (tx.goal_id) {
    db.prepare(`
      UPDATE dream_goals
      SET current_balance = current_balance + ?
      WHERE id = ? AND user_id = ?
    `).run(tx.amount, tx.goal_id, userId);
  }

  return db.prepare('SELECT * FROM savings_transactions WHERE id = ? AND user_id = ?').get(txId, userId);
}

export function deleteSavingsTransaction(userId: string, txId: string): boolean {
  const tx = db.prepare('SELECT * FROM savings_transactions WHERE id = ? AND user_id = ?').get(txId, userId) as any;
  if (!tx) return false;

  // If this transaction was assigned to a goal, reverse the goal balance
  if (tx.goal_id) {
    db.prepare(`
      UPDATE dream_goals
      SET current_balance = MAX(0, current_balance - ?)
      WHERE id = ? AND user_id = ?
    `).run(tx.amount, tx.goal_id, userId);
  }

  const res = db.prepare('DELETE FROM savings_transactions WHERE id = ? AND user_id = ?').run(txId, userId);
  return res.changes > 0;
}

// ----------------------------------------------------
// Dream Goals
// ----------------------------------------------------
export function createDreamGoal(userId: string, goal: {
  id?: string;
  name: string;
  category?: string;
  target_amount: number;
  monthly_target?: number;
  target_date?: string;
  description?: string;
}) {
  const goalId = goal.id || `goal_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO dream_goals (id, user_id, name, category, target_amount, current_balance, monthly_target, target_date, description, status, created_at)
    VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, 'active', ?)
  `).run(
    goalId,
    userId,
    goal.name,
    goal.category || 'house',
    goal.target_amount,
    goal.monthly_target || 0,
    goal.target_date || null,
    goal.description || '',
    now
  );
  return db.prepare('SELECT * FROM dream_goals WHERE id = ? AND user_id = ?').get(goalId, userId);
}

export function updateDreamGoal(userId: string, id: string, data: Partial<{
  name: string;
  category: string;
  target_amount: number;
  current_balance: number;
  monthly_target: number;
  target_date: string;
  description: string;
  status: string;
}>) {
  const existing = db.prepare('SELECT * FROM dream_goals WHERE id = ? AND user_id = ?').get(id, userId) as any;
  if (!existing) return null;

  db.prepare(`
    UPDATE dream_goals
    SET name = ?, category = ?, target_amount = ?, current_balance = ?, monthly_target = ?, target_date = ?, description = ?, status = ?
    WHERE id = ? AND user_id = ?
  `).run(
    data.name !== undefined ? data.name : existing.name,
    data.category !== undefined ? data.category : existing.category,
    data.target_amount !== undefined ? data.target_amount : existing.target_amount,
    data.current_balance !== undefined ? data.current_balance : existing.current_balance,
    data.monthly_target !== undefined ? data.monthly_target : existing.monthly_target,
    data.target_date !== undefined ? data.target_date : existing.target_date,
    data.description !== undefined ? data.description : existing.description,
    data.status !== undefined ? data.status : existing.status,
    id,
    userId
  );
  return db.prepare('SELECT * FROM dream_goals WHERE id = ? AND user_id = ?').get(id, userId);
}

export function deleteDreamGoal(userId: string, id: string): boolean {
  // Clear goal_id from any savings transactions referencing this goal
  db.prepare('UPDATE savings_transactions SET goal_id = NULL WHERE goal_id = ? AND user_id = ?').run(id, userId);
  const res = db.prepare('DELETE FROM dream_goals WHERE id = ? AND user_id = ?').run(id, userId);
  return res.changes > 0;
}

// ----------------------------------------------------
// Smart Pantry Shopping Items
// ----------------------------------------------------
export function addShoppingItem(userId: string, item: {
  id?: string;
  name: string;
  category?: string;
  quantity?: number;
  unit?: string;
  estimated_price?: number;
  actual_price?: number;
  is_purchased?: boolean;
}) {
  const itemId = item.id || `item_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO shopping_items (id, user_id, name, category, quantity, unit, estimated_price, actual_price, is_purchased, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    itemId,
    userId,
    item.name,
    item.category || 'Produce',
    item.quantity || 1,
    item.unit || 'Kg',
    item.estimated_price || 0,
    item.actual_price || null,
    item.is_purchased ? 1 : 0,
    now
  );
  return db.prepare('SELECT * FROM shopping_items WHERE id = ? AND user_id = ?').get(itemId, userId);
}

export function updateShoppingItem(userId: string, id: string, data: Partial<{
  name: string;
  category: string;
  quantity: number;
  unit: string;
  estimated_price: number;
  actual_price: number;
  is_purchased: boolean;
  purchased_date: string;
}>) {
  const existing = db.prepare('SELECT * FROM shopping_items WHERE id = ? AND user_id = ?').get(id, userId) as any;
  if (!existing) return null;

  db.prepare(`
    UPDATE shopping_items
    SET name = ?, category = ?, quantity = ?, unit = ?, estimated_price = ?, actual_price = ?, is_purchased = ?, purchased_date = ?
    WHERE id = ? AND user_id = ?
  `).run(
    data.name !== undefined ? data.name : existing.name,
    data.category !== undefined ? data.category : existing.category,
    data.quantity !== undefined ? data.quantity : existing.quantity,
    data.unit !== undefined ? data.unit : existing.unit,
    data.estimated_price !== undefined ? data.estimated_price : existing.estimated_price,
    data.actual_price !== undefined ? data.actual_price : existing.actual_price,
    data.is_purchased !== undefined ? (data.is_purchased ? 1 : 0) : existing.is_purchased,
    data.purchased_date !== undefined ? data.purchased_date : existing.purchased_date,
    id,
    userId
  );
  return db.prepare('SELECT * FROM shopping_items WHERE id = ? AND user_id = ?').get(id, userId);
}

export function deleteShoppingItem(userId: string, id: string): boolean {
  const res = db.prepare('DELETE FROM shopping_items WHERE id = ? AND user_id = ?').run(id, userId);
  return res.changes > 0;
}

// ----------------------------------------------------
// Bills & Subscriptions
// ----------------------------------------------------
export function addBill(userId: string, bill: {
  id?: string;
  title: string;
  amount: number;
  due_date: string;
  category?: string;
  is_auto_pay?: boolean;
  is_paid?: boolean;
}) {
  const billId = bill.id || `bill_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO bills (id, user_id, title, amount, due_date, category, is_auto_pay, is_paid, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    billId,
    userId,
    bill.title,
    bill.amount,
    bill.due_date,
    bill.category || 'Rent',
    bill.is_auto_pay ? 1 : 0,
    bill.is_paid ? 1 : 0,
    now
  );
  return db.prepare('SELECT * FROM bills WHERE id = ? AND user_id = ?').get(billId, userId);
}

export function updateBill(userId: string, id: string, data: Partial<{
  title: string;
  amount: number;
  due_date: string;
  category: string;
  is_auto_pay: boolean;
  is_paid: boolean;
  paid_date: string;
}>) {
  const existing = db.prepare('SELECT * FROM bills WHERE id = ? AND user_id = ?').get(id, userId) as any;
  if (!existing) return null;

  db.prepare(`
    UPDATE bills
    SET title = ?, amount = ?, due_date = ?, category = ?, is_auto_pay = ?, is_paid = ?, paid_date = ?
    WHERE id = ? AND user_id = ?
  `).run(
    data.title !== undefined ? data.title : existing.title,
    data.amount !== undefined ? data.amount : existing.amount,
    data.due_date !== undefined ? data.due_date : existing.due_date,
    data.category !== undefined ? data.category : existing.category,
    data.is_auto_pay !== undefined ? (data.is_auto_pay ? 1 : 0) : existing.is_auto_pay,
    data.is_paid !== undefined ? (data.is_paid ? 1 : 0) : existing.is_paid,
    data.paid_date !== undefined ? data.paid_date : existing.paid_date,
    id,
    userId
  );
  return db.prepare('SELECT * FROM bills WHERE id = ? AND user_id = ?').get(id, userId);
}

export function deleteBill(userId: string, id: string): boolean {
  const res = db.prepare('DELETE FROM bills WHERE id = ? AND user_id = ?').run(id, userId);
  return res.changes > 0;
}

export function addSubscription(userId: string, sub: {
  id?: string;
  name: string;
  cost: number;
  billing_cycle?: string;
  renewal_date: string;
  category?: string;
  icon?: string;
}) {
  const subId = sub.id || `sub_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO subscriptions (id, user_id, name, cost, billing_cycle, renewal_date, category, icon, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    subId,
    userId,
    sub.name,
    sub.cost,
    sub.billing_cycle || 'monthly',
    sub.renewal_date,
    sub.category || 'Entertainment',
    sub.icon || 'Tv',
    now
  );
  return db.prepare('SELECT * FROM subscriptions WHERE id = ? AND user_id = ?').get(subId, userId);
}

export function updateSubscription(userId: string, id: string, data: Partial<{
  name: string;
  cost: number;
  billing_cycle: string;
  renewal_date: string;
  category: string;
  icon: string;
}>) {
  const existing = db.prepare('SELECT * FROM subscriptions WHERE id = ? AND user_id = ?').get(id, userId) as any;
  if (!existing) return null;

  db.prepare(`
    UPDATE subscriptions
    SET name = ?, cost = ?, billing_cycle = ?, renewal_date = ?, category = ?, icon = ?
    WHERE id = ? AND user_id = ?
  `).run(
    data.name !== undefined ? data.name : existing.name,
    data.cost !== undefined ? data.cost : existing.cost,
    data.billing_cycle !== undefined ? data.billing_cycle : existing.billing_cycle,
    data.renewal_date !== undefined ? data.renewal_date : existing.renewal_date,
    data.category !== undefined ? data.category : existing.category,
    data.icon !== undefined ? data.icon : existing.icon,
    id,
    userId
  );
  return db.prepare('SELECT * FROM subscriptions WHERE id = ? AND user_id = ?').get(id, userId);
}

export function deleteSubscription(userId: string, id: string): boolean {
  const res = db.prepare('DELETE FROM subscriptions WHERE id = ? AND user_id = ?').run(id, userId);
  return res.changes > 0;
}
