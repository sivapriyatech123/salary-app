import type { Plugin, ViteDevServer } from 'vite';
import { IncomingMessage, ServerResponse } from 'node:http';
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
} from './server/src/db.ts';

function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res: ServerResponse, status: number, data: any) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  });
  res.end(JSON.stringify(data));
}

export function apiDevPlugin(): Plugin {
  return {
    name: 'salarysplit-api-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        const method = req.method || 'GET';

        // Only intercept /api routes
        if (!url.startsWith('/api')) {
          return next();
        }

        // Handle CORS preflight
        if (method === 'OPTIONS') {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          });
          res.end();
          return;
        }

        const pathName = url.split('?')[0];

        // 1. Public Health Check
        if (pathName === '/api/health' && method === 'GET') {
          return sendJson(res, 200, {
            status: 'ok',
            service: 'SalarySplit API Backend (Embedded Vite)',
            version: '2.0.0',
            timestamp: new Date().toISOString(),
          });
        }

        // 2. Public Login / Register
        if (pathName === '/api/auth/login' && method === 'POST') {
          const body = await parseBody(req);
          const { name, phone } = body;
          if (!name || !phone) {
            return sendJson(res, 400, { success: false, error: 'Name and Phone Number are required' });
          }
          try {
            const { user, token, isNewUser } = loginOrRegister(name, phone);
            const data = getUserFullData(user.id);
            return sendJson(res, 200, {
              success: true,
              token,
              user,
              isNewUser,
              data,
            });
          } catch (err: any) {
            return sendJson(res, 500, { success: false, error: err.message || 'Login failed' });
          }
        }

        // All subsequent endpoints require Bearer authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return sendJson(res, 401, { success: false, error: 'Unauthorized: Missing session token' });
        }

        const token = authHeader.split(' ')[1];
        const user = getUserByToken(token);
        if (!user) {
          return sendJson(res, 401, { success: false, error: 'Unauthorized: Invalid or expired session' });
        }

        // 3. Current User Session Check
        if (pathName === '/api/auth/me' && method === 'GET') {
          const data = getUserFullData(user.id);
          return sendJson(res, 200, { success: true, user, data });
        }

        // 4. Logout
        if (pathName === '/api/auth/logout' && method === 'POST') {
          logoutSession(token);
          return sendJson(res, 200, { success: true, message: 'Logged out successfully' });
        }

        // 5. Full Data
        if (pathName === '/api/data' && method === 'GET') {
          const data = getUserFullData(user.id);
          return sendJson(res, 200, { success: true, data });
        }

        // 6. Monthly Income Update
        if (pathName === '/api/income' && method === 'POST') {
          const body = await parseBody(req);
          const { monthlyIncome, currency } = body;
          updateIncome(user.id, Number(monthlyIncome), currency || user.currency);
          return sendJson(res, 200, { success: true, monthlyIncome: Number(monthlyIncome) });
        }

        // 7. Budget Categories (Salary Split)
        if (pathName === '/api/categories' && method === 'POST') {
          const body = await parseBody(req);
          if (!body.name) {
            return sendJson(res, 400, { success: false, error: 'Category name is required' });
          }
          const saved = saveCategory(user.id, body);
          return sendJson(res, 200, { success: true, category: saved });
        }

        if (pathName.startsWith('/api/categories/') && method === 'DELETE') {
          const catId = pathName.replace('/api/categories/', '');
          const success = deleteCategory(user.id, catId);
          return sendJson(res, 200, { success });
        }

        // 8. Expenses
        if (pathName === '/api/expenses' && method === 'POST') {
          const body = await parseBody(req);
          if (!body.amount || !body.description) {
            return sendJson(res, 400, { success: false, error: 'Amount and description are required' });
          }
          const saved = addExpense(user.id, body);
          return sendJson(res, 200, { success: true, expense: saved });
        }

        if (pathName.startsWith('/api/expenses/') && method === 'DELETE') {
          const expId = pathName.replace('/api/expenses/', '');
          const success = deleteExpense(user.id, expId);
          return sendJson(res, 200, { success });
        }

        // 9. Savings Categories (My Savings)
        if (pathName === '/api/savings/categories' && method === 'POST') {
          const body = await parseBody(req);
          if (!body.name) {
            return sendJson(res, 400, { success: false, error: 'Category name is required' });
          }
          const cat = createSavingsCategory(user.id, body);
          return sendJson(res, 200, { success: true, category: cat });
        }

        if (pathName.startsWith('/api/savings/categories/') && method === 'PUT') {
          const catId = pathName.replace('/api/savings/categories/', '');
          const body = await parseBody(req);
          const updated = updateSavingsCategory(user.id, catId, body);
          if (!updated) {
            return sendJson(res, 404, { success: false, error: 'Category not found or unauthorized' });
          }
          return sendJson(res, 200, { success: true, category: updated });
        }

        if (pathName.startsWith('/api/savings/categories/') && method === 'DELETE') {
          const catId = pathName.replace('/api/savings/categories/', '');
          const success = deleteSavingsCategory(user.id, catId);
          return sendJson(res, 200, { success });
        }

        // 10. Savings Transactions (Actual Monthly Contributions)
        if (pathName === '/api/savings/transactions' && method === 'POST') {
          const body = await parseBody(req);
          const { savings_category_id, goal_id, amount, month, date, note } = body;
          if (!savings_category_id || !amount || !month) {
            return sendJson(res, 400, { success: false, error: 'Savings category ID, amount, and month are required' });
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
            return sendJson(res, 200, { success: true, transaction: tx });
          } catch (err: any) {
            return sendJson(res, 400, { success: false, error: err.message });
          }
        }

        if (pathName.startsWith('/api/savings/transactions/') && method === 'DELETE') {
          const txId = pathName.replace('/api/savings/transactions/', '');
          const success = deleteSavingsTransaction(user.id, txId);
          return sendJson(res, 200, { success });
        }

        // 11. Dream Goals
        if (pathName === '/api/goals' && method === 'POST') {
          const body = await parseBody(req);
          if (!body.name || !body.target_amount) {
            return sendJson(res, 400, { success: false, error: 'Goal name and target amount are required' });
          }
          const goal = createDreamGoal(user.id, body);
          return sendJson(res, 200, { success: true, goal });
        }

        if (pathName.startsWith('/api/goals/') && method === 'PUT') {
          const goalId = pathName.replace('/api/goals/', '');
          const body = await parseBody(req);
          const updated = updateDreamGoal(user.id, goalId, body);
          if (!updated) {
            return sendJson(res, 404, { success: false, error: 'Goal not found or unauthorized' });
          }
          return sendJson(res, 200, { success: true, goal: updated });
        }

        if (pathName.startsWith('/api/goals/') && method === 'DELETE') {
          const goalId = pathName.replace('/api/goals/', '');
          const success = deleteDreamGoal(user.id, goalId);
          return sendJson(res, 200, { success });
        }

        // 12. Smart Pantry Shopping Items
        if (pathName === '/api/shopping' && method === 'POST') {
          const body = await parseBody(req);
          if (!body.name) {
            return sendJson(res, 400, { success: false, error: 'Item name is required' });
          }
          const item = addShoppingItem(user.id, body);
          return sendJson(res, 200, { success: true, item });
        }

        if (pathName.startsWith('/api/shopping/') && method === 'PUT') {
          const itemId = pathName.replace('/api/shopping/', '');
          const body = await parseBody(req);
          const updated = updateShoppingItem(user.id, itemId, body);
          if (!updated) {
            return sendJson(res, 404, { success: false, error: 'Item not found or unauthorized' });
          }
          return sendJson(res, 200, { success: true, item: updated });
        }

        if (pathName.startsWith('/api/shopping/') && method === 'DELETE') {
          const itemId = pathName.replace('/api/shopping/', '');
          const success = deleteShoppingItem(user.id, itemId);
          return sendJson(res, 200, { success });
        }

        // 13. Bills
        if (pathName === '/api/bills' && method === 'POST') {
          const body = await parseBody(req);
          if (!body.title || !body.amount) {
            return sendJson(res, 400, { success: false, error: 'Bill title and amount are required' });
          }
          const bill = addBill(user.id, body);
          return sendJson(res, 200, { success: true, bill });
        }

        if (pathName.startsWith('/api/bills/') && method === 'PUT') {
          const billId = pathName.replace('/api/bills/', '');
          const body = await parseBody(req);
          const updated = updateBill(user.id, billId, body);
          if (!updated) {
            return sendJson(res, 404, { success: false, error: 'Bill not found or unauthorized' });
          }
          return sendJson(res, 200, { success: true, bill: updated });
        }

        if (pathName.startsWith('/api/bills/') && method === 'DELETE') {
          const billId = pathName.replace('/api/bills/', '');
          const success = deleteBill(user.id, billId);
          return sendJson(res, 200, { success });
        }

        // 14. Subscriptions
        if (pathName === '/api/subscriptions' && method === 'POST') {
          const body = await parseBody(req);
          if (!body.name || !body.cost) {
            return sendJson(res, 400, { success: false, error: 'Subscription name and cost are required' });
          }
          const sub = addSubscription(user.id, body);
          return sendJson(res, 200, { success: true, subscription: sub });
        }

        if (pathName.startsWith('/api/subscriptions/') && method === 'PUT') {
          const subId = pathName.replace('/api/subscriptions/', '');
          const body = await parseBody(req);
          const updated = updateSubscription(user.id, subId, body);
          if (!updated) {
            return sendJson(res, 404, { success: false, error: 'Subscription not found or unauthorized' });
          }
          return sendJson(res, 200, { success: true, subscription: updated });
        }

        if (pathName.startsWith('/api/subscriptions/') && method === 'DELETE') {
          const subId = pathName.replace('/api/subscriptions/', '');
          const success = deleteSubscription(user.id, subId);
          return sendJson(res, 200, { success });
        }

        // 15. Security Authorization Test: Accessing other user data
        if (pathName.startsWith('/api/users/') && pathName.endsWith('/data') && method === 'GET') {
          const targetUserId = pathName.replace('/api/users/', '').replace('/data', '');
          if (targetUserId !== user.id) {
            return sendJson(res, 403, {
              success: false,
              error: 'Forbidden: Access to another user data is denied at the database level',
            });
          }
          const data = getUserFullData(user.id);
          return sendJson(res, 200, { success: true, data });
        }

        // Unmatched API endpoint
        return sendJson(res, 404, { success: false, error: 'API endpoint not found' });
      });
    },
  };
}
