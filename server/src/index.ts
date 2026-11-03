import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  loginOrRegister,
  getUserByToken,
  logoutSession,
  getUserFullData,
  updateIncome,
  saveCategory,
  deleteCategory,
  addExpense,
  deleteExpense,
  createSavingsCategory,
  updateSavingsCategory,
  deleteSavingsCategory,
  addSavingsTransaction,
  deleteSavingsTransaction,
  createDreamGoal,
  updateDreamGoal,
  deleteDreamGoal,
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
  addBill,
  updateBill,
  deleteBill,
  addSubscription,
  updateSubscription,
  deleteSubscription,
  DbUser,
} from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../../dist');

export const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static frontend build if dist folder exists
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Extend express Request to hold authenticated user
export interface AuthenticatedRequest extends Request {
  user?: DbUser;
}

// ----------------------------------------------------
// Authentication Middleware
// ----------------------------------------------------
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Unauthorized: Missing session token' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const user = getUserByToken(token);
  if (!user) {
    res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired session' });
    return;
  }
  req.user = user;
  next();
}

// ----------------------------------------------------
// Public Endpoints
// ----------------------------------------------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SalarySplit API Backend',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Login / Register (Name + Phone only, no OTP/password needed)
app.post('/api/auth/login', (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) {
    res.status(400).json({ success: false, error: 'Name and Phone Number are required' });
    return;
  }
  try {
    const { user, token, isNewUser } = loginOrRegister(name, phone);
    const data = getUserFullData(user.id);
    res.json({
      success: true,
      token,
      user,
      isNewUser,
      data,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Login failed' });
  }
});

// ----------------------------------------------------
// Protected Endpoints (Requires valid Bearer token)
// ----------------------------------------------------

// Verify Session / Get Current User & Data
app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const data = getUserFullData(user.id);
  res.json({
    success: true,
    user,
    data,
  });
});

// Logout
app.post('/api/auth/logout', requireAuth, (req: AuthenticatedRequest, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1] || '';
  logoutSession(token);
  res.json({ success: true, message: 'Logged out successfully' });
});

// Full User Data
app.get('/api/data', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const data = getUserFullData(user.id);
  res.json({ success: true, data });
});

// Update Monthly Income
app.post('/api/income', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { monthlyIncome, currency } = req.body;
  if (monthlyIncome === undefined || isNaN(Number(monthlyIncome))) {
    res.status(400).json({ success: false, error: 'Valid monthlyIncome is required' });
    return;
  }
  updateIncome(user.id, Number(monthlyIncome), currency || user.currency);
  res.json({ success: true, monthlyIncome: Number(monthlyIncome) });
});

// Budget Categories (Salary Split)
app.post('/api/categories', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const category = req.body;
  if (!category.name) {
    res.status(400).json({ success: false, error: 'Category name is required' });
    return;
  }
  const saved = saveCategory(user.id, category);
  res.json({ success: true, category: saved });
});

app.delete('/api/categories/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const success = deleteCategory(user.id, req.params.id);
  res.json({ success });
});

// Expenses
app.post('/api/expenses', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const expense = req.body;
  if (!expense.amount || !expense.description) {
    res.status(400).json({ success: false, error: 'Amount and description are required' });
    return;
  }
  const saved = addExpense(user.id, expense);
  res.json({ success: true, expense: saved });
});

app.delete('/api/expenses/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const success = deleteExpense(user.id, req.params.id);
  res.json({ success });
});

// Savings Categories (My Savings)
app.post('/api/savings/categories', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { name, icon, color, monthly_target, target_amount } = req.body;
  if (!name) {
    res.status(400).json({ success: false, error: 'Category name is required' });
    return;
  }
  const cat = createSavingsCategory(user.id, { name, icon, color, monthly_target, target_amount });
  res.json({ success: true, category: cat });
});

app.put('/api/savings/categories/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const updated = updateSavingsCategory(user.id, req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Category not found or unauthorized' });
    return;
  }
  res.json({ success: true, category: updated });
});

app.delete('/api/savings/categories/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const success = deleteSavingsCategory(user.id, req.params.id);
  res.json({ success });
});

// Savings Transactions (Actual contributions)
app.post('/api/savings/transactions', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { savings_category_id, goal_id, amount, month, date, note } = req.body;
  if (!savings_category_id || !amount || !month) {
    res.status(400).json({ success: false, error: 'Savings category ID, amount, and month are required' });
    return;
  }
  try {
    const tx = addSavingsTransaction(user.id, {
      savings_category_id,
      goal_id,
      amount: Number(amount),
      month,
      date: date || new Date().toISOString().split('T')[0],
      note,
    });
    res.json({ success: true, transaction: tx });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/savings/transactions/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const success = deleteSavingsTransaction(user.id, req.params.id);
  res.json({ success });
});

// Dream Goals
app.post('/api/goals', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const goal = req.body;
  if (!goal.name || !goal.target_amount) {
    res.status(400).json({ success: false, error: 'Goal name and target amount are required' });
    return;
  }
  const created = createDreamGoal(user.id, goal);
  res.json({ success: true, goal: created });
});

app.put('/api/goals/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const updated = updateDreamGoal(user.id, req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Goal not found or unauthorized' });
    return;
  }
  res.json({ success: true, goal: updated });
});

app.delete('/api/goals/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const success = deleteDreamGoal(user.id, req.params.id);
  res.json({ success });
});

// Shopping Items (Smart Pantry)
app.post('/api/shopping', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const item = req.body;
  if (!item.name) {
    res.status(400).json({ success: false, error: 'Item name is required' });
    return;
  }
  const created = addShoppingItem(user.id, item);
  res.json({ success: true, item: created });
});

app.put('/api/shopping/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const updated = updateShoppingItem(user.id, req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Item not found or unauthorized' });
    return;
  }
  res.json({ success: true, item: updated });
});

app.delete('/api/shopping/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const success = deleteShoppingItem(user.id, req.params.id);
  res.json({ success });
});

// Bills
app.post('/api/bills', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const bill = req.body;
  if (!bill.title || !bill.amount) {
    res.status(400).json({ success: false, error: 'Bill title and amount are required' });
    return;
  }
  const created = addBill(user.id, bill);
  res.json({ success: true, bill: created });
});

app.put('/api/bills/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const updated = updateBill(user.id, req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Bill not found or unauthorized' });
    return;
  }
  res.json({ success: true, bill: updated });
});

app.delete('/api/bills/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const success = deleteBill(user.id, req.params.id);
  res.json({ success });
});

// Subscriptions
app.post('/api/subscriptions', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const sub = req.body;
  if (!sub.name || !sub.cost) {
    res.status(400).json({ success: false, error: 'Subscription name and cost are required' });
    return;
  }
  const created = addSubscription(user.id, sub);
  res.json({ success: true, subscription: created });
});

app.put('/api/subscriptions/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const updated = updateSubscription(user.id, req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Subscription not found or unauthorized' });
    return;
  }
  res.json({ success: true, subscription: updated });
});

app.delete('/api/subscriptions/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const success = deleteSubscription(user.id, req.params.id);
  res.json({ success });
});

// Security Test Endpoint: Attempting to access another user's data
app.get('/api/users/:targetUserId/data', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  if (req.params.targetUserId !== user.id) {
    res.status(403).json({ success: false, error: 'Forbidden: Access to another user data is denied at the database level' });
    return;
  }
  const data = getUserFullData(user.id);
  res.json({ success: true, data });
});

// Fallback for SPA client routing (serve index.html for non-API routes)
if (fs.existsSync(distPath)) {
  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Express server if run standalone
if (process.env.NODE_ENV !== 'test' && !process.env.VITE_EMBEDDED) {
  app.listen(PORT, () => {
    console.log(`SalarySplit Backend Server running on port ${PORT}`);
  });
}
